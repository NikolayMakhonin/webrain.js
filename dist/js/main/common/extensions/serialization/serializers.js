"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSerializable = registerSerializable;
exports.registerSerializer = registerSerializer;
exports.serializeArray = serializeArray;
exports.deSerializeArray = deSerializeArray;
exports.serializeIterable = serializeIterable;
exports.deSerializeIterableOrdered = deSerializeIterableOrdered;
exports.deSerializeIterable = deSerializeIterable;
exports.serializeObject = serializeObject;
exports.deSerializeObject = deSerializeObject;
exports.serializePrimitiveAsObject = serializePrimitiveAsObject;
exports.deSerializePrimitiveAsObject = deSerializePrimitiveAsObject;
exports.ObjectSerializer = exports.TypeMetaSerializerCollection = exports.DeSerializerVisitor = exports.SerializerVisitor = void 0;

var _helpers = require("../../helpers/helpers");

var _ThenableSync = require("../../helpers/ThenableSync");

var _objectUniqueId = require("../../lists/helpers/object-unique-id");

var _TypeMeta = require("../TypeMeta");

// region SerializerVisitor
class SerializerVisitor {
  constructor(typeMeta) {
    this._typeMeta = typeMeta;
    this.serialize = this.serialize.bind(this);
  }

  addType(uuid) {
    // tslint:disable-next-line:prefer-const
    let {
      types,
      typesMap
    } = this;

    if (!typesMap) {
      this.typesMap = typesMap = {};
      this.types = types = [];
    }

    let typeIndex = typesMap[uuid];

    if (typeIndex == null) {
      typeIndex = types.length;
      types[typeIndex] = uuid;
      typesMap[uuid] = typeIndex;
    }

    return typeIndex;
  }

  addObject(object, serialize) {
    // tslint:disable-next-line:prefer-const
    let {
      objects,
      objectsMap
    } = this;

    if (!objectsMap) {
      this.objectsMap = objectsMap = [];
      this.objects = objects = [];
    }

    const id = (0, _objectUniqueId.getObjectUniqueId)(object);
    let ref = objectsMap[id];

    if (ref == null) {
      const index = objects.length;
      ref = {
        id: index
      };
      objectsMap[id] = ref;
      const data = {};
      objects[index] = data;
      serialize(data);
    }

    return ref;
  }

  serializeObject(out, value, options) {
    const meta = this._typeMeta.getMeta(options && options.valueType || value.constructor);

    if (!meta) {
      throw new Error(`Class (${value.constructor.name}) have no type meta`);
    }

    const uuid = meta.uuid;

    if (!uuid) {
      throw new Error(`Class (${value.constructor.name}) type meta have no uuid`);
    }

    const serializer = meta.serializer;

    if (!serializer) {
      throw new Error(`Class (${value.constructor.name}) type meta have no serializer`);
    }

    if (!serializer.serialize) {
      throw new Error(`Class (${value.constructor.name}) serializer have no serialize method`);
    }

    out.type = this.addType(uuid);
    out.data = serializer.serialize(this.getNextSerialize(options), value, options);
  } // noinspection JSUnusedLocalSymbols


  getNextSerialize(options) {
    return (next_value, next_options) => this.serialize(next_value, next_options // next_options == null || next_options === options
    // 	? options
    // 	: (options == null ? next_options : {
    // 		...options,
    // 		...next_options,
    // 	}),
    );
  }

  serialize(value, options) {
    if (typeof value === 'undefined') {
      return value;
    }

    if (value === null || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
      return value;
    }

    return this.addObject(value, out => {
      this.serializeObject(out, value, options);
    });
  }

} // tslint:disable-next-line:no-shadowed-variable no-empty


exports.SerializerVisitor = SerializerVisitor;

const LOCKED = function LOCKED() {};

class DeSerializerVisitor {
  constructor(typeMeta, types, objects) {
    this._countDeserialized = 0;
    this._typeMeta = typeMeta;
    this._types = types;
    this._objects = objects;
    const len = objects.length;
    const instances = new Array(len);

    for (let i = 0; i < len; i++) {
      instances[i] = null;
    }

    this._instances = instances;
    this.deSerialize = this.deSerialize.bind(this);
  }

