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
		if (cache) {
			cache[id] = clone
		}
	} else {
		clone = new type()
		if (cache) {
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
}

export function deepEqual(
	o1: any, o2: any, options?: IDeepEqualOptions,
	cache1?: boolean[], cache2?: boolean[],
): boolean {
	if (o1 == null
		|| typeof o1 === 'boolean'
		|| typeof o1 === 'number'
		|| typeof o1 === 'string'
		|| typeof o1 === 'function'
	) {
		if (o1 === o2 || Number.isNaN(o1 as any) && Number.isNaN(o2 as any)) {
			return true
		} else {
			return false
		}
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
					return true
				}
			}
			if (options.noCrossReferences && (cache1[id2] || cache2[id1])) {
				return false
			}

			if (options.equalInnerReferences) {
				if (cache1[id1] || cache2[id2]) {
					if (cache1[id1] === cache2[id2]) {
						return true
					} else {
						return false
					}
				}
			} else if (cache1[id1] && cache2[id2]) {
				return true
			}

			cache1[id1] = true
			cache2[id2] = true
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

				const iterator1 = o1[Symbol.iterator]() as Iterator<any>
				const iterator2 = o2[Symbol.iterator]() as Iterator<any>
				do {
					const iteration1 = iterator1.next()
					const iteration2 = iterator2.next()

					if (!deepEqual(iteration1.value, iteration2.value, options, cache1, cache2)) {
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
		if (Object.prototype.hasOwnProperty.call(o1, key)
			&& (!Object.prototype.hasOwnProperty.call(o2, key)
				|| !deepEqual(o1[key], o2[key], options, cache1, cache2))
		) {
			return false
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
