const path = require('path');
const Util = require('./util');

const MODULE_EXTENSIONS_TO_LOAD = [
  'js'
];

class Asset {

  constructor(data = {}, compiler = {}, compiled_assets) {

    this.entry_name = data.name;

    this.input_locations = data.input;
    this.output_paths = data.paths;
    this.output_locations = mapResolve(this.output_paths, compiler.outputPath);
    this.output_paths_new = null;

    this.modules = null;

  }

  /**
   * setNewPath
   * @description Given the new path location, sets up the instance's new path
   */

  setNewPath(path_to_original, public_path) {

    if ( public_path ) {
      this.output_paths_new = Array.from(this.output_paths);
      return;
    }

    if ( !path_to_original ) {
      return;
    }

    this.output_paths_new = this.output_paths.map(item => path.join(path_to_original, item));

  }

  /**
   * loadModules
   * @description Loads the module via the original path
   */

  loadModules() {

    let modules = this.input_locations;

    if ( !Array.isArray(modules) ) {
      modules = [ modules ];
    }

    this.modules = modules.filter(item => MODULE_EXTENSIONS_TO_LOAD.includes(Util.extensionFromPath(item)))
      .map(item => typeof item === 'string' && require(path.resolve(item)));

  }

  /**
   * invokeApplication
   * @description Given the loaded application
   */

  invokeApplication(data) {

    if ( !Array.isArray(this.modules) ) this.loadModules();
    if ( !Array.isArray(this.modules) ) return;

    const module = this.modules.filter(module => typeof module.application === 'function')[0];

    return module && module.application(data);

  }

}

function mapResolve(arr, source) {

  if ( Array.isArray(arr) ) {

    if ( typeof item !== 'string' ) return;

    return arr.map(item => path.resolve(source || '', item));

  }

  return mapResolve([arr]);

}

module.exports = Asset;