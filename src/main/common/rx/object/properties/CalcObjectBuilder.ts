import {IteratorOrValue, ThenableOrIteratorOrValue} from '../../../async/async'
import {FuncAny, NotFunc, TClass} from '../../../helpers/typescript'
import {VALUE_PROPERTY_DEFAULT} from '../../../helpers/value-property'
import {depend, dependX} from '../../../rx/depend/core/depend'
import {CallState} from '../../depend/core/CallState'
import {IDeferredOptions} from '../../depend/core/contracts'
import {makeDependPropertySubscriber} from '../helpers'
import {ObservableClass} from '../ObservableClass'
import {IReadableFieldOptions, IWritableFieldOptions, ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {ConnectorBuilder} from './ConnectorBuilder'
import {ValueKeys} from './contracts'
import {observableClass} from './helpers'
import {Path} from './path/builder'

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

export class CalcObjectBuilder<
	TObject extends ObservableClass,
	TConnectorSource = TObject,
	TCalcSource = TObject,
	TValueKeys extends string | number = ValueKeys,
>
	extends ConnectorBuilder<TObject, TConnectorSource>
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

	// @ts-ignore
	public func<
		Name extends keyof TObject,
		TValue = TObject[Name] & FuncAny,
	>(
		name: Name,
		func: TValue,
	): this {
		return super.func(name as any, func)
	}

	// @ts-ignore
	public writable<
		Name extends keyof TObject,
	>(
		name: Name,
		options?: IWritableFieldOptions<TObject, TObject[Name]>,
		initValue?: TObject[Name],
	): this {
		return super.writable(name as any, options, initValue)
	}

	// @ts-ignore
	public readable<
		Name extends keyof TObject,
	>(
		name: Name,
		options?: IReadableFieldOptions<TObject, TObject[Name]>,
		initValue?: TObject[Name],
	): this {
		return super.readable(name as any, options, initValue)
	}

	public calcSimple<
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

	public calc<
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

	public calcX<
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
		build: (builder: CalcObjectBuilder<PropertyClass<TObject>, TObject>)
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
		TInput,
		Name extends keyof TObject,
	>(
		name: Name,
		inputOrFactory: ((source: TObject, name?: string) => TInput) | NotFunc<TInput>,
		calcFactory: (input: TInput, name?: string) => CalcPropertyClass<TObject[Name], TInput>,
	): this { // & { object: { readonly [newProp in Name]: TObject[Name] } } {
		return (this as ObservableObjectBuilder<TObject>)
			.readable<
				Extract<Name, string|number>,
				CalcPropertyClass<TObject[Name], TInput>
			>(name as Extract<Name, string|number>, {
				factory(this: TObject) {
					let input: TInput
					if (typeof inputOrFactory !== 'undefined') {
						input = typeof inputOrFactory === 'function'
							? (inputOrFactory as (object: TObject, name?: string) => TInput)(
								this,
								name as any != null ? name as any : this.constructor.name,
							)
							: inputOrFactory
					}
					return calcFactory(input, `${this.constructor.name}.${name}`)
				},
			}) as any
	}

	// public nestedCalc<
	// 	Name extends keyof TObject,
	// 	TConnector extends PropertyClass<TObject>
	// >(
	// 	name: Name,
	// 	build: (builder: DependCalcObjectBuilder<PropertyClass<TObject>, TObject>)
	// 		=> { object: TConnector },
	// 	func: (this: TConnector)
	// 		=> ThenableOrIteratorOrValue<TObject[Name]>,
	// 	deferredOptions?: IDeferredOptions,
	// ): this { // & { object: { readonly [newProp in Name]: TObject[Name] } } {
	// 	const inputClass = propertyClass(build)
	// 	const propClass = calcPropertyClass(func, deferredOptions)
	// 	return super.readable(name as any, {
	// 		factory() {
	// 			return new propClass(new inputClass(this))
	// 		},
	// 	}) as any
	// }
	//
	// public nestedCalcX<
	// 	Name extends keyof TObject,
	// 	TConnector extends PropertyClass<TObject>
	// >(
	// 	name: Name,
	// 	build: (builder: DependCalcObjectBuilder<PropertyClass<TObject>, TObject>)
	// 		=> { object: TConnector },
	// 	func: (this: CallState<CalcPropertyClass<TObject[Name], TConnector>, any[], TObject[Name]>)
	// 		=> ThenableOrIteratorOrValue<TObject[Name]>,
	// 	deferredOptions?: IDeferredOptions,
	// ): this & { object: { readonly [newProp in Name]: TObject[Name] } } {
	// 	const inputClass = propertyClass(build)
	// 	const propClass = calcPropertyClassX(func, deferredOptions)
	// 	return super.readable(name as any, {
	// 		factory() {
	// 			return new propClass(new inputClass(this))
	// 		},
	// 	}) as any
	// }
}

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
	build: (builder: CalcObjectBuilder<TBaseClass, TObject>) => { object: TPropertyClass },
	baseClass?: TClass<[TObject], TBaseClass>,
) {
	const objectPath = new Path<TBaseClass>().f(o => o.$object).init()

	return observableClass<
		[TObject, string?],
		TBaseClass,
		TPropertyClass
	>(
		object => build(new CalcObjectBuilder<TBaseClass, TObject>(object, objectPath as any)).object,
		baseClass != null ? baseClass : PropertyClass as any,
	)
}

// endregion

// region CalcPropertyClass

export class CalcPropertyClass<TValue, TInput> extends ObservableClass {
	public input: TInput
	public readonly name: string

	constructor(input: TInput, name?: string) {
		super()
		this.input = input
		this.name = name
	}

