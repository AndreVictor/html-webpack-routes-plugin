const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const webpack = require('webpack');
const config = require('../examples/react-advanced/webpack.config');

describe('React Advanced', function() {

  this.timeout(4000);

  let results;
  let output_path;
  let output_filename;
  let output_directory;
  let route_paths;

  before(() => {
    return new Promise((resolve, reject) => {
      webpack(config, (error, result) => {

        if ( error ) {
          reject(error);
        }

        results = result;
        output_path = path.resolve(results.compilation.assets['index.html'].existsAt);
        output_filename = path.basename(output_path);
        output_directory = path.dirname(output_path);

        route_paths = config.plugins[2].settings.routes.map(route => {
          return path.join(output_directory, route.route || route, output_filename);
        });

        resolve();

      });
    })
  });

  it('should create original route', () => {

    const source = results.compilation.assets['index.html'].source();
    const fixture = fs.readFileSync(path.resolve(__dirname, 'fixtures/react-advanced.html')).toString();

    expect(source).to.equal(fixture);

  });

  it('should clone original to Page 1 route with public path in place', () => {

    const cloned_source = fs.readFileSync(route_paths[0]).toString();
    const cloned_fixture = fs.readFileSync(path.resolve(__dirname, 'fixtures/react-advanced-page1.html')).toString();

    expect(cloned_source).to.equal(cloned_fixture);

  });

  it('should clone original to Page 2 route with public path in place', () => {

    const cloned_source = fs.readFileSync(route_paths[1]).toString();
    const cloned_fixture = fs.readFileSync(path.resolve(__dirname, 'fixtures/react-advanced-page2.html')).toString();

    expect(cloned_source).to.equal(cloned_fixture);

  });

  it('should clone original to Page 3 route with public path in place', () => {

    const cloned_source = fs.readFileSync(route_paths[2]).toString();
    const cloned_fixture = fs.readFileSync(path.resolve(__dirname, 'fixtures/react-advanced-page3.html')).toString();

    expect(cloned_source).to.equal(cloned_fixture);

  });

});