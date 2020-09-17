"use strict";

exports.__esModule = true;
exports.globalScope = void 0;

function getGlobalScope() {
  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  return null;
}

var globalScope = getGlobalScope();
exports.globalScope = globalScope;