import rough from 'roughjs/bundled/rough.esm.js';

// const p5 = (window.p5 = require('p5'));
// import p5 from 'p5';
// window.p5 = p5;
// import 'p5/lib/addons/p5.sound';

// const roughjs = (window.rough = rough);
// const Tone = (window.Tone = require('tone'));
const hljs = require('highlight.js/lib/core');
hljs.registerLanguage(
  'javascript',
  require('highlight.js/lib/languages/javascript')
);

console.log('APP.js loaded');

/* Syntax Highlighting */
hljs.highlightAll();

/* Render P5 Sketches */
P5SketchManager.renderP5Sketches();
