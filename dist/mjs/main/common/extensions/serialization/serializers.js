import _typeof from "@babel/runtime/helpers/typeof";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _construct from "@babel/runtime/helpers/construct";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";

var _marked =
/*#__PURE__*/
_regeneratorRuntime.mark(deSerializeIterableOrdered);

import { typeToDebugString } from '../../helpers/helpers';
import { ThenableSync } from '../../helpers/ThenableSync';
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

      if (typeof value === 'undefined') {
        return value;
      }

      if (value === null || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
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

        var type = _typeMeta.getType(uuid);

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
          return !o[0] || o[0] === LOCKED || ThenableSync.isThenableSync(o[0]);
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

      if (id != null && !factory && ThenableSync.isThenableSync(valueOrThenFunc)) {
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

    return _possibleConstructorReturn(this, _getPrototypeOf(TypeMetaSerializerCollection).call(this, proto || TypeMetaSerializerCollection.default));
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
          deSerialize:
          /*#__PURE__*/
          _regeneratorRuntime.mark(function deSerialize(_deSerialize, serializedValue, valueFactory, options) {
            var value;
            return _regeneratorRuntime.wrap(function deSerialize$(_context) {
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
            }, deSerialize);
          })
        }, meta ? meta.serializer : {})
      });
    }
  }]);

  return TypeMetaSerializerCollection;
}(TypeMetaCollectionWithId);
TypeMetaSerializerCollection.default = new TypeMetaSerializerCollection();
export function registerSerializable(type, meta) {
  TypeMetaSerializerCollection.default.putSerializableType(type, meta);
}
export function registerSerializer(type, meta) {
  TypeMetaSerializerCollection.default.putType(type, meta);
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

ObjectSerializer.default = new ObjectSerializer();
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

    if (ThenableSync.isThenableSync(deSerialize(serializedValue[index], function (o) {
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
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
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
      if (ThenableSync.isThenableSync(deSerialize(serializedValue[key], function (o) {
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
  uuid: '88968a59-178c-4e73-a99f-801e8cdfc37d',
  serializer: {
    serialize: function serialize(_serialize2, value, options) {
      return serializeObject(_serialize2, value, options);
    },
    deSerialize: function (_deSerialize2) {
      function deSerialize(_x, _x2, _x3) {
        return _deSerialize2.apply(this, arguments);
      }

      deSerialize.toString = function () {
        return _deSerialize2.toString();
      };

      return deSerialize;
    }(function (deSerialize, serializedValue, valueFactory) {
      var value = valueFactory();
      return deSerializeObject(deSerialize, serializedValue, value);
    })
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
    serialize: function serialize(_serialize3, value, options) {
      if (options && options.arrayAsObject) {
        return serializeObject(_serialize3, value, options);
      }

      return serializeArray(_serialize3, value, options && options.arrayLength);
    },
    deSerialize: function (_deSerialize3) {
      function deSerialize(_x4, _x5, _x6, _x7) {
        return _deSerialize3.apply(this, arguments);
      }

      deSerialize.toString = function () {
        return _deSerialize3.toString();
      };

      return deSerialize;
    }(function (deSerialize, serializedValue, valueFactory, options) {
      var value = valueFactory();

      if (options && options.arrayAsObject) {
        return deSerializeObject(deSerialize, serializedValue, value);
      }

      return deSerializeArray(deSerialize, serializedValue, value);
    })
  },
  valueFactory: function valueFactory() {
    return [];
  }
}); // endregion
// region Set

registerSerializer(Set, {
  uuid: '17b11d99-ce03-4349-969e-4f9291d0778c',
  serializer: {
    serialize: function serialize(_serialize4, value) {
      return serializeIterable(_serialize4, value);
    },
    deSerialize: function (_deSerialize4) {
      var _marked2 =
      /*#__PURE__*/
      _regeneratorRuntime.mark(deSerialize);

      function deSerialize(_x8, _x9, _x10) {
        var _args3 = arguments;
        return _regeneratorRuntime.wrap(function deSerialize$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.delegateYield(_deSerialize4.apply(this, _args3), "t0", 1);

              case 1:
                return _context3.abrupt("return", _context3.t0);

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _marked2, this);
      }

      deSerialize.toString = function () {
        return _deSerialize4.toString();
      };

      return deSerialize;
    }(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee(deSerialize, serializedValue, valueFactory) {
      var value;
      return _regeneratorRuntime.wrap(function _callee$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              value = valueFactory();
              _context4.next = 3;
              return deSerializeIterableOrdered(serializedValue, function (o) {
                return deSerialize(o, function (val) {
                  value.add(val);
                });
              });

            case 3:
              return _context4.abrupt("return", value);

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee);
    }))
  } // valueFactory: () => new Set(),

}); // endregion
// region Map

registerSerializer(Map, {
  uuid: 'fdf40f21-59b7-4cb2-804f-3d18ebb19b57',
  serializer: {
    serialize: function serialize(_serialize5, value) {
      return serializeIterable(function (item) {
        return [_serialize5(item[0]), _serialize5(item[1])];
      }, value);
    },
    deSerialize: function (_deSerialize5) {
      var _marked3 =
      /*#__PURE__*/
      _regeneratorRuntime.mark(deSerialize);

      function deSerialize(_x11, _x12, _x13) {
        var _args5 = arguments;
        return _regeneratorRuntime.wrap(function deSerialize$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.delegateYield(_deSerialize5.apply(this, _args5), "t0", 1);

              case 1:
                return _context5.abrupt("return", _context5.t0);

              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _marked3, this);
      }

      deSerialize.toString = function () {
        return _deSerialize5.toString();
      };

      return deSerialize;
    }(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee2(deSerialize, serializedValue, valueFactory) {
      var value;
      return _regeneratorRuntime.wrap(function _callee2$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              value = valueFactory();
              _context6.next = 3;
              return deSerializeIterableOrdered(serializedValue, function (item) {
                return deSerialize(item[0], function (key) {
                  return deSerialize(item[1], function (val) {
                    value.set(key, val);
                  });
                });
              });

            case 3:
              return _context6.abrupt("return", value);

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee2);
    }))
  } // valueFactory: () => new Map(),

}); // endregion
// region Date

registerSerializer(Date, {
  uuid: '7a6c01db-a6b8-4822-a9a5-86e4d3a4460b',
  serializer: {
    serialize: function serialize(_serialize6, value) {
      return value.getTime();
    },
    deSerialize: function (_deSerialize6) {
      function deSerialize(_x14, _x15, _x16) {
        return _deSerialize6.apply(this, arguments);
      }

      deSerialize.toString = function () {
        return _deSerialize6.toString();
      };

      return deSerialize;
    }(function (deSerialize, serializedValue, valueFactory) {
      return valueFactory(serializedValue);
    })
  } // valueFactory: (value: number|string|Date) => new Date(value),

}); // endregion
// endregion