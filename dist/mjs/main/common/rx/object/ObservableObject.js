import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import '../extensions/autoConnect';
import { DeepPropertyChangedObject } from './DeepPropertyChangedObject';
export var ObservableObject =
/*#__PURE__*/
function (_DeepPropertyChangedO) {
  _inherits(ObservableObject, _DeepPropertyChangedO);

  /** @internal */
  function ObservableObject() {
    var _this;

    _classCallCheck(this, ObservableObject);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ObservableObject).call(this));
    Object.defineProperty(_assertThisInitialized(_this), '__fields', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {}
    });
    return _this;
  }
  /** @internal */


  _createClass(ObservableObject, [{
    key: "_set",
    value: function _set(name, newValue, options) {
      var __fields = this.__fields;
      var oldValue = __fields[name];
      var equalsFunc = options.equalsFunc;

      if (equalsFunc ? equalsFunc.call(this, oldValue, newValue) : oldValue === newValue) {
        return false;
      }

      var fillFunc = options.fillFunc;

      if (fillFunc && oldValue != null && newValue != null && fillFunc.call(this, oldValue, newValue)) {
        return false;
      }

      var convertFunc = options.convertFunc;

      if (convertFunc) {
        newValue = convertFunc.call(this, newValue);
      }

      if (oldValue === newValue) {
        return false;
      }

      var beforeChange = options.beforeChange;

      if (beforeChange) {
        beforeChange.call(this, oldValue);
      }

      __fields[name] = newValue;

      this._propagatePropertyChanged(name, newValue);

      var afterChange = options.afterChange;

      if (afterChange) {
        afterChange.call(this, newValue);
      }

      this.onPropertyChanged({
        name: name,
        oldValue: oldValue,
        newValue: newValue
      });
      return true;
    }
  }]);

  return ObservableObject;
}(DeepPropertyChangedObject);