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

const DEFAULT_PATH = './';

class Route {

  constructor(settings = {}) {

    this.source = Object.assign({}, settings.source || {});

    this.route_path = settings.route_path;
    this.output_name = settings.output_name;
    this.output_path = path.resolve(path.join(this.source.output_path, this.route_path));
    this.public_path = settings.public_path;
    this.path_to_source = path.relative(this.output_path, this.source.output_path) || DEFAULT_PATH;
    this.assets = settings.assets;

  }

  /**
   * isBaseRoute
   * @description Is the source path the current ouput path?
   */

  isBaseRoute() {
    return this.output_path === this.source.output_path;
  }

  /**
   * updateAssetPaths
   * @description Loops through all assets and updates the new path given it's relative path to original
   *     and replaces the instances of the old path in the source
   */

  updateAssetPaths() {
    this.assets.forEach((asset) => {

      asset.setNewPath(this.path_to_source, this.public_path);
      this.source.html = Util.replaceScriptPath(this.source.html, asset.path, asset.path_new);

    });
  }

  /**
   * prerender
   * @description Loads each asset module and tries to invoke it's application if it exists. Once it
   *     is created, it tries to render the React component and to a string and adds it to the source
   */

  prerender(settings = {}) {
    this.assets.forEach((asset) => {

      asset.loadModule();

      const $ = cheerio.load(this.source.html);
      const $root = $(settings.root || '#root');
      const rendered_application = asset.invokeApplication({
        route: this.route_path
      });

      if ( !$root || !rendered_application ) return;

      $root.html(ReactDOMServer.renderToString(rendered_application));

      this.source.html = $.html();

      return this.source.html;

    });
  }

  /**
   * writeRoute
   * @description Returns a promise that creates a new route's file given the path and source
   */

  writeRoute() {
    return new Promise((resolve, reject) => {

      const output_path = path.resolve(this.output_path);
      const output_location = path.resolve(output_path, this.output_name);

      mkdirp(output_path, (mkdirp_error) => {

        if ( mkdirp_error ) {
          reject(mkdirp_error);
        }

        fs.writeFile(output_location, this.source.html, (write_file_error) => {

          if (write_file_error) {
            reject(write_file_error);
          }

          resolve(output_location);

        });

      });

    });
  }

}

module.exports = Route;