import { TClass } from '../../../helpers/typescript';
import { ObservableClass } from '../ObservableClass';
export declare function observableClass<TConstructorArgs extends any[], TBaseClass extends ObservableClass, TPropertyClass extends TBaseClass>(build: (object: TBaseClass) => TPropertyClass, baseClass?: TClass<TConstructorArgs, TBaseClass>): TClass<TConstructorArgs, TPropertyClass>;
export declare function createConnector<TObject, TConnector>(object: TObject, factory: (source: TObject) => TConnector): TConnector;
