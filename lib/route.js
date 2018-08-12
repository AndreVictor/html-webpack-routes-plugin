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
const Assets = require('./assets');

class Route {

  constructor(settings) {
    this.settings = settings || {};
    this.route_path = this.settings.route_path;
    this.output_path = this.settings.output_path;
    this.output_name = this.settings.output_name;
    this.source = this.settings.source;
    this.assets = this.settings.assets;
    this.prerender = this.settings.prerender;
    this.paths = this.getPaths();
  }

  getPaths(settings) {

    const paths = {};

    paths.original_path = path.resolve(this.output_path, this.output_name);
    paths.original_directory = path.dirname(paths.original_path);
    paths.original_filename = path.basename(paths.original_path);
    paths.new_directory = path.join(paths.original_directory, this.route_path);
    paths.new_path = path.join(paths.new_directory, paths.original_filename);
    paths.path_to_original = path.relative(paths.new_directory, paths.original_directory);

    return paths;

  }

  /**
   * cloneSourceToRoute
   * @description Takes the given data and compilation and clones given new routes
   */

  cloneSourceToRoute() {

    const assets = Assets.getAssetPaths(this.assets, this.paths.path_to_original) || [];

    assets.forEach((asset) => {

      this.source = Util.replaceScriptPath(this.source, asset.path_original, asset.path_new);

      if ( this.prerender === true ) {
        this.source = this.prerenderRoute(path.resolve(`./${asset.path_original}`), this.route_path);
      }

    });

    return this.writeRoute(this.source);

  }


  /**
   * writeRoute
   * @description Returns a promise that creates a new route's file given the path and source
   */

  writeRoute(source) {
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


  /**
   * prerender
   * @description
   */

  prerenderRoute(asset_path, route) {

    const asset = require(asset_path);
    const $ = cheerio.load(this.source);

    let rendered_application;
    let $root;

    if ( typeof asset.application !== 'function' ) return this.source;

    rendered_application = ReactDOMServer.renderToString(asset.application({ route: route }));

    $root = $('#root');

    $root.append(rendered_application);

    return $.html();

  }

}

module.exports = Route;