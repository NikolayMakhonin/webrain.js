import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import { assert } from '../../../../../../main/common/test/Assert';
import { DeepCloneEqual } from '../../../../../../main/common/test/DeepCloneEqual';
import { TestVariants } from '../../src/helpers/TestVariants';
export var deepCloneEqual = new DeepCloneEqual();

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

export var TestDeepEqual =
/*#__PURE__*/
function (_TestVariants) {
  _inherits(TestDeepEqual, _TestVariants);

  function TestDeepEqual() {
    var _this;

    _classCallCheck(this, TestDeepEqual);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TestDeepEqual).call(this));
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

  _createClass(TestDeepEqual, [{
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
              assert.strictEqual(result, options.expected.result);
            };

            if (options.expected.error) {
              assert.throws(action, options.expected.error);
            } else {
              action();
            }

            return "break";
          }();

          if (_ret === "break") break;
        } catch (ex) {
          if (!debugIteration) {
            console.log("Test number: ".concat(TestDeepEqual.totalTests, "\r\nError in: ").concat(inputOptions.description, "\n"), inputOptions, // ${
            // JSON.stringify(initialOptions, null, 4)
            "\n".concat(inputOptions.action.toString(), "\n").concat(ex.stack));
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
}(TestVariants);
TestDeepEqual.totalTests = 0;
TestDeepEqual._instance = new TestDeepEqual();