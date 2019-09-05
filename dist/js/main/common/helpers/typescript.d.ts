/**
 * @enumerable decorator that sets the enumerable property of a class field to false.
 * @param value true|false
 */
/** Remove types from T that are assignable to U */
export declare type Diff<T, U> = T extends U ? never : T;
/** Remove types from T that are not assignable to U */
export declare type Filter<T, U> = T extends U ? T : never;
export declare type NotFunction<T> = T extends Function ? never : T;
export declare type TPrimitiveNotNullable = boolean | number | string | null | undefined | symbol | bigint | void;
export declare type TPrimitiveNullable = Boolean | Number | String | Symbol | BigInt | Date;
export declare type TPrimitive = TPrimitiveNotNullable | TPrimitiveNullable;
