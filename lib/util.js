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