  assertEnd() {
    const {
      _types,
      _objects,
      _instances,
      _typeMeta
    } = this;

    const getDebugObject = (deserialized, id) => {
      const object = _objects[id];
      const uuid = _types[object.type];

      const type = _typeMeta.getType(uuid);

      return {
        type: type == null ? `<Type not found: ${uuid}>` : type.name,
        data: object.data,
        deserialized: deserialized == null ? deserialized : deserialized.constructor.name
      };
    };

    if (this._countDeserialized !== _instances.length) {
      throw new Error(`${_instances.length - this._countDeserialized} instances is not deserialized\r\n` + JSON.stringify(_instances.map((o, i) => [o, i]).filter(o => !o[0] || o[0] === LOCKED || _ThenableSync.ThenableSync.isThenableSync(o[0])).map(o => getDebugObject(o[0], o[1]))));
    }
  } // noinspection JSUnusedLocalSymbols


  getNextDeSerialize(options) {
    return (next_serializedValue, next_onfulfilled, next_options) => this.deSerialize(next_serializedValue, next_onfulfilled, next_options // next_options == null || next_options === options
    // 	? options
    // 	: (options == null ? next_options : {
    // 		...options,
    // 		...next_options,
    // 	}),
    );
  }

  deSerialize(serializedValue, onfulfilled, options) {
    if (onfulfilled) {
      const input_onfulfilled = onfulfilled;

      onfulfilled = value => {
        const result = input_onfulfilled(value);
        onfulfilled = null;
        return result;
      };
    }

    if (serializedValue == null || typeof serializedValue === 'number' || typeof serializedValue === 'string' || typeof serializedValue === 'boolean') {
      if (onfulfilled) {
        return _ThenableSync.ThenableSync.resolve(onfulfilled(serializedValue));
      }

      return serializedValue;
    }

    const id = serializedValue.id;

    if (id != null) {
      let cachedInstance = this._instances[id];

      if (cachedInstance) {
        if (cachedInstance === LOCKED) {
          this._instances[id] = cachedInstance = new _ThenableSync.ThenableSync();
        }

        if (onfulfilled) {
          if (cachedInstance instanceof _ThenableSync.ThenableSync) {
            cachedInstance.thenLast(onfulfilled);
          } else {
            return _ThenableSync.ThenableSync.resolve(onfulfilled(cachedInstance));
          }
        }

        return cachedInstance;
      }

      this._instances[id] = LOCKED;
      serializedValue = this._objects[id];
    }

    let type = options && options.valueType;

    if (!type) {
      const typeIndex = serializedValue.type;

      if (typeof typeIndex !== 'number') {
        throw new Error(`Serialized value have no type field: ${JSON.stringify(serializedValue, null, 4)}`);
      }

      const uuid = this._types[typeIndex];

      if (typeof uuid !== 'string') {
        throw new Error(`type uuid not found for index (${typeIndex}): ${JSON.stringify(serializedValue, null, 4)}`);
      }

      type = this._typeMeta.getType(uuid);

      if (!type) {
        throw new Error(`type not found for uuid (${uuid}): ${JSON.stringify(serializedValue, null, 4)}`);
      }
    }

    const meta = this._typeMeta.getMeta(type);

    if (!meta) {
      throw new Error(`Class (${(0, _helpers.typeToDebugString)(type)}) have no type meta`);
    }

    const serializer = meta.serializer;

    if (!serializer) {
      throw new Error(`Class (${(0, _helpers.typeToDebugString)(type)}) type meta have no serializer`);
    }

    if (!serializer.deSerialize) {
      throw new Error(`Class (${(0, _helpers.typeToDebugString)(type)}) serializer have no deSerialize method`);
    }

    let factory = options && options.valueFactory || meta.valueFactory || ((...args) => new type(...args));

    if (id != null && !factory) {
      throw new Error(`valueFactory not found for ${(0, _helpers.typeToDebugString)(type)}. ` + 'Any object serializers should have valueFactory');
    }

    let instance;
    const iteratorOrValue = serializer.deSerialize(this.getNextDeSerialize(options), serializedValue.data, (...args) => {
      if (!factory) {
        throw new Error('Multiple call valueFactory is forbidden');
      }

      instance = factory(...args);
      factory = null;
      return instance;
    }, options);

    const resolveInstance = value => {
      const cachedInstance = this._instances[id];
      this._instances[id] = value;

      if (cachedInstance instanceof _ThenableSync.ThenableSync) {
        cachedInstance.resolve(value);
      }
    };

    const resolveValue = value => {
      if (id != null) {
        if (!factory && instance !== value) {
          throw new Error(`valueFactory instance !== return value in serializer for ${(0, _helpers.typeToDebugString)(type)}`);
        }

        resolveInstance(value);
        this._countDeserialized++;
      }

      if (onfulfilled) {
        return _ThenableSync.ThenableSync.resolve(onfulfilled(value));
      }

      return value;
    };

    const valueOrThenFunc = _ThenableSync.ThenableSync.resolve(iteratorOrValue, resolveValue);

    if (id != null && !factory && _ThenableSync.ThenableSync.isThenableSync(valueOrThenFunc)) {
      resolveInstance(instance);

      if (onfulfilled) {
        return _ThenableSync.ThenableSync.resolve(onfulfilled(instance));
      }

      return instance;
    }

    return valueOrThenFunc;
  }

} // endregion
// region TypeMetaSerializerCollection


