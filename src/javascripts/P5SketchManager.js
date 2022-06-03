/* This file is loaded in the <head>, so it runs before all the others */

console.log('PRELOAD FILE LOADED');

/* Set assets url to be read by the p5 examples */
window.EXAMPLES_ASSETS_URL = '/assets/examples/assets';

/*
  Class to manage the rendering of P5 Sketches
*/
function P5SketchManager() {
  /* Experimental feature to only 'loop' the visible sketches -- additional logic in main.js */
  const loopOnlyOnScreenSketches = true;

  let activeSketchId = null;

  /* Array of p5 instance-mode functions on this page */
  const p5SketchesToLoad = [];

  /* Sketches that have been loaded */
  const activeSketches = [];
  const nodes = [];

  const resizeSketches = () => {
    const mainWidth = document.querySelector('main article').offsetWidth;
    activeSketches.forEach((sketch) => {
      sketch.resizeCanvas(mainWidth, sketch.height);
    });
  };

  return {
    loopOnlyOnScreenSketches,

    /* Each sketch calls this function to add itself to the array */
    registerP5Sketch: (p5Sketch) => {
      console.log('registerP5Sketch called');
      p5SketchesToLoad.push(p5Sketch);
    },

    /* Function to be called in app.js once the page content has loaded */
    renderP5Sketches: () => {
      console.log(
        `Loading ${p5SketchesToLoad.length} P5 Examples:`,
        p5SketchesToLoad
      );

      for (let i = 0; i < p5SketchesToLoad.length; i++) {
        const fn = p5SketchesToLoad[i];
        const node = document.querySelector(`#example-${i} .p5container`);

        /* Render the sketch */
        const sketch = new p5(fn, node, true);

        sketch.setActive = (isActive) => {
          if (sketch.isActive !== isActive) {
            sketch.isActive = isActive;
            if (isActive) {
              sketch.canvas.classList.add('is-active');
              sketch.loop();
            } else {
              sketch.canvas.classList.remove('is-active');
              sketch.noLoop();
            }
          }
        };

        /* Custom on loaded handler to set width */
        sketch.onLoaded = () => {
          sketch.resizeCanvas(node.offsetWidth, sketch.height);
          node.getElementsByClassName.height = sketch.height;

          if (utils.isAnyPartOfElementInViewport(node)) {
            sketch.setActive(true);
          } else {
            sketch.setActive(false);
          }
        };

        activeSketches.push(sketch);
        nodes.push(node);
      }
    },

    enableVisibleSketches: () => {
      activeSketches.forEach(({ canvas, setActive }) => {
        const isActive = utils.isAnyPartOfElementInViewport(canvas);
        setActive(isActive);
      });
    },

    resizeSketches,
  };
}

window.P5SketchManager = new P5SketchManager();
window.overrideP5functions = () =>{}
window.addEventListener('resize', P5SketchManager.resizeSketches);

/* Expose register function to p5 sketch files */
window.registerP5Sketch = P5SketchManager.registerP5Sketch;
