const path = require('path');
const Util = require('./util');

class Asset {

  constructor(data = {}) {

    this.path = data.path;
    this.path_new = data.path_new;
    this.entry_name = data.entry_name || Util.filenameFromPath(this.path);
    this.location = data.location && path.resolve(data.location);
    this.module = null;

  }

  /**
   * setNewPath
   * @description Given the new path location, sets up the instance's new path
   */

  setNewPath(path_to_original) {

    if ( !path_to_original ) {
      return;
    }

    this.path_new = path.join(path_to_original, this.path);

  }

  /**
   * loadModule
   * @description Loads the module via the original path
   */

  loadModule() {

    if ( !this.location ) {
      return;
    }

    this.module = require(path.resolve(this.location));

  }

  /**
   * invokeApplication
   * @description Given the loaded application
   */

  invokeApplication(data) {

    if ( !this.module ) this.loadModule();

    return typeof this.module.application === 'function' && this.module.application(data);

  }

}

module.exports = Asset;