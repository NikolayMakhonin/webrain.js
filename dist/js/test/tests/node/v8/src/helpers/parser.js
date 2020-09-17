"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.v8_runtime_h_to_js_functions = v8_runtime_h_to_js_functions;

var _parseInt2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/parse-int"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

// see: https://github.com/v8/v8/blob/master/src/runtime/runtime.h
// for node 4.9.1: https://github.com/v8/v8/blob/7f211533faba9dd85708b1394186c7fe99b88392/src/runtime/runtime.h
// see: https://www.npmjs.com/package/v8-natives
function v8_runtime_h_to_js_functions(runtime_h_content) {
  var matches = (0, _from.default)(runtime_h_content.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/\b([FI])\([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([0-9A-Z_a-z]+)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*,[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(\x2D?[0-9]+)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*,[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([0-9]+)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\)/g));
  var argsNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];

  function matchesToStr(matchToStr) {
    return (0, _map.default)(matches).call(matches, function (o) {
      var type = o[1];
      var name = o[2];
      var argsCount = (0, _parseInt2.default)(o[3], 10);
      var returnCount = (0, _parseInt2.default)(o[4], 10);
      var argsStr;

      if (argsCount < 0) {
        argsStr = '...args';
      } else {
        var args = [];

        for (var i = 0; i < argsCount; i++) {
          args.push(argsNames[i]);
        }

        argsStr = args.join(', ');
      }

      if (returnCount < 0) {
        throw new Error("returnCount = " + returnCount + " for " + name);
      }

      return matchToStr(name, argsStr, returnCount === 0 ? 'void' : 'any');
    }).join('\r\n') + '\r\n';
  }

  return {
    js: matchesToStr(function (name, argsStr, returnStr) {
      if (argsStr === '...args') {
        argsStr = 'a, b, c, d, e, f, g, h, i, j, k, l, m, n';
      }

      return "export function " + name + "(" + argsStr + ") {\n\treturn %" + name + "(" + argsStr + ")\n}\n";
    }),
    d_ts: matchesToStr(function (name, argsStr, returnStr) {
      return "export declare function " + name + "(" + argsStr + "): " + returnStr;
    })
  };
}