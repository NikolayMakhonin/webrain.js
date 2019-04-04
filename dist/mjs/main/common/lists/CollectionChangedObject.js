import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { PropertyChangedObject } from '../rx/object/PropertyChangedObject';
import { HasSubscribersSubject } from '../rx/subjects/hasSubscribers';
export var CollectionChangedObject =
/*#__PURE__*/
function (_PropertyChangedObjec) {
  _inherits(CollectionChangedObject, _PropertyChangedObjec);

  function CollectionChangedObject() {
    _classCallCheck(this, CollectionChangedObject);

    return _possibleConstructorReturn(this, _getPrototypeOf(CollectionChangedObject).apply(this, arguments));
  }

  _createClass(CollectionChangedObject, [{
    key: "onCollectionChanged",
    value: function onCollectionChanged(event) {
      var _collectionChanged = this._collectionChanged;

      if (!_collectionChanged || !_collectionChanged.hasSubscribers) {
        return this;
      }

      _collectionChanged.emit(event);

      return this;
    }
  }, {
    key: "collectionChanged",
    get: function get() {
      var _collectionChanged = this._collectionChanged;

      if (!_collectionChanged) {
        this._collectionChanged = _collectionChanged = new HasSubscribersSubject();
      }

      return _collectionChanged;
    }
  }, {
    key: "_collectionChangedIfCanEmit",
    get: function get() {
      var _propertyChangedDisabled = this._propertyChangedDisabled,
          _collectionChanged = this._collectionChanged;
      return !_propertyChangedDisabled && _collectionChanged && _collectionChanged.hasSubscribers ? _collectionChanged : null;
    }
  }]);

  return CollectionChangedObject;
}(PropertyChangedObject);