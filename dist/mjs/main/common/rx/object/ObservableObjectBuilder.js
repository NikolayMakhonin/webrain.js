import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import '../extensions/autoConnect';
import { ObservableObject } from './ObservableObject';
export var ObservableObjectBuilder =
/*#__PURE__*/
function () {
  function ObservableObjectBuilder(object) {
    _classCallCheck(this, ObservableObjectBuilder);

    this.object = object || new ObservableObject();
  }

  _createClass(ObservableObjectBuilder, [{
    key: "writable",
    value: function writable(name, options, initValue) {
      if (!options) {
        options = {};
      }

      var object = this.object;
      var __fields = object.__fields;

      if (__fields) {
        __fields[name] = object[name];
      } else if (typeof initValue !== 'undefined') {
        throw new Error("You can't set initValue for prototype writable property");
      }

      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: true,
        get: function get() {
          return this.__fields[name];
        },
        set: function set(newValue) {
          this._set(name, newValue, options);
        }
      });

      if (__fields && typeof initValue !== 'undefined') {
        var value = __fields[name];

        if (initValue === value) {
          object._propagatePropertyChanged(name, value);
        } else {
          object[name] = initValue;
        }
      }

      return this;
    }
    /**
     * @param options - reserved
     */

  }, {
    key: "readable",
    value: function readable(name, options, value) {
      var object = this.object;
      var __fields = object.__fields;

      if (__fields) {
        __fields[name] = object[name];
      }

      var factory = options && options.factory;

      if (factory) {
        if (typeof value !== 'undefined') {
          throw new Error("You can't use both: factory and value");
        }
      } else if (!__fields && typeof value !== 'undefined') {
        factory = function factory() {
          return value;
        };
      }

      var createInstanceProperty = function createInstanceProperty(instance) {
        Object.defineProperty(instance, name, {
          configurable: true,
          enumerable: true,
          get: function get() {
            return this.__fields[name];
          }
        });
      };

      if (factory) {
        Object.defineProperty(object, name, {
          configurable: true,
          enumerable: true,
          get: function get() {
            var val = factory.call(this);
            this.__fields[name] = val;
            createInstanceProperty(this);
            return val;
          }
        });

        if (__fields) {
          var oldValue = __fields[name];
          var event = {
            name: name,
            oldValue: oldValue
          };
          Object.defineProperty(event, 'newValue', {
            configurable: true,
            enumerable: true,
            get: function get() {
              return object[name];
            }
          });
          object.onPropertyChanged(event);
        }
      } else {
        createInstanceProperty(object);

        if (__fields && typeof value !== 'undefined') {
          var _oldValue = __fields[name];

          object._propagatePropertyChanged(name, value);

          if (value !== _oldValue) {
            __fields[name] = value;
            object.onPropertyChanged({
              name: name,
              oldValue: _oldValue,
              newValue: value
            });
          }
        }
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(name) {
      var object = this.object;
      var oldValue = object[name];

      object._setUnsubscriber(name, null);

      delete object[name];
      var __fields = object.__fields;

      if (__fields) {
        delete __fields[name];

        if (typeof oldValue !== 'undefined') {
          object.onPropertyChanged({
            name: name,
            oldValue: oldValue
          });
        }
      }

      return this;
    }
  }]);

  return ObservableObjectBuilder;
}();