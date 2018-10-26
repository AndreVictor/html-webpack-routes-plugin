const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const Route = require('../lib/route');
const Asset = require('../lib/asset');

const react_advanced = fs.readFileSync(path.resolve(__dirname, 'fixtures/react-advanced.html')).toString();
const react_advanced_page2 = fs.readFileSync(path.resolve(__dirname, 'fixtures/react-advanced-page2.html')).toString();

describe('Route', function() {

  const hash = '37ea9f69d0037c6c54e0';

  const compiler = {
    options: {
      entry: {
        main: path.resolve(__dirname, '../examples/react-advanced/main.js')
      }
    }
  };

  let assets = [
    {
      name: 'main',
      paths: [
        `main.${hash}.js`
      ],
      input: [
        path.resolve(__dirname, '../examples/react-advanced/main.js'),
      ]
    },
    {
      name: 'other',
      paths: [
        `other.${hash}.js`
      ],
      input: [
        path.resolve(__dirname, '../examples/react-advanced/other.js'),
        path.resolve(__dirname, '../examples/react-advanced/another.js'),
      ]
    }
  ];

  assets = assets.map(asset => new Asset(asset, compiler, assets));

  const route_data = {
    output_name: 'index.html',
    route_path: '/page2',
    assets: assets,
    source: {
      output_path: path.resolve(__dirname, '../examples/react-advanced/dist'),
      html: react_advanced,
    }
  };

  it('should set up a new instance of a route', () => {

    const expected_path = path.resolve(__dirname, '../examples/react-advanced/dist/page2');

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

      const expected_new_path = `../main.${hash}.js`;

      expect(route.assets[0].output_paths_new).to.equal(null);

      route.updateAssetPaths();

      expect(route.assets[0].output_paths_new[0]).to.equal(expected_new_path);
      expect(route.source.html.indexOf(route.assets[0].output_paths_new[0])).to.not.equal(-1);

    });

  });

  describe('prerender', function() {

    it('should prerender the module into the document', () => {

      const route = new Route(Object.assign({}, route_data, {
        app_root: '#custom-app-root-id',
      }));

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