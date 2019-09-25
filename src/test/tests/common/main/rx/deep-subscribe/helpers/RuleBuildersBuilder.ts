import {IRuleBuilder, IRuleFactory} from '../../../../../../../main/common/rx/deep-subscribe/contracts/IRuleBuilder'
import {IRule} from '../../../../../../../main/common/rx/deep-subscribe/contracts/rules'
import {RuleBuilder} from '../../../../../../../main/common/rx/deep-subscribe/RuleBuilder'

export interface IRuleBuildersBuilder<TObject = any, TValueKeys extends string | number = never>
	extends IRuleBuilder<TObject, TValueKeys>
{
	ruleBuilders: Array<IRuleBuilder<TObject, TValueKeys>>
}

export class RuleBuildersBuilder<TObject = any, TValueKeys extends string | number = never>
	implements IRuleBuildersBuilder<TObject, TValueKeys>
{
	public ruleBuilders: Array<IRuleBuilder<TObject, TValueKeys>>

	public variants<TValue>(...getVariants: Array<IRuleFactory<TObject, TValue, TValueKeys>>)
		: RuleBuilder<TValue, TValueKeys>
	{
		this.ruleBuilders = this.ruleBuilders.flatMap(b => getVariants.map(getVariant => getVariant(b)))
		return this
	}

	public any<TValue>(...getChilds: Array<IRuleFactory<TObject, TValue, TValueKeys>>)
		: RuleBuilder<TValue, TValueKeys>
	{
		return undefined
	}

	public clone(optionsOnly?: boolean): RuleBuilder<TObject, TValueKeys> {
		return undefined
	}

	public collection<TValue = IterableValueOf<TObject>>(): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public if<TValue>(...exclusiveConditionRules: Array<[((value: TValue) => boolean), IRuleFactory<TObject, TValue, TValueKeys>] | IRuleFactory<TObject, TValue, TValueKeys>>): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public mapAny<TValue = MapValueOf<TObject>>(): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public mapKey<TKey, TValue = MapValueOf<TObject>>(key: TKey): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public mapKeys<TKey, TValue = MapValueOf<TObject>>(...keys: TKey[]): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public mapPredicate<TKey, TValue = MapValueOf<TObject>>(keyPredicate: (key: TKey, object) => boolean, description: string): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public mapRegexp<TValue = MapValueOf<TObject>>(keyRegexp: RegExp): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public never(): RuleBuilder<any, TValueKeys> {
		return undefined
	}

	public nothing(): RuleBuilder<TObject, TValueKeys> {
		return undefined
	}

	public p<TKeys extends keyof TObject | ANY, TValue = ObjectValueOf<TObject, TKeys extends ANY ? any : TKeys>>(...propertiesNames: TKeys[]): RuleBuilder<TValue, TValueKeys>
	public p<TValue>(...propertiesNames: string[]): RuleBuilder<TValue, TValueKeys>
	public p(...propertiesNames): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public path<TValue>(getValueFunc: <TObject>(o: TObject) => TValue): RuleBuilder<any, TValueKeys> {
		return undefined
	}

	public propertyAny<TValue = ObjectAnyValueOf<TObject>>(): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public propertyName<TKeys extends keyof TObject, TValue = ObjectValueOf<TObject, TKeys>>(propertyName: TKeys): RuleBuilder<TValue, TValueKeys>
	public propertyName<TValue>(propertyName: string): RuleBuilder<TValue, TValueKeys>
	public propertyName(propertyName): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public propertyNames<TKeys extends keyof TObject | ANY, TValue = ObjectValueOf<TObject, TKeys extends ANY ? any : TKeys>>(...propertiesNames: TKeys[]): RuleBuilder<TValue, TValueKeys>
	public propertyNames<TValue>(...propertiesNames: string[]): RuleBuilder<TValue, TValueKeys>
	public propertyNames(...propertiesNames): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public propertyPredicate<TValue = ObjectAnyValueOf<TObject>>(predicate: (propertyName: string, object) => boolean, description: string): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public propertyRegexp<TValue = ObjectAnyValueOf<TObject>>(regexp: RegExp): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public repeat<TValue>(countMin: number, countMax: number, condition: (value: TValue, index: number) => RuleRepeatAction, getChild: <TObject, TValueKeys>(builder: RuleBuilder<TObject, TValueKeys>) => RuleBuilder<TValue, TValueKeys>): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public result(): IRule {
		return undefined
	}

	public rule<TValue>(rule: IRule): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public ruleSubscribe<TValue>(ruleSubscribe: IRuleSubscribe<TObject, TValue>, description?: string): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public v<TValue = PropertyValueOf<TObject>>(...propertiesNames: string[]): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public valuePropertyDefault<TValue>(): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public valuePropertyName<TValue = PropertyValueOf<TObject>>(propertyName: string): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

	public valuePropertyNames<TValue = PropertyValueOf<TObject>>(...propertiesNames: string[]): RuleBuilder<TValue, TValueKeys> {
		return undefined
	}

}
