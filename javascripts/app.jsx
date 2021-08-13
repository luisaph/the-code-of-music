import rough from 'roughjs/bundled/rough.esm.js';

const p5 = (window.p5 = require('p5'));
const roughjs = (window.roughjs = rough);
const Tone = (window.Tone = require('tone'));

console.log('APP.jsx loaded');
console.log('P5', p5);

if (window.p5Examples) {
  console.log('found P5 Examples:', window.p5Examples);
  for (let i = 0; i < p5Examples.length; i++) {
    console.log('creating p5 canvas', i);
    const [id, codeString] = p5Examples[i];
    // Run example in sync mode
    const node = document.querySelector(`#${id} .p5container`);
    const example = new p5(codeString, node, true);

    // NOTE: these were firing before the P5 sketch finished loading, so canvas did not exist
    // example.canvas.style.width = '100%';
    // example.canvas.style.height = 'auto';
  }
}

window.dispatchEvent(new Event('libsLoaded'));
