import _typeof from "@babel/runtime/helpers/typeof";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _construct from "@babel/runtime/helpers/construct";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";

var _marked =
/*#__PURE__*/
_regeneratorRuntime.mark(deSerializeIterableOrdered);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import { ThenableSync } from '../../async/ThenableSync';
import { typeToDebugString } from '../../helpers/helpers';
import { getObjectUniqueId } from '../../lists/helpers/object-unique-id';
import { TypeMetaCollectionWithId } from '../TypeMeta';
// region SerializerVisitor
export var SerializerVisitor =
/*#__PURE__*/
function () {
  function SerializerVisitor(typeMeta) {
    _classCallCheck(this, SerializerVisitor);

    this._typeMeta = typeMeta;
    this.serialize = this.serialize.bind(this);
  }

  _createClass(SerializerVisitor, [{
    key: "addType",
    value: function addType(uuid) {
      // tslint:disable-next-line:prefer-const
      var types = this.types,
          typesMap = this.typesMap;

      if (!typesMap) {
        this.typesMap = typesMap = {};
        this.types = types = [];
      }

      var typeIndex = typesMap[uuid];

      if (typeIndex == null) {
        typeIndex = types.length;
        types[typeIndex] = uuid;
        typesMap[uuid] = typeIndex;
      }

      return typeIndex;
    }
  }, {
    key: "addObject",
    value: function addObject(object, serialize) {
      // tslint:disable-next-line:prefer-const
      var objects = this.objects,
          objectsMap = this.objectsMap;

      if (!objectsMap) {
        this.objectsMap = objectsMap = [];
        this.objects = objects = [];
      }

      var id = getObjectUniqueId(object);
      var ref = objectsMap[id];

      if (ref == null) {
        var index = objects.length;
        ref = {
          id: index
        };
        objectsMap[id] = ref;
        var data = {};
        objects[index] = data;
        serialize(data);
      }

      return ref;
    }
  }, {
    key: "serializeObject",
    value: function serializeObject(out, value, options) {
      var meta = this._typeMeta.getMeta(options && options.valueType || value.constructor);

      if (!meta) {
        throw new Error("Class (".concat(value.constructor.name, ") have no type meta"));
      }

      var uuid = meta.uuid;

      if (!uuid) {
        throw new Error("Class (".concat(value.constructor.name, ") type meta have no uuid"));
      }

      var serializer = meta.serializer;

      if (!serializer) {
        throw new Error("Class (".concat(value.constructor.name, ") type meta have no serializer"));
      }

      if (!serializer.serialize) {
        throw new Error("Class (".concat(value.constructor.name, ") serializer have no serialize method"));
      }

      out.type = this.addType(uuid);
      out.data = serializer.serialize(this.getNextSerialize(options), value, options);
    } // noinspection JSUnusedLocalSymbols

  }, {
    key: "getNextSerialize",
    value: function getNextSerialize(options) {
      var _this = this;

      return function (next_value, next_options) {
        return _this.serialize(next_value, next_options // next_options == null || next_options === options
        // 	? options
        // 	: (options == null ? next_options : {
        // 		...options,
        // 		...next_options,
        // 	}),
        );
      };
    }
  }, {
    key: "serialize",
    value: function serialize(value, options) {
      var _this2 = this;

      if (value == null || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
        return value;
      }

      return this.addObject(value, function (out) {
        _this2.serializeObject(out, value, options);
      });
    }
  }]);

  return SerializerVisitor;
}(); // tslint:disable-next-line:no-shadowed-variable no-empty

var LOCKED = function LOCKED() {};

