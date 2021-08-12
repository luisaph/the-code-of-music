const MENU_CLOSED_CLASSNAME = 'menu-is-closed';

let chapterSection;
let sections;

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

document.addEventListener('DOMContentLoaded', () => {
  chapterSection = document.querySelector('section[data-type="chapter"]');
  sections = document.querySelectorAll('section section');

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

  updateActiveMenuLink();
});

window.addEventListener('hashchange', () => {
  updateActiveMenuLink();
});

let activeSectionId;

document.addEventListener(
  'scroll',
  debounce(() => {
    let newActiveSectionId = null;
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
  }),
  200
);
