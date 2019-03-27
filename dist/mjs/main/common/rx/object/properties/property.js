import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { ObservableObject } from '../ObservableObject';
export var SetMode = {
  Default: 0,
  Fill: 1,
  Clone: 2
};
export var Property =
/*#__PURE__*/
function (_ObservableObject) {
  _inherits(Property, _ObservableObject);

  function Property(valueFactory) {
    var _this;

    _classCallCheck(this, Property);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Property).call(this));
    _this._valueField = {};
    _this._valueFactory = valueFactory;
    return _this;
  }

  _createClass(Property, [{
    key: "set",
    value: function set(source, options) {
      var fill = options.fill,
          clone = options.clone,
          fillFunc = options.fillFunc,
          valueFactory = options.valueFactory;
      return this._set('value', this._valueField, source, {
        fillFunc: fill ? fillFunc : null,
        convert: function convert(sourceValue) {
          if (clone && sourceValue != null) {
            return cloneValue(sourceValue);
          }

          return sourceValue;
        }
      });

      function cloneValue(sourceValue) {
        if (fillFunc == null) {
          throw new Error('Cannot clone value, because fillFunc == null');
        }

        var value;

        if (valueFactory != null) {
          value = valueFactory(sourceValue);

          if (value != null) {
            return value;
          }
        }

        var _valueFactory = this._valueFactory;

        if (!_valueFactory) {
          throw new Error('Cannot clone value, because this._valueFactory == null');
        }

        value = _valueFactory();

        if (!fillFunc(value, sourceValue)) {
          throw new Error('Cannot clone value, because fillFunc return false');
        }

        return value;
      }
    }
  }, {
    key: "value",
    get: function get() {
      return this._valueField.value;
    },
    set: function set(value) {
      this.set(value);
    }
  }]);

  return Property;
}(ObservableObject);