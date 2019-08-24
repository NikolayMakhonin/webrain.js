import {deepSubscribeRule} from '../../deep-subscribe/deep-subscribe'
import {cloneRule, RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {ObservableObject} from '../ObservableObject'
import {IWritableFieldOptions, ObservableObjectBuilder} from '../ObservableObjectBuilder'

export class ConnectorBuilder<TSource = ObservableObject>
	extends ObservableObjectBuilder<ObservableObject>
{
	public buildSourceRule: <TObject extends ObservableObject>(builder: RuleBuilder<TObject>) => RuleBuilder<TSource>

	constructor(
		object?: ObservableObject,
		buildSourceRule?: <TObject extends ObservableObject>(builder: RuleBuilder<TObject>) => RuleBuilder<TSource>,
	) {
		super(object)
		this.buildSourceRule = buildSourceRule
	}

	public connect<TValue, Name extends string | number>(
		name: Name,
		buildRule: (builder: RuleBuilder<TSource>) => RuleBuilder<TValue>,
		options?: IWritableFieldOptions,
		initValue?: TValue,
	): this & { object: { [newProp in Name]: TValue } } {
		const {
			setOptions,
			hidden,
		} = options

		const {object, buildSourceRule} = this

		let ruleBuilder = new RuleBuilder()
		if (buildSourceRule) {
			ruleBuilder = buildSourceRule(ruleBuilder)
		}
		ruleBuilder = buildRule(ruleBuilder)

		const ruleBase = ruleBuilder && ruleBuilder.result
		if (ruleBase == null) {
			throw new Error('buildRule() return null or not initialized RuleBuilder')
		}

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

const CONNECTOR_SOURCE_PROPERTY_NAME = '6ed1fe668f754d5ba2c903aca18bb2bb'

class ConnectorBase<TSubObject> extends ObservableObject {
	public [CONNECTOR_SOURCE_PROPERTY_NAME]: TSubObject
}

new ObservableObjectBuilder(ConnectorBase.prototype)
	.writable(CONNECTOR_SOURCE_PROPERTY_NAME, {
		hidden: true,
	})

export function connector<
	TSource extends ObservableObject,
	TConnector,
>(
	build: (connectorBuilder: ConnectorBuilder<TSource>) => { object: TConnector },
): (source: TSource) => TConnector {
	class Connector extends ConnectorBase<TSource> { }
	const connectorBuilder = build(new ConnectorBuilder<TSource>(
		Connector.prototype,
		b => b.path(o => o[CONNECTOR_SOURCE_PROPERTY_NAME]),
	))

	return source => {
		const instance = new Connector()
		instance[CONNECTOR_SOURCE_PROPERTY_NAME] = source
		return instance as unknown as TConnector
	}
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
