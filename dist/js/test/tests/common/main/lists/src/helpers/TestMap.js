"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyMapChangedToArray = applyMapChangedToArray;
exports.TestMap = exports.assert = void 0;

var _serializers = require("../../../../../../../main/common/extensions/serialization/serializers");

var _ArrayMap = require("../../../../../../../main/common/lists/ArrayMap");

var _IMapChanged = require("../../../../../../../main/common/lists/contracts/IMapChanged");

var _compare = require("../../../../../../../main/common/lists/helpers/compare");

var _ObjectHashMap = require("../../../../../../../main/common/lists/ObjectHashMap");

var _ObjectMap = require("../../../../../../../main/common/lists/ObjectMap");

var _ObservableMap = require("../../../../../../../main/common/lists/ObservableMap");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _DeepCloneEqual = require("../../../../../../../main/common/test/DeepCloneEqual");

var _TestVariants = require("../../../src/helpers/TestVariants");

var _common = require("./common");

let _Symbol$toStringTag, _Symbol$iterator;

const assert = new _Assert.Assert(new _DeepCloneEqual.DeepCloneEqual({
  commonOptions: {},
  equalOptions: {
    // noCrossReferences: true,
    equalInnerReferences: true,
    equalTypes: true,
    equalMapSetOrder: true,
    strictEqualFunctions: true
  }
}));
exports.assert = assert;

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

function testSerialization(map) {
  const serialized = _serializers.ObjectSerializer.default.serialize(map);

  const result = _serializers.ObjectSerializer.default.deSerialize(serialized);

  assert.notStrictEqual(result, map);
  assert.deepStrictEqual(Array.from(result.entries()), Array.from(map.entries()));
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
  testSerialization(map);
}

const staticMapInner = new Map();
const staticMap = new _ObservableMap.ObservableMap(staticMapInner); // class ObjectMapWrapper<V> implements Map<string, V> {
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

_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;

class MapWrapper {
  constructor(map) {
    this[_Symbol$toStringTag] = 'Map';
    this._map = map;
  }

  get size() {
    return this._map.size;
  }

  *[_Symbol$iterator]() {
    for (const item of this._map) {
      yield [item[0].value, item[1]];
    }
  }

  clear() {
    this._map.clear();
  }

  delete(key) {
    return this._map.delete((0, _common.convertToObject)(key));
  }

  *entries() {
    for (const entry of this._map.entries()) {
      yield [entry[0].value, entry[1]];
    }
  }

  forEach(callbackfn, thisArg) {
    this._map.forEach(function (value, key) {
      callbackfn(value, key.value, this);
    }, thisArg);
  }

  get(key) {
    return this._map.get((0, _common.convertToObject)(key));
  }

  has(key) {
    return this._map.has((0, _common.convertToObject)(key));
  }

  *keys() {
    for (const item of this._map.keys()) {
      yield item.value;
    }
  }

  set(key, value) {
    this._map.set((0, _common.convertToObject)(key), value);

    return this;
  }

  values() {
    return this._map.values();
  } // region ISerializable


  serialize(serialize) {
    return {
      map: serialize(this._map)
    };
  } // tslint:disable-next-line:no-empty


  deSerialize(deSerialize, serializedValue) {} // endregion


}

MapWrapper.uuid = 'bc06eeb65139444aa73557a6e1928ac9';
(0, _serializers.registerSerializable)(MapWrapper, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerMap = yield deSerialize(serializedValue.map);
      const value = valueFactory(innerMap);
      value.deSerialize(deSerialize, serializedValue);
      return value;
    }

  }
});

class TestMap extends _TestVariants.TestVariants {
  constructor() {
    super();
    this.baseOptionsVariants = {
      reuseMapInstance: [false, true],
      useMapChanged: [false, true],
      innerMap: ['Map', 'Map<Object>', 'ObjectMap', 'ObjectHashMap', 'ArrayMap']
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
          switch (options.innerMap) {
            case 'ObjectMap':
              mapInner = new _ObjectMap.ObjectMap({});
              break;

            case 'ObjectHashMap':
              mapInner = new MapWrapper(new _ObjectHashMap.ObjectHashMap({}));
              break;

            case 'ArrayMap':
              mapInner = new MapWrapper(new _ArrayMap.ArrayMap([]));
              break;

            case 'Map<Object>':
              mapInner = new MapWrapper(new Map());
              break;

            case 'Map':
              mapInner = new Map();
              break;

            default:
              assert.fail('Unknown options.innerMap: ' + options.innerMap);
              break;
          }

          for (const item of array) {
            mapInner.set(...item);
          }

          map = new _ObservableMap.ObservableMap(mapInner);
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
          assert.deepStrictEqual(options.action(map), options.expected.returnValue === _TestVariants.THIS ? map : options.expected.returnValue);
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