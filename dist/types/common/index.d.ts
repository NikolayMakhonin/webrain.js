export { ThenableSync } from './async/ThenableSync';
export { ObservableObject } from './rx/object/ObservableObject';
export { CalcObjectBuilder } from './rx/object/properties/CalcObjectBuilder';
export { calcPropertyFactory } from './rx/object/properties/CalcPropertyBuilder';
export { connectorFactory } from './rx/object/properties/ConnectorBuilder';
export { Property } from './rx/object/properties/Property';
export { createFunction } from './helpers/helpers';
export { CalcObjectDebugger } from './rx/object/properties/CalcObjectDebugger';
import { ThenableOrIteratorOrValue as _ThenableOrIteratorOrValue } from './async/async';
import { ICalcProperty as _ICalcProperty } from './rx/object/properties/contracts';
import { IPropertyChangedSubject as _IPropertyChangedSubject } from './rx/object/IPropertyChanged';
export declare type IPropertyChangedSubject = _IPropertyChangedSubject;
export declare type ThenableOrIteratorOrValue<T> = _ThenableOrIteratorOrValue<T>;
export declare type ICalcProperty<TValue> = _ICalcProperty<TValue>;
