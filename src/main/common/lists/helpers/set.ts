export function fillCollection<TCollection, T extends any>(
	collection: TCollection,
	arrayOrIterable: T[] | Iterable<T>,
	add: (collection: TCollection, item: T) => void,
): TCollection {
	if (Array.isArray(arrayOrIterable)) {
		for (let i = 0, len = arrayOrIterable.length; i < len; i++) {
			add(collection, arrayOrIterable[i])
		}
	} else {
		for (const item of arrayOrIterable) {
			add(collection, item)
		}
	}

	return collection
}

export function fillSet<TSet extends Set<T>, T extends any>(
	set: TSet,
	arrayOrIterable: T[] | Iterable<T>,
): TSet {
	return fillCollection(set, arrayOrIterable, (c, o) => c.add(o))
}

export function fillMap<TMap extends Map<K, V>, K extends any, V extends any>(
	map: TMap,
	arrayOrIterable: Array<[K, V]> | Iterable<[K, V]>,
): TMap {
	return fillCollection(map, arrayOrIterable, (c, o) => c.set.apply(c, o))
}

export function fillObjectKeys(
	object: object,
	arrayOrIterable: string[] | Iterable<string>,
): object {
	return fillCollection(object, arrayOrIterable, (c, o) => c[o] = o)
}
