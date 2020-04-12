import {VALUE_PROPERTY_DEFAULT} from '../../../helpers/value-property'
import {ObservableClass} from '../ObservableClass'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {CalcObjectBuilder} from './CalcObjectBuilder'
import {TGetNextPathGetSet} from './path/builder'

export type Class<
	TArgs extends any[],
	TClass
> = new(...args: TArgs) => TClass

export function observableClass<
	TConstructorArgs extends any[],
	TPropertyClass extends TBaseClass,
	TBaseClass extends ObservableClass = ObservableClass,
>(
	buildRule: (builder: CalcObjectBuilder<TBaseClass>) => { object: TPropertyClass },
	baseClass?: Class<TConstructorArgs, TBaseClass>,
	connectPath: TGetNextPathGetSet<TObject, TObject, TCommonValue>,
	calcPath: TGetNextPathGetSet<TObject, TObject, TCommonValue>,
): Class<TConstructorArgs, TPropertyClass> {
	// @ts-ignore
	class NewPropertyClass extends (baseClass == null ? null : ObservableClass) { }

	// @ts-ignore
	buildRule(new CalcObjectBuilder<NewPropertyClass>(
		NewPropertyClass.prototype,
	))

	return NewPropertyClass as any
}

// region PropertyClass

export class PropertyClass<TObject> extends ObservableClass {
	public $object: TObject
	constructor(object: TObject) {
		super()
		this.$object = object
	}
}

new ObservableObjectBuilder(PropertyClass.prototype)
	.writable('$object')

export function propertyClass<
	TObject,
	TPropertyClass extends TBaseClass,
	TBaseClass extends PropertyClass<TObject> = PropertyClass<TObject>,
>(
	build: (builder: CalcObjectBuilder<TBaseClass>) => { object: TPropertyClass },
	baseClass?: Class<[TObject], TBaseClass>,
) {
	return observableClass<
		[TObject],
		TPropertyClass,
		TBaseClass
	>(
		build,
		baseClass == null ? null : PropertyClass as any,
	)
}

// endregion

// region CalcPropertyClass

export class CalcPropertyClass<TInput, TValue> extends ObservableClass {
	public input: TInput
	constructor(input: TInput) {
		super()
		this.input = input
	}

	public [VALUE_PROPERTY_DEFAULT]: TValue
}

new ObservableObjectBuilder(CalcPropertyClass.prototype)
	.writable('input')

export function calcPropertyClass<
	TInput,
	TValue,
	TCalcPropertyClass extends TBaseClass,
	TBaseClass extends CalcPropertyClass<TInput, TValue> = CalcPropertyClass<TInput, TValue>,
>(
	build: (builder: CalcObjectBuilder<TBaseClass>) => { object: TCalcPropertyClass },
	baseClass?: Class<[TInput], TBaseClass>,
) {
	return observableClass<
		[TInput],
		TCalcPropertyClass,
		TBaseClass
	>(
		build,
		baseClass == null ? null : CalcPropertyClass as any,
	)
}

// endregion
