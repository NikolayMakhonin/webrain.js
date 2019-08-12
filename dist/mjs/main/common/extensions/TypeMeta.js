import _typeof from "@babel/runtime/helpers/typeof";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _get from "@babel/runtime/helpers/get";
import _inherits from "@babel/runtime/helpers/inherits";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { typeToDebugString } from '../helpers/helpers';
var typeMetaPropertyNameBase = Math.random().toString(36);
var typeMetaPropertyNameIndex = 0;
export var TypeMetaCollection =
/*#__PURE__*/
function () {
  function TypeMetaCollection(proto) {
    _classCallCheck(this, TypeMetaCollection);

    this._typeMetaPropertyName = typeMetaPropertyNameBase + typeMetaPropertyNameIndex++;

    if (proto) {
      this._proto = proto;
    }
  }

  _createClass(TypeMetaCollection, [{
    key: "getMeta",
    value: function getMeta(type) {
      var meta;
      var _typeMetaPropertyName = this._typeMetaPropertyName;

      if (Object.prototype.hasOwnProperty.call(type, _typeMetaPropertyName)) {
        meta = type[_typeMetaPropertyName];
      }

      if (typeof meta === 'undefined') {
        var _proto = this._proto;

        if (_proto) {
          return _proto.getMeta(type);
        }
      }

      return meta;
    }
  }, {
    key: "putType",
    value: function putType(type, meta) {
      if (!type || typeof type !== 'function') {
        throw new Error("type (".concat(type, ") should be function"));
      }

      var _typeMetaPropertyName = this._typeMetaPropertyName;
      var prevMeta;

      if (Object.prototype.hasOwnProperty.call(type, _typeMetaPropertyName)) {
        prevMeta = type[_typeMetaPropertyName];
        delete type[_typeMetaPropertyName];
      }

      Object.defineProperty(type, _typeMetaPropertyName, {
        configurable: true,
        enumerable: false,
        writable: false,
        value: meta
      });
      return prevMeta;
    }
  }, {
    key: "deleteType",
    value: function deleteType(type) {
      var _typeMetaPropertyName = this._typeMetaPropertyName;
      var prevMeta;

      if (Object.prototype.hasOwnProperty.call(type, _typeMetaPropertyName)) {
        prevMeta = type[_typeMetaPropertyName];
        delete type[_typeMetaPropertyName];
      }

      return prevMeta;
    }
  }]);

  return TypeMetaCollection;
}();
export var TypeMetaCollectionWithId =
/*#__PURE__*/
function (_TypeMetaCollection) {
  _inherits(TypeMetaCollectionWithId, _TypeMetaCollection);

  function TypeMetaCollectionWithId(proto) {
    var _this;

    _classCallCheck(this, TypeMetaCollectionWithId);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TypeMetaCollectionWithId).call(this, proto));
    _this._typeMap = {};
    return _this;
  }

  _createClass(TypeMetaCollectionWithId, [{
    key: "getType",
    value: function getType(uuid) {
      var type = this._typeMap[uuid];

      if (typeof type === 'undefined') {
        var _proto = this._proto;

        if (_proto) {
          return _proto.getType(uuid);
        }
      }

      return type;
    }
  }, {
    key: "putType",
    value: function putType(type, meta) {
      var uuid = meta && meta.uuid;

      if (!uuid || typeof uuid !== 'string') {
        throw new Error("meta.uuid (".concat(uuid, ") should be a string with length > 0"));
      }

      var prevType = this._typeMap[uuid];

      if (prevType && prevType !== type) {
        throw new Error("Same uuid (".concat(uuid, ") used for different types: ") + "".concat(typeToDebugString(prevType), ", ").concat(typeToDebugString(type)));
      }

      var prevMeta = _get(_getPrototypeOf(TypeMetaCollectionWithId.prototype), "putType", this).call(this, type, meta);

      this._typeMap[uuid] = type;
      return prevMeta;
    }
  }, {
    key: "deleteType",
    value: function deleteType(typeOrUuid) {
      var uuid;
      var type;

      if (typeof typeOrUuid === 'function') {
        var _meta = this.getMeta(typeOrUuid);

        uuid = _meta && _meta.uuid;
        type = typeOrUuid;
      } else if (typeof typeOrUuid === 'string') {
        type = this.getType(typeOrUuid);
        uuid = typeOrUuid;
      } else {
        throw new Error("typeOrUuid (".concat(typeOrUuid === null ? 'null' : _typeof(typeOrUuid), ") is not a Function or String"));
      }

      var prevMeta = _get(_getPrototypeOf(TypeMetaCollectionWithId.prototype), "deleteType", this).call(this, type);

      delete this._typeMap[uuid];
      return prevMeta;
    }
  }]);

  return TypeMetaCollectionWithId;
}(TypeMetaCollection);