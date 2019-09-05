"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports.TestDeepEqual = exports.deepCloneEqual = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _Assert = require("../../../../../../main/common/test/Assert");

var _DeepCloneEqual = require("../../../../../../main/common/test/DeepCloneEqual");

var _TestVariants2 = require("../../src/helpers/TestVariants");

function ownKeys(object, enumerableOnly) { var keys = (0, _keys.default)(object); if (_getOwnPropertySymbols.default) { var symbols = (0, _getOwnPropertySymbols.default)(object); if (enumerableOnly) symbols = (0, _filter.default)(symbols).call(symbols, function (sym) { return (0, _getOwnPropertyDescriptor.default)(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context3; (0, _forEach.default)(_context3 = ownKeys(source, true)).call(_context3, function (key) { (0, _defineProperty3.default)(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors.default) { (0, _defineProperties.default)(target, (0, _getOwnPropertyDescriptors.default)(source)); } else { var _context4; (0, _forEach.default)(_context4 = ownKeys(source)).call(_context4, function (key) { (0, _defineProperty2.default)(target, key, (0, _getOwnPropertyDescriptor.default)(source, key)); }); } } return target; }

var deepCloneEqual = new _DeepCloneEqual.DeepCloneEqual();
exports.deepCloneEqual = deepCloneEqual;

function resolveValue(opts, value) {
  if (typeof value === 'function' && !(value instanceof Error)) {
    value = value(opts);
  }

  return value;
}

function resolveOptions(optionsSource, optionsParams) {
  var resolvedOptions = _objectSpread({}, optionsSource);

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

var TestDeepEqual =
/*#__PURE__*/
function (_TestVariants) {
  (0, _inherits2.default)(TestDeepEqual, _TestVariants);

  function TestDeepEqual() {
    var _this;

    (0, _classCallCheck2.default)(this, TestDeepEqual);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(TestDeepEqual).call(this));
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
            var _context, _context2;

            console.log((0, _concat.default)(_context = "Test number: ".concat(TestDeepEqual.totalTests, "\r\nError in: ")).call(_context, inputOptions.description, "\n"), inputOptions, // ${
            // JSON.stringify(initialOptions, null, 4)
            // }
            (0, _concat.default)(_context2 = "\n".concat(inputOptions.action.toString(), "\n")).call(_context2, ex.stack));
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