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
