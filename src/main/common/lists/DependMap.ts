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
import {invalidateCallState} from '../rx/depend/CallState'
import {depend, dependX, getCallState} from '../rx/depend/facade'
import {IObservableMap, MapChangedType} from './contracts/IMapChanged'
import {fillMap} from './helpers/set'

export class DependMap<K, V>
	implements Map<K, V>,
		IMergeable<DependMap<K, V>, object>,
		ISerializable
{
	private readonly _map: Map<K, V>

	constructor(
		map?: Map<K, V>,
	) {
		this._map = map || new Map<K, V>()
	}

	public readonly [Symbol.toStringTag]: string = 'Map'

	// region observe methods

	// tslint:disable-next-line:no-empty
	public observeAll() { }

	public observeKey(key: K) {
		this.observeAll()
	}

	public observeAnyKey() {
		this.observeAll()
	}

	public observeValue(key: K) {
		this.observeKey(key)
	}

	public observeAnyValue() {
		this.observeAnyKey()
	}

	// endregion

	// region read methods

	public get(key: K): V | undefined {
		this.observeValue(key)
		return this._map.get(key)
	}

	public has(key: K): boolean {
		this.observeKey(key)
		return this._map.has(key)
	}

	private _size(): number {
		this.observeAnyKey()
		return this._map.size
	}

	public get size(): number {
		return this._size()
	}

	public entries(): IterableIterator<[K, V]> {
		this.observeAnyValue()
		return this._map.entries()
	}

	public keys(): IterableIterator<K> {
		this.observeAnyKey()
		return this._map.keys()
	}

	public values(): IterableIterator<V> {
		this.observeAnyValue()
		return this._map.values()
	}

	public forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
		this.observeAnyValue()
		this._map.forEach((k, v) => callbackfn.call(thisArg, k, v, this))
	}

	public [Symbol.iterator](): IterableIterator<[K, V]> {
		return this.entries()
	}

	// endregion

	// region change methods

	public set(key: K, value: V): this {
		const {_map} = this
		const oldSize = _map.size
		const oldValue = _map.get(key)

		_map.set(key, value)

		if (_map.size !== oldSize) {
			invalidateCallState(getCallState(this.observeAnyKey)())
			invalidateCallState(getCallState(this.observeKey)(key))
		} else if (oldValue !== value) {
			invalidateCallState(getCallState(this.observeAnyValue)())
			invalidateCallState(getCallState(this.observeValue)(key))
		}

		return this
	}

	public delete(key: K): boolean {
		const {_map} = this
		const oldSize = _map.size

		this._map.delete(key)

		if (_map.size !== oldSize) {
			invalidateCallState(getCallState(this.observeAnyKey)())
			invalidateCallState(getCallState(this.observeKey)(key))
			return true
		}

		return false
	}

	public clear(): void {
		const {size} = this._map
		if (size === 0) {
			return
		}

		invalidateCallState(getCallState(this.observeAll)())
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

	// noinspection SpellCheckingInspection
	public static uuid: string = 'e162178d51234beaab6eb96d5b8f130b'

	public serialize(serialize: ISerializeValue): ISerializedObject {
		return {
			map: serialize(this._map),
		}
	}

	public deSerialize(
		// deSerialize: IDeSerializeValue,
		// serializedValue: ISerializedObject,
	// tslint:disable-next-line:no-empty
	): void {

	}

	// endregion
}

DependMap.prototype.observeAll = depend(DependMap.prototype.observeAll, null, true)
DependMap.prototype.observeAnyKey = depend(DependMap.prototype.observeAnyKey, null, true)
DependMap.prototype.observeAnyValue = depend(DependMap.prototype.observeAnyValue, null, true)
DependMap.prototype.observeKey = depend(DependMap.prototype.observeKey, null, true)
DependMap.prototype.observeValue = depend(DependMap.prototype.observeValue, null, true)

registerMergeable(DependMap)

registerSerializable(DependMap, {
	serializer: {
		*deSerialize<K, V>(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory: (map?: Map<K, V>) => DependMap<K, V>,
		): ThenableIterator<DependMap<K, V>> {
			const innerMap = yield deSerialize<Map<K, V>>(serializedValue.map)
			const value = valueFactory(innerMap)
			// value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})
