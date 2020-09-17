import { AsyncValueOf, ThenableOrIterator } from '../../../../async/async';
import { VALUE_PROPERTY_DEFAULT } from '../../../../helpers/value-property';
import { Path } from './builder';
export declare type AsyncPropertyValueOf<TValue> = TValue extends {
    [VALUE_PROPERTY_DEFAULT]: infer V;
} ? (V extends ThenableOrIterator<infer V2> ? V2 : V) : (TValue extends ThenableOrIterator<infer V3> ? V3 : TValue);
export declare type AsyncPropertyPathOf<TObject, TValue> = TValue extends {
    [VALUE_PROPERTY_DEFAULT]: infer V;
} ? (V extends ThenableOrIterator<infer V2> ? Path<TObject, V2> : Path<TObject, V>) : (TValue extends ThenableOrIterator<infer V3> ? Path<TObject, V3> : Path<TObject, TValue>);
export declare type TNextValueFunc<TNextValue> = (nextValue: TNextValue) => void;
export declare type TGetValue1<TValue, TNextValue> = (value: AsyncValueOf<TValue>, newValue?: AsyncValueOf<TNextValue>, next?: TNextValueFunc<TNextValue>) => TNextValue;
export declare type TGetValue2<TValue, TNextValue> = (value: AsyncPropertyValueOf<TValue>, newValue?: AsyncPropertyValueOf<TNextValue>, next?: TNextValueFunc<TNextValue>) => TNextValue;
export declare type TGetPropertyValueResult1<TNextValue> = TGetPropertyValue<TNextValue>;
export declare type TGetPropertyValue1<TValue> = <TNextValue>(getValue: TGetValue1<TValue, TNextValue>, isValueProperty: true, newValue?: TNextValue, next?: TNextValueFunc<TNextValue>) => TGetPropertyValueResult1<TNextValue>;
export declare type TGetPropertyValueResult2<TNextValue> = TGetPropertyValue<TNextValue>;
export declare type TGetPropertyValue2<TValue> = <TNextValue>(getValue: TGetValue2<TValue, TNextValue>, isValueProperty?: false, newValue?: TNextValue, next?: TNextValueFunc<TNextValue>) => TGetPropertyValueResult2<TNextValue>;
export declare type TGetPropertyValueResult3<TValue> = AsyncPropertyValueOf<TValue>;
export declare type TGetPropertyValue3<TValue> = () => TGetPropertyValueResult3<TValue>;
export declare type TGetPropertyValue<TValue> = TGetPropertyValue1<TValue> & TGetPropertyValue2<TValue> & TGetPropertyValue3<TValue>;
export declare type TSetValue1<TValue, TNextValue> = (value: AsyncValueOf<TValue>, newValue: AsyncValueOf<TNextValue>) => void;
export declare type TSetValue2<TValue, TNextValue> = (value: AsyncPropertyValueOf<TValue>, newValue: AsyncPropertyValueOf<TNextValue>) => void;
export declare type TGetPropertyPathResult1<TObject, TNextValue> = TGetPropertyPathGetSet<TObject, TNextValue>;
export declare type TGetPropertyPath1<TObject, TValue> = <TNextValue>(getValue: TGetValue1<TValue, TNextValue>, isValueProperty: true) => TGetPropertyPathResult1<TObject, TNextValue>;
export declare type TSetPropertyPath1<TObject, TValue> = <TNextValue>(getValue: TGetValue1<TValue, TNextValue>, setValue: TSetValue1<TValue, TNextValue>, isValueProperty: true) => TGetPropertyPathResult1<TObject, TNextValue>;
export declare type TGetPropertyPathResult2<TObject, TNextValue> = TGetPropertyPathGetSet<TObject, TNextValue>;
export declare type TGetPropertyPath2<TObject, TValue> = <TNextValue>(getValue: TGetValue2<TValue, TNextValue>, isValueProperty?: false) => TGetPropertyPathResult2<TObject, TNextValue>;
export declare type TSetPropertyPath2<TObject, TValue> = <TNextValue>(getValue: TGetValue2<TValue, TNextValue>, setValue: TSetValue2<TValue, TNextValue>, isValueProperty?: false) => TGetPropertyPathResult2<TObject, TNextValue>;
export declare type TGetValue<TObject, TValue> = (object: TObject) => TValue;
export declare type TSetValue<TObject, TValue> = (object: TObject, value: TValue) => void;
export interface IPathNode<TObject, TValue> {
    getValue: TGetValue<TObject, TValue>;
    setValue: TSetValue<TObject, TValue>;
    isValueProperty: boolean;
}
export declare type TPathNodes<TObject, TValue> = Array<IPathNode<TObject, TValue>>;
export declare type TGetPropertyPathResult3<TObject, TValue> = AsyncPropertyPathOf<TObject, TValue>;
export declare type TGetPropertyPath3<TObject, TValue> = () => TGetPropertyPathResult3<TObject, TValue>;
export declare type TGetPropertyPathGet<TObject, TValue> = TGetPropertyPath1<TObject, TValue> & TGetPropertyPath2<TObject, TValue> & TGetPropertyPath3<TObject, TValue>;
export declare type TGetPropertyPathSet<TObject, TValue> = TSetPropertyPath1<TObject, TValue> & TSetPropertyPath2<TObject, TValue> & TGetPropertyPath3<TObject, TValue>;
export declare type TGetPropertyPathGetSet<TObject, TValue> = TGetPropertyPathGet<TObject, TValue> & TGetPropertyPathSet<TObject, TValue>;
