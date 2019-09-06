"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.assert = exports.Assert = exports.AssertionError = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/wrapNativeSuper"));

var _DeepCloneEqual = require("./DeepCloneEqual");

/* tslint:disable:no-var-requires triple-equals */
var AssertionError = typeof require === 'function' ? require('assertion-error') :
/*#__PURE__*/
function (_Error) {
  (0, _inheritsLoose2.default)(_class, _Error);

  function _class() {
    return _Error.apply(this, arguments) || this;
  }

  return _class;
}((0, _wrapNativeSuper2.default)(Error));
exports.AssertionError = AssertionError;
var deepCloneEqualDefault = new _DeepCloneEqual.DeepCloneEqual();

var Assert =
/*#__PURE__*/
function () {
  function Assert(deepCloneEqual) {
    this.deepCloneEqual = deepCloneEqual || deepCloneEqualDefault;
  }

  var _proto = Assert.prototype;

  _proto.fail = function fail(message) {
    this.throwAssertionError(null, null, message);
  };

  _proto.ok = function ok(value, message) {
    if (!value) {
      this.throwAssertionError(value, true, message);
    }
  };

  _proto.notOk = function notOk(value, message) {
    if (value) {
      this.throwAssertionError(value, false, message);
    }
  };

  _proto.strictEqual = function strictEqual(actual, expected, message) {
    if (actual !== expected) {
      this.throwAssertionError(actual, expected, message);
    }
  };

  _proto.notStrictEqual = function notStrictEqual(actual, expected, message) {
    if (actual === expected) {
      this.throwAssertionError(actual, expected, message);
    }
  };

  _proto.deepStrictEqual = function deepStrictEqual(actual, expected, message, options) {
    if (!this.deepCloneEqual.equal(actual, expected, options)) {
      this.throwAssertionError(actual, expected, message);
    }
  };

  _proto.circularDeepStrictEqual = function circularDeepStrictEqual(actual, expected, message, options) {
    if (!this.deepCloneEqual.equal(actual, expected, (0, _extends2.default)({}, options, {
      circular: true
    }))) {
      this.throwAssertionError(actual, expected, message);
    }
  };

  _proto.equal = function equal(actual, expected, message) {
    // noinspection EqualityComparisonWithCoercionJS
    if (actual != expected) {
      this.throwAssertionError(actual, expected, message);
    }
  };

  _proto.notEqual = function notEqual(actual, expected, message) {
    // noinspection EqualityComparisonWithCoercionJS
    if (actual == expected) {
      this.throwAssertionError(actual, expected, message);
    }
  };

  _proto.equalCustom = function equalCustom(actual, expected, check, message) {
    if (!check(actual, expected)) {
      this.throwAssertionError(actual, expected, message);
    }
  };

  _proto.throws = function throws(fn, errType, regExp, message) {
    var err;

    try {
      fn();
    } catch (ex) {
      err = ex;
    }

    this.ok(err);

    if (errType) {
      var actualErrType = err.constructor;

      if ((0, _isArray.default)(errType)) {
        if (!(0, _some.default)(errType).call(errType, function (o) {
          return o === actualErrType;
        })) {
          this.throwAssertionError(actualErrType.name, (0, _map.default)(errType).call(errType, function (o) {
            return o && o.name;
          }), err ? (message || '') + '\r\n' + err + '\r\n' + err.stack : message);
        }
      } else {
        if (actualErrType !== errType) {
          this.throwAssertionError(actualErrType.name, errType.name, err ? (message || '') + '\r\n' + err + '\r\n' + err.stack : message);
        }
      }
    }

    if (regExp) {
      this.ok(regExp.test(err.message));
    }
  } // noinspection JSMethodCanBeStatic
  ;

  _proto.throwAssertionError = function throwAssertionError(actual, expected, message) {
    throw new AssertionError(message, {
      actual: actual,
      expected: expected,
      showDiff: true
    });
  };

  return Assert;
}();

exports.Assert = Assert;
var assert = new Assert();
exports.assert = assert;