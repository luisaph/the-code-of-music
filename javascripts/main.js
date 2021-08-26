console.log('MAIN.JS loaded');

function isAnyPartOfElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  // DOMRect { x: 8, y: 8, width: 100, height: 100, top: 8, right: 108, bottom: 108, left: 8 }
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  // http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
  const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
  const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;

  return vertInView && horInView;
}

/* UI Code for handling Menu open/close and highlighting of current page section */
document.addEventListener('DOMContentLoaded', () => {
  const MENU_CLOSED_CLASSNAME = 'menu-is-closed';
  let chapterSection;
  let sections;
  let sketches;

  const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  };

  const updateActiveMenuLink = () => {
    document.querySelectorAll('.menu a').forEach((el) => {
      el.classList.remove('is-active');
      if (el.hash === location.hash) {
        el.classList.add('is-active');
      }
    });
    // if (!location.hash) {
    //   chapterSection.classList.add('is-active');
    // }
  };

  const isMenuClosed = localStorage.getItem(MENU_CLOSED_CLASSNAME);
  if (isMenuClosed === 'true') {
    document.body.classList.add(MENU_CLOSED_CLASSNAME);
  }

  chapterSection = document.querySelector('section[data-type="chapter"]');
  sections = document.querySelectorAll('section section');
  sketches = document.querySelectorAll('.p5-figure');
  console.log('SKETCHES', sketches);

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
  });

  window.addEventListener('hashchange', () => {
    updateActiveMenuLink();
  });

  let activeSectionId;

  document.addEventListener(
    'scroll',
    debounce(() => {
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

        const sectionSketches = [...sketches].filter(
          isAnyPartOfElementInViewport
        );

        console.log('section sketches', sectionSketches);

        if (P5SketchManager.loopOnlyOnScreenSketches) {
          P5SketchManager.pauseAllP5Sketches();

          sectionSketches.forEach((e) => {
            P5SketchManager.resumeP5Sketch(e.id);
          });
        }
      }
    }),
    200
  );

  updateActiveMenuLink();
});
