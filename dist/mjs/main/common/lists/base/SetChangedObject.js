import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { PropertyChangedObject } from '../../rx/object/PropertyChangedObject';
import { HasSubscribersSubject } from '../../rx/subjects/hasSubscribers';
export var SetChangedObject =
/*#__PURE__*/
function (_PropertyChangedObjec) {
  _inherits(SetChangedObject, _PropertyChangedObjec);

  function SetChangedObject() {
    _classCallCheck(this, SetChangedObject);

    return _possibleConstructorReturn(this, _getPrototypeOf(SetChangedObject).apply(this, arguments));
  }

  _createClass(SetChangedObject, [{
    key: "onSetChanged",
    value: function onSetChanged(event) {
      var propertyChangedDisabled = this.__meta.propertyChangedDisabled;
      var _setChanged = this._setChanged;

      if (propertyChangedDisabled || !_setChanged || !_setChanged.hasSubscribers) {
        return this;
      }

      _setChanged.emit(event);

      return this;
    }
  }, {
    key: "setChanged",
    get: function get() {
      var _setChanged = this._setChanged;

      if (!_setChanged) {
        this._setChanged = _setChanged = new HasSubscribersSubject();
      }

      return _setChanged;
    }
  }, {
    key: "_setChangedIfCanEmit",
    get: function get() {
      var propertyChangedDisabled = this.__meta.propertyChangedDisabled;
      var _setChanged = this._setChanged;
      return !propertyChangedDisabled && _setChanged && _setChanged.hasSubscribers ? _setChanged : null;
    }
  }]);

  return SetChangedObject;
}(PropertyChangedObject);