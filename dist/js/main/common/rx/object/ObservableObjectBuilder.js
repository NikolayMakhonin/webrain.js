"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports.ObservableObjectBuilder = void 0;

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _helpers = require("../../helpers/helpers");

require("../extensions/autoConnect");

var _IPropertyChanged = require("./IPropertyChanged");

var _ObservableObject = require("./ObservableObject");

function ownKeys(object, enumerableOnly) { var keys = (0, _keys.default)(object); if (_getOwnPropertySymbols.default) { var symbols = (0, _getOwnPropertySymbols.default)(object); if (enumerableOnly) symbols = (0, _filter.default)(symbols).call(symbols, function (sym) { return (0, _getOwnPropertyDescriptor.default)(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context; (0, _forEach.default)(_context = ownKeys(source, true)).call(_context, function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors.default) { (0, _defineProperties.default)(target, (0, _getOwnPropertyDescriptors.default)(source)); } else { var _context2; (0, _forEach.default)(_context2 = ownKeys(source)).call(_context2, function (key) { (0, _defineProperty3.default)(target, key, (0, _getOwnPropertyDescriptor.default)(source, key)); }); } } return target; }

var ObservableObjectBuilder =
/*#__PURE__*/
function () {
  function ObservableObjectBuilder(object) {
    (0, _classCallCheck2.default)(this, ObservableObjectBuilder);
    this.object = object || new _ObservableObject.ObservableObject();
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


      var getValue = (0, _helpers.createFunction)('o', "return o.__fields[\"".concat(name, "\"]"));
      var setValue = (0, _helpers.createFunction)('o', 'v', "o.__fields[\"".concat(name, "\"] = v"));

      var _set2 = setOptions ? (0, _bind.default)(_ObservableObject._setExt).call(_ObservableObject._setExt, null, name, getValue, setValue, setOptions) : (0, _bind.default)(_ObservableObject._set).call(_ObservableObject._set, null, name, getValue, setValue);

      (0, _defineProperty3.default)(object, name, {
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
    }
  }, {
    key: "readable",
    value: function readable(name, options, initValue) {
      var hidden = options && options.hidden;

      var setOptions = _objectSpread({}, options && options.setOptions, {
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


      var getValue = (0, _helpers.createFunction)('o', "return o.__fields[\"".concat(name, "\"]"));

      var createInstanceProperty = function createInstanceProperty(instance) {
        (0, _defineProperty3.default)(instance, name, {
          configurable: true,
          enumerable: !hidden,
          get: function get() {
            return getValue(this);
          }
        });
      };

      if (factory) {
        // optimization
        var setValue = (0, _helpers.createFunction)('o', 'v', "o.__fields[\"".concat(name, "\"] = v"));
        var set = setOptions ? (0, _bind.default)(_ObservableObject._setExt).call(_ObservableObject._setExt, null, name, getValue, setValue, setOptions) : (0, _bind.default)(_ObservableObject._set).call(_ObservableObject._set, null, name, getValue, setValue);
        (0, _defineProperty3.default)(object, name, {
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