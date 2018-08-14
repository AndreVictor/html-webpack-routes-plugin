const Util = require('./lib/util');
const Asset = require('./lib/asset');
const Route = require('./lib/route');

const ASSET_REGEX = new RegExp(/.*\.(js|css)$/);

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

        // Add the base path to get prerendred as well

        routes.push('/');

        const promises = routes.map((route) => {

          let assets = Util.parseStringToJson(data.plugin.assetJson);

          assets = assets.map((asset) => setupAssets(asset, compilation.compiler)).filter(filterAssets);

          route = new Route({
            output_name: data.outputName,
            route_path: route,
            assets: assets,
            source: {
              output_path: compilation.compiler.outputPath,
              html: data.html,
            }
          });

          route.updateAssetPaths();

          if ( this.settings.prerender ) {
            route.prerender(this.settings.prerender);
          }

          if ( route.isBaseRoute() ) {
            data.html = route.source.html;
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


/**
 * setupAssets
 * @description
 */

function setupAssets(asset, compiler) {

  let asset_data = {};

  asset_data.entry_name = asset.entryName;
  asset_data.path = asset.path;
  asset_data.location = compiler.options.entry[asset_data.entry_name];
  asset_data.output_path = compiler.outputPath;

  return new Asset(asset_data);

}


/**
 * filterAssets
 * @description
 */

function filterAssets(asset) {

  // Filter out any that don't match an actual asset path (css or js)

  return ASSET_REGEX.test(asset.path);

}

module.exports = HtmlWebpackRoutesPlugin;