exports.DeSerializerVisitor = DeSerializerVisitor;

class TypeMetaSerializerCollection extends _TypeMeta.TypeMetaCollectionWithId {
  constructor(proto) {
    super(proto || TypeMetaSerializerCollection.default);
  }

  static makeTypeMetaSerializer(type, meta) {
    return {
      uuid: type.uuid,
      // valueFactory: (...args) => new (type as new (...args: any[]) => TObject)(...args),
      ...meta,
      serializer: {
        serialize(serialize, value, options) {
          return value.serialize(serialize, options);
        },

        *deSerialize(deSerialize, serializedValue, valueFactory, options) {
          const value = valueFactory();
          yield value.deSerialize(deSerialize, serializedValue, options);
          return value;
        },

        ...(meta ? meta.serializer : {})
      }
    };
  }

  putSerializableType(type, meta) {
    return this.putType(type, TypeMetaSerializerCollection.makeTypeMetaSerializer(type, meta));
  }

}

exports.TypeMetaSerializerCollection = TypeMetaSerializerCollection;
TypeMetaSerializerCollection.default = new TypeMetaSerializerCollection();

function registerSerializable(type, meta) {
  TypeMetaSerializerCollection.default.putSerializableType(type, meta);
}

function registerSerializer(type, meta) {
  TypeMetaSerializerCollection.default.putType(type, meta);
} // endregion
// region ObjectSerializer


class ObjectSerializer {
  constructor(typeMeta) {
    this.typeMeta = new TypeMetaSerializerCollection(typeMeta);
  }

  serialize(value, options) {
    const serializer = new SerializerVisitor(this.typeMeta);
    const serializedValue = serializer.serialize(value, options);

    if (!serializedValue || typeof serializedValue !== 'object') {
      return serializedValue;
    }

    const serializedData = {
      data: serializedValue
    };

    if (serializer.types) {
      serializedData.types = serializer.types;
    }

    if (serializer.objects) {
      serializedData.objects = serializer.objects;
    }

    return serializedData;
  }

  deSerialize(serializedValue, options) {
    if (!serializedValue || typeof serializedValue !== 'object') {
      return serializedValue;
    }

    const {
      types,
      objects,
      data
    } = serializedValue;

    if (!Array.isArray(types)) {
      throw new Error(`serialized value types field is not array: ${types}`);
    }

    const deSerializer = new DeSerializerVisitor(this.typeMeta, types, objects);
    const value = deSerializer.deSerialize(data, null, options);
    deSerializer.assertEnd();
    return value;
  }

} // endregion
// region Primitive Serializers
// Handled in SerializerVisitor:
// undefined
// null
// number
// string
// boolean
// region Helpers


exports.ObjectSerializer = ObjectSerializer;
ObjectSerializer.default = new ObjectSerializer();

function serializeArray(serialize, value, length) {
  if (length == null) {
    length = value.length;
  }

  const serializedValue = [];

  for (let i = 0; i < length; i++) {
    serializedValue[i] = serialize(value[i]);
  }

  return serializedValue;
}

function deSerializeArray(deSerialize, serializedValue, value) {
  for (let i = 0, len = serializedValue.length; i < len; i++) {
    const index = i;

    if (_ThenableSync.ThenableSync.isThenableSync(deSerialize(serializedValue[index], o => {
      value[index] = o;
    }))) {
      value[index] = null;
    }
  }

  return value;
}

function serializeIterable(serialize, value) {
  const serializedValue = [];

  for (const item of value) {
    serializedValue.push(serialize(item));
  }

  return serializedValue;
}

function* deSerializeIterableOrdered(serializedValue, add) {
  for (let i = 0, len = serializedValue.length; i < len; i++) {
    yield add(serializedValue[i]);
  }
}

function deSerializeIterable(serializedValue, add) {
  for (let i = 0, len = serializedValue.length; i < len; i++) {
    add(serializedValue[i]);
  }
} // endregion
// region Object


