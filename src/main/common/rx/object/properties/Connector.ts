import {ObservableClass} from '../ObservableClass'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'

export class ConnectorState<TSource>  extends ObservableClass {
	public connectorSource: TSource
}

new ObservableObjectBuilder(ConnectorState.prototype)
	.writable('connectorSource')

export class Connector<TSource> extends ObservableClass {
	public name: string
	public readonly connectorState: ConnectorState<TSource>

	constructor(connectorSource: TSource) {
		super()
		this.connectorState.connectorSource = connectorSource
	}
}

new ObservableObjectBuilder(Connector.prototype)
	.readable('connectorState', {
		hidden: true,
		factory() {
			return new ConnectorState()
		},
	})
