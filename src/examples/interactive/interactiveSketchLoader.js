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
