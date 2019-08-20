import {deepSubscribeRule} from '../../deep-subscribe/deep-subscribe'
import {RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {ISetOptions, ObservableObject} from '../ObservableObject'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'

export class ConnectorBuilder<TObject extends ObservableObject> extends ObservableObjectBuilder<TObject> {
	public connect<TValue>(
		name: string | number,
		buildRule: (builder: RuleBuilder<TObject>) => RuleBuilder<TValue>,
		options?: ISetOptions,
		initValue?: TValue,
	): this {
		const ruleBuilder = buildRule(new RuleBuilder())
		const rule = ruleBuilder && ruleBuilder.result
		if (rule == null) {
			throw new Error('buildRule() return null or not initialized RuleBuilder')
		}

		return this.readable(name, {
			factorySetOptions: options,
			factory(this: ObservableObject) {
				let setValue = (value: TValue): void => {
					if (typeof value !== 'undefined') {
						initValue = value
					}
				}

				const unsubscribe = deepSubscribeRule<TValue>(this, value => {
					setValue(value)
					return null
				}, true, rule)

				this._setUnsubscriber(name, unsubscribe)

				setValue = value => {
					this._set(name, value, options)
				}

				return initValue
			},
		})
	}
}
