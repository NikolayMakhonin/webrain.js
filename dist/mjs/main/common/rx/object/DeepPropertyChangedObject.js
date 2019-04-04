import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { HasSubscribersSubject } from '../subjects/hasSubscribers';
import { PropertyChangedObject } from './PropertyChangedObject';
export var DeepPropertyChangedObject =
/*#__PURE__*/
function (_PropertyChangedObjec) {
  _inherits(DeepPropertyChangedObject, _PropertyChangedObjec);

  function DeepPropertyChangedObject() {
    _classCallCheck(this, DeepPropertyChangedObject);

    return _possibleConstructorReturn(this, _getPrototypeOf(DeepPropertyChangedObject).apply(this, arguments));
  }

  _createClass(DeepPropertyChangedObject, [{
    key: "onPropertyChanged",
    value: function onPropertyChanged(eventsOrPropertyNames) {
      var _this$__meta = this.__meta,
          propertyChanged = _this$__meta.propertyChanged,
          deepPropertyChanged = _this$__meta.deepPropertyChanged;

      if (!propertyChanged && !deepPropertyChanged) {
        return this;
      }

      this._emitPropertyChanged(eventsOrPropertyNames, function (event) {
        if (propertyChanged) {
          propertyChanged.emit(event);
        }

        if (deepPropertyChanged) {
          deepPropertyChanged.emit(event);
        }
      });

      return this;
    }
  }, {
    key: "onDeepPropertyChanged",
    value: function onDeepPropertyChanged(eventsOrPropertyNames) {
      var deepPropertyChanged = this.__meta.deepPropertyChanged;

      if (!deepPropertyChanged) {
        return this;
      }

      this._emitPropertyChanged(eventsOrPropertyNames, function (event) {
        deepPropertyChanged.emit(event);
      });

      return this;
    }
    /** @internal */

  }, {
    key: "_setUnsubscriber",
    value: function _setUnsubscriber(propertyName, unsubscribe) {
      var __meta = this.__meta;
      var unsubscribers = __meta.unsubscribers;

      if (unsubscribers) {
        var oldUnsubscribe = unsubscribers[propertyName];

        if (oldUnsubscribe) {
          oldUnsubscribe();
        }
      }

      if (unsubscribe) {
        if (!unsubscribers) {
          __meta.unsubscribers = unsubscribers = {};
        }

        unsubscribers[propertyName] = unsubscribe;
      }
    }
    /** @internal */

  }, {
    key: "_propagatePropertyChanged",
    value: function _propagatePropertyChanged(propertyName, value) {
      var _this = this;

      this._setUnsubscriber(propertyName, null);

      if (!value) {
        return null;
      }

      var deepPropertyChanged = value.deepPropertyChanged || value.propertyChanged;

      if (!deepPropertyChanged) {
        return null;
      }

      var subscriber = function subscriber(event) {
        _this.deepPropertyChanged.emit({
          name: propertyName,
          next: event
        });
      };

      {
        var unsubscribe = this.deepPropertyChanged.hasSubscribersObservable.autoConnect(null, function () {
          return deepPropertyChanged.subscribe(subscriber);
        });

        this._setUnsubscriber(propertyName, unsubscribe);

        return unsubscribe;
      }
    } // endregion

  }, {
    key: "deepPropertyChanged",

    /** @internal */
    // region propertyChanged
    get: function get() {
      var deepPropertyChanged = this.__meta.deepPropertyChanged;

      if (!deepPropertyChanged) {
        this.__meta.deepPropertyChanged = deepPropertyChanged = new HasSubscribersSubject();
      }

      return deepPropertyChanged;
    }
  }]);

  return DeepPropertyChangedObject;
}(PropertyChangedObject);