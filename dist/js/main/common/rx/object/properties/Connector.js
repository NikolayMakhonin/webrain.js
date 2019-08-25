"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connector = connector;
exports.Connector = void 0;

var _ObservableObject = require("../ObservableObject");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var _ConnectorBuilder = require("./ConnectorBuilder");

class Connector extends _ObservableObject.ObservableObject {
  constructor(connectorSource) {
    super();
    this.connectorSource = connectorSource;
  }

}

exports.Connector = Connector;
new _ObservableObjectBuilder.ObservableObjectBuilder(Connector.prototype).writable('connectorSource');

function connector(build) {
  class NewConnector extends Connector {}

  build(new _ConnectorBuilder.ConnectorBuilder(NewConnector.prototype, b => b.propertyName('connectorSource')));
  return source => new NewConnector(source);
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