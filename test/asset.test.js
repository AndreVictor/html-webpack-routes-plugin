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
      name: 'main',
      paths: [
        'main.ea0c3cda36e987b01de6.js'
      ],
      input: [
        path.resolve(__dirname, '../examples/react-advanced/main.js'),
      ]
    },
    {
      name: 'other',
      paths: [
        'other.ea0c3cda36e987b01de6.js'
      ],
      input: [
        path.resolve(__dirname, '../examples/react-advanced/other.js'),
        path.resolve(__dirname, '../examples/react-advanced/another.js'),
      ]
    }
  ];

  const compiler = {
    options: {
      entry: {}
    }
  };

  compiler.options.entry[assets[0].entryName] = path.resolve(__dirname, '../examples/react-advanced/main.js');

  const path_to_original = '..';

  it('should set up a new instance of an asset with the right path', () => {

    const asset = new Asset(assets[0], compiler);

    expect(asset.path).to.equal(assets[0].path);

  });

  describe('setNewPath', function() {

    it('should return an array of the asset paths', function() {

      const asset = new Asset(assets[0], compiler, assets);

      asset.setNewPath(path_to_original, undefined);

      expect(asset.output_paths_new[0]).to.equal('../main.ea0c3cda36e987b01de6.js');

    });

  });

  describe('loadModules', function() {

    it('should load the correct module', function() {

      const asset = new Asset(assets[0], compiler, assets);

      asset.setNewPath(path_to_original, undefined);

      asset.loadModules();

      expect(asset.modules[0]).to.equal(require(asset.input_locations[0]));

    });

  });

  describe('invokeApplication', function() {

    it('should invoke the application of the given module', function() {

      const expected = '<h1 data-reactroot="">Hello, <!-- -->!</h1>';
      const asset = new Asset(assets[0], compiler);

      let application;

      asset.setNewPath(path_to_original);

      asset.loadModules();

      application = asset.invokeApplication({
        route: this.route_path
      });

      expect(ReactDOMServer.renderToString(application)).to.equal(expected);

    });

  });

});