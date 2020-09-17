import { AsyncValueOf } from '../async/async';
/**
 * @enumerable decorator that sets the enumerable property of a class field to false.
 * @param value true|false
 */
/** Remove types from T that are assignable to U */
export declare type Diff<T, U> = T extends U ? never : T;
/** Remove types from T that are not assignable to U */
export declare type Filter<T, U> = T extends U ? T : never;
export declare type Func<TThis, TArgs extends any[], TValue = void> = (this: TThis, ...args: TArgs) => TValue;
export declare type FuncAny = Func<any, any[], any>;
export declare type NotFunc<T> = T extends Function ? never : T;
export declare type ArgsOf<TFunc> = TFunc extends (...args: infer TArgs) => any ? TArgs : never;
export declare type ResultOf<TFunc> = TFunc extends (...args: any[]) => infer TResult ? TResult : never;
export declare type AsyncResultOf<TFunc> = AsyncValueOf<ResultOf<TFunc>>;
export declare type KeysOf<TObject, TValue> = {
    [TKey in keyof TObject]: TObject[TKey] extends TValue ? TKey : never;
}[keyof TObject];
export declare type TPrimitiveNotNullable = boolean | number | string | null | undefined | symbol | bigint | void;
export declare type TPrimitiveNullable = Boolean | Number | String | Symbol | BigInt | Date;
export declare type TPrimitive = TPrimitiveNotNullable | TPrimitiveNullable;
export declare type TClass<TArgs extends any[], _TClass> = new (...args: TArgs) => _TClass;
export declare type OptionalNested<TObject> = TObject extends object ? {
    [TKey in keyof TObject]?: OptionalNested<TObject[TKey]>;
} : TObject;
