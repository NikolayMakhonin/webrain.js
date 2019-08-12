import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { PropertyChangedObject } from '../../rx/object/PropertyChangedObject';
import { HasSubscribersSubject } from '../../rx/subjects/hasSubscribers';
export var ListChangedObject =
/*#__PURE__*/
function (_PropertyChangedObjec) {
  _inherits(ListChangedObject, _PropertyChangedObjec);

  function ListChangedObject() {
    _classCallCheck(this, ListChangedObject);

    return _possibleConstructorReturn(this, _getPrototypeOf(ListChangedObject).apply(this, arguments));
  }

  _createClass(ListChangedObject, [{
    key: "onListChanged",
    value: function onListChanged(event) {
      var _listChanged = this._listChanged;

      if (!_listChanged || !_listChanged.hasSubscribers) {
        return this;
      }

      _listChanged.emit(event);

      return this;
    }
  }, {
    key: "listChanged",
    get: function get() {
      var _listChanged = this._listChanged;

      if (!_listChanged) {
        this._listChanged = _listChanged = new HasSubscribersSubject();
      }

      return _listChanged;
    }
  }, {
    key: "_listChangedIfCanEmit",
    get: function get() {
      var propertyChangedDisabled = this.__meta.propertyChangedDisabled;
      var _listChanged = this._listChanged;
      return !propertyChangedDisabled && _listChanged && _listChanged.hasSubscribers ? _listChanged : null;
    }
  }]);

  return ListChangedObject;
}(PropertyChangedObject);