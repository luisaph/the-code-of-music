console.log('PRELOAD FILE LOADED');

/* Set assets url to be read by the p5 examples */
window.EXAMPLES_ASSETS_URL = '/assets/examples/assets';

(() => {
  /* Array of p5 sketches on this page */
  const p5Sketches = [];

  /* Each sketch calls this function to add itself to the array */
  window.registerP5Sketch = (p5Sketch) => {
    console.log('registerP5Sketch called');
    p5Sketches.push(p5Sketch);
  };

  /* Function to be called in app.js once the page content has loaded */
  window.renderP5Sketches = () => {
    if (p5Sketches) {
      console.log(`Loading ${p5Sketches.length} P5 Examples:`, p5Sketches);
      for (let i = 0; i < p5Sketches.length; i++) {
        const fn = p5Sketches[i];
        const node = document.querySelector(`#example${i} .p5container`);

        /* Render the sketch */
        new p5(fn, node, true);
      }
    }
  };
})();
