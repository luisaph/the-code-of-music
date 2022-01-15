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
