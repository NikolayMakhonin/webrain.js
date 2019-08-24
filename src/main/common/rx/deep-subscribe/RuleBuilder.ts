import {ANY_DISPLAY, COLLECTION_PREFIX, VALUE_PROPERTY_DEFAULT, VALUE_PROPERTY_PREFIX} from './contracts/constants'
import {IRuleSubscribe} from './contracts/rule-subscribe'
import {IRule} from './contracts/rules'
import {getFuncPropertiesPath} from './helpers/func-properties-path'
import {RuleAny, RuleNothing, RuleRepeat} from './rules'
import {RuleSubscribeCollection, RuleSubscribeMap, RuleSubscribeObject, SubscribeObjectType} from './rules-subscribe'
import {Thenable} from "../../async/async";
import {Diff} from "../../helpers/typescript";

const RuleSubscribeObjectPropertyNames = RuleSubscribeObject.bind(null, SubscribeObjectType.Property, null)
const RuleSubscribeObjectValuePropertyNames = RuleSubscribeObject.bind(null, SubscribeObjectType.ValueProperty, null)
const RuleSubscribeMapKeys = RuleSubscribeMap.bind(null, null)

// const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// let nextUnsubscribePropertyId = 0

export type TRulePathObject<TObject, TValueKeys extends string | number> =
	TObject extends { [VALUE_PROPERTY_DEFAULT]: any }
		? Diff<TObject[VALUE_PROPERTY_DEFAULT], Thenable<any>> & {
			[key in keyof TObject[VALUE_PROPERTY_DEFAULT] | TValueKeys]
				: Diff<TRulePathObject<TObject[VALUE_PROPERTY_DEFAULT], TValueKeys>, Thenable<any>>
		}
		: TObject & {
			[key in keyof TObject]: TRulePathObject<Diff<TObject[key], Thenable<any>>, TValueKeys>
		} & {
			[key in TValueKeys]: TRulePathObject<Diff<TObject, Thenable<any>>, TValueKeys>
		}

export type RuleGetValueFunc<TObject, TValue, TValueKeys extends string | number>
	= (o: TRulePathObject<TObject, TValueKeys>) => TValue

export class RuleBuilder<TObject = any, TValueKeys extends string | number = any> {
	public result: IRule
	private _ruleLast: IRule

	constructor(rule?: IRule) {
		if (rule != null) {
			this.result = rule

			let ruleLast
			do {
				ruleLast = rule
				rule = rule.next
			} while (rule != null)

			this._ruleLast = ruleLast
		}
	}

	public rule<TValue>(rule: IRule): RuleBuilder<TValue> {
		const {_ruleLast: ruleLast} = this

		if (ruleLast) {
			ruleLast.next = rule
		} else {
			this.result = rule
		}

		this._ruleLast = rule

		return this as unknown as RuleBuilder<TValue>
	}

	public ruleSubscribe<TValue>(
		ruleSubscribe: IRuleSubscribe<TObject, TValue>,
		description: string,
	): RuleBuilder<TValue> {
		if (description) {
			ruleSubscribe.description = description
		}

		if (ruleSubscribe.unsubscribers) {
			throw new Error('You should not add duplicate IRuleSubscribe instances. Clone rule before add.')
		}

		// !Warning defineProperty is slow
		// Object.defineProperty(ruleSubscribe, 'unsubscribePropertyName', {
		// 	configurable: true,
		// 	enumerable: false,
		// 	writable: false,
		// 	value: UNSUBSCRIBE_PROPERTY_PREFIX + (nextUnsubscribePropertyId++),
		// })

		ruleSubscribe.unsubscribers = [] // UNSUBSCRIBE_PROPERTY_PREFIX + (nextUnsubscribePropertyId++)

		return this.rule(ruleSubscribe)
	}

	public nothing(): RuleBuilder<TObject> {
		return this.rule<TObject>(new RuleNothing())
	}

	/**
	 * Object property, Array index
	 */
	public valuePropertyName<TValue>(propertyName: string): RuleBuilder<TValue> {
		return this.ruleSubscribe(
			new RuleSubscribeObjectValuePropertyNames(propertyName),
			VALUE_PROPERTY_PREFIX + propertyName,
		)
	}

	/**
	 * Object property, Array index
	 */
	public valuePropertyNames<TValue>(...propertiesNames: string[]): RuleBuilder<TValue> {
		return this.ruleSubscribe(
			new RuleSubscribeObjectValuePropertyNames(...propertiesNames),
			VALUE_PROPERTY_PREFIX + propertiesNames.join('|'),
		)
	}

	/**
	 * Object property, Array index
	 */
	public propertyName<TValue>(propertyName: string): RuleBuilder<TValue> {
		return this.ruleSubscribe(
			new RuleSubscribeObjectPropertyNames(propertyName),
			propertyName,
		)
	}

	/**
	 * Object property, Array index
	 */
	public propertyNames<TValue>(...propertiesNames: string[]): RuleBuilder<TValue> {
		return this.ruleSubscribe(
			new RuleSubscribeObjectPropertyNames(...propertiesNames),
			propertiesNames.join('|'),
		)
	}

	/**
	 * Object property, Array index
	 */
	public propertyAll<TValue>(): RuleBuilder<TValue> {
		return this.ruleSubscribe(
			new RuleSubscribeObjectPropertyNames(),
			ANY_DISPLAY,
		)
	}

