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

// tslint:disable-next-line:ban-types
export type NotFunction<T> = T extends Function ? never : T
