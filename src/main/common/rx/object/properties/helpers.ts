import {TClass} from '../../../helpers/typescript'
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

export function createConnector<TObject,
	TConnector,
	>(
	object: TObject,
	factory: (source: TObject) => TConnector,
) {
	return factory(object)
}
