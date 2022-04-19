import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';

/* Set up Syntax Highlighting */
const hljs = require('highlight.js/lib/core');
hljs.registerLanguage(
  'javascript',
  require('highlight.js/lib/languages/javascript')
);

console.log('APP.js loaded');

const loadInteractiveSketches = () => {
  console.log('loading interactives');

  const interactiveExamples = document.querySelectorAll(
    '.interactivesketchContainer'
  );

  interactiveExamples.forEach(async (e) => {
    const { id } = e;

    const path = e.getAttribute('data-path');

    const htmlPath = `${path}/index.html`;
    const jsPath = `${path}/sketch.js`;

    const embedFrame = document.querySelector(`#${id} .code-mirror-embed`);
    const sketchString = await fetch(jsPath).then((r) => r.text());

    const sketchLines = sketchString.split('\n');

    // Defaults to first and last lines
    const startLine = (e.getAttribute('data-start-line') || 1) - 1;
    const endLine = e.getAttribute('data-end-line') || sketchLines.length;

    const sketchPre = sketchLines.slice(0, startLine - 1);
    const sketchEditable = sketchLines.slice(startLine, endLine);
    const sketchPost = sketchLines.slice(endLine + 1);

    const initialState = EditorState.create({
      doc: sketchEditable.join('\n'),
      extensions: [
        basicSetup,
        javascript(),
        EditorView.updateListener.of(({ docChanged, view }) => {
          if (docChanged) {
            console.log('DOCUMENT CHANGED');

            const docData = view.state.doc.toJSON();
            const fullScript = [...sketchPre, ...docData, ...sketchPost];
            const docString = JSON.stringify(fullScript);

            embedFrame.src = `${htmlPath}?p5script=${docString}`;
          }
        }),
      ],
    });

    const view = new EditorView({
      parent: document.querySelector(`#${id} .code-mirror-editor`),
      state: initialState,
    });
  });
};

hljs.highlightAll();

/* Render P5 Sketches */
P5SketchManager.renderP5Sketches();

/* Render code editors */
loadInteractiveSketches();
