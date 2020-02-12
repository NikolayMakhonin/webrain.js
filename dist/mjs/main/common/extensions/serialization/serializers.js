import { ThenableSync } from '../../async/ThenableSync';
import { typeToDebugString } from '../../helpers/helpers';
import { getObjectUniqueId } from '../../helpers/object-unique-id';
import { TypeMetaCollectionWithId } from '../TypeMeta';
// region SerializerVisitor
export class SerializerVisitor {
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

    const id = getObjectUniqueId(object);
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
    if (value == null || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
      return value;
    }

    return this.addObject(value, out => {
      this.serializeObject(out, value, options);
    });
  }

} // tslint:disable-next-line:no-shadowed-variable no-empty

const LOCKED = function LOCKED() {};

export class DeSerializerVisitor {
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

      const type = _typeMeta.getType(uuid); // noinspection HtmlUnknownTag


      return {
        type: type == null ? `<Type not found: ${uuid}>` : type.name,
        data: object.data,
        deserialized: deserialized == null ? deserialized : deserialized.constructor.name
      };
    };

    if (this._countDeserialized !== _instances.length) {
      throw new Error(`${_instances.length - this._countDeserialized} instances is not deserialized\r\n` + JSON.stringify(_instances.map((o, i) => [o, i]).filter(o => !o[0] || o[0] === LOCKED || ThenableSync.isThenable(o[0])).map(o => getDebugObject(o[0], o[1]))));
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
        return ThenableSync.resolve(onfulfilled(serializedValue));
      }

      return serializedValue;
    }

    const id = serializedValue.id;

    if (id != null) {
      let cachedInstance = this._instances[id];

      if (cachedInstance) {
        if (cachedInstance === LOCKED) {
          this._instances[id] = cachedInstance = new ThenableSync();
        }

        if (onfulfilled) {
          if (cachedInstance instanceof ThenableSync) {
            cachedInstance.thenLast(onfulfilled);
          } else {
            return ThenableSync.resolve(onfulfilled(cachedInstance));
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
      throw new Error(`Class (${typeToDebugString(type)}) have no type meta`);
    }

    const serializer = meta.serializer;

    if (!serializer) {
      throw new Error(`Class (${typeToDebugString(type)}) type meta have no serializer`);
    }

    if (!serializer.deSerialize) {
      throw new Error(`Class (${typeToDebugString(type)}) serializer have no deSerialize method`);
    }

    let factory = options && options.valueFactory || meta.valueFactory || ((...args) => new type(...args));

    if (id != null && !factory) {
      throw new Error(`valueFactory not found for ${typeToDebugString(type)}. ` + 'Any object serializers should have valueFactory');
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

      if (cachedInstance instanceof ThenableSync) {
        cachedInstance.resolve(value);
      }
    };

    const resolveValue = value => {
      if (id != null) {
        if (!factory && instance !== value) {
          throw new Error(`valueFactory instance !== return value in serializer for ${typeToDebugString(type)}`);
        }

        resolveInstance(value);
        this._countDeserialized++;
      }

      if (onfulfilled) {
        return ThenableSync.resolve(onfulfilled(value));
      }

      return value;
    };

    const valueOrThenFunc = ThenableSync.resolve(iteratorOrValue, resolveValue);

    if (id != null && !factory && ThenableSync.isThenable(valueOrThenFunc)) {
      resolveInstance(instance);

      if (onfulfilled) {
        return ThenableSync.resolve(onfulfilled(instance));
      }

      return instance;
    }

    return valueOrThenFunc;
  }

} // endregion
// region TypeMetaSerializerCollection

export class TypeMetaSerializerCollection extends TypeMetaCollectionWithId {
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
TypeMetaSerializerCollection.default = new TypeMetaSerializerCollection();
export function registerSerializable(type, meta) {
  TypeMetaSerializerCollection.default.putSerializableType(type, meta);
}
export function registerSerializer(type, meta) {
  TypeMetaSerializerCollection.default.putType(type, meta);
} // endregion
// region ObjectSerializer

export class ObjectSerializer {
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

ObjectSerializer.default = new ObjectSerializer();
export function serializeArray(serialize, value, length) {
  if (length == null) {
    length = value.length;
  }

  const serializedValue = [];

  for (let i = 0; i < length; i++) {
    serializedValue[i] = serialize(value[i]);
  }

  return serializedValue;
}
export function deSerializeArray(deSerialize, serializedValue, value) {
  for (let i = 0, len = serializedValue.length; i < len; i++) {
    const index = i;

    if (ThenableSync.isThenable(deSerialize(serializedValue[index], o => {
      value[index] = o;
    }))) {
      value[index] = null;
    }
  }

  return value;
}
export function serializeIterable(serialize, value) {
  const serializedValue = [];

  for (const item of value) {
    serializedValue.push(serialize(item));
  }

  return serializedValue;
}
export function* deSerializeIterableOrdered(serializedValue, add) {
  for (let i = 0, len = serializedValue.length; i < len; i++) {
    yield add(serializedValue[i]);
  }
}
export function deSerializeIterable(serializedValue, add) {
  for (let i = 0, len = serializedValue.length; i < len; i++) {
    add(serializedValue[i]);
  }
} // endregion
// region Object

export function serializeObject(serialize, value, options) {
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
export function deSerializeObject(deSerialize, serializedValue, value) {
  for (const key in serializedValue) {
    if (Object.prototype.hasOwnProperty.call(serializedValue, key)) {
      // tslint:disable-next-line:no-collapsible-if
      if (ThenableSync.isThenable(deSerialize(serializedValue[key], o => {
        value[key] = o;
      }))) {
        value[key] = null;
      }
    }
  }

  return value;
} // noinspection SpellCheckingInspection

registerSerializer(Object, {
  uuid: '88968a59178c4e73a99f801e8cdfc37d',
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

export function serializePrimitiveAsObject(serialize, object) {
  const value = object.valueOf();

  if (value === object) {
    throw new Error(`value is not primitive as object: ${value && value.constructor.name}`);
  }

  return value; // return {
  // 	value: serialize(value),
  // 	object: serializeObject(serialize, object, options) as any,
  // }
}
export function deSerializePrimitiveAsObject(deSerialize, serializedValue, valueFactory) {
  const object = valueFactory(serializedValue); // deSerializeObject(deSerialize, serializedValue.object as any, object)

  return object;
}
const primitiveAsObjectSerializer = {
  serialize: serializePrimitiveAsObject,
  deSerialize: deSerializePrimitiveAsObject
}; // @ts-ignore
// noinspection SpellCheckingInspection

registerSerializer(String, {
  uuid: '96104fd7d6f84a32b8f2feaa4f3666d8',
  serializer: primitiveAsObjectSerializer
}); // @ts-ignore

registerSerializer(Number, {
  uuid: 'dea0de4018014025b6a4b6f6c7a4fa11',
  serializer: primitiveAsObjectSerializer
}); // @ts-ignore

registerSerializer(Boolean, {
  uuid: 'e8d1ac82a0fa4431a23e3d8f954f736f',
  serializer: primitiveAsObjectSerializer
}); // endregion
// region Array

registerSerializer(Array, {
  uuid: 'f8c84ed084634f45b14a228967dfb0de',
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
  uuid: '17b11d99ce034349969e4f9291d0778c',
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
  uuid: 'fdf40f2159b74cb2804f3d18ebb19b57',
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
  uuid: '7a6c01dba6b84822a9a586e4d3a4460b',
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