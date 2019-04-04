import {CollectionChangedObject} from './CollectionChangedObject'
import {CollectionChangedType} from './contracts/ICollectionChanged'
import {ICompare, IEquals} from './contracts/ICompare'
import {binarySearch, move} from './helpers/array'

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

export function compareDefault(o1, o2) {
	if (o1 > o2) {
		return 1
	} else if (o2 > o1) {
		return -1
	} else {
		if (o1 !== o2) {
			throw new Error(`Compare values is not supported: ${typeof o1}, ${typeof o2}`)
		}
		return 0
	}
}

export class List<T> extends CollectionChangedObject<T> {
	// region constructor

	private _array: T[]

	constructor({
		array,
		minAllocatedSize,
		compare,
		autoSort,
		notAddIfExists,
		countSorted,
	}: {
		array?: T[],
		minAllocatedSize?: number,
		compare?: ICompare<T>,
		autoSort?: boolean,
		notAddIfExists?: boolean,
		countSorted?: number,
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

		if (autoSort) {
			this._autoSort = !!autoSort
		}

		if (notAddIfExists) {
			this._notAddIfExists = !!notAddIfExists
		}

		this._countSorted = countSorted || 0
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

	private _compare: ICompare<T>

	public get compare(): ICompare<T> {
		return this._compare
	}

	public set compare(value: ICompare<T>) {
		this._compare = value
	}

	// endregion

	// region countSorted

	private _countSorted: number

	public get countSorted(): number {
		return this._countSorted
	}

	// endregion

	// region autoSort

	private _autoSort: boolean

	public get autoSort(): boolean {
		return this._autoSort
	}

	public set autoSort(value: boolean) {
		value = !!value

		if (this._autoSort === value) {
			return
		}

		if (!value && !this._autoSort) {
			this._autoSort = value
			return
		}

		if (value) {
			this._autoSort = value
			if (this._countSorted !== this._size) {
				const {_collectionChangedIfCanEmit} = this
				if (_collectionChangedIfCanEmit) {
					_collectionChangedIfCanEmit.emit({
						type: CollectionChangedType.Resorted,
					})
				}
			}
		} else {
			this.sort()
			this._autoSort = value
		}
	}

	// endregion

	// region notAddIfExists

	private _notAddIfExists: boolean

	public get notAddIfExists(): boolean {
		return this._notAddIfExists
	}

	public set notAddIfExists(value: boolean) {
		this._notAddIfExists = !!value
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

	public removeDuplicates(withoutShift?: boolean): number {
		const {_array} = this
		let size = this._size

		let count = 0
		let i = size - 1

		if (this._autoSort) {
			withoutShift = false
			this.sort()
		}

		while (i >= 0) {
			const prevCount = size
			size = i
			const contains = this.indexOf(_array[i], 0, i) >= 0
			size = prevCount
			if (contains) {
				this.removeAt(i, withoutShift)
				count++
			}
			i--
		}

		return count
	}

	public get(index: number) {
		const {_size, _array, _autoSort} = this

		if (_autoSort) {
			this.sort()
		}

		index = List._prepareIndex(index, _size)

		return _array[index]
	}

	public set(index: number, item: T): boolean {
		const {_size, _array} = this

		index = List._prepareIndex(index, _size + 1)

		if (index >= _size) {
			return this.add(item)
		}

		const {_autoSort, _notAddIfExists, _compare, _collectionChangedIfCanEmit} = this

		if (_autoSort) {
			this.sort()
		}

		const oldItem = _array[index]

		if ((_notAddIfExists || _autoSort || _collectionChangedIfCanEmit)
			&& (_compare || List.compareDefault)(oldItem, item) === 0
		) {
			return false
		}

		let moveIndex
		if (_notAddIfExists) {
			let foundIndex = this.indexOf(item, null, null, _autoSort ? 1 : 0)
			if (foundIndex < 0) {
				if (_autoSort) {
					foundIndex = ~foundIndex
					moveIndex = foundIndex > index
						? foundIndex - 1
						: foundIndex
				} else {
					moveIndex = index
				}
			} else if (foundIndex !== index) {
				return this.removeAt(index)
			} else {
				return false
			}
		} else if (_autoSort) {
			let foundIndex = this.indexOf(item, 0, this._countSorted, 1)
			if (foundIndex < 0) {
				foundIndex = ~foundIndex
			} else if (foundIndex === index) {
				return false
			}

			moveIndex = foundIndex > index
				? foundIndex - 1
				: foundIndex
		} else {
			moveIndex = index
		}

		if (_collectionChangedIfCanEmit) {
			_array[index] = item

			if (moveIndex !== index) {
				this._move(index, moveIndex)
			}

			_collectionChangedIfCanEmit.emit({
				type: CollectionChangedType.Set,
				index,
				oldItems: [oldItem],
				newItems: [item],
				moveIndex,
			})
		} else {
			_array[index] = item

			if (moveIndex !== index) {
				this._move(index, moveIndex)
			}
		}

		return true
	}

	public add(item: T): boolean {
		const {_notAddIfExists, _autoSort, _size} = this

		if (_autoSort) {
			this.sort()
		}

		let index
		if (_notAddIfExists) {
			index = this.indexOf(item, null, null, _autoSort ? 1 : 0)
			if (index < 0) {
				index = ~index
			} else {
				return false
			}
		} else if (_autoSort) {
			index = this.indexOf(item, 0, this._countSorted, 1)
			if (index < 0) {
				index = ~index
			}
		} else {
			index = _size
		}

		if (_autoSort) {
			this._countSorted++
		}

		index = List._prepareIndex(index, _size + 1)

		return this._insert(index, item)
	}

	public addArray(sourceItems: T[], sourceStart?: number, sourceEnd?: number): boolean {
		return this.insertArray(this._size, sourceItems, sourceStart, sourceEnd)
	}

	public addIterable(items: Iterable<T>, itemsSize: number): boolean {
		return this.insertIterable(this._size, items, itemsSize)
	}

	private _insert(index: number, item: T): boolean {
		const {_size, _array} = this

		const newSize = _size + 1

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

	public insert(index: number, item: T): boolean {
		if (this._autoSort) {
			return this.add(item)
		}

		if (this._notAddIfExists && this.indexOf(item) >= 0) {
			return false
		}

		index = List._prepareIndex(index, this._size + 1)

		if (index < this._countSorted) {
			this._countSorted = index
		}

		return this._insert(index, item)
	}

	public insertArray(index: number, sourceItems: T[], sourceStart?: number, sourceEnd?: number): boolean {
		const {_size, _array, _autoSort} = this

		let itemsSize = sourceItems.length

		index = List._prepareIndex(index, _size + 1)
		sourceStart = List._prepareStart(sourceStart, itemsSize)
		sourceEnd = List._prepareEnd(sourceEnd, itemsSize)

		if (_autoSort) {
			let result = false
			for (let i = sourceStart; i < sourceEnd; i++) {
				result = this.add(sourceItems[i]) || result
			}
			return result
		} else if (this._notAddIfExists) {
			let nextIndex = index
			for (let i = sourceStart; i < sourceEnd; i++) {
				if (this.insert(nextIndex, sourceItems[i])) {
					nextIndex++
				}
			}
			return nextIndex !== index
		}

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

		if (index < this._countSorted) {
			this._countSorted = index
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

		let i

		const start = List._prepareIndex(index, _size + 1)

		if (this._autoSort) {
			let result = false
			for (const item of items) {
				result = this.add(item) || result
			}
			return result
		} else if (this._notAddIfExists) {
			let nextIndex = start
			i = 0
			for (const item of items) {
				if (this.insert(nextIndex, item)) {
					nextIndex++
				}
				i++
				if (i >= itemsSize) {
					break
				}
			}
			return nextIndex !== start
		}
		const end = start + itemsSize

		const newSize = _size + itemsSize

		this._setSize(newSize)

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

		if (start < this._countSorted) {
			this._countSorted = start
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
		const {_size, _array, _autoSort} = this

		index = List._prepareIndex(index, _size)

		const {_collectionChangedIfCanEmit} = this
		let oldItems

		if (_collectionChangedIfCanEmit) {
			oldItems = [_array[index]]
		}

		if (withoutShift && !_autoSort) {
			_array[index] = _array[_size - 1]
			if (index < _size - 2 && index < this._countSorted) {
				this._countSorted = index
			}
		} else {
			for (let i = index + 1; i < _size; i++) {
				_array[i - 1] = _array[i]
			}
		}

		this._setSize(_size - 1)

		if (index < this._countSorted) {
			this._countSorted--
		}

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

		// if (!withoutShift) {
		// 	withoutShift = removeSize < _size - end
		// }

		if (withoutShift) {
			for (let i = start; i < end; i++) {
				_array[i] = _array[_size - end + i]
			}

			if (removeSize < _size - end && start < this._countSorted) {
				this._countSorted = start
			}
		} else {
			for (let i = end; i < _size; i++) {
				_array[i - removeSize] = _array[i]
			}
		}

		this._setSize(_size - removeSize)

		if (end <= this._countSorted) {
			this._countSorted -= removeSize
		} else if (start < this._countSorted) {
			this._countSorted = start
		}

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

	private _move(oldIndex: number, newIndex: number): void {
		const {_array} = this

		const moveItem = _array[oldIndex]
		const step = (newIndex > oldIndex) ? 1 : -1
		for (let i = oldIndex; i !== newIndex; i += step) {
			_array[i] = _array[i + step]
		}

		_array[newIndex] = moveItem
	}

	public move(oldIndex: number, newIndex: number): boolean {
		if (oldIndex === newIndex) {
			return false
		}

		const {_size} = this

		oldIndex = List._prepareIndex(oldIndex, _size)
		newIndex = List._prepareIndex(newIndex, _size)

		this._move(oldIndex, newIndex)

		this._countSorted = Math.min(this._countSorted, oldIndex, newIndex)

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

		this._countSorted = Math.min(this._countSorted, start, moveIndex)

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
		const {_size, _array, _compare, _autoSort} = this

		start = List._prepareStart(start, _size)
		end = List._prepareEnd(end, _size)

		if (this._autoSort) {
			this.sort()
		}

		let countSorted = this._countSorted
		if (!countSorted || countSorted < start || !_autoSort && countSorted <= start + 2) {
			countSorted = start
		} else if (countSorted > end) {
			countSorted = end
		}

		let index

		if (bound == null || bound <= 0) {
			if (countSorted > start) {
				index = binarySearch(_array, item, start, countSorted, _compare || List.compareDefault, bound)

				if (index >= 0) {
					return index
				}
			}

			if (_compare) {
				for (let i = countSorted; i < end; i++) {
					if (_compare(_array[i], item) === 0) {
						return i
					}
				}
			} else {
				for (let i = countSorted; i < end; i++) {
					if (_array[i] === item) {
						return i
					}
				}
			}
		} else {
			if (_compare) {
				for (let i = end - 1; i >= countSorted; i--) {
					if (_compare(_array[i], item) === 0) {
						return i
					}
				}
			} else {
				let last = -1
				for (let i = countSorted; i < end; i++) {
					if (_array[i] === item) {
						last = i
					}
				}
				if (last >= 0) {
					return last
				}
			}

			if (countSorted > start) {
				index = binarySearch(_array, item, start, countSorted, _compare || List.compareDefault, bound)
			}
		}

		return index == null || index < 0 && !_autoSort
			? ~_size
			: index
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
		this._countSorted = 0

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

	public reSort(): boolean {
		const {_countSorted, _autoSort} = this

		if (!_countSorted && _autoSort) {
			return false
		}

		const {_size} = this
		if (_size <= 1) {
			this._countSorted = _size
			return false
		}

		this._countSorted = 0

		if (this._autoSort) {
			const {_collectionChangedIfCanEmit} = this
			if (_collectionChangedIfCanEmit) {
				_collectionChangedIfCanEmit.emit({
					type: CollectionChangedType.Resorted,
				})
			}
		} else {
			this.sort()
		}

		return true
	}

	public sort(): boolean {
		const {_size, _array, _countSorted} = this

		if (_countSorted >= _size) {
			return false
		}

		if (_size <= 1) {
			this._countSorted = _size
			return false
		}

		_array.length = _size
		_array.sort(this._compare || List.compareDefault)
		this._countSorted = _size

		if (!this._autoSort) {
			const {_collectionChangedIfCanEmit} = this
			if (_collectionChangedIfCanEmit) {
				_collectionChangedIfCanEmit.emit({
					type: CollectionChangedType.Resorted,
				})
			}
		}

		return true
	}

	public toArray(start?: number, end?: number): T[] {
		const {_size, _array, _autoSort} = this

		if (_autoSort) {
			this.sort()
		}

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

	// region Static

	public static readonly compareDefault: ICompare<any> = compareDefault

	// endregion
}
