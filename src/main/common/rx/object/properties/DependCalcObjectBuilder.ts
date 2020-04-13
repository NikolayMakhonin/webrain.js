import {ThenableOrIteratorOrValue} from '../../../async/async'
import {depend, dependX} from '../../../rx/depend/core/depend'
import {CallState} from '../../depend/core/CallState'
import {IDeferredOptions} from '../../depend/core/contracts'
import {makeDependPropertySubscriber} from '../helpers'
import {ObservableClass} from '../ObservableClass'
import {CalcObjectBuilder} from './CalcObjectBuilder'
import {ValueKeys} from './contracts'
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
			.append()

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
			getValue: createGetValue(
				this.calcSourcePath,
				depend(func, deferredOptions, makeDependPropertySubscriber(name as any)),
			),
		}) as any
	}

	public dependCalcX<
		Name extends keyof TObject,
	>(
		name: Name,
		func: (this: CallState<TCalcSource, any[], TObject[Name]>)
			=> ThenableOrIteratorOrValue<TObject[Name]>,
		deferredOptions?: IDeferredOptions,
	): this & { object: { readonly [newProp in Name]: TObject[Name] } } {
		return super.readable(name as any, {
			getValue: createGetValue(
				this.calcSourcePath,
				dependX(func, deferredOptions, makeDependPropertySubscriber(name as any)),
			),
		}) as any
	}
}

// const builder = new DependCalcObjectBuilder(true as any)
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
