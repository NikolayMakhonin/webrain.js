import {ANY} from '../../../../../../../main/common/rx/deep-subscribe/contracts/constants'
import {
	IRuleBuilder,
	IRuleFactory,
	IterableValueOf,
	MapValueOf,
	ObjectAnyValueOf,
	ObjectValueOf,
	PropertyValueOf,
} from '../../../../../../../main/common/rx/deep-subscribe/contracts/IRuleBuilder'
import {IRuleSubscribe} from '../../../../../../../main/common/rx/deep-subscribe/contracts/rule-subscribe'
import {
	IRepeatCondition,
	IRule,
	RuleRepeatAction,
} from '../../../../../../../main/common/rx/deep-subscribe/contracts/rules'
import {IArrayTree, iterablesToArrays, treeToSequenceVariants} from '../../../../../../../main/common/test/Variants'

// export interface IRuleBuildersBuilder<TObject = any, TValueKeys extends string | number = never>
// 	extends IRuleBuilder<TObject, TValueKeys>
// {
// 	ruleFactoriesTree: IArrayTree<IRuleFactory<any, any, TValueKeys>>
// }

export type IRuleBuildersBuilder<TObject, TValueKeys> = RuleBuildersBuilder<TObject, TValueKeys>

export type IRulesFactory<TObject, TValue, TValueKeys extends string | number>
	= (builder: IRuleBuildersBuilder<TObject, TValueKeys>) => IRuleBuildersBuilder<TValue, TValueKeys>

type ArrayOrValue<T> = T[]|T

/**
 * Returns an array with arrays of the given size.
 *
 * @param array array to split
 * @param chunkSize Size of every group
 */
function chunkArray<T>(array: T[], chunkSize: number) {
	const arrayLength = array.length
	const chunks = []

	for (let index = 0; index < arrayLength; index += chunkSize) {
		const chunk = array.slice(index, index + chunkSize)
		chunks.push(chunk)
	}

	return chunks
}

