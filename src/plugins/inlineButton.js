const _ = require('lodash');
const path = require('path');
const tinyliquid = require('tinyliquid');

const Plugin = function (registry) {
  this.cache = {};
  registry.before('load', 'inlinebutton:tag', _.bind(this.liquidTag, this));
};

Plugin.prototype = {
  liquidTag: function (config, extras, cb) {
    const { format } = config;

    /* function that gets called for every tag */
    function inlinebuttonTag(context, tag, input) {
      const [functionName] = input.split(' ');
      const buttonText = input.substring(
        input.indexOf('[') + 1,
        input.indexOf(']')
      );

      console.log(
        `\x1b[35mP5 Plugin: Creating inline button: ${functionName}\x1b[0m`
      );

      const btn = `
        <button class="inlinebutton" onClick="${functionName}">
          ${buttonText}
        </button>
        `;

      // const output =
      //   format === 'pdf'
      //     ? `
      //   <button id="${id ? id : undefined}" class="inlinebutton">
      //     <div class="p5container">
      //       <img src=".${examplePath}/placeholder.png" />
      //       <span>${examplePath}</span>
      //     </div>
      //   </button>
      // `
      //     : `
      //   <figure id="${idAttr}" class="p5-figure">
      //     <div class="p5container"></div>
      //     <script type="text/javascript" src="${scriptPath}"></script>
      //     <a class="p5-sketch-link" href="${examplePath}" target="_blank">View</a>
      //   </figure>
      // `;

      /* Add new line so that the following content is parsed correctly */
      const parsedOutput = tinyliquid.parse(btn.trim() + '\n\n');

      context.astStack.push(parsedOutput);
    }

    _.set(config, 'liquid.customTags.inlinebutton', inlinebuttonTag);
    cb(null, config, extras);
  },
};

module.exports = Plugin;
