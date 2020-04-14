import {Class} from '../../../helpers/typescript'
import {ObservableClass} from '../ObservableClass'

export function observableClass<
	TConstructorArgs extends any[],
	TBaseClass extends ObservableClass,
	TPropertyClass extends TBaseClass
>(
	build: (object: TBaseClass) => TPropertyClass,
	baseClass?: Class<TConstructorArgs, TBaseClass>,
): Class<TConstructorArgs, TPropertyClass> {
	class NewPropertyClass extends (baseClass != null ? baseClass : ObservableClass) { }

	build(NewPropertyClass.prototype as TBaseClass)

	return NewPropertyClass as any
}
