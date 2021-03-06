"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.assert = exports.Assert = exports.AssertionError = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/wrapNativeSuper"));

var _DeepCloneEqual = require("./DeepCloneEqual");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

var AssertionError = typeof require === 'function' // eslint-disable-next-line global-require
? require('assertion-error') : /*#__PURE__*/function (_Error) {
  (0, _inherits2.default)(_class, _Error);

  var _super = _createSuper(_class);

  function _class() {
    (0, _classCallCheck2.default)(this, _class);
    return _super.apply(this, arguments);
  }

  return _class;
}( /*#__PURE__*/(0, _wrapNativeSuper2.default)(Error));
exports.AssertionError = AssertionError;
var deepCloneEqualDefault = new _DeepCloneEqual.DeepCloneEqual();

if (!console.debug) {
  console.debug = console.info;
}

var Assert = /*#__PURE__*/function () {
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
      if (!this.deepCloneEqual.equal(actual, expected, (0, _extends2.default)({}, options, {
        circular: true
      }))) {
        this.throwAssertionError(actual, expected, message);
      }
    }
  }, {
    key: "equal",
    value: function equal(actual, expected, message) {
      // eslint-disable-next-line eqeqeq
      if (actual != expected) {
        this.throwAssertionError(actual, expected, message);
      }
    }
  }, {
    key: "notEqual",
    value: function notEqual(actual, expected, message) {
      // eslint-disable-next-line eqeqeq
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
    key: "assertError",
    value: function assertError(err, errType, regExp, message) {
      this.ok(err);

      if (err instanceof AssertionError) {
        var _context, _context2;

        var index = (0, _indexOf.default)(_context = Assert.errors).call(_context, err);
        (0, _splice.default)(_context2 = Assert.errors).call(_context2, index, 1);
      }

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
        } else if (actualErrType !== errType) {
          this.throwAssertionError(actualErrType.name, errType.name, err ? (message || '') + '\r\n' + err + '\r\n' + err.stack : message);
        }
      }

      if (regExp) {
        this.ok(regExp.test(err.message), err ? (message || '') + '\r\n' + err + '\r\n' + err.stack : message);
      }
    }
  }, {
    key: "throwsAsync",
    value: function () {
      var _throwsAsync = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(fn, errType, regExp, message) {
        var err;
        return _regenerator.default.wrap(function _callee$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return fn();

              case 3:
                _context3.next = 8;
                break;

              case 5:
                _context3.prev = 5;
                _context3.t0 = _context3["catch"](0);
                err = _context3.t0;

              case 8:
                this.assertError(err, errType, regExp, message);

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee, this, [[0, 5]]);
      }));

      function throwsAsync(_x, _x2, _x3, _x4) {
        return _throwsAsync.apply(this, arguments);
      }

      return throwsAsync;
    }()
  }, {
    key: "throws",
    value: function throws(fn, errType, regExp, message) {
      var err;

      try {
        fn();
      } catch (ex) {
        err = ex;
      }

      this.assertError(err, errType, regExp, message);
    }
  }, {
    key: "assertNotHandledErrors",
    value: function assertNotHandledErrors() {
      if (Assert.errors.length) {
        var firstError = Assert.errors[0];
        Assert.errors = [];
        throw firstError;
      }
    }
  }, {
    key: "throwAssertionError",
    // noinspection JSMethodCanBeStatic
    value: function throwAssertionError(actual, expected, message) {
      console.debug('actual: ', actual);
      console.debug('expected: ', expected);
      var error = new AssertionError(message, {
        actual: actual,
        expected: expected,
        showDiff: true
      });

      if (!Assert.errors) {
        Assert.errors = [error];
      } else {
        Assert.errors.push(error);
      }

      throw error;
    }
  }]);
  return Assert;
}();

exports.Assert = Assert;
Assert.errors = [];
var assert = new Assert();
exports.assert = assert;