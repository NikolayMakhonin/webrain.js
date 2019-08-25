import {ObservableObject} from '../ObservableObject'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {ConnectorBuilder} from './ConnectorBuilder'

export class Connector<TSource> extends ObservableObject {
	public connectorSource: TSource

	constructor(connectorSource: TSource) {
		super()
		this.connectorSource = connectorSource
	}
}

new ObservableObjectBuilder(Connector.prototype)
	.writable('connectorSource')

export function connector<
	TSource extends ObservableObject,
	TConnector extends ObservableObject,
>(
	build: (connectorBuilder: ConnectorBuilder<ObservableObject, TSource>) => { object: TConnector },
): (source: TSource) => TConnector {
	class NewConnector extends Connector<TSource> { }

	build(new ConnectorBuilder<NewConnector, TSource>(
		NewConnector.prototype,
		b => b.propertyName('connectorSource'),
	))

	return source => new NewConnector(source) as unknown as TConnector
}

// const builder = new ConnectorBuilder(true as any)
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
