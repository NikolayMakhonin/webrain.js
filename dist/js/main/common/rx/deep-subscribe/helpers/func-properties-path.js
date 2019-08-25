"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parsePropertiesPathString = parsePropertiesPathString;
exports.parsePropertiesPath = parsePropertiesPath;
exports.getFuncPropertiesPath = getFuncPropertiesPath;

// const variablePattern = '([$A-Za-z_][$A-Za-z_]*)'
// const propertyPattern = variablePattern
function parsePropertiesPathString(getValueFunc) {
  if (typeof getValueFunc !== 'string') {
    getValueFunc = getValueFunc.toString();
  } // noinspection RegExpRedundantEscape


  const match = getValueFunc // tslint:disable-next-line:max-line-length
  .match(/^[\0-\uFFFF]*?\(?[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([0-9A-Z_a-z]+)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(?:\/\*[\0-\uFFFF]*?\*\/[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)?\)?[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(?:(?:=>[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)?\{[\0-\uFFFF]*?\breturn[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]|=>)(?:[\t-\r \(\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]|[\0-!#-&\(-\+\x2D-\uFFFF]*,)*[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\1[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([\0-\uFFFF]*?)[\t-\r ;\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\}?[\t-\r \)\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/);
  const path = match && match[2];

  if (!path) {
    throw new Error(`Error parse getValueFunc:\n${getValueFunc}\n\n` + 'This parameter should be a function which simple return nested property value, like that:\n' + '(o) => o.o["/\\"\'"].o[0].o.o\n' + 'o => (o.o["/\\"\'"].o[0].o.o)\n' + '(o) => {return o.o["/\\"\'"].o[0].o.o}\n' + 'function (o) { return o.o["/\\"\'"].o[0].o.o }\n' + 'y(o) {\n' + '\t\treturn o.o["/\\"\'"].o[0].o.o\n' + '}');
  }

  return path;
}

function parsePropertiesPath(propertiesPathString) {
  const propertiesPath = [];
  const remains = propertiesPathString.replace( // tslint:disable-next-line:max-line-length
  /(?:\.[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([0-9A-Z_a-z]+)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*|\[[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(?:([0-9]+)|("(?:[\0-!#-\[\]-\uFFFF]*|\\[\0-\uFFFF])+"|'(?:[\0-&\(-\[\]-\uFFFF]*|\\[\0-\uFFFF])+'))[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\][\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*|(\/\/)[\0-\t\x0B\f\x0E-\uFFFF]*[\n\r]+[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*|(\/\*)[\0-\uFFFF]*?\*\/[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)/g, (s, g1, g2, g3, g4, g5) => {
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

function getFuncPropertiesPath(getValueFunc) {
  let propertiesPath = getValueFunc[PROPERTIES_PATH_CACHE_ID];

  if (!propertiesPath) {
    getValueFunc[PROPERTIES_PATH_CACHE_ID] = propertiesPath = parsePropertiesPath(parsePropertiesPathString(getValueFunc));
  }

  return propertiesPath;
}