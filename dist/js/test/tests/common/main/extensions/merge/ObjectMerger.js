"use strict";

var _mergers = require("../../../../../../main/common/extensions/merge/mergers");

var _ArrayMap = require("../../../../../../main/common/lists/ArrayMap");

var _ArraySet = require("../../../../../../main/common/lists/ArraySet");

var _objectUniqueId = require("../../../../../../main/common/lists/helpers/object-unique-id");

var _set = require("../../../../../../main/common/lists/helpers/set");

var _ObjectHashMap = require("../../../../../../main/common/lists/ObjectHashMap");

var _ObjectMap = require("../../../../../../main/common/lists/ObjectMap");

var _ObjectSet = require("../../../../../../main/common/lists/ObjectSet");

var _ObservableMap = require("../../../../../../main/common/lists/ObservableMap");

var _ObservableSet = require("../../../../../../main/common/lists/ObservableSet");

var _SortedList = require("../../../../../../main/common/lists/SortedList");

var _property = require("../../../../../../main/common/rx/object/properties/property");

var _Assert = require("../../../../../../main/common/test/Assert");

var _helpers = require("../../src/helpers/helpers");

var _TestMerger = require("./src/TestMerger");

/* tslint:disable:no-empty no-identical-functions max-line-length no-construct use-primitive-type */
// @ts-ignore
// noinspection ES6UnusedImports
// import deepCloneEqual.clone from 'fast-copy'
// import deepCloneEqual.clone from 'clone'
// @ts-ignore
// noinspection ES6UnusedImports
const assert = new _Assert.Assert(_TestMerger.deepCloneEqual);
// declare function deepStrictEqual(a, b): boolean
// declare function circularDeepStrictEqual(a, b): boolean
// declare function deepCloneEqual.clone<T = any>(o: T): T
describe('common > extensions > merge > ObjectMerger', function () {
  this.timeout(60000);
  const testMerger = _TestMerger.TestMerger.test;
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

  class Class {
    constructor(value) {
      this.value = value;
    }

    _canMerge(source) {
      if (source.constructor !== Class && source.constructor !== Object) {
        return false;
      }

      return true;
    }

    _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      let changed = false;
      changed = merge(this.value, older instanceof Class ? older.value : older, newer instanceof Class ? newer.value : newer, o => {
        this.value = o;
      }, null, null, {
        selfAsValueOlder: !(older instanceof Class),
        selfAsValueNewer: !(newer instanceof Class)
      }) || changed;
      return changed;
    }

  }

  (0, _mergers.registerMergeable)(Class);
  describe('combinations', function () {
    const options = {
      preferCloneOlderParam: [null, false, true],
      preferCloneNewerParam: [null, false, true],
      preferCloneMeta: [null, false, true],
      valueType: [null],
      valueFactory: [null],
      setFunc: [false, true],
      exclude: o => {
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

        if (isObject(o.base) && !Object.isFrozen(o.base) && !(0, _TestMerger.isRefer)(o.base)) {
          o.base = _TestMerger.deepCloneEqual.clone(o.base);
        }

        if (isObject(o.older) && !Object.isFrozen(o.older) && !(0, _TestMerger.isRefer)(o.older)) {
          o.older = _TestMerger.deepCloneEqual.clone(o.older);
        }

        return false;
      },
      expected: {
        error: null,
        returnValue: o => mustBeSet(o) || mustBeFilled(o),
        setValue: o => {
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

          if (isObject(o.base) && !Object.isFrozen(o.base) && !isObject(o.older) && isObject(o.newer) && !_TestMerger.deepCloneEqual.equal(o.base, o.newer)) {
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

          if (isObject(o.older) && !Object.isFrozen(o.older) && isObject(o.newer)) {
            return _TestMerger.OLDER;
          }

          return !(_TestMerger.deepCloneEqual.equal(o.base, o.newer) || o.base instanceof Class && _TestMerger.deepCloneEqual.equal(o.base.value, o.newer) && isObject(o.newer)) || o.newer !== o.base && isObject(o.base) && Object.isFrozen(o.base) ? _TestMerger.NEWER : _TestMerger.OLDER;
        },
        base: _TestMerger.BASE,
        older: _TestMerger.OLDER,
        newer: _TestMerger.NEWER
      },
      actions: null
    };
    it('complex objects', function () {
      const complexObjectOptions = {
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

      const createValues = () => [_TestMerger.BASE, _TestMerger.OLDER, _TestMerger.NEWER, (0, _helpers.createComplexObject)(complexObjectOptions)]; // testMerger({
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


      testMerger({ ...options,
        base: createValues(),
        older: createValues(),
        newer: createValues()
      });
    });
    it('primitives', function () {
      const createValues = () => [_TestMerger.BASE, _TestMerger.OLDER, _TestMerger.NEWER, null, void 0, 0, 1, false, true];

      testMerger({ ...options,
        base: createValues(),
        older: createValues(),
        newer: createValues()
      });
    });
    it('strings', function () {
      const createValues = () => [_TestMerger.BASE, _TestMerger.OLDER, _TestMerger.NEWER, void 0, 1, '', '1', '2'];

      testMerger({ ...options,
        base: createValues(),
        older: createValues(),
        newer: createValues()
      });
    });
    it('Strings', function () {
      const createValues = () => [_TestMerger.BASE, _TestMerger.OLDER, _TestMerger.NEWER, void 0, 1, new String(''), new String('1'), new String('2')];

      testMerger({ ...options,
        base: createValues(),
        older: createValues(),
        newer: createValues()
      });
    });
    it('date', function () {
      const createValues = () => [_TestMerger.BASE, _TestMerger.OLDER, _TestMerger.NEWER, void 0, '', {}, new Date(1), new Date(2), new Date(3)];

      testMerger({ ...options,
        base: createValues(),
        older: createValues(),
        newer: createValues()
      });
    });
    it('objects', function () {
      const createValues = () => [_TestMerger.BASE, _TestMerger.OLDER, _TestMerger.NEWER, null, {}, new Date(1),
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

      testMerger({ ...options,
        base: createValues(),
        older: createValues(),
        newer: createValues()
      });
    });
    xit('full', function () {
      this.timeout(180000);

      const createValues = () => [_TestMerger.BASE, _TestMerger.OLDER, _TestMerger.NEWER, null, void 0, 0, 1, false, true, '', '1',
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

      testMerger({ ...options,
        base: createValues(),
        older: createValues(),
        newer: createValues()
      });
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

      const symbol = {
        x: new String('SYMBOL')
      };

      const symbolClone = _TestMerger.deepCloneEqual.clone(symbol);

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
        valueFactory: [null, () => {
          const instance = new Class(null);
          instance.custom = true;
          return instance;
        }],
        setFunc: [true],
        expected: {
          error: null,
          returnValue: true,
          setValue: o => {
            const value = new Class({
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
    const createValue = (value, circular) => {
      const obj = {
        value
      };
      obj.obj = circular ? obj : {
        value
      };
      return obj;
    };

    const options = {
      preferCloneOlderParam: [null],
      preferCloneNewerParam: [null],
      preferCloneMeta: [null],
      valueType: [null],
      valueFactory: [null],
      setFunc: [true],
      expected: {
        error: null,
        returnValue: o => {
          return !_TestMerger.deepCloneEqual.equal(o.base, o.newer) || !_TestMerger.deepCloneEqual.equal(o.base, o.older);
        },
        setValue: o => {
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
        base: o => {
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
      class TestClass {
        constructor(value) {
          this.value = value;
        }

      }

      const obj = {
        undefined: void 0,
        null: null,
        String: new String('String'),
        Number: new Number(1),
        Boolean: new Boolean(true),
        error: new Error('test error'),
        func: () => 'func'
      };
      obj.circular = obj;
      obj.class = new TestClass(obj);
      obj.array = [...Object.values(obj)];
      obj.nested = { ...obj
      };

      const clone = _TestMerger.deepCloneEqual.clone(obj);

      const assertCloneValue = (cloneValue, value, message) => {
        if (_TestMerger.deepCloneEqual.isPrimitive(value)) {
          assert.strictEqual(cloneValue, value, message);
        } else {
          assert.notStrictEqual(cloneValue, value, message);
        }
      };

      _TestMerger.deepCloneEqual.equal(clone, obj);

      assertCloneValue(clone, obj, 'root');

      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          assertCloneValue(clone[key], obj[key], key);
          assertCloneValue(clone.nested[key], obj.nested[key], key);
        }
      }

      for (let i = 0; i < obj.array.length; i++) {
        assertCloneValue(clone.array[i], obj.array[i], `array[${i}]`);
      }
    });
    it('simple circular', function () {
      testMerger({ ...options,
        base: [createValue(1, true)],
        older: [createValue(1, true)],
        newer: [createValue(1, true)]
      });
    });
    it('not circular', function () {
      testMerger({ ...options,
        base: [createValue(1, false), createValue(2, false), createValue(3, false), null],
        older: [createValue(1, false), createValue(2, false), createValue(3, false), null],
        newer: [createValue(1, false), createValue(2, false), createValue(3, false), null]
      });
    });
    it('value type circular', function () {
      const base = {
        a: {
          a: 1,
          b: 2
        },
        b: 3
      };
      const older = {
        a: {
          a: 1,
          b: 2
        },
        b: 3
      };
      const newer = {
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
        valueType: [_property.Property],
        valueFactory: [null],
        setFunc: [true],
        expected: {
          error: null,
          returnValue: true,
          setValue: new _property.Property(null, {
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
    const func = () => 'func';

    const func2 = () => 'func2';

    const func3 = () => 'func3';

    const func4 = () => 'func4';

    const object = new Error('test error');
    it('helpers', function () {
      assert.strictEqual(_TestMerger.deepCloneEqual.clone(func), func); // assert.strictEqual(deepCloneEqual.clone(object), object)

      const iterable = (0, _helpers.createIterable)([1, 2, 3]);
      assert.ok(iterable[Symbol.iterator]);
      assert.deepStrictEqual(Array.from(iterable), [1, 2, 3]);
      assert.deepStrictEqual(Array.from(iterable), [1, 2, 3]);
    });
    describe('maps', function () {
      const testMergeMaps = (targetFactories, sourceFactories, base, older, newer, result) => {
        testMerger({
          base: [...targetFactories.map(o => o(base))],
          older: [...sourceFactories.map(o => o(older)), older, (0, _helpers.createIterable)(older)],
          newer: [...sourceFactories.map(o => o(newer)), newer, (0, _helpers.createIterable)(newer)],
          preferCloneOlderParam: [null],
          preferCloneNewerParam: [null],
          preferCloneMeta: [true],
          valueType: [null],
          valueFactory: [null],
          setFunc: [true],
          expected: {
            error: null,
            returnValue: true,
            setValue: (0, _set.fillMap)(new Map(), result),
            base: _TestMerger.BASE,
            older: _TestMerger.OLDER,
            newer: _TestMerger.NEWER
          },
          actions: null
        });
      };

      it('Map', function () {
        testMergeMaps([o => (0, _set.fillMap)(new Map(), o), o => (0, _set.fillMap)(new _ObservableMap.ObservableMap(new Map()), o)], [o => (0, _set.fillMap)(new Map(), o), o => (0, _set.fillMap)(new _ObservableMap.ObservableMap(new Map()), o)], [[0, null], [func, func], [void 0, {
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
        testMergeMaps([o => (0, _set.fillMap)(new _ArrayMap.ArrayMap(), o), o => (0, _set.fillMap)(new _ObservableMap.ObservableMap(new _ArrayMap.ArrayMap()), o), o => (0, _set.fillMap)(new _ObjectHashMap.ObjectHashMap(), o), o => (0, _set.fillMap)(new _ObservableMap.ObservableMap(new _ObjectHashMap.ObjectHashMap()), o)], [o => (0, _set.fillMap)(new Map(), o), o => (0, _set.fillMap)(new _ObservableMap.ObservableMap(new Map()), o), o => (0, _set.fillMap)(new _ArrayMap.ArrayMap(), o), o => (0, _set.fillMap)(new _ObservableMap.ObservableMap(new _ArrayMap.ArrayMap()), o), o => (0, _set.fillMap)(new _ObjectHashMap.ObjectHashMap(), o), o => (0, _set.fillMap)(new _ObservableMap.ObservableMap(new _ObjectHashMap.ObjectHashMap()), o)], [[func2, null], [func, func], [func4, {
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
        testMergeMaps([o => (0, _set.fillMap)(new _ObjectMap.ObjectMap(), o), o => (0, _set.fillMap)(new _ObservableMap.ObservableMap(new _ObjectMap.ObjectMap()), o)], [o => (0, _set.fillMap)(new Map(), o), o => (0, _set.fillMap)(new _ObservableMap.ObservableMap(new Map()), o), o => (0, _set.fillMap)(new _ObjectMap.ObjectMap(), o), o => (0, _set.fillMap)(new _ObservableMap.ObservableMap(new _ObjectMap.ObjectMap()), o), o => (0, _set.fillObject)({}, o)], [['0', null], ['1', func], ['3', {
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
      const testMergeSets = (targetFactories, sourceFactories, base, older, newer, result) => {
        testMerger({
          base: [...targetFactories.map(o => o(base))],
          older: [...sourceFactories.map(o => o(older)), older, (0, _helpers.createIterable)(older)],
          newer: [...sourceFactories.map(o => o(newer)), newer, (0, _helpers.createIterable)(newer)],
          preferCloneOlderParam: [null],
          preferCloneNewerParam: [null],
          preferCloneMeta: [true],
          valueType: [null],
          valueFactory: [null],
          setFunc: [true],
          expected: {
            error: null,
            returnValue: true,
            setValue: (0, _set.fillSet)(new Set(), result),
            base: _TestMerger.BASE,
            older: _TestMerger.OLDER,
            newer: _TestMerger.NEWER
          },
          actions: null
        });
      };

      it('Set', function () {
        testMergeSets([o => (0, _set.fillSet)(new Set(), o), o => (0, _set.fillSet)(new _ObservableSet.ObservableSet(new Set()), o)], [o => (0, _set.fillSet)(new Set(), o), o => (0, _set.fillSet)(new _ObservableSet.ObservableSet(new Set()), o)], [0, func, void 0], [0, func, object], [0, 1, void 0, object], [0, 1, object]);
      });
      it('ArraySet', function () {
        testMergeSets([o => (0, _set.fillSet)(new _ArraySet.ArraySet(), o), o => (0, _set.fillSet)(new _ObservableSet.ObservableSet(new _ArraySet.ArraySet()), o)], [o => (0, _set.fillSet)(new Set(), o), o => (0, _set.fillSet)(new _ObservableSet.ObservableSet(new Set()), o), o => (0, _set.fillSet)(new _ArraySet.ArraySet(), o), o => (0, _set.fillSet)(new _ObservableSet.ObservableSet(new _ArraySet.ArraySet()), o)], [func2, func, func4], [func2, func, object], [func2, func3, func4, object], [func2, func3, object]);
      });
      it('ObjectSet', function () {
        testMergeSets([o => (0, _set.fillSet)(new _ObjectSet.ObjectSet(), o), o => (0, _set.fillSet)(new _ObservableSet.ObservableSet(new _ObjectSet.ObjectSet()), o), o => (0, _set.fillSet)(new _SortedList.SortedList({
          autoSort: true,
          notAddIfExists: true
        }), o)], [o => (0, _set.fillSet)(new Set(), o), o => (0, _set.fillSet)(new _ObservableSet.ObservableSet(new Set()), o), o => (0, _set.fillSet)(new _ObjectSet.ObjectSet(), o), o => (0, _set.fillSet)(new _ObservableSet.ObservableSet(new _ObjectSet.ObjectSet()), o), o => (0, _set.fillSet)(new _SortedList.SortedList({
          autoSort: true,
          notAddIfExists: true
        }), o), o => (0, _set.fillObjectKeys)({}, o)], ['0', '2', '3'], ['0', '2', '4'], ['0', '1', '3', '4'], ['0', '1', '4']);
      });
    });
  });
});