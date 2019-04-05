import {MapChangedObject} from './base/MapChangedObject'
import {MapChangedType} from './contracts/IMapChanged'

export class ObservableMap<K, V> extends MapChangedObject<K, V> implements Map<K, V> {
	private readonly _map: Map<K, V>

	constructor({
		map,
	}: {
		map?: Map<K, V>,
	} = {}) {
		super()
		this._map = map || new Map<T>()
	}

	public set(key: K, value: V): this {
		return undefined
	}

	public add(value: T): this {
		const {_map} = this
		const oldSize = _map.size

		this._map.add(value)

		const size = _map.size
		if (size > oldSize) {
			this.onMapChanged({
				type: MapChangedType.Added,
				newItem: value,
			})
			this.onPropertyChanged({
				name: 'size',
				oldValue: oldSize,
				newValue: size,
			})
		}

		return this
	}

	public clear(): void {
		const {size} = this
		if (size === 0) {
			return
		}

		const {_mapChangedIfCanEmit} = this
		if (_mapChangedIfCanEmit) {
			const oldItems = Array.from(this)

			this._map.clear()

			for (let i = 0, len = oldItems.length; i < len; i++) {
				this.onMapChanged({
					type: MapChangedType.Removed,
					oldItem: oldItems[i],
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

	public delete(value: T): boolean {
		const {_map} = this
		const oldSize = _map.size

		const result = this._map.delete(value)

		const size = _map.size
		if (size < oldSize) {
			this.onMapChanged({
				type: MapChangedType.Removed,
				oldItem: value,
			})
			this.onPropertyChanged({
				name: 'size',
				oldValue: oldSize,
				newValue: size,
			})
		}

		return result
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
		this._map.forEach(callbackfn, thisArg)
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
