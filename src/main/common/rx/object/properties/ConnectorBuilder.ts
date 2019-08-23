import {deepSubscribeRule} from '../../deep-subscribe/deep-subscribe'
import {cloneRule, RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {ISetOptions, ObservableObject} from '../ObservableObject'
import {IWritableFieldOptions, ObservableObjectBuilder} from '../ObservableObjectBuilder'

export interface IConnectFieldOptions<TObject, TValue> extends IWritableFieldOptions {
	buildRule: (builder: RuleBuilder<TObject>) => RuleBuilder<TValue>,
}

export class ConnectorBuilder<TObject extends ObservableObject> extends ObservableObjectBuilder<TObject> {
	public connect<TValue>(
		name: string | number,
		options?: IConnectFieldOptions<TObject, TValue>,
		initValue?: TValue,
	): this {
		const {
			buildRule,
			setOptions,
			hidden,
		} = options

		const ruleBuilder = buildRule(new RuleBuilder())
		const ruleBase = ruleBuilder && ruleBuilder.result
		if (ruleBase == null) {
			throw new Error('buildRule() return null or not initialized RuleBuilder')
		}

		const {object} = this

		return this.readable(
			name,
			{
				setOptions,
				hidden,
				// tslint:disable-next-line:no-shadowed-variable
				factory(this: ObservableObject, initValue: TValue) {
					let setValue = (value: TValue): void => {
						if (typeof value !== 'undefined') {
							initValue = value
						}
					}

					const unsubscribe = deepSubscribeRule<TValue>(
						this,
						value => {
							setValue(value)
							return null
						},
						true,
						this === object
							? ruleBase
							: cloneRule(ruleBase),
					)

					this._setUnsubscriber(name, unsubscribe)

					setValue = value => {
						this._set(name, value, setOptions)
					}

					return initValue
				},
			},
			initValue,
		)
	}
}

const CONNECTOR_SOURCE_PROPERTY_NAME: string = Math.random().toString(36)

class ConnectorBase extends ObservableObject {
	constructor(source: object) {
		super()
		this[CONNECTOR_SOURCE_PROPERTY_NAME] = source
	}
}

Object.defineProperty(ConnectorBase.prototype, CONNECTOR_SOURCE_PROPERTY_NAME, {
	configurable: false,
	enumerable  : false,
	writable    : false,
	value       : null,
})

export function connector(
	build: (connectorBuilder: ConnectorBuilder<ObservableObject>) => void,
): new (source: object) => ObservableObject {
	class Connector extends ConnectorBase { }
	const connectorBuilder = new ConnectorBuilder(Connector.prototype)
	build(connectorBuilder)
	return Connector
}
