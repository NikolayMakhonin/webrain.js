import { AsyncValueOf, ThenableOrIteratorOrValue } from '../async/async';
export declare function isIterable(value: any): boolean;
export declare function isIterator(value: any): boolean;
export declare function typeToDebugString(type: any): any;
export declare const EMPTY: any;
export declare type TClass<T> = new (...args: any[]) => T;
export declare type TFunc<TResult> = (...args: any[]) => TResult;
export declare function delay(timeMilliseconds: any): Promise<unknown>;
export declare function checkIsFuncOrNull<T extends TFunc<any>>(func: T): T;
export declare function toSingleCall<T extends TFunc<any>>(func: T, throwOnMultipleCall?: boolean): T;
export declare function createFunction(...args: string[]): Function;
export declare function hideObjectProperty(object: object, propertyName: string): void;
export declare const VALUE_PROPERTY_DEFAULT = "";
export declare type VALUE_PROPERTY_DEFAULT = '';
export interface HasDefaultValue<T> {
    [VALUE_PROPERTY_DEFAULT]: ThenableOrIteratorOrValue<T>;
}
export declare type HasDefaultOrValue<T> = T | HasDefaultValue<T>;
export declare type HasDefaultValueOf<T> = T extends HasDefaultValue<any> ? AsyncValueOf<T[VALUE_PROPERTY_DEFAULT]> : T;
export declare type AsyncHasDefaultValueOf<T> = HasDefaultValueOf<AsyncValueOf<T>>;
