import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { ObservableObject } from '../ObservableObject';
export var CalcSync =
/*#__PURE__*/
function (_ObservableObject) {
  _inherits(CalcSync, _ObservableObject);

  function CalcSync(calcValue) {
    var _this;

    _classCallCheck(this, CalcSync);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CalcSync).call(this));

    if (typeof calcValue !== 'function') {
      throw new Error("calcValue must be a function: ".concat(calcValue));
    }

    _this._calcValue = calcValue;
    return _this;
  }

  _createClass(CalcSync, [{
    key: "invalidate",
    value: function invalidate() {
      if (this.isCalculated) {
        this.isCalculated = false;
        this.onPropertyChanged('value');
      }
    }
  }, {
    key: "value",
    get: function get() {
      if (this.isCalculated) {
        return this._value;
      }

      var value = this._calcValue();

      this._value = value;
      this.isCalculated = true;
      return value;
    }
  }]);

  return CalcSync;
}(ObservableObject);