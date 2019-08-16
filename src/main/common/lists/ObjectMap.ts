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
import {fillMap} from './helpers/set'

export class ObjectMap<V> implements
	Map<string, V>,
	IMergeable<ObjectMap<V>, object>,
	ISerializable
{
	private readonly _object: object

	constructor(object?: object) {
		this._object = object || {}
	}

	public set(key: string, value: V): this {
		this._object[key] = value
		return this
	}

	public clear(): this {
		const {_object} = this
		for (const key in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, key)) {
				delete _object[key]
			}
		}

		return this
	}

	public delete(key: string): boolean {
		const {_object} = this
		if (!Object.prototype.hasOwnProperty.call(_object, key)) {
			return false
		}

		delete _object[key]

		return true
	}

	public readonly [Symbol.toStringTag]: string = 'Map'
	public get size(): number {
		return Object.keys(this._object).length
	}

	public [Symbol.iterator](): IterableIterator<[string, V]> {
		return this.entries()
	}

	public *entries(): IterableIterator<[string, V]> {
		const {_object} = this
		for (const key in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, key)) {
				yield [key, _object[key]]
			}
		}
	}

	public forEach(
		callbackfn: (value: V, key: string, map: Map<string, V>) => void,
		thisArg?: any,
	): void {
		const {_object} = this
		for (const key in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, key)) {
				callbackfn.call(thisArg, _object[key], key, this)
			}
		}
	}

	public get(key: string): V | undefined {
		return this._object[key]
	}

	public has(key: string): boolean {
		return Object.prototype.hasOwnProperty.call(this._object, key)
	}

	public keys(): IterableIterator<string> {
		return Object.keys(this._object)[Symbol.iterator]()
	}

	public values(): IterableIterator<V> {
		return Object.values(this._object)[Symbol.iterator]()
	}

	// region IMergeable

	public _canMerge(source: ObjectMap<V>|object): boolean {
		if (source.constructor === ObjectMap
			&& this._object === (source as ObjectMap<V>)._object
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
		older: ObjectMap<V> | object,
		newer: ObjectMap<V> | object,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeOptions,
	): boolean {
		return mergeMaps(
			(target, source) => createMergeMapWrapper(
				target,
				source,
				arrayOrIterable => fillMap(new ObjectMap(), arrayOrIterable)),
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

	public static uuid: string = '62388f07-b21a-4778-8b38-58f225cdbd42'

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

registerMergeable(ObjectMap)

registerSerializable(ObjectMap, {
	serializer: {
		*deSerialize<V>(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory: (map?: object) => ObjectMap<V>,
		): ThenableIterator<ObjectMap<V>> {
			const innerMap = yield deSerialize<object>(serializedValue.object)
			const value = valueFactory(innerMap)
			value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})
