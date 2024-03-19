const webpack = require("webpack");
const fs = require('fs');
const _ = require("lodash");
const path = require('path');
const util = require('util');
const through = require('through2');

const Plugin = function(registry) {
  registry.before('load', 'webpack:run', this.run);
  registry.before('liquid', 'webpack:insert', this.insert);
}

Plugin.prototype = {

  // Run webpack and put the resulting output into a
  // manifest object
  run: function(config, extras, callback) {

    // If the configuration file has a webpack property
    // with a link to the config file
    if(config.webpack) {

      const that = this;
      this.manifest = {};

      // Require the config file relative to the process
      // and make a copy to not mess up between tests.
      const loadPath = path.join(process.cwd(), config.webpack);
      const conf = _.cloneDeep(require(loadPath));

      // Entries should be loaded relative to the config file
      conf.context = path.dirname(loadPath);

      // Output should be relative to the build folder
      const oldPath = conf.output.path;
      conf.output.path = path.join(process.cwd(), extras.destination, oldPath);
      

      // Run webpack
      webpack(conf, function(err, stats) {
        if(err) return callback(err, config, extras);

        const json = stats.toJson();

        if(json.errors.length > 0)   console.error(json.errors);
        if(json.warnings.length > 0) console.warn(json.warnings);
        
        
        // Parse output files into a manifest object
        _.each(json.assetsByChunkName, function(v, k) {
          that.manifest[k] = path.join(oldPath, v.toString());
        });

        callback(null, config, extras);
      });

    } else {
      callback(null, config, extras);
    }
  },

  // Loop through each file and add the relative link to the
  // manifest files.
  insert: function(config, stream, extras, callback) {

    const manifest = this.manifest;

    // add the locals to the files liquidLocals
    stream = stream.pipe(through.obj(function(file, enc, cb) {

      _.each(manifest, function(filename, k) {
        const rel = path.relative(path.dirname(file.relative), filename);
        _.set(file, 'layoutLocals.webpack.' + k, rel);
        _.set(file, 'pageLocals.webpack.' + k, rel);
      });

      cb(null, file);
    }));

    callback(null, config, stream, extras);
  }
}

module.exports = Plugin;