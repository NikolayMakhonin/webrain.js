import {NotFunction} from '../../../helpers/typescript'
import {deepSubscribe, deepSubscribeRule} from '../../deep-subscribe/deep-subscribe'
import {RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {ObservableObject} from '../ObservableObject'
import {IWritableFieldOptions, ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {CalcProperty, CalcPropertyFunc} from './CalcProperty'
import {IPropertyOptions} from './property'

export interface IConnectPropertyOptions<
	TObject,
	TInput extends new (object: TObject) => any | NotFunction<any>,
	TValue,
	TMergeSource
> extends IWritableFieldOptions {
	input: TInput,
	dependencies: (inputRuleBuilder: RuleBuilder<TInput>) => void,
	calcFunc: CalcPropertyFunc<TInput, TValue, TMergeSource>,
	calcOptions: IDeferredCalcOptions,
	valuePropertyOptions?: IPropertyOptions<TValue, TMergeSource>,
}

export class CalcObjectBuilder<TObject extends ObservableObject>
	extends ObservableObjectBuilder<TObject>
{
	public calc<
		TInput extends new (object: TObject) => any | NotFunction<any>,
		TValue,
		TMergeSource
	>(
		name: string | number,
		{
			input,
			dependencies,
			calcFunc,
			calcOptions,
			valuePropertyOptions,
		}: IConnectPropertyOptions<TObject, TInput, TValue, TMergeSource>,
		initValue?: TValue,
	): this {
		return this.readable<CalcProperty<TInput, TValue, TMergeSource>>(name, {
			factory(this: TObject) {
				const property = new CalcProperty(calcFunc, calcOptions, valuePropertyOptions, initValue)
				property.input = typeof input === 'function'
					? new input(this)
					: input

				if (dependencies) {
					deepSubscribe(property, () => {
						property.invalidate()
						return null
					}, false, b => {
						dependencies(b.path(o => o.input))
						return b
					})
				}

				return property
			},
		})
	}
}
