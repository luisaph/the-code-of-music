const _ = require('lodash');
const path = require('path');
const tinyliquid = require('tinyliquid');

const EXAMPLES_PATH = 'examples';

const Plugin = function (registry) {
  this.cache = {};
  registry.before('load', 'p5:tag', _.bind(this.liquidTag, this));
};

Plugin.prototype = {
  liquidTag: function (config, extras, cb) {
    const { format } = config;

    let count = 0;

    /* function that gets called for every p5 tag */
    function p5tag(context, tag, input) {
      const examplePathString = input.split(' ')[0];
      console.log(
        `\x1b[35mP5 Plugin: Adding example: ${examplePathString}\x1b[0m`
      );

      const examplePath = path.join(
        '/assets',
        EXAMPLES_PATH,
        examplePathString
      );
      const scriptPath = path.join(examplePath, 'sketch.js');
      const idAttr = `example-${count}`;

      /* Image for PDF version, interactive sketch for web version */
      const output =
        format === 'pdf'
          ? `
        <figure id="${idAttr}" class="p5-figure">
          <div class="p5container">
            <img src=".${examplePath}/placeholder.png" />
            <span>${examplePath}</span>
          </div>
        </figure>
      `
          : `
        <figure id="${idAttr}" class="p5-figure">
          <div class="p5container"></div>
          <script type="text/javascript" src="${scriptPath}"></script>
          <a class="p5-sketch-link" href="${examplePath}" target="_blank">View</a>
        </figure>
      `;

      /* Add new line so that the following content is parsed correctly */
      const parsedOutput = tinyliquid.parse(output.trim() + '\n\n');

      context.astStack.push(parsedOutput);
      count++;
    }

    _.set(config, 'liquid.customTags.p5', p5tag);
    cb(null, config, extras);
  },
};

module.exports = Plugin;
