console.log('what is happening ?');
import rough from 'roughjs/bundled/rough.esm.js';

const p5 = (window.p5 = require('p5'));
console.log('P5', p5);
const roughjs = (window.roughjs = rough);
const Tone = (window.Tone = require('tone'));
console.log('GO HERE');
if (window.p5Examples) {
  for (let i = 0; i < p5Examples.length; i++) {
    // Run example in sync mode
    const node = document.querySelector(
      '#' + p5Examples[i][0] + ' .p5container'
    );

    /* TODO: see what's going on here */
    // const example = new p5(p5Examples[i][1], node, true);
    // // Make it resizable
    // example.canvas.style.width = '100%';
    // example.canvas.style.height = 'auto';
  }
}
window.dispatchEvent(new Event('libsLoaded'));
