const HtmlWebpackPlugin = require('html-webpack-plugin');

const Util = require('./lib/util');
const Asset = require('./lib/asset');
const Route = require('./lib/route');

/**
 * HtmlWebpackRoutesPlugin
 * @description Webpack plugin based on HTML Webpack Plugin that clones routes based on given input
 * Based on https://github.com/jantimon/html-webpack-harddisk-plugin
 */

class HtmlWebpackRoutesPlugin {

  constructor(settings) {
    this.settings = settings;
  }

  apply(compiler) {

    compiler.hooks.compilation.tap('HtmlWebpackRoutesPlugin', compilation => {

      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('HtmlWebpackRoutesPlugin', (data, callback) => {;

        const base_html = data.html;

        const compiled_assets = Array.from(compilation.namedChunks).map(chunk => {

          const settings = chunk[1];

          if ( !settings ) return {};

          return {
            name: settings.name,
            paths: settings.files,
            input: compiler.options.entry[settings.name],
          };

        });

        const routes = this.routes();

        // If the input isn't an array we can't work with it

        if ( !Array.isArray(routes) ) return;

        const promises = routes.map((route = {}) => {

          const route_config = typeof route !== 'string' ? route : {
            route: route
          };

          let assets;

          // If we don't have a route property, we don't have a valid config object

          if ( !route_config.route ) return;

          assets = compiled_assets.map((asset) => new Asset(asset, compilation.compiler, compiled_assets));


          route = new Route({
            app_root: this.settings.app_root,
            output_name: data.outputName,
            route_path: route_config.route,
            public_path: compilation.options.output.publicPath,
            assets: assets,
            source: {
              output_path: compilation.compiler.outputPath,
              html: base_html,
            },
            should_prerender: this.settings.prerender || route_config.prerender
          });

          // We need to udpate all of the assets in the given route to contain the new
          // path relative to the original location

          route.updateAssetPaths();

          // Try to prerender the application

          route.prerender();

          // If the current route is the original / base, we want to replace the original HTML
          // with our new source

          if ( route.isBaseRoute() ) {
            data.html = route.source.html;
            return;
          }

          // Finally return a promise to write the route

          return route.writeRoute();

        });

        Promise.all(promises).then(() => callback(null)).catch(callback);

      });

    });

  }

  routes(settings = this.settings) {

    // Add the base path as default so we can additionally prerender if set globally

    let routes = [
      '/'
    ];

    if ( !settings ) return routes;

    // If it's an array, we want to return it as a cloned array

    if ( Array.isArray(settings) ) {
      return routes.concat(Array.from(settings));
    }

    // If it's a string, turn it into an array to normalize it and send it

    if ( typeof settings === 'string' ) {
      return routes.concat([ settings ]);
    }

    // If we have a routes property, run the same method on the routes value
    // and go through the same process again

    if ( settings.routes ) {
      return this.routes(settings.routes);
    }

  }

}

module.exports = HtmlWebpackRoutesPlugin;