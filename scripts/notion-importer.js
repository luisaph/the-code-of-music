/*
  Script for importing notion data and converting to markdown files 
  Modified from https://github.com/43-stuti/notion-github/blob/main/src/action.js
*/

const { Client } = require('@notionhq/client');
const axios = require('axios');
const fs = require('fs');

let notion;
let contentArray = [];

const { NOTION_TOKEN } = process.env;

const BLOCK_NAME = 'Book';
const DESTINATION_FOLDER = 'src/notion-docs/';
const IMAGE_FOLDER = 'src/notion-docs/images/';
const CODE_BLOCK_SYMBOL = '``';

let imageIndex = 0;

async function importNotionPages() {
  try {
    let { results } = await notion.search({
      query: BLOCK_NAME,
    });

    if (!results || !results.length) {
      console.log('No data found for block:', BLOCK_NAME);
      return;
    }

    console.log(`Deleting ${DESTINATION_FOLDER}`);
    fs.rmdirSync(DESTINATION_FOLDER, { recursive: true });

    console.log(`Creating ${DESTINATION_FOLDER}`);
    fs.mkdirSync(DESTINATION_FOLDER, {});

    console.log(`Deleting ${IMAGE_FOLDER}`);
    fs.rmdirSync(IMAGE_FOLDER, { recursive: true });

    console.log(`Creating ${IMAGE_FOLDER}`);
    fs.mkdirSync(IMAGE_FOLDER, {});

    /* Fill contentArray with page data */
    const blockId = results[0].id;
    await getPages(blockId, BLOCK_NAME, '');

    /* Write files */
    contentArray.forEach((page) => {
      const { path, title, pageString, isParentPage } = page;
      const filePath = `${DESTINATION_FOLDER}${path.toLowerCase()}`;

      console.log('Creating directory', filePath);
      fs.mkdirSync(filePath, { recursive: true }, () => {});

      if (!isParentPage) {
        const fileContents = pageString.toString('base64');
        const fileName = `${title.toLowerCase()}.md`;
        console.log('Creating file', fileName);
        fs.writeFileSync(`${filePath}${fileName}`, fileContents);
      }
    });
  } catch (error) {
    throw error;
  }
}

async function downloadImage(url, fileName) {
  console.log('downloading image', url);

  const { data } = await axios
    .get(url, {
      responseType: 'arraybuffer',
    })
    .catch((e) => {
      console.log('Error fetching image');
      console.log(e);
    });

  const imageFile = Buffer.from(data, 'binary');

  console.log('Writing file', fileName);
  fs.writeFileSync(`${IMAGE_FOLDER}${fileName}`, imageFile);
}

/* Converts text array to markdown */
/* TODO: support bold, italic etc */
function textToMd(text) {
  return text
    .map((t) => {
      if (t.href) {
        return `[${t.plain_text}](${t.href})`;
      }
      return t.plain_text;
    })
    .join('');
}

/* 
  https://developers.notion.com/reference/block#block-object-keys

  POSSIBLE TYPES
    "paragraph", "heading_1", "heading_2", "heading_3", "bulleted_list_item",
    "numbered_list_item", "to_do", "toggle", "child_page", "embed", "image",
    "video", "file", "pdf", "bookmark" and "unsupported".

  NOTE: DOES NOT SUPPORT CODE BLOCKS... :(
*/
async function blockToMd(block, chapterTitle) {
  const { type } = block;
  const { text } = block[type];

  if (type === 'heading_1') {
    return `# ${textToMd(text)}\n`;
  }

  if (type === 'heading_2') {
    return `## ${textToMd(text)}\n`;
  }

  if (type === 'heading_3') {
    return `### ${textToMd(text)}\n`;
  }

  if (type === 'heading_4') {
    return `#### ${textToMd(text)}\n`;
  }

  if (type === 'heading_5') {
    return `##### ${textToMd(text)}\n`;
  }

  if (type === 'heading_6') {
    return `###### ${textToMd(text)}\n`;
  }

  if (type === 'bulleted_list_item') {
    return `* ${textToMd(text)}\n`;
  }

  if (type === 'paragraph') {
    /* NOTE: HACK!!! -- this allows us to render code blocks by replacing `` in the source with ``` in markdown */
    let rendered = textToMd(text);
    if (rendered === CODE_BLOCK_SYMBOL) {
      return '```\n';
    } else {
      if (rendered.includes(CODE_BLOCK_SYMBOL)) {
        rendered = rendered.replace(CODE_BLOCK_SYMBOL, '```');
      }
    }
    return `${rendered}\n\n`;
  }

  if (type === 'embed') {
    const { url } = block[type];
    /* TODO: extract embed name and add P5 tag: {% P5 <path> %} */
    // return `Embed: ${url}\n\n`;

    /* Example iframe usage */
    // return `<iframe src="${url}"></iframe>\n\n`;

    return '';
  }

  if (type === 'image') {
    const {
      file: { url },
      caption,
    } = block[type];

    const fileName = `${chapterTitle}-${imageIndex}.png`;
    await downloadImage(url, fileName);

    imageIndex++;

    const captionText =
      caption && caption.length > 0 ? `_${textToMd(caption).trim()}_` : '';

    return `\n<figure>\n\n![${fileName}](${fileName})\n${captionText}\n\n</figure><br>\n\n`;
  }

  console.log('UNKNOWN BLOCK');
  console.log(block);
  // return '[unknown block]\n\n';
  return '';
}

async function getPages(id, name, parentPath) {
  let { results: blocks } = await notion.blocks.children.list({
    block_id: id,
  });

  /* "Parent" page that only contains child pages */
  const hasOnlyChildPages =
    blocks.filter(({ type }) => type === 'child_page').length === blocks.length;

  if (!blocks || blocks.length <= 0) {
    return;
  }

  /* Does not add header for index page */
  let pageString = name === 'index' ? '' : `# ${name}\n`;

  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    if (block.type == 'child_page') {
      /* Recursive call */
      await getPages(
        block.id,
        block[block.type].title,
        parentPath + (name === BLOCK_NAME ? '' : `${name}/`)
      );
    } else {
      let blockMardkwon = await blockToMd(block, name);
      pageString += blockMardkwon;
    }
  }

  contentArray.push({
    pageString,
    path: parentPath,
    title: name,
    isParentPage: hasOnlyChildPages,
  });
}

async function onStart() {
  notion = new Client({ auth: NOTION_TOKEN });
  await importNotionPages();
}

onStart();
