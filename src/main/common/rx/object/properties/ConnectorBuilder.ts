import {deepSubscribeRule} from '../../deep-subscribe/deep-subscribe'
import {cloneRule, RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {ObservableObject} from '../ObservableObject'
import {IWritableFieldOptions, ObservableObjectBuilder} from '../ObservableObjectBuilder'
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

		return this.readable(
			name,
			{
				setOptions,
				hidden: options && options.hidden,
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
