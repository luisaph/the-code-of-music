console.log('MAIN.JS loaded');

/* UI Code for handling Menu open/close and highlighting of current page section */
document.addEventListener('DOMContentLoaded', () => {
  const MENU_CLOSED_CLASSNAME = 'menu-is-closed';
  const GLOBAL_VOLUME = 'global-volume';

  let chapterSection;
  let sections;
  let sketches;

  // const enableVisibleSketches = () => {
  //   sketches.forEach((s) => s.classList.remove('is-active'));
  //   const visibleSketches = [...sketches].filter(
  //     utils.isAnyPartOfElementInViewport
  //   );

  //   console.log('visibleSketches:', visibleSketches);
  //   visibleSketches.forEach((s) => s.classList.add('is-active'));

  //   if (P5SketchManager.loopOnlyOnScreenSketches) {
  //     P5SketchManager.pauseAllP5Sketches();

  //     visibleSketches.forEach((e) => {
  //       P5SketchManager.resumeP5Sketch(e.id);
  //     });
  //   }
  // };

  const updateActiveMenuLink = () => {
    document.querySelectorAll('.menu a').forEach((el) => {
      el.classList.remove('is-active');
      /* TODO: clean this up -- don't need to check the parent/chapter link each time */
      if (el.hash === location.hash || el.hash === `#${chapterSection.id}`) {
        el.classList.add('is-active');
      }
    });
  };

  const isMenuClosed = localStorage.getItem(MENU_CLOSED_CLASSNAME);
  if (isMenuClosed === 'true') {
    document.body.classList.add(MENU_CLOSED_CLASSNAME);
  }

  chapterSection = document.querySelector('section[data-type="chapter"]');
  sections = document.querySelectorAll('section section');
  sketches = document.querySelectorAll('.p5-figure');
  console.log('SKETCHES', sketches);

  // setTimeout(() => {
  //   P5SketchManager.enableVisibleSketches();
  // }, 500);
  /* Read from local storage */
  /* TODO: can we do this before the first page render? */

  /* Toggle Menu Open/Close */
  const menuButton = document.querySelector('.menu-button');
  menuButton.addEventListener('click', (e) => {
    document.body.classList.toggle(MENU_CLOSED_CLASSNAME);
    localStorage.setItem(
      MENU_CLOSED_CLASSNAME,
      document.body.classList.contains(MENU_CLOSED_CLASSNAME)
    );

    /* Resize Sketches when animation completes */
    setTimeout(P5SketchManager.resizeSketches, 200);
  });

  /* Set global volume control */
  const volumeControl = document.querySelector('#global-volume-control');
  const existingValue = localStorage.getItem(GLOBAL_VOLUME);
  if (parseInt(existingValue)) {
    Tone.Destination.volume.value = existingValue;
  }

  volumeControl.value = Tone.Destination.volume.value;
  volumeControl.addEventListener('input', (e) => {
    const val = e.target.value;
    if (Tone) {
      Tone.Destination.volume.rampTo(val, 0.2);
    }

    localStorage.setItem(GLOBAL_VOLUME, val);
  });

  window.addEventListener('hashchange', () => {
    updateActiveMenuLink();
  });

  let activeSectionId;

  document.addEventListener(
    'scroll',
    utils.debounce(() => {
      let newActiveSectionId;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const { top, bottom } = section.getBoundingClientRect();
        if (top < 200 && bottom > 0) {
          newActiveSectionId = section.id;
          break;
        }
      }

      if (newActiveSectionId !== activeSectionId) {
        activeSectionId = newActiveSectionId;
        if (!activeSectionId) {
          activeSectionId = chapterSection.id;
        }
        if (history.pushState) {
          history.pushState(null, null, `#${activeSectionId}`);
        } else {
          location.hash = `#${activeSectionId}`;
        }
        updateActiveMenuLink();
      }

      P5SketchManager.enableVisibleSketches();
    }),
    200
  );

  updateActiveMenuLink();
});
