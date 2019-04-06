"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyMapChangedToArray = applyMapChangedToArray;
exports.TestMap = exports.THIS = void 0;

var _IMapChanged = require("../../../../../../../main/common/lists/contracts/IMapChanged");

var _compare = require("../../../../../../../main/common/lists/helpers/compare");

var _ObjectMap = require("../../../../../../../main/common/lists/ObjectMap");

var _ObservableMap = require("../../../../../../../main/common/lists/ObservableMap");

var _TestVariants = require("./TestVariants");

const THIS = {};
exports.THIS = THIS;

function compareEntries(o1, o2) {
  return (0, _compare.compareFast)(o1[0], o2[0]);
}

function indexOf(array, item) {
  for (let i = 0; i < array.length; i++) {
    if (compareEntries(array[i], item) === 0) {
      return i;
    }
  }

  return -1;
}

function applyMapChangedToArray(event, array) {
  switch (event.type) {
    case _IMapChanged.MapChangedType.Added:
      array.push([event.key, event.newValue]);
      break;

    case _IMapChanged.MapChangedType.Removed:
      {
        const index = indexOf(array, [event.key, event.newValue]);
        array.splice(index, 1);
      }
      break;

    case _IMapChanged.MapChangedType.Set:
      {
        const index = indexOf(array, [event.key, undefined]);
        array[index][1] = event.newValue;
      }
      break;
  }
}

function assertMap(map, expectedArray) {
  expectedArray = expectedArray.map(o => o.slice()).sort(compareEntries);
  assert.deepStrictEqual(Array.from(map.keys()).sort(_compare.compareFast), expectedArray.map(o => o[0]));
  assert.deepStrictEqual(Array.from(map.values()).sort(_compare.compareFast), expectedArray.map(o => o[1]).sort(_compare.compareFast));
  assert.deepStrictEqual(Array.from(map.entries()).sort(compareEntries), expectedArray);
  assert.deepStrictEqual(Array.from(map.entries()).sort(compareEntries), expectedArray);
  assert.strictEqual(map.size, expectedArray.length);

  for (const item of expectedArray) {
    assert.strictEqual(map.has(item[0]), true);
    assert.strictEqual(map.has(Math.random()), false);
  }

  const forEachArray = [];
  const thisArg = {};
  map.forEach(function (value, key, instance) {
    assert.strictEqual(this, thisArg);
    assert.strictEqual(instance, map);
    forEachArray.push([key, value]);
  }, thisArg);
  assert.deepStrictEqual(forEachArray.sort(compareEntries), expectedArray);
  assert.deepStrictEqual(Array.from(map).sort(compareEntries), expectedArray);
}

const staticMapInner = new Map();
const staticMap = new _ObservableMap.ObservableMap({
  map: staticMapInner
}); // class ObjectMapWrapper<V> implements Map<string, V> {
// 	private readonly _object: { [key: string]: V }
// 	constructor(object: { [key: string]: V }) {
// 		this._object = object
// 	}
//
// 	public get size(): number {
// 		return Object.keys(this._object).length
// 	}
//
// 	public entries(): IterableIterator<[string, V]> {
// 		const {_object} = this
// 		return Object.keys(_object).map(o => [o, _object[o]] as [string, V])[Symbol.iterator]()
// 	}
//
// 	public set(key: string, value: V): this {
// 		this._object[key] = value
// 		return this
// 	}
//
// }

class TestMap extends _TestVariants.TestVariants {
  constructor() {
    super();
    this.baseOptionsVariants = {
      reuseMapInstance: [false, true],
      useMapChanged: [false, true],
      useObjectMap: [false, true]
    };
  }

  testVariant(options) {
    let error;

    for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
      let unsubscribeMapChanged;
      let unsubscribePropertyChanged;

      try {
        const array = options.array.map(o => o.slice());
        let map;
        let mapInner;

        if (options.reuseMapInstance) {
          staticMap.clear();

          for (const item of array) {
            staticMap.set(...item);
          }

          map = staticMap;
          mapInner = staticMapInner;
        } else {
          mapInner = options.useObjectMap ? new _ObjectMap.ObjectMap({}) : new Map();

          for (const item of array) {
            mapInner.set(...item);
          }

          map = new _ObservableMap.ObservableMap({
            map: mapInner
          });
        }

        const arrayReplicate = array.map(o => o.slice());
        const mapChangedEvents = [];

        if (options.useMapChanged) {
          unsubscribeMapChanged = map.mapChanged.subscribe(event => {
            mapChangedEvents.push(event);
            applyMapChangedToArray(event, arrayReplicate);

            if (event.type !== _IMapChanged.MapChangedType.Removed || mapInner.size > 0) {
              assert.deepStrictEqual(arrayReplicate.map(o => o.slice()).sort(compareEntries), Array.from(mapInner.entries()).sort(compareEntries));
            }
          });
        }

        const propertyChangedEvents = [];
        unsubscribePropertyChanged = map.propertyChanged.subscribe(event => {
          propertyChangedEvents.push(event);
        });

        if (!options.reuseMapInstance) {
          assertMap(map, Array.from(mapInner.entries()));
        }

        if (options.expected.error) {
          assert.throws(() => options.action(map), options.expected.error);
          assertMap(map, options.array);
        } else {
          assert.deepStrictEqual(options.action(map), options.expected.returnValue === THIS ? map : options.expected.returnValue);
          assertMap(map, options.expected.array);
        }

        assert.deepStrictEqual(Array.from(mapInner.entries()).sort(compareEntries), Array.from(map.entries()).sort(compareEntries));

        if (options.useMapChanged) {
          if (unsubscribeMapChanged) {
            unsubscribeMapChanged();
          }

          assert.deepStrictEqual(mapChangedEvents, options.expected.mapChanged || []);
          assert.deepStrictEqual(arrayReplicate.map(o => o.slice()).sort(compareEntries), Array.from(map.entries()).sort(compareEntries));
        }

        if (unsubscribePropertyChanged) {
          unsubscribePropertyChanged();
        }

        let expectedPropertyChanged = options.expected.propertyChanged;

        if (!expectedPropertyChanged && !options.expected.error && options.array.length !== options.expected.array.length) {
          expectedPropertyChanged = [{
            name: 'size',
            oldValue: options.array.length,
            newValue: options.expected.array.length
          }];
        }

        assert.deepStrictEqual(propertyChangedEvents, expectedPropertyChanged || []);
        break;
      } catch (ex) {
        if (!debugIteration) {
          console.log(`Error in: ${options.description}\n${JSON.stringify(options, null, 4)}\n${options.action.toString()}\n${ex.stack}`);
          error = ex;
        }
      } finally {
        if (unsubscribeMapChanged) {
          unsubscribeMapChanged();
        }

        if (unsubscribePropertyChanged) {
          unsubscribePropertyChanged();
        }

        TestMap.totalMapTests++;
      }
    }

    if (error) {
      throw error;
    }
  }

  static test(testCases) {
    TestMap._instance.test(testCases);
  }

}

exports.TestMap = TestMap;
TestMap.totalMapTests = 0;
TestMap._instance = new TestMap();