	public [VALUE_PROPERTY_DEFAULT]: TValue
}

new ObservableObjectBuilder(CalcPropertyClass.prototype)
	.writable('input')

export function calcPropertyClassX<
	TInput,
	TValue,
	TCalcPropertyClass extends TBaseClass,
	TBaseClass extends CalcPropertyClass<TValue, TInput>
		= CalcPropertyClass<TValue, TInput>,
>(
	func: (this: CallState<TCalcPropertyClass, any[], TValue>)
		=> ThenableOrIteratorOrValue<TValue>,
	deferredOptions?: IDeferredOptions,
	baseClass?: TClass<[TInput], TBaseClass>,
) {
	// const inputPath = Path.build<TBaseClass>()(o => o.input)()

	return observableClass<
		[TInput, string?],
		TBaseClass,
		TCalcPropertyClass
	>(
		object => new CalcObjectBuilder<TBaseClass>(object) // , inputPath, inputPath)
			.calcX(VALUE_PROPERTY_DEFAULT, func, deferredOptions)
			.object as any,
		baseClass != null ? baseClass : CalcPropertyClass as any,
	)
}

export function calcPropertyClass<
	TInput,
	TValue,
	TCalcPropertyClass extends TBaseClass,
	TBaseClass extends CalcPropertyClass<TValue, TInput>
		= CalcPropertyClass<TValue, TInput>,
>(
	func: (this: TInput) => ThenableOrIteratorOrValue<TValue>,
	deferredOptions?: IDeferredOptions,
	baseClass?: TClass<[TInput, string?], TBaseClass>,
) {
	const inputPath = new Path<TBaseClass>().fv(o => o.input).init()

	return observableClass<
		[TInput, string?],
		TBaseClass,
		TCalcPropertyClass
	>(
		object => new CalcObjectBuilder<TBaseClass, TInput, TInput>(object, inputPath as any, inputPath as any)
			.calc(VALUE_PROPERTY_DEFAULT, func, deferredOptions)
			.object as any,
		baseClass != null ? baseClass : CalcPropertyClass as any,
	)
}

export function calcPropertyFactory<
	TInput,
	TValue,
	// TCalcPropertyClass extends TBaseClass,
	// TBaseClass extends CalcPropertyClass<TValue, TInput>
	// 	= CalcPropertyClass<TValue, TInput>,
>({
	name,
	calcFunc,
	deferredOptions,
	// baseClass,
}: {
	name?: string,
	calcFunc: (this: TInput) => IteratorOrValue<TValue>,
	deferredOptions?: IDeferredOptions,
	// baseClass?: TClass<[TInput, string?], TBaseClass>,
}): (input: TInput, name?: string) => CalcPropertyClass<TValue, TInput> {
	const NewProperty: any = calcPropertyClass(
		calcFunc,
		deferredOptions,
		// baseClass,
	)
	return (input: TInput, _name?: string) => new NewProperty(input, _name != null ? _name : name)
}

export function calcPropertyFactoryX<
	TInput,
	TValue,
	// TCalcPropertyClass extends TBaseClass,
	// TBaseClass extends CalcPropertyClass<TValue, TInput>
	// 	= CalcPropertyClass<TValue, TInput>,
>({
	name,
	calcFunc,
	deferredOptions,
	// baseClass,
}: {
	name?: string,
	calcFunc: (this: CallState<CalcPropertyClass<TValue, TInput>, any[], TValue>)
		=> IteratorOrValue<TValue>,
	deferredOptions?: IDeferredOptions,
	// baseClass?: TClass<[TInput, string?], TBaseClass>,
}): (input: TInput, name?: string) => CalcPropertyClass<TValue, TInput> {
	const NewProperty = calcPropertyClassX(
		calcFunc,
		deferredOptions,
		// baseClass,
	)
	return (input: TInput, _name?: string) => new NewProperty(input, _name != null ? _name : name) as any
}

// endregion

// class Class extends ObservableClass {
// 	public prop1: number
// 	public prop2: string
// 	public prop3: string
// }
//
// new DependCalcObjectBuilder(new Class())
// 	.writable('prop1')
// 	// .nestedCalc('prop2', c => c
// 	// 	.connectSimple('prop1', b2 => b2(o => o.prop1)),
// 	// 	function() {
// 	// 		const x = this.prop1
// 	// 		return ''
// 	// 	})
// 	.nestedCalc(
// 		'prop2',
// 		dependConnectorFactory({
// 			build: c => c
// 				.connectSimple('_prop1', b => b.f(o => o.prop1)),
// 		}),
// 		dependCalcPropertyFactory({
// 			*calcFunc() {
// 				const x = this._prop1
// 				// const y = state.prop1
// 				return ''
// 			},
// 		}),
// 	)
// 	// .calc(
// 	// 	'prop2',
// 	// 	connectorFactory({
// 	// 		buildRule: c => c
// 	// 			.connect('_prop1', b2 => b2.p('prop1')),
// 	// 	}),
// 	// 	calcPropertyFactory({
// 	// 		calcFunc(state) {
// 	// 			const x = state.input._prop1
// 	// 		},
// 	// 	}),
// 	// )
// 	.nestedCalc(
// 		'prop3',
// 		dependConnectorFactory({
// 			build: c => c
// 				.connectSimple('_prop1', b => b.f(o => o.prop1)),
// 		}),
// 		dependCalcPropertyFactoryX({
// 			*calcFunc() {
// 				const x = this._this.input._prop1
// 				// const y = state.prop1
// 				return ''
// 			},
// 		}),
// 	)
