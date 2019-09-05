"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _isFrozen = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/is-frozen"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _mergers = require("../../../../../../main/common/extensions/merge/mergers");

var _ArrayMap = require("../../../../../../main/common/lists/ArrayMap");

var _ArraySet = require("../../../../../../main/common/lists/ArraySet");

var _objectUniqueId = require("../../../../../../main/common/lists/helpers/object-unique-id");

var _set2 = require("../../../../../../main/common/lists/helpers/set");

var _ObjectHashMap = require("../../../../../../main/common/lists/ObjectHashMap");

var _ObjectMap = require("../../../../../../main/common/lists/ObjectMap");

var _ObjectSet = require("../../../../../../main/common/lists/ObjectSet");

var _ObservableMap = require("../../../../../../main/common/lists/ObservableMap");

var _ObservableSet = require("../../../../../../main/common/lists/ObservableSet");

var _SortedList = require("../../../../../../main/common/lists/SortedList");

var _Property = require("../../../../../../main/common/rx/object/properties/Property");

var _Assert = require("../../../../../../main/common/test/Assert");

var _helpers = require("../../src/helpers/helpers");

var _TestMerger = require("./src/TestMerger");

function ownKeys(object, enumerableOnly) { var keys = (0, _keys.default)(object); if (_getOwnPropertySymbols.default) { var symbols = (0, _getOwnPropertySymbols.default)(object); if (enumerableOnly) symbols = (0, _filter.default)(symbols).call(symbols, function (sym) { return (0, _getOwnPropertyDescriptor.default)(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context5; (0, _forEach.default)(_context5 = ownKeys(source, true)).call(_context5, function (key) { (0, _defineProperty3.default)(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors.default) { (0, _defineProperties.default)(target, (0, _getOwnPropertyDescriptors.default)(source)); } else { var _context6; (0, _forEach.default)(_context6 = ownKeys(source)).call(_context6, function (key) { (0, _defineProperty2.default)(target, key, (0, _getOwnPropertyDescriptor.default)(source, key)); }); } } return target; }

var assert = new _Assert.Assert(_TestMerger.deepCloneEqual);
// declare function deepStrictEqual(a, b): boolean
// declare function circularDeepStrictEqual(a, b): boolean
// declare function deepCloneEqual.clone<T = any>(o: T): T
describe('common > extensions > merge > ObjectMerger', function () {
  this.timeout(60000);
  var testMerger = _TestMerger.TestMerger.test;
  after(function () {
    console.log('Total ObjectMerger tests >= ' + _TestMerger.TestMerger.totalTests);
  });

  function canBeReferObject(value) {
    return value != null && !(0, _TestMerger.isRefer)(value) && (isObject(value) || typeof value === 'function');
  }

  function mustBeSet(o) {
    if (!o.setFunc) {
      return false;
    }

    if (o.base === o.older && o.base === o.newer) {
      return false;
    } // if (isObject(o.base) && Object.isFrozen(o.base)) {
    // 	return true
    // }


    if (o.base instanceof Class && (_TestMerger.deepCloneEqual.equal(o.base, o.older) || _TestMerger.deepCloneEqual.equal(o.base.value, o.older) && isObject(o.older)) && (_TestMerger.deepCloneEqual.equal(o.base, o.newer) || _TestMerger.deepCloneEqual.equal(o.base.value, o.newer) && isObject(o.newer))) {
      return false;
    }

    return !_TestMerger.deepCloneEqual.equal(o.base, o.newer) || !_TestMerger.deepCloneEqual.equal(o.base, o.older);
  }

  function isObject(value) {
    return value != null && value.constructor === Object && (0, _objectUniqueId.canHaveUniqueId)(value);
  }

  function mustBeFilled(o) {
    return !o.preferCloneBase && isObject(o.base) && (!_TestMerger.deepCloneEqual.equal(o.base, o.newer) && isObject(o.newer) || _TestMerger.deepCloneEqual.equal(o.base, o.newer) && !_TestMerger.deepCloneEqual.equal(o.base, o.older) && isObject(o.older));
  }

  var Class =
  /*#__PURE__*/
  function () {
    function Class(value) {
      (0, _classCallCheck2.default)(this, Class);
      this.value = value;
    }

    (0, _createClass2.default)(Class, [{
      key: "_canMerge",
      value: function _canMerge(source) {
        if (source.constructor !== Class && source.constructor !== Object) {
          return false;
        }

        return true;
      }
    }, {
      key: "_merge",
      value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
        var _this = this;

        var changed = false;
        changed = merge(this.value, older instanceof Class ? older.value : older, newer instanceof Class ? newer.value : newer, function (o) {
          _this.value = o;
        }, null, null, {
          selfAsValueOlder: !(older instanceof Class),
          selfAsValueNewer: !(newer instanceof Class)
        }) || changed;
        return changed;
      }
    }]);
    return Class;
  }();

  (0, _mergers.registerMergeable)(Class);
  describe('combinations', function () {
    var options = {
      preferCloneOlderParam: [null, false, true],
      preferCloneNewerParam: [null, false, true],
      preferCloneMeta: [null, false, true],
      valueType: [null],
      valueFactory: [null],
      setFunc: [false, true],
      exclude: function exclude(o) {
        // if (o.older.constructor === Object && o.newer.constructor === Object) {
        // 	return true
        // }
        if (o.newer === _TestMerger.NEWER || (o.base === _TestMerger.NEWER || o.older === _TestMerger.NEWER) && !canBeReferObject(o.newer)) {
          return true;
        }

        if (o.older === _TestMerger.OLDER || (o.base === _TestMerger.OLDER || o.newer === _TestMerger.OLDER) && !canBeReferObject(o.older)) {
          return true;
        }

        if (o.base === _TestMerger.BASE || (o.older === _TestMerger.BASE || o.newer === _TestMerger.BASE) && !canBeReferObject(o.base)) {
          return true;
        }

        if (isObject(o.base) && isObject(o.older) && isObject(o.newer)) {
          return true;
        }

        if (o.preferCloneMeta != null && (isObject(o.older) || isObject(o.newer))) {
          return true;
        }

        if (isObject(o.base) && !(0, _isFrozen.default)(o.base) && !(0, _TestMerger.isRefer)(o.base)) {
          o.base = _TestMerger.deepCloneEqual.clone(o.base);
        }

        if (isObject(o.older) && !(0, _isFrozen.default)(o.older) && !(0, _TestMerger.isRefer)(o.older)) {
          o.older = _TestMerger.deepCloneEqual.clone(o.older);
        }

        return false;
      },
      expected: {
        error: null,
        returnValue: function returnValue(o) {
          return mustBeSet(o) || mustBeFilled(o);
        },
        setValue: function setValue(o) {
          if (!mustBeSet(o)) {
            return _TestMerger.NONE;
          }

          if (isObject(o.base)) {
            if (isObject(o.newer)) {
              if (_TestMerger.deepCloneEqual.equal(o.base, o.newer)) {
                if (isObject(o.older)) {
                  return o.preferCloneBase ? _TestMerger.deepCloneEqual.clone(o.older) : _TestMerger.NONE;
                } else {
                  return _TestMerger.OLDER;
                }
              } else {
                return o.preferCloneBase ? _TestMerger.deepCloneEqual.clone(o.newer) : _TestMerger.NONE;
              }
            }
          } else if (isObject(o.older) && isObject(o.newer)) {
            if (_TestMerger.deepCloneEqual.equal(o.older, o.newer)) {
              return !o.preferCloneNewer ? _TestMerger.NEWER : o.preferCloneOlder ? _TestMerger.deepCloneEqual.clone(o.newer) : _TestMerger.OLDER;
            } else {
              return o.preferCloneOlder ? _TestMerger.deepCloneEqual.clone(o.newer) : _TestMerger.OLDER;
            }
          }

          if (isObject(o.base) && isObject(o.older) && isObject(o.newer)) {
            return o.preferCloneBase ? _TestMerger.deepCloneEqual.clone(_TestMerger.deepCloneEqual.equal(o.base, o.newer) ? o.older : o.newer) : _TestMerger.NONE;
          }

          if (o.base instanceof Class && (o.older instanceof Class || isObject(o.older)) && (o.newer instanceof Class || isObject(o.newer))) {
            return _TestMerger.NONE;
          }

          if (o.base instanceof Class && !(o.older instanceof Class || isObject(o.older)) && (o.newer instanceof Class || isObject(o.newer)) && !_TestMerger.deepCloneEqual.equal(o.base, o.newer) && !_TestMerger.deepCloneEqual.equal(o.base.value, o.newer)) {
            return _TestMerger.NONE;
          }

          if (isObject(o.base) && !(0, _isFrozen.default)(o.base) && !isObject(o.older) && isObject(o.newer) && !_TestMerger.deepCloneEqual.equal(o.base, o.newer)) {
            return _TestMerger.NONE;
          }

          if (!(o.base instanceof Class) && o.older instanceof Class && (o.newer instanceof Class || isObject(o.newer))) {
            return _TestMerger.OLDER;
          }

          if (!_TestMerger.deepCloneEqual.equal(o.base, o.newer) && o.older !== o.newer && _TestMerger.deepCloneEqual.equal(o.older, o.newer) && o.older instanceof Date && o.newer instanceof Date && o.preferCloneNewer && !o.preferCloneOlder) {
            return _TestMerger.OLDER;
          }

          if ((o.older instanceof Class || isObject(o.older)) && isObject(o.newer) && (o.preferCloneOlder && !_TestMerger.deepCloneEqual.equal(o.older, o.newer) || o.preferCloneOlder && o.preferCloneNewer) || o.newer === o.older && (o.preferCloneOlder || o.preferCloneNewer)) {
            return _TestMerger.deepCloneEqual.clone(o.newer);
          }

          if (isObject(o.older) && !(0, _isFrozen.default)(o.older) && isObject(o.newer)) {
            return _TestMerger.OLDER;
          }

          return !(_TestMerger.deepCloneEqual.equal(o.base, o.newer) || o.base instanceof Class && _TestMerger.deepCloneEqual.equal(o.base.value, o.newer) && isObject(o.newer)) || o.newer !== o.base && isObject(o.base) && (0, _isFrozen.default)(o.base) ? _TestMerger.NEWER : _TestMerger.OLDER;
        },
        base: _TestMerger.BASE,
        older: _TestMerger.OLDER,
        newer: _TestMerger.NEWER
      },
      actions: null
    };
    it('complex objects', function () {
      var complexObjectOptions = {
        undefined: true,
        function: true,
        array: true,
        circular: true,
        circularClass: true,
        set: true,
        arraySet: true,
        objectSet: true,
        observableSet: true,
        map: true,
        arrayMap: true,
        objectMap: true,
        observableMap: true,
        sortedList: true
      };

      var createValues = function createValues() {
        return [_TestMerger.BASE, _TestMerger.OLDER, _TestMerger.NEWER, (0, _helpers.createComplexObject)(complexObjectOptions)];
      }; // testMerger({
      // 	base: [OLDER],
      // 	older: createValues(),
      // 	newer: createValues(),
      // 	preferCloneOlderParam: [true],
      // 	preferCloneNewerParam: [null],
      // 	preferCloneMeta: [null],
      // 	options: [null, {}],
      // 	valueType: [null],
      // 	valueFactory: [null],
      // 	setFunc: [true],
      // 	expected: {
      // 		error: null,
      // 		returnValue: true,
      // 		setValue: NONE,
      // 		base: BASE,
      // 		older: OLDER,
      // 		newer: NEWER,
      // 	},
      // 	actions: null,
      // })


      testMerger(_objectSpread({}, options, {
        base: createValues(),
        older: createValues(),
        newer: createValues()
      }));
    });
    it('primitives', function () {
      var createValues = function createValues() {
        return [_TestMerger.BASE, _TestMerger.OLDER, _TestMerger.NEWER, null, void 0, 0, 1, false, true];
      };

      testMerger(_objectSpread({}, options, {
        base: createValues(),
        older: createValues(),
        newer: createValues()
      }));
    });
    it('strings', function () {
      var createValues = function createValues() {
        return [_TestMerger.BASE, _TestMerger.OLDER, _TestMerger.NEWER, void 0, 1, '', '1', '2'];
      };

      testMerger(_objectSpread({}, options, {
        base: createValues(),
        older: createValues(),
        newer: createValues()
      }));
    });
    it('Strings', function () {
      var createValues = function createValues() {
        return [_TestMerger.BASE, _TestMerger.OLDER, _TestMerger.NEWER, void 0, 1, new String(''), new String('1'), new String('2')];
      };

      testMerger(_objectSpread({}, options, {
        base: createValues(),
        older: createValues(),
        newer: createValues()
      }));
    });
    it('date', function () {
      var createValues = function createValues() {
        return [_TestMerger.BASE, _TestMerger.OLDER, _TestMerger.NEWER, void 0, '', {}, new Date(1), new Date(2), new Date(3)];
      };

      testMerger(_objectSpread({}, options, {
        base: createValues(),
        older: createValues(),
        newer: createValues()
      }));
    });
    it('objects', function () {
      var createValues = function createValues() {
        return [_TestMerger.BASE, _TestMerger.OLDER, _TestMerger.NEWER, null, {}, new Date(1),
        /* new Class(new Date(1)), new Class({ a: {a: 1, b: 2}, b: 3 }), new Class(Object.freeze({ x: {y: 1} })), */
        {
          a: {
            a: 1,
            b: 2
          },
          b: 3
        }, {
          a: {
            b: 4,
            c: 5
          },
          c: 6
        }, {
          a: {
            a: 7,
            b: 8
          },
          d: 9
        }, (0, _freeze.default)({
          x: {
            y: 1
          }
        })];
      };

      testMerger(_objectSpread({}, options, {
        base: createValues(),
        older: createValues(),
        newer: createValues()
      }));
    });
    xit('full', function () {
      this.timeout(180000);

      var createValues = function createValues() {
        return [_TestMerger.BASE, _TestMerger.OLDER, _TestMerger.NEWER, null, void 0, 0, 1, false, true, '', '1',
        /* new Class(new Date(1)), new Class({ a: {a: 1, b: 2}, b: 3 }), new Class(Object.freeze({ x: {y: 1} })), */
        {}, {
          a: {
            a: 1,
            b: 2
          },
          b: 3
        }, {
          a: {
            b: 4,
            c: 5
          },
          c: 6
        }, {
          a: {
            a: 7,
            b: 8
          },
          d: 9
        }, (0, _freeze.default)({
          x: {
            y: 1
          }
        }), new Date(1), new Date(2)];
      };

      testMerger(_objectSpread({}, options, {
        base: createValues(),
        older: createValues(),
        newer: createValues()
      }));
    });
  });
  describe('base', function () {
    it('base', function () {
      assert.ok(_TestMerger.deepCloneEqual.equal(new Class({
        a: {
          a: 1,
          b: 2
        },
        b: 3
      }), new Class({
        a: {
          a: 1,
          b: 2
        },
        b: 3
      })));
      assert.ok(_TestMerger.deepCloneEqual.equal(_TestMerger.deepCloneEqual.clone(new Class({
        a: {
          a: 1,
          b: 2
        },
        b: 3
      })), new Class({
        a: {
          a: 1,
          b: 2
        },
        b: 3
      }))); // tslint:disable-next-line:use-primitive-type no-construct

      var symbol = {
        x: new String('SYMBOL')
      };

      var symbolClone = _TestMerger.deepCloneEqual.clone(symbol);

      assert.ok(_TestMerger.deepCloneEqual.equal(symbol, symbolClone));
    });
    it('custom class', function () {
      testMerger({
        base: [new Class({
          a: {
            a: 1,
            b: 2
          },
          b: 3
        })],
        older: [new Class({
          a: {
            a: 4,
            b: 5
          },
          c: 6
        }), {
          a: {
            a: 4,
            b: 5
          },
          c: 6
        }],
        newer: [new Class({
          a: {
            a: 7,
            b: 2
          },
          d: 9
        }), {
          a: {
            a: 7,
            b: 2
          },
          d: 9
        }],
        preferCloneOlderParam: [null],
        preferCloneNewerParam: [null],
        preferCloneMeta: [null],
        valueType: [null],
        valueFactory: [null],
        setFunc: [true],
        expected: {
          error: null,
          returnValue: true,
          setValue: _TestMerger.NONE,
          base: new Class({
            a: {
              a: 7,
              b: 5
            },
            c: 6,
            d: 9
          }),
          older: _TestMerger.OLDER,
          newer: _TestMerger.NEWER
        },
        actions: null
      });
    });
    it('strings', function () {
      testMerger({
        base: ['', '1', '2', new String('1')],
        older: ['2', new String('2')],
        newer: ['3', new String('3')],
        preferCloneOlderParam: [null],
        preferCloneNewerParam: [null],
        preferCloneMeta: [null],
        valueType: [null],
        valueFactory: [null],
        setFunc: [true],
        expected: {
          error: null,
          returnValue: true,
          setValue: '3',
          base: _TestMerger.BASE,
          older: _TestMerger.OLDER,
          newer: _TestMerger.NEWER
        },
        actions: null
      });
    });
    it('number / boolean', function () {
      testMerger({
        base: [new Number(1)],
        older: [2, new Number(2)],
        newer: [3, new Number(3)],
        preferCloneOlderParam: [null],
        preferCloneNewerParam: [null],
        preferCloneMeta: [null],
        valueType: [null],
        valueFactory: [null],
        setFunc: [true],
        expected: {
          error: null,
          returnValue: true,
          setValue: 3,
          base: _TestMerger.BASE,
          older: _TestMerger.OLDER,
          newer: _TestMerger.NEWER
        },
        actions: null
      });
      testMerger({
        base: [new Boolean(false)],
        older: [true, false, new Boolean(true), new Boolean(false)],
        newer: [true, new Boolean(true)],
        preferCloneOlderParam: [null],
        preferCloneNewerParam: [null],
        preferCloneMeta: [null],
        valueType: [null],
        valueFactory: [null],
        setFunc: [true],
        expected: {
          error: null,
          returnValue: true,
          setValue: true,
          base: _TestMerger.BASE,
          older: _TestMerger.OLDER,
          newer: _TestMerger.NEWER
        },
        actions: null
      });
    });
    it('merge 3 objects', function () {
      testMerger({
        base: [{
          a: {
            a: 1,
            b: 2
          },
          b: 3
        }],
        older: [{
          a: {
            a: 4,
            b: 5
          },
          c: 6
        }],
        newer: [{
          a: {
            a: 7,
            b: 2
          },
          d: 9
        }],
        preferCloneOlderParam: [null],
        preferCloneNewerParam: [null],
        preferCloneMeta: [null],
        valueType: [null],
        valueFactory: [null],
        setFunc: [false, true],
        expected: {
          error: null,
          returnValue: true,
          setValue: _TestMerger.NONE,
          base: {
            a: {
              a: 7,
              b: 5
            },
            c: 6,
            d: 9
          },
          older: _TestMerger.OLDER,
          newer: _TestMerger.NEWER
        },
        actions: null
      });
    });
    it('array as primitive', function () {
      testMerger({
        base: [[], [1], [2]],
        older: [[], [1], [2]],
        newer: [[3]],
        preferCloneOlderParam: [null],
        preferCloneNewerParam: [null],
        preferCloneMeta: [null],
        valueType: [null],
        valueFactory: [null],
        setFunc: [true],
        expected: {
          error: null,
          returnValue: true,
          setValue: _TestMerger.NEWER,
          base: _TestMerger.BASE,
          older: _TestMerger.OLDER,
          newer: _TestMerger.NEWER
        },
        actions: null
      });
    });
    it('value type', function () {
      testMerger({
        base: [{
          a: {
            a: 1,
            b: 2
          },
          b: 3
        }],
        older: [{
          a: {
            a: 4,
            b: 5
          },
          c: 6
        }],
        newer: [{
          a: {
            a: 7,
            b: 2
          },
          d: 9
        }],
        preferCloneOlderParam: [null],
        preferCloneNewerParam: [null],
        preferCloneMeta: [null],
        valueType: [Class],
        valueFactory: [null],
        setFunc: [true],
        expected: {
          error: null,
          returnValue: true,
          setValue: new Class({
            a: {
              a: 7,
              b: 5
            },
            c: 6,
            d: 9
          }),
          base: _TestMerger.BASE,
          older: _TestMerger.OLDER,
          newer: _TestMerger.NEWER
        },
        actions: null
      });
      testMerger({
        base: [null, void 0, 0, 1, false, true, '', '1'],
        older: [{
          a: {
            a: 4,
            b: 5
          },
          c: 6
        }],
        newer: [{
          a: {
            a: 7,
            b: 2
          },
          d: 9
        }],
        preferCloneOlderParam: [null],
        preferCloneNewerParam: [null],
        preferCloneMeta: [null],
        valueType: [Class],
        valueFactory: [null, function () {
          var instance = new Class(null);
          instance.custom = true;
          return instance;
        }],
        setFunc: [true],
        expected: {
          error: null,
          returnValue: true,
          setValue: function setValue(o) {
            var value = new Class({
              a: {
                a: 7,
                b: 2
              },
              d: 9
            });

            if (o.valueFactory) {
              value.custom = true;
            }

            return value;
          },
          base: _TestMerger.BASE,
          older: _TestMerger.OLDER,
          newer: _TestMerger.NEWER
        },
        actions: null
      });
    });
  });
  describe('circular', function () {
    var createValue = function createValue(value, circular) {
      var obj = {
        value: value
      };
      obj.obj = circular ? obj : {
        value: value
      };
      return obj;
    };

    var options = {
      preferCloneOlderParam: [null],
      preferCloneNewerParam: [null],
      preferCloneMeta: [null],
      valueType: [null],
      valueFactory: [null],
      setFunc: [true],
      expected: {
        error: null,
        returnValue: function returnValue(o) {
          return !_TestMerger.deepCloneEqual.equal(o.base, o.newer) || !_TestMerger.deepCloneEqual.equal(o.base, o.older);
        },
        setValue: function setValue(o) {
          if (_TestMerger.deepCloneEqual.equal(o.base, o.newer) && _TestMerger.deepCloneEqual.equal(o.base, o.older)) {
            return _TestMerger.NONE;
          }

          if (!o.newer) {
            if (o.newer === o.base) {
              return _TestMerger.OLDER;
            }

            return _TestMerger.NEWER;
          }

          if (o.base) {
            if (!o.older && _TestMerger.deepCloneEqual.equal(o.base, o.newer)) {
              return _TestMerger.OLDER;
            }

            return _TestMerger.NONE;
          }

          if (!o.older) {
            return _TestMerger.NEWER;
          }

          if (_TestMerger.deepCloneEqual.equal(o.older, o.newer)) {
            return _TestMerger.NEWER;
          } else {
            return _TestMerger.OLDER;
          }
        },
        base: function base(o) {
          if (o.base && o.older && o.newer) {
            if (_TestMerger.deepCloneEqual.equal(o.base, o.newer)) {
              return _TestMerger.OLDER;
            } else {
              return _TestMerger.NEWER;
            }
          }

          return _TestMerger.BASE;
        },
        older: _TestMerger.OLDER,
        newer: _TestMerger.NEWER
      },
      actions: null
    };
    it('deepCloneEqual.clone circular', function () {
      var TestClass = function TestClass(value) {
        (0, _classCallCheck2.default)(this, TestClass);
        this.value = value;
      };

      var obj = {
        undefined: void 0,
        null: null,
        String: new String('String'),
        Number: new Number(1),
        Boolean: new Boolean(true),
        error: new Error('test error'),
        func: function func() {
          return 'func';
        }
      };
      obj.circular = obj;
      obj.class = new TestClass(obj);
      obj.array = (0, _toConsumableArray2.default)((0, _values.default)(obj));
      obj.nested = _objectSpread({}, obj);

      var clone = _TestMerger.deepCloneEqual.clone(obj);

      var assertCloneValue = function assertCloneValue(cloneValue, value, message) {
        if (_TestMerger.deepCloneEqual.isPrimitive(value)) {
          assert.strictEqual(cloneValue, value, message);
        } else {
          assert.notStrictEqual(cloneValue, value, message);
        }
      };

      _TestMerger.deepCloneEqual.equal(clone, obj);

      assertCloneValue(clone, obj, 'root');

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          assertCloneValue(clone[key], obj[key], key);
          assertCloneValue(clone.nested[key], obj.nested[key], key);
        }
      }

      for (var i = 0; i < obj.array.length; i++) {
        assertCloneValue(clone.array[i], obj.array[i], "array[".concat(i, "]"));
      }
    });
    it('simple circular', function () {
      testMerger(_objectSpread({}, options, {
        base: [createValue(1, true)],
        older: [createValue(1, true)],
        newer: [createValue(1, true)]
      }));
    });
    it('not circular', function () {
      testMerger(_objectSpread({}, options, {
        base: [createValue(1, false), createValue(2, false), createValue(3, false), null],
        older: [createValue(1, false), createValue(2, false), createValue(3, false), null],
        newer: [createValue(1, false), createValue(2, false), createValue(3, false), null]
      }));
    });
    it('value type circular', function () {
      var base = {
        a: {
          a: 1,
          b: 2
        },
        b: 3
      };
      var older = {
        a: {
          a: 1,
          b: 2
        },
        b: 3
      };
      var newer = {
        a: {
          a: 1,
          b: 2
        },
        b: 3
      };
      testMerger({
        base: [base, _TestMerger.OLDER, {
          a: older.a,
          b: 3
        }],
        older: [older, {
          a: newer.a,
          c: 6
        }],
        newer: [newer],
        preferCloneOlderParam: [null],
        preferCloneNewerParam: [null],
        preferCloneMeta: [null],
        valueType: [_Property.Property],
        valueFactory: [null],
        setFunc: [true],
        expected: {
          error: null,
          returnValue: true,
          setValue: new _Property.Property(null, {
            a: {
              a: 7,
              b: 5
            },
            c: 6,
            d: 9
          }),
          base: _TestMerger.BASE,
          older: _TestMerger.OLDER,
          newer: _TestMerger.NEWER
        },
        actions: null
      });
    });
  });
  describe('collections', function () {
    var func = function func() {
      return 'func';
    };

    var func2 = function func2() {
      return 'func2';
    };

    var func3 = function func3() {
      return 'func3';
    };

    var func4 = function func4() {
      return 'func4';
    };

    var object = new Error('test error');
    it('helpers', function () {
      assert.strictEqual(_TestMerger.deepCloneEqual.clone(func), func); // assert.strictEqual(deepCloneEqual.clone(object), object)

      var iterable = (0, _helpers.createIterable)([1, 2, 3]);
      assert.ok((0, _getIteratorMethod2.default)(iterable));
      assert.deepStrictEqual((0, _from.default)(iterable), [1, 2, 3]);
      assert.deepStrictEqual((0, _from.default)(iterable), [1, 2, 3]);
    });
    describe('maps', function () {
      var testMergeMaps = function testMergeMaps(targetFactories, sourceFactories, base, older, newer, result) {
        var _context, _context2;

        testMerger({
          base: (0, _toConsumableArray2.default)((0, _map2.default)(targetFactories).call(targetFactories, function (o) {
            return o(base);
          })),
          older: (0, _concat.default)(_context = []).call(_context, (0, _toConsumableArray2.default)((0, _map2.default)(sourceFactories).call(sourceFactories, function (o) {
            return o(older);
          })), [older, (0, _helpers.createIterable)(older)]),
          newer: (0, _concat.default)(_context2 = []).call(_context2, (0, _toConsumableArray2.default)((0, _map2.default)(sourceFactories).call(sourceFactories, function (o) {
            return o(newer);
          })), [newer, (0, _helpers.createIterable)(newer)]),
          preferCloneOlderParam: [null],
          preferCloneNewerParam: [null],
          preferCloneMeta: [true],
          valueType: [null],
          valueFactory: [null],
          setFunc: [true],
          expected: {
            error: null,
            returnValue: true,
            setValue: (0, _set2.fillMap)(new _map.default(), result),
            base: _TestMerger.BASE,
            older: _TestMerger.OLDER,
            newer: _TestMerger.NEWER
          },
          actions: null
        });
      };

      it('Map', function () {
        testMergeMaps([function (o) {
          return (0, _set2.fillMap)(new _map.default(), o);
        }, function (o) {
          return (0, _set2.fillMap)(new _ObservableMap.ObservableMap(new _map.default()), o);
        }], [function (o) {
          return (0, _set2.fillMap)(new _map.default(), o);
        }, function (o) {
          return (0, _set2.fillMap)(new _ObservableMap.ObservableMap(new _map.default()), o);
        }], [[0, null], [func, func], [void 0, {
          a: 1,
          b: 2
        }], [object, {
          a: 2,
          c: 3
        }]], [[0, object], [null, func], [void 0, {
          a: 4,
          c: 5
        }], [object, {
          a: 6,
          b: 7
        }]], [[0, null], [null, null], [func, func], [void 0, {
          a: 1,
          b: 2
        }], [object, {
          a: 10,
          c: 11
        }]], [[0, object], [void 0, {
          a: 4,
          c: 5
        }], [object, {
          a: 10,
          b: 7,
          c: 11
        }], [null, null]]);
      });
      it('ArrayMap', function () {
        testMergeMaps([function (o) {
          return (0, _set2.fillMap)(new _ArrayMap.ArrayMap(), o);
        }, function (o) {
          return (0, _set2.fillMap)(new _ObservableMap.ObservableMap(new _ArrayMap.ArrayMap()), o);
        }, function (o) {
          return (0, _set2.fillMap)(new _ObjectHashMap.ObjectHashMap(), o);
        }, function (o) {
          return (0, _set2.fillMap)(new _ObservableMap.ObservableMap(new _ObjectHashMap.ObjectHashMap()), o);
        }], [function (o) {
          return (0, _set2.fillMap)(new _map.default(), o);
        }, function (o) {
          return (0, _set2.fillMap)(new _ObservableMap.ObservableMap(new _map.default()), o);
        }, function (o) {
          return (0, _set2.fillMap)(new _ArrayMap.ArrayMap(), o);
        }, function (o) {
          return (0, _set2.fillMap)(new _ObservableMap.ObservableMap(new _ArrayMap.ArrayMap()), o);
        }, function (o) {
          return (0, _set2.fillMap)(new _ObjectHashMap.ObjectHashMap(), o);
        }, function (o) {
          return (0, _set2.fillMap)(new _ObservableMap.ObservableMap(new _ObjectHashMap.ObjectHashMap()), o);
        }], [[func2, null], [func, func], [func4, {
          a: 1,
          b: 2
        }], [object, {
          a: 2,
          c: 3
        }]], [[func2, object], [func3, func], [func4, {
          a: 4,
          c: 5
        }], [object, {
          a: 6,
          b: 7
        }]], [[func2, null], [func3, null], [func, func], [func4, {
          a: 1,
          b: 2
        }], [object, {
          a: 10,
          c: 11
        }]], [[func2, object], [func4, {
          a: 4,
          c: 5
        }], [object, {
          a: 10,
          b: 7,
          c: 11
        }], [func3, null]]);
      });
      it('ObjectMap', function () {
        testMergeMaps([function (o) {
          return (0, _set2.fillMap)(new _ObjectMap.ObjectMap(), o);
        }, function (o) {
          return (0, _set2.fillMap)(new _ObservableMap.ObservableMap(new _ObjectMap.ObjectMap()), o);
        }], [function (o) {
          return (0, _set2.fillMap)(new _map.default(), o);
        }, function (o) {
          return (0, _set2.fillMap)(new _ObservableMap.ObservableMap(new _map.default()), o);
        }, function (o) {
          return (0, _set2.fillMap)(new _ObjectMap.ObjectMap(), o);
        }, function (o) {
          return (0, _set2.fillMap)(new _ObservableMap.ObservableMap(new _ObjectMap.ObjectMap()), o);
        }, function (o) {
          return (0, _set2.fillObject)({}, o);
        }], [['0', null], ['1', func], ['3', {
          a: 1,
          b: 2
        }], ['5', {
          a: 2,
          c: 3
        }]], [['0', object], ['6', func], ['3', {
          a: 4,
          c: 5
        }], ['5', {
          a: 6,
          b: 7
        }]], [['0', null], ['6', null], ['1', func], ['3', {
          a: 1,
          b: 2
        }], ['5', {
          a: 10,
          c: 11
        }]], [['0', object], ['3', {
          a: 4,
          c: 5
        }], ['5', {
          a: 10,
          c: 11,
          b: 7
        }], ['6', null]]);
      });
    });
    describe('sets', function () {
      var testMergeSets = function testMergeSets(targetFactories, sourceFactories, base, older, newer, result) {
        var _context3, _context4;

        testMerger({
          base: (0, _toConsumableArray2.default)((0, _map2.default)(targetFactories).call(targetFactories, function (o) {
            return o(base);
          })),
          older: (0, _concat.default)(_context3 = []).call(_context3, (0, _toConsumableArray2.default)((0, _map2.default)(sourceFactories).call(sourceFactories, function (o) {
            return o(older);
          })), [older, (0, _helpers.createIterable)(older)]),
          newer: (0, _concat.default)(_context4 = []).call(_context4, (0, _toConsumableArray2.default)((0, _map2.default)(sourceFactories).call(sourceFactories, function (o) {
            return o(newer);
          })), [newer, (0, _helpers.createIterable)(newer)]),
          preferCloneOlderParam: [null],
          preferCloneNewerParam: [null],
          preferCloneMeta: [true],
          valueType: [null],
          valueFactory: [null],
          setFunc: [true],
          expected: {
            error: null,
            returnValue: true,
            setValue: (0, _set2.fillSet)(new _set.default(), result),
            base: _TestMerger.BASE,
            older: _TestMerger.OLDER,
            newer: _TestMerger.NEWER
          },
          actions: null
        });
      };

      it('Set', function () {
        testMergeSets([function (o) {
          return (0, _set2.fillSet)(new _set.default(), o);
        }, function (o) {
          return (0, _set2.fillSet)(new _ObservableSet.ObservableSet(new _set.default()), o);
        }], [function (o) {
          return (0, _set2.fillSet)(new _set.default(), o);
        }, function (o) {
          return (0, _set2.fillSet)(new _ObservableSet.ObservableSet(new _set.default()), o);
        }], [0, func, void 0], [0, func, object], [0, 1, void 0, object], [0, 1, object]);
      });
      it('ArraySet', function () {
        testMergeSets([function (o) {
          return (0, _set2.fillSet)(new _ArraySet.ArraySet(), o);
        }, function (o) {
          return (0, _set2.fillSet)(new _ObservableSet.ObservableSet(new _ArraySet.ArraySet()), o);
        }], [function (o) {
          return (0, _set2.fillSet)(new _set.default(), o);
        }, function (o) {
          return (0, _set2.fillSet)(new _ObservableSet.ObservableSet(new _set.default()), o);
        }, function (o) {
          return (0, _set2.fillSet)(new _ArraySet.ArraySet(), o);
        }, function (o) {
          return (0, _set2.fillSet)(new _ObservableSet.ObservableSet(new _ArraySet.ArraySet()), o);
        }], [func2, func, func4], [func2, func, object], [func2, func3, func4, object], [func2, func3, object]);
      });
      it('ObjectSet', function () {
        testMergeSets([function (o) {
          return (0, _set2.fillSet)(new _ObjectSet.ObjectSet(), o);
        }, function (o) {
          return (0, _set2.fillSet)(new _ObservableSet.ObservableSet(new _ObjectSet.ObjectSet()), o);
        }, function (o) {
          return (0, _set2.fillSet)(new _SortedList.SortedList({
            autoSort: true,
            notAddIfExists: true
          }), o);
        }], [function (o) {
          return (0, _set2.fillSet)(new _set.default(), o);
        }, function (o) {
          return (0, _set2.fillSet)(new _ObservableSet.ObservableSet(new _set.default()), o);
        }, function (o) {
          return (0, _set2.fillSet)(new _ObjectSet.ObjectSet(), o);
        }, function (o) {
          return (0, _set2.fillSet)(new _ObservableSet.ObservableSet(new _ObjectSet.ObjectSet()), o);
        }, function (o) {
          return (0, _set2.fillSet)(new _SortedList.SortedList({
            autoSort: true,
            notAddIfExists: true
          }), o);
        }, function (o) {
          return (0, _set2.fillObjectKeys)({}, o);
        }], ['0', '2', '3'], ['0', '2', '4'], ['0', '1', '3', '4'], ['0', '1', '4']);
      });
    });
  });
});