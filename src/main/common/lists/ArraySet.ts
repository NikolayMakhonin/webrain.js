/* tslint:disable:ban-types */
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
import {registerSerializer} from '../extensions/serialization/serializers'
import {getObjectUniqueId} from './helpers/object-unique-id'
import {fillSet} from './helpers/set'

export class ArraySet<T extends Object> implements
	Set<T>,
	IMergeable<ArraySet<T>, T[] | Iterable<T>>,
	ISerializable
{
	private readonly _array: T[]
	private _size: number

	constructor(array?: T[], size?: number) {
		this._array = array || []
		this._size = size || Object.keys(this._array).length
	}

	public add(value: T): this {
		const {_array} = this
		const id = getObjectUniqueId(value)
		// if (Object.prototype.hasOwnProperty.call(_array, id)) {
		if (typeof _array[id] !== 'undefined') {
			return this
		}

		this._array[id] = value
		this._size++

		return this
	}

	public delete(value: T): boolean {
		const {_array} = this
		const id = getObjectUniqueId(value)
		// if (Object.prototype.hasOwnProperty.call(_array, id)) {
		if (typeof _array[id] === 'undefined') {
			return false
		}

		// tslint:disable-next-line:no-array-delete
		delete _array[id]
		this._size--

		return true
	}

	public clear(): this {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				// tslint:disable-next-line:no-array-delete
				delete _array[id]
			}
		}

		this._size = 0

		return this
	}

	public readonly [Symbol.toStringTag]: string = 'Set'
	public get size(): number {
		return this._size
	}

	public *[Symbol.iterator](): IterableIterator<T> {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				yield _array[id]
			}
		}
	}

	public *entries(): IterableIterator<[T, T]> {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				const value = _array[id]
				yield [value, value]
			}
		}
	}

	public forEach(
		callbackfn: (value: T, key: T, set: Set<T>) => void,
		thisArg?: any,
	): void {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				const value = _array[id]
				callbackfn.call(thisArg, value, value, this)
			}
		}
	}

	public has(value: T): boolean {
		return Object.prototype.hasOwnProperty.call(this._array, getObjectUniqueId(value))
	}

	public keys(): IterableIterator<T> {
		return this[Symbol.iterator]()
	}

	public values(): IterableIterator<T> {
		return this[Symbol.iterator]()
	}

	public static from<T>(arrayOrIterable: T[] | Iterable<T>): ArraySet<T> {
		return fillSet(new ArraySet<T>(), arrayOrIterable)
	}

	// region IMergeable

	public canMerge(source: ArraySet<T>): boolean {
		if (source.constructor === ArraySet
			&& this._array === (source as ArraySet<T>)._array
		) {
			return null
		}

		return source[Symbol.toStringTag] === 'Set'
			|| Array.isArray(source)
			|| Symbol.iterator in source
	}

	public merge(
		merge: IMergeValue,
		older: ArraySet<T> | T[] | Iterable<T>,
		newer: ArraySet<T> | T[] | Iterable<T>,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeOptions,
	): boolean {
		return mergeMaps(
			(target, source) => createMergeSetWrapper(
				target,
				source,
				arrayOrIterable => ArraySet.from(arrayOrIterable)),
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

	public static uuid: string = '0e8c7f09-ea9e-4631-8af8-a635c214a01c'

	public serialize(serialize: ISerializeValue): ISerializedObject {
		return {
			array: serialize(this._array, Object),
		}
	}

	// tslint:disable-next-line:no-empty
	public deSerialize(deSerialize: IDeSerializeValue, serializedValue: ISerializedObject) {

	}

	// endregion
}

registerMergeable(ArraySet)

registerSerializer(ArraySet, {
	uuid: ArraySet.uuid,
	serializer: {
		serialize(
			serialize: ISerializeValue,
			value: ArraySet<any>,
		): ISerializedObject {
			return value.serialize(serialize)
		},
		deSerialize<T>(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory?: (set?: T[]) => ArraySet<T>,
		): ArraySet<T> {
			// @ts-ignore
			const innerSet = deSerialize<T[]>(serializedValue.array, Object, () => [])
			const value = valueFactory
				? valueFactory(innerSet)
				: new ArraySet<T>(innerSet)
			value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})
