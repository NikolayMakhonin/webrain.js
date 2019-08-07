import {IMergeable, IMergeOptions, IMergeValue} from '../extensions/merge/contracts'
import {mergeMaps} from '../extensions/merge/merge-maps'
import {createMergeSetWrapper} from '../extensions/merge/merge-sets'
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
import {fillObjectKeys} from './helpers/set'

export class ObjectSet implements
	Set<string>,
	IMergeable<ObjectSet, string[] | Iterable<string>>,
	ISerializable,
	ISerializable
{
	private readonly _object: object

	constructor(object?: object) {
		this._object = object || {}
	}

	public add(value: string): this {
		this._object[value] = true
		return this
	}

	public delete(value: string): boolean {
		const {_object} = this
		if (!Object.prototype.hasOwnProperty.call(_object, value)) {
			return false
		}

		delete _object[value]

		return true
	}

	public clear(): this {
		const {_object} = this
		for (const value in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, value)) {
				delete _object[value]
			}
		}

		return this
	}

	public readonly [Symbol.toStringTag]: string = 'Set'
	public get size(): number {
		return Object.keys(this._object).length
	}

	public [Symbol.iterator](): IterableIterator<string> {
		return Object.keys(this._object)[Symbol.iterator]()
	}

	public *entries(): IterableIterator<[string, string]> {
		const {_object} = this
		for (const value in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, value)) {
				yield [value, value]
			}
		}
	}

	public forEach(
		callbackfn: (value: string, key: string, set: Set<string>) => void,
		thisArg?: any,
	): void {
		const {_object} = this
		for (const value in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, value)) {
				callbackfn.call(thisArg, value, value, this)
			}
		}
	}

	public has(value: string): boolean {
		return Object.prototype.hasOwnProperty.call(this._object, value)
	}

	public keys(): IterableIterator<string> {
		return this[Symbol.iterator]()
	}

	public values(): IterableIterator<string> {
		return this[Symbol.iterator]()
	}

	public static from(arrayOrIterable: string[] | Iterable<string>): ObjectSet {
		return new ObjectSet(fillObjectKeys({}, arrayOrIterable))
	}

	// region IMergeable

	public _canMerge(source: ObjectSet): boolean {
		if (source.constructor === ObjectSet
			&& this._object === (source as ObjectSet)._object
		) {
			return null
		}

		return source.constructor === Object
			|| source[Symbol.toStringTag] === 'Set'
			|| Array.isArray(source)
			|| isIterable(source)
	}

	public _merge(
		merge: IMergeValue,
		older: ObjectSet | string[] | Iterable<string>,
		newer: ObjectSet | string[] | Iterable<string>,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeOptions,
	): boolean {
		return mergeMaps(
			(target, source) => createMergeSetWrapper(
				target,
				source,
				arrayOrIterable => ObjectSet.from(arrayOrIterable)),
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

	public static uuid: string = '6988ebc9-cd06-4a9b-97a9-8415b8cf1dc4'

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

registerMergeable(ObjectSet)

registerSerializable(ObjectSet, {
	serializer: {
		*deSerialize<T>(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory: (object?: object) => ObjectSet,
		): ThenableSyncIterator<ObjectSet> {
			const innerSet = yield deSerialize<object>(serializedValue.object)
			const value = valueFactory(innerSet)
			value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})
