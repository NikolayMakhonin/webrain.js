import {Thenable} from '../../async/async'
import {Diff} from '../../helpers/typescript'
import {ANY_DISPLAY, COLLECTION_PREFIX, VALUE_PROPERTY_DEFAULT, VALUE_PROPERTY_PREFIX} from './contracts/constants'
import {IRuleSubscribe} from './contracts/rule-subscribe'
import {IRule} from './contracts/rules'
import {getFuncPropertiesPath} from './helpers/func-properties-path'
import {RuleAny, RuleNothing, RuleRepeat} from './rules'
import {RuleSubscribeCollection, RuleSubscribeMap, RuleSubscribeObject, SubscribeObjectType} from './rules-subscribe'

const RuleSubscribeObjectPropertyNames = RuleSubscribeObject.bind(null, SubscribeObjectType.Property, null)
const RuleSubscribeObjectValuePropertyNames = RuleSubscribeObject.bind(null, SubscribeObjectType.ValueProperty, null)
const RuleSubscribeMapKeys = RuleSubscribeMap.bind(null, null)

// const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// let nextUnsubscribePropertyId = 0

export type MapValue<TMap>
	= TMap extends Map<any, infer TValue>
		? Diff<TValue, Thenable>
		: never
export type IterableValue<TIterable>
	= TIterable extends Iterable<infer TValue>
		? Diff<TValue, Thenable>
		: never
export type ObjectAnyValue<TObject>
	= TObject extends { [key in keyof TObject]: infer TValue }
		? Diff<TValue, Thenable>
		: never
export type ObjectValue<TObject, TKeys extends string | number>
	= TObject extends { [key in TKeys]: infer TValue }
		? Diff<TValue, Thenable>
		: never

export type ValuePropertyValue<TObject>
	= TObject extends { [VALUE_PROPERTY_DEFAULT]: infer TValue }
		? Diff<TValue, Thenable>
		: TObject

export type TRulePathObjectExclusive<TObject, TValueKeys extends string | number> =
	TObject extends { [VALUE_PROPERTY_DEFAULT]: infer TValue }
		? ({
			[key in Diff<keyof Diff<TValue, Thenable>, TValueKeys>]
				: TRulePathObjectExclusive<Diff<Diff<TValue, Thenable>[key], Thenable>, TValueKeys>
		} & {
			[key in TValueKeys]: TRulePathObjectExclusive<Diff<TValue, Thenable>, TValueKeys>
		})
		: {
			[key in Diff<keyof TObject, TValueKeys>]: TRulePathObjectExclusive<Diff<TObject[key], Thenable>, TValueKeys>
		} & {
			[key in TValueKeys]: TRulePathObjectExclusive<TObject, TValueKeys>
		}

export type RULE_PATH_OBJECT_VALUE = '46007c49df234a768d312f74c892f0b1'

export type TRulePathObject<TObject, TValueKeys extends string | number> =
	(TObject extends { [VALUE_PROPERTY_DEFAULT]: infer TValue }
		? (Diff<TValue, Thenable> & {
			[key in Diff<keyof Diff<TValue, Thenable>, TValueKeys>]
				: TRulePathObject<Diff<Diff<TValue, Thenable>[key], Thenable>, TValueKeys>
		} & {
			[key in TValueKeys]: TRulePathObject<Diff<TValue, Thenable>, TValueKeys>
		})
		: TObject & {
			[key in Diff<keyof TObject, TValueKeys>]: TRulePathObject<Diff<TObject[key], Thenable>, TValueKeys>
		} & {
			[key in TValueKeys]: TRulePathObject<TObject, TValueKeys>
		}) & {
			[key in RULE_PATH_OBJECT_VALUE]: TObject
		}

export type TRulePathObjectValue<TObject extends TRulePathObject<any, any>>
	= TObject[RULE_PATH_OBJECT_VALUE]

export type RuleGetValueFunc<TObject, TValue, TValueKeys extends string | number>
	= (o: TRulePathObject<TObject, TValueKeys>) => TValue

export class RuleBuilder<TObject = any, TValueKeys extends string | number = never> {
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

	public rule<TValue>(rule: IRule): RuleBuilder<TValue, TValueKeys> {
		const {_ruleLast: ruleLast} = this

		if (ruleLast) {
			ruleLast.next = rule
		} else {
			this.result = rule
		}

		this._ruleLast = rule

		return this as unknown as RuleBuilder<TValue, TValueKeys>
	}

	public ruleSubscribe<TValue>(
		ruleSubscribe: IRuleSubscribe<TObject, TValue>,
		description: string,
	): RuleBuilder<TValue, TValueKeys> {
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

		return this.rule<TValue>(ruleSubscribe)
	}

	public nothing(): RuleBuilder<TObject, TValueKeys> {
		return this.rule<TObject>(new RuleNothing())
	}

	/**
	 * Object property, Array index
	 */
	public valuePropertyName<TValue = ValuePropertyValue<TObject>>(propertyName: string): RuleBuilder<TValue, TValueKeys> {
		return this.ruleSubscribe<TValue>(
			new RuleSubscribeObjectValuePropertyNames(propertyName),
			VALUE_PROPERTY_PREFIX + propertyName,
		)
	}

	/**
	 * Object property, Array index
	 */
	public valuePropertyNames<TValue = ValuePropertyValue<TObject>>(
		...propertiesNames: string[]
	): RuleBuilder<TValue, TValueKeys> {
		return this.ruleSubscribe<TValue>(
			new RuleSubscribeObjectValuePropertyNames(...propertiesNames),
			VALUE_PROPERTY_PREFIX + propertiesNames.join('|'),
		)
	}

