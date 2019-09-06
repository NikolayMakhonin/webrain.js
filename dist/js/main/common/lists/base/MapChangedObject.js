"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.MapChangedObject = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _PropertyChangedObject = require("../../rx/object/PropertyChangedObject");

var _hasSubscribers = require("../../rx/subjects/hasSubscribers");

var MapChangedObject =
/*#__PURE__*/
function (_PropertyChangedObjec) {
  (0, _inherits2.default)(MapChangedObject, _PropertyChangedObjec);

  function MapChangedObject() {
    (0, _classCallCheck2.default)(this, MapChangedObject);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(MapChangedObject).apply(this, arguments));
  }

  (0, _createClass2.default)(MapChangedObject, [{
    key: "onMapChanged",
    value: function onMapChanged(event) {
      var _mapChanged = this._mapChanged;

      if (!_mapChanged || !_mapChanged.hasSubscribers) {
        return this;
      }

      _mapChanged.emit(event);

      return this;
    }
  }, {
    key: "mapChanged",
    get: function get() {
      var _mapChanged = this._mapChanged;

      if (!_mapChanged) {
        this._mapChanged = _mapChanged = new _hasSubscribers.HasSubscribersSubject();
      }

      return _mapChanged;
    }
  }, {
    key: "_mapChangedIfCanEmit",
    get: function get() {
      var __meta = this.__meta;
      var propertyChangedDisabled = __meta ? __meta.propertyChangedDisabled : null;
      var _mapChanged = this._mapChanged;
      return !propertyChangedDisabled && _mapChanged && _mapChanged.hasSubscribers ? _mapChanged : null;
    }
  }]);
  return MapChangedObject;
}(_PropertyChangedObject.PropertyChangedObject);

exports.MapChangedObject = MapChangedObject;