function serializeObject(serialize, value, options) {
  const keepUndefined = options && options.objectKeepUndefined;
  const serializedValue = {};

  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      const item = value[key];

      if (keepUndefined || typeof item !== 'undefined') {
        serializedValue[key] = serialize(item);
      }
    }
  }

  return serializedValue;
}

function deSerializeObject(deSerialize, serializedValue, value) {
  for (const key in serializedValue) {
    if (Object.prototype.hasOwnProperty.call(serializedValue, key)) {
      // tslint:disable-next-line:no-collapsible-if
      if (_ThenableSync.ThenableSync.isThenableSync(deSerialize(serializedValue[key], o => {
        value[key] = o;
      }))) {
        value[key] = null;
      }
    }
  }

  return value;
}

registerSerializer(Object, {
  uuid: '88968a59-178c-4e73-a99f-801e8cdfc37d',
  serializer: {
    serialize(serialize, value, options) {
      return serializeObject(serialize, value, options);
    },

    deSerialize(deSerialize, serializedValue, valueFactory) {
      const value = valueFactory();
      return deSerializeObject(deSerialize, serializedValue, value);
    }

  },
  valueFactory: () => ({})
}); // endregion
// region Primitive as object

function serializePrimitiveAsObject(serialize, object) {
  const value = object.valueOf();

  if (value === object) {
    throw new Error(`value is not primitive as object: ${value && value.constructor.name}`);
  }

  return value; // return {
  // 	value: serialize(value),
  // 	object: serializeObject(serialize, object, options) as any,
  // }
}

function deSerializePrimitiveAsObject(deSerialize, serializedValue, valueFactory) {
  const object = valueFactory(serializedValue); // deSerializeObject(deSerialize, serializedValue.object as any, object)

  return object;
}

const primitiveAsObjectSerializer = {
  serialize: serializePrimitiveAsObject,
  deSerialize: deSerializePrimitiveAsObject // @ts-ignore

};
registerSerializer(String, {
  uuid: '96104fd7-d6f8-4a32-b8f2-feaa4f3666d8',
  serializer: primitiveAsObjectSerializer
}); // @ts-ignore

registerSerializer(Number, {
  uuid: 'dea0de40-1801-4025-b6a4-b6f6c7a4fa11',
  serializer: primitiveAsObjectSerializer
}); // @ts-ignore

registerSerializer(Boolean, {
  uuid: 'e8d1ac82-a0fa-4431-a23e-3d8f954f736f',
  serializer: primitiveAsObjectSerializer
}); // endregion
// region Array

registerSerializer(Array, {
  uuid: 'f8c84ed0-8463-4f45-b14a-228967dfb0de',
  serializer: {
    serialize(serialize, value, options) {
      if (options && options.arrayAsObject) {
        return serializeObject(serialize, value, options);
      }

      return serializeArray(serialize, value, options && options.arrayLength);
    },

    deSerialize(deSerialize, serializedValue, valueFactory, options) {
      const value = valueFactory();

      if (options && options.arrayAsObject) {
        return deSerializeObject(deSerialize, serializedValue, value);
      }

      return deSerializeArray(deSerialize, serializedValue, value);
    }

  },
  valueFactory: () => []
}); // endregion
// region Set

registerSerializer(Set, {
  uuid: '17b11d99-ce03-4349-969e-4f9291d0778c',
  serializer: {
    serialize(serialize, value) {
      return serializeIterable(serialize, value);
    },

    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const value = valueFactory();
      yield deSerializeIterableOrdered(serializedValue, o => deSerialize(o, val => {
        value.add(val);
      }));
      return value;
    }

  } // valueFactory: () => new Set(),

}); // endregion
// region Map

registerSerializer(Map, {
  uuid: 'fdf40f21-59b7-4cb2-804f-3d18ebb19b57',
  serializer: {
    serialize(serialize, value) {
      return serializeIterable(item => [serialize(item[0]), serialize(item[1])], value);
    },

    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const value = valueFactory();
      yield deSerializeIterableOrdered(serializedValue, item => deSerialize(item[0], key => deSerialize(item[1], val => {
        value.set(key, val);
      })));
      return value;
    }

  } // valueFactory: () => new Map(),

}); // endregion
// region Date

registerSerializer(Date, {
  uuid: '7a6c01db-a6b8-4822-a9a5-86e4d3a4460b',
  serializer: {
    serialize(serialize, value) {
      return value.getTime();
    },

    deSerialize(deSerialize, serializedValue, valueFactory) {
      return valueFactory(serializedValue);
    }

  } // valueFactory: (value: number|string|Date) => new Date(value),

}); // endregion
// endregion