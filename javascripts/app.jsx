import rough from 'roughjs/bundled/rough.esm.js';

const p5 = (window.p5 = require('p5'));
const roughjs = (window.roughjs = rough);
const Tone = (window.Tone = require('tone'));

console.log('APP.jsx loaded');
console.log('P5', p5);

window.EXAMPLES_ASSETS_URL = '/assets/examples/assets';

if (window.p5Examples) {
  console.log('found P5 Examples:', window.p5Examples);
  for (let i = 0; i < p5Examples.length; i++) {
    // console.log(p5Examples[i]);
    // console.log('creating p5 canvas', i);
    const fn = p5Examples[i];
    // Run example in sync mode
    const node = document.querySelector(`#example${i} .p5container`);
    const example = new p5(fn, node, true);
    // NOTE: these were firing before the P5 sketch finished loading, so canvas did not exist
    // example.canvas.style.width = '100%';
    // example.canvas.style.height = 'auto';
  }
}

window.dispatchEvent(new Event('libsLoaded'));
