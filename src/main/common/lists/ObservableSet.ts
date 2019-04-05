import {SetChangedObject} from './base/SetChangedObject'
import {SetChangedType} from './contracts/ISetChanged'

export class ObservableSet<T> extends SetChangedObject<T> implements Set<T> {
	private readonly _set: Set<T>

	constructor({
		set,
	}: {
		set?: Set<T>,
	} = {}) {
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

			this.onSetChanged({
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

	public get [Symbol.toStringTag](): 'Set' {
		return this._set[Symbol.toStringTag]
	}

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
		this._set.forEach(callbackfn, thisArg)
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
}
