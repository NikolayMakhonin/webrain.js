import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _createClass from "@babel/runtime/helpers/createClass";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _wrapNativeSuper from "@babel/runtime/helpers/wrapNativeSuper";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/* tslint:disable:no-var-requires triple-equals */
import { DeepCloneEqual } from './DeepCloneEqual';
export var AssertionError = typeof require === 'function' ? require('assertion-error') :
/*#__PURE__*/
function (_Error) {
  _inherits(_class, _Error);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
  }

  return _class;
}(_wrapNativeSuper(Error));
var deepCloneEqualDefault = new DeepCloneEqual();
export var Assert =
/*#__PURE__*/
function () {
  function Assert(deepCloneEqual) {
    _classCallCheck(this, Assert);

    this.deepCloneEqual = deepCloneEqual || deepCloneEqualDefault;
  }

  _createClass(Assert, [{
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

        if (Array.isArray(errType)) {
          if (!errType.some(function (o) {
            return o === actualErrType;
          })) {
            this.throwAssertionError(actualErrType.name, errType.map(function (o) {
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
export var assert = new Assert();