"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ObservableObjectBuilder = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _helpers = require("../../helpers/helpers");

var _webrainOptions = require("../../helpers/webrainOptions");

var _depend = require("../../rx/depend/core/depend");

var _IPropertyChanged = require("./IPropertyChanged");

var _ObjectBuilder2 = require("./ObjectBuilder");

var _ObservableClass = require("./ObservableClass");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

var ObservableObjectBuilder = /*#__PURE__*/function (_ObjectBuilder) {
  (0, _inherits2.default)(ObservableObjectBuilder, _ObjectBuilder);

  var _super = _createSuper(ObservableObjectBuilder);

  function ObservableObjectBuilder(object) {
    (0, _classCallCheck2.default)(this, ObservableObjectBuilder);
    return _super.call(this, object || new _ObservableClass.ObservableClass());
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
      var set = setOptions ? function (newValue) {
        return _ObservableClass._setExt.call(this, name, getValue, setValue, setOptions, newValue);
      } : function (newValue) {
        return _ObservableClass._set.call(this, name, getValue, setValue, newValue);
      };
      (0, _defineProperty.default)(object, name, {
        configurable: true,
        enumerable: !hidden,
        get: (0, _depend.depend)(getValue, null, null, true),
        // get: getValue,
        set: set
      });

      if (__fields && typeof initValue !== 'undefined') {
        var _value = __fields[name];

        if (!_webrainOptions.webrainEquals.call(object, _value, initValue)) {
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
        setOnUpdate = setOptions ? function (newValue) {
          return _ObservableClass._setExt.call(this, name, getValue, setValue, setOptions, newValue);
        } : function (newValue) {
          return _ObservableClass._set.call(this, name, getValue, setValue, newValue);
        };
      }

      var setOnInit;

      if (factory) {
        var _setOptions = (0, _extends2.default)((0, _extends2.default)({}, options && options.setOptions), {}, {
          suppressPropertyChanged: true
        });

        setOnInit = _setOptions ? function (newValue) {
          return _ObservableClass._setExt.call(this, name, getValue, setValue, _setOptions, newValue);
        } : function (newValue) {
          return _ObservableClass._set.call(this, name, getValue, setValue, newValue);
        };
      }

      var createInstanceProperty = function createInstanceProperty(instance) {
        var attributes = {
          configurable: true,
          enumerable: !hidden,
          // get: depend(getValue, null, true),
          get: getValue,
          set: update ? function (value) {
            var newValue = update.call(this, value);

            if (typeof newValue !== 'undefined') {
              setOnUpdate.call(this, newValue);
            }
          } : _helpers.missingSetter
        };
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

              if (!_webrainOptions.webrainEquals.call(this, oldValue, factoryValue)) {
                setOnInit.call(this, factoryValue);
              }
            }

            return factoryValue;
          },
          set: update ? function (value) {
            // tslint:disable:no-dead-store
            var factoryValue = init.call(this);
            var newValue = update.call(this, value);

            if (typeof newValue !== 'undefined') {
              var oldValue = getValue.call(this);

              if (!_webrainOptions.webrainEquals.call(this, oldValue, newValue)) {
                setOnInit.call(this, newValue);
              }
            }
          } : _helpers.missingSetter
        };
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

          if (!_webrainOptions.webrainEquals.call(object, _oldValue, initValue)) {
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
}(_ObjectBuilder2.ObjectBuilder); // Test:
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