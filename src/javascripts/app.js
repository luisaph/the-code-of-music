import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';

console.log('APP.js loaded');

/* Set up Syntax Highlighting */
const hljs = require('highlight.js/lib/core');
hljs.registerLanguage(
  'javascript',
  require('highlight.js/lib/languages/javascript')
);

hljs.highlightAll();

/* Render P5 Sketches */
P5SketchManager.renderP5Sketches();

const interactiveExamples = document.querySelectorAll(
  '.interactivesketchContainer'
);

console.log('loading interactives');
interactiveExamples.forEach(async (e) => {
  const { id } = e;
  const path = e.getAttribute('data-path');
  const htmlPath = `${path}/index.html`;
  const jsPath = `${path}/sketch.js`;

  const embedFrame = document.querySelector(`#${id} .code-mirror-embed`);
  const sketchString = await fetch(jsPath).then((r) => r.text());

  const initialState = EditorState.create({
    doc: sketchString,
    extensions: [
      basicSetup,
      javascript(),
      EditorView.updateListener.of(({ docChanged, view }) => {
        if (docChanged) {
          console.log('DOCUMENT CHANGED');

          const docData = view.state.doc.toJSON();
          const docString = JSON.stringify(docData);

          embedFrame.src = `${htmlPath}?p5script=${docString}`;
        }
      }),
    ],
  });

  const view = new EditorView({
    parent: document.querySelector(`#${id} .code-mirror-editor`),
    state: initialState,
  });

  // embedFrame.src = embedFrame.src;
  // console.log(view.state.doc);
});
