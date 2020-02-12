"use strict";

exports.__esModule = true;
exports.createCallWithArgs = createCallWithArgs;

function createCallWithArgs() {
  var args = arguments;
  return function (func) {
    return func.apply(this, args);
  };
}