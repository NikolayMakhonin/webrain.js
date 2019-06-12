import {
	IDeSerializeValue,
	ISerializable,
	ISerializedObject, ISerializedTypedValue,
	ISerializedValueArray,
	ISerializeValue,
} from '../serialization/contracts'
import {deSerializeArray, registerSerializable, registerSerializer, serializeArray} from '../serialization/serializers';
import {SetChangedObject} from './base/SetChangedObject'
import {IObservableSet, SetChangedType} from './contracts/ISetChanged'

export class ObservableSet<T> extends SetChangedObject<T> implements IObservableSet<T>, ISerializable {
	private readonly _set: Set<T>

	constructor(set?: Set<T>) {
		super()
		this._set = set || new Set<T>()
	}

	public add(value: T): this {
		const {_set} = this
		const oldSize = _set.size

		this._set.add(value)

		const size = _set.size
		if (size > oldSize) {
			const {_setChangedIfCanEmit} = this
			if (_setChangedIfCanEmit) {
				_setChangedIfCanEmit.emit({
					type: SetChangedType.Added,
					newItems: [value],
				})
			}

			this.onPropertyChanged({
				name: 'size',
				oldValue: oldSize,
				newValue: size,
			})
		}

		return this
	}

	public delete(value: T): boolean {
		const {_set} = this
		const oldSize = _set.size

		this._set.delete(value)

		const size = _set.size
		if (size < oldSize) {
			const {_setChangedIfCanEmit} = this
			if (_setChangedIfCanEmit) {
				_setChangedIfCanEmit.emit({
					type: SetChangedType.Removed,
					oldItems: [value],
				})
			}

			this.onPropertyChanged({
				name: 'size',
				oldValue: oldSize,
				newValue: size,
			})

			return true
		}

		return false
	}

	public clear(): void {
		const {size} = this
		if (size === 0) {
			return
		}

		const {_setChangedIfCanEmit} = this
		if (_setChangedIfCanEmit) {
			const oldItems = Array.from(this)

			this._set.clear()

			_setChangedIfCanEmit.emit({
				type: SetChangedType.Removed,
				oldItems,
			})
		} else {
			this._set.clear()
		}

		this.onPropertyChanged({
			name: 'size',
			oldValue: size,
			newValue: 0,
		})
	}

	// region Unchanged Set methods

	public readonly [Symbol.toStringTag]: string = 'Set'

	public get size(): number {
		return this._set.size
	}

	public [Symbol.iterator](): IterableIterator<T> {
		return this._set[Symbol.iterator]()
	}

	public entries(): IterableIterator<[T, T]> {
		return this._set.entries()
	}

	public forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void {
		this._set.forEach((k, v, s) => callbackfn.call(thisArg, k, v, this))
	}

	public has(value: T): boolean {
		return this._set.has(value)
	}

	public keys(): IterableIterator<T> {
		return this._set.keys()
	}

	public values(): IterableIterator<T> {
		return this._set.values()
	}

	// endregion

	// region ISerializable

	public static uuid: string = '6988ebc9-cd06-4a9b-97a9-8415b8cf1dc4'

	public serialize(serialize: ISerializeValue): ISerializedObject {
		return {
			set: serialize(this._set),
		}
	}

	// tslint:disable-next-line:no-empty
	public deSerialize(deSerialize: IDeSerializeValue, serializedValue: ISerializedObject) {

	}

	// endregion
}

registerSerializer(ObservableSet, {
	uuid: 'dcd3ae30-4f69-479b-9fe9-24f7562b4340',
	serializer: {
		serialize(
			serialize: ISerializeValue,
			value: ObservableSet<any>,
		): ISerializedObject {
			return value.serialize(serialize)
		},
		deSerialize<T>(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory?: (set?: Set<T>) => ObservableSet<T>,
		): ObservableSet<T> {
			const innerSet = deSerialize<Set<T>>(serializedValue.set)
			const value = valueFactory
				? valueFactory(innerSet)
				: new ObservableSet<T>(innerSet)
			value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})
