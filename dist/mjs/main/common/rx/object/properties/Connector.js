import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { ObservableObject } from '../ObservableObject';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { ConnectorBuilder } from './ConnectorBuilder';
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
new ObservableObjectBuilder(Connector.prototype).writable('connectorSource');
export function connector(build) {
  var NewConnector =
  /*#__PURE__*/
  function (_Connector) {
    _inherits(NewConnector, _Connector);

    function NewConnector() {
      _classCallCheck(this, NewConnector);

      return _possibleConstructorReturn(this, _getPrototypeOf(NewConnector).apply(this, arguments));
    }

    return NewConnector;
  }(Connector);

  build(new ConnectorBuilder(NewConnector.prototype, function (b) {
    return b.propertyName('connectorSource');
  }));
  return function (source) {
    return new NewConnector(source);
  };
} // const builder = new ConnectorBuilder(true as any)
//
// export function connect<TObject extends ObservableObject, TValue = any>(
// 	options?: IConnectFieldOptions<TObject, TValue>,
// 	initValue?: TValue,
// ) {
// 	return (target: TObject, propertyKey: string) => {
// 		builder.object = target
// 		builder.connect(propertyKey, options, initValue)
// 	}
// }
// class Class1 extends ObservableObject {
// }
// class Class extends Class1 {
// 	@connect()
// 	public prop: number
// }