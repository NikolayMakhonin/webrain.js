import {ObservableClass} from '../ObservableClass'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'

export class ConnectorState<TSource>  extends ObservableClass {
	public source: TSource
	public name: string
}

new ObservableObjectBuilder(ConnectorState.prototype)
	.writable('source')

export class Connector<TSource> extends ObservableClass {
	public readonly connectorState: ConnectorState<TSource>

	constructor(source: TSource, name?: string) {
		super()
		this.connectorState.name = name
		this.connectorState.source = source
	}
}

new ObservableObjectBuilder(Connector.prototype)
	.readable('connectorState', {
		hidden: true,
		factory() {
			return new ConnectorState()
		},
	})
