"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ObservableObjectBuilder = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _helpers = require("../../helpers/helpers");

var _webrainOptions = require("../../helpers/webrainOptions");

require("../extensions/autoConnect");

var _IPropertyChanged = require("./IPropertyChanged");

var _ObservableClass = require("./ObservableClass");

var ObservableObjectBuilder =
/*#__PURE__*/
function () {
  function ObservableObjectBuilder(object) {
    (0, _classCallCheck2.default)(this, ObservableObjectBuilder);
    this.object = object || new _ObservableClass.ObservableClass();
  }

  (0, _createClass2.default)(ObservableObjectBuilder, [{
    key: "writable",
    value: function writable(name, options, initValue) {
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


      var getValue = options && options.getValue || (0, _helpers.createFunction)(function () {
        return function () {
          return this.__fields[name];
        };
      }, "return this.__fields[\"" + name + "\"]");
      var setValue = options && options.setValue || (0, _helpers.createFunction)(function () {
        return function (v) {
          this.__fields[name] = v;
        };
      }, 'v', "this.__fields[\"" + name + "\"] = v");

      var _set2 = setOptions ? (0, _bind.default)(_ObservableClass._setExt).call(_ObservableClass._setExt, null, name, getValue, setValue, setOptions) : (0, _bind.default)(_ObservableClass._set).call(_ObservableClass._set, null, name, getValue, setValue);

      (0, _defineProperty.default)(object, name, {
        configurable: true,
        enumerable: !hidden,
        get: function get() {
          return getValue.call(this);
        },
        set: function set(newValue) {
          _set2(this, newValue);
        }
      });

      if (__fields && typeof initValue !== 'undefined') {
        var _value = __fields[name];

        if (_webrainOptions.webrainOptions.equalsFunc ? !_webrainOptions.webrainOptions.equalsFunc.call(object, _value, initValue) : _value !== initValue) {
          object[name] = initValue;
        }
      }

      return this;
    }
  }, {
    key: "readable",
    value: function readable(name, options, initValue) {
      return this.updatable(name, options, initValue);
    }
  }, {
    key: "updatable",
    value: function updatable(name, options, initValue) {
      var hidden = options && options.hidden;
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
      }

      var update = options && options.update; // optimization

      var getValue = options && options.getValue || (0, _helpers.createFunction)(function () {
        return function () {
          return this.__fields[name];
        };
      }, "return this.__fields[\"" + name + "\"]");
      var setValue;

      if (update || factory) {
        setValue = options && options.setValue || (0, _helpers.createFunction)(function () {
          return function (v) {
            this.__fields[name] = v;
          };
        }, 'v', "this.__fields[\"" + name + "\"] = v");
      }

      var setOnUpdate;

      if (update) {
        // tslint:disable-next-line
        var setOptions = options && options.setOptions;
        setOnUpdate = setOptions ? (0, _bind.default)(_ObservableClass._setExt).call(_ObservableClass._setExt, null, name, getValue, setValue, setOptions) : (0, _bind.default)(_ObservableClass._set).call(_ObservableClass._set, null, name, getValue, setValue);
      }

      var setOnInit;

      if (factory) {
        var _setOptions = (0, _extends2.default)({}, options && options.setOptions, {
          suppressPropertyChanged: true
        });

        setOnInit = _setOptions ? (0, _bind.default)(_ObservableClass._setExt).call(_ObservableClass._setExt, null, name, getValue, setValue, _setOptions) : (0, _bind.default)(_ObservableClass._set).call(_ObservableClass._set, null, name, getValue, setValue);
      }

      var createInstanceProperty = function createInstanceProperty(instance) {
        var attributes = {
          configurable: true,
          enumerable: !hidden,
          get: function get() {
            return getValue.call(this);
          }
        };

        if (update) {
          attributes.set = function (value) {
            var newValue = update.call(this, value);

            if (typeof newValue !== 'undefined') {
              setOnUpdate(this, newValue);
            }
          };
        }

        (0, _defineProperty.default)(instance, name, attributes);
      };

      var initializeValue = options && options.init;

      if (factory) {
        var init = function init() {
          var factoryValue = factory.call(this, initValue);
          createInstanceProperty(this);

          if (initializeValue) {
            initializeValue.call(this, factoryValue);
          }

          return factoryValue;
        };

        var initAttributes = {
          configurable: true,
          enumerable: !hidden,
          get: function get() {
            var factoryValue = init.call(this);

            if (typeof factoryValue !== 'undefined') {
              var oldValue = getValue.call(this);

              if (_webrainOptions.webrainOptions.equalsFunc ? !_webrainOptions.webrainOptions.equalsFunc.call(this, oldValue, factoryValue) : oldValue !== factoryValue) {
                setOnInit(this, factoryValue);
              }
            }

            return factoryValue;
          }
        };

        if (update) {
          initAttributes.set = function (value) {
            // tslint:disable:no-dead-store
            var factoryValue = init.call(this);
            var newValue = update.call(this, value);

            if (typeof newValue !== 'undefined') {
              var oldValue = getValue.call(this);

              if (_webrainOptions.webrainOptions.equalsFunc ? !_webrainOptions.webrainOptions.equalsFunc.call(this, oldValue, newValue) : oldValue !== newValue) {
                setOnInit(this, newValue);
              }
            }
          };
        }

        (0, _defineProperty.default)(object, name, initAttributes);

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

          if (initializeValue) {
            initializeValue.call(this, initValue);
          }

          if (_webrainOptions.webrainOptions.equalsFunc ? !_webrainOptions.webrainOptions.equalsFunc.call(object, _oldValue, initValue) : _oldValue !== initValue) {
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
// 	return (target: ObservableClass, propertyKey: string, descriptor: PropertyDescriptor) => {
// 		builder.object = target
// 		builder.writable(propertyKey, options, initValue)
// 	}
// }
//
// export function readable<T = any>(
// 	options?: IReadableFieldOptions<T>,
// 	initValue?: T,
// ) {
// 	return (target: ObservableClass, propertyKey: string) => {
// 		builder.object = target
// 		builder.readable(propertyKey, options, initValue)
// 	}
// }
// class Class extends ObservableClass {
// 	@writable()
// 	public prop: number
//
// 	@readable()
// 	public prop2: number
// }


exports.ObservableObjectBuilder = ObservableObjectBuilder;