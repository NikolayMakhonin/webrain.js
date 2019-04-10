var variablePattern = '([$A-Za-z_][$A-Za-z_]*)';
var propertyPattern = variablePattern;
export function parsePropertiesPathString(getValueFunc) {
  if (typeof getValueFunc !== 'string') {
    getValueFunc = getValueFunc.toString();
  }

  var match = getValueFunc.match(/^.*?(?:\(\s*)?(\w+)(?:\s*\))?\s*(?:(?:=>\s*)?{\s*return\s|=>)[\s(]*\1\s*(.*?)[\s;]*}?[\s)]*$/);
  var path = match && match[2];

  if (!path) {
    throw new Error("Error parse getValueFunc:\n".concat(getValueFunc, "\n\n") + 'This parameter should be a function which simple return nested property value, like that:\n' + '(o) => o.o["/\\"\'"].o[0].o.o\n' + 'o => (o.o["/\\"\'"].o[0].o.o)\n' + '(o) => {return o.o["/\\"\'"].o[0].o.o}\n' + 'function (o) { return o.o["/\\"\'"].o[0].o.o }\n' + 'y(o) {\n' + '\t\treturn o.o["/\\"\'"].o[0].o.o\n' + '}');
  }

  return path;
}
export function parsePropertiesPath(propertiesPathString) {
  var propertiesPath = [];
  var remains = propertiesPathString.replace(/(?:\.\s*(\w+)\s*|\[\s*(?:(\d+)|("(?:[^\\"]*|\\.)+"|'(?:[^\\']*|\\.)+'))\s*]\s*)/g, function (s, g1, g2, g3, g4) {
    propertiesPath.push(g1 || g2 || g3 && new Function('return ' + g3)());
    return '';
  });

  if (remains) {
    throw new Error("Error parse properties path from:\n".concat(propertiesPathString, "\nerror in: ").concat(remains));
  }

  return propertiesPath;
}
var PROPERTIES_PATH_CACHE_ID = 'propertiesPath_26lds5zs9ft';
export function getFuncPropertiesPath(getValueFunc) {
  var propertiesPath = getValueFunc[PROPERTIES_PATH_CACHE_ID];

  if (!propertiesPath) {
    getValueFunc[PROPERTIES_PATH_CACHE_ID] = propertiesPath = parsePropertiesPath(parsePropertiesPathString(getValueFunc));
  }

  return propertiesPath;
}