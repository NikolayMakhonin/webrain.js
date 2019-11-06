import {NotFunction} from '../../../helpers/typescript'
import {RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {ObservableClass} from '../ObservableClass'
import {IWritableFieldOptions, ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {CalcProperty} from './CalcProperty'
import {calcPropertyFactory} from './CalcPropertyBuilder'
import {Connector} from './Connector'
import {ConnectorBuilder, connectorFactory} from './ConnectorBuilder'
import {ValueKeys} from './contracts'

export class CalcObjectBuilder<TObject extends ObservableClass, TValueKeys extends string | number = ValueKeys>
	extends ConnectorBuilder<TObject, TObject>
{
	public calc<
		TInput,
		Name extends keyof TObject,
	>(
		name: Name,
		inputOrFactory: ((source: TObject, name?: string) => TInput) | NotFunction<TInput>,
		calcFactory: (initValue?: TObject[Name]) => CalcProperty<TObject[Name], TInput>,
		initValue?: TObject[Name],
	) {
		return this.readable<Extract<Name, string|number>, CalcProperty<
			TObject[Name],
			TInput
		>>(name as Extract<Name, string|number>, {
			factory(this: TObject) {
				const property = calcFactory(initValue)
				if (property.state.name == null) {
					property.state.name = `${this.constructor.name}.${name}`
				}
				return property
			},
			init(property) {
				if (typeof inputOrFactory !== 'undefined') {
					property.state.input = typeof inputOrFactory === 'function'
						? (inputOrFactory as (object: TObject, name?: string) => TInput)(this, this.constructor.name)
						: inputOrFactory
				}
			},
		})
	}

	public calcChanges<
		TInput,
		Name extends keyof TObject,
	>(
		name: Name,
		buildRule: (builder: RuleBuilder<TInput, ValueKeys>) => RuleBuilder<any, ValueKeys>,
	) {
		return this.calc<TInput, Name>(
			name,
			void 0,
			calcPropertyFactory({
				dependencies: dependencies => dependencies.invalidateOn(buildRule),
				calcFunc(state) {
					state.value++
				},
				initValue: 0 as any,
			}),
		)
	}

	// @ts-ignore
	public connect<
		Name extends keyof TObject,
	>(
		name: Name,
		buildRule: (builder: RuleBuilder<TObject, ValueKeys>) => RuleBuilder<TObject[Name], ValueKeys>,
		options?: IWritableFieldOptions<TObject, TObject[Name]>,
		initValue?: TObject[Name],
	) {
		return this.calc<
			Connector<TObject> & { readonly value: TObject[Name] },
			Name
		>(
			name,
			connectorFactory({
				buildRule: c => c
					.connect('value', buildRule),
			}),
			calcPropertyFactory({
				dependencies: d => d.invalidateOn(b => b.p('value')),
				calcFunc(state) {
					state.value = state.input.value
				},
			}),
		)
	}
}

// const builder = new CalcObjectBuilder(true as any)
//
// export function calc<
// 	TObject extends ObservableClass,
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

// class Class1 extends ObservableClass {
// }
// class Class extends Class1 {
// 	@calc()
// 	public prop: number
// }
