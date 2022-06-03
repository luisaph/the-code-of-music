# The Code of Music (magicbook)

Web: https://codeofmusic-16a81.web.app/

PDF: https://codeofmusic-16a81.web.app/the-code-of-music.pdf

_Code of Music_ is an interactive book that teaches the fundamentals of music theory through code that is available in website or PDF format. It uses [magicbook](https://github.com/magicbookproject/magicbook) and takes inspiration and architecture from Rune Madsen's [Programming Design Systems](https://github.com/runemadsen/programmingdesignsystems.com) book.

## 🛠️ Setup

0. Install [nvm](https://github.com/nvm-sh/nvm) and [Yarn](https://yarnpkg.com/)
1. `nvm install; nvm use;` to install and activate the correct Node version (defined in [.nvmrc](https://github.com/luisaph/the-code-of-music/blob/master/.nvmrc)).
2. Install [Prince](https://www.princexml.com/) on your computer (`brew install prince` for Macs). In theory we shouldn't have to do this but there is an error while installing Prince as part of the `magicbook` installation.
3. `yarn install` to install the node modules

## 💻 Development

1. Run `yarn dev` – this will build the magicbook files and watch for changes
2. In a new tab run `yarn serve` – this will start a [`live-server`](https://github.com/tapio/live-server) at localhost:5000 and auto refresh when the magic build finishes
3. Open http://localhost:5000/

### Important Files

The [Plugins](https://github.com/luisaph/the-code-of-music/tree/master/src/plugins) folder contains magicbook plugins for creating custom tags

The main JS files are:

- [P5SketchManager.js](https://github.com/luisaph/the-code-of-music/blob/master/src/javascripts/P5SketchManager.js) loads first and initializes the class for rendering the P5 Sketches
- [app.js](https://github.com/luisaph/the-code-of-music/blob/master/src/javascripts/app.js) is the [Webpack entry point](https://github.com/luisaph/the-code-of-music/blob/master/webpack.config.js#L6) so we can import node modules. It contains logic for setting up the CodeMirror code editors and executing the sketch rendering process.
- [main.js](https://github.com/luisaph/the-code-of-music/blob/master/src/javascripts/main.js) contains mostly UI code like scroll and click handlers -- It also creates the global volume control.

## 📦 Build

- `yarn build` to build the site into the `build` directory
- `yarn build:pdf` to build the PDF version. The PDF will be copied to `build/web` and should be viewable at: http://localhost:5000/the-code-of-music.pdf

## 📖 Writing in Notion

The book content comes from a Notion document. A `Book` page should contain a Pages database.

<img width="246" alt="Screen Shot 2022-06-03 at 2 51 41 PM" src="https://user-images.githubusercontent.com/9386882/171929304-18c9c054-20d1-4d0f-b7a9-3982c6c69748.png">

The Pages database should have the following structure. Each Page under the Name header contains the full content for that chapter.

<img width="921" alt="Screen Shot 2022-06-03 at 2 50 06 PM" src="https://user-images.githubusercontent.com/9386882/171928824-25485716-b936-4b39-bcf1-1d85bdfe1453.png">

#### P5 Sketches

To load a p5 sketch, use the Notion `embed` object for the deployed sketch, eg `/embed https://codeofmusic-16a81.web.app/assets/examples/melody/melody-0/`. Any sketch on our production domain will be automatically converted into a p5 tag that looks like this (other embeds will be turned into iframes):

```
{% p5 examples/<folder_containing_example> %}
```

This will turn into a canvas on the page that renders the sketch.

#### Interactive Sketches (with code editor)

To load an interactive sketch with a code editor, use the following syntax, where `directory` is the folder inside [examples/interactive](https://github.com/luisaph/the-code-of-music/tree/master/src/examples/interactive) containing the sketch. This folder should contain an `index.html` and a `sketch.js` (see this [example](https://github.com/luisaph/the-code-of-music/tree/master/src/examples/interactive/toneExample1) for the boilerplate). `line_start` and `line_end` determine which section of `sketch.js` will be rendered in the code editor.

```
{% interactivesketch <directory> <line_start> <line_end> %}
```

The code editor components use [CodeMirror](https://codemirror.net/6/docs/). Code for parsing the code editors in in [App.js](https://github.com/luisaph/the-code-of-music/blob/master/src/javascripts/app.js#L13-L65).

#### Inline Buttons

Inline buttons can be used to add interactivity to text content. Set the global function that they call when clicked. Usage:

```
{% inlinebutton <function_call> [<button_text>] %}
```

Example:

```
{% inlinebutton sketch2toggleTimeGrid() [Show Time Grid] %}
```

[Here is an example](https://github.com/luisaph/the-code-of-music/blob/master/src/examples/melody/melody-2/sketch.js#L52) of defining the global function that this button will call.

## 📥 Importing from Notion

#### Locally

Locally, you will need an [integration token](https://developers.notion.com/docs/authorization) and have access to the project's Notion source. Run `NOTION_TOKEN=<YOUR_TOKEN_HERE> yarn import-notion-docs`. This will run the [notion importer script](https://github.com/luisaph/the-code-of-music/blob/master/scripts/notion-importer.js) which pulls the latest data and populates the `notion-docs` folder. ⚠️ NOTE: This overwrites the folder's existing contents!

#### Using GitHub Actions

To create a PR with the latest data from Notion, run the [Import Notion Docs and create PR](https://github.com/luisaph/the-code-of-music/actions/workflows/import-notion-docs-PR.yml) action by clicking the "Run Workflow" button. This workflow simply runs the above script and creates a PR with the changes.

Note that Github Actions cannot trigger other Github actions directly. That means that this workflow will not automatically trigger the Deploy Preview action. Right now there are a couple workaraounds.

1. Close and re-open the PR. This will trigger the [firebase-hosting-pull-request](https://github.com/luisaph/the-code-of-music/blob/deploy-firebase/.github/workflows/firebase-hosting-pull-request.yml) action and post a link to the preview URL.
2. Use the [Notion2Github and Preview Deploy](https://github.com/luisaph/the-code-of-music/actions/workflows/notion-to-github-and-preview-deploy.yml) action. this will deploy to [Staging](https://codeofmusic-16a81--staging-h9r73v4u.web.app/), but not leave a comment on the PR

## 🎵 Interactive P5 Examples

- `yarn serve:examples` serves the static `examples` folder.
- If you are running the web server, you can also just view the individual examples at `http://localhost:5000/assets/examples/<example_path>`

The interactive p5 sketches live in the `examples` folder. Each example directory should have an `index.html` which allows the sketch to be viewed independently, a `sketch.js` file which registers a P5 sketch in [instance mode](https://p5js.org/examples/instance-mode-instantiation.html), and `placeholder.png` which is used in the PDF build.

Here is an example sketch. Note that in the `index.html` we need to define `window.registerP5Sketch`. We also have to include the external libraries that the sketch needs from the assets folder.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <script src="../../assets/libs/Tone-14.7.77.min.js"></script>
    <script src="../../assets/libs/p5-1.4.0.min.js"></script>
    <link href="../../assets/examples.css" rel="stylesheet" />
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

1. The [P5 plugin](https://github.com/luisaph/the-code-of-music/blob/master/src/plugins/p5.js) defines a tag that we can use in the source documentation and renders the related sketch on the page. The tag's usage is: `{% p5 examples/<folder_containing_example> %}`. Note that it contains logic for rendering the `placeholder.png` in the PDF build.

2. In [P5SketchManager.js](https://github.com/luisaph/the-code-of-music/blob/master/src/javascripts/P5SketchManager.js) we define a class to manage the P5 sketches. This file is [loaded in the `<head>`](https://github.com/luisaph/the-code-of-music/blob/master/src/layouts/default.html#L26), so before the content loads. It [exposes](https://github.com/luisaph/the-code-of-music/blob/master/src/javascripts/P5SketchManager.js#L96) the global `registerP5Sketch` function.

3. As the content renders, the P5 sketch scripts each call `window.registerP5Sketch` which [adds them to the list of sketches to be loaded](https://github.com/luisaph/the-code-of-music/blob/master/src/javascripts/P5SketchManager.js#L30).

4. In [app.js](https://github.com/luisaph/the-code-of-music/blob/master/src/javascripts/app.js#L82) we call `P5SketchManager.renderP5Sketches()` which converts the functions into actual P5 Sketches using the P5 class. It renders them in the "slots" created by the P5 plugin.

5. Code in [`main.js`](https://github.com/luisaph/the-code-of-music/blob/master/src/javascripts/main.js#L87) pauses/unpauses the sketches depending on whether they are visible as the user scrolls.

## 🤳 AR for pdfs

The webpage for serving AR content is on - https://codeofmusic-16a81.web.app/pdfInteractive.html

### Overview

1. All the code for the AR rendering lives in `src/javascripts/xr.js` in the codebase.
2. It uses threejs to create the XR environment.
3. Different interactives are loaded based on the image that that phone sees.

### How interactives are rendered in AR

1. The AR scene has 2 components - DOM and a plane geometry.
2. The DOM is used for interactions with the environmnet(buttons, sliders etc). Native buttons and sliders are being used as - as of now threejs does not support threejs geometries to be interactive elements in AR.
3. Based on the image marker that the phone sees, a p5 interactive from `examples/interactive/**/**/sketch.js` is loaded
4. As these interactives are created in instance mode, the canvas element loaded by invoking a sketch is loaded on to the plane geometry as a texture on the geometry. Even when the p5 canvas is loaded as a texture, it functions as a normal p5 sketch with the setup() and draw() functions working as they normally would which allows all the sketch animations to work.
5. This was done in order to be able to use the p5 code written for the web version to be resued for the AR for pdfs.

### The functions in xr.js

1. `activateXR` :

- sets up the threejs scene and initializes the xr environment.
- It also sets the default `window.registerP5Sketch = overrideregisterP5Sketch`.
- This is done so that instead of getting registed to the p5 magicbook plugin the sketch can now be used by threejs as a texture instead.

2. `onXRFrame`:

- Called on each frame
- gets camera positions
- checks for detected marker and its position on each frame.

3. `loadARAssets(pathOfSketch)`

- On image detection : Appends the path of the sketch.js file to the head of the document so the sketch can get invoked in instance mode.

4. `overrideregisterP5Sketch(p5Instance)`

- Adds the loaded sketch as a texture to a threejs geometry

5. `overrideP5functions(p5Instance,p5Canvas)`

- Overrides some default p5 functions like - createButton, createSlider etc

### Modifications in p5 sketch

1. Instead of `p.createCanvas(p.windowWidth, sketchHeight);` modify it to `let p5Obj = window.overrideP5functions(p,p.createCanvas(window.innerWidth, 400)`
   this returns an object from which the canvas can be extracted like `c = p5Obj.p5Canvas`.
2. All p5 DOM functions like createImage, createButton, createSlider etc do not work when the sketch is used as a canvas texture. Which is why the `overrideP5functions` is used which overrides the p5functions to use the standard js way of creation buttons and sliders. The overriding is done so that there is a generic function that would handle all these things in the AR environment and the p5 code can be witten in pretty much the standard way.
3. One other change that is required in the p5 sketch is `addClass` and `removeClass` functions need to be modified to `.elm.classList.add` and `.elm.classList.remove`

See. `examples/interactive/melody/melody-3/sketch.js` for reference

### TODOs:

1. Modify other interactives the way it is done in `examples/interactive/melody/melody-3/sketch.js`
2. Handle all other DOM functions in `overrideP5functions()`. As of now it handles only `createButton` and `createSlider`
3. Stylise the Buttons, sliders and any other interactive element.

## 🚀 Deploy

For every commit to the master branch, the [firebase-hosting-merge](https://github.com/luisaph/the-code-of-music/blob/deploy-firebase/.github/workflows/firebase-hosting-merge.yml) action builds and deploys the site to Firebase Hosting at https://codeofmusic-16a81.web.app/.

### Staging and Deploy Previews

Pull requests will trigger the [firebase-hosting-pull-request](https://github.com/luisaph/the-code-of-music/blob/deploy-firebase/.github/workflows/firebase-hosting-pull-request.yml) action, which deploys a unique, temporary preview site to Firebase Hosting. The link to the site will be posted as a comment from the Github Bot once the deploy is complete.
