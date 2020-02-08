function isRefType(value): boolean {
	return value != null && (typeof value === 'object' || typeof value === 'function')
}

export interface ISemiWeakMap<K, V> {
	set(key: K, value: V): this
	get(key: K): V | undefined
	has(key: K): boolean
	delete(key: K): boolean
}

export class SemiWeakMap<K, V> implements ISemiWeakMap<K, V>
{
	private _map: Map<K, V> = void 0
	private _weakMap: WeakMap<any, V> = void 0

	public [Symbol.toStringTag]: string

	public set(key: K, value: V): this {
		if (isRefType(key)) {
			let _weakMap = this._weakMap
			if (!_weakMap) {
				this._weakMap = _weakMap = new WeakMap()
			}
			_weakMap.set(key, value)
		} else {
			let _map = this._map
			if (!_map) {
				this._map = _map = new Map()
			}
			_map.set(key, value)
		}

		return this
	}

	public get(key: K): V | undefined {
		if (isRefType(key)) {
			const _weakMap = this._weakMap
			if (_weakMap) {
				return _weakMap.get(key)
			}
		} else {
			const _map = this._map
			if (_map) {
				return _map.get(key)
			}
		}
	}

	public has(key: K): boolean {
		if (isRefType(key)) {
			const _weakMap = this._weakMap
			if (_weakMap) {
				return _weakMap.has(key)
			}
		} else {
			const _map = this._map
			if (_map) {
				return _map.has(key)
			}
		}

		return false
	}

	public delete(key: K): boolean {
		if (isRefType(key)) {
			const _weakMap = this._weakMap
			if (_weakMap) {
				return _weakMap.delete(key)
			}
		} else {
			const _map = this._map
			if (_map) {
				return _map.delete(key)
			}
		}

		return false
	}
}

SemiWeakMap.prototype[Symbol.toStringTag] = 'WeakMap'
