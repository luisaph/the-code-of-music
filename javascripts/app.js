import rough from 'roughjs/bundled/rough.esm.js';

const p5 = (window.p5 = require('p5'));
const roughjs = (window.roughjs = rough);
const Tone = (window.Tone = require('tone'));
const hljs = require('highlight.js/lib/core');
hljs.registerLanguage(
  'javascript',
  require('highlight.js/lib/languages/javascript')
);

console.log('APP.js loaded');

/* Syntax Highlighting */
hljs.highlightAll();

/* Render P5 Sketches */
window.renderP5Sketches();
