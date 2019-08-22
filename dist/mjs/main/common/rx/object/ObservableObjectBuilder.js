import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import { PropertyChangedEvent } from '../../lists/contracts/IPropertyChanged';
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

        if (initValue !== value) {
          object[name] = initValue;
        }
      }

      return this;
    }
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
            var factoryValue = factory.call(this);
            createInstanceProperty(this);
            var fields = this.__fields;

            if (fields && typeof factoryValue !== 'undefined') {
              var oldValue = fields[name];

              if (factoryValue !== oldValue) {
                this._set(name, factoryValue, _objectSpread({}, options && options.factorySetOptions, {
                  suppressPropertyChanged: true
                }));
              }
            }

            return factoryValue;
          }
        });

        if (__fields) {
          var oldValue = __fields[name];
          var propertyChangedIfCanEmit = object.propertyChangedIfCanEmit;

          if (propertyChangedIfCanEmit) {
            propertyChangedIfCanEmit.onPropertyChanged(new PropertyChangedEvent(name, oldValue, function () {
              return object[name];
            }));
          }
        }
      } else {
        createInstanceProperty(object);

        if (__fields && typeof value !== 'undefined') {
          var _oldValue = __fields[name];

          if (value !== _oldValue) {
            __fields[name] = value;
            var _propertyChangedIfCanEmit = object.propertyChangedIfCanEmit;

            if (_propertyChangedIfCanEmit) {
              _propertyChangedIfCanEmit.onPropertyChanged({
                name: name,
                oldValue: _oldValue,
                newValue: value
              });
            }
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
          var propertyChangedIfCanEmit = object.propertyChangedIfCanEmit;

          if (propertyChangedIfCanEmit) {
            propertyChangedIfCanEmit.onPropertyChanged({
              name: name,
              oldValue: oldValue
            });
          }
        }
      }

      return this;
    }
  }]);

  return ObservableObjectBuilder;
}();