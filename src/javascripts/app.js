import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';

console.log('APP.js loaded');

/* Code for loading code editor sketches */
const loadInteractiveSketches = () => {
  console.log('loading interactives');

  const interactiveExamples = document.querySelectorAll(
    '.interactivesketchContainer'
  );

  interactiveExamples.forEach(async (e) => {
    const { id } = e;

    /* Retrieve data from element attribute (created in interactiveSketch plugin) */
    const path = e.getAttribute('data-path');

    const htmlPath = `${path}/index.html`;
    const jsPath = `${path}/sketch.js`;

    const embedFrame = document.querySelector(`#${id} .code-mirror-embed`);
    const sketchString = await fetch(jsPath).then((r) => r.text());
    const sketchLines = sketchString.split('\n');

    /* Get editable section -- defaults to first and last lines */
    const startLine = (e.getAttribute('data-start-line') || 1) - 1;
    const endLine = e.getAttribute('data-end-line') || sketchLines.length;

    /* Divide sketch into sections */
    const sketchPre = sketchLines.slice(0, startLine - 1);
    const sketchEditable = sketchLines.slice(startLine, endLine);
    const sketchPost = sketchLines.slice(endLine, -1);

    const initialState = EditorState.create({
      doc: sketchEditable.join('\n'),
      extensions: [
        basicSetup,
        javascript(),
        EditorView.updateListener.of(({ docChanged, view }) => {
          if (docChanged) {
            /* Get current document and combine with hidden code */
            const docData = view.state.doc.toJSON();
            const fullScript = [...sketchPre, ...docData, ...sketchPost];
            const docString = JSON.stringify(fullScript);

            /* Update iframe source with code in URL */
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

/* Set up Syntax Highlighting */
const hljs = require('highlight.js/lib/core');
hljs.registerLanguage(
  'javascript',
  require('highlight.js/lib/languages/javascript')
);

/* Syntax highlighting for static code blocks (non-codeMirror) */
hljs.highlightAll();

/* Render P5 Sketches */
P5SketchManager.renderP5Sketches();

/* Set env to AR and skip interactive sketches in case of AR
 */
if (location.pathname.toString() == "/AR/pdfinteractive.html") {
  window.ENV = 'AR';
} else {
  /* Render code editors */
  loadInteractiveSketches();
}



