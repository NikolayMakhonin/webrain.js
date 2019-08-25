// const variablePattern = '([$A-Za-z_][$A-Za-z_]*)'
// const propertyPattern = variablePattern
export function parsePropertiesPathString(getValueFunc) {
  if (typeof getValueFunc !== 'string') {
    getValueFunc = getValueFunc.toString();
  } // noinspection RegExpRedundantEscape


  var match = getValueFunc // tslint:disable-next-line:max-line-length
  .match(/^[\0-\uFFFF]*?\(?[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([0-9A-Z_a-z]+)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(?:\/\*[\0-\uFFFF]*?\*\/[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)?\)?[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(?:(?:=>[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)?\{[\0-\uFFFF]*?\breturn[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]|=>)(?:[\t-\r \(\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]|[\0-!#-&\(-\+\x2D-\uFFFF]*,)*[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\1[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([\0-\uFFFF]*?)[\t-\r ;\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\}?[\t-\r \)\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/);
  var path = match && match[2];

  if (!path) {
    throw new Error("Error parse getValueFunc:\n".concat(getValueFunc, "\n\n") + 'This parameter should be a function which simple return nested property value, like that:\n' + '(o) => o.o["/\\"\'"].o[0].o.o\n' + 'o => (o.o["/\\"\'"].o[0].o.o)\n' + '(o) => {return o.o["/\\"\'"].o[0].o.o}\n' + 'function (o) { return o.o["/\\"\'"].o[0].o.o }\n' + 'y(o) {\n' + '\t\treturn o.o["/\\"\'"].o[0].o.o\n' + '}');
  }

  return path;
}
export function parsePropertiesPath(propertiesPathString) {
  var propertiesPath = [];
  var remains = propertiesPathString.replace( // tslint:disable-next-line:max-line-length
  /(?:\.[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([0-9A-Z_a-z]+)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*|\[[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(?:([0-9]+)|("(?:[\0-!#-\[\]-\uFFFF]*|\\[\0-\uFFFF])+"|'(?:[\0-&\(-\[\]-\uFFFF]*|\\[\0-\uFFFF])+'))[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\][\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*|(\/\/)[\0-\t\x0B\f\x0E-\uFFFF]*[\n\r]+[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*|(\/\*)[\0-\uFFFF]*?\*\/[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)/g, function (s, g1, g2, g3, g4, g5) {
    if (!g4 && !g5) {
      propertiesPath.push(g1 || g2 || g3 && new Function('return ' + g3)());
    }

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