export var DeSerializerVisitor =
/*#__PURE__*/
function () {
  function DeSerializerVisitor(typeMeta, types, objects) {
    _classCallCheck(this, DeSerializerVisitor);

    this._countDeserialized = 0;
    this._typeMeta = typeMeta;
    this._types = types;
    this._objects = objects;
    var len = objects.length;
    var instances = new Array(len);

    for (var i = 0; i < len; i++) {
      instances[i] = null;
    }

    this._instances = instances;
    this.deSerialize = this.deSerialize.bind(this);
  }

  _createClass(DeSerializerVisitor, [{
    key: "assertEnd",
    value: function assertEnd() {
      var _types = this._types,
          _objects = this._objects,
          _instances = this._instances,
          _typeMeta = this._typeMeta;

      var getDebugObject = function getDebugObject(deserialized, id) {
        var object = _objects[id];
        var uuid = _types[object.type];

        var type = _typeMeta.getType(uuid); // noinspection HtmlUnknownTag


        return {
          type: type == null ? "<Type not found: ".concat(uuid, ">") : type.name,
          data: object.data,
          deserialized: deserialized == null ? deserialized : deserialized.constructor.name
        };
      };

      if (this._countDeserialized !== _instances.length) {
        throw new Error("".concat(_instances.length - this._countDeserialized, " instances is not deserialized\r\n") + JSON.stringify(_instances.map(function (o, i) {
          return [o, i];
        }).filter(function (o) {
          return !o[0] || o[0] === LOCKED || ThenableSync.isThenable(o[0]);
        }).map(function (o) {
          return getDebugObject(o[0], o[1]);
        })));
      }
    } // noinspection JSUnusedLocalSymbols

  }, {
    key: "getNextDeSerialize",
    value: function getNextDeSerialize(options) {
      var _this3 = this;

      return function (next_serializedValue, next_onfulfilled, next_options) {
        return _this3.deSerialize(next_serializedValue, next_onfulfilled, next_options // next_options == null || next_options === options
        // 	? options
        // 	: (options == null ? next_options : {
        // 		...options,
        // 		...next_options,
        // 	}),
        );
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize(serializedValue, _onfulfilled, options) {
      var _this4 = this;

      if (_onfulfilled) {
        var input_onfulfilled = _onfulfilled;

        _onfulfilled = function onfulfilled(value) {
          var result = input_onfulfilled(value);
          _onfulfilled = null;
          return result;
        };
      }

      if (serializedValue == null || typeof serializedValue === 'number' || typeof serializedValue === 'string' || typeof serializedValue === 'boolean') {
        if (_onfulfilled) {
          return ThenableSync.resolve(_onfulfilled(serializedValue));
        }

        return serializedValue;
      }

      var id = serializedValue.id;

      if (id != null) {
        var cachedInstance = this._instances[id];

        if (cachedInstance) {
          if (cachedInstance === LOCKED) {
            this._instances[id] = cachedInstance = new ThenableSync();
          }

          if (_onfulfilled) {
            if (cachedInstance instanceof ThenableSync) {
              cachedInstance.thenLast(_onfulfilled);
            } else {
              return ThenableSync.resolve(_onfulfilled(cachedInstance));
            }
          }

          return cachedInstance;
        }

        this._instances[id] = LOCKED;
        serializedValue = this._objects[id];
      }

      var type = options && options.valueType;

      if (!type) {
        var typeIndex = serializedValue.type;

        if (typeof typeIndex !== 'number') {
          throw new Error("Serialized value have no type field: ".concat(JSON.stringify(serializedValue, null, 4)));
        }

        var _uuid = this._types[typeIndex];

        if (typeof _uuid !== 'string') {
          throw new Error("type uuid not found for index (".concat(typeIndex, "): ").concat(JSON.stringify(serializedValue, null, 4)));
        }

        type = this._typeMeta.getType(_uuid);

        if (!type) {
          throw new Error("type not found for uuid (".concat(_uuid, "): ").concat(JSON.stringify(serializedValue, null, 4)));
        }
      }

      var meta = this._typeMeta.getMeta(type);

      if (!meta) {
        throw new Error("Class (".concat(typeToDebugString(type), ") have no type meta"));
      }

      var serializer = meta.serializer;

      if (!serializer) {
        throw new Error("Class (".concat(typeToDebugString(type), ") type meta have no serializer"));
      }

      if (!serializer.deSerialize) {
        throw new Error("Class (".concat(typeToDebugString(type), ") serializer have no deSerialize method"));
      }

      var factory = options && options.valueFactory || meta.valueFactory || function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _construct(type, args);
      };

      if (id != null && !factory) {
        throw new Error("valueFactory not found for ".concat(typeToDebugString(type), ". ") + 'Any object serializers should have valueFactory');
      }

      var instance;
      var iteratorOrValue = serializer.deSerialize(this.getNextDeSerialize(options), serializedValue.data, function () {
        if (!factory) {
          throw new Error('Multiple call valueFactory is forbidden');
        }

        instance = factory.apply(void 0, arguments);
        factory = null;
        return instance;
      }, options);

      var resolveInstance = function resolveInstance(value) {
        var cachedInstance = _this4._instances[id];
        _this4._instances[id] = value;

        if (cachedInstance instanceof ThenableSync) {
          cachedInstance.resolve(value);
        }
      };

      var resolveValue = function resolveValue(value) {
        if (id != null) {
          if (!factory && instance !== value) {
            throw new Error("valueFactory instance !== return value in serializer for ".concat(typeToDebugString(type)));
          }

          resolveInstance(value);
          _this4._countDeserialized++;
        }

        if (_onfulfilled) {
          return ThenableSync.resolve(_onfulfilled(value));
        }

        return value;
      };

      var valueOrThenFunc = ThenableSync.resolve(iteratorOrValue, resolveValue);

      if (id != null && !factory && ThenableSync.isThenable(valueOrThenFunc)) {
        resolveInstance(instance);

        if (_onfulfilled) {
          return ThenableSync.resolve(_onfulfilled(instance));
        }

        return instance;
      }

      return valueOrThenFunc;
    }
  }]);

  return DeSerializerVisitor;
}(); // endregion
// region TypeMetaSerializerCollection

export var TypeMetaSerializerCollection =
/*#__PURE__*/
function (_TypeMetaCollectionWi) {
  _inherits(TypeMetaSerializerCollection, _TypeMetaCollectionWi);

  function TypeMetaSerializerCollection(proto) {
    _classCallCheck(this, TypeMetaSerializerCollection);

    return _possibleConstructorReturn(this, _getPrototypeOf(TypeMetaSerializerCollection).call(this, proto || TypeMetaSerializerCollection["default"]));
  }

  _createClass(TypeMetaSerializerCollection, [{
    key: "putSerializableType",
    value: function putSerializableType(type, meta) {
      return this.putType(type, TypeMetaSerializerCollection.makeTypeMetaSerializer(type, meta));
    }
  }], [{
    key: "makeTypeMetaSerializer",
    value: function makeTypeMetaSerializer(type, meta) {
      return _objectSpread({
        uuid: type.uuid
      }, meta, {
        serializer: _objectSpread({
          serialize: function serialize(_serialize, value, options) {
            return value.serialize(_serialize, options);
          },
          deSerialize: function deSerialize(_deSerialize, serializedValue, valueFactory, options) {
            return (
              /*#__PURE__*/
              _regeneratorRuntime.mark(function _callee() {
                var value;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        value = valueFactory();
                        _context.next = 3;
                        return value.deSerialize(_deSerialize, serializedValue, options);

                      case 3:
                        return _context.abrupt("return", value);

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              })()
            );
          }
        }, meta ? meta.serializer : {})
      });
    }
  }]);

  return TypeMetaSerializerCollection;
}(TypeMetaCollectionWithId);
TypeMetaSerializerCollection["default"] = new TypeMetaSerializerCollection();
export function registerSerializable(type, meta) {
  TypeMetaSerializerCollection["default"].putSerializableType(type, meta);
}
export function registerSerializer(type, meta) {
  TypeMetaSerializerCollection["default"].putType(type, meta);
} // endregion
// region ObjectSerializer

export var ObjectSerializer =
/*#__PURE__*/
function () {
  function ObjectSerializer(typeMeta) {
    _classCallCheck(this, ObjectSerializer);

    this.typeMeta = new TypeMetaSerializerCollection(typeMeta);
  }

  _createClass(ObjectSerializer, [{
    key: "serialize",
    value: function serialize(value, options) {
      var serializer = new SerializerVisitor(this.typeMeta);
      var serializedValue = serializer.serialize(value, options);

      if (!serializedValue || _typeof(serializedValue) !== 'object') {
        return serializedValue;
      }

      var serializedData = {
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
  }, {
    key: "deSerialize",
    value: function deSerialize(serializedValue, options) {
      if (!serializedValue || _typeof(serializedValue) !== 'object') {
        return serializedValue;
      }

      var _ref = serializedValue,
          types = _ref.types,
          objects = _ref.objects,
          data = _ref.data;

      if (!Array.isArray(types)) {
        throw new Error("serialized value types field is not array: ".concat(types));
      }

      var deSerializer = new DeSerializerVisitor(this.typeMeta, types, objects);
      var value = deSerializer.deSerialize(data, null, options);
      deSerializer.assertEnd();
      return value;
    }
  }]);

  return ObjectSerializer;
}(); // endregion
// region Primitive Serializers
// Handled in SerializerVisitor:
// undefined
// null
// number
// string
// boolean
// region Helpers

ObjectSerializer["default"] = new ObjectSerializer();
export function serializeArray(serialize, value, length) {
  if (length == null) {
    length = value.length;
  }

  var serializedValue = [];

  for (var i = 0; i < length; i++) {
    serializedValue[i] = serialize(value[i]);
  }

  return serializedValue;
}
export function deSerializeArray(deSerialize, serializedValue, value) {
  var _loop = function _loop(i, _len2) {
    var index = i;

    if (ThenableSync.isThenable(deSerialize(serializedValue[index], function (o) {
      value[index] = o;
    }))) {
      value[index] = null;
    }
  };

  for (var i = 0, _len2 = serializedValue.length; i < _len2; i++) {
    _loop(i, _len2);
  }

  return value;
}
export function serializeIterable(serialize, value) {
  var serializedValue = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _item = _step.value;
      serializedValue.push(serialize(_item));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return serializedValue;
}
export function deSerializeIterableOrdered(serializedValue, add) {
  var i, _len3;

  return _regeneratorRuntime.wrap(function deSerializeIterableOrdered$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          i = 0, _len3 = serializedValue.length;

        case 1:
          if (!(i < _len3)) {
            _context2.next = 7;
            break;
          }

          _context2.next = 4;
          return add(serializedValue[i]);

        case 4:
          i++;
          _context2.next = 1;
          break;

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked);
}
export function deSerializeIterable(serializedValue, add) {
  for (var i = 0, _len4 = serializedValue.length; i < _len4; i++) {
    add(serializedValue[i]);
  }
} // endregion
// region Object

export function serializeObject(serialize, value, options) {
  var keepUndefined = options && options.objectKeepUndefined;
  var serializedValue = {};

  for (var key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      var _item2 = value[key];

      if (keepUndefined || typeof _item2 !== 'undefined') {
        serializedValue[key] = serialize(_item2);
      }
    }
  }

  return serializedValue;
}
export function deSerializeObject(deSerialize, serializedValue, value) {
  var _loop2 = function _loop2(key) {
    if (Object.prototype.hasOwnProperty.call(serializedValue, key)) {
      // tslint:disable-next-line:no-collapsible-if
      if (ThenableSync.isThenable(deSerialize(serializedValue[key], function (o) {
        value[key] = o;
      }))) {
        value[key] = null;
      }
    }
  };

  for (var key in serializedValue) {
    _loop2(key);
  }

  return value;
}
registerSerializer(Object, {
  uuid: '88968a59178c4e73a99f801e8cdfc37d',
  serializer: {
    serialize: function serialize(_serialize2, value, options) {
      return serializeObject(_serialize2, value, options);
    },
    deSerialize: function deSerialize(_deSerialize2, serializedValue, valueFactory) {
      var value = valueFactory();
      return deSerializeObject(_deSerialize2, serializedValue, value);
    }
  },
  valueFactory: function valueFactory() {
    return {};
  }
}); // endregion
// region Primitive as object

export function serializePrimitiveAsObject(serialize, object) {
  var value = object.valueOf();

  if (value === object) {
    throw new Error("value is not primitive as object: ".concat(value && value.constructor.name));
  }

  return value; // return {
  // 	value: serialize(value),
  // 	object: serializeObject(serialize, object, options) as any,
  // }
}
export function deSerializePrimitiveAsObject(deSerialize, serializedValue, valueFactory) {
  var object = valueFactory(serializedValue); // deSerializeObject(deSerialize, serializedValue.object as any, object)

  return object;
}
var primitiveAsObjectSerializer = {
  serialize: serializePrimitiveAsObject,
  deSerialize: deSerializePrimitiveAsObject // @ts-ignore

};
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
    serialize: function serialize(_serialize3, value, options) {
      if (options && options.arrayAsObject) {
        return serializeObject(_serialize3, value, options);
      }

      return serializeArray(_serialize3, value, options && options.arrayLength);
    },
    deSerialize: function deSerialize(_deSerialize3, serializedValue, valueFactory, options) {
      var value = valueFactory();

      if (options && options.arrayAsObject) {
        return deSerializeObject(_deSerialize3, serializedValue, value);
      }

      return deSerializeArray(_deSerialize3, serializedValue, value);
    }
  },
  valueFactory: function valueFactory() {
    return [];
  }
}); // endregion
// region Set

