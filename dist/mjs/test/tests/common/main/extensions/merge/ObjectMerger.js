import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/* tslint:disable:no-empty no-identical-functions max-line-length no-construct use-primitive-type */
// @ts-ignore
// noinspection ES6UnusedImports
// import deepCloneEqual.clone from 'fast-copy'
// import deepCloneEqual.clone from 'clone'
// @ts-ignore
// noinspection ES6UnusedImports
import { registerMergeable } from '../../../../../../main/common/extensions/merge/mergers';
import { ArrayMap } from '../../../../../../main/common/lists/ArrayMap';
import { ArraySet } from '../../../../../../main/common/lists/ArraySet';
import { canHaveUniqueId } from '../../../../../../main/common/lists/helpers/object-unique-id';
import { fillMap, fillObject, fillObjectKeys, fillSet } from '../../../../../../main/common/lists/helpers/set';
import { ObjectHashMap } from '../../../../../../main/common/lists/ObjectHashMap';
import { ObjectMap } from '../../../../../../main/common/lists/ObjectMap';
import { ObjectSet } from '../../../../../../main/common/lists/ObjectSet';
import { ObservableMap } from '../../../../../../main/common/lists/ObservableMap';
import { ObservableSet } from '../../../../../../main/common/lists/ObservableSet';
import { SortedList } from '../../../../../../main/common/lists/SortedList';
import { Property } from '../../../../../../main/common/rx/object/properties/property';
import { Assert } from '../../../../../../main/common/test/Assert';
import { createComplexObject, createIterable } from '../../src/helpers/helpers';
import { BASE, deepCloneEqual, isRefer, NEWER, NONE, OLDER, TestMerger } from './src/TestMerger';
var assert = new Assert(deepCloneEqual);
// declare function deepStrictEqual(a, b): boolean
// declare function circularDeepStrictEqual(a, b): boolean
// declare function deepCloneEqual.clone<T = any>(o: T): T
describe('common > extensions > merge > ObjectMerger', function () {
  this.timeout(60000);
  var testMerger = TestMerger.test;
  after(function () {
    console.log('Total ObjectMerger tests >= ' + TestMerger.totalTests);
  });

  function canBeReferObject(value) {
    return value != null && !isRefer(value) && (isObject(value) || typeof value === 'function');
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


    if (o.base instanceof Class && (deepCloneEqual.equal(o.base, o.older) || deepCloneEqual.equal(o.base.value, o.older) && isObject(o.older)) && (deepCloneEqual.equal(o.base, o.newer) || deepCloneEqual.equal(o.base.value, o.newer) && isObject(o.newer))) {
      return false;
    }

    return !deepCloneEqual.equal(o.base, o.newer) || !deepCloneEqual.equal(o.base, o.older);
  }

  function isObject(value) {
    return value != null && value.constructor === Object && canHaveUniqueId(value);
  }

  function mustBeFilled(o) {
    return !o.preferCloneBase && isObject(o.base) && (!deepCloneEqual.equal(o.base, o.newer) && isObject(o.newer) || deepCloneEqual.equal(o.base, o.newer) && !deepCloneEqual.equal(o.base, o.older) && isObject(o.older));
  }

  var Class =
  /*#__PURE__*/
  function () {
    function Class(value) {
      _classCallCheck(this, Class);

      this.value = value;
    }

    _createClass(Class, [{
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

  registerMergeable(Class);
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
        if (o.newer === NEWER || (o.base === NEWER || o.older === NEWER) && !canBeReferObject(o.newer)) {
          return true;
        }

        if (o.older === OLDER || (o.base === OLDER || o.newer === OLDER) && !canBeReferObject(o.older)) {
          return true;
        }

        if (o.base === BASE || (o.older === BASE || o.newer === BASE) && !canBeReferObject(o.base)) {
          return true;
        }

        if (isObject(o.base) && isObject(o.older) && isObject(o.newer)) {
          return true;
        }

        if (o.preferCloneMeta != null && (isObject(o.older) || isObject(o.newer))) {
          return true;
        }

        if (isObject(o.base) && !Object.isFrozen(o.base) && !isRefer(o.base)) {
          o.base = deepCloneEqual.clone(o.base);
        }

        if (isObject(o.older) && !Object.isFrozen(o.older) && !isRefer(o.older)) {
          o.older = deepCloneEqual.clone(o.older);
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
            return NONE;
          }

          if (isObject(o.base)) {
            if (isObject(o.newer)) {
              if (deepCloneEqual.equal(o.base, o.newer)) {
                if (isObject(o.older)) {
                  return o.preferCloneBase ? deepCloneEqual.clone(o.older) : NONE;
                } else {
                  return OLDER;
                }
              } else {
                return o.preferCloneBase ? deepCloneEqual.clone(o.newer) : NONE;
              }
            }
          } else if (isObject(o.older) && isObject(o.newer)) {
            if (deepCloneEqual.equal(o.older, o.newer)) {
              return !o.preferCloneNewer ? NEWER : o.preferCloneOlder ? deepCloneEqual.clone(o.newer) : OLDER;
            } else {
              return o.preferCloneOlder ? deepCloneEqual.clone(o.newer) : OLDER;
            }
          }

          if (isObject(o.base) && isObject(o.older) && isObject(o.newer)) {
            return o.preferCloneBase ? deepCloneEqual.clone(deepCloneEqual.equal(o.base, o.newer) ? o.older : o.newer) : NONE;
          }

          if (o.base instanceof Class && (o.older instanceof Class || isObject(o.older)) && (o.newer instanceof Class || isObject(o.newer))) {
            return NONE;
          }

          if (o.base instanceof Class && !(o.older instanceof Class || isObject(o.older)) && (o.newer instanceof Class || isObject(o.newer)) && !deepCloneEqual.equal(o.base, o.newer) && !deepCloneEqual.equal(o.base.value, o.newer)) {
            return NONE;
          }

          if (isObject(o.base) && !Object.isFrozen(o.base) && !isObject(o.older) && isObject(o.newer) && !deepCloneEqual.equal(o.base, o.newer)) {
            return NONE;
          }

          if (!(o.base instanceof Class) && o.older instanceof Class && (o.newer instanceof Class || isObject(o.newer))) {
            return OLDER;
          }

          if (!deepCloneEqual.equal(o.base, o.newer) && o.older !== o.newer && deepCloneEqual.equal(o.older, o.newer) && o.older instanceof Date && o.newer instanceof Date && o.preferCloneNewer && !o.preferCloneOlder) {
            return OLDER;
          }

          if ((o.older instanceof Class || isObject(o.older)) && isObject(o.newer) && (o.preferCloneOlder && !deepCloneEqual.equal(o.older, o.newer) || o.preferCloneOlder && o.preferCloneNewer) || o.newer === o.older && (o.preferCloneOlder || o.preferCloneNewer)) {
            return deepCloneEqual.clone(o.newer);
          }

          if (isObject(o.older) && !Object.isFrozen(o.older) && isObject(o.newer)) {
            return OLDER;
          }

          return !(deepCloneEqual.equal(o.base, o.newer) || o.base instanceof Class && deepCloneEqual.equal(o.base.value, o.newer) && isObject(o.newer)) || o.newer !== o.base && isObject(o.base) && Object.isFrozen(o.base) ? NEWER : OLDER;
        },
        base: BASE,
        older: OLDER,
        newer: NEWER
      },
      actions: null
    };
    it('complex objects', function () {
      var complexObjectOptions = {
        undefined: true,
        "function": true,
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
        return [BASE, OLDER, NEWER, createComplexObject(complexObjectOptions)];
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
        return [BASE, OLDER, NEWER, null, void 0, 0, 1, false, true];
      };

      testMerger(_objectSpread({}, options, {
        base: createValues(),
        older: createValues(),
        newer: createValues()
      }));
    });
    it('strings', function () {
      var createValues = function createValues() {
        return [BASE, OLDER, NEWER, void 0, 1, '', '1', '2'];
      };

      testMerger(_objectSpread({}, options, {
        base: createValues(),
        older: createValues(),
        newer: createValues()
      }));
    });
    it('Strings', function () {
      var createValues = function createValues() {
        return [BASE, OLDER, NEWER, void 0, 1, new String(''), new String('1'), new String('2')];
      };

      testMerger(_objectSpread({}, options, {
        base: createValues(),
        older: createValues(),
        newer: createValues()
      }));
    });
    it('date', function () {
      var createValues = function createValues() {
        return [BASE, OLDER, NEWER, void 0, '', {}, new Date(1), new Date(2), new Date(3)];
      };

      testMerger(_objectSpread({}, options, {
        base: createValues(),
        older: createValues(),
        newer: createValues()
      }));
    });
    it('objects', function () {
      var createValues = function createValues() {
        return [BASE, OLDER, NEWER, null, {}, new Date(1),
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
        }, Object.freeze({
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
        return [BASE, OLDER, NEWER, null, void 0, 0, 1, false, true, '', '1',
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
        }, Object.freeze({
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
      assert.ok(deepCloneEqual.equal(new Class({
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
      assert.ok(deepCloneEqual.equal(deepCloneEqual.clone(new Class({
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
      var symbolClone = deepCloneEqual.clone(symbol);
      assert.ok(deepCloneEqual.equal(symbol, symbolClone));
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
          setValue: NONE,
          base: new Class({
            a: {
              a: 7,
              b: 5
            },
            c: 6,
            d: 9
          }),
          older: OLDER,
          newer: NEWER
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
          base: BASE,
          older: OLDER,
          newer: NEWER
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
          base: BASE,
          older: OLDER,
          newer: NEWER
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
          base: BASE,
          older: OLDER,
          newer: NEWER
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
          setValue: NONE,
          base: {
            a: {
              a: 7,
              b: 5
            },
            c: 6,
            d: 9
          },
          older: OLDER,
          newer: NEWER
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
          setValue: NEWER,
          base: BASE,
          older: OLDER,
          newer: NEWER
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
          base: BASE,
          older: OLDER,
          newer: NEWER
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
          base: BASE,
          older: OLDER,
          newer: NEWER
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
          return !deepCloneEqual.equal(o.base, o.newer) || !deepCloneEqual.equal(o.base, o.older);
        },
        setValue: function setValue(o) {
          if (deepCloneEqual.equal(o.base, o.newer) && deepCloneEqual.equal(o.base, o.older)) {
            return NONE;
          }

          if (!o.newer) {
            if (o.newer === o.base) {
              return OLDER;
            }

            return NEWER;
          }

          if (o.base) {
            if (!o.older && deepCloneEqual.equal(o.base, o.newer)) {
              return OLDER;
            }

            return NONE;
          }

          if (!o.older) {
            return NEWER;
          }

          if (deepCloneEqual.equal(o.older, o.newer)) {
            return NEWER;
          } else {
            return OLDER;
          }
        },
        base: function base(o) {
          if (o.base && o.older && o.newer) {
            if (deepCloneEqual.equal(o.base, o.newer)) {
              return OLDER;
            } else {
              return NEWER;
            }
          }

          return BASE;
        },
        older: OLDER,
        newer: NEWER
      },
      actions: null
    };
    it('deepCloneEqual.clone circular', function () {
      var TestClass = function TestClass(value) {
        _classCallCheck(this, TestClass);

        this.value = value;
      };

      var obj = {
        undefined: void 0,
        "null": null,
        String: new String('String'),
        Number: new Number(1),
        Boolean: new Boolean(true),
        error: new Error('test error'),
        func: function func() {
          return 'func';
        }
      };
      obj.circular = obj;
      obj["class"] = new TestClass(obj);
      obj.array = _toConsumableArray(Object.values(obj));
      obj.nested = _objectSpread({}, obj);
      var clone = deepCloneEqual.clone(obj);

      var assertCloneValue = function assertCloneValue(cloneValue, value, message) {
        if (deepCloneEqual.isPrimitive(value)) {
          assert.strictEqual(cloneValue, value, message);
        } else {
          assert.notStrictEqual(cloneValue, value, message);
        }
      };

      deepCloneEqual.equal(clone, obj);
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
        base: [base, OLDER, {
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
        valueType: [Property],
        valueFactory: [null],
        setFunc: [true],
        expected: {
          error: null,
          returnValue: true,
          setValue: new Property(null, {
            a: {
              a: 7,
              b: 5
            },
            c: 6,
            d: 9
          }),
          base: BASE,
          older: OLDER,
          newer: NEWER
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
      assert.strictEqual(deepCloneEqual.clone(func), func); // assert.strictEqual(deepCloneEqual.clone(object), object)

      var iterable = createIterable([1, 2, 3]);
      assert.ok(iterable[Symbol.iterator]);
      assert.deepStrictEqual(Array.from(iterable), [1, 2, 3]);
      assert.deepStrictEqual(Array.from(iterable), [1, 2, 3]);
    });
    describe('maps', function () {
      var testMergeMaps = function testMergeMaps(targetFactories, sourceFactories, base, older, newer, result) {
        testMerger({
          base: _toConsumableArray(targetFactories.map(function (o) {
            return o(base);
          })),
          older: [].concat(_toConsumableArray(sourceFactories.map(function (o) {
            return o(older);
          })), [older, createIterable(older)]),
          newer: [].concat(_toConsumableArray(sourceFactories.map(function (o) {
            return o(newer);
          })), [newer, createIterable(newer)]),
          preferCloneOlderParam: [null],
          preferCloneNewerParam: [null],
          preferCloneMeta: [true],
          valueType: [null],
          valueFactory: [null],
          setFunc: [true],
          expected: {
            error: null,
            returnValue: true,
            setValue: fillMap(new Map(), result),
            base: BASE,
            older: OLDER,
            newer: NEWER
          },
          actions: null
        });
      };

      it('Map', function () {
        testMergeMaps([function (o) {
          return fillMap(new Map(), o);
        }, function (o) {
          return fillMap(new ObservableMap(new Map()), o);
        }], [function (o) {
          return fillMap(new Map(), o);
        }, function (o) {
          return fillMap(new ObservableMap(new Map()), o);
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
          return fillMap(new ArrayMap(), o);
        }, function (o) {
          return fillMap(new ObservableMap(new ArrayMap()), o);
        }, function (o) {
          return fillMap(new ObjectHashMap(), o);
        }, function (o) {
          return fillMap(new ObservableMap(new ObjectHashMap()), o);
        }], [function (o) {
          return fillMap(new Map(), o);
        }, function (o) {
          return fillMap(new ObservableMap(new Map()), o);
        }, function (o) {
          return fillMap(new ArrayMap(), o);
        }, function (o) {
          return fillMap(new ObservableMap(new ArrayMap()), o);
        }, function (o) {
          return fillMap(new ObjectHashMap(), o);
        }, function (o) {
          return fillMap(new ObservableMap(new ObjectHashMap()), o);
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
          return fillMap(new ObjectMap(), o);
        }, function (o) {
          return fillMap(new ObservableMap(new ObjectMap()), o);
        }], [function (o) {
          return fillMap(new Map(), o);
        }, function (o) {
          return fillMap(new ObservableMap(new Map()), o);
        }, function (o) {
          return fillMap(new ObjectMap(), o);
        }, function (o) {
          return fillMap(new ObservableMap(new ObjectMap()), o);
        }, function (o) {
          return fillObject({}, o);
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
        testMerger({
          base: _toConsumableArray(targetFactories.map(function (o) {
            return o(base);
          })),
          older: [].concat(_toConsumableArray(sourceFactories.map(function (o) {
            return o(older);
          })), [older, createIterable(older)]),
          newer: [].concat(_toConsumableArray(sourceFactories.map(function (o) {
            return o(newer);
          })), [newer, createIterable(newer)]),
          preferCloneOlderParam: [null],
          preferCloneNewerParam: [null],
          preferCloneMeta: [true],
          valueType: [null],
          valueFactory: [null],
          setFunc: [true],
          expected: {
            error: null,
            returnValue: true,
            setValue: fillSet(new Set(), result),
            base: BASE,
            older: OLDER,
            newer: NEWER
          },
          actions: null
        });
      };

      it('Set', function () {
        testMergeSets([function (o) {
          return fillSet(new Set(), o);
        }, function (o) {
          return fillSet(new ObservableSet(new Set()), o);
        }], [function (o) {
          return fillSet(new Set(), o);
        }, function (o) {
          return fillSet(new ObservableSet(new Set()), o);
        }], [0, func, void 0], [0, func, object], [0, 1, void 0, object], [0, 1, object]);
      });
      it('ArraySet', function () {
        testMergeSets([function (o) {
          return fillSet(new ArraySet(), o);
        }, function (o) {
          return fillSet(new ObservableSet(new ArraySet()), o);
        }], [function (o) {
          return fillSet(new Set(), o);
        }, function (o) {
          return fillSet(new ObservableSet(new Set()), o);
        }, function (o) {
          return fillSet(new ArraySet(), o);
        }, function (o) {
          return fillSet(new ObservableSet(new ArraySet()), o);
        }], [func2, func, func4], [func2, func, object], [func2, func3, func4, object], [func2, func3, object]);
      });
      it('ObjectSet', function () {
        testMergeSets([function (o) {
          return fillSet(new ObjectSet(), o);
        }, function (o) {
          return fillSet(new ObservableSet(new ObjectSet()), o);
        }, function (o) {
          return fillSet(new SortedList({
            autoSort: true,
            notAddIfExists: true
          }), o);
        }], [function (o) {
          return fillSet(new Set(), o);
        }, function (o) {
          return fillSet(new ObservableSet(new Set()), o);
        }, function (o) {
          return fillSet(new ObjectSet(), o);
        }, function (o) {
          return fillSet(new ObservableSet(new ObjectSet()), o);
        }, function (o) {
          return fillSet(new SortedList({
            autoSort: true,
            notAddIfExists: true
          }), o);
        }, function (o) {
          return fillObjectKeys({}, o);
        }], ['0', '2', '3'], ['0', '2', '4'], ['0', '1', '3', '4'], ['0', '1', '4']);
      });
    });
  });
});