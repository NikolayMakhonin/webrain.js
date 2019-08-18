import _typeof from "@babel/runtime/helpers/typeof";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _get from "@babel/runtime/helpers/get";
import _inherits from "@babel/runtime/helpers/inherits";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/* tslint:disable:no-construct use-primitive-type */
// import clone from 'clone'
import { ObjectMerger, TypeMetaMergerCollection } from '../../../../../../../main/common/extensions/merge/mergers';
import { canHaveUniqueId } from '../../../../../../../main/common/lists/helpers/object-unique-id';
import { SortedList } from '../../../../../../../main/common/lists/SortedList';
import { Assert } from '../../../../../../../main/common/test/Assert';
import { DeepCloneEqual, isPrimitiveDefault } from '../../../../../../../main/common/test/DeepCloneEqual';
import { TestVariants } from '../../../src/helpers/TestVariants';
export var deepCloneEqual = new DeepCloneEqual({
  commonOptions: {
    circular: true,
    customIsPrimitive: function customIsPrimitive(o) {
      if (isPrimitiveDefault(o)) {
        return true;
      }

      if (o.constructor === Number || o.constructor === Boolean || o.constructor === String && Object.isFrozen(o) || !canHaveUniqueId(o)) {
        return true;
      }

      return null;
    }
  },
  cloneOptions: {
    customClone: function customClone(o, setInstance, cloneNested) {
      if (o.constructor === SortedList) {
        var list = new SortedList({
          autoSort: o.autoSort,
          notAddIfExists: o.notAddIfExists,
          compare: o.compare
        });
        setInstance(list);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = o[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;
            list.add(cloneNested(item));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return list;
      }

      return null;
    }
  },
  equalOptions: {
    equalInnerReferences: true,
    strictEqualFunctions: true,
    customEqual: function customEqual(o1, o2, equal) {
      if (o1.constructor === SortedList) {
        // tslint:disable-next-line:no-collapsible-if
        if (o1.constructor === o2.constructor) {
          if (!equal(o1.autoSort, o2.autoSort)) {
            return false;
          }

          if (!equal(o1.notAddIfExists, o2.notAddIfExists)) {
            return false;
          }

          if (!equal(o1.compare, o2.compare)) {
            return false;
          }
        } // let count = 0
        // for (const item of o2) {
        // 	if (!o1.contains(item)) {
        // 		return false
        // 	}
        // 	count++
        // }
        // if (!equal(o1.size, count)) {
        // 	return false
        // }

      }

      return null;
    }
  }
});
var assert = new Assert(deepCloneEqual);
export var NONE = Object.freeze(new String('NONE'));
export var BASE = Object.freeze(new String('BASE'));
export var OLDER = Object.freeze(new String('OLDER'));
export var NEWER = Object.freeze(new String('NEWER'));
export var TypeMetaMergerCollectionMock =
/*#__PURE__*/
function (_TypeMetaMergerCollec) {
  _inherits(TypeMetaMergerCollectionMock, _TypeMetaMergerCollec);

  function TypeMetaMergerCollectionMock() {
    var _this;

    _classCallCheck(this, TypeMetaMergerCollectionMock);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TypeMetaMergerCollectionMock).call(this));
    _this._resetFuncs = [];
    return _this;
  }

  _createClass(TypeMetaMergerCollectionMock, [{
    key: "getMeta",
    value: function getMeta(type) {
      var meta = _get(_getPrototypeOf(TypeMetaMergerCollectionMock.prototype), "getMeta", this).call(this, type); // assert.ok(meta, `Meta not found for type: ${typeToDebugString(type)}`)


      if (meta && this.changeMetaFunc) {
        var resetFunc = this.changeMetaFunc(meta);

        if (resetFunc) {
          this._resetFuncs.push(resetFunc);
        }
      }

      return meta;
    }
  }, {
    key: "reset",
    value: function reset() {
      for (var i = 0, len = this._resetFuncs.length; i < len; i++) {
        this._resetFuncs[i]();
      }

      this._resetFuncs = [];
    }
  }]);

  return TypeMetaMergerCollectionMock;
}(TypeMetaMergerCollection);
TypeMetaMergerCollectionMock["default"] = new TypeMetaMergerCollectionMock();
var merger = new ObjectMerger(TypeMetaMergerCollectionMock["default"]);