export class RuleBuildersBuilder<TObject = any, TValueKeys extends string | number = never>
	// implements IRuleBuildersBuilder<TObject, TValueKeys>
{
	public ruleFactoriesTree: IArrayTree<IRuleFactory<any, any, TValueKeys>> = []
	public ruleFirst: IRule
	public ruleLast: IRule
	public result: () => IRule

	public ruleFactory<TValue>(ruleFactory: IRuleFactory<TObject, TValue, TValueKeys>)
		: RuleBuildersBuilder<TValue, TValueKeys>
	{
		this.ruleFactoriesTree.push(ruleFactory)
		return this as any
	}

	public variants<TValue>(...getVariants: Array<IRulesFactory<TObject, TValue, TValueKeys>>)
		: RuleBuildersBuilder<TValue, TValueKeys>
	{
		if (getVariants.length === 0) {
			return this as any
		}

		if (getVariants.length === 1) {
			getVariants[0](this)
			return this as any
		}

		const variants = getVariants.map(getVariant =>
			getVariant(this.clone(true)).ruleFactoriesTree)

		this.ruleFactoriesTree.push(variants)

		return this as any
	}

	public any<TValue>(...getChilds: Array<IRulesFactory<TObject, TValue, TValueKeys>>)
		: IRuleBuildersBuilder<TValue, TValueKeys>
	{
		const getChildsIndexes = getChilds.map(getChild => {
			getChild(this)
			return this.ruleFactoriesTree.length - 1
		})

		return this.ruleFactory(function any(
			builder: IRuleBuilder<TObject, TValueKeys>,
		): IRuleBuilder<TValue, TValueKeys> {
			const variant = getChildsIndexes
				.map(getChildsIndex => this[getChildsIndex])
			return builder.any(...variant)
		})
	}

	private _if<TValue>(
		...exclusiveConditionRules: Array<[
			((value: TValue) => boolean),
			IRuleFactory<TObject, TValue, TValueKeys>
		] | IRuleFactory<TObject, TValue, TValueKeys>>
	): IRuleBuildersBuilder<TValue, TValueKeys> {
		const conditionRulesIndexes = exclusiveConditionRules.map(conditionRule => {
			if (Array.isArray(conditionRule)) {
				conditionRule[1](this)
			} else {
				conditionRule(this)
			}
			return this.ruleFactoriesTree.length - 1
		})

		return this.ruleFactory(function If(
			builder: IRuleBuilder<TObject, TValueKeys>,
		): IRuleBuilder<TValue, TValueKeys> {
			const variant = exclusiveConditionRules
				.map((conditionRule, index) => {
					if (Array.isArray(conditionRule)) {
						return [conditionRule[0], this[conditionRulesIndexes[index]]]
					} else {
						return this[conditionRulesIndexes[index]]
					}
				})
			return builder.if(...variant)
		})
	}

	public if<TValue>(
		...exclusiveConditionRules: Array<[
			ArrayOrValue<((value: TValue) => boolean)>,
			ArrayOrValue<IRuleFactory<TObject, TValue, TValueKeys>>
		]>
	): IRuleBuildersBuilder<TValue, TValueKeys> {
		const tree = exclusiveConditionRules.flatMap(o => o)
		const variants = iterablesToArrays(treeToSequenceVariants(tree))
		return this.variants(...variants.map(args => {
			const chunkArgs = chunkArray(args, 2).map(o => o[0] ? o : o[1])
			return b => b._if(...chunkArgs)
		}))
	}

	private _repeat<TValue>(
		countMin: number,
		countMax: number,
		condition: IRepeatCondition<TValue>,
		getChild: IRulesFactory<TObject, TValue, TValueKeys>,
	): IRuleBuildersBuilder<TValue, TValueKeys> {
		getChild(this)
		const getChildsIndex = this.ruleFactoriesTree.length - 1

		return this.ruleFactory(function repeat(
			builder: IRuleBuilder<TObject, TValueKeys>,
		): IRuleBuilder<TValue, TValueKeys> {
			const variant = this[getChildsIndex]
			return builder.repeat(countMin, countMax, condition, variant)
		})
	}

	public repeat<TValue>(
		countMin: ArrayOrValue<number>,
		countMax: ArrayOrValue<number>,
		condition: ArrayOrValue<IRepeatCondition<TValue>>,
		getChild: ArrayOrValue<IRuleFactory<TObject, TValue, TValueKeys>>,
	): IRuleBuildersBuilder<TValue, TValueKeys> {
		const variants = iterablesToArrays(treeToSequenceVariants([countMin, countMax, condition, getChild]))
		return this.variants(...variants.map(args => b => b._repeat(...args)))
	}

	public collection<TValue = IterableValueOf<TObject>>(): IRuleBuildersBuilder<TValue, TValueKeys> {
		return this.ruleFactory(function collection(b) { return b.collection() })
	}

	public mapAny<TValue = MapValueOf<TObject>>(): IRuleBuildersBuilder<TValue, TValueKeys> {
		return this.ruleFactory(function mapAny(b) { return b.mapAny() })
	}

	public mapKey<TKey, TValue = MapValueOf<TObject>>(key: ArrayOrValue<TKey>): IRuleBuildersBuilder<TValue, TValueKeys> {
		const variants = iterablesToArrays(treeToSequenceVariants([key]))
		return this.variants(...variants.map(args => bb => bb
			.ruleFactory(function mapKey(b) { return b.mapKey(...args) })))
	}

	public mapKeys<TKey, TValue = MapValueOf<TObject>>(...keys: Array<ArrayOrValue<TKey>>)
		: IRuleBuildersBuilder<TValue, TValueKeys>
	{
		const variants = iterablesToArrays(treeToSequenceVariants(keys))
		return this.variants(...variants.map(args => bb => bb
			.ruleFactory(function mapKeys(b) { return b.mapKeys(...args) })))
	}

	public mapPredicate<TKey, TValue = MapValueOf<TObject>>(
		keyPredicate: ArrayOrValue<(key: TKey, object) => boolean>,
		description: ArrayOrValue<string>,
	): IRuleBuildersBuilder<TValue, TValueKeys> {
		const variants = iterablesToArrays(treeToSequenceVariants([keyPredicate, description]))
		return this.variants(...variants.map(args => bb => bb
			.ruleFactory(function mapPredicate(b) { return b.mapPredicate(...args) })))
	}

	public mapRegexp<TValue = MapValueOf<TObject>>(keyRegexp: ArrayOrValue<RegExp>)
		: IRuleBuildersBuilder<TValue, TValueKeys>
	{
		const variants = iterablesToArrays(treeToSequenceVariants([keyRegexp]))
		return this.variants(...variants.map(args => bb => bb
			.ruleFactory(function mapRegexp(b) { return b.mapRegexp(...args) })))
	}

	public never(): IRuleBuildersBuilder<any, TValueKeys> {
		return this.ruleFactory(function never(b) { return b.never() })
	}

	public nothing(): IRuleBuildersBuilder<TObject, TValueKeys> {
		return this.ruleFactory(function nothing(b) { return b.nothing() })
	}

	// public path<TValue>(getValueFunc: (o: TObject) => TValue): IRuleBuildersBuilder<any, TValueKeys> {
	// 	return this.ruleFactory(function collection(b) { return b.collection() })
	// }

	public propertyAny<TValue = ObjectAnyValueOf<TObject>>(): IRuleBuildersBuilder<TValue, TValueKeys> {
		return this.ruleFactory(function propertyAny(b) { return b.propertyAny() })
	}

	public propertyName<
		TKeys extends keyof TObject,
		TValue = ObjectValueOf<TObject, TKeys>
	>(propertyName: ArrayOrValue<TKeys>): IRuleBuildersBuilder<TValue, TValueKeys>
	public propertyName<TValue>(propertyName: ArrayOrValue<string>): IRuleBuildersBuilder<TValue, TValueKeys>
	public propertyName<TValue>(propName): IRuleBuildersBuilder<TValue, TValueKeys> {
		const variants = iterablesToArrays(treeToSequenceVariants([propName]))
		return this.variants(...variants.map(args => bb => bb
			.ruleFactory(function propertyName(b) { return b.propertyName(...args) })))
	}

	public propertyNames<
		TKeys extends keyof TObject | ANY,
		TValue = ObjectValueOf<TObject, TKeys extends ANY ? any : TKeys>
	>(...propertiesNames: Array<ArrayOrValue<TKeys>>): IRuleBuildersBuilder<TValue, TValueKeys>
	public propertyNames<TValue>(...propertiesNames: Array<ArrayOrValue<string>>): IRuleBuildersBuilder<TValue, TValueKeys>
	public propertyNames<TValue>(...propertiesNames): IRuleBuildersBuilder<TValue, TValueKeys> {
		const variants = iterablesToArrays(treeToSequenceVariants(propertiesNames))
		return this.variants(...variants.map(args => bb => bb
			.ruleFactory(function propertyNames(b) { return b.propertyNames(...args) })))
	}

	public p<
		TKeys extends keyof TObject | ANY,
		TValue = ObjectValueOf<TObject, TKeys extends ANY ? any : TKeys>
	>(...propertiesNames: Array<ArrayOrValue<TKeys>>): IRuleBuildersBuilder<TValue, TValueKeys>
	public p<TValue>(...propertiesNames: Array<ArrayOrValue<string>>): IRuleBuildersBuilder<TValue, TValueKeys>
	public p<TValue>(...propertiesNames): IRuleBuildersBuilder<TValue, TValueKeys> {
		const variants = iterablesToArrays(treeToSequenceVariants(propertiesNames))
		return this.variants(...variants.map(args => bb => bb
			.ruleFactory(function p(b) { return b.p(...args) })))
	}

	public propertyPredicate<TValue = ObjectAnyValueOf<TObject>>(
		predicate: (propertyName: string, object) => boolean,
		description: string,
	): IRuleBuildersBuilder<TValue, TValueKeys> {
		return this.ruleFactory(function collection(b) { return b.collection() })
	}

	public propertyRegexp<TValue = ObjectAnyValueOf<TObject>>(regexp: RegExp): IRuleBuildersBuilder<TValue, TValueKeys> {
		return this.ruleFactory(function collection(b) { return b.collection() })
	}

	public rule<TValue>(rule: IRule): IRuleBuildersBuilder<TValue, TValueKeys> {
		return this.ruleFactory(function collection(b) { return b.collection() })
	}

	public ruleSubscribe<TValue>(ruleSubscribe: IRuleSubscribe<TObject, TValue>, description?: string)
		: IRuleBuildersBuilder<TValue, TValueKeys>
	{
		return this.ruleFactory(function collection(b) { return b.collection() })
	}

	public valuePropertyDefault<TValue>(): IRuleBuildersBuilder<TValue, TValueKeys> {
		return this.ruleFactory(function valuePropertyDefault(b) { return b.valuePropertyDefault() })
	}

	public valuePropertyName<TValue = PropertyValueOf<TObject>>(propertyName: ArrayOrValue<string>)
		: IRuleBuildersBuilder<TValue, TValueKeys>
	{
		const variants = iterablesToArrays(treeToSequenceVariants([propertyName]))
		return this.variants(...variants.map(args => bb => bb
			.ruleFactory(function valuePropertyName(b) { return b.valuePropertyName(...args) })))
	}

	public valuePropertyNames<TValue = PropertyValueOf<TObject>>(...propertiesNames: Array<ArrayOrValue<string>>)
		: IRuleBuildersBuilder<TValue, TValueKeys>
	{
		const variants = iterablesToArrays(treeToSequenceVariants(propertiesNames))
		return this.variants(...variants.map(args => bb => bb
			.ruleFactory(function valuePropertyNames(b) { return b.valuePropertyNames(...args) })))
	}

	public v<TValue = PropertyValueOf<TObject>>(...propertiesNames: Array<ArrayOrValue<string>>)
		: IRuleBuildersBuilder<TValue, TValueKeys>
	{
		const variants = iterablesToArrays(treeToSequenceVariants(propertiesNames))
		return this.variants(...variants.map(args => bb => bb
			.ruleFactory(function v(b) { return b.v(...args) })))
	}

	public clone(optionsOnly?: boolean): IRuleBuildersBuilder<TObject, TValueKeys> {
		const clone = new RuleBuildersBuilder<TObject, TValueKeys>()
		if (!optionsOnly) {
			throw new Error('Not implemented')
			// clone.ruleFactoriesTree = [...this.ruleFactoriesTree]
		}
		return clone
	}
}
