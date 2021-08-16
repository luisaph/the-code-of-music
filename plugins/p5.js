const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const tinyliquid = require('tinyliquid');

const EXAMPLES_PATH = 'examples';

const Plugin = function (registry) {
  this.cache = {};
  registry.before('load', 'p5:tag', _.bind(this.liquidTag, this));
};

Plugin.prototype = {
  liquidTag: function (config, extras, cb) {
    let count = 0;

    // function that gets called for every p5 tag
    function p5tag(context, tag, input) {
      console.log('=== Running P5 Plugin ===');
      const examplePathString = input.split(' ')[0];
      console.log('Adding example:', examplePathString);

      const examplePath = path.join(
        '/assets',
        EXAMPLES_PATH,
        examplePathString
      );
      const scriptPath = path.join(examplePath, 'sketch.js');
      const idAttr = `example${count}`;

      const output = `
        <figure id="${idAttr}" class="p5-figure">
          <div class="p5container"></div>
          <script type="text/javascript" src="${scriptPath}"></script>
          <a href="${examplePath}" target="_blank">View in new window</a>
        </figure>`;

      const parsedOutput = tinyliquid.parse(output.trim());

      context.astStack.push(parsedOutput);
      count++;
    }

    _.set(config, 'liquid.customTags.p5', p5tag);
    cb(null, config, extras);
  },
};

module.exports = Plugin;
