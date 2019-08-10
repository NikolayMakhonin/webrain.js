export function isIterable(value: any): boolean {
	return value
		&& typeof value[Symbol.iterator] === 'function'
}

export function isIterator(value: any): boolean {
	return value
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
