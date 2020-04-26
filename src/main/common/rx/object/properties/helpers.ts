import {TClass} from '../../../helpers/typescript'
import {autoCalc} from '../../../rx/depend/core/CallState'
import {Func} from '../../depend/core/contracts'
import {ObservableClass} from '../ObservableClass'

export function observableClass<
	TConstructorArgs extends any[],
	TBaseClass extends ObservableClass,
	TPropertyClass extends TBaseClass
>(
	build: (object: TBaseClass) => TPropertyClass,
	baseClass?: TClass<TConstructorArgs, TBaseClass>,
): TClass<TConstructorArgs, TPropertyClass> {
	class NewPropertyClass extends (baseClass != null ? baseClass : ObservableClass) { }

	build(NewPropertyClass.prototype as TBaseClass)

	return NewPropertyClass as any
}

export function autoCalcConnect<
	TObject,
	TInput,
	>(
	object: TObject,
	inputFactory: (source: TObject, name?: string) => TInput,
	func: Func<TInput, [], any>,
) {
	return autoCalc.call(inputFactory(object))(func)
}
