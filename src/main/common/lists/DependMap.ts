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
import {ALWAYS_CHANGE_VALUE, invalidateCallState} from '../rx/depend/CallState'
import {depend, getCallState} from '../rx/depend/facade'
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

	// region depend methods

	public dependAll() {
		return ALWAYS_CHANGE_VALUE
	}

	public dependKey(key: K) {
		this.dependAll()
		return ALWAYS_CHANGE_VALUE
	}

	public dependAnyKey() {
		this.dependAll()
		return ALWAYS_CHANGE_VALUE
	}

	public dependValue(key: K) {
		this.dependKey(key)
		return ALWAYS_CHANGE_VALUE
	}

	public dependAnyValue() {
		this.dependAnyKey()
		return ALWAYS_CHANGE_VALUE
	}

	// endregion

	// region read methods

	public get(key: K): V | undefined {
		this.dependValue(key)
		return this._map.get(key)
	}

	public has(key: K): boolean {
		this.dependKey(key)
		return this._map.has(key)
	}

	private _size(): number {
		this.dependAnyKey()
		return this._map.size
	}

	public get size(): number {
		return this._size()
	}

	public entries(): IterableIterator<[K, V]> {
		this.dependAnyValue()
		return this._map.entries()
	}

	public keys(): IterableIterator<K> {
		this.dependAnyKey()
		return this._map.keys()
	}

	public values(): IterableIterator<V> {
		this.dependAnyValue()
		return this._map.values()
	}

	public forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
		this.dependAnyValue()
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
			invalidateCallState(getCallState(this.dependAnyKey)())
			invalidateCallState(getCallState(this.dependKey)(key))
		} else if (oldValue !== value) {
			invalidateCallState(getCallState(this.dependAnyValue)())
			invalidateCallState(getCallState(this.dependValue)(key))
		}

		return this
	}

	public delete(key: K): boolean {
		const {_map} = this
		const oldSize = _map.size

		this._map.delete(key)

		if (_map.size !== oldSize) {
			invalidateCallState(getCallState(this.dependAnyKey)())
			invalidateCallState(getCallState(this.dependKey)(key))
			return true
		}

		return false
	}

	public clear(): void {
		const {size} = this._map
		if (size === 0) {
			return
		}

		invalidateCallState(getCallState(this.dependAll)())
	}

	// endregion

	// region IMergeable

	public _canMerge(source: DependMap<K, V>): boolean {
		const {_map} = this
		if ((_map as any).canMerge) {
			return (_map as any).canMerge(source)
		}

		if (source.constructor === DependMap
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
		older: DependMap<K, V> | object,
		newer: DependMap<K, V> | object,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeOptions,
	): boolean {
		this.dependAnyValue()
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
		this.dependAnyValue()
		return {
			map: serialize(this._map),
		}
	}

	public deSerialize(
		// deSerialize: IDeSerializeValue,
		// serializedValue: ISerializedObject,
	): void {
		// empty
	}

	// endregion
}

DependMap.prototype.dependAll = depend(DependMap.prototype.dependAll, null, true)
DependMap.prototype.dependAnyKey = depend(DependMap.prototype.dependAnyKey, null, true)
DependMap.prototype.dependAnyValue = depend(DependMap.prototype.dependAnyValue, null, true)
DependMap.prototype.dependKey = depend(DependMap.prototype.dependKey, null, true)
DependMap.prototype.dependValue = depend(DependMap.prototype.dependValue, null, true)

registerMergeable(DependMap)

registerSerializable(DependMap, {
	serializer: {
		*deSerialize<K, V>(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory: (map?: Map<K, V>) => DependMap<K, V>,
		): Iterator<DependMap<K, V>|any> {
			const innerMap = yield deSerialize<Map<K, V>>(serializedValue.map)
			const value = valueFactory(innerMap)
			// value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})
