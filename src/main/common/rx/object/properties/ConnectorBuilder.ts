import {createFunction} from '../../../helpers/helpers'
import {ValueKeyType} from '../../deep-subscribe/contracts/common'
import {deepSubscribeRule} from '../../deep-subscribe/deep-subscribe'
import {RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {_set, _setExt, ObservableClass} from '../ObservableClass'
import {IWritableFieldOptions, ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {CalcObjectDebugger} from './CalcObjectDebugger'
import {Connector, ConnectorState} from './Connector'
import {ValueKeys} from './contracts'

const buildSourceRule: <TSource, TValueKeys extends string | number = ValueKeys>
	(builder: RuleBuilder<ConnectorState<TSource>, TValueKeys>)
		=> RuleBuilder<TSource, TValueKeys> = b => b.p('connectorSource')

export class ConnectorBuilder<
	TObject extends Connector<TSource>,
	TSource = TObject,
	TValueKeys extends string | number = ValueKeys
>
	extends ObservableObjectBuilder<TObject>
{
	constructor(
		object?: TObject,
	) {
		super(object)
	}

	public connect<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TValue = Name extends keyof TObject ? TObject[Name] : any,
	>(
		name: Name,
		buildRule: (builder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>,
		options?: IWritableFieldOptions,
		initValue?: TValue,
	): this & { object: { readonly [newProp in Name]: TValue } } {
		return this._connect(false, name, buildRule, options, initValue)
	}

	public connectWritable<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TValue = Name extends keyof TObject ? TObject[Name] : any,
	>(
		name: Name,
		buildRule: (builder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>,
		options?: IWritableFieldOptions,
		initValue?: TValue,
	): this & { object: { readonly [newProp in Name]: TValue } } {
		return this._connect(true, name, buildRule, options, initValue)
	}

	private _connect<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TValue = Name extends keyof TObject ? TObject[Name] : any,
	>(
		writable: boolean,
		name: Name,
		buildRule: (builder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>,
		options?: IWritableFieldOptions,
		initValue?: TValue,
	): this & { object: { [newProp in Name]: TValue } } {
		const {object} = this

		let ruleBuilder = new RuleBuilder<TValue, TValueKeys>()
		ruleBuilder = buildSourceRule(ruleBuilder as any) as any
		ruleBuilder = buildRule(ruleBuilder as any)

		const ruleBase = ruleBuilder && ruleBuilder.result()
		if (ruleBase == null) {
			throw new Error('buildRule() return null or not initialized RuleBuilder')
		}

		const setOptions = options && options.setOptions

		// optimization
		const baseGetValue = options && options.getValue || createFunction(`return this.__fields["${name}"]`) as any
		const baseSetValue = options && options.setValue || createFunction('v', `this.__fields["${name}"] = v`) as any

		const getValue = !writable ? baseGetValue : function(): TValue {
			return baseGetValue.call(this).value
		}
		const setValue = !writable ? baseSetValue : function(value: TValue) {
			const baseValue = baseGetValue.call(this)
			baseValue.value = value
		}

		const set = setOptions
			? _setExt.bind(null, name, getValue, setValue, setOptions)
			: _set.bind(null, name, getValue, setValue)

		return this.updatable(
			name,
			{
				setOptions,
				hidden: options && options.hidden,
				// tslint:disable-next-line:no-shadowed-variable
				factory(this: Connector<TSource>, initValue: TValue) {
					if (writable) {
						baseSetValue.call(this, {value: initValue, parent: null, key: null, keyType: null})
					}

					let setVal = (obj, value: TValue): void => {
						if (typeof value !== 'undefined') {
							initValue = value
						}
					}

					const receiveValue = writable
						? (value: TValue, parent: any, key: any, keyType: ValueKeyType) => {
							CalcObjectDebugger.Instance.onConnectorChanged(this, name, value, parent, key, keyType)

							const baseValue = baseGetValue.call(this)
							baseValue.parent = parent
							baseValue.key = key
							baseValue.keyType = keyType

							setVal(this, value)
							return null
						}
						: (value: TValue, parent: any, key: any, keyType: ValueKeyType) => {
							CalcObjectDebugger.Instance.onConnectorChanged(this, name, value, parent, key, keyType)
							setVal(this, value)
							return null
						}

					const rule = this === object
						? ruleBase
						: ruleBase.clone()

					this.propertyChanged.hasSubscribersObservable
						.subscribe(hasSubscribers => {
							this._setUnsubscriber(name, null)

							if (hasSubscribers) {
								const unsubscribe = deepSubscribeRule<TValue>({
									object: this.connectorState,
									lastValue: receiveValue,
									rule,
								})

								if (unsubscribe) {
									this._setUnsubscriber(name, unsubscribe)
								}
							}
						})

					setVal = set

					return initValue
				},
				update: writable && function(value: any): TValue|void {
					const baseValue = baseGetValue.call(this)
					if (baseValue.parent != null) {
						// TODO implement set value for different keyTypes
						baseValue.parent[baseValue.key] = value
					}
					// return value
				},
				getValue,
				setValue,
			},
			initValue,
		)
	}
}

export function connectorClass<
	TSource extends ObservableClass,
	TConnector extends Connector<TSource>,
>({
	buildRule,
	baseClass,
}: {
	buildRule: (connectorBuilder: ConnectorBuilder<Connector<TSource>, TSource>) => { object: TConnector },
	baseClass?: new (source: TSource) => Connector<TSource>,
}): new (source: TSource, name?: string) => TConnector {
	class NewConnector extends (baseClass || Connector) implements Connector<TSource> { }

	buildRule(new ConnectorBuilder<NewConnector, TSource>(
		NewConnector.prototype,
	))

	return NewConnector as unknown as new (source: TSource) => TConnector
}

export function connectorFactory<
	TSource extends ObservableClass,
	TConnector extends Connector<TSource>,
>({
	name,
	buildRule,
	baseClass,
}: {
	name?: string,
	buildRule: (connectorBuilder: ConnectorBuilder<Connector<TSource>, TSource>) => { object: TConnector },
	baseClass?: new (source: TSource, name?: string) => Connector<TSource>,
}): (source: TSource, name?: string) => TConnector {
	const NewConnector = connectorClass({buildRule, baseClass})
	return (source, sourceName) => new NewConnector(source, name || sourceName) as unknown as TConnector
}

// const builder = new ConnectorBuilder(true as any)
//
// export function connect<TObject extends ObservableClass, TValue = any>(
// 	options?: IConnectFieldOptions<TObject, TValue>,
// 	initValue?: TValue,
// ) {
// 	return (target: TObject, propertyKey: string) => {
// 		builder.object = target
// 		builder.connect(propertyKey, options, initValue)
// 	}
// }

// class Class1 extends ObservableClass {
// }
// class Class extends Class1 {
// 	@connect()
// 	public prop: number
// }
