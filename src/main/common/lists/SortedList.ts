import {ThenableIterator} from '../async/async'
import {IMergeable, IMergeOptions, IMergeValue} from '../extensions/merge/contracts'
import {IMergeMapWrapper, mergeMaps} from '../extensions/merge/merge-maps'
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
import {ListChangedObject} from './base/ListChangedObject'
import {ICompare} from './contracts/ICompare'
import {IListChangedObject, ListChangedType} from './contracts/IListChanged'
import {binarySearch, move} from './helpers/array'
import {compareFast} from './helpers/compare'
import {fillCollection} from './helpers/set'

function calcOptimalArraySize(desiredSize: number) {
	let optimalSize = 4
	while (desiredSize > optimalSize) {
		optimalSize <<= 1
	}
	return optimalSize
}

export function getDefaultValue(value) {
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

export class SortedList<T>
	extends ListChangedObject<T>
	implements IListChangedObject<T>,
		IMergeable<SortedList<T>, T[] | Iterable<T>>,
		ISerializable
{
	// region constructor

	private readonly _array: T[]

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
		const {_minAllocatedSize: oldValue} = this
		if (oldValue === value) {
			return
		}

		this._minAllocatedSize = value
		this._updateAllocatedSize()

		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			propertyChangedIfCanEmit.onPropertyChanged({
				name: 'minAllocatedSize',
				oldValue,
				newValue: value,
			})
		}
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

		const {_autoSort: oldValue} = this
		if (oldValue === value) {
			return
		}

		if (!value && !oldValue) {
			this._autoSort = value
			return
		}

		if (value) {
			this._autoSort = value
			if (this._countSorted !== this._size) {
				const {_listChangedIfCanEmit} = this
				if (_listChangedIfCanEmit) {
					_listChangedIfCanEmit.emit({
						type: ListChangedType.Resorted,
					})
				}
			}
		} else {
			this.sort()
			this._autoSort = value
		}

		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			propertyChangedIfCanEmit.onPropertyChanged({
				name: 'autoSort',
				oldValue: !!oldValue,
				newValue: value,
			})
		}
	}

	// endregion

	// region notAddIfExists

	private _notAddIfExists: boolean

	public get notAddIfExists(): boolean {
		return this._notAddIfExists
	}

	public set notAddIfExists(value: boolean) {
		value = !!value

		const {_notAddIfExists: oldValue} = this
		if (oldValue === value) {
			return
		}

		if (!value && !oldValue) {
			this._notAddIfExists = value
			return
		}

		this._notAddIfExists = value

		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			propertyChangedIfCanEmit.onPropertyChanged({
				name: 'notAddIfExists',
				oldValue: !!oldValue,
				newValue: value,
			})
		}
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

		let count = 0
		let i = this._size - 1

		if (this._autoSort) {
			withoutShift = false
			this.sort()
		}

		while (i >= 0) {
			const contains = this.indexOf(_array[i], 0, i) >= 0
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

		index = SortedList._prepareIndex(index, _size)

		return _array[index]
	}

	public set(index: number, item: T): boolean {
		const {_size, _array} = this

		index = SortedList._prepareIndex(index, _size + 1)

		if (index >= _size) {
			return this.add(item)
		}

		const {_autoSort, _notAddIfExists, _compare, _listChangedIfCanEmit} = this

		if (_autoSort) {
			this.sort()
		}

		const oldItem = _array[index]

		if ((_notAddIfExists || _autoSort || _listChangedIfCanEmit)
			&& (_compare || SortedList.compareDefault)(oldItem, item) === 0
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

		if (_listChangedIfCanEmit) {
			_array[index] = item

			if (moveIndex !== index) {
				this._move(index, moveIndex)
			}

			_listChangedIfCanEmit.emit({
				type: ListChangedType.Set,
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

		index = SortedList._prepareIndex(index, _size + 1)

		return this._insert(index, item)
	}

	public addArray(sourceItems: T[], sourceStart?: number, sourceEnd?: number): boolean {
		return this.insertArray(this._size, sourceItems, sourceStart, sourceEnd)
	}

	public addIterable(items: Iterable<T>, itemsSize: number): boolean {
		return this.insertIterable(this._size, items, itemsSize)
	}

	private _insert(index: number, item: T): boolean {
		const {_size: size, _array} = this

		const newSize = size + 1

		this._setSize(newSize)

		for (let i = newSize - 1; i > index; i--) {
			_array[i] = _array[i - 1]
		}

		_array[index] = item

		const {_listChangedIfCanEmit} = this
		if (_listChangedIfCanEmit) {
			_listChangedIfCanEmit.emit({
				type: ListChangedType.Added,
				index,
				newItems: [item],
				shiftIndex: index < size ? index + 1 : index,
			})
		}

		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			propertyChangedIfCanEmit.onPropertyChanged({
				name: 'size',
				oldValue: size,
				newValue: newSize,
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

		index = SortedList._prepareIndex(index, this._size + 1)

		if (index < this._countSorted) {
			this._countSorted = index
		}

		return this._insert(index, item)
	}

	public insertArray(index: number, sourceItems: T[], sourceStart?: number, sourceEnd?: number): boolean {
		const {_size: size, _array, _autoSort} = this

		let itemsSize = sourceItems.length

		index = SortedList._prepareIndex(index, size + 1)
		sourceStart = SortedList._prepareStart(sourceStart, itemsSize)
		sourceEnd = SortedList._prepareEnd(sourceEnd, itemsSize)

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

		const newSize = size + itemsSize

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

		const {_listChangedIfCanEmit} = this
		if (_listChangedIfCanEmit) {
			_listChangedIfCanEmit.emit({
				type: ListChangedType.Added,
				index,
				newItems: _array.slice(index, index + itemsSize),
				shiftIndex: index < size ? index + itemsSize : index,
			})
		}

		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			propertyChangedIfCanEmit.onPropertyChanged({
				name: 'size',
				oldValue: size,
				newValue: newSize,
			})
		}

		return true
	}

	public insertIterable(index: number, items: Iterable<T>, itemsSize: number): boolean {
		const {_size: size, _array} = this

		if (itemsSize <= 0) {
			return false
		}

		if (Array.isArray(items)) {
			return this.insertArray(index, items, null, itemsSize)
		}

		let i

		const start = SortedList._prepareIndex(index, size + 1)

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

		const newSize = size + itemsSize

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
				this.__meta.propertyChangedDisabled = true
				this.removeRange(start, end)
			} finally {
				this.__meta.propertyChangedDisabled = false
			}

			throw new Error(`Iterable items size (${i - start}) less than itemsSize (${itemsSize})`)
		}

		if (start < this._countSorted) {
			this._countSorted = start
		}

		const {_listChangedIfCanEmit} = this
		if (_listChangedIfCanEmit) {
			_listChangedIfCanEmit.emit({
				type: ListChangedType.Added,
				index: start,
				newItems: _array.slice(start, end),
				shiftIndex: start < size ? end : start,
			})
		}

		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			propertyChangedIfCanEmit.onPropertyChanged({
				name: 'size',
				oldValue: size,
				newValue: newSize,
			})
		}

		return true
	}

	public removeAt(index: number, withoutShift?: boolean): boolean {
		const {_size: size, _array, _autoSort} = this

		index = SortedList._prepareIndex(index, size)

		const {_listChangedIfCanEmit} = this
		let oldItems

		if (_listChangedIfCanEmit) {
			oldItems = [_array[index]]
		}

		if (withoutShift && !_autoSort) {
			_array[index] = _array[size - 1]
			if (index < size - 2 && index < this._countSorted) {
				this._countSorted = index
			}
		} else {
			for (let i = index + 1; i < size; i++) {
				_array[i - 1] = _array[i]
			}
		}

		const newSize = this._setSize(size - 1)

		if (index < this._countSorted) {
			this._countSorted--
		}

		if (_listChangedIfCanEmit) {
			_listChangedIfCanEmit.emit({
				type: ListChangedType.Removed,
				index,
				oldItems,
				shiftIndex: index < size - 1
					? (withoutShift ? size - 1 : index + 1)
					: index,
			})
		}

		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			propertyChangedIfCanEmit.onPropertyChanged({
				name: 'size',
				oldValue: size,
				newValue: newSize,
			})
		}

		return true
	}

	public removeRange(start: number, end?: number, withoutShift?: boolean): boolean {
		const {_size: size, _array} = this

		start = SortedList._prepareStart(start, size)
		end = SortedList._prepareEnd(end, size)

		const removeSize = end - start

		if (removeSize <= 0) {
			return false
		}

		const {_listChangedIfCanEmit} = this
		let oldItems

		if (_listChangedIfCanEmit) {
			oldItems = _array.slice(start, end)
		}

		// if (!withoutShift) {
		// 	withoutShift = removeSize < _size - end
		// }

		if (withoutShift) {
			for (let i = start; i < end; i++) {
				_array[i] = _array[size - end + i]
			}

			if (removeSize < size - end && start < this._countSorted) {
				this._countSorted = start
			}
		} else {
			for (let i = end; i < size; i++) {
				_array[i - removeSize] = _array[i]
			}
		}

		const newSize = this._setSize(size - removeSize)

		if (end <= this._countSorted) {
			this._countSorted -= removeSize
		} else if (start < this._countSorted) {
			this._countSorted = start
		}

		if (_listChangedIfCanEmit) {
			_listChangedIfCanEmit.emit({
				type: ListChangedType.Removed,
				index: start,
				oldItems,
				shiftIndex: end < size
					? (withoutShift ? size - removeSize : end)
					: start,
			})
		}

		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			propertyChangedIfCanEmit.onPropertyChanged({
				name: 'size',
				oldValue: size,
				newValue: newSize,
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

	public removeArray(sourceItems: T[], sourceStart?: number, sourceEnd?: number): boolean {
		const itemsSize = sourceItems.length
		sourceStart = SortedList._prepareStart(sourceStart, itemsSize)
		sourceEnd = SortedList._prepareEnd(sourceEnd, itemsSize)

		let result = false
		for (let i = sourceStart; i < sourceEnd; i++) {
			result = this.remove(sourceItems[i]) || result
		}
		return result
	}

	public removeIterable(items: Iterable<T>, itemsSize: number): boolean {
		if (itemsSize <= 0) {
			return false
		}

		if (Array.isArray(items)) {
			return this.removeArray(items, null, itemsSize)
		}

		let result = false
		for (const item of items) {
			result = this.remove(item) || result
		}
		return result
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

		oldIndex = SortedList._prepareIndex(oldIndex, _size)
		newIndex = SortedList._prepareIndex(newIndex, _size)

		this._move(oldIndex, newIndex)

		this._countSorted = Math.min(this._countSorted, oldIndex, newIndex)

		const {_listChangedIfCanEmit} = this
		if (_listChangedIfCanEmit) {
			_listChangedIfCanEmit.emit({
				type: ListChangedType.Moved,
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

		start = SortedList._prepareStart(start, _size)
		end = SortedList._prepareStart(end, _size)
		moveIndex = SortedList._prepareIndex(moveIndex, _size)
		const maxIndex = _size - end + start
		if (moveIndex > maxIndex) {
			moveIndex = maxIndex
		}

		if (!move(_array, start, end, moveIndex)) {
			return false
		}

		this._countSorted = Math.min(this._countSorted, start, moveIndex)

		const {_listChangedIfCanEmit} = this
		if (_listChangedIfCanEmit) {
			_listChangedIfCanEmit.emit({
				type: ListChangedType.Moved,
				index: start,
				moveSize: end - start,
				moveIndex,
			})
		}

		return true
	}

	public indexOf(item: T, start?: number, end?: number, bound?: number): number {
		const {_size, _array, _compare, _autoSort} = this

		start = SortedList._prepareStart(start, _size)
		end = SortedList._prepareEnd(end, _size)

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
				index = binarySearch(_array, item, start, countSorted, _compare || SortedList.compareDefault, bound)

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
			} else if (item !== item) { // item is NaN
				for (let i = countSorted; i < end; i++) {
					const o = _array[i]
					if (o !== o) { // array item is NaN
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
			} else if (item !== item) { // item is NaN
				let last = -1
				for (let i = countSorted; i < end; i++) {
					const o = _array[i]
					if (o !== o) { // array item is NaN
						last = i
					}
				}
				if (last >= 0) {
					return last
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
				index = binarySearch(_array, item, start, countSorted, _compare || SortedList.compareDefault, bound)
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
		const {_size: size} = this
		if (size === 0) {
			return false
		}

		const {_array, _listChangedIfCanEmit} = this
		let oldItems

		if (_listChangedIfCanEmit) {
			oldItems = _array.slice(0, size)
		}

		this._setSize(0)
		this._countSorted = 0

		if (_listChangedIfCanEmit) {
			_listChangedIfCanEmit.emit({
				type: ListChangedType.Removed,
				index: 0,
				oldItems,
				shiftIndex: 0,
			})
		}

		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			propertyChangedIfCanEmit.onPropertyChanged({
				name: 'size',
				oldValue: size,
				newValue: 0,
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
			const {_listChangedIfCanEmit} = this
			if (_listChangedIfCanEmit) {
				_listChangedIfCanEmit.emit({
					type: ListChangedType.Resorted,
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
		_array.sort(this._compare || SortedList.compareDefault)
		this._countSorted = _size

		if (!this._autoSort) {
			const {_listChangedIfCanEmit} = this
			if (_listChangedIfCanEmit) {
				_listChangedIfCanEmit.emit({
					type: ListChangedType.Resorted,
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

		start = SortedList._prepareStart(start, _size)
		end = SortedList._prepareEnd(end, _size)

		return _array.slice(start, end)
	}

	public copyTo(destArray: T[], destIndex?: number, start?: number, end?: number): boolean {
		const {_size, _array} = this

		if (destIndex == null) {
			destIndex = 0
		}

		start = SortedList._prepareStart(start, _size)
		end = SortedList._prepareEnd(end, _size)

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

	public static readonly compareDefault: ICompare<any> = compareFast

	// endregion

	public readonly [Symbol.toStringTag]: string = 'List'

	// region IMergeable

	public _canMerge(source: SortedList<T>): boolean {
		if (source.constructor === SortedList
			&& this._array === source._array
			&& this._autoSort === source._autoSort
			&& this._notAddIfExists === source._notAddIfExists
		) {
			return null
		}

		return this._autoSort
			&& this._notAddIfExists
			&& (source.constructor === Object
				|| source[Symbol.toStringTag] === 'Set'
				|| Array.isArray(source)
				|| isIterable(source))
	}

	public _merge(
		merge: IMergeValue,
		older: SortedList<T> | T[] | Iterable<T>,
		newer: SortedList<T> | T[] | Iterable<T>,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeOptions,
	): boolean {
		return mergeMaps(
			(target, source) => createMergeSortedListWrapper(
				target,
				source,
				arrayOrIterable => fillCollection(new SortedList<T>({
					autoSort: true,
					notAddIfExists: true,
					compare: this.compare,
				}), arrayOrIterable, (c, o: T) => c.add(o))),
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

	public static uuid: string = '1ec56e52-1aa5-4dd1-8471-a6185f22ed0a'

	public serialize(serialize: ISerializeValue): ISerializedObject {
		return {
			array: serialize(this._array, { arrayLength: this._size }),
			options: serialize({
				autoSort: this._autoSort,
				countSorted: this._countSorted,
				minAllocatedSize: this._minAllocatedSize,
				notAddIfExists: this._notAddIfExists,
			}),
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

// region Merge helpers

export class MergeSortedListWrapper<V> implements IMergeMapWrapper<V, V> {
	private readonly _list: SortedList<V>

	constructor(list: SortedList<V>) {
		if (!list.autoSort || !list.notAddIfExists) {
			throw new Error('Cannot create IMergeMapWrapper with ' +
				`SortedList(autoSort = ${list.autoSort} (must be true), ` +
				`notAddIfExists = ${list.notAddIfExists} (must be true))`)
		}
		this._list = list
	}

	public delete(key: V): void {
		this._list.remove(key)
	}

	public forEachKeys(callbackfn: (key: V) => void): void {
		for (const key of this._list) {
			callbackfn(key)
		}
	}

	public get(key: V): V {
		return key
	}

	public has(key: V): boolean {
		return this._list.contains(key)
	}

	public set(key: V, value: V): void {
		this._list.add(value)
	}
}

export function createMergeSortedListWrapper<V>(
	target: object | Set<V> | SortedList<V> | V[] | Iterable<V>,
	source: object | Set<V> | SortedList<V> | V[] | Iterable<V>,
	arrayOrIterableToSortedList: (array) => object | SortedList<V>,
) {
	if (source.constructor === SortedList) {
		return new MergeSortedListWrapper(source as SortedList<V>)
	}

	if (arrayOrIterableToSortedList && (Array.isArray(source) || isIterable(source))) {
		return createMergeSortedListWrapper(target, arrayOrIterableToSortedList(source), null)
	}

	return createMergeSetWrapper(target, source)
}

// endregion

registerMergeable(SortedList, {
	valueFactory: <T>(source: SortedList<T>) => new SortedList<T>({
		autoSort: source.autoSort,
		notAddIfExists: source.notAddIfExists,
		compare: source.compare,
		minAllocatedSize: source.minAllocatedSize,
	}),
})

registerSerializable(SortedList, {
	serializer: {
		*deSerialize<T>(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory: (...args) => SortedList<T>,
		): ThenableIterator<SortedList<T>> {
			const options = yield deSerialize(serializedValue.options)
			options.array = yield deSerialize(serializedValue.array)
			const value = valueFactory(options)
			value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})
