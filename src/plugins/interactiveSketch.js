const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const tinyliquid = require('tinyliquid');

const INTERACTIVE_EXAMPLES_PATH = 'examples/interactive';

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
      const [sketchPath] = input.split(' ');

      console.log(
        `\x1b[35minteractivesketch Plugin: Adding interactive sketch: ${sketchPath}\x1b[0m`
      );

      const examplePath = path.join(
        '/assets',
        INTERACTIVE_EXAMPLES_PATH,
        sketchPath
      );

      const idAttr = `interactive-sketch-${count}`;

      /* TODO: Add pdf version */
      const pdfOut = `
       <div></div>
      `;

      const htmlOut = `
        <div id="${idAttr}" data-path="${examplePath}" class="interactivesketchContainer">
          <div class="code-mirror-editor"></div>
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
