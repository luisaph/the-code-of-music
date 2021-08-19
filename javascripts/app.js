import rough from 'roughjs/bundled/rough.esm.js';

const p5 = (window.p5 = require('p5'));
const roughjs = (window.roughjs = rough);
const Tone = (window.Tone = require('tone'));

console.log('APP.js loaded');
console.log('P5', p5);

/* Syntax Highlighting */
const hljs = require('highlight.js/lib/core');
hljs.registerLanguage(
  'javascript',
  require('highlight.js/lib/languages/javascript')
);
hljs.highlightAll();

/* Set assets url to be read by the p5 examples */
window.EXAMPLES_ASSETS_URL = '/assets/examples/assets';

if (window.p5Examples) {
  console.log('found P5 Examples:', window.p5Examples);
  for (let i = 0; i < p5Examples.length; i++) {
    const fn = p5Examples[i];
    const node = document.querySelector(`#example${i} .p5container`);
    const example = new p5(fn, node, true);
  }
}

window.dispatchEvent(new Event('libsLoaded'));
