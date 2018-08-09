const expect = require('chai').expect;
const Assets = require('../lib/assets');

describe('Assets', function() {

  const data = {
    plugin: {
      assetJson: '[{"entryName":"main","path":"main.js"}]'
    }
  };

  const assets = [
    {
      entryName: 'main',
      path: 'main.js'
    }
  ];

  describe('parseAssetsFromData', function() {

    it('should return an array of the asset paths', function() {

      const parsed_assets = Assets.parseAssetsFromData(data);

      expect(parsed_assets[0].entryName).to.equal(assets[0].entryName);
      expect(parsed_assets[0].path).to.equal(assets[0].path);

    });

  });


  describe('parseAssetsFromData', function() {

    it('should return a new array of the paths with the original and new location given the path to original', function() {

      const expected = [
        {
          path_new: '../main.js',
          path_original: 'main.js'
        }
      ];

      const asset_paths = Assets.getAssetPaths(assets, '../');

      expect(asset_paths[0].path_new).to.equal(expected[0].path_new);
      expect(asset_paths[0].path_original).to.equal(expected[0].path_original);

    });

  });

});