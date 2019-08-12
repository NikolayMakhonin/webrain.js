import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { PropertyChangedObject } from '../../rx/object/PropertyChangedObject';
import { HasSubscribersSubject } from '../../rx/subjects/hasSubscribers';
export var MapChangedObject =
/*#__PURE__*/
function (_PropertyChangedObjec) {
  _inherits(MapChangedObject, _PropertyChangedObjec);

  function MapChangedObject() {
    _classCallCheck(this, MapChangedObject);

    return _possibleConstructorReturn(this, _getPrototypeOf(MapChangedObject).apply(this, arguments));
  }

  _createClass(MapChangedObject, [{
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
        this._mapChanged = _mapChanged = new HasSubscribersSubject();
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
}(PropertyChangedObject);