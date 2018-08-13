const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const Route = require('../lib/route');
const Asset = require('../lib/asset');

const basic_fixture_name = 'index.html';
const basic_fixture_path = './examples/react-prerender/dist';
const basic_fixture_location = path.resolve(basic_fixture_path, basic_fixture_name);
const basic_fixture_html = fs.readFileSync(path.resolve(__dirname, basic_fixture_location)).toString();

const react_prerender_page2 = fs.readFileSync(path.resolve(__dirname, 'fixtures/react-prerender-page2.html')).toString();

describe('Route', function() {

  let assets = [
    {
      entryName: 'main',
      path: 'main.js'
    }
  ];

  assets = assets.map((asset) => new Asset(asset));

  const route_data = {
    route_path: '/page2',
    output_path: basic_fixture_path,
    output_name: basic_fixture_name,
    source: basic_fixture_html,
    assets: assets,
  }


  it('should set up a new instance of a route', () => {

    const route = new Route(route_data);

    expect(route.output_path).to.equal(route_data.output_path);

  });

  describe('getPaths', function() {

    const route = new Route(route_data);

    it('should get the original and new path', () => {

      const expected_original_path = path.resolve(route_data.output_path, route_data.output_name);
      const expected_new_path = path.resolve(path.join(route_data.output_path, route_data.route_path, route_data.output_name));

      expect(route.paths.original_path).to.equal(expected_original_path);
      expect(route.paths.new_path).to.equal(expected_new_path);

    });

  });

  describe('updateAssetPaths', function() {

    const route = new Route(route_data);

    it('should get the original and new path', () => {

      const expected_new_path = path.join(route.paths.path_to_original, route.assets[0].path);

      expect(route.assets[0].path_new).to.equal(null);
      expect(route.source.indexOf(route.assets[0].path_new)).to.equal(-1);

      route.updateAssetPaths();

      expect(route.assets[0].path_new).to.equal(expected_new_path);
      expect(route.source.indexOf(route.assets[0].path_new)).to.not.equal(-1);

    });

  });

  describe('prerender', function() {

    const route = new Route(route_data);

    it('should prerender the module into the document', () => {

      route.updateAssetPaths();
      route.prerender();

      expect(route.source).to.equal(react_prerender_page2);

    });

  });

});