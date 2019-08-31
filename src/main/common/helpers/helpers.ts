import {AsyncValueOf, ThenableOrIteratorOrValue} from '../async/async'

export function isIterable(value: any): boolean {
	return value != null
		&& typeof value[Symbol.iterator] === 'function'
}

export function isIterator(value: any): boolean {
	return value != null
		&& typeof value[Symbol.iterator] === 'function'
		&& typeof value.next === 'function'
}

export function typeToDebugString(type) {
	return type == null
		? type + ''
		: (type && type.name || type.toString())
}

// tslint:disable-next-line:no-empty no-shadowed-variable
export const EMPTY: any = function EMPTY() {}

export type TClass<T> = new (...args: any[]) => T
export type TFunc<TResult> = (...args: any[]) => TResult

export function delay(timeMilliseconds) {
	return new Promise(resolve => setTimeout(resolve, timeMilliseconds))
}

export function checkIsFuncOrNull<T extends TFunc<any>>(func: T): T {
	// PROF: 66 - 0.1%
	if (func != null && typeof func !== 'function') {
		throw new Error(`Value is not a function or null/undefined: ${func}`)
	}
	return func
}

export function toSingleCall<T extends TFunc<any>>(func: T, throwOnMultipleCall?: boolean): T {
	if (func == null) {
		return func
	}

	func = checkIsFuncOrNull(func)

	let isCalled = false
	return ((...args) => {
		if (isCalled) {
			if (throwOnMultipleCall) {
				throw new Error(`Multiple call for single call function: ${func}`)
			}
			return
		}
		isCalled = true
		return func(...args)
	}) as any
}

const createFunctionCache = {}
// tslint:disable-next-line:ban-types
export function createFunction(...args: string[]): Function {
	const id = args[args.length - 1] + ''
	let func = createFunctionCache[id]
	if (!func) {
		createFunctionCache[id] = func = Function(...args)
	}
	return func
}

export function hideObjectProperty(object: object, propertyName: string) {
	const descriptor = Object.getOwnPropertyDescriptor(object, propertyName)
	if (descriptor) {
		descriptor.enumerable = false
		return
	}

	Object.defineProperty(object, propertyName, {
		configurable: true,
		enumerable: false,
		value: object[propertyName],
	})
}

export const VALUE_PROPERTY_DEFAULT = ''
export type VALUE_PROPERTY_DEFAULT = ''
export interface HasDefaultValue<T> { [VALUE_PROPERTY_DEFAULT]: ThenableOrIteratorOrValue<T> }
export type HasDefaultOrValue<T> = T | HasDefaultValue<T>
export type HasDefaultValueOf<T> = T extends HasDefaultValue<any>
	? AsyncValueOf<T[VALUE_PROPERTY_DEFAULT]>
	: T
export type AsyncHasDefaultValueOf<T> = HasDefaultValueOf<AsyncValueOf<T>>
