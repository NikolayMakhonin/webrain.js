"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.TypeMetaCollectionWithId = exports.TypeMetaCollection = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _helpers = require("../helpers/helpers");

var typeMetaPropertyNameBase = '043a558080e94cbda1add09753c28772';
var typeMetaPropertyNameIndex = 0;

var TypeMetaCollection =
/*#__PURE__*/
function () {
  // noinspection JSUnusedLocalSymbols
  function TypeMetaCollection(proto) {
    this._typeMetaPropertyName = typeMetaPropertyNameBase + typeMetaPropertyNameIndex++;

    if (proto) {
      this._proto = proto;
    }
  }

  var _proto2 = TypeMetaCollection.prototype;

  _proto2.getMeta = function getMeta(type) {
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
  };

  _proto2.putType = function putType(type, meta) {
    if (!type || typeof type !== 'function') {
      throw new Error("type (" + type + ") should be function");
    }

    var _typeMetaPropertyName = this._typeMetaPropertyName;
    var prevMeta;

    if (Object.prototype.hasOwnProperty.call(type, _typeMetaPropertyName)) {
      prevMeta = type[_typeMetaPropertyName];
      delete type[_typeMetaPropertyName];
    }

    (0, _defineProperty.default)(type, _typeMetaPropertyName, {
      configurable: true,
      enumerable: false,
      writable: false,
      value: meta
    });
    return prevMeta;
  };

  _proto2.deleteType = function deleteType(type) {
    var _typeMetaPropertyName = this._typeMetaPropertyName;
    var prevMeta;

    if (Object.prototype.hasOwnProperty.call(type, _typeMetaPropertyName)) {
      prevMeta = type[_typeMetaPropertyName];
      delete type[_typeMetaPropertyName];
    }

    return prevMeta;
  };

  return TypeMetaCollection;
}();

exports.TypeMetaCollection = TypeMetaCollection;

var TypeMetaCollectionWithId =
/*#__PURE__*/
function (_TypeMetaCollection) {
  (0, _inheritsLoose2.default)(TypeMetaCollectionWithId, _TypeMetaCollection);

  function TypeMetaCollectionWithId(proto) {
    var _this;

    _this = _TypeMetaCollection.call(this, proto) || this;
    _this._typeMap = {};
    return _this;
  }

  var _proto3 = TypeMetaCollectionWithId.prototype;

  _proto3.getType = function getType(uuid) {
    var type = this._typeMap[uuid];

    if (typeof type === 'undefined') {
      var _proto = this._proto;

      if (_proto) {
        return _proto.getType(uuid);
      }
    }

    return type;
  };

  _proto3.putType = function putType(type, meta) {
    var uuid = meta && meta.uuid;

    if (!uuid || typeof uuid !== 'string') {
      throw new Error("meta.uuid (" + uuid + ") should be a string with length > 0");
    }

    var prevType = this._typeMap[uuid];

    if (prevType && prevType !== type) {
      throw new Error("Same uuid (" + uuid + ") used for different types: " + ((0, _helpers.typeToDebugString)(prevType) + ", " + (0, _helpers.typeToDebugString)(type)));
    }

    var prevMeta = _TypeMetaCollection.prototype.putType.call(this, type, meta);

    this._typeMap[uuid] = type;
    return prevMeta;
  };

  _proto3.deleteType = function deleteType(typeOrUuid) {
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
      throw new Error("typeOrUuid (" + (typeOrUuid == null ? typeOrUuid : typeof typeOrUuid) + ") is not a Function or String");
    }

    var prevMeta = _TypeMetaCollection.prototype.deleteType.call(this, type);

    delete this._typeMap[uuid];
    return prevMeta;
  };

  return TypeMetaCollectionWithId;
}(TypeMetaCollection);

exports.TypeMetaCollectionWithId = TypeMetaCollectionWithId;