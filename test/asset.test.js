require('@babel/register')({
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
});

const expect = require('chai').expect;
const Asset = require('../lib/asset');
const path = require('path');
const ReactDOMServer = require('react-dom/server');

describe('Asset', function() {

  const assets = [
    {
      entryName: 'main',
      path: 'main.js'
    }
  ];

  const asset_data = {
    entry_name: assets[0].entryName,
    path: assets[0].path,
    location: path.resolve(__dirname, '../examples/react-advanced/main.js'),
    output_path: path.resolve(__dirname, '../examples/react-advanced/')
  }

  const path_to_original = '..';

  it('should set up a new instance of an asset with the right path', () => {

    const asset = new Asset(asset_data);

    expect(asset.path).to.equal(assets[0].path);

  });

  describe('setNewPath', function() {

    it('should return an array of the asset paths', function() {

      const asset = new Asset(asset_data);

      asset.setNewPath(path_to_original);

      expect(asset.path_new).to.equal(`${path_to_original}/${asset.path}`);

    });

  });

  describe('loadModule', function() {

    it('should load the correct module', function() {

      const asset = new Asset(asset_data);

      asset.setNewPath(path_to_original);

      asset.loadModule();

      expect(asset.module).to.equal(require(path.resolve(asset.location)));

    });

  });

  describe('invokeApplication', function() {

    it('should invoke the application of the given module', function() {

      const expected = '<h1 data-reactroot="">Hello, <!-- -->!</h1>';
      const asset = new Asset(asset_data);

      let application;

      asset.setNewPath(path_to_original);

      asset.loadModule();

      application = asset.invokeApplication({
        route: this.route_path
      });

      expect(ReactDOMServer.renderToString(application)).to.equal(expected);

    });

  });

});