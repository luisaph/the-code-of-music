import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';

/* Set up Syntax Highlighting */
const hljs = require('highlight.js/lib/core');
hljs.registerLanguage(
  'javascript',
  require('highlight.js/lib/languages/javascript')
);

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

    console.log('sketchLines: ');
    console.log(sketchLines);

    /* Get editable section -- defaults to first and last lines */
    const startLine = (e.getAttribute('data-start-line') || 1) - 1;
    const endLine = e.getAttribute('data-end-line') || sketchLines.length;

    /* Divide sketch into sections */
    const sketchPre = sketchLines.slice(0, startLine - 1);
    const sketchEditable = sketchLines.slice(startLine, endLine);
    const sketchPost = sketchLines.slice(endLine, -1);

    console.log(sketchPre);
    console.log(sketchEditable);
    console.log(sketchPost);

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
            // console.log(fullScript);
            const docString = JSON.stringify(fullScript);
            // console.log(docString);

            /* Updates frame source with code in URL */
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
