/**
 * getRegex
 * @description Caches regex creation to avoid additional resources used each validation check
 */

let regex_cache = {};

function getRegex( pattern, flags = '' ) {

  const cache_key = `${pattern}${flags}`;

  if ( regex_cache[cache_key]) {

    return regex_cache[cache_key];

  }

  regex_cache[cache_key] = new RegExp( pattern, flags );

  return regex_cache[cache_key];

}

module.exports.getRegex = getRegex;


/**
 * createScriptTag
 * @description Creates a script tag string given the source
 */

function createScriptTag(source) {
  return `<script src="${source}"></script>`;
}

module.exports.createScriptTag = createScriptTag;


/**
 * replaceScriptPath
 * @description Replaces the path of a script tag given the new value
 */

function replaceScriptPath(source, original_paths, new_paths) {

  if ( !Array.isArray(original_paths) ) {
    original_paths = [ original_paths ];
  }

  if ( !Array.isArray(new_paths) ) {
    new_paths = [ new_paths ];
  }

  original_paths.forEach((path, index) => {

    const regex = getRegex(createScriptTag(path), 'ig');

    source = source.replace(regex, createScriptTag(new_paths[index]));

  });

  return source;

}

module.exports.replaceScriptPath = replaceScriptPath;


/**
 * parseStringToJson
 * @description Takes a given string and tries to parse it to JSON
 */

function parseStringToJson(string) {

  let json = {};

  try {
    json = JSON.parse(string);
  } catch(e) {
    console.error(`Error parsing JSON: ${e}`);
  }

  return json;

}

module.exports.parseStringToJson = parseStringToJson;


/**
 * filenameFromPath
 * @description Grabs the last piece of the string path, which if includes the filename, will
 *     be the filename
 */

function filenameFromPath(string) {

  if ( typeof string !== 'string' ) return;

  const split = string.split('/');

  return split[split.length - 1];

}

module.exports.filenameFromPath = filenameFromPath;


/**
 * extensionFromPath
 * @description
 */

function extensionFromPath(string) {

  if ( typeof string !== 'string' ) return;

  const split = string.split('.');

  return split[split.length - 1];

}

module.exports.extensionFromPath = extensionFromPath;