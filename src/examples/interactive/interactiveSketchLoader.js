/*
  This script is used by the interactive sketches in this folder
  It loads code text from the URL and injects it as a script to run
  Url Params: 
    loadInitial -- set to true if it should load the sketch.js script
    p5script -- the stringified script to run
*/

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const loadInitial = urlParams.get('loadInitial');

if (loadInitial) {
  /* Load from local file */
  const script = document.createElement('script');
  script.src = 'sketch.js';
  document.body.appendChild(script);
} else {
  /* Load script from URL Param */
  const p5script = urlParams.get('p5script');
  const parsed = JSON.parse(p5script);
  const script = document.createElement('script');
  /* Script is an array of lines */
  script.innerHTML = parsed.join('\n');
  document.body.appendChild(script);
}
