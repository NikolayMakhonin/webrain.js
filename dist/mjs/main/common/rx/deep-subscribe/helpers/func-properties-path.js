// const variablePattern = '([$A-Za-z_][$A-Za-z_]*)'
// const propertyPattern = variablePattern
export function parsePropertiesPathString(getValueFunc) {
  if (typeof getValueFunc !== 'string') {
    getValueFunc = getValueFunc.toString();
  } // noinspection RegExpRedundantEscape


  const match = getValueFunc // tslint:disable-next-line:max-line-length
  .match(/^.*?\(?\s*(\w+)\s*(?:\/\*.*?\*\/\s*)?\)?\s*(?:(?:=>\s*)?\{.*?\breturn\s|=>)(?:[\s(]|[^'",]*,)*\s*\1\s*(.*?)[\s;]*\}?[\s)]*$/s);
  const path = match && match[2];

  if (!path) {
    throw new Error(`Error parse getValueFunc:\n${getValueFunc}\n\n` + 'This parameter should be a function which simple return nested property value, like that:\n' + '(o) => o.o["/\\"\'"].o[0].o.o\n' + 'o => (o.o["/\\"\'"].o[0].o.o)\n' + '(o) => {return o.o["/\\"\'"].o[0].o.o}\n' + 'function (o) { return o.o["/\\"\'"].o[0].o.o }\n' + 'y(o) {\n' + '\t\treturn o.o["/\\"\'"].o[0].o.o\n' + '}');
  }

  return path;
}
export function parsePropertiesPath(propertiesPathString) {
  const propertiesPath = [];
  const remains = propertiesPathString.replace( // tslint:disable-next-line:max-line-length
  /(?:\.\s*(\w+)\s*|\[\s*(?:(\d+)|("(?:[^\\"]*|\\.)+"|'(?:[^\\']*|\\.)+'))\s*]\s*|(\/\/)[^\r\n]*[\r\n]+\s*|(\/\*).*?\*\/\s*)/gs, (s, g1, g2, g3, g4, g5) => {
    if (!g4 && !g5) {
      propertiesPath.push(g1 || g2 || g3 && new Function('return ' + g3)());
    }

    return '';
  });

  if (remains) {
    throw new Error(`Error parse properties path from:\n${propertiesPathString}\nerror in: ${remains}`);
  }

  return propertiesPath;
}
const PROPERTIES_PATH_CACHE_ID = 'propertiesPath_26lds5zs9ft';
export function getFuncPropertiesPath(getValueFunc) {
  let propertiesPath = getValueFunc[PROPERTIES_PATH_CACHE_ID];

  if (!propertiesPath) {
    getValueFunc[PROPERTIES_PATH_CACHE_ID] = propertiesPath = parsePropertiesPath(parsePropertiesPathString(getValueFunc));
  }

  return propertiesPath;
}