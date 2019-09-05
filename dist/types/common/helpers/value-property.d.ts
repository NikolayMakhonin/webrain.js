import { AsyncValueOf, ThenableOrIteratorOrValue } from '../async/async';
export declare const VALUE_PROPERTY_DEFAULT = "";
export declare type VALUE_PROPERTY_DEFAULT = '';
export interface HasDefaultValue<T> {
    [VALUE_PROPERTY_DEFAULT]: ThenableOrIteratorOrValue<T>;
}
export declare type HasDefaultOrValue<T> = T | HasDefaultValue<T>;
export declare type HasDefaultValueOf<T> = T extends HasDefaultValue<any> ? AsyncValueOf<T[VALUE_PROPERTY_DEFAULT]> : T;
export declare type AsyncHasDefaultValueOf<T> = HasDefaultValueOf<AsyncValueOf<T>>;
