/* 
  This file is loaded in the <head>, so it runs before all the others
*/
import interactives from '@luisaph/com-interactives';
import p5 from 'p5';

console.log('PRELOAD FILE LOADED');

/* Set assets url to be read by the p5 examples */
window.EXAMPLES_ASSETS_URL = '/assets/examples/assets';

/*
  Class to manage the rendering of P5 Sketches
*/
export default class P5SketchManager {
  constructor() {
    this.activeSketches = [];
    this.p5SketchesToLoad = Array.from(
      document.querySelectorAll('figure[data-type="embedded-sketch"]')
    )
      .map((node) => {
        const sketchName = node.getAttribute('data-sketch-name');
        if (!sketchName || !interactives[sketchName]) return null;

        return {
          node,
          loadable: interactives[sketchName],
        };
      })
      .filter((node) => node !== null);
  }

  async renderP5Sketches() {
    for (let i = 0; i < this.p5SketchesToLoad.length; i++) {
      const { loadable, node } = this.p5SketchesToLoad[i];
      const containerNode = node.querySelector('.p5container');
      try {
        const fn = await loadable();
        const sketch = new p5(fn, containerNode);
        this.activeSketches.push(sketch);

        new ResizeObserver(() => {
          sketch.resizeCanvas(containerNode.offsetWidth, sketch.height);
        }).observe(containerNode);

        // sketch.setActive = (isActive) => {
        //   if (sketch.isActive !== isActive) {
        //     sketch.isActive = isActive;
        //     if (isActive) {
        //       sketch.canvas.classList.add('is-active');
        //       sketch.loop();
        //     } else {
        //       sketch.canvas.classList.remove('is-active');
        //       sketch.noLoop();
        //     }
        //   }
        // };

        // if (utils.isAnyPartOfElementInViewport(containerNode)) {
        //   sketch.setActive(true);
        // } else {
        //   sketch.setActive(false);
        // }
      } catch (error) {
        console.error('Failed to load sketch:', error);
      }
    }
  }

  // enableVisibleSketches() {
  //   this.activeSketches.forEach(({ canvas, setActive }) => {
  //     const isActive = utils.isAnyPartOfElementInViewport(canvas);
  //     setActive(isActive);
  //   });
  // }
}
