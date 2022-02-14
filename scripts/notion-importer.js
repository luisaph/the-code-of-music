/*
  Script for importing notion data and converting to markdown files 
  Modified from https://github.com/43-stuti/notion-github/blob/main/src/action.js
*/

const { Client } = require('@notionhq/client');
const axios = require('axios');
const fs = require('fs');

const { NOTION_TOKEN } = process.env;

const DESTINATION_FOLDER = 'src/notion-docs/';
const IMAGE_FOLDER = 'src/notion-docs/images/';
const DB_ID = 'c36f6b93fcd74dfaa4a7853d87b93bbb';
const LOCAL_EMBED_DOMAIN_NAME = 'codeofmusic-16a81.web.app';

let notion = new Client({ auth: NOTION_TOKEN });
let imageIndex = 0;

async function importNotionPages() {
  try {
    /* Get published pages */
    /* TODO: show draft pages if not production? */
    let { results: pages } = await notion.databases.query({
      database_id: DB_ID,
      filter: {
        property: 'Status',
        multi_select: {
          contains: 'Published',
        },
      },
    });

    console.log(`Deleting ${DESTINATION_FOLDER}`);
    fs.rmdirSync(DESTINATION_FOLDER, { recursive: true });

    console.log(`Creating ${DESTINATION_FOLDER}`);
    fs.mkdirSync(DESTINATION_FOLDER, {});

    console.log(`Creating ${IMAGE_FOLDER}`);
    fs.mkdirSync(IMAGE_FOLDER, {});

    pages.forEach(async (page) => {
      const { path, title, pageString } = await pageToMd(page);
      const filePath = `${DESTINATION_FOLDER}${path.toLowerCase()}`;

      console.log('Creating directory', filePath);
      fs.mkdirSync(filePath, { recursive: true }, () => {});

      const fileContents = pageString.toString('base64');
      const fileName = `${title.toLowerCase()}.md`;
      console.log('Creating file', fileName);
      fs.writeFileSync(`${filePath}/${fileName}`, fileContents);
    });
  } catch (error) {
    throw error;
  }
}

async function downloadImage(url, fileName) {
  // console.log('downloading image', url);

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
    return `${textToMd(text)}\n\n`;
  }

  if (type === 'embed') {
    const { url } = block[type];

    /* Check URL to see if it's our own local example */
    const isLocalExampleUrl = url.includes(LOCAL_EMBED_DOMAIN_NAME);

    /* Create custom p5 tag for local examples */
    if (isLocalExampleUrl) {
      const examplePath = url.split('examples/')[1];
      return `{% p5 ${examplePath} %}\n\n`;
    }

    /* Otherwise create iframe */
    return `<iframe src="${url}"></iframe>\n\n`;
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

  if (type === 'code') {
    return `\`\`\`${block.code.language}\n${textToMd(
      block.code.text
    )}\n\`\`\`\n\n`;
  }

  console.log('UNKNOWN BLOCK');
  console.log(block);
  // return '[unknown block]\n\n';
  return '';
}

async function pageContentToMd(blocks, pageTitle) {
  let result = '';
  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    result += await blockToMd(block, pageTitle);
  }
  return result;
}

async function pageToMd(page) {
  const { id, properties } = page;
  const pageTitle = properties['Name'].title[0].plain_text;
  const pageType = properties['Page Type'].multi_select[0].name;
  const templateField = properties['Template'].multi_select;
  const templateName = templateField[0] && templateField[0].name;

  const isLandingPage = pageType === 'Landing Page';

  /* Special case for the landing page -- name it index and put it in the top-level directory */
  const pagePath = isLandingPage ? '' : 'chapters';
  const fileName = isLandingPage ? 'index' : pageTitle;

  let { results: blocks } = await notion.blocks.children.list({
    block_id: id,
  });

  /* Create page Frontmatter -- https://github.com/magicbookproject/magicbook#yaml-frontmatter */
  const frontMatter = {
    title: pageTitle,
  };

  /* TODO: add custom template -- this seems to break the PDF build though, so might not be worth it */

  // if (templateName) {
  //   frontMatter.layout = `src/layouts/${templateName}`;
  // }

  let frontMatterString = '';
  Object.keys(frontMatter).forEach((key) => {
    const val = frontMatter[key];
    if (!val) return;
    frontMatterString += `${key}: ${val}\n`;
  });

  let pageString = `
  ---
  ${frontMatterString}
  ---
  `;

  /* Add H1 Header for non-landing pages */
  if (!isLandingPage) {
    pageString += `# ${pageTitle}\n`;
  }

  const pageContentMarkdown = await pageContentToMd(blocks, pageTitle);
  pageString += pageContentMarkdown;

  return {
    pageString,
    path: pagePath,
    title: fileName,
  };
}

async function onStart() {
  await importNotionPages();
}

onStart();