	/**
	 * Object property, Array index
	 */
	public propertyPredicate<TValue>(
		predicate: (propertyName: string, object) => boolean,
		description: string,
	): RuleBuilder<TValue> {
		return this.ruleSubscribe(
			new RuleSubscribeObject(SubscribeObjectType.Property, predicate),
			description,
		)
	}

	/**
	 * Object property, Array index
	 */
	public propertyRegexp<TValue>(regexp: RegExp) {
		if (!(regexp instanceof RegExp)) {
			throw new Error(`regexp (${regexp}) is not instance of RegExp`)
		}

		return this.propertyPredicate<TValue>(
			name => regexp.test(name),
			regexp.toString(),
		)
	}

	/**
	 * IListChanged & Iterable, ISetChanged & Iterable, IMapChanged & Iterable, Iterable
	 */
	public collection<TValue>(): RuleBuilder<TValue> {
		return this.ruleSubscribe(
			new RuleSubscribeCollection<any, TValue>(),
			COLLECTION_PREFIX,
		)
	}

	/**
	 * IMapChanged & Map, Map
	 */
	public mapKey<TKey>(key: TKey)
		: RuleBuilder<TObject extends Map<TKey, infer TValue> ? TValue: never>
	public mapKey<TKey, TValue>(key: TKey): RuleBuilder<TValue> {
		return this.ruleSubscribe(
			new RuleSubscribeMapKeys(key),
			COLLECTION_PREFIX + key,
		)
	}

	/**
	 * IMapChanged & Map, Map
	 */
	public mapKeys<TKey, TValue>(...keys: TKey[]): RuleBuilder<TValue> {
		return this.ruleSubscribe(
			new RuleSubscribeMapKeys(...keys),
			COLLECTION_PREFIX + keys.join('|'),
		)
	}

	/**
	 * IMapChanged & Map, Map
	 */
	public mapAll<TValue>(): RuleBuilder<TValue> {
		return this.ruleSubscribe(
			new RuleSubscribeMap() as any,
			COLLECTION_PREFIX,
		)
	}

	/**
	 * IMapChanged & Map, Map
	 */
	public mapPredicate<TKey, TValue>(
		keyPredicate: (key: TKey, object) => boolean,
		description: string,
	): RuleBuilder<TValue> {
		return this.ruleSubscribe(
			new RuleSubscribeMap(keyPredicate) as any,
			description,
		)
	}

	/**
	 * IMapChanged & Map, Map
	 */
	public mapRegexp<TValue>(keyRegexp: RegExp) {
		if (!(keyRegexp instanceof RegExp)) {
			throw new Error(`keyRegexp (${keyRegexp}) is not instance of RegExp`)
		}

		return this.mapPredicate<string | number, TValue>(
			name => keyRegexp.test(name as string),
			keyRegexp.toString(),
		)
	}

	public path<TValue>(getValueFunc: RuleGetValueFunc<TObject, TValue, TValueKeys>): RuleBuilder<TValue> {
		for (const propertyNames of getFuncPropertiesPath(getValueFunc)) {
			if (propertyNames.startsWith(COLLECTION_PREFIX)) {
				const keys = propertyNames.substring(1)
				if (keys === '') {
					this.collection()
				} else {
					this.mapKeys(...keys.split('|'))
				}
			} else if (propertyNames.startsWith(VALUE_PROPERTY_PREFIX)) {
				const valuePropertyNames = propertyNames.substring(1)
				if (valuePropertyNames === '') {
					throw new Error(`You should specify at least one value property name; path = ${getValueFunc}`)
				} else {
					this.valuePropertyNames(...valuePropertyNames.split('|'))
				}
			} else {
				this.propertyNames(...propertyNames.split('|'))
			}
		}

		return this as unknown as RuleBuilder<TValue>
	}

	public any<TValue>(
		...getChilds: Array<(builder: RuleBuilder<TObject>) => RuleBuilder<TValue>>
	): RuleBuilder<TValue> {
		if (getChilds.length === 0) {
			throw new Error('any() parameters is empty')
		}

		const rule = new RuleAny(getChilds.map(o => {
			const subRule = o(new RuleBuilder<TObject>()).result
			if (!subRule) {
				throw new Error(`Any subRule=${rule}`)
			}
			return subRule
		}))

		return this.rule(rule)
	}

	public repeat<TValue>(
		countMin: number,
		countMax: number,
		getChild: (builder: RuleBuilder<TObject>) => RuleBuilder<TValue>,
	): RuleBuilder<TValue> {
		const subRule = getChild(new RuleBuilder<TObject>()).result
		if (!subRule) {
			throw new Error(`getChild(...).rule = ${subRule}`)
		}

		if (countMax == null) {
			countMax = Number.MAX_SAFE_INTEGER
		}

		if (countMin == null) {
			countMin = 0
		}

		if (countMax < countMin || countMax <= 0) {
			return this as unknown as RuleBuilder<TValue>
		}

		let rule: IRule
		if (countMax === countMin && countMax === 1) {
			rule = subRule
		} else {
			rule = new RuleRepeat(
				countMin,
				countMax,
				getChild(new RuleBuilder<TObject>()).result,
			)
		}

		return this.rule(rule)
	}

	public clone() {
		return new RuleBuilder(cloneRule(this.result))
	}
}

export function cloneRule(rule: IRule) {
	if (rule == null) {
		return rule
	}

	const clone = {
		...rule,
	}

	const {unsubscribers, next} = rule as any
	if (unsubscribers != null) {
		(clone as any).unsubscribers = []
	}

	if (next != null) {
		clone.next = cloneRule(next)
	}

	return clone
}