function isPreferClone(options, initialValue) {
  switch (initialValue) {
    case BASE:
      if (options.base != null && options.base.constructor === Object && Object.isFrozen(options.base)) {
        return true;
      }

      return options.preferCloneMeta == null ? options.preferCloneOlderParam && options.base === options.older || options.preferCloneNewerParam && options.base === options.newer : options.preferCloneMeta;

    case NONE:
      return false;

    case NEWER:
      if (options.newer != null && options.newer.constructor === Object && Object.isFrozen(options.newer)) {
        return true;
      }

      return options.preferCloneMeta == null ? options.preferCloneNewerParam || options.preferCloneOlderParam && options.newer === options.older : options.preferCloneMeta;

    case OLDER:
      if (options.older != null && options.older.constructor === Object && Object.isFrozen(options.older)) {
        return true;
      }

      return options.preferCloneMeta == null ? options.preferCloneOlderParam || options.preferCloneNewerParam && options.newer === options.older : options.preferCloneMeta;

    default:
      return true;
  }
}

function resolveValue(opts, value, functions, refers) {
  if (functions && typeof value === 'function' && !(value instanceof Error)) {
    value = value(opts);
  }

  if (refers) {
    var i = 0;

    while (true) {
      i++;

      if (i > 10) {
        throw new Error("Value cannot be resolved: ".concat(value));
      }

      switch (value) {
        case BASE:
          value = opts.base;
          continue;

        case OLDER:
          value = opts.older;
          continue;

        case NEWER:
          value = opts.newer;
          continue;
      }

      break;
    }
  }

  return value;
}

function resolveOptions(optionsSource, optionsParams, functions, refers, clone) {
  var resolvedOptions = _objectSpread({}, optionsSource);

  if (clone) {
    if (!Object.isFrozen(resolvedOptions.base) && !isRefer(resolvedOptions.base)) {
      resolvedOptions.base = deepCloneEqual.clone(resolvedOptions.base);
    }

    if (!Object.isFrozen(resolvedOptions.older) && !isRefer(resolvedOptions.older)) {
      resolvedOptions.older = deepCloneEqual.clone(resolvedOptions.older);
    }

    if (!Object.isFrozen(resolvedOptions.newer) && !isRefer(resolvedOptions.newer)) {
      resolvedOptions.newer = deepCloneEqual.clone(resolvedOptions.newer);
    }
  }

  for (var key in resolvedOptions) {
    if (Object.prototype.hasOwnProperty.call(resolvedOptions, key)) {
      resolvedOptions[key] = key === 'action' ? resolvedOptions[key] : resolveValue(optionsParams || resolvedOptions, resolvedOptions[key], false, refers);
    }
  }

  resolvedOptions.preferCloneBase = isPreferClone(optionsParams || resolvedOptions, BASE);
  resolvedOptions.preferCloneOlder = isPreferClone(optionsParams || resolvedOptions, OLDER);
  resolvedOptions.preferCloneNewer = isPreferClone(optionsParams || resolvedOptions, NEWER);
  resolvedOptions.expected = {};

  for (var _key in optionsSource.expected) {
    if (Object.prototype.hasOwnProperty.call(optionsSource.expected, _key)) {
      resolvedOptions.expected[_key] = resolveValue(optionsParams || resolvedOptions, optionsSource.expected[_key], functions, refers);
    }
  }

  return resolvedOptions;
}

