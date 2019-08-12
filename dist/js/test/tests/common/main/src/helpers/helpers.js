"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIterableIterator = createIterableIterator;
exports.createIterable = createIterable;
exports.createComplexObject = createComplexObject;
exports.CircularClass = void 0;

var _mergers = require("../../../../../../main/common/extensions/merge/mergers");

var _serializers = require("../../../../../../main/common/extensions/serialization/serializers");

var _helpers = require("../../../../../../main/common/helpers/helpers");

var _ArrayMap = require("../../../../../../main/common/lists/ArrayMap");

var _ArraySet = require("../../../../../../main/common/lists/ArraySet");

var _ObjectMap = require("../../../../../../main/common/lists/ObjectMap");

var _ObjectSet = require("../../../../../../main/common/lists/ObjectSet");

var _ObservableMap = require("../../../../../../main/common/lists/ObservableMap");

var _ObservableSet = require("../../../../../../main/common/lists/ObservableSet");

var _SortedList = require("../../../../../../main/common/lists/SortedList");

var _ObservableObject = require("../../../../../../main/common/rx/object/ObservableObject");

var _ObservableObjectBuilder = require("../../../../../../main/common/rx/object/ObservableObjectBuilder");

var _property = require("../../../../../../main/common/rx/object/properties/property");

/* tslint:disable:object-literal-key-quotes no-construct use-primitive-type */
class CircularClass extends _ObservableObject.ObservableObject {
  constructor(array, value) {
    super();
    this.array = array;
    this.value = value;
  } // region IMergeable


  _canMerge(source) {
    if (source.constructor === CircularClass) {
      return null;
    }

    return source.constructor === CircularClass; // || Array.isArray(source)
    // || isIterable(source)
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    let changed = false;
    changed = merge(this.array, older.array, newer.array, o => {
      this.array = o;
    }) || changed;
    changed = merge(this.value, older.value, newer.value, o => {
      this.value = o;
    }) || changed;
    return changed;
  } // endregion
  // region ISerializable


  serialize(serialize) {
    return {
      array: serialize(this.array),
      value: serialize(this.value)
    };
  }

  *deSerialize(deSerialize, serializedValue) {
    this.value = yield deSerialize(serializedValue.value);
  } // endregion


}

exports.CircularClass = CircularClass;
CircularClass.uuid = 'e729e03f-d0f4-4994-9f0f-97da23c7bab8';
(0, _mergers.registerMergeable)(CircularClass);
(0, _serializers.registerSerializable)(CircularClass, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const array = yield deSerialize(serializedValue.array);
      const value = valueFactory(array);
      yield value.deSerialize(deSerialize, serializedValue);
      return value;
    }

  }
});
new _ObservableObjectBuilder.ObservableObjectBuilder(CircularClass.prototype).writable('array');

function* createIterableIterator(iterable) {
  const array = Array.from(iterable);

  for (const item of array) {
    yield item;
  }
}

function createIterable(iterable) {
  const array = Array.from(iterable);
  return {
    [Symbol.iterator]() {
      return createIterableIterator(array);
    }

  };
}

function createComplexObject(options = {}) {
  const array = [];
  const object = {};
  const circularClass = new CircularClass(array);
  circularClass.value = object;
  Object.assign(object, {
    _undefined: void 0,
    _null: null,
    _false: false,
    _stringEmpty: '',
    _zero: 0,
    true: true,
    string: 'string',
    date: new Date(12345),
    number: 123.45,
    'nan': NaN,
    'infinity': Infinity,
    '-infinity': -Infinity,
    StringEmpty: new String(''),
    String: new String('String'),
    Number: new Number(123),
    NaN: new Number(NaN),
    Infinity: new Number(Infinity),
    '-Infinity': new Number(-Infinity),
    Boolean: new Boolean(true),
    circularClass: options.circular && options.circularClass && circularClass,
    object: options.circular && object,
    array: options.array && array,
    sortedList: options.sortedList && new _SortedList.SortedList(),
    set: options.set && new Set(),
    arraySet: options.arraySet && new _ArraySet.ArraySet(),
    objectSet: options.objectSet && new _ObjectSet.ObjectSet(),
    map: options.map && new Map(),
    arrayMap: options.arrayMap && new _ArrayMap.ArrayMap(),
    objectMap: options.objectMap && new _ObjectMap.ObjectMap(),
    iterable: options.function && createIterable(array),
    // iterator: options.function && toIterableIterator(array),
    promiseSync: options.function && {
      then: resolve => resolve(object)
    },
    promiseAsync: options.function && {
      then: resolve => setTimeout(() => resolve(object), 0)
    },
    property: new _property.Property(null, object)
  });
  object.setObservable = options.set && options.observableSet && new _ObservableSet.ObservableSet(object.set);
  object.arraySetObservable = options.arraySet && options.observableSet && new _ObservableSet.ObservableSet(object.arraySet);
  object.objectSetObservable = options.objectSet && options.observableSet && new _ObservableSet.ObservableSet(object.objectSet);
  object.mapObservable = options.map && options.observableMap && new _ObservableMap.ObservableMap(object.map);
  object.arrayMapObservable = options.arrayMap && options.observableMap && new _ObservableMap.ObservableMap(object.arrayMap);
  object.objectMapObservable = options.objectMap && options.observableMap && new _ObservableMap.ObservableMap(object.objectMap);

  const valueIsCollection = value => {
    return value && ((0, _helpers.isIterable)(value) || value.constructor === Object);
  };

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key];

      if (!value && !key.startsWith('_')) {
        delete object[key];
        continue;
      }

      if (options.circular || !valueIsCollection(value)) {
        if (object.sortedList) {
          object.sortedList.add(value);
        }

        if (object.set) {
          object.set.add(value);
        }

        if (object.map) {
          object.map.set(value, value);
        }

        if (object.array) {
          array.push(value);
        }
      }
    }
  }

  for (const key of Object.keys(object).reverse()) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key];

      if (!options.undefined && typeof value === 'undefined') {
        delete object[key];
      }

      if (options.circular || !valueIsCollection(value)) {
        if (object.arraySet && value && typeof value === 'object') {
          object.arraySet.add(value);
        }

        if (object.objectSet) {
          object.objectSet.add(key);
        }

        if (object.arrayMap && value && typeof value === 'object') {
          object.arrayMap.set(value, value);
        }

        if (object.objectMap) {
          object.objectMap.set(key, value);
        }
      }
    }
  }

  return object;
}