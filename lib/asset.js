const path = require('path');

class Asset {

  constructor(data) {
    this.path = data.path;
    this.path_new = null;
    this.module = null;
  }

  /**
   * setNewPathLocation
   * @description Given the new path location, sets up the instance's new path
   */

  setNewPathLocation({ path_to_original, original_directory }) {

    if ( !path_to_original ) {
      return;
    }

    if ( !original_directory ) {
      return;
    }

    this.path_new = path.join(path_to_original, this.path);
    this.location = path.resolve(path.join(original_directory, path_to_original, this.path));

    return this.location;

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