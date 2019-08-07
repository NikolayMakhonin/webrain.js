import {ANY_DISPLAY, COLLECTION_PREFIX} from './contracts/constants'
import {IRuleSubscribe} from './contracts/rule-subscribe'
import {IRule, IRuleAny, IRuleRepeat, RuleType} from './contracts/rules'
import {getFuncPropertiesPath} from './helpers/func-properties-path'
import {RuleSubscribeCollection, RuleSubscribeMap, RuleSubscribeObject} from './RuleSubscribe'

const RuleSubscribeObjectPropertyNames = RuleSubscribeObject.bind(null, null)
const RuleSubscribeMapKeys = RuleSubscribeMap.bind(null, null)

const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
let nextUnsubscribePropertyId = 0

export class RuleBuilder<TObject> {
	public rule: IRule
	private _ruleLast: IRule

	public custom<TValue>(
		ruleSubscribe: IRuleSubscribe<TObject, TValue>,
		description: string,
	): RuleBuilder<TValue> {
		const {_ruleLast: ruleLast} = this

		if (description) {
			ruleSubscribe.description = description
		}

		if (ruleSubscribe.unsubscribePropertyName) {
			throw new Error('You should not add duplicate IRuleSubscribe instances. Clone rule before add.')
		}

		// !Warning defineProperty is slow
		// Object.defineProperty(ruleSubscribe, 'unsubscribePropertyName', {
		// 	configurable: true,
		// 	enumerable: false,
		// 	writable: false,
		// 	value: UNSUBSCRIBE_PROPERTY_PREFIX + (nextUnsubscribePropertyId++),
		// })

		ruleSubscribe.unsubscribePropertyName = [] // UNSUBSCRIBE_PROPERTY_PREFIX + (nextUnsubscribePropertyId++)

		if (ruleLast) {
			ruleLast.next = ruleSubscribe
		} else {
			this.rule = ruleSubscribe
		}

		this._ruleLast = ruleSubscribe

		return this as unknown as RuleBuilder<TValue>
	}

	/**
	 * Object property, Array index
	 */
	public propertyName<TValue>(propertyName: string): RuleBuilder<TValue> {
		return this.custom(
			new RuleSubscribeObjectPropertyNames(propertyName),
			propertyName,
		)
	}

	/**
	 * Object property, Array index
	 */
	public propertyNames<TValue>(...propertiesNames: string[]): RuleBuilder<TValue> {
		return this.custom(
			new RuleSubscribeObjectPropertyNames(...propertiesNames),
			propertiesNames.join('|'),
		)
	}

	/**
	 * Object property, Array index
	 */
	public propertyAll<TValue>(): RuleBuilder<TValue> {
		return this.custom(
			new RuleSubscribeObject(),
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
		return this.custom(
			new RuleSubscribeObject(predicate),
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
		return this.custom(
			new RuleSubscribeCollection<any, TValue>(),
			COLLECTION_PREFIX,
		)
	}

	/**
	 * IMapChanged & Map, Map
	 */
	public mapKey<TKey, TValue>(key: TKey): RuleBuilder<TValue> {
		return this.custom(
			new RuleSubscribeMapKeys(key),
			COLLECTION_PREFIX + key,
		)
	}

	/**
	 * IMapChanged & Map, Map
	 */
	public mapKeys<TKey, TValue>(...keys: TKey[]): RuleBuilder<TValue> {
		return this.custom(
			new RuleSubscribeMapKeys(...keys),
			COLLECTION_PREFIX + keys.join('|'),
		)
	}

	/**
	 * IMapChanged & Map, Map
	 */
	public mapAll<TValue>(): RuleBuilder<TValue> {
		return this.custom(
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
		return this.custom(
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

	public path<TValue>(getValueFunc: (o: TObject) => TValue): RuleBuilder<TValue> {
		for (const propertyNames of getFuncPropertiesPath(getValueFunc)) {
			if (!propertyNames.startsWith(COLLECTION_PREFIX)) {
				this.propertyNames(...propertyNames.split('|'))
			} else {
				const keys = propertyNames.substring(1)
				if (keys === '') {
					this.collection()
				} else {
					this.mapKeys(...keys.split('|'))
				}
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

		const {_ruleLast: ruleLast} = this

		const rule: IRuleAny = {
			type: RuleType.Any,
			rules: getChilds.map(o => {
				const subRule = o(new RuleBuilder<TObject>()).rule
				if (!subRule) {
					throw new Error(`Any subRule=${rule}`)
				}
				return subRule
			}),
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
		const subRule = getChild(new RuleBuilder<TObject>()).rule
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
			rule = {
				type: RuleType.Repeat,
				countMin,
				countMax,
				rule: getChild(new RuleBuilder<TObject>()).rule,
			} as IRuleRepeat
		}

		const {_ruleLast: ruleLast} = this

		if (ruleLast) {
			ruleLast.next = rule
		} else {
			this.rule = rule
		}

		this._ruleLast = rule

		return this as unknown as RuleBuilder<TValue>
	}
}
