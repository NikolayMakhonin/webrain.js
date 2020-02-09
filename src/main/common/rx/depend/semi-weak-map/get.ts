import {ISemiWeakMap} from './create'
import {isRefType} from './isRefType'

export function semiWeakMapGet<K, V>(semiWeakMap: ISemiWeakMap<K, V>, key: K): V {
	let value
	if (isRefType(key)) {
		const weakMap = semiWeakMap.weakMap
		if (weakMap) {
			value = weakMap.get(key as any)
		}
	} else {
		const map = semiWeakMap.map
		if (map) {
			value = map.get(key)
		}
	}
	return value == null ? null : value
}
