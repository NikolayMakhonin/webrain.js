import {ANY} from './contracts/constants'
import {IRule, IRuleAny, IRuleProperty, IRuleRepeat, RuleType} from './contracts/rules'
import {getFuncPropertiesPath} from './helpers/func-properties-path'

export class RuleBuilder<TObject> {
	public rule: IRule
	private _ruleLast: IRule

	private _property<TValue>(rule: IRuleProperty) {
		const {_ruleLast: ruleLast} = this

		if (ruleLast) {
			ruleLast.next = rule
		} else {
			this.rule = rule
		}

		this._ruleLast = rule

		return this as unknown as RuleBuilder<TValue>
	}

	public propertyRegexp<TValue>(regexp: RegExp) {
		return this.propertyPredicate<TValue>(regexp.test, regexp.toString())
	}

	public propertyPredicate<TValue>(
		predicate: (propertyName: string, object) => boolean,
		description: string,
	): RuleBuilder<TValue> {
		return this._property<TValue>({
			type: RuleType.Property,
			predicate(propertyName, object) {
				return Object.prototype.hasOwnProperty.call(object, propertyName)
					&& predicate(propertyName, object)
			},
			*iterateObject(object) {
				for (const key in object) {
					if (Object.prototype.hasOwnProperty.call(object, key)
						&& predicate(key, object)
					) {
						yield object[key]
					}
				}
			},
			description,
		})
	}

	public propertyAll<TValue>(): RuleBuilder<TValue> {
		return this._property<TValue>({
			type: RuleType.Property,
			predicate(propertyName, object) {
				return Object.prototype.hasOwnProperty.call(object, propertyName)
			},
			*iterateObject(object) {
				for (const key in object) {
					if (Object.prototype.hasOwnProperty.call(object, key)) {
						yield object[key]
					}
				}
			},
			description: '*',
		})
	}

	public propertyName<TValue>(propertyName: string): RuleBuilder<TValue> {
		return this._property<TValue>({
			type: RuleType.Property,
			predicate(propName, object) {
				return propName === propertyName
					&& Object.prototype.hasOwnProperty.call(object, propertyName)
			},
			*iterateObject(object) {
				for (const propName in object) {
					if (propName === propertyName
						&& Object.prototype.hasOwnProperty.call(object, propertyName)
					) {
						yield object[propertyName]
					}
				}
			},
			description: propertyName,
		})
	}

	public propertyNames<TValue>(...propertiesNames: string[]): RuleBuilder<TValue> {
		if (propertiesNames.length === 1) {
			return this.propertyName(propertiesNames[1])
		}

		if (propertiesNames.length === 0) {
			throw new Error('propertiesNames is empty')
		}

		let properties
		for (let i = 0, len = propertiesNames.length; i < len; i++) {
			const propertiesName = propertiesNames[i]
			if (propertiesName === ANY) {
				return this.propertyAll()
			}
			if (!properties) {
				properties = {
					[propertiesNames[i]]: true,
				}
			} else {
				properties[propertiesNames[i]] = true
			}
		}

		return this._property<TValue>({
			type: RuleType.Property,
			predicate(propertyName, object) {
				return properties[propertyName]
					&& Object.prototype.hasOwnProperty.call(object, propertyName)
			},
			*iterateObject(object) {
				for (let i = 0, len = propertiesNames.length; i < len; i++) {
					const propertyName = propertiesNames[i]
					if (Object.prototype.hasOwnProperty.call(object, propertyName)) {
						yield object[propertyName]
					}
				}
			},
			description: propertiesNames.join('|'),
		})
	}

	public path<TValue>(getValueFunc: (o: TObject) => TValue): RuleBuilder<TValue> {
		for (const propertyName of getFuncPropertiesPath(getValueFunc)) {
			this.propertyName(propertyName)
		}

		return this as unknown as RuleBuilder<TValue>
	}

	public any<TValue>(
		...getChilds: Array<(builder: RuleBuilder<TObject>) => RuleBuilder<TValue>>
	): RuleBuilder<TValue> {
		const {_ruleLast: ruleLast} = this

		const rule: IRuleAny = {
			type: RuleType.Any,
			rules: getChilds.map(o => o(new RuleBuilder<TObject>()).rule),
		}

		if (ruleLast) {
			ruleLast.next = rule
		} else {
			this.rule = rule
		}

		this._ruleLast = rule

		return this as unknown as RuleBuilder<TValue>
	}

	public repeat<TValue>(
		countMin: number,
		countMax: number,
		getChild: (builder: RuleBuilder<TObject>) => RuleBuilder<TValue>,
	): RuleBuilder<TValue> {
		const {_ruleLast: ruleLast} = this

		const rule: IRuleRepeat = {
			type: RuleType.Repeat,
			countMin,
			countMax,
			rule: getChild(new RuleBuilder<TObject>()).rule,
		}

		if (ruleLast) {
			ruleLast.next = rule
		} else {
			this.rule = rule
		}

		this._ruleLast = rule

		return this as unknown as RuleBuilder<TValue>
	}
}
