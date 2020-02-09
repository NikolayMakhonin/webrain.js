function isRefType(value): boolean {
	return value != null && (typeof value === 'object' || typeof value === 'function')
}

export interface ISemiWeakMap<K, V> {
	set(key: K, value: V): this
	get(key: K): V | undefined
	has(key: K): boolean
	delete(key: K): boolean
}

export const SemiWeakMap: new <K, V>() => ISemiWeakMap<K, V> = /** @class */ (function() {
	function SemiWeakMap() {
		this._map = null
		this._weakMap = null
	}
	SemiWeakMap.prototype.set = function(key, value) {
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
	SemiWeakMap.prototype.get = function(key) {
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
	SemiWeakMap.prototype.has = function(key) {
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
	SemiWeakMap.prototype.delete = function(key) {
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
	return SemiWeakMap
}())
