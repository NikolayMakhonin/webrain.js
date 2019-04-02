import {CollectionChangedObject} from './CollectionChangedObject'
import {CollectionChangedType} from './contracts/ICollectionChanged'
import {IEqualityCompare} from './contracts/ICompare'
import {move} from "./helpers/array";

function calcOptimalArraySize(desiredSize: number) {
	let optimalSize = 4
	while (desiredSize > optimalSize) {
		optimalSize <<= 1
	}
	return optimalSize
}

function getDefaultValue(value) {
	if (value === null || typeof value === 'undefined') {
		return value
	}
	if (typeof value === 'number') {
		return 0
	}
	if (typeof value === 'boolean') {
		return false
	}
	return null
}

export class List<T> extends CollectionChangedObject<T> {
	// region constructor

	private _array: T[]

	constructor({
		array,
		minAllocatedSize,
		compare,
	}: {
		array?: T[],
		minAllocatedSize?: number,
		compare?: IEqualityCompare<T>,
	} = {}) {
		super()

		this._array = array || []
		this._size = this._array.length

		if (minAllocatedSize) {
			this._minAllocatedSize = minAllocatedSize
		}

		if (compare) {
			this._compare = compare
		}
	}

	// endregion

	// region Properties

	// region minAllocatedSize

	private _minAllocatedSize: number
	public get minAllocatedSize(): number {
		return this._minAllocatedSize
	}

	public set minAllocatedSize(value: number) {
		this._minAllocatedSize = value
		this._updateAllocatedSize()
	}

	// endregion

	// region allocatedSize

	public get allocatedSize(): number {
		return this._array.length
	}

	private _updateAllocatedSize() {
		const {_array, _size, _minAllocatedSize} = this

		// We should not manually increment array size,
		// because push() method do it faster and guarantees
		// that the array will not be converted to hashTable

		if (_size * 2 < _array.length) {
			let newLength = _size * 2
			if (newLength < _minAllocatedSize) {
				newLength = _minAllocatedSize
			}
			newLength = calcOptimalArraySize(newLength)
			if (newLength < _array.length) {
				_array.length = newLength
			}
		}
	}

	// endregion

	// region size

	private _size: number

	public get size(): number {
		return this._size
	}

	private _setSize(newSize: number): number {
		const oldSize = this._size
		if (oldSize === newSize) {
			return newSize
		}

		this._size = newSize

		const {_array} = this

		this._updateAllocatedSize()

		// Clear not used space to free memory from unnecessary objects
		if (newSize < oldSize) {
			const defaultValue = getDefaultValue(_array[newSize === 0 ? 0 : newSize - 1])

			const newLength = _array.length
			for (let i = newSize; i < newLength; i++) {
				_array[i] = defaultValue
			}
		}

		return newSize
	}

	// endregion

	// region compare

	private _compare: IEqualityCompare<T>

	public get compare(): IEqualityCompare<T> {
		return this._compare
	}

	public set compare(value: IEqualityCompare<T>) {
		this._compare = value
	}

	// endregion

	// endregion

	// region Methods

	private static _prepareIndex(index: number, size: number): number {
		if (index < 0) {
			index += size
		}

		if (index < 0 || index >= size) {
			throw new Error(`index (${index}) is out of range [0..${size - 1}]`)
		}

		return index
	}

	private static _prepareStart(start: number, size: number) {
		if (start == null) {
			start = 0
		}

		if (start < 0) {
			start += size
		}

		if (start < 0) {
			throw new Error(`start (${start}) < 0`)
		}

		return start
	}

	private static _prepareEnd(end: number, size: number) {
		if (end == null) {
			end = size
		}

		if (end < 0) {
			end += size + 1
		}

		if (end > size) {
			throw new Error(`end (${end}) > size (${size})`)
		}

		return end
	}

	public get(index: number) {
		const {_size, _array} = this

		index = List._prepareIndex(index, _size)

		return _array[index]
	}

	public set(index: number, item: T): boolean {
		const {_size, _array} = this

		index = List._prepareIndex(index, _size + 1)

		if (index >= _size) {
			this._setSize(_size + 1)
		}

		const {_collectionChangedIfCanEmit} = this
		if (_collectionChangedIfCanEmit) {
			const oldItem = _array[index]

			_array[index] = item

			if (index >= _size) {
				_collectionChangedIfCanEmit.emit({
					type: CollectionChangedType.Added,
					index,
					newItems: [item],
					shiftIndex: index,
				})
			} else {
				_collectionChangedIfCanEmit.emit({
					type: CollectionChangedType.Set,
					index,
					oldItems: [oldItem],
					newItems: [item],
				})
			}
		} else {
			_array[index] = item
		}

		return true
	}