	/**
	 * Object property, Array index
	 */
	public propertyName<TKeys extends string | number, TValue = ObjectValue<TObject, TKeys>>(
		propertyName: TKeys,
	): RuleBuilder<TValue, TValueKeys>
	public propertyName<TValue>(propertyName: string): RuleBuilder<TValue, TValueKeys> {
		return this.ruleSubscribe<TValue>(
			new RuleSubscribeObjectPropertyNames(propertyName),
			propertyName,
		)
	}

	/**
	 * Object property, Array index
	 */
	public propertyNames<TKeys extends string | number, TValue = ObjectValue<TObject, TKeys>>(
		...propertiesNames: TKeys[]
	): RuleBuilder<TValue, TValueKeys>
	public propertyNames<TValue>(...propertiesNames: string[]): RuleBuilder<TValue, TValueKeys> {
		return this.ruleSubscribe<TValue>(
			new RuleSubscribeObjectPropertyNames(...propertiesNames),
			propertiesNames.join('|'),
		)
	}

	/**
	 * Object property, Array index
	 */
	public propertyAll<TValue = ObjectAnyValue<TObject>>(): RuleBuilder<TValue, TValueKeys> {
		return this.ruleSubscribe<TValue>(
			new RuleSubscribeObjectPropertyNames(),
			ANY_DISPLAY,
		)
	}

	/**
	 * Object property, Array index
	 */
	public propertyPredicate<TValue = ObjectAnyValue<TObject>>(
		predicate: (propertyName: string, object) => boolean,
		description: string,
	): RuleBuilder<TValue, TValueKeys> {
		return this.ruleSubscribe<TValue>(
			new RuleSubscribeObject(SubscribeObjectType.Property, predicate),
			description,
		)
	}

	/**
	 * Object property, Array index
	 */
	public propertyRegexp<TValue = ObjectAnyValue<TObject>>(regexp: RegExp) {
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
	public collection<TValue = IterableValue<TObject>>(): RuleBuilder<TValue, TValueKeys> {
		return this.ruleSubscribe<TValue>(
			new RuleSubscribeCollection<any, TValue>(),
			COLLECTION_PREFIX,
		)
	}

	/**
	 * IMapChanged & Map, Map
	 */
	public mapKey<TKey, TValue = MapValue<TObject>>(key: TKey): RuleBuilder<TValue, TValueKeys> {
		return this.ruleSubscribe<TValue>(
			new RuleSubscribeMapKeys(key),
			COLLECTION_PREFIX + key,
		)
	}

	/**
	 * IMapChanged & Map, Map
	 */
	public mapKeys<TKey, TValue = MapValue<TObject>>(...keys: TKey[]): RuleBuilder<TValue, TValueKeys> {
		return this.ruleSubscribe<TValue>(
			new RuleSubscribeMapKeys(...keys),
			COLLECTION_PREFIX + keys.join('|'),
		)
	}

	/**
	 * IMapChanged & Map, Map
	 */
	public mapAll<TValue = MapValue<TObject>>(): RuleBuilder<TValue, TValueKeys> {
		return this.ruleSubscribe<TValue>(
			new RuleSubscribeMap() as any,
			COLLECTION_PREFIX,
		)
	}

	/**
	 * IMapChanged & Map, Map
	 */
	public mapPredicate<TKey, TValue = MapValue<TObject>>(
		keyPredicate: (key: TKey, object) => boolean,
		description: string,
	): RuleBuilder<TValue, TValueKeys> {
		return this.ruleSubscribe<TValue>(
			new RuleSubscribeMap(keyPredicate) as any,
			description,
		)
	}

	/**
	 * IMapChanged & Map, Map
	 */
	public mapRegexp<TValue = MapValue<TObject>>(keyRegexp: RegExp) {
		if (!(keyRegexp instanceof RegExp)) {
			throw new Error(`keyRegexp (${keyRegexp}) is not instance of RegExp`)
		}

		return this.mapPredicate<string | number, TValue>(
			name => keyRegexp.test(name as string),
			keyRegexp.toString(),
		)
	}

	public path<TValue>(getValueFunc: RuleGetValueFunc<TObject, TValue, TValueKeys>)
		: RuleBuilder<TRulePathObjectValue<TValue>, TValueKeys>
	{
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

		return this as any
	}

	public any<TValue>(
		...getChilds: Array<(builder: RuleBuilder<TObject, TValueKeys>) => RuleBuilder<TValue, TValueKeys>>
	): RuleBuilder<TValue, TValueKeys> {
		if (getChilds.length === 0) {
			throw new Error('any() parameters is empty')
		}

		const rule = new RuleAny(getChilds.map((o: any) => {
			const subRule = o(new RuleBuilder<TObject, TValueKeys>()).result
			if (!subRule) {
				throw new Error(`Any subRule=${rule}`)
			}
			return subRule
		}))

		return this.rule<TValue>(rule)
	}

	public repeat<TValue>(
		countMin: number,
		countMax: number,
		getChild: (builder: RuleBuilder<TObject, TValueKeys>) => RuleBuilder<TValue, TValueKeys>,
	): RuleBuilder<TValue, TValueKeys> {
		const subRule = getChild(new RuleBuilder<TObject, TValueKeys>()).result
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
			return this as unknown as RuleBuilder<TValue, TValueKeys>
		}

		let rule: IRule
		if (countMax === countMin && countMax === 1) {
			rule = subRule
		} else {
			rule = new RuleRepeat(
				countMin,
				countMax,
				getChild(new RuleBuilder<TObject, TValueKeys>()).result,
			)
		}

		return this.rule<TValue>(rule)
	}

	public clone() {
		return new RuleBuilder<TObject, TValueKeys>(cloneRule(this.result))
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

// Test:
// export const test = new RuleBuilder<{ x: { y: number } }>()
// 	.path(o => o.x.y)
