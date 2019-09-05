"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports.assert = exports.Assert = exports.AssertionError = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/wrapNativeSuper"));

var _DeepCloneEqual = require("./DeepCloneEqual");

function ownKeys(object, enumerableOnly) { var keys = (0, _keys.default)(object); if (_getOwnPropertySymbols.default) { var symbols = (0, _getOwnPropertySymbols.default)(object); if (enumerableOnly) symbols = (0, _filter.default)(symbols).call(symbols, function (sym) { return (0, _getOwnPropertyDescriptor.default)(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context; (0, _forEach.default)(_context = ownKeys(source, true)).call(_context, function (key) { (0, _defineProperty3.default)(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors.default) { (0, _defineProperties.default)(target, (0, _getOwnPropertyDescriptors.default)(source)); } else { var _context2; (0, _forEach.default)(_context2 = ownKeys(source)).call(_context2, function (key) { (0, _defineProperty2.default)(target, key, (0, _getOwnPropertyDescriptor.default)(source, key)); }); } } return target; }

var AssertionError = typeof require === 'function' ? require('assertion-error') :
/*#__PURE__*/
function (_Error) {
  (0, _inherits2.default)(_class, _Error);

  function _class() {
    (0, _classCallCheck2.default)(this, _class);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(_class).apply(this, arguments));
  }

  return _class;
}((0, _wrapNativeSuper2.default)(Error));
exports.AssertionError = AssertionError;
var deepCloneEqualDefault = new _DeepCloneEqual.DeepCloneEqual();

var Assert =
/*#__PURE__*/
function () {
  function Assert(deepCloneEqual) {
    (0, _classCallCheck2.default)(this, Assert);
    this.deepCloneEqual = deepCloneEqual || deepCloneEqualDefault;
  }

  (0, _createClass2.default)(Assert, [{
    key: "fail",
    value: function fail(message) {
      this.throwAssertionError(null, null, message);
    }
  }, {
    key: "ok",
    value: function ok(value, message) {
      if (!value) {
        this.throwAssertionError(value, true, message);
      }
    }
  }, {
    key: "notOk",
    value: function notOk(value, message) {
      if (value) {
        this.throwAssertionError(value, false, message);
      }
    }
  }, {
    key: "strictEqual",
    value: function strictEqual(actual, expected, message) {
      if (actual !== expected) {
        this.throwAssertionError(actual, expected, message);
      }
    }
  }, {
    key: "notStrictEqual",
    value: function notStrictEqual(actual, expected, message) {
      if (actual === expected) {
        this.throwAssertionError(actual, expected, message);
      }
    }
  }, {
    key: "deepStrictEqual",
    value: function deepStrictEqual(actual, expected, message, options) {
      if (!this.deepCloneEqual.equal(actual, expected, options)) {
        this.throwAssertionError(actual, expected, message);
      }
    }
  }, {
    key: "circularDeepStrictEqual",
    value: function circularDeepStrictEqual(actual, expected, message, options) {
      if (!this.deepCloneEqual.equal(actual, expected, _objectSpread({}, options, {
        circular: true
      }))) {
        this.throwAssertionError(actual, expected, message);
      }
    }
  }, {
    key: "equal",
    value: function equal(actual, expected, message) {
      // noinspection EqualityComparisonWithCoercionJS
      if (actual != expected) {
        this.throwAssertionError(actual, expected, message);
      }
    }
  }, {
    key: "notEqual",
    value: function notEqual(actual, expected, message) {
      // noinspection EqualityComparisonWithCoercionJS
      if (actual == expected) {
        this.throwAssertionError(actual, expected, message);
      }
    }
  }, {
    key: "equalCustom",
    value: function equalCustom(actual, expected, check, message) {
      if (!check(actual, expected)) {
        this.throwAssertionError(actual, expected, message);
      }
    }
  }, {
    key: "throws",
    value: function throws(fn, errType, regExp, message) {
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

  }, {
    key: "throwAssertionError",
    value: function throwAssertionError(actual, expected, message) {
      throw new AssertionError(message, {
        actual: actual,
        expected: expected,
        showDiff: true
      });
    }
  }]);
  return Assert;
}();

exports.Assert = Assert;
var assert = new Assert();
exports.assert = assert;