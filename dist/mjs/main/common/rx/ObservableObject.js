import _createClass from "@babel/runtime/helpers/createClass";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import './extensions/autoConnect';
import { HasSubscribersSubject } from './subjects/hasSubscribers';
export var ObservableObject = function ObservableObject() {
  _classCallCheck(this, ObservableObject);

  Object.defineProperty(this, '__meta', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: {
      unsubscribers: {},
      propertyChanged: new HasSubscribersSubject()
    }
  });
};
Object.defineProperty(ObservableObject.prototype, 'propertyChanged', {
  configurable: true,
  enumerable: false,
  get: function get() {
    return this.__meta.propertyChanged;
  }
});
export var ObservableObjectBuilder =
/*#__PURE__*/
function () {
  function ObservableObjectBuilder(object) {
    _classCallCheck(this, ObservableObjectBuilder);

    this.object = object || new ObservableObject();
  }

  _createClass(ObservableObjectBuilder, [{
    key: "propagatePropertyChanged",
    value: function propagatePropertyChanged(propertyName, value) {
      if (!value) {
        return null;
      }

      var propertyChanged = value.propertyChanged;

      if (!propertyChanged) {
        return null;
      }

      var object = this.object;

      var subscriber = function subscriber(event) {
        object.propertyChanged.emit({
          name: propertyName,
          next: event
        });
      };

      return object.propertyChanged.hasSubscribersObservable.autoConnect(null, function () {
        return propertyChanged.subscribe(subscriber);
      });
    }
  }, {
    key: "writable",
    value: function writable(name, {value: initValue}) {
      var _this = this;

      var object = this.object;
      var _object$__meta = object.__meta,
          unsubscribers = _object$__meta.unsubscribers,
          propertyChanged = _object$__meta.propertyChanged;
      var unsubscribe = unsubscribers[name];
      var value = object[name];
      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: true,
        get: function get() {
          return value;
        },
        set: function set(newValue) {
          if (newValue === value) {
            return;
          }

          if (unsubscribe) {
            unsubscribe();
          }

          var oldValue = value;
          value = newValue;
          unsubscribers[name] = unsubscribe = _this.propagatePropertyChanged(name, value);
          propertyChanged.emit({
            name: name,
            oldValue: oldValue,
            newValue: value
          });
        }
      });

      if (typeof initValue !== 'undefined') {
        if (initValue === value) {
          if (unsubscribe) {
            unsubscribe();
          }

          unsubscribers[name] = unsubscribe = this.propagatePropertyChanged(name, value);
        } else {
          object[name] = initValue;
        }
      }

      return this;
    }
  }, {
    key: "readable",
    value: function readable(name, {value: value}) {
      var object = this.object;
      var _object$__meta2 = object.__meta,
          unsubscribers = _object$__meta2.unsubscribers,
          propertyChanged = _object$__meta2.propertyChanged;
      var unsubscribe = unsubscribers[name];
      var oldValue = object[name];
      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: true,
        get: function get() {
          return value;
        }
      });

      if (typeof value === 'undefined') {
        value = oldValue;
      } else {
        if (unsubscribe) {
          unsubscribe();
        }

        unsubscribers[name] = this.propagatePropertyChanged(name, value);

        if (value !== oldValue) {
          propertyChanged.emit({
            name: name,
            oldValue: oldValue,
            newValue: value
          });
        }
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(name) {
      var object = this.object;
      var _object$__meta3 = object.__meta,
          unsubscribers = _object$__meta3.unsubscribers,
          propertyChanged = _object$__meta3.propertyChanged;
      var unsubscribe = unsubscribers[name];
      var oldValue = object[name];

      if (unsubscribe) {
        unsubscribe();
      }

      delete object[name];
      delete unsubscribers[name];

      if (typeof oldValue !== 'undefined') {
        propertyChanged.emit({
          name: name,
          oldValue: oldValue
        });
      }

      return this;
    }
  }]);

  return ObservableObjectBuilder;
}();