export function isRefer(value) {
  return value === BASE || value === OLDER || value === NEWER;
}
export var TestMerger =
/*#__PURE__*/
function (_TestVariants) {
  _inherits(TestMerger, _TestVariants);

  function TestMerger() {
    var _this2;

    _classCallCheck(this, TestMerger);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(TestMerger).call(this));
    _this2.baseOptionsVariants = {
      base: [],
      older: [],
      newer: [],
      preferCloneOlderParam: [null, false, true],
      preferCloneNewerParam: [null, false, true],
      preferCloneMeta: [null, false, true],
      valueType: [null],
      valueFactory: [null],
      setFunc: [false, true]
    };
    return _this2;
  }

  _createClass(TestMerger, [{
    key: "testVariant",
    value: function testVariant(inputOptions) {
      var error;

      for (var debugIteration = 0; debugIteration < 3; debugIteration++) {
        // if (TestMerger.totalTests >= 457) {
        // 	new Date().getTime()
        // }
        var initialOptions = inputOptions;
        var inputOptionsClone = deepCloneEqual.clone(inputOptions);

        try {
          var _ret = function () {
            var options = resolveOptions(initialOptions, null, true, true, true); // options = resolveOptions(options, options, true, true, false)

            initialOptions = resolveOptions(initialOptions, options, true, false, true);
            initialOptions.baseIsFrozen = Object.isFrozen(options.base);
            initialOptions.olderIsFrozen = Object.isFrozen(options.older);
            initialOptions.newerIsFrozen = Object.isFrozen(options.newer);

            if (options.preferCloneMeta == null) {
              TypeMetaMergerCollectionMock["default"].changeMetaFunc = null;
            } else {
              TypeMetaMergerCollectionMock["default"].changeMetaFunc = function (meta) {
                if (!meta.isMocked) {
                  var preferClone = meta.preferClone;

                  if (preferClone !== false) {
                    meta.isMocked = true;

                    if (typeof preferClone !== 'function') {
                      meta.preferClone = options.preferCloneMeta;
                    } else {
                      meta.preferClone = function (target) {
                        var calcPreferClone = preferClone(target);

                        if (calcPreferClone === false) {
                          return calcPreferClone;
                        }

                        return options.preferCloneMeta;
                      };
                    }

                    return function () {
                      meta.preferClone = preferClone;
                      delete meta.isMocked;
                    };
                  }
                }

                return null;
              };
            }

            var setValue = NONE;
            var setCount = 0;
            var returnValue = NONE;
            var initialBase = isPreferClone(initialOptions, initialOptions.expected.base) ? deepCloneEqual.clone(options.expected.base) : options.expected.base;
            var initialOlder = isPreferClone(initialOptions, initialOptions.expected.older) && !(options.older === options.base && !isPreferClone(initialOptions, initialOptions.expected.base)) ? deepCloneEqual.clone(options.expected.older) : options.expected.older;
            var initialNewer = isPreferClone(initialOptions, initialOptions.expected.newer) && !(options.newer === options.base && !isPreferClone(initialOptions, initialOptions.expected.base)) ? deepCloneEqual.clone(options.expected.newer) : options.expected.newer;

            var action = function action() {
              returnValue = merger.merge(options.base, options.older, options.newer, options.setFunc && function (o) {
                setValue = o;
                setCount++;
              }, options.preferCloneOlderParam, options.preferCloneNewerParam, options.valueType || options.valueFactory ? {
                valueType: options.valueType,
                valueFactory: options.valueFactory
              } : void 0);
            };

            if (options.expected.error) {
              assert["throws"](action, options.expected.error);
            } else {
              action();

              var assertValue = function assertValue(actual, expected, strict) {
                if (expected && expected !== NONE && expected.constructor === String) {
                  expected = expected.valueOf();
                }

                if (actual && actual !== NONE && actual.constructor === String) {
                  actual = actual.valueOf();
                }

                if (strict) {
                  assert.strictEqual(actual, expected);
                } else {
                  if (actual !== NONE && actual != null && _typeof(actual) === 'object' && actual.constructor !== String && actual.constructor !== Number && actual.constructor !== Boolean && canHaveUniqueId(actual) || typeof actual === 'function') {
                    assert.notStrictEqual(actual, expected);
                    assert.notStrictEqual(actual, options.base);
                    assert.notStrictEqual(actual, options.older);
                    assert.notStrictEqual(actual, options.newer);
                  }

                  deepCloneEqual.equal(actual, expected, {
                    noCrossReferences: true
                  });
                }
              };

              assertValue(setValue, options.expected.setValue, isPreferClone(initialOptions, initialOptions.expected.setValue) !== true);
              assert.strictEqual(returnValue, options.expected.returnValue);
              assert.strictEqual(setCount, options.expected.setValue !== NONE ? 1 : 0);
              deepCloneEqual.equal(options.base, initialBase);
              deepCloneEqual.equal(options.older, initialOlder);
              deepCloneEqual.equal(options.newer, initialNewer); // assertValue(options.base, options.expected.base, isRefer(initialOptions.expected.base))
              // assertValue(options.older, options.expected.older, isRefer(initialOptions.expected.older))
              // assertValue(options.newer, options.expected.newer, isRefer(initialOptions.expected.newer))
            }

            assert.circularDeepStrictEqual(inputOptions, inputOptionsClone);
            return "break";
          }();

          if (_ret === "break") break;
        } catch (ex) {
          if (!debugIteration) {
            console.log("Test number: ".concat(TestMerger.totalTests, "\r\nError in: ").concat(initialOptions.description, "\n"), initialOptions, // ${
            // JSON.stringify(initialOptions, null, 4)
            // }
            "\n".concat(initialOptions.action.toString(), "\n").concat(ex.stack));
            error = ex;
          }
        } finally {
          TypeMetaMergerCollectionMock["default"].reset();
          TestMerger.totalTests++;
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

      TestMerger._instance.test(testCases);
    }
  }]);

  return TestMerger;
}(TestVariants);
TestMerger.totalTests = 0;
TestMerger._instance = new TestMerger();