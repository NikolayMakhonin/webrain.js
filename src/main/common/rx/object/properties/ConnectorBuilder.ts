import {createFunction} from '../../../helpers/helpers'
import {deepSubscribeRule} from '../../deep-subscribe/deep-subscribe'
import {cloneRule, RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {_set, _setExt, ObservableObject} from '../ObservableObject'
import {IWritableFieldOptions, ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {CalcObjectDebugger} from './CalcObjectDebugger'
import {Connector} from './Connector'
import {ValueKeys} from './contracts'

export class ConnectorBuilder<
	TObject extends ObservableObject,
	TSource = TObject,
	TValueKeys extends string | number = ValueKeys
>
	extends ObservableObjectBuilder<TObject>
{
	public buildSourceRule: (builder: RuleBuilder<TObject, TValueKeys>)
		=> RuleBuilder<TSource, TValueKeys>

	constructor(
		object?: TObject,
		buildSourceRule?: (builder: RuleBuilder<TObject, TValueKeys>)
			=> RuleBuilder<TSource, TValueKeys>,
	) {
		super(object)
		this.buildSourceRule = buildSourceRule
	}

	public connect<TValue, Name extends string | number>(
		name: Name,
		buildRule: (builder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>,
		options?: IWritableFieldOptions,
		initValue?: TValue,
	): this & { object: { [newProp in Name]: TValue } } {
		const {object, buildSourceRule} = this

		let ruleBuilder = new RuleBuilder<TValue, TValueKeys>()
		if (buildSourceRule) {
			ruleBuilder = buildSourceRule(ruleBuilder as any) as any
		}
		ruleBuilder = buildRule(ruleBuilder as any)

		const ruleBase = ruleBuilder && ruleBuilder.result
		if (ruleBase == null) {
			throw new Error('buildRule() return null or not initialized RuleBuilder')
		}

		const setOptions = options && options.setOptions

		// optimization
		const getValue = createFunction('o', `return o.__fields["${name}"]`) as any
		const setValue = createFunction('o', 'v', `o.__fields["${name}"] = v`) as any
		const set = setOptions
			? _setExt.bind(null, name, getValue, setValue, setOptions)
			: _set.bind(null, name, getValue, setValue)

		return this.readable(
			name,
			{
				setOptions,
				hidden: options && options.hidden,
				// tslint:disable-next-line:no-shadowed-variable
				factory(this: ObservableObject, initValue: TValue) {
					let setVal = (obj, value: TValue): void => {
						if (typeof value !== 'undefined') {
							initValue = value
						}
					}

					const receiveValue = (value: TValue, parent: any, propertyName: string) => {
						CalcObjectDebugger.Instance.onConnectorChanged(this, value, parent, propertyName)
						setVal(this, value)
						return null
					}

					const rule = this === object
						? ruleBase
						: cloneRule(ruleBase)

					this.propertyChanged.hasSubscribersObservable
						.subscribe(hasSubscribers => {
							this._setUnsubscriber(name, null)

							if (hasSubscribers) {
								const unsubscribe = deepSubscribeRule<TValue>(
									this, receiveValue, true, rule,
								)

								this._setUnsubscriber(name, unsubscribe)
							}
						})

					setVal = set

					return initValue
				},
			},
			initValue,
		)
	}
}

export function connectorClass<
	TSource extends ObservableObject,
	TConnector extends ObservableObject,
>(
	build: (connectorBuilder: ConnectorBuilder<ObservableObject, TSource>) => { object: TConnector },
	baseClass?: new (source: TSource) => Connector<TSource>,
): new (source: TSource) => TConnector {
	class NewConnector extends (baseClass || Connector) implements Connector<TSource> { }

	build(new ConnectorBuilder<NewConnector, TSource>(
		NewConnector.prototype,
		b => b.propertyName('connectorSource'),
	))

	return NewConnector as unknown as new (source: TSource) => TConnector
}

export function connectorFactory<
	TSource extends ObservableObject,
	TConnector extends ObservableObject,
>(
	build: (connectorBuilder: ConnectorBuilder<ObservableObject, TSource>) => { object: TConnector },
	baseClass?: new (source: TSource) => Connector<TSource>,
): (source: TSource) => TConnector {
	const NewConnector = connectorClass(build, baseClass)
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
