import {IMergeable, IMergeOptions, IMergeValue} from '../../../extensions/merge/contracts'
import {createMergeMapWrapper, mergeMaps} from '../../../extensions/merge/merge-maps'
import {registerMergeable} from '../../../extensions/merge/mergers'
import {
	IDeSerializeValue,
	ISerializable,
	ISerializedObject,
	ISerializeValue,
} from '../../../extensions/serialization/contracts'
import {registerSerializable} from '../../../extensions/serialization/serializers'
import {isIterable} from '../../../helpers/helpers'
import {webrainEquals} from '../../../helpers/webrainOptions'
import {fillMap} from '../../../lists/helpers/set'
import {ALWAYS_CHANGE_VALUE, invalidateCallState} from '../core/CallState'
import {depend, getCallState} from '../core/facade'

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

	// noinspection JSUnusedLocalSymbols
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

	public get size(): number {
		this.dependAnyKey()
		return this._map.size
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
		this.dependAnyValue()
		return this._map[Symbol.iterator]()
	}

	// endregion

	// region change methods

	public set(key: K, value: V): this {
		const {_map} = this
		const oldSize = _map.size
		const oldValue = _map.get(key)

		_map.set(key, value)

		if (_map.size !== oldSize) {
			invalidateCallState(getCallState(this.dependAnyKey).call(this))
			invalidateCallState(getCallState(this.dependKey).call(this, key))
		} else if (!webrainEquals(oldValue, value)) {
			invalidateCallState(getCallState(this.dependAnyValue).call(this))
			invalidateCallState(getCallState(this.dependValue).call(this, key))
		}

		return this
	}

	public delete(key: K): boolean {
		const {_map} = this
		const oldSize = _map.size

		this._map.delete(key)

		if (_map.size !== oldSize) {
			invalidateCallState(getCallState(this.dependAnyKey).call(this))
			invalidateCallState(getCallState(this.dependKey).call(this, key))
			return true
		}

		return false
	}

	public clear(): void {
		const {size} = this._map
		if (size === 0) {
			return
		}

		this._map.clear()

		invalidateCallState(getCallState(this.dependAll).call(this))
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
	public static uuid: string = 'd97c26caddd84a4d9748fd0f345f75fd'

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

DependMap.prototype.dependAll = depend(DependMap.prototype.dependAll, null, null, true)
DependMap.prototype.dependAnyKey = depend(DependMap.prototype.dependAnyKey, null, null, true)
DependMap.prototype.dependAnyValue = depend(DependMap.prototype.dependAnyValue, null, null, true)
DependMap.prototype.dependKey = depend(DependMap.prototype.dependKey, null, null, true)
DependMap.prototype.dependValue = depend(DependMap.prototype.dependValue, null, null, true)

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
