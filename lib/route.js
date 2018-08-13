require('@babel/register')({
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
});

const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const cheerio = require('cheerio')
const ReactDOMServer = require('react-dom/server');
const Util = require('./util');

class Route {

  constructor(settings) {
    this.settings = settings || {};
    this.route_path = this.settings.route_path;
    this.output_path = this.settings.output_path;
    this.output_name = this.settings.output_name;
    this.source = this.settings.source;
    this.assets = this.settings.assets;
    this.paths = this.getPaths();
  }

  /**
   * getPaths
   * @description Sets up the path names needed for the new routes
   */

  getPaths(settings) {

    const paths = {};

    paths.original_path = path.resolve(this.output_path, this.output_name);
    paths.original_directory = path.dirname(paths.original_path);
    paths.original_filename = path.basename(paths.original_path);
    paths.new_directory = path.resolve(path.join(paths.original_directory, this.route_path));
    paths.new_path = path.resolve(path.join(paths.new_directory, paths.original_filename));
    paths.path_to_original = path.relative(paths.new_directory, paths.original_directory);

    return paths;

  }

  /**
   * updateAssetPaths
   * @description Loops through all assets and updates the new path given it's relative path to original
   *     and replaces the instances of the old path in the source
   */

  updateAssetPaths() {
    this.assets.forEach((asset) => {
      asset.setNewPathLocation(this.paths);
      this.source = Util.replaceScriptPath(this.source, asset.path, asset.path_new);
    })
  }

  /**
   * prerender
   * @description Loads each asset module and tries to invoke it's application if it exists. Once it
   *     is created, it tries to render the React component and to a string and adds it to the source
   */

  prerender(settings = {}) {
    this.assets.forEach((asset) => {

      asset.loadModule();

      const $ = cheerio.load(this.source);
      const $root = $(settings.root || '#root');
      const rendered_application = asset.invokeApplication({
        route: this.route_path
      });

      if ( !$root || !rendered_application ) return;

      $root.append(ReactDOMServer.renderToString(rendered_application));

      this.source = $.html();

    });
  }

  /**
   * writeRoute
   * @description Returns a promise that creates a new route's file given the path and source
   */

  writeRoute() {
    return new Promise((resolve, reject) => {

      mkdirp(path.dirname(this.paths.new_path), (mkdirp_error) => {

        if ( mkdirp_error ) {
          reject(mkdirp_error);
        }

        fs.writeFile(this.paths.new_path, this.source, (write_file_error) => {

          if (write_file_error) {
            reject(write_file_error);
          }

          resolve(this.paths.new_path);

        });

      });

    });
  }

}

module.exports = Route;