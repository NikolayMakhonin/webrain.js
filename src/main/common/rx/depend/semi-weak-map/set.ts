import {ISemiWeakMap} from './create'
import {isRefType} from './isRefType'

export function semiWeakMapSet<K, V>(semiWeakMap: ISemiWeakMap<K, V>, key: K, value: V): void {
	if (isRefType(key)) {
		let weakMap = semiWeakMap.weakMap
		if (!weakMap) {
			semiWeakMap.weakMap = weakMap = new WeakMap()
		}
		weakMap.set(key as any, value)
	} else {
		let map = semiWeakMap.map
		if (!map) {
			semiWeakMap.map = map = new Map()
		}
		map.set(key, value)
	}
}
