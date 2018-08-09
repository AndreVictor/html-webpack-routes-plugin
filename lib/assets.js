const path = require('path');

/**
 * parseAssets
 * @description Takes the given set of source data and returns the asset array
 */

function parseAssetsFromData(data = {}) {

  let assets = [];

  if ( !data.plugin || !data.plugin.assetJson ) return assets;

  try {
    assets = JSON.parse(data.plugin.assetJson);
  } catch(e) {
    console.error(`Error parsing assets: ${e}`);
  }

  return assets;

}

module.exports.parseAssetsFromData = parseAssetsFromData;


/**
 * getAssetPaths
 * @description Takes an array of assets and the path to get to the original source and
 *     returns an array of original and new
 */

function getAssetPaths(assets, path_to_original) {

  if ( !Array.isArray(assets) || !path_to_original ) return [];

  return assets.map((asset) => {

    // Some instances return as an object and some as the string itself

    const asset_path = asset.path || asset;

    // path.join errors if the values aren't strings, double check before proceeding

    if ( typeof asset_path !== 'string' || typeof path_to_original !== 'string' ) return {};

    return {
      path_original: asset.path,
      path_new: path.join(path_to_original, asset_path),
    }

  });

}

module.exports.getAssetPaths = getAssetPaths;