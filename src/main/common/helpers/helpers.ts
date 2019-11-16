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

export function delay(timeMilliseconds) {
	return new Promise(resolve => setTimeout(resolve, timeMilliseconds))
}

export type TClass<T> = new (...args: any[]) => T
export type TFunc<TResult> = (...args: any[]) => TResult

export function checkIsFuncOrNull<T extends TFunc<any>|void>(func: T): T {
	// PROF: 66 - 0.1%
	if (func != null && typeof func !== 'function') {
		throw new Error(`Value is not a function or null/undefined: ${func}`)
	}
	return func
}

export function toSingleCall<T extends TFunc<any>|void>(func: T, throwOnMultipleCall?: boolean): T {
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
		return (func as TFunc<any>)(...args)
	}) as any
}

const allowCreateFunction = (() => {
	try {
		const func = new Function('a', 'b', 'return a + b')
		return !!func
	} catch (err) {
		return false
	}
})()

const createFunctionCache = {}
// tslint:disable-next-line:ban-types
export function createFunction(alternativeFuncFactory, ...args: string[]): Function {
	const id = args[args.length - 1] + ''
	let func = createFunctionCache[id]
	if (!func) {
		createFunctionCache[id] = func = allowCreateFunction
			? Function(...args)
			: alternativeFuncFactory()
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

export function equalsObjects(o1, o2) {
	if (o1 === o2) {
		return true
	}

	if (o1 && typeof o1 === 'object' && typeof o1.equals === 'function') {
		return o1.equals(o2)
	}

	if (o2 && typeof o2 === 'object' && typeof o2.equals === 'function') {
		return o2.equals(o1)
	}

	return false
}
