let _Symbol$toStringTag, _Symbol$iterator;

import { ObjectSerializer, registerSerializable } from '../../../../../../../main/common/extensions/serialization/serializers';
import { ArrayMap } from '../../../../../../../main/common/lists/ArrayMap';
import { MapChangedType } from '../../../../../../../main/common/lists/contracts/IMapChanged';
import { compareFast } from '../../../../../../../main/common/lists/helpers/compare';
import { ObjectHashMap } from '../../../../../../../main/common/lists/ObjectHashMap';
import { ObjectMap } from '../../../../../../../main/common/lists/ObjectMap';
import { ObservableMap } from '../../../../../../../main/common/lists/ObservableMap';
import { Assert } from '../../../../../../../main/common/test/Assert';
import { DeepCloneEqual } from '../../../../../../../main/common/test/DeepCloneEqual';
import { TestVariants, THIS } from '../../../src/helpers/TestVariants';
import { convertToObject } from './common';
export const assert = new Assert(new DeepCloneEqual({
  commonOptions: {},
  equalOptions: {
    // noCrossReferences: true,
    equalInnerReferences: true,
    equalTypes: true,
    equalMapSetOrder: true,
    strictEqualFunctions: true
  }
}));

function compareEntries(o1, o2) {
  return compareFast(o1[0], o2[0]);
}

function indexOf(array, item) {
  for (let i = 0; i < array.length; i++) {
    if (compareEntries(array[i], item) === 0) {
      return i;
    }
  }

  return -1;
}

export function applyMapChangedToArray(event, array) {
  switch (event.type) {
    case MapChangedType.Added:
      array.push([event.key, event.newValue]);
      break;

    case MapChangedType.Removed:
      {
        const index = indexOf(array, [event.key, event.newValue]);
        array.splice(index, 1);
      }
      break;

    case MapChangedType.Set:
      {
        const index = indexOf(array, [event.key, undefined]);
        array[index][1] = event.newValue;
      }
      break;
  }
}

function testSerialization(map) {
  const serialized = ObjectSerializer.default.serialize(map);
  const result = ObjectSerializer.default.deSerialize(serialized);
  assert.notStrictEqual(result, map);
  assert.deepStrictEqual(Array.from(result.entries()), Array.from(map.entries()));
}

function assertMap(map, expectedArray) {
  expectedArray = expectedArray.map(o => o.slice()).sort(compareEntries);
  assert.deepStrictEqual(Array.from(map.keys()).sort(compareFast), expectedArray.map(o => o[0]));
  assert.deepStrictEqual(Array.from(map.values()).sort(compareFast), expectedArray.map(o => o[1]).sort(compareFast));
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
const staticMap = new ObservableMap(staticMapInner); // class ObjectMapWrapper<V> implements Map<string, V> {
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
    return this._map.delete(convertToObject(key));
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
    return this._map.get(convertToObject(key));
  }

  has(key) {
    return this._map.has(convertToObject(key));
  }

  *keys() {
    for (const item of this._map.keys()) {
      yield item.value;
    }
  }

  set(key, value) {
    this._map.set(convertToObject(key), value);

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
registerSerializable(MapWrapper, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerMap = yield deSerialize(serializedValue.map);
      const value = valueFactory(innerMap);
      value.deSerialize(deSerialize, serializedValue);
      return value;
    }

  }
});
export class TestMap extends TestVariants {
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
              mapInner = new ObjectMap({});
              break;

            case 'ObjectHashMap':
              mapInner = new MapWrapper(new ObjectHashMap({}));
              break;

            case 'ArrayMap':
              mapInner = new MapWrapper(new ArrayMap([]));
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

          map = new ObservableMap(mapInner);
        }

        const arrayReplicate = array.map(o => o.slice());
        const mapChangedEvents = [];

        if (options.useMapChanged) {
          unsubscribeMapChanged = map.mapChanged.subscribe(event => {
            mapChangedEvents.push(event);
            applyMapChangedToArray(event, arrayReplicate);

            if (event.type !== MapChangedType.Removed || mapInner.size > 0) {
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
TestMap.totalMapTests = 0;
TestMap._instance = new TestMap();