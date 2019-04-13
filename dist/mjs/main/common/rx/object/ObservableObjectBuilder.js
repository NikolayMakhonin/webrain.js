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

      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: true,
        get: function get() {
          return this.__fields[name];
        }
      });

      if (__fields && typeof value !== 'undefined') {
        var oldValue = __fields[name];

        object._propagatePropertyChanged(name, value);

        if (value !== oldValue) {
          __fields[name] = value;
          object.onPropertyChanged({
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