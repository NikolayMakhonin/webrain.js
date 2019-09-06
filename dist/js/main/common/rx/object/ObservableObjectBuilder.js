"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ObservableObjectBuilder = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _helpers = require("../../helpers/helpers");

require("../extensions/autoConnect");

var _IPropertyChanged = require("./IPropertyChanged");

var _ObservableObject = require("./ObservableObject");

var ObservableObjectBuilder =
/*#__PURE__*/
function () {
  function ObservableObjectBuilder(object) {
    this.object = object || new _ObservableObject.ObservableObject();
  }

  var _proto = ObservableObjectBuilder.prototype;

  _proto.writable = function writable(name, options, initValue) {
    var _ref = options || {},
        setOptions = _ref.setOptions,
        hidden = _ref.hidden;

    var object = this.object;
    var __fields = object.__fields;

    if (__fields) {
      __fields[name] = object[name];
    } else if (typeof initValue !== 'undefined') {
      throw new Error("You can't set initValue for prototype writable property");
    } // optimization


    var getValue = (0, _helpers.createFunction)('o', "return o.__fields[\"" + name + "\"]");
    var setValue = (0, _helpers.createFunction)('o', 'v', "o.__fields[\"" + name + "\"] = v");

    var _set2 = setOptions ? (0, _bind.default)(_ObservableObject._setExt).call(_ObservableObject._setExt, null, name, getValue, setValue, setOptions) : (0, _bind.default)(_ObservableObject._set).call(_ObservableObject._set, null, name, getValue, setValue);

    (0, _defineProperty.default)(object, name, {
      configurable: true,
      enumerable: !hidden,
      get: function get() {
        return getValue(this);
      },
      set: function set(newValue) {
        _set2(this, newValue);
      }
    });

    if (__fields && typeof initValue !== 'undefined') {
      var value = __fields[name];

      if (initValue !== value) {
        object[name] = initValue;
      }
    }

    return this;
  };

  _proto.readable = function readable(name, options, initValue) {
    var hidden = options && options.hidden;
    var setOptions = (0, _extends2.default)({}, options && options.setOptions, {
      suppressPropertyChanged: true
    });
    var object = this.object;
    var __fields = object.__fields;

    if (__fields) {
      __fields[name] = object[name];
    }

    var factory = options && options.factory;

    if (!factory && !__fields && typeof initValue !== 'undefined') {
      factory = function factory(o) {
        return o;
      };
    } // optimization


    var getValue = (0, _helpers.createFunction)('o', "return o.__fields[\"" + name + "\"]");

    var createInstanceProperty = function createInstanceProperty(instance) {
      (0, _defineProperty.default)(instance, name, {
        configurable: true,
        enumerable: !hidden,
        get: function get() {
          return getValue(this);
        }
      });
    };

    if (factory) {
      // optimization
      var setValue = (0, _helpers.createFunction)('o', 'v', "o.__fields[\"" + name + "\"] = v");
      var set = setOptions ? (0, _bind.default)(_ObservableObject._setExt).call(_ObservableObject._setExt, null, name, getValue, setValue, setOptions) : (0, _bind.default)(_ObservableObject._set).call(_ObservableObject._set, null, name, getValue, setValue);
      (0, _defineProperty.default)(object, name, {
        configurable: true,
        enumerable: !hidden,
        get: function get() {
          var factoryValue = factory.call(this, initValue);
          createInstanceProperty(this);

          if (typeof factoryValue !== 'undefined') {
            var oldValue = getValue(this);

            if (factoryValue !== oldValue) {
              set(this, factoryValue);
            }
          }

          return factoryValue;
        }
      });

      if (__fields) {
        var oldValue = __fields[name];
        var propertyChangedIfCanEmit = object.propertyChangedIfCanEmit;

        if (propertyChangedIfCanEmit) {
          propertyChangedIfCanEmit.onPropertyChanged(new _IPropertyChanged.PropertyChangedEvent(name, oldValue, function () {
            return object[name];
          }));
        }
      }
    } else {
      createInstanceProperty(object);

      if (__fields && typeof initValue !== 'undefined') {
        var _oldValue = __fields[name];

        if (initValue !== _oldValue) {
          __fields[name] = initValue;
          var _propertyChangedIfCanEmit = object.propertyChangedIfCanEmit;

          if (_propertyChangedIfCanEmit) {
            _propertyChangedIfCanEmit.onPropertyChanged({
              name: name,
              oldValue: _oldValue,
              newValue: initValue
            });
          }
        }
      }
    }

    return this;
  };

  _proto.delete = function _delete(name) {
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
  };

  return ObservableObjectBuilder;
}(); // Test:
// export const obj = new ObservableObjectBuilder()
// 	.writable<number, 'prop1'>('prop1')
// 	.readable<string, 'prop2'>('prop2')
// 	.readable<string, 'prop3'>('prop3')
// 	.delete('prop3')
// 	.object
//
// export const x = obj.prop1 + obj.prop2 + obj.propertyChanged + obj.prop3
// const builder = new ObservableObjectBuilder(true as any)
//
// export function writable<T = any>(
// 	options?: IWritableFieldOptions,
// 	initValue?: T,
// ) {
// 	return (target: ObservableObject, propertyKey: string, descriptor: PropertyDescriptor) => {
// 		builder.object = target
// 		builder.writable(propertyKey, options, initValue)
// 	}
// }
//
// export function readable<T = any>(
// 	options?: IReadableFieldOptions<T>,
// 	initValue?: T,
// ) {
// 	return (target: ObservableObject, propertyKey: string) => {
// 		builder.object = target
// 		builder.readable(propertyKey, options, initValue)
// 	}
// }
// class Class extends ObservableObject {
// 	@writable()
// 	public prop: number
//
// 	@readable()
// 	public prop2: number
// }


exports.ObservableObjectBuilder = ObservableObjectBuilder;