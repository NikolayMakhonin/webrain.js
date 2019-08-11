import {getObjectUniqueId} from '../lists/helpers/object-unique-id'

export interface IDeepCloneEqualOptions {
	circular?: boolean
	customIsPrimitive?: (o: any) => boolean
}

export interface IDeepCloneOptions extends IDeepCloneEqualOptions {
	customClone?: (value: any, setInstance: (instance) => void, cloneNested: (nested: any) => any) => any
}
export interface IDeepEqualOptions extends IDeepCloneEqualOptions {
	noCrossReferences?: boolean,
	equalTypes?: boolean
	equalInnerReferences?: boolean
	equalMapSetOrder?: boolean // faster
	strictEqualFunctions?: boolean
	customEqual?: (o1: any, o2: any, equal: (o1: any, o2: any) => boolean) => boolean|null
}

export function isPrimitiveDefault(value: any): boolean {
	return value == null
		|| typeof value === 'boolean'
		|| typeof value === 'number'
		|| typeof value === 'string'
		|| typeof value === 'function'
		|| value instanceof Error
}

function *toIterableIterator<T>(array: T[]): IterableIterator<T> {
	for (const item of array) {
		yield item
	}
}

function toIterableIteratorGenerator<T>(array: T[]): () => IterableIterator<T> {
	return () => toIterableIterator(array)
}

export class DeepCloneEqual {
	public commonOptions?: IDeepCloneEqualOptions
	public cloneOptions?: IDeepCloneOptions
	public equalOptions?: IDeepEqualOptions

	constructor({
		commonOptions,
		cloneOptions,
		equalOptions,
	}: {
		commonOptions?: IDeepCloneEqualOptions,
		cloneOptions?: IDeepCloneOptions,
		equalOptions?: IDeepEqualOptions,
	} = {}) {
		if (commonOptions) {
			this.commonOptions = commonOptions
		}
		if (cloneOptions) {
			this.cloneOptions = cloneOptions
		}
		if (equalOptions) {
			this.equalOptions = equalOptions
		}
	}

	public isPrimitive(value: any): boolean {
		const {commonOptions} = this
		const isPrimitive = commonOptions && commonOptions.customIsPrimitive
			|| isPrimitiveDefault
		return isPrimitive(value)
	}

	public clone<T extends any>(value: T, options?: IDeepCloneOptions, cache?: any[]): T {
		options = { ...this.commonOptions, ...this.cloneOptions, ...options }
		const customClone = options && options.customClone
		const isPrimitive = options && options.customIsPrimitive || isPrimitiveDefault

		const clone = (source: any): any => {
			if (isPrimitive(source)) {
				return source
			}

			let id
			if (options && options.circular) {
				id = getObjectUniqueId(source as any)
				if (cache) {
					const cached = cache[id]
					if (cached != null) {
						return cached
					}
				} else {
					cache = []
				}
			}

			let cloned

			if (customClone) {
				const result = customClone(source, o => {
					cloned = o
					if (id != null) {
						cache[id] = o
					}
				}, clone)

				if (result != null) {
					return result
				}

				if (id != null && cloned !== null) {
					cache[id] = null
				}
			}

			if (source[Symbol.iterator] && source.next) {
				cloned = toIterableIterator(clone(Array.from(source[Symbol.iterator]())))
				if (id != null) {
					cache[id] = cloned
				}
				return cloned
			}

			const type: new (...args) => T = source.constructor as any

			const valueOf = source.valueOf()
			if (valueOf !== source) {
				cloned = new type(valueOf)
				if (id != null) {
					cache[id] = cloned
				}
				return cloned
			}

			cloned = new type()
			if (id != null) {
				cache[id] = cloned
			}

			const sourceTag = source[Symbol.toStringTag]
			if (cloned[Symbol.toStringTag] !== sourceTag) {
				cloned[Symbol.toStringTag] = sourceTag
			}

			switch (sourceTag) {
				case 'Set':
					for (const item of source as any) {
						(cloned as Set<any>).add(
							clone(item),
						)
					}
					return cloned
				case 'Map':
					for (const item of source as any) {
						(cloned as Map<any, any>).set(
							clone(item[0]),
							clone(item[1]),
						)
					}
					return cloned
			}

			if (source[Symbol.iterator] && !cloned[Symbol.iterator]) {
				cloned[Symbol.iterator] = toIterableIteratorGenerator(clone(Array.from(source[Symbol.iterator]())))
			}

			for (const key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					cloned[key] = clone(source[key] as any)
				}
			}

			return cloned
		}

