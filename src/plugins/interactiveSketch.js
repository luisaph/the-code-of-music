const _ = require('lodash');
const path = require('path');
const tinyliquid = require('tinyliquid');

/* Folder where the sketches */
const INTERACTIVE_EXAMPLES_PATH = 'examples/interactive';

/* 
  interactivesketch plugin
  - Renders user-editable javascript code that embeds in an adjacent iframe
  - Can select which lines to edit

  usage:
    {% interactivesketch <path> <line_start> <line_end> %}
*/

const Plugin = function (registry) {
  this.cache = {};
  registry.before(
    'load',
    'interactivesketch:tag',
    _.bind(this.liquidTag, this)
  );
};

Plugin.prototype = {
  liquidTag: function (config, extras, cb) {
    const { format } = config;

    let count = 0;

    /* function that gets called for every interactivesketch tag */
    function interactivesketchtag(context, tag, input) {
      const [sketchPath, startLine, endLine] = input.split(' ');
      console.log(
        `\x1b[35minteractivesketch Plugin: Adding interactive sketch: ${sketchPath}\x1b[0m`
      );

      const examplePath = path.join(
        '/assets',
        INTERACTIVE_EXAMPLES_PATH,
        sketchPath
      );

      const idAttr = `interactive-sketch-${count}`;

      const sketchLink = `https://github.com/luisaph/the-code-of-music/tree/master/src/examples/interactive/${sketchPath}`;

      /* TODO: Add pdf version */
      const pdfOut = `
       <div>
         <span>[code editor example]</span>
       </div>
      `;

      const htmlOut = `
        <div id="${idAttr}" data-path="${examplePath}" data-start-line="${startLine}" data-end-line="${endLine}" class="interactivesketchContainer">
          <div class="code-mirror-editor">
           <a href="${sketchLink}" target="blank">View source</a>
          </div>
          <iframe src="${examplePath}/index.html?loadInitial=true" class="code-mirror-embed"></iframe>
        </div>
       
      `;

      const output = format === 'pdf' ? pdfOut : htmlOut;

      /* Add new line so that the following content is parsed correctly */
      const parsedOutput = tinyliquid.parse(output.trim() + '\n\n');

      context.astStack.push(parsedOutput);
      count++;
    }

    _.set(config, 'liquid.customTags.interactivesketch', interactivesketchtag);
    cb(null, config, extras);
  },
};

module.exports = Plugin;