	public add(item: T): boolean {
		const {_size, _array} = this
		this._setSize(_size + 1)
		_array[_size] = item

		const {_collectionChangedIfCanEmit} = this
		if (_collectionChangedIfCanEmit) {
			_collectionChangedIfCanEmit.emit({
				type: CollectionChangedType.Added,
				index: _size,
				newItems: [item],
				shiftIndex: _size,
			})
		}

		return true
	}

	public addArray(sourceItems: T[], sourceStart?: number, sourceEnd?: number): boolean {
		return this.insertArray(this._size, sourceItems, sourceStart, sourceEnd)
	}

	public addIterable(items: Iterable<T>, itemsSize: number): boolean {
		return this.insertIterable(this._size, items, itemsSize)
	}

	public insert(index: number, item: T): boolean {
		const {_size, _array} = this

		const newSize = _size + 1

		index = List._prepareIndex(index, newSize)

		this._setSize(newSize)

		for (let i = newSize - 1; i > index; i--) {
			_array[i] = _array[i - 1]
		}

		_array[index] = item

		const {_collectionChangedIfCanEmit} = this
		if (_collectionChangedIfCanEmit) {
			_collectionChangedIfCanEmit.emit({
				type: CollectionChangedType.Added,
				index,
				newItems: [item],
				shiftIndex: index < _size ? index + 1 : index,
			})
		}

		return true
	}

	public insertArray(index: number, sourceItems: T[], sourceStart?: number, sourceEnd?: number): boolean {
		const {_size, _array} = this

		let itemsSize = sourceItems.length

		index = List._prepareIndex(index, _size + 1)
		sourceStart = List._prepareStart(sourceStart, itemsSize)
		sourceEnd = List._prepareEnd(sourceEnd, itemsSize)

		itemsSize = sourceEnd - sourceStart
		if (itemsSize <= 0) {
			return false
		}

		const newSize = _size + itemsSize

		this._setSize(newSize)

		for (let i = newSize - 1 - itemsSize; i >= index; i--) {
			_array[i + itemsSize] = _array[i]
		}

		for (let i = 0; i < itemsSize; i++) {
			_array[index + i] = sourceItems[sourceStart + i]
		}

		const {_collectionChangedIfCanEmit} = this
		if (_collectionChangedIfCanEmit) {
			_collectionChangedIfCanEmit.emit({
				type: CollectionChangedType.Added,
				index,
				newItems: _array.slice(index, index + itemsSize),
				shiftIndex: index < _size ? index + itemsSize : index,
			})
		}

		return true
	}

	public insertIterable(index: number, items: Iterable<T>, itemsSize: number): boolean {
		const {_size, _array} = this

		if (itemsSize <= 0) {
			return false
		}

		if (Array.isArray(items)) {
			return this.insertArray(index, items, null, itemsSize)
		}

		const start = List._prepareIndex(index, _size + 1)
		const end = start + itemsSize

		const newSize = _size + itemsSize

		this._setSize(newSize)

		let i

		for (i = newSize - 1 - itemsSize; i >= start; i--) {
			_array[i + itemsSize] = _array[i]
		}

		i = start
		for (const item of items) {
			_array[i++] = item
			if (i >= end) {
				break
			}
		}

		if (i !== end) {
			// rollback
			try {
				this._collectionChangedDisabled = true
				this.removeRange(start, end)
			} finally {
				this._collectionChangedDisabled = false
			}

			throw new Error(`Iterable items size (${i - start}) less than itemsSize (${itemsSize})`)
		}

		const {_collectionChangedIfCanEmit} = this
		if (_collectionChangedIfCanEmit) {
			_collectionChangedIfCanEmit.emit({
				type: CollectionChangedType.Added,
				index: start,
				newItems: _array.slice(start, end),
				shiftIndex: start < _size ? end : start,
			})
		}

		return true
	}

	public removeAt(index: number, withoutShift?: boolean): boolean {
		const {_size, _array} = this

		index = List._prepareIndex(index, _size)

		const {_collectionChangedIfCanEmit} = this
		let oldItems

		if (_collectionChangedIfCanEmit) {
			oldItems = [_array[index]]
		}

		if (withoutShift) {
			_array[index] = _array[_size - 1]
		} else {
			for (let i = index + 1; i < _size; i++) {
				_array[i - 1] = _array[i]
			}
		}

		this._setSize(_size - 1)

		if (_collectionChangedIfCanEmit) {
			_collectionChangedIfCanEmit.emit({
				type: CollectionChangedType.Removed,
				index,
				oldItems,
				shiftIndex: index < _size - 1
					? (withoutShift ? _size - 1 : index + 1)
					: index,
			})
		}

		return true
	}

