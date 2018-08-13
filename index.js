const Util = require('./lib/util');
const Asset = require('./lib/asset');
const Route = require('./lib/route');

const asset_regex = new RegExp(/.*\.(js|css)$/);

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

      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync('HtmlWebpackRoutesPlugin', (data, callback) => {

        const routes = this.routes();

        // If the input isn't an array we can't work with it

        if ( !Array.isArray(routes) ) return;

        routes.push('/');

        const promises = routes.map((route) => {

          let assets = Util.parseStringToJson(data.plugin.assetJson);

          // Set up new asset instances and filter out any that don't match an actual asset path (css or js)

          assets = assets.map((asset) => new Asset(asset)).filter((asset) => asset_regex.test(asset.path));

          route = new Route({
            route_path: route,
            output_path: compilation.compiler.outputPath,
            output_name: data.outputName,
            source: data.html,
            assets: assets,
          });


          route.updateAssetPaths();

          if ( this.settings.prerender ) {
            route.prerender(this.settings.prerender);
          }


          if ( route.route_path === '/' ) {

            data.html = route.source;

            return;

          }

          return route.writeRoute();

        });

        Promise.all(promises).then(() => callback(null)).catch(callback);

      });

    });

  }

  routes(settings = this.settings) {

    if ( !settings ) return;

    // If it's an array, we want to return it as a cloned array

    if ( Array.isArray(settings) ) {
      return Array.from(settings);
    }

    // If it's a string, turn it into an array to normalize it and send it

    if ( typeof settings === 'string' ) {
      return [ settings ];
    }

    // If we have a routes property, run the same method on the routes value
    // and go through the same process again

    if ( settings.routes ) {
      return this.routes(settings.routes);
    }

  }

}

module.exports = HtmlWebpackRoutesPlugin;