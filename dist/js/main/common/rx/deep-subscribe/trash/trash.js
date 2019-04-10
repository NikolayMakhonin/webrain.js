"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test = test;
exports.DeepSubscribe = void 0;

var _deepSubscribe = require("../deep-subscribe");

// region Test
function test(o) {
  return o;
}

test({
  a__: 'true'
}); // endregion

class DeepSubscribe extends _deepSubscribe.RuleBuilder {
  constructor(object) {
    super();
    this._object = object;
  }

}

exports.DeepSubscribe = DeepSubscribe;