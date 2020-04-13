import {ThenableOrIteratorOrValue} from '../../../async/async'
import {Class} from '../../../helpers/typescript'
import {VALUE_PROPERTY_DEFAULT} from '../../../helpers/value-property'
import {depend, dependX} from '../../../rx/depend/core/depend'
import {CallState} from '../../depend/core/CallState'
import {IDeferredOptions} from '../../depend/core/contracts'
import {makeDependPropertySubscriber} from '../helpers'
import {ObservableClass} from '../ObservableClass'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {CalcObjectBuilder} from './CalcObjectBuilder'
import {ValueKeys} from './contracts'
import {Path, TGetNextPathGetSet} from './path/builder'

function createGetValue<TObject, TCalcSource, TValue>(
	calcSourcePath: Path<TObject, TCalcSource>,
	getValue: (this: TCalcSource) => TValue,
): (this: TObject) => TValue {
	if (calcSourcePath == null) {
		return getValue as any
	} else {
		const path = calcSourcePath
			.clone()
			.append(o => getValue.call(o) as TValue)
			.init()

		return function(this: TObject) {
			return path.get(this) as TValue
		}
	}
}

export class DependCalcObjectBuilder<
	TObject extends ObservableClass,
	TConnectorSource = TObject,
	TCalcSource = TObject,
	TValueKeys extends string | number = ValueKeys,
>
	extends CalcObjectBuilder<TObject, TConnectorSource>
{
	public readonly calcSourcePath?: Path<TObject, TCalcSource>

	constructor(
		object?: TObject,
		connectorSourcePath?: Path<TObject, TConnectorSource>,
		calcSourcePath?: Path<TObject, TCalcSource>,
	) {
		super(object, connectorSourcePath)
		this.calcSourcePath = calcSourcePath
	}

	public simpleCalc<
		Name extends keyof TObject,
	>(
		name: Name,
		func: (this: TCalcSource)
			=> ThenableOrIteratorOrValue<TObject[Name]>,
	): this & { object: { readonly [newProp in Name]: TObject[Name] } } {
		return super.readable(name as any, {
			getValue: createGetValue(this.calcSourcePath, func),
		}) as any
	}

	public dependCalc<
		Name extends keyof TObject,
	>(
		name: Name,
		func: (this: TCalcSource)
			=> ThenableOrIteratorOrValue<TObject[Name]>,
		deferredOptions?: IDeferredOptions,
	): this & { object: { readonly [newProp in Name]: TObject[Name] } } {
		return super.readable(name as any, {
			getValue: depend(
				createGetValue(this.calcSourcePath, func),
				deferredOptions,
				makeDependPropertySubscriber(name as any),
			),
		}) as any
	}

	public dependCalcX<
		Name extends keyof TObject,
	>(
		name: Name,
		func: (this: CallState<TObject, any[], TObject[Name]>)
			=> ThenableOrIteratorOrValue<TObject[Name]>,
		deferredOptions?: IDeferredOptions,
	): this & { object: { readonly [newProp in Name]: TObject[Name] } } {
		return super.readable(name as any, {
			getValue: dependX(
				func,
				deferredOptions,
				makeDependPropertySubscriber(name as any),
			),
		}) as any
	}

	public nested<
		Name extends keyof TObject,
		TPropertyClass extends PropertyClass<TObject>,
	>(
		name: Name,
		build: (builder: DependCalcObjectBuilder<PropertyClass<TObject>, TObject>)
			=> { object: TPropertyClass },
	): this & { object: { readonly [newProp in Name]: TObject[Name] } } {
		const propClass = propertyClass(build)
		return super.readable(name as any, {
			factory() {
				return new propClass(this)
			},
		}) as any
	}

	public nestedCalc<
		Name extends keyof TObject,
		TConnector extends PropertyClass<TObject>
	>(
		name: Name,
		build: (builder: DependCalcObjectBuilder<PropertyClass<TObject>, TObject>)
			=> { object: TConnector },
		func: (this: TConnector)
			=> ThenableOrIteratorOrValue<TObject[Name]>,
		deferredOptions?: IDeferredOptions,
	): this & { object: { readonly [newProp in Name]: TObject[Name] } } {
		const inputClass = propertyClass(build)
		const propClass = calcPropertyClass(func, deferredOptions)
		return super.readable(name as any, {
			factory() {
				return new propClass(new inputClass(this))
			},
		}) as any
	}

	public nestedCalcX<
		Name extends keyof TObject,
		TConnector extends PropertyClass<TObject>
	>(
		name: Name,
		build: (builder: DependCalcObjectBuilder<PropertyClass<TObject>, TObject>)
			=> { object: TConnector },
		func: (this: CallState<CalcPropertyClass<TConnector, TObject[Name]>, any[], TObject[Name]>)
			=> ThenableOrIteratorOrValue<TObject[Name]>,
		deferredOptions?: IDeferredOptions,
	): this & { object: { readonly [newProp in Name]: TObject[Name] } } {
		const inputClass = propertyClass(build)
		const propClass = calcPropertyClassX(func, deferredOptions)
		return super.readable(name as any, {
			factory() {
				return new propClass(new inputClass(this))
			},
		}) as any
	}
}

