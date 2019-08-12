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
"use strict";