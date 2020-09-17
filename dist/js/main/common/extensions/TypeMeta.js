"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.TypeMetaCollectionWithId = exports.TypeMetaCollection = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _helpers = require("../helpers/helpers");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

// noinspection SpellCheckingInspection
var typeMetaPropertyNameBase = '043a558080e94cbda1add09753c28772';
var typeMetaPropertyNameIndex = 0;

var TypeMetaCollection = /*#__PURE__*/function () {
  // noinspection JSUnusedLocalSymbols
  function TypeMetaCollection(proto) {
    (0, _classCallCheck2.default)(this, TypeMetaCollection);
    this._typeMetaPropertyName = typeMetaPropertyNameBase + typeMetaPropertyNameIndex++;

    if (proto) {
      this._proto = proto;
    }
  }

  (0, _createClass2.default)(TypeMetaCollection, [{
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

exports.TypeMetaCollection = TypeMetaCollection;

var TypeMetaCollectionWithId = /*#__PURE__*/function (_TypeMetaCollection) {
  (0, _inherits2.default)(TypeMetaCollectionWithId, _TypeMetaCollection);

  var _super = _createSuper(TypeMetaCollectionWithId);

  function TypeMetaCollectionWithId(proto) {
    var _this;

    (0, _classCallCheck2.default)(this, TypeMetaCollectionWithId);
    _this = _super.call(this, proto);
    _this._typeMap = {};
    return _this;
  }

  (0, _createClass2.default)(TypeMetaCollectionWithId, [{
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
        throw new Error("meta.uuid (" + uuid + ") should be a string with length > 0");
      }

      var prevType = this._typeMap[uuid];

      if (prevType && prevType !== type) {
        throw new Error("Same uuid (" + uuid + ") used for different types: " + ((0, _helpers.typeToDebugString)(prevType) + ", " + (0, _helpers.typeToDebugString)(type)));
      }

      var prevMeta = (0, _get2.default)((0, _getPrototypeOf2.default)(TypeMetaCollectionWithId.prototype), "putType", this).call(this, type, meta);
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
        throw new Error("typeOrUuid (" + (typeOrUuid == null ? typeOrUuid : typeof typeOrUuid) + ") is not a Function or String");
      }

      var prevMeta = (0, _get2.default)((0, _getPrototypeOf2.default)(TypeMetaCollectionWithId.prototype), "deleteType", this).call(this, type);
      delete this._typeMap[uuid];
      return prevMeta;
    }
  }]);
  return TypeMetaCollectionWithId;
}(TypeMetaCollection);

exports.TypeMetaCollectionWithId = TypeMetaCollectionWithId;