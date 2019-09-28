"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.describe = describe;
exports.it = it;
exports.xdescribe = exports.xit = void 0;

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _Assert = require("./Assert");

var _helpers = require("./helpers");

var xit = _helpers.globalScope.xit,
    xdescribe = _helpers.globalScope.xdescribe;
exports.xdescribe = xdescribe;
exports.xit = xit;

function describe(name, func) {
  return _helpers.globalScope.describe.call(this, name, function () {
    return func.call(this);
  });
}

(0, _assign.default)(describe, _helpers.globalScope.describe);

function isFuncWithoutParameters(func) {
  return /^(async[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+)?(function)?[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*?\*?[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*?([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+[0-9A-Z_a-z]+)?\([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\)/.test(func.toString());
}

function it(name, func) {
  return _helpers.globalScope.it.call(this, name, isFuncWithoutParameters(func) ? function () {
    try {
      var result = func.call(this);

      if (result && typeof result.then === 'function') {
        return result.then(function (o) {
          _Assert.assert.assertNotHandledErrors();

          return o;
        }).catch(function (err) {
          _Assert.assert.assertNotHandledErrors();

          throw err;
        });
      }

      _Assert.assert.assertNotHandledErrors();

      return result;
    } finally {
      _Assert.assert.assertNotHandledErrors();
    }
  } : function (done) {
    try {
      return func.call(this, function (err) {
        _Assert.assert.assertNotHandledErrors();

        done(err);
      });
    } finally {
      _Assert.assert.assertNotHandledErrors();
    }
  });
}

(0, _assign.default)(it, _helpers.globalScope.it);