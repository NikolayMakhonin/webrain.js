import {ObservableClass} from '../ObservableClass'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'

export class Connector<TSource> extends ObservableClass {
	public connectorSource: TSource

	constructor(connectorSource: TSource) {
		super()
		this.connectorSource = connectorSource
	}
}

new ObservableObjectBuilder(Connector.prototype)
	.writable('connectorSource', {
		hidden: true,
	})
