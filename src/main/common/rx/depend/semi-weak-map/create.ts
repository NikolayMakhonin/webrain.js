export interface ISemiWeakMap<K, V> {
	map: Map<K, V>
	weakMap: WeakMap<K extends object ? K : never, V>
}

export function createSemiWeakMap<K, V>(): ISemiWeakMap<K, V> {
	return {
		map: null,
		weakMap: null,
	}
}
