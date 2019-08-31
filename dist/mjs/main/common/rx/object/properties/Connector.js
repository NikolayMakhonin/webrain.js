import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { ObservableObject } from '../ObservableObject';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
export var Connector =
/*#__PURE__*/
function (_ObservableObject) {
  _inherits(Connector, _ObservableObject);

  function Connector(connectorSource) {
    var _this;

    _classCallCheck(this, Connector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Connector).call(this));
    _this.connectorSource = connectorSource;
    return _this;
  }

  return Connector;
}(ObservableObject);
new ObservableObjectBuilder(Connector.prototype).writable('connectorSource', {
  hidden: true
});