"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.MapChangedObject = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _PropertyChangedObject = require("../../rx/object/PropertyChangedObject");

var _hasSubscribers = require("../../rx/subjects/hasSubscribers");

var MapChangedObject =
/*#__PURE__*/
function (_PropertyChangedObjec) {
  (0, _inheritsLoose2.default)(MapChangedObject, _PropertyChangedObjec);

  function MapChangedObject() {
    return _PropertyChangedObjec.apply(this, arguments) || this;
  }

  var _proto = MapChangedObject.prototype;

  _proto.onMapChanged = function onMapChanged(event) {
    var _mapChanged = this._mapChanged;

    if (!_mapChanged || !_mapChanged.hasSubscribers) {
      return this;
    }

    _mapChanged.emit(event);

    return this;
  };

  (0, _createClass2.default)(MapChangedObject, [{
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