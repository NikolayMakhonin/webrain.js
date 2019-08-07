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
import {ThenableSyncIterator} from '../helpers/ThenableSync'
import {getObjectUniqueId} from './helpers/object-unique-id'
import {fillMap} from './helpers/set'

interface TNumberObject<K, V> {
	[id: number]: [K, V],
}

export class ObjectHashMap<K, V> implements
	Map<K, V>,
	IMergeable<ObjectHashMap<K, V>, TNumberObject<K, V>>,
	ISerializable
{
	private readonly _object: TNumberObject<K, V>

	constructor(object?: TNumberObject<K, V>) {
		this._object = object || {} as any
	}

	public set(key: K, value: V): this {
		const id = getObjectUniqueId(key)
		this._object[id] = [key, value]
		return this
	}

	public clear(): this {
		const {_object} = this
		for (const id in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, id)) {
				delete _object[id]
			}
		}

		return this
	}

	public delete(key: K): boolean {
		const {_object} = this
		const id = getObjectUniqueId(key)
		if (!Object.prototype.hasOwnProperty.call(_object, id)) {
			return false
		}

		delete _object[id]

		return true
	}

	public readonly [Symbol.toStringTag]: string = 'Map'
	public get size(): number {
		return Object.keys(this._object).length
	}

	public [Symbol.iterator](): IterableIterator<[K, V]> {
		return this.entries()
	}

	public *entries(): IterableIterator<[K, V]> {
		const {_object} = this
		for (const id in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, id)) {
				yield _object[id]
			}
		}
	}

	public forEach(
		callbackfn: (value: V, key: K, map: Map<K, V>) => void,
		thisArg?: any,
	): void {
		const {_object} = this
		for (const id in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, id)) {
				const entry = _object[id]
				callbackfn.call(thisArg, entry[1], entry[0], this)
			}
		}
	}

	public get(key: K): V | undefined {
		const id = getObjectUniqueId(key)
		const entry = this._object[id]
		return entry && entry[1]
	}

	public has(key: K): boolean {
		const id = getObjectUniqueId(key)
		return Object.prototype.hasOwnProperty.call(this._object, id)
	}

	public *keys(): IterableIterator<K> {
		const {_object} = this
		for (const id in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, id)) {
				const entry = _object[id]
				yield entry[0]
			}
		}
	}

	// tslint:disable-next-line:no-identical-functions
	public *values(): IterableIterator<V> {
		const {_object} = this
		for (const id in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, id)) {
				const entry = _object[id]
				yield entry[1]
			}
		}
	}

	// region IMergeable

	public _canMerge(source: ObjectHashMap<K, V>): boolean {
		if (source.constructor === ObjectHashMap
			&& this._object === (source as ObjectHashMap<K, V>)._object
		) {
			return null
		}

		return source[Symbol.toStringTag] === 'Map'
			|| Array.isArray(source)
			|| isIterable(source)
	}

	public _merge(
		merge: IMergeValue,
		older: ObjectHashMap<K, V> | TNumberObject<K, V>,
		newer: ObjectHashMap<K, V> | TNumberObject<K, V>,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeOptions,
	): boolean {
		return mergeMaps(
			(target, source) => createMergeMapWrapper(
				target,
				source,
				arrayOrIterable => fillMap(new ObjectHashMap(), arrayOrIterable)),
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

	public static uuid: string = '7a5731ae-37ad-4c5b-aee0-25a8f1cd2228'

	public serialize(serialize: ISerializeValue): ISerializedObject {
		return {
			object: serialize(this._object, { objectKeepUndefined: true }),
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

registerMergeable(ObjectHashMap)

registerSerializable(ObjectHashMap, {
	serializer: {
		*deSerialize<K, V>(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory: (map?: { [id: number]: [K, V] }) => ObjectHashMap<K, V>,
		): ThenableSyncIterator<ObjectHashMap<K, V>> {
			const innerMap = yield deSerialize<{ [id: number]: [K, V] }>(serializedValue.object)
			const value = valueFactory(innerMap)
			value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})
