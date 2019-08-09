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

export class ArrayMap<K extends object, V> implements
	Map<K, V>,
	IMergeable<ArrayMap<K, V>, ArrayMap<K, V>>,
	ISerializable
{
	private readonly _array: Array<[K, V]>

	constructor(array?: Array<[K, V]>) {
		this._array = array || []
	}

	public set(key: K, value: V): this {
		const id = getObjectUniqueId(key)
		this._array[id] = [key, value]
		return this
	}

	public clear(): this {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				delete _array[id]
			}
		}

		return this
	}

	public delete(key: K): boolean {
		const {_array} = this
		const id = getObjectUniqueId(key)
		if (!Object.prototype.hasOwnProperty.call(_array, id)) {
			return false
		}

		delete _array[id]

		return true
	}

	public readonly [Symbol.toStringTag]: string = 'Map'
	public get size(): number {
		return Object.keys(this._array).length
	}

	public [Symbol.iterator](): IterableIterator<[K, V]> {
		return this.entries()
	}

	public *entries(): IterableIterator<[K, V]> {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				yield _array[id]
			}
		}
	}

	public forEach(
		callbackfn: (value: V, key: K, map: Map<K, V>) => void,
		thisArg?: any,
	): void {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				const entry = _array[id]
				callbackfn.call(thisArg, entry[1], entry[0], this)
			}
		}
	}

	public get(key: K): V | undefined {
		const id = getObjectUniqueId(key)
		if (!Object.prototype.hasOwnProperty.call(this._array, id)) {
			return void 0
		}
		return this._array[id][1]
	}

	public has(key: K): boolean {
		const id = getObjectUniqueId(key)
		return Object.prototype.hasOwnProperty.call(this._array, id)
	}

	public *keys(): IterableIterator<K> {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				const entry = _array[id]
				yield entry[0]
			}
		}
	}

	// tslint:disable-next-line:no-identical-functions
	public *values(): IterableIterator<V> {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				const entry = _array[id]
				yield entry[1]
			}
		}
	}

	// region IMergeable

	public _canMerge(source: ArrayMap<K, V>): boolean {
		if (source.constructor === ArrayMap
			&& this._array === (source as ArrayMap<K, V>)._array
		) {
			return null
		}

		return source[Symbol.toStringTag] === 'Map'
			|| Array.isArray(source)
			|| isIterable(source)
	}

	public _merge(
		merge: IMergeValue,
		older: ArrayMap<K, V> | object,
		newer: ArrayMap<K, V> | object,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeOptions,
	): boolean {
		return mergeMaps(
			(target, source) => createMergeMapWrapper(
				target,
				source,
				arrayOrIterable => fillMap(new ArrayMap(), arrayOrIterable)),
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

	public static uuid: string = 'ef0ced8a-58f7-4381-b850-3b09c0a42eed'

	public serialize(serialize: ISerializeValue): ISerializedObject {
		return {
			array: serialize(this._array, { arrayAsObject: true, objectKeepUndefined: true }),
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

registerMergeable(ArrayMap)

registerSerializable(ArrayMap, {
	serializer: {
		*deSerialize<K extends object, V>(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory: (map?: Array<[K, V]>) => ArrayMap<K, V>,
		): ThenableSyncIterator<ArrayMap<K, V>> {
			// @ts-ignore
			const innerMap = yield deSerialize<Array<[K, V]>>(serializedValue.array, null, { arrayAsObject: true })
			const value = valueFactory(innerMap)
			value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})
