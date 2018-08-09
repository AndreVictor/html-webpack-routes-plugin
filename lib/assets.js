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
  if ( !Array.isArray(assets) ) return [];
  return assets.map((asset) => {
    return {
      path_original: asset.path,
      path_new: path.join(path_to_original, asset.path),
    }
  });
}

module.exports.getAssetPaths = getAssetPaths;