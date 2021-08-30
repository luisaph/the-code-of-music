# The Code of Music (magicbook)

Web: https://codeofmusic-16a81.web.app/

PDF: https://codeofmusic-16a81.web.app/the-code-of-music.pdf

The Code of Music is an interactive book that teaches the fundamentals of music theory through code that is available in website or PDF format. It uses [magicbook](https://github.com/magicbookproject/magicbook) and is takes inspiration and architecture from Rune Madsen's [Programming Design Systems](https://github.com/runemadsen/programmingdesignsystems.com) book.

## Setup

0. Install [nvm](https://github.com/nvm-sh/nvm) and [Yarn](https://yarnpkg.com/)
1. `nvm install; nvm use;` to install and activate the correct Node version.
2. Install [Prince](https://www.princexml.com/) on your computer (`brew install prince` for Macs). In theory we shouldn't have to do this but there is an error while installing Prince as part of the `magicbook` installation.
3. `yarn install` to install the node modules

## Development

1. Run `yarn dev` -- this will build the magicbook files and watch for changes
2. In a new tab run `yarn serve` -- this will start a [`live-server`](https://github.com/tapio/live-server) at localhost:5000 and auto refresh when the magic build finishes
3. Open http://localhost:5000/

## Writing in Notion

#### Code Blocks

There are some quirks with converting notion to markdown because the [official API](https://github.com/makenotion/notion-sdk-js) is still in Beta. A gap in the API is that it [does not support code blocks](https://developers.notion.com/reference/block#block-object-keys). For this reason, we have established our own plain-text way of creating code blocks -- To get around this we use **two back ticks** (``) instead of three to denote a code block. Actual code blocks can still be in the document, but they will be ignored during the import. Example:

```
``js
const foo = bar;
``
```

#### P5 Sketches

To load an interactive sketch, write

```
{% p5 examples/<folder_containing_example> %}
```

## Build

- `yarn build` to build the site
- `yarn build:pdf` to build the PDF version. The PDF will be copied to `build/web` and should be viewable at: http://localhost:5000/the-code-of-music.pdf

## Interactive P5 Examples

- `yarn serve:examples` serves the static `examples` folder.
- If you are running the web server, you can also just view the individual examples at `http://localhost:5000/assets/examples/<example_path>`

The interactive p5 sketches live in the `examples` folder. Each example directory should have an `index.html` which allows the sketch to be viewed independently, a `sketch.js` file which registers a P5 sketch in [instance mode](https://p5js.org/examples/instance-mode-instantiation.html), and `placeholder.png` which is used in the PDF build.

Here is an example sketch. Note that in the `index.html` we need to define `window.registerP5Sketch`. We also have to include the external libraries that the sketch needs. ⚠️ NOTE: these need to be the same versions as the libraries used in the web build.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js"></script>
    <meta charset="utf-8" />
  </head>
  <body>
    <script>
      // Load instance-mode sketch
      window.registerP5Sketch = (sketch) => {
        new p5(sketch);
      };
    </script>
    <script src="sketch.js"></script>
  </body>
</html>
```

In the `sketch.js` file we call `registerP5Sketch` with our instance mode sketch. Note that we retrieve a global `EXAMPLES_ASSETS_URL` or default to the local assets.

```js
// sketch.js
window.registerP5Sketch((p) => {
  const assetsUrl = window.EXAMPLES_ASSETS_URL || '../../assets';
  const synth = new Tone.Synth().toDestination();
  const buttonStyle = `
    background-image:url("${assetsUrl}/img/play.png");
  `;

  p.setup = () => {
    playBtn = p.createButton('');
    playBtn.style(buttonStyle);
    playBtn.mouseReleased(() => {
      synth.triggerAttackRelease('A3', 1);
    });
    p.createCanvas(200, 200);
    p.background(0);
  };
  p.draw = () => {
    const color = (p.sin(p.frameCount / 10) + 0.5) * 255;
    p.background(color);
  };
});
```

During the build the entire `examples` folder is moved to `build/assets/examples`.

### How the P5 Sketches Render

1. The [P5 plugin](https://github.com/luisaph/the-code-of-music/blob/master/plugins/p5.js) defines a tag that we can use in the source documentation and renders the related sketch on the page. The tag's usage is: `{% p5 examples/<folder_containing_example> %}`. Note that it contains logic for rendering the `placeholder.png` in the PDF build.

2. In [P5SketchManager.js](https://github.com/luisaph/the-code-of-music/blob/master/javascripts/P5SketchManager.js) we define a class to manage the P5 sketches. This file is [loaded in the `<head>`](https://github.com/luisaph/the-code-of-music/blob/master/layouts/default.html#23), so before the content loads. It [exposes](https://github.com/luisaph/the-code-of-music/blob/master/javascripts/preload.js#L71) the global `registerP5Sketch` function.

3. As the content renders, the P5 sketch scripts each call `window.registerP5Sketch` which [adds them to the list of sketches to be loaded](https://github.com/luisaph/the-code-of-music/blob/master/javascripts/preload.js#L25).

4. In [app.js] we call `P5SketchManager.renderP5Sketches()` which converts the functions into actual P5 Sketches using the P5 class. It renders them in the "slots" created by the P5 plugin.

5. TODO: A feature worth exploring is having only the visible sketches loop. This will reduce lag on pages with multiple sketches. It needs more testing but setting [`loopOnlyOnScreenSketches`](https://github.com/luisaph/the-code-of-music/blob/master/javascripts/preload.js#L13) to `true` will activate code to do this.

## Publishing Chapter Data from Notion

#### Locally

Locally, run `NOTION_TOKEN=<YOUR_TOKEN_HERE> yarn import-notion-docs`. This will run the [notion importer script](https://github.com/luisaph/the-code-of-music/blob/master/scripts/notion-importer.js) which pulls the latest data and populates the `notion-docs` folder. ⚠️ NOTE: This overwrites the folder's existing contents!

#### Using GitHub Actions

To create a PR with the latest data from Notion, run the [Import Notion Docs and create PR](https://github.com/luisaph/the-code-of-music/actions/workflows/import-notion-docs-PR.yml) action by clicking the "Run Workflow" button. This workflow simply runs the above script and creates a PR with the changes.

Note that Github Actions cannot trigger other Github actions directly. That means that this workflow will not automatically trigger the Deploy Preview action. Right now there are a couple workaraounds.

1. Close and re-open the PR. This will trigger the [firebase-hosting-pull-request](https://github.com/luisaph/the-code-of-music/blob/deploy-firebase/.github/workflows/firebase-hosting-pull-request.yml) action and post a link to the preview URL.
2. Use the [Notion2Github and Preview Deploy](https://github.com/luisaph/the-code-of-music/actions/workflows/notion-to-github-and-preview-deploy.yml) action. this will deploy to [Staging](https://codeofmusic-16a81--staging-h9r73v4u.web.app/), but not leave a comment on the PR

## Deploy

For every commit to the master branch, the [firebase-hosting-merge](https://github.com/luisaph/the-code-of-music/blob/deploy-firebase/.github/workflows/firebase-hosting-merge.yml) action builds and deploys the site to Firebase Hosting at https://codeofmusic-16a81.web.app/.

### Staging and Deploy Previews

Pull requests will trigger the [firebase-hosting-pull-request](https://github.com/luisaph/the-code-of-music/blob/deploy-firebase/.github/workflows/firebase-hosting-pull-request.yml) action, which deploys a unique, temporary preview site to Firebase Hosting. The link to the site will be posted as a comment from the Github Bot once the deploy is complete.
