import {deepSubscribe} from '../../deep-subscribe/deep-subscribe'
import {RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {ObservableObject} from '../ObservableObject'
import {IWritableFieldOptions, ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {CalcProperty, CalcPropertyFunc} from './CalcProperty'
import {ValueKeys} from './contracts'
import {IPropertyOptions} from './property'

export interface ICalcPropertyOptions<
	TObject,
	TInput,
	TValue,
	TMergeSource,
	TValueKeys extends string | number
> extends IWritableFieldOptions {
	dependencies: (inputRuleBuilder: RuleBuilder<TInput, TValueKeys>) => void,
	calcFunc: CalcPropertyFunc<TInput, TValue, TMergeSource>,
	calcOptions?: IDeferredCalcOptions,
	valuePropertyOptions?: IPropertyOptions<TValue, TMergeSource>,
}

export class CalcObjectBuilder<TObject extends ObservableObject, TValueKeys extends string | number = ValueKeys>
	extends ObservableObjectBuilder<TObject>
{
	public calc<
		TInput,
		TValue,
		Name extends string | number,
		TMergeSource
	>(
		name: Name,
		input: ((object: TObject) => TInput) | (TInput extends (() => void) ? never : TInput),
		{
			dependencies,
			calcFunc,
			calcOptions,
			valuePropertyOptions,
		}: ICalcPropertyOptions<
			TObject,
			TInput,
			TValue,
			TMergeSource,
			TValueKeys
		>,
		initValue?: TValue,
	) {
		return this.readable<CalcProperty<
			TInput,
			TValue,
			TMergeSource
		>, Name>(name, {
			factory(this: TObject) {
				const property = new CalcProperty(calcFunc, calcOptions, valuePropertyOptions, initValue)
				property.input = typeof input === 'function'
					? (input as (object: TObject) => TInput)(this)
					: input

				if (dependencies) {
					deepSubscribe(property, () => {
						property.invalidate()
						return null
					}, false, (b: any) => {
						dependencies(b.path(o => o.input))
						return b
					})
				}

				return property
			},
		})
	}
}

// const builder = new CalcObjectBuilder(true as any)
//
// export function calc<
// 	TObject extends ObservableObject,
// 	TInput extends new (object: TObject) => any | NotFunction<any>,
// 	TValue = any,
// 	TMergeSource = any
// >(
// 	options?: IConnectPropertyOptions<TObject, TInput, TValue, TMergeSource>,
// 	initValue?: TValue,
// ) {
// 	return (target: TObject, propertyKey: string) => {
// 		builder.object = target
// 		builder.calc(propertyKey, options, initValue)
// 	}
// }

// class Class1 extends ObservableObject {
// }
// class Class extends Class1 {
// 	@calc()
// 	public prop: number
// }