	public removeRange(start: number, end?: number, withoutShift?: boolean): boolean {
		const {_size, _array} = this

		start = List._prepareStart(start, _size)
		end = List._prepareEnd(end, _size)

		const removeSize = end - start

		if (removeSize <= 0) {
			return false
		}

		const {_collectionChangedIfCanEmit} = this
		let oldItems

		if (_collectionChangedIfCanEmit) {
			oldItems = _array.slice(start, end)
		}

		if (!withoutShift) {
			withoutShift = removeSize < _size - end
		}

		if (withoutShift) {
			for (let i = start; i < end; i++) {
				_array[i] = _array[_size - end + i]
			}
		} else {
			for (let i = end; i < _size; i++) {
				_array[i - removeSize] = _array[i]
			}
		}

		this._setSize(_size - removeSize)

		if (_collectionChangedIfCanEmit) {
			_collectionChangedIfCanEmit.emit({
				type: CollectionChangedType.Removed,
				index: start,
				oldItems,
				shiftIndex: end < _size
					? (withoutShift ? _size - removeSize : end)
					: start,
			})
		}

		return true
	}

	public remove(item: T, withoutShift?: boolean): boolean {
		const index = this.indexOf(item, null, null, 1)

		if (index < 0) {
			return false
		}

		this.removeAt(index, withoutShift)

		return true
	}

	public move(oldIndex: number, newIndex: number): boolean {
		if (oldIndex === newIndex) {
			return false
		}

		const {_size, _array} = this

		oldIndex = List._prepareIndex(oldIndex, _size)
		newIndex = List._prepareIndex(newIndex, _size)

		const moveItem = _array[oldIndex]
		const step = (newIndex > oldIndex) ? 1 : -1
		for (let i = oldIndex; i !== newIndex; i += step) {
			_array[i] = _array[i + step]
		}

		_array[newIndex] = moveItem

		const {_collectionChangedIfCanEmit} = this
		if (_collectionChangedIfCanEmit) {
			_collectionChangedIfCanEmit.emit({
				type: CollectionChangedType.Moved,
				index: oldIndex,
				moveSize: 1,
				moveIndex: newIndex,
			})
		}

		return true
	}

	public moveRange(start: number, end: number, moveIndex: number): boolean {
		if (start === moveIndex) {
			return false
		}

		const {_size, _array} = this

		start = List._prepareStart(start, _size)
		end = List._prepareStart(end, _size)
		moveIndex = List._prepareIndex(moveIndex, _size)
		const maxIndex = _size - end + start
		if (moveIndex > maxIndex) {
			moveIndex = maxIndex
		}

		if (!move(_array, start, end, moveIndex)) {
			return false
		}

		const {_collectionChangedIfCanEmit} = this
		if (_collectionChangedIfCanEmit) {
			_collectionChangedIfCanEmit.emit({
				type: CollectionChangedType.Moved,
				index: start,
				moveSize: end - start,
				moveIndex,
			})
		}

		return true
	}

	public indexOf(item: T, start?: number, end?: number, bound?: number): number {
		const {_size, _array, _compare} = this

		start = List._prepareStart(start, _size)
		end = List._prepareEnd(end, _size)

		if (bound == null || bound <= 0) {
			if (_compare) {
				for (let i = start; i < end; i++) {
					if (_compare(_array[i], item)) {
						return i
					}
				}
			} else {
				for (let i = start; i < end; i++) {
					if (_array[i] === item) {
						return i
					}
				}
			}
		} else {
			if (_compare) {
				for (let i = end - 1; i >= start; i--) {
					if (_compare(_array[i], item)) {
						return i
					}
				}
			} else {
				let last = -1
				for (let i = start; i < end; i++) {
					if (_array[i] === item) {
						last = i
					}
				}
				if (last >= 0) {
					return last
				}
			}
		}

		return ~_size
	}

	public contains(item: T): boolean {
		return this.indexOf(item) >= 0
	}

	public clear(): boolean {
		const {_size} = this
		if (_size === 0) {
			return false
		}

		const {_array, _collectionChangedIfCanEmit} = this
		let oldItems

		if (_collectionChangedIfCanEmit) {
			oldItems = _array.slice(0, _size)
		}

		this._setSize(0)

		if (_collectionChangedIfCanEmit) {
			_collectionChangedIfCanEmit.emit({
				type: CollectionChangedType.Removed,
				index: 0,
				oldItems,
				shiftIndex: 0,
			})
		}

		return true
	}

	public toArray(start?: number, end?: number): T[] {
		const {_size, _array} = this

		start = List._prepareStart(start, _size)
		end = List._prepareEnd(end, _size)

		return _array.slice(start, end)
	}

	public copyTo(destArray: T[], destIndex?: number, start?: number, end?: number): boolean {
		const {_size, _array} = this

		if (destIndex == null) {
			destIndex = 0
		}

		start = List._prepareStart(start, _size)
		end = List._prepareEnd(end, _size)

		if (end <= start) {
			return false
		}

		for (let i = start; i < end; i++) {
			destArray[destIndex - start + i] = _array[i]
		}

		return true
	}

	public *[Symbol.iterator](): Iterator<T> {
		const {_size, _array} = this
		for (let i = 0; i < _size; i++) {
			yield _array[i]
		}
	}

	// endregion
}
