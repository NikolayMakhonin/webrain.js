"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports.isRefer = isRefer;
exports.TestMerger = exports.TypeMetaMergerCollectionMock = exports.NEWER = exports.OLDER = exports.BASE = exports.NONE = exports.deepCloneEqual = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isFrozen = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/is-frozen"));

var _mergers = require("../../../../../../../main/common/extensions/merge/mergers");

var _objectUniqueId = require("../../../../../../../main/common/lists/helpers/object-unique-id");

var _SortedList = require("../../../../../../../main/common/lists/SortedList");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _DeepCloneEqual = require("../../../../../../../main/common/test/DeepCloneEqual");

var _TestVariants2 = require("../../../src/helpers/TestVariants");

function ownKeys(object, enumerableOnly) { var keys = (0, _keys.default)(object); if (_getOwnPropertySymbols.default) { var symbols = (0, _getOwnPropertySymbols.default)(object); if (enumerableOnly) symbols = (0, _filter.default)(symbols).call(symbols, function (sym) { return (0, _getOwnPropertyDescriptor.default)(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context3; (0, _forEach.default)(_context3 = ownKeys(source, true)).call(_context3, function (key) { (0, _defineProperty3.default)(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors.default) { (0, _defineProperties.default)(target, (0, _getOwnPropertyDescriptors.default)(source)); } else { var _context4; (0, _forEach.default)(_context4 = ownKeys(source)).call(_context4, function (key) { (0, _defineProperty2.default)(target, key, (0, _getOwnPropertyDescriptor.default)(source, key)); }); } } return target; }

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
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator2.default)(o), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;
            list.add(cloneNested(item));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
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
  (0, _inherits2.default)(TypeMetaMergerCollectionMock, _TypeMetaMergerCollec);

  function TypeMetaMergerCollectionMock() {
    var _this;

    (0, _classCallCheck2.default)(this, TypeMetaMergerCollectionMock);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(TypeMetaMergerCollectionMock).call(this));
    _this._resetFuncs = [];
    return _this;
  }

  (0, _createClass2.default)(TypeMetaMergerCollectionMock, [{
    key: "getMeta",
    value: function getMeta(type) {
      var meta = (0, _get2.default)((0, _getPrototypeOf2.default)(TypeMetaMergerCollectionMock.prototype), "getMeta", this).call(this, type); // assert.ok(meta, `Meta not found for type: ${typeToDebugString(type)}`)

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
  (0, _inherits2.default)(TestMerger, _TestVariants);

  function TestMerger() {
    var _this2;

    (0, _classCallCheck2.default)(this, TestMerger);
    _this2 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(TestMerger).call(this));
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

  (0, _createClass2.default)(TestMerger, [{
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
                  if (actual !== NONE && actual != null && (0, _typeof2.default)(actual) === 'object' && actual.constructor !== String && actual.constructor !== Number && actual.constructor !== Boolean && (0, _objectUniqueId.canHaveUniqueId)(actual) || typeof actual === 'function') {
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
            var _context, _context2;

            console.log((0, _concat.default)(_context = "Test number: ".concat(TestMerger.totalTests, "\r\nError in: ")).call(_context, initialOptions.description, "\n"), initialOptions, // ${
            // JSON.stringify(initialOptions, null, 4)
            // }
            (0, _concat.default)(_context2 = "\n".concat(initialOptions.action.toString(), "\n")).call(_context2, ex.stack));
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
}(_TestVariants2.TestVariants);

exports.TestMerger = TestMerger;
TestMerger.totalTests = 0;
TestMerger._instance = new TestMerger();