const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const Util = require('./lib/util');
const Assets = require('./lib/assets');

/**
 * HtmlWebpackRoutesPlugin
 * @description Webpack plugin based on HTML Webpack Plugin that clones routes based on given input
 * Based on https://github.com/jantimon/html-webpack-harddisk-plugin
 */

class HtmlWebpackRoutesPlugin {

  constructor(routes = []) {
    this.routes = Array.from(routes);
  }

  apply(compiler) {

    compiler.hooks.compilation.tap('HtmlWebpackRoutesPlugin', compilation => {

      compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync('HtmlWebpackRoutesPlugin', (data, callback) => {

        // If the input isn't an array, add it as one to simplify the process

        if ( !Array.isArray(this.routes) ) {
          this.routes = [ this.routes ];
        }

        const promises = this.routes.map((route) => cloneSourceToRoute(route, data, compilation));

        Promise.all(promises).then(() => callback(null)).catch(callback);

      });

    });

  }

}

module.exports = HtmlWebpackRoutesPlugin;


/**
 * cloneSourceToRoute
 * @description Takes the given data and compilatiton and clones given new routes
 */

function cloneSourceToRoute(route, data, compilation) {

  const original_path = path.resolve(compilation.compiler.outputPath, data.outputName);
  const original_directory = path.dirname(original_path);
  const original_filename = path.basename(original_path);
  const new_directory = path.join(original_directory, route);
  const new_path = path.join(new_directory, original_filename);
  const path_to_original = path.relative(new_directory, original_directory);
  const assets = Assets.getAssetPaths(Assets.parseAssetsFromData(data), path_to_original) || [];

  let source = compilation.assets[data.outputName].source();

  assets.forEach((asset) => {
    source = Util.replaceScriptPath(source, asset.path_original, asset.path_new);
  });

  return writeRoute(new_path, source);

}


/**
 * writeRoute
 * @description Returns a promise that creates a new route's file given the path and source
 */

function writeRoute(new_path, source) {
  return new Promise((resolve, reject) => {

    mkdirp(path.dirname(new_path), (mkdirp_error) => {

      if ( mkdirp_error ) {
        reject(mkdirp_error);
      }

      fs.writeFile(new_path, source, (write_file_error) => {

        if (write_file_error) {
          reject(write_file_error);
        }

        resolve(new_path);

      });

    });

  });
}