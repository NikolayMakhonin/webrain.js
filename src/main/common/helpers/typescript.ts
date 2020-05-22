/* tslint:disable:ban-types use-primitive-type */

import {AsyncValueOf} from '../async/async'

/**
 * @enumerable decorator that sets the enumerable property of a class field to false.
 * @param value true|false
 */
// !Warning defineProperty is slow
// export function enumerable(value: boolean) {
// 	return (target: any, propertyKey: string) => {
// 		const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || { writable: true }
// 		if (descriptor.enumerable !== value) {
// 			descriptor.enumerable = value
// 			Object.defineProperty(target, propertyKey, descriptor)
// 		}
// 	}
// }

// export function singleton(target: any, propertyKey: string) {
// 	const factory = target[propertyKey]
// 	delete target[propertyKey]
// 	Object.defineProperty(target, propertyKey, {
// 		configurable: true,
// 		enumerable: true,
// 		get(this) {
// 			const value = factory.call(this)
// 			this[propertyKey] = value
// 			return value
// 		},
// 	})
// }

// export type Not<T, NotType> = T extends NotType ? never : T

/** Remove types from T that are assignable to U */
export type Diff<T, U> = T extends U ? never : T
/** Remove types from T that are not assignable to U */
export type Filter<T, U> = T extends U ? T : never

// type T30 = Diff<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'>  // "b" | "d"
// type T31 = Filter<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'>  // "a" | "c"

export type Func<TThis, TArgs extends any[], TValue = void> = (this: TThis, ...args: TArgs) => TValue
export type FuncAny = Func<any, any[], any>
export type NotFunc<T> = T extends Function ? never : T
export type ArgsOf<TFunc> = TFunc extends (...args: infer TArgs) => any
	? TArgs
	: never
export type ResultOf<TFunc> = TFunc extends (...args: any[]) => infer TResult
	? TResult
	: never
export type AsyncResultOf<TFunc> = AsyncValueOf<ResultOf<TFunc>>
export type KeysOf<TObject, TValue> = {
	[TKey in keyof TObject]: TObject[TKey] extends TValue ? TKey : never
}[keyof TObject]

export type TPrimitiveNotNullable = boolean | number | string | null | undefined | symbol | bigint | void
export type TPrimitiveNullable = Boolean | Number | String | Symbol | BigInt | Date
export type TPrimitive = TPrimitiveNotNullable | TPrimitiveNullable

export type TClass<TArgs extends any[],
	_TClass> = new(...args: TArgs) => _TClass

export type OptionalNested<TObject> = TObject extends object
	? {
		[TKey in keyof TObject]?: OptionalNested<TObject[TKey]>
	}
	: TObject
