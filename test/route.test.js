const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const Route = require('../lib/route');
const Asset = require('../lib/asset');

const react_advanced = fs.readFileSync(path.resolve(__dirname, 'fixtures/react-advanced.html')).toString();
const react_advanced_page2 = fs.readFileSync(path.resolve(__dirname, 'fixtures/react-advanced-page2.html')).toString();
const compiler_react_advanced_source = fs.readFileSync(path.resolve(__dirname, 'fixtures/compiler/react-advanced-source.html')).toString();

describe('Route', function() {

  const assets = [
    new Asset({
      entry_name: 'main',
      path: 'main.cbeaab90b61a0bde349f.js',
      location: path.resolve(__dirname, '../examples/react-advanced/main.js'),
      output_path: path.resolve(__dirname, '../examples/react-advanced/')
    })
  ];

  const route_data = {
    output_name: 'index.html',
    route_path: '/page2',
    assets: assets,
    source: {
      output_path: path.resolve(__dirname, '../examples/react-advanced/dist'),
      html: compiler_react_advanced_source,
    }
  };

  it('should set up a new instance of a route', () => {

    const expected_path = '/Users/colby/Code/html-webpack-routes-plugin/examples/react-advanced/dist/page2';

    const route = new Route(route_data);

    expect(route.output_path).to.equal(expected_path);

  });


  describe('isBaseRoute', () => {

    it('should be the base route', () => {

      const route = new Route(Object.assign({}, route_data, {
        route_path: '/'
      }));

      expect(route.isBaseRoute()).to.equal(true);

    });

    it('should not be the base route', () => {

      const route = new Route(route_data);

      expect(route.isBaseRoute()).to.equal(false);

    });

  });

  describe('updateAssetPaths', () => {

    const route = new Route(route_data);

    it('should get the original and new path', () => {

      const expected_new_path = '../main.cbeaab90b61a0bde349f.js';

      expect(route.assets[0].path_new).to.equal(undefined);
      expect(route.source.html.indexOf(route.assets[0].path_new)).to.equal(-1);

      route.updateAssetPaths();

      expect(route.assets[0].path_new).to.equal(expected_new_path);
      expect(route.source.html.indexOf(route.assets[0].path_new)).to.not.equal(-1);

    });

  });

  describe('prerender', function() {

    it('should prerender the module into the document', () => {

      const route = new Route(route_data);

      route.updateAssetPaths();
      route.prerender();

      expect(route.source.html).to.equal(react_advanced_page2);

    });

    it('should prerender the module into the default path', () => {

      const route = new Route(Object.assign({}, route_data, {
        route_path: '/',
      }));

      route.updateAssetPaths();
      route.prerender();

      expect(route.source.html).to.equal(react_advanced);

    });

  });

});