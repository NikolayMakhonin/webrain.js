import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
// region Test
import { RuleBuilder } from "../deep-subscribe";
export function test(o) {
  return o;
}
test({
  a__: 'true'
}); // endregion

export var DeepSubscribe =
/*#__PURE__*/
function (_RuleBuilder) {
  _inherits(DeepSubscribe, _RuleBuilder);

  function DeepSubscribe(object) {
    var _this;

    _classCallCheck(this, DeepSubscribe);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DeepSubscribe).call(this));
    _this._object = object;
    return _this;
  }

  return DeepSubscribe;
}(RuleBuilder);