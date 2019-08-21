import {ThenableIterator} from '../async/async'
import {IMergeable, IMergeOptions, IMergeValue} from '../extensions/merge/contracts'
import {createMergeMapWrapper, mergeMaps} from '../extensions/merge/merge-maps'
import {registerMergeable} from '../extensions/merge/mergers'
import {
	IDeSerializeValue,
	ISerializable,
	ISerializedObject,
	ISerializeValue,
} from '../extensions/serialization/contracts'
import {registerSerializable} from '../extensions/serialization/serializers'
import {isIterable} from '../helpers/helpers'
import {MapChangedObject} from './base/MapChangedObject'
import {IObservableMap, MapChangedType} from './contracts/IMapChanged'
import {fillMap} from './helpers/set'

export class ObservableMap<K, V>
	extends MapChangedObject<K, V>
	implements IObservableMap<K, V>,
		IMergeable<ObservableMap<K, V>, object>,
		ISerializable
{
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

			const {propertyChangedIfCanEmit} = this
			if (propertyChangedIfCanEmit) {
				propertyChangedIfCanEmit.onPropertyChanged({
					name: 'size',
					oldValue: oldSize,
					newValue: size,
				})
			}
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

			const {propertyChangedIfCanEmit} = this
			if (propertyChangedIfCanEmit) {
				propertyChangedIfCanEmit.onPropertyChanged({
					name: 'size',
					oldValue: oldSize,
					newValue: size,
				})
			}

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

		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			propertyChangedIfCanEmit.onPropertyChanged({
				name: 'size',
				oldValue: size,
				newValue: 0,
			})
		}
	}

	// region Unchanged Map methods

	public readonly [Symbol.toStringTag]: string = 'Map'

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

	// region IMergeable

	public _canMerge(source: ObservableMap<K, V>): boolean {
		const {_map} = this
		if ((_map as any).canMerge) {
			return (_map as any).canMerge(source)
		}

		if (source.constructor === ObservableMap
			&& this._map === source._map
		) {
			return null
		}

		return source.constructor === Object
			|| source[Symbol.toStringTag] === 'Map'
			|| Array.isArray(source)
			|| isIterable(source)
	}

	public _merge(
		merge: IMergeValue,
		older: ObservableMap<K, V> | object,
		newer: ObservableMap<K, V> | object,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeOptions,
	): boolean {
		return mergeMaps(
			(target, source) => createMergeMapWrapper(
				target,
				source,
				arrayOrIterable => fillMap(new (this._map.constructor as any)(), arrayOrIterable)),
			merge,
			this,
			older,
			newer,
			preferCloneOlder,
			preferCloneNewer,
			options,
		)
	}

	// endregion

	// region ISerializable

	public static uuid: string = 'e162178d-5123-4bea-ab6e-b96d5b8f130b'

	public serialize(serialize: ISerializeValue): ISerializedObject {
		return {
			map: serialize(this._map),
		}
	}

	public deSerialize(
		deSerialize: IDeSerializeValue,
		serializedValue: ISerializedObject,
	// tslint:disable-next-line:no-empty
	): void {

	}

	// endregion
}

registerMergeable(ObservableMap)

registerSerializable(ObservableMap, {
	serializer: {
		*deSerialize<K, V>(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory: (map?: Map<K, V>) => ObservableMap<K, V>,
		): ThenableIterator<ObservableMap<K, V>> {
			const innerMap = yield deSerialize<Map<K, V>>(serializedValue.map)
			const value = valueFactory(innerMap)
			value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})
