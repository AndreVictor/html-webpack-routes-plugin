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

function replaceScriptPath(source, original_path, new_path) {
  const regex = new RegExp(createScriptTag(original_path), 'ig');
  return source.replace(regex, createScriptTag(new_path));
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