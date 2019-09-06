"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.isRefer = isRefer;
exports.TestMerger = exports.TypeMetaMergerCollectionMock = exports.NEWER = exports.OLDER = exports.BASE = exports.NONE = exports.deepCloneEqual = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _isFrozen = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/is-frozen"));

var _mergers = require("../../../../../../../main/common/extensions/merge/mergers");

var _objectUniqueId = require("../../../../../../../main/common/lists/helpers/object-unique-id");

var _SortedList = require("../../../../../../../main/common/lists/SortedList");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _DeepCloneEqual = require("../../../../../../../main/common/test/DeepCloneEqual");

var _TestVariants2 = require("../../../src/helpers/TestVariants");

/* tslint:disable:no-construct use-primitive-type */
// import clone from 'clone'
var deepCloneEqual = new _DeepCloneEqual.DeepCloneEqual({
  commonOptions: {
    circular: true,
    customIsPrimitive: function customIsPrimitive(o) {
      if ((0, _DeepCloneEqual.isPrimitiveDefault)(o)) {
        return true;
      }

      if (o.constructor === Number || o.constructor === Boolean || o.constructor === String && (0, _isFrozen.default)(o) || !(0, _objectUniqueId.canHaveUniqueId)(o)) {
        return true;
      }

      return null;
    }
  },
  cloneOptions: {
    customClone: function customClone(o, setInstance, cloneNested) {
      if (o.constructor === _SortedList.SortedList) {
        var list = new _SortedList.SortedList({
          autoSort: o.autoSort,
          notAddIfExists: o.notAddIfExists,
          compare: o.compare
        });
        setInstance(list);

        for (var _iterator = o, _isArray = (0, _isArray2.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var item = _ref;
          list.add(cloneNested(item));
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
      if (o1.constructor === _SortedList.SortedList) {
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
exports.deepCloneEqual = deepCloneEqual;
var assert = new _Assert.Assert(deepCloneEqual);
var NONE = (0, _freeze.default)(new String('NONE'));
exports.NONE = NONE;
var BASE = (0, _freeze.default)(new String('BASE'));
exports.BASE = BASE;
var OLDER = (0, _freeze.default)(new String('OLDER'));
exports.OLDER = OLDER;
var NEWER = (0, _freeze.default)(new String('NEWER'));
exports.NEWER = NEWER;

var TypeMetaMergerCollectionMock =
/*#__PURE__*/
function (_TypeMetaMergerCollec) {
  (0, _inheritsLoose2.default)(TypeMetaMergerCollectionMock, _TypeMetaMergerCollec);

  function TypeMetaMergerCollectionMock() {
    var _this;

    _this = _TypeMetaMergerCollec.call(this) || this;
    _this._resetFuncs = [];
    return _this;
  }

  var _proto = TypeMetaMergerCollectionMock.prototype;

  _proto.getMeta = function getMeta(type) {
    var meta = _TypeMetaMergerCollec.prototype.getMeta.call(this, type); // assert.ok(meta, `Meta not found for type: ${typeToDebugString(type)}`)


    if (meta && this.changeMetaFunc) {
      var resetFunc = this.changeMetaFunc(meta);

      if (resetFunc) {
        this._resetFuncs.push(resetFunc);
      }
    }

    return meta;
  };

  _proto.reset = function reset() {
    for (var i = 0, len = this._resetFuncs.length; i < len; i++) {
      this._resetFuncs[i]();
    }

    this._resetFuncs = [];
  };

  return TypeMetaMergerCollectionMock;
}(_mergers.TypeMetaMergerCollection);

exports.TypeMetaMergerCollectionMock = TypeMetaMergerCollectionMock;
TypeMetaMergerCollectionMock.default = new TypeMetaMergerCollectionMock();
var merger = new _mergers.ObjectMerger(TypeMetaMergerCollectionMock.default);

function isPreferClone(options, initialValue) {
  switch (initialValue) {
    case BASE:
      if (options.base != null && options.base.constructor === Object && (0, _isFrozen.default)(options.base)) {
        return true;
      }

      return options.preferCloneMeta == null ? options.preferCloneOlderParam && options.base === options.older || options.preferCloneNewerParam && options.base === options.newer : options.preferCloneMeta;

    case NONE:
      return false;

    case NEWER:
      if (options.newer != null && options.newer.constructor === Object && (0, _isFrozen.default)(options.newer)) {
        return true;
      }

      return options.preferCloneMeta == null ? options.preferCloneNewerParam || options.preferCloneOlderParam && options.newer === options.older : options.preferCloneMeta;

    case OLDER:
      if (options.older != null && options.older.constructor === Object && (0, _isFrozen.default)(options.older)) {
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
        throw new Error("Value cannot be resolved: " + value);
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
  var resolvedOptions = (0, _extends2.default)({}, optionsSource);

  if (clone) {
    if (!(0, _isFrozen.default)(resolvedOptions.base) && !isRefer(resolvedOptions.base)) {
      resolvedOptions.base = deepCloneEqual.clone(resolvedOptions.base);
    }

    if (!(0, _isFrozen.default)(resolvedOptions.older) && !isRefer(resolvedOptions.older)) {
      resolvedOptions.older = deepCloneEqual.clone(resolvedOptions.older);
    }

    if (!(0, _isFrozen.default)(resolvedOptions.newer) && !isRefer(resolvedOptions.newer)) {
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

function isRefer(value) {
  return value === BASE || value === OLDER || value === NEWER;
}

var TestMerger =
/*#__PURE__*/
function (_TestVariants) {
  (0, _inheritsLoose2.default)(TestMerger, _TestVariants);

  function TestMerger() {
    var _this2;

    _this2 = _TestVariants.call(this) || this;
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

  var _proto2 = TestMerger.prototype;

  _proto2.testVariant = function testVariant(inputOptions) {
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
          initialOptions.baseIsFrozen = (0, _isFrozen.default)(options.base);
          initialOptions.olderIsFrozen = (0, _isFrozen.default)(options.older);
          initialOptions.newerIsFrozen = (0, _isFrozen.default)(options.newer);

          if (options.preferCloneMeta == null) {
            TypeMetaMergerCollectionMock.default.changeMetaFunc = null;
          } else {
            TypeMetaMergerCollectionMock.default.changeMetaFunc = function (meta) {
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
            assert.throws(action, options.expected.error);
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
                if (actual !== NONE && actual != null && typeof actual === 'object' && actual.constructor !== String && actual.constructor !== Number && actual.constructor !== Boolean && (0, _objectUniqueId.canHaveUniqueId)(actual) || typeof actual === 'function') {
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
          console.log("Test number: " + TestMerger.totalTests + "\r\nError in: " + initialOptions.description + "\n", initialOptions, // ${
          // JSON.stringify(initialOptions, null, 4)
          // }
          "\n" + initialOptions.action.toString() + "\n" + ex.stack);
          error = ex;
        }
      } finally {
        TypeMetaMergerCollectionMock.default.reset();
        TestMerger.totalTests++;
      }
    }

    if (error) {
      throw error;
    }
  };

  TestMerger.test = function test(testCases) {
    if (!testCases.actions) {
      // tslint:disable-next-line:no-empty
      testCases.actions = [function () {}];
    }

    TestMerger._instance.test(testCases);
  };

  return TestMerger;
}(_TestVariants2.TestVariants);

exports.TestMerger = TestMerger;
TestMerger.totalTests = 0;
TestMerger._instance = new TestMerger();