"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.TestDeepEqual = exports.deepCloneEqual = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _Assert = require("../../../../../../main/common/test/Assert");

var _DeepCloneEqual = require("../../../../../../main/common/test/DeepCloneEqual");

var _TestVariants2 = require("../../src/helpers/TestVariants");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

var deepCloneEqual = new _DeepCloneEqual.DeepCloneEqual();
exports.deepCloneEqual = deepCloneEqual;

function resolveValue(opts, value) {
  if (typeof value === 'function' && !(value instanceof Error)) {
    value = value(opts);
  }

  return value;
}

function resolveOptions(optionsSource, optionsParams) {
  var resolvedOptions = (0, _extends2.default)({}, optionsSource);

  for (var key in resolvedOptions) {
    if (Object.prototype.hasOwnProperty.call(resolvedOptions, key)) {
      resolvedOptions[key] = key === 'action' ? resolvedOptions[key] : resolveValue(optionsParams || resolvedOptions, resolvedOptions[key]);
    }
  }

  resolvedOptions.expected = {};

  for (var _key in optionsSource.expected) {
    if (Object.prototype.hasOwnProperty.call(optionsSource.expected, _key)) {
      resolvedOptions.expected[_key] = resolveValue(optionsParams || resolvedOptions, optionsSource.expected[_key]);
    }
  }

  return resolvedOptions;
}

var TestDeepEqual = /*#__PURE__*/function (_TestVariants) {
  (0, _inherits2.default)(TestDeepEqual, _TestVariants);

  var _super = _createSuper(TestDeepEqual);

  function TestDeepEqual() {
    var _this;

    (0, _classCallCheck2.default)(this, TestDeepEqual);
    _this = _super.call(this);
    _this.baseOptionsVariants = {
      circular: [false, true],
      noCrossReferences: [false, true],
      equalTypes: [false, true],
      equalInnerReferences: [false, true],
      equalMapSetOrder: [false, true],
      strictEqualFunctions: [false, true]
    };
    return _this;
  }

  (0, _createClass2.default)(TestDeepEqual, [{
    key: "testVariant",
    value: function testVariant(inputOptions) {
      var error;

      for (var debugIteration = 0; debugIteration < 3; debugIteration++) {
        try {
          var _ret = function () {
            var options = inputOptions = resolveOptions(inputOptions, null);

            var action = function action() {
              var result = deepCloneEqual.equal(options.value1, options.value2, {
                circular: options.circular,
                equalTypes: options.equalTypes,
                noCrossReferences: options.noCrossReferences,
                equalInnerReferences: options.equalInnerReferences,
                equalMapSetOrder: options.equalMapSetOrder,
                strictEqualFunctions: options.strictEqualFunctions
              });

              _Assert.assert.strictEqual(result, options.expected.result);
            };

            if (options.expected.error) {
              _Assert.assert.throws(action, options.expected.error);
            } else {
              action();
            }

            return "break";
          }();

          if (_ret === "break") break;
        } catch (ex) {
          if (!debugIteration) {
            console.log("Test number: " + TestDeepEqual.totalTests + "\r\nError in: " + inputOptions.description + "\n", inputOptions, // ${
            // JSON.stringify(initialOptions, null, 4)
            // }
            "\n" + inputOptions.action.toString() + "\n" + ex.stack);
            error = ex;
          }
        } finally {
          TestDeepEqual.totalTests++;
        }
      }

      if (error) {
        throw error;
      }
    }
  }], [{
    key: "test",
    value: function test(testCases) {
      if (!testCases.actions) {
        // tslint:disable-next-line:no-empty
        testCases.actions = [function () {}];
      }

      TestDeepEqual._instance.test(testCases);
    }
  }]);
  return TestDeepEqual;
}(_TestVariants2.TestVariants);

exports.TestDeepEqual = TestDeepEqual;
TestDeepEqual.totalTests = 0;
TestDeepEqual._instance = new TestDeepEqual();