// region observableClass

export function observableClass<
	TConstructorArgs extends any[],
	TPropertyClass extends TBaseClass,
	TBaseClass extends ObservableClass = ObservableClass,
	TConnectSource = TPropertyClass,
	TCalcSource = TPropertyClass,
>(
	build: (builder: DependCalcObjectBuilder<TBaseClass, TConnectSource, TCalcSource>)
		=> { object: TPropertyClass },
	baseClass?: Class<TConstructorArgs, TBaseClass>,
	connectPath?: TGetNextPathGetSet<TBaseClass, TBaseClass, TConnectSource>,
	calcPath?: TGetNextPathGetSet<TBaseClass, TBaseClass, TCalcSource>,
): Class<TConstructorArgs, TPropertyClass> {
	// @ts-ignore
	class NewPropertyClass extends (baseClass != null ? baseClass : ObservableClass) { }

	// @ts-ignore
	build(new DependCalcObjectBuilder<
		NewPropertyClass,
		TConnectSource,
		TCalcSource
	>(
		NewPropertyClass.prototype,
		connectPath == null ? null : connectPath(Path.build<TBaseClass, TBaseClass>())() as any,
		calcPath == null ? null : calcPath(Path.build<TBaseClass, TBaseClass>())() as any,
	))

	return NewPropertyClass as any
}

// endregion

// region PropertyClass

export class PropertyClass<TObject> extends ObservableClass {
	/** @internal */
	public $object: TObject
	constructor(object: TObject) {
		super();
		(this as any).$object = object
	}
}

new ObservableObjectBuilder(PropertyClass.prototype)
	.writable('$object', {
		hidden: true,
	})

export function propertyClass<
	TObject,
	TPropertyClass extends TBaseClass,
	TBaseClass extends PropertyClass<TObject> = PropertyClass<TObject>,
>(
	build: (builder: DependCalcObjectBuilder<TBaseClass, TObject>) => { object: TPropertyClass },
	baseClass?: Class<[TObject], TBaseClass>,
) {
	return observableClass<
		[TObject],
		TPropertyClass,
		TBaseClass,
		TObject,
		TPropertyClass
	>(
		build,
		baseClass != null ? baseClass : PropertyClass as any,
		b => b(o => o.$object) as any,
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

export function calcPropertyClassX<
	TInput,
	TValue,
	TCalcPropertyClass extends CalcPropertyClass<TInput, TValue> = CalcPropertyClass<TInput, TValue>,
>(
	func: (this: CallState<TCalcPropertyClass, any[], TValue>)
		=> ThenableOrIteratorOrValue<TValue>,
	deferredOptions?: IDeferredOptions,
	baseClass?: Class<[TInput], TCalcPropertyClass>,
) {
	return observableClass<
		[TInput],
		TCalcPropertyClass,
		TCalcPropertyClass
	>(
		b => b.dependCalcX(VALUE_PROPERTY_DEFAULT, func, deferredOptions) as any,
		baseClass != null ? baseClass : CalcPropertyClass as any,
	)
}

export function calcPropertyClass<
	TInput,
	TValue,
	TCalcPropertyClass extends CalcPropertyClass<TInput, TValue>
		= CalcPropertyClass<TInput, TValue>,
>(
	func: (this: TInput) => ThenableOrIteratorOrValue<TValue>,
	deferredOptions?: IDeferredOptions,
	baseClass?: Class<[TInput], TCalcPropertyClass>,
) {
	return observableClass<
		[TInput],
		TCalcPropertyClass,
		TCalcPropertyClass,
		TInput,
		TInput
	>(
		b => b.dependCalc(VALUE_PROPERTY_DEFAULT, func, deferredOptions) as any,
		baseClass != null ? baseClass : CalcPropertyClass as any,
		b => b(o => o.input as any, true),
		b => b(o => o.input as any, true),
	)
}

// endregion
