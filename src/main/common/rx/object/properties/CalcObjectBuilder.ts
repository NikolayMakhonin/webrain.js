import {NotFunction} from '../../../helpers/typescript'
import {RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {ObservableObject} from '../ObservableObject'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {CalcProperty} from './CalcProperty'
import {calcPropertyFactory} from './CalcPropertyBuilder'
import {ValueKeys} from './contracts'

export class CalcObjectBuilder<TObject extends ObservableObject, TValueKeys extends string | number = ValueKeys>
	extends ObservableObjectBuilder<TObject>
{
	public calc<
		TValue,
		TInput,
		TMergeSource,
		Name extends string | number
	>(
		name: Name,
		inputOrFactory: ((source: TObject) => TInput) | NotFunction<TInput>,
		calcFactory: (initValue?: TValue) => CalcProperty<TValue, TInput, TMergeSource>,
		initValue?: TValue,
	) {
		return this.readable<CalcProperty<
			TValue,
			TInput,
			TMergeSource
		>, Name>(name, {
			factory(this: TObject) {
				const property = calcFactory(initValue)
				if (property.name == null) {
					property.name = `${this.constructor.name}.${name}`
				}
				return property
			},
			init(property) {
				if (typeof inputOrFactory !== 'undefined') {
					property.input = typeof inputOrFactory === 'function'
						? (inputOrFactory as (object: TObject) => TInput)(this)
						: inputOrFactory
				}
			},
		})
	}

	public calcChanges<
		TInput,
		Name extends string | number
	>(
		name: Name,
		buildRule: (builder: RuleBuilder<TInput, ValueKeys>) => RuleBuilder<any, ValueKeys>,
	) {
		return this.calc<number, TInput, any, Name>(
			name,
			void 0,
			calcPropertyFactory(
				dependencies => dependencies.invalidateOn(buildRule),
				(input, property) => {
					property.value++
				},
				null, null, 0,
			),
		)
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
