import {getObjectUniqueId} from '../../src/main/common/lists/helpers/object-unique-id'

export interface IDeepCloneOptions {
	circular?: boolean
}

export function deepClone<T>(value: T, options?: IDeepCloneOptions, cache?: any[]): T {
	if (value == null
		|| typeof value === 'boolean'
		|| typeof value === 'number'
		|| typeof value === 'string'
		|| typeof value === 'function'
	) {
		return value
	}

	let id
	if (options && options.circular) {
		id = getObjectUniqueId(value as any)
		if (cache) {
			const cached = cache[id]
			if (cached != null) {
				return cached
			}
		} else {
			cache = []
		}
	}

	const type: new (...args) => T = value.constructor as any

	let clone

	const valueOf = value.valueOf()
	if (valueOf !== value) {
		clone = new type(valueOf)
		if (id != null) {
			cache[id] = clone
		}
	} else {
		clone = new type()
		if (id != null) {
			cache[id] = clone
		}

		switch (value[Symbol.toStringTag]) {
			case 'Set':
				for (const item of value as any) {
					(clone as Set<any>).add(
						deepClone(item, options, cache),
					)
				}
				return clone
			case 'Map':
				for (const item of value as any) {
					(clone as Map<any, any>).set(
						deepClone(item[0], options, cache),
						deepClone(item[1], options, cache),
					)
				}
				return clone
		}

		for (const key in value) {
			if (Object.prototype.hasOwnProperty.call(value, key)) {
				clone[key] = deepClone(value[key], options, cache)
			}
		}
	}

	return clone
}

export interface IDeepEqualOptions {
	circular?: boolean,
	noCrossReferences?: boolean,
	equalTypes?: boolean
	equalInnerReferences?: boolean
	ignoreOrderForMapSet?: boolean // slow
}

function isPrimitive(value: any): boolean {
	return value == null
		|| typeof value === 'boolean'
		|| typeof value === 'number'
		|| typeof value === 'string'
		|| typeof value === 'function'
}

export function deepEqual(
	obj1: any, obj2: any, options?: IDeepEqualOptions,
): boolean {
	let cache1: number[]
	let cache2: number[]
	let nodeId: number
	let cache1New: number[]
	let cache2New: number[]
	let cache1NewLength: number
	let cache2NewLength: number

	const equal = (o1: any, o2: any): boolean => {
		if (isPrimitive(o1) || isPrimitive(o2)) {
			if (o1 === o2 || Number.isNaN(o1 as any) && Number.isNaN(o2 as any)) {
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

		if (options && options.equalTypes) {
			const type1 = o1.constructor
			const type2 = o2.constructor
			if (type1 !== type2) {
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

					if (options && options.ignoreOrderForMapSet) {
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
