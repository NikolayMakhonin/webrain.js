import {MapChangedObject} from './base/MapChangedObject'
import {IObservableMap, MapChangedType} from './contracts/IMapChanged'

export class ObservableMap<K, V> extends MapChangedObject<K, V> implements IObservableMap<K, V> {
	private readonly _map: Map<K, V>

	constructor(
		map?: Map<K, V>,
	) {
		super()
		this._map = map || new Map<K, V>()
	}

	public set(key: K, value: V): this {
		const {_map} = this
		const oldSize = _map.size
		const oldValue = _map.get(key)

		_map.set(key, value)

		const size = _map.size
		if (size > oldSize) {
			const {_mapChangedIfCanEmit} = this
			if (_mapChangedIfCanEmit) {
				_mapChangedIfCanEmit.emit({
					type: MapChangedType.Added,
					key,
					newValue: value,
				})
			}

			this.onPropertyChanged({
				name: 'size',
				oldValue: oldSize,
				newValue: size,
			})
		} else {
			const {_mapChangedIfCanEmit} = this
			if (_mapChangedIfCanEmit) {
				_mapChangedIfCanEmit.emit({
					type: MapChangedType.Set,
					key,
					oldValue,
					newValue: value,
				})
			}
		}

		return this
	}

	public delete(key: K): boolean {
		const {_map} = this
		const oldSize = _map.size
		const oldValue = _map.get(key)

		this._map.delete(key)

		const size = _map.size
		if (size < oldSize) {
			const {_mapChangedIfCanEmit} = this
			if (_mapChangedIfCanEmit) {
				_mapChangedIfCanEmit.emit({
					type: MapChangedType.Removed,
					key,
					oldValue,
				})
			}

			this.onPropertyChanged({
				name: 'size',
				oldValue: oldSize,
				newValue: size,
			})

			return true
		}

		return false
	}

	public clear(): void {
		const {size} = this
		if (size === 0) {
			return
		}

		const {_mapChangedIfCanEmit} = this
		if (_mapChangedIfCanEmit) {
			const oldItems = Array.from(this.entries())

			this._map.clear()

			for (let i = 0, len = oldItems.length; i < len; i++) {
				const oldItem = oldItems[i]
				_mapChangedIfCanEmit.emit({
					type: MapChangedType.Removed,
					key: oldItem[0],
					oldValue: oldItem[1],
				})
			}
		} else {
			this._map.clear()
		}

		this.onPropertyChanged({
			name: 'size',
			oldValue: size,
			newValue: 0,
		})
	}

	// region Unchanged Map methods

	public get [Symbol.toStringTag](): 'Map' {
		return this._map[Symbol.toStringTag]
	}

	public get size(): number {
		return this._map.size
	}

	public [Symbol.iterator](): IterableIterator<[K, V]> {
		return this._map[Symbol.iterator]()
	}

	public get(key: K): V | undefined {
		return this._map.get(key)
	}

	public entries(): IterableIterator<[K, V]> {
		return this._map.entries()
	}

	public forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
		this._map.forEach((k, v, s) => callbackfn.call(thisArg, k, v, this))
	}

	public has(key: K): boolean {
		return this._map.has(key)
	}

	public keys(): IterableIterator<K> {
		return this._map.keys()
	}

	public values(): IterableIterator<V> {
		return this._map.values()
	}

	// endregion
}
