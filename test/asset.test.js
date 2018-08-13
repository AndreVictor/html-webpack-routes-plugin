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

  it('should set up a new instance of an asset with the right path', () => {

    const asset = new Asset(assets[0]);

    expect(asset.path).to.equal(assets[0].path);

  });

  describe('setNewPathLocation', function() {

    it('should return an array of the asset paths', function() {

      const asset = new Asset(assets[0]);
      const path_to_original = '../../';

      asset.setNewPathLocation({
        path_to_original: path_to_original,
        original_directory: 'asdf',
      });

      expect(asset.path_new).to.equal(`${path_to_original}${assets[0].path.replace('./', '')}`);

    });

  });

  describe('loadModule', function() {

    it('should load the correct module', function() {

      const asset = new Asset(assets[0]);
      const path_to_original = '../';

      asset.setNewPathLocation({
        path_to_original: path_to_original,
        original_directory: path.resolve(__dirname, '../examples/react-prerender/dist'),
      });

      asset.loadModule();

      expect(asset.module).to.equal(require(path.resolve(asset.location)));

    });

  });

  describe('invokeApplication', function() {

    it('should invoke the application of the given module', function() {

      const expected = '<h1 data-reactroot="">Hello, <!-- -->!</h1>';
      const asset = new Asset(assets[0]);
      const path_to_original = '../';
      let application;

      asset.setNewPathLocation({
        path_to_original: path_to_original,
        original_directory: path.resolve(__dirname, '../examples/react-prerender/dist'),
      });

      asset.loadModule();

      application = asset.invokeApplication({
        route: this.route_path
      });

      expect(ReactDOMServer.renderToString(application)).to.equal(expected);

    });

  });

});