registerSerializer(Set, {
  uuid: '17b11d99ce034349969e4f9291d0778c',
  serializer: {
    serialize: function serialize(_serialize4, value) {
      return serializeIterable(_serialize4, value);
    },
    deSerialize: function deSerialize(_deSerialize4, serializedValue, valueFactory) {
      return (
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee2() {
          var value;
          return _regeneratorRuntime.wrap(function _callee2$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  value = valueFactory();
                  _context3.next = 3;
                  return deSerializeIterableOrdered(serializedValue, function (o) {
                    return _deSerialize4(o, function (val) {
                      value.add(val);
                    });
                  });

                case 3:
                  return _context3.abrupt("return", value);

                case 4:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee2);
        })()
      );
    }
  } // valueFactory: () => new Set(),

}); // endregion
// region Map

registerSerializer(Map, {
  uuid: 'fdf40f2159b74cb2804f3d18ebb19b57',
  serializer: {
    serialize: function serialize(_serialize5, value) {
      return serializeIterable(function (item) {
        return [_serialize5(item[0]), _serialize5(item[1])];
      }, value);
    },
    deSerialize: function deSerialize(_deSerialize5, serializedValue, valueFactory) {
      return (
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee3() {
          var value;
          return _regeneratorRuntime.wrap(function _callee3$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  value = valueFactory();
                  _context4.next = 3;
                  return deSerializeIterableOrdered(serializedValue, function (item) {
                    return _deSerialize5(item[0], function (key) {
                      return _deSerialize5(item[1], function (val) {
                        value.set(key, val);
                      });
                    });
                  });

                case 3:
                  return _context4.abrupt("return", value);

                case 4:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee3);
        })()
      );
    }
  } // valueFactory: () => new Map(),

}); // endregion
// region Date

registerSerializer(Date, {
  uuid: '7a6c01dba6b84822a9a586e4d3a4460b',
  serializer: {
    serialize: function serialize(_serialize6, value) {
      return value.getTime();
    },
    deSerialize: function deSerialize(_deSerialize6, serializedValue, valueFactory) {
      return valueFactory(serializedValue);
    }
  } // valueFactory: (value: number|string|Date) => new Date(value),

}); // endregion
// endregion