		return clone(value)
	}

	public equal(
		obj1: any, obj2: any, options?: IDeepEqualOptions,
	): boolean {
		options = { ...this.commonOptions, ...this.equalOptions, ...options }
		const customEqual = options && options.customEqual
		const isPrimitive = options && options.customIsPrimitive || isPrimitiveDefault

		let cache1: number[]
		let cache2: number[]
		let nodeId: number
		let cache1New: number[]
		let cache2New: number[]
		let cache1NewLength: number
		let cache2NewLength: number

		const equal = (o1: any, o2: any): boolean => {
			if (isPrimitive(o1) || isPrimitive(o2)) {
				if (o1 === o2
					|| Number.isNaN(o1 as any) && Number.isNaN(o2 as any)
					|| (!options || !options.strictEqualFunctions)
						&& typeof o1 === 'function' && typeof o2 === 'function'
						&& o1.toString() === o2.toString()
				) {
					return true
				} else {
					return false
				}
			}

			if (nodeId == null) {
				nodeId = 1
			}

			if (options && (options.circular || options.equalInnerReferences)) {
				const id1 = getObjectUniqueId(o1 as any)
				const id2 = getObjectUniqueId(o2 as any)

				if (id1 != null && !cache1) {
					cache1 = []
				}

				if (id2 != null && !cache2) {
					cache2 = []
				}

				if (id1 == null) {
					if (id2 == null) {
						if (o1 === o2) {
							return true
						}
					} else {
						return false
					}
				} else {
					if (id2 == null) {
						return false
					}
					if (o1 === o2) {
						if (options.noCrossReferences) {
							return false
						} else {
							cache1[id1] = nodeId
							cache2[id2] = nodeId
							return true
						}
					}
					if (options.noCrossReferences && (cache1[id2] || cache2[id1])) {
						return false
					}

					if (options.equalInnerReferences
						&& (cache1[id1] || nodeId) !== (cache2[id2] || nodeId)
					) {
						return false
					}

					if (cache1[id1] && cache2[id2]) {
						return true
					}

					if (cache1NewLength != null && !cache1[id1]) {
						cache1New.push(id1)
					}

					if (cache2NewLength != null && !cache2[id1]) {
						cache2New.push(id2)
					}

					cache1[id1] = nodeId
					cache2[id2] = nodeId

				}
			} else if (o1 === o2) {
				if (options && options.noCrossReferences) {
					return false
				} else {
					return true
				}
			}

			if (customEqual) {
				const result = customEqual(o1, o2, equal)
				if (result != null) {
					return result
				}
			}

			if (options && options.equalTypes) {
				const type1 = o1.constructor
				const type2 = o2.constructor
				if (type1 !== type2) {
					return false
				}
			}

			const valueOf1 = o1.valueOf()
			const valueOf2 = o2.valueOf()
			if (valueOf1 !== o1 || valueOf2 !== o2) {
				if (valueOf1 === valueOf2
					|| Number.isNaN(valueOf1 as any) && Number.isNaN(valueOf2 as any)
				) {
					return true
				} else {
					return false
				}
			}

			if (typeof o1[Symbol.iterator] === 'function') {
				if (typeof o2[Symbol.iterator] === 'function') {
					if (Array.isArray(o1) && Array.isArray(o2)) {
						if (o1.length !== o2.length) {
							return false
						}
					} else {
						if ((o1.size || o1.length) !== (o2.size || o2.length)) {
							return false
						}

						if (options && !options.equalMapSetOrder) {
							const tag1 = o1[Symbol.toStringTag]
							const tag2 = o2[Symbol.toStringTag]
							const isMap = tag1 === 'Map' || tag2 === 'Map'
							if (tag1 === 'Set' || tag2 === 'Set' || isMap) {
								if (tag1 && tag2 && tag1 !== tag2)
								{
									return false
								}

								if (!cache1New) {
									cache1New = []
								}
								if (!cache2New) {
									cache2New = []
								}
								if (cache1NewLength == null) {
									cache1NewLength = 0
								}
								if (cache2NewLength == null) {
									cache2NewLength = 0
								}

								const initialCache1NewLength = cache1NewLength
								const initialCache2NewLength = cache2NewLength

								for (const item1 of o1) {
									if (isMap && (!Array.isArray(item1) || item1.length !== 2)) {
										return false
									}
									let found
									for (const item2 of o2) {
										if (isMap && (!Array.isArray(item2) || item2.length !== 2)) {
											return false
										}

										const prevNodeId = nodeId
										const prevCache1NewLength = cache1NewLength
										const prevCache2NewLength = cache2NewLength

										nodeId++
										const result = isMap
											? equal(item1[0], item2[0])	&& equal(item1[1], item2[1])
											: equal(item1, item2)

										if (result) {
											found = true
											break
										} else {
											nodeId = prevNodeId

											for (let i = prevCache1NewLength, len = cache1NewLength; i < len; i++) {
												cache1[cache1New[i]] = 0
											}
											cache1New.length = prevCache1NewLength

											for (let i = prevCache2NewLength, len = cache2NewLength; i < len; i++) {
												cache2[cache2New[i]] = 0
											}
											cache2New.length = prevCache2NewLength
										}
									}
									if (!found) {
										return false
									}
								}

								if (initialCache1NewLength === 0) {
									cache1NewLength = null
								}
								if (initialCache2NewLength === 0) {
									cache2NewLength = null
								}

								return true
							}
						}

						const iterator1 = o1[Symbol.iterator]() as Iterator<any>
						const iterator2 = o2[Symbol.iterator]() as Iterator<any>
						do {
							const iteration1 = iterator1.next()
							const iteration2 = iterator2.next()

							nodeId++
							if (!equal(iteration1.value, iteration2.value)) {
								return false
							}

							if (iteration1.done) {
								if (!iteration2.done) {
									return false
								}
								break
							}
						} while (true)

						return true
					}
				} else {
					return false
				}
			} else if (typeof o2[Symbol.iterator] === 'function') {
				return false
			}

			for (const key in o1) {
				if (Object.prototype.hasOwnProperty.call(o1, key)) {
					if (!Object.prototype.hasOwnProperty.call(o2, key)) {
						return false
					}

					nodeId++
					if (!equal(o1[key], o2[key])) {
						return false
					}
				}
			}

			for (const key in o2) {
				if (Object.prototype.hasOwnProperty.call(o2, key)
					&& !Object.prototype.hasOwnProperty.call(o1, key)
				) {
					return false
				}
			}

			return true
		}

		return equal(obj1, obj2)
	}
}
