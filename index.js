const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

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

        const original_path = path.resolve(compilation.compiler.outputPath, data.outputName);
        const source = compilation.assets[data.outputName].source();

        Promise.all(this.routes.map((route) => writeRoute(route, original_path, source))).then(data => {
          callback(null);
        }).catch(error => {
          callback(error);
        });

      });

    });

  }

}

module.exports = HtmlWebpackRoutesPlugin;


/**
 * writeRoute
 * @description
 */

function writeRoute(route, original_path, source) {

  const directory = path.dirname(original_path);
  const name = path.basename(original_path);

  return new Promise((resolve, reject) => {

    const new_directory = `${directory}${route}`;
    let new_path;

    mkdirp(new_directory, (mkdirp_error) => {

      if ( mkdirp_error ) {
        reject(mkdirp_error);
      }

      new_path = `${new_directory}/${name}`;

      fs.writeFile(new_path, source, (write_file_error) => {

        if (write_file_error) {
          reject(write_file_error);
        }

        resolve();

      });

    });

  });

}