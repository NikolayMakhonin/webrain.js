import { AsyncValueOf, ThenableOrIteratorOrValue, ThenableOrValue } from '../../../async/async';
import { AsyncHasDefaultValueOf, HasDefaultValueOf } from '../../../helpers/value-property';
declare type TGetValue1<TValue> = (value: any) => ThenableOrIteratorOrValue<HasDefaultValueOf<TValue>>;
declare type TGetPropertyValueResult1<TValue> = TGetPropertyValue<HasDefaultValueOf<TValue>>;
declare type TGetPropertyValue1<TValue> = <TNextValue>(getValue: TGetValue1<TValue>, isValueProperty: true) => TGetPropertyValueResult1<TValue>;
declare type TGetValue2<TValue, TNextValue> = (value: HasDefaultValueOf<TValue>) => ThenableOrIteratorOrValue<TNextValue>;
declare type TGetPropertyValueResult2<TNextValue> = TGetPropertyValue<AsyncValueOf<TNextValue>>;
declare type TGetPropertyValue2<TValue> = <TNextValue>(getValue: TGetValue2<TValue, TNextValue>, isValueProperty?: false) => TGetPropertyValueResult2<TNextValue>;
declare type TGetPropertyValueResult3<TValue> = ThenableOrValue<AsyncHasDefaultValueOf<TValue>>;
declare type TGetPropertyValue3<TValue> = () => TGetPropertyValueResult3<TValue>;
declare type TGetPropertyValue<TValue> = (TGetPropertyValue1<TValue> & TGetPropertyValue2<TValue> & TGetPropertyValue3<TValue>) & {
    value: ThenableOrValue<TValue>;
};
export declare function resolvePath<TValue>(value: ThenableOrIteratorOrValue<TValue>): TGetPropertyValue<TValue>;
export {};
