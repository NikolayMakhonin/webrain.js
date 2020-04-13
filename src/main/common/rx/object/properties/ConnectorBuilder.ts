import {createFunction} from '../../../helpers/helpers'
import {Debugger} from '../../Debugger'
import {ValueKeyType} from '../../deep-subscribe/contracts/common'
import {deepSubscribeRule} from '../../deep-subscribe/deep-subscribe'
import {setObjectValue} from '../../deep-subscribe/helpers/common'
import {RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {_set, _setExt, ObservableClass} from '../ObservableClass'
import {IWritableFieldOptions, ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {Connector, ConnectorState} from './Connector'
import {ValueKeys} from './contracts'

const buildSourceRule: <TSource, TValueKeys extends string | number = ValueKeys>
	(builder: RuleBuilder<ConnectorState<TSource>, TValueKeys>)
		=> RuleBuilder<TSource, TValueKeys> = b => b.p('source')

export class ConnectorBuilder<
	TObject extends Connector<TSource> | ObservableClass,
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
		options?: IWritableFieldOptions<TObject, TValue>,
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
		options?: IWritableFieldOptions<TObject, TValue>,
		initValue?: TValue,
	): this & { object: { [newProp in Name]: TValue } } {
		return this._connect(true, name, buildRule, options, initValue)
	}

	private _connect<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TValue = Name extends keyof TObject ? TObject[Name] : any,
	>(
		writable: boolean,
		name: Name,
		buildRule: (builder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>,
		options?: IWritableFieldOptions<TObject, TValue>,
		initValue?: TValue,
	): this & { object: { [newProp in Name]: TValue } } {
		const {object} = this

		let ruleBuilder = new RuleBuilder<TValue, TValueKeys>({
			valuePropertyDefaultName: 'last',
		})
		if (object instanceof Connector) {
			ruleBuilder = buildSourceRule(ruleBuilder as any) as any
		}
		ruleBuilder = buildRule(ruleBuilder as any)

		const ruleBase = ruleBuilder && ruleBuilder.result()
		if (ruleBase == null) {
			throw new Error('buildRule() return null or not initialized RuleBuilder')
		}

		const setOptions = options && options.setOptions

		// optimization
		const baseGetValue = options && options.getValue
			|| createFunction(() => (function() { return this.__fields[name] }), `return this.__fields["${name}"]`) as any
		const baseSetValue = options && options.setValue
			|| createFunction(() => (function(v) { this.__fields[name] = v }), 'v', `this.__fields["${name}"] = v`) as any

		const getValue = !writable ? baseGetValue : function(): TValue {
			return baseGetValue.call(this).value
		}
		const setValue = !writable ? baseSetValue : function(value: TValue) {
			const baseValue = baseGetValue.call(this)
			baseValue.value = value
		}

		const set = setOptions
			? function(this: TObject, newValue: TValue) {
				return _setExt.call(this, name, getValue, setValue, setOptions, newValue)
			}
			: function(this: TObject, newValue: TValue) {
				return _set.call(this, name, getValue, setValue, newValue)
			}

		return this.updatable(
			name,
			{
				setOptions,
				hidden: options && options.hidden,
				// tslint:disable-next-line:no-shadowed-variable
				factory(this: Connector<TSource> | ObservableClass, initValue: TValue) {
					if (writable) {
						baseSetValue.call(this, {value: initValue, parent: null, key: null, keyType: null})
					}

					let setVal = function(this: TObject, value: TValue): void {
						if (typeof value !== 'undefined') {
							initValue = value
						}
					}

					const receiveValue = writable
						? (value: TValue, parent: any, key: any, keyType: ValueKeyType) => {
							Debugger.Instance.onConnectorChanged(this, name, value, parent, key, keyType)

							const baseValue = baseGetValue.call(this)
							baseValue.parent = parent
							baseValue.key = key
							baseValue.keyType = keyType

							setVal.call(this, value)
							return null
						}
						: (value: TValue, parent: any, key: any, keyType: ValueKeyType) => {
							Debugger.Instance.onConnectorChanged(this, name, value, parent, key, keyType)
							setVal.call(this, value)
							return null
						}

					const rule = this === object
						? ruleBase
						: ruleBase.clone()

					this.propertyChanged
						.hasSubscribersObservable
						.subscribe(hasSubscribers => {
							this._setUnsubscriber(name, null)

							if (hasSubscribers) {
								const unsubscribe = deepSubscribeRule<TValue>({
									object: this instanceof Connector ? this.connectorState : this,
									lastValue: receiveValue,
									debugTarget: this,
									rule,
								})

								if (unsubscribe) {
									this._setUnsubscriber(name, unsubscribe)
								}
							}
						}, `Connector.${name}.hasSubscribersObservable for deepSubscribe`)

					setVal = set

					return initValue
				},
				update: writable && function(value: any): TValue|void {
					const baseValue = baseGetValue.call(this)
					set.call(this, value)
					if (baseValue.parent != null) {
						setObjectValue(baseValue.parent, baseValue.key, baseValue.keyType, value)
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
	// @ts-ignore
	class NewConnector extends (baseClass || Connector) implements Connector<TSource> { }

	// @ts-ignore
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
