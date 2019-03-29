import {ObservableObject} from '../rx/object/ObservableObject'
import {HasSubscribersSubject, IHasSubscribersSubject} from '../rx/subjects/hasSubscribers'
import {ICompare} from './contracts/ICompare'
import {IIterable} from './contracts/IIterable'
import {binarySearch, defaultCompare} from './helpers/array'

export interface IList<T> extends IIterable<T> {
	addAll(iterable: IIterable<T>)
}

export interface ISortedList<T> extends IList<T> {

}

export enum CollectionChangedType {
	/**
	 * is set properties: oldIndex, oldItems
	 */
	Removed,
	/**
	 * is set properties: newIndex, newItems
	 */
	Added,
	/**
	 * is set properties: oldIndex == newIndex, oldItems[1], newItems[1]
	 */
	Set,
	/**
	 * properties is not set
	 */
	Resorted,
	/**
	 * is set properties: oldIndex, newIndex, newItems[1]
	 */
	Moved,
	/**
	 * is set properties: oldIndex, newIndex
	 */
	Shift,
}

export interface ICollectionChangedEvent<T> {
	readonly type: CollectionChangedType
	/** index of the first old item */
	readonly oldIndex?: number
	/** index of the first new item */
	readonly newIndex?: number
	readonly oldItems?: T[]
	readonly newItems?: T[]
}

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

export class SortedList<T> extends ObservableObject implements ISortedList<T> {
	private _list: T[] = []
	private _defaultValue?: T

	// region constructor

	constructor({
		list,
		compare,
		autoSort,
		notAddIfExists,
		capacity,
		defaultValue,
	}: {
		list?: T[],
		compare?: ICompare<T>,
		autoSort?: boolean,
		notAddIfExists?: boolean,
		capacity?: number,
		defaultValue?: T,
	} = {}) {
		super()
		if (list) {
			// TODO
			// this.addAll(list)
		}

		if (compare) {
			this._compare = compare
		}

		if (autoSort) {
			this._autoSort = autoSort
		}

		if (notAddIfExists) {
			this._notAddIfExists = notAddIfExists
		}

		if (capacity) {
			if (capacity < SortedList.CAPACITY_MIN) {
				capacity = SortedList.CAPACITY_MIN
			} else if (capacity > SortedList.CAPACITY_MAX) {
				capacity = SortedList.CAPACITY_MAX
			}
			this._capacity = calcOptimalArraySize(capacity)
		}

		if (defaultValue) {
			this._defaultValue = defaultValue
		}
	}

	// endregion

	// region Properties

	// region capacity

	private static readonly CAPACITY_MIN = 16
	private static readonly CAPACITY_MAX = 65535

	private _capacity: number

	public get capacity(): number {
		return this._capacity
	}

	// endregion

	// region count

	private _count: number

	public get count(): number {
		return this._count
	}

	private setCount(newCount: number, suppressCollectionChanged?: boolean) {
		const oldCount = this._count
		if (oldCount === newCount) {
			return
		}

		const {_list, _collectionChanged, onPropertyChanged} = this

		if (newCount < this._countSorted) {
			this._countSorted = newCount
		}

		if (!suppressCollectionChanged
			&& newCount < oldCount
			&& (!_collectionChanged || !_collectionChanged.hasSubscribers)
		) {
			const removedItems = _list.slice(newCount, oldCount)
			_collectionChanged.emit({
				type: CollectionChangedType.Removed,
				oldIndex: newCount,
				oldItems: removedItems,
			})
		}

		// if (newCount > _list.length) {
		// 	let newLength = newCount * 2
		// 	if (newLength < this._capacity) {
		// 		newLength = this._capacity
		// 	}
		// 	Array.Resize(_list, newLength)
		// }

		if (newCount * 2 < _list.length) {
			let newLength = newCount * 2
			if (newLength < this._capacity) {
				newLength = this._capacity
			}
			newLength = calcOptimalArraySize(newLength)
			if (newLength !== _list.length) {
				_list.length = newLength
			}
		}

		if (newCount < oldCount) {
			const defaultValue = getDefaultValue(_list[newCount === 0 ? 0 : newCount - 1])

			const newLength = _list.length
			for (let i = newCount; i < newLength; i++) {
				_list[i] = defaultValue
			}
		}

		if (!suppressCollectionChanged
			&& newCount > oldCount
			&& (!_collectionChanged || !_collectionChanged.hasSubscribers)
		) {
			const defaultValue = getDefaultValue(_list[oldCount === 0 ? 0 : oldCount - 1])

			const addedItems: T[] = new Array(newCount - oldCount)
				.fill(defaultValue)

			_collectionChanged.emit({
				type: CollectionChangedType.Added,
				newIndex: oldCount,
				newItems: addedItems,
			})
		}

		onPropertyChanged('count')
	}

	private allocate(defaultValue: T, count?: number) {
		if (count == null) {
			count = this._count
		}

		const {_list} = this

		for (let i = _list.length; i < count; i++) {
			_list[i] = defaultValue
		}
	}

	// endregion

	// region countSorted

	private _countSorted: number = 0

	public get countSorted(): number {
		return this._countSorted
	}

	// endregion

	// region compare

	private _compare?: ICompare<T>

	public get compare(): ICompare<T> {
		return this._compare
	}

	public set compare(value: ICompare<T>) {
		if (this._compare === value) {
			return
		}

		this._compare = value

		if (this._countSorted > 0 && this._count > 0) {
			this._countSorted = 0
			this.onCollectionChanged({
				type: CollectionChangedType.Resorted,
			})
		}
	}

	// endregion

	// region autoSort

	private _autoSort?: boolean

	public get autoSort(): boolean {
		return this._autoSort
	}

	public set autoSort(value: boolean) {
		// tslint:disable-next-line:triple-equals
		if (this._autoSort == value) {
			this._autoSort = value
			return
		}

		this._autoSort = value

		if (value && this._countSorted !== this._count) {
			this.onCollectionChanged({
				type: CollectionChangedType.Resorted,
			})
		}
	}

	// endregion

	// region notAddIfExists

	private _notAddIfExists?: boolean

	public get notAddIfExists(): boolean {
		return this._notAddIfExists
	}

	public set notAddIfExists(value: boolean) {
		this._notAddIfExists = value
	}

	// endregion

	// endregion

	// region Events

	// region collectionChanged

	private _collectionChanged?: IHasSubscribersSubject<ICollectionChangedEvent<T>>
	public get collectionChanged(): IHasSubscribersSubject<ICollectionChangedEvent<T>> {
		let {_collectionChanged} = this
		if (!_collectionChanged) {
			this._collectionChanged = _collectionChanged = new HasSubscribersSubject()
		}
		return _collectionChanged
	}

	public onCollectionChanged(event: ICollectionChangedEvent<T>): this {
		const {_collectionChanged} = this
		if (!_collectionChanged || !_collectionChanged.hasSubscribers) {
			return this
		}

		_collectionChanged.emit(event)

		return this
	}

	// endregion

	// endregion

	// region Methods

	// region Search

	public indexOf(item: T, start?: number, end?: number, bound?: number): number {
		const {_list, _count, _countSorted} = this
		const compare = this._compare || defaultCompare

		if (start == null || start < 0) {
			start = 0
		}

		if (end == null || end > _count) {
			end = _count
		}

		if (bound > 0) {
			for (
				let i = _count - 1,
				i0 = start < _countSorted ? _countSorted : start;
				i >= i0;
				i--
			) {
				if (compare(_list[i], item) === 0) {
					return i
				}
			}
		}

		const index = binarySearch(
			_list,
			item,
			start,
			end > _countSorted ? _countSorted : end,
			compare,
			bound,
		)

		if (index >= 0) {
			return index
		}

		if (!bound || bound < 0) {
			for (
				let i = start < _countSorted ? _countSorted : start;
				i < _count;
				i++
			) {
				if (compare(_list[i], item) === 0) {
					return i
				}
			}
		}

		return _countSorted > 0 && bound < 0
			? index
			: ~end
	}

	public firstIndexOf(item: T, start?: number, end?: number): number {
		return this.indexOf(item, start, end, -1)
	}

	public lastIndexOf(item: T, start?: number, end?: number): number {
		return this.indexOf(item, start, end, 1)
	}

	public contains(item: T): boolean {
		return this.indexOf(item) >= 0
	}

	// endregion

	// region Insert

	private _insert(index: number, item: T): void {
		const {_count: oldCount, _list, _collectionChanged} = this
		this.setCount(oldCount + 1, true)
		for (let i = oldCount; i > index; i--) {
			_list[i] = _list[i - 1]
		}

		_list[index] = item

		if (_collectionChanged != null && _collectionChanged.hasSubscribers) {
			if (index < oldCount) {
				_collectionChanged.emit({
					type: CollectionChangedType.Shift,
					oldIndex: index,
					newIndex: index + 1,
				})
			}
			_collectionChanged.emit({
				type: CollectionChangedType.Added,
				newIndex: index,
				newItems: [item],
			})
		}
	}

	public insert(index: number, item: T): boolean {
		if (this._autoSort) {
			return add(item)
		}

		if (this._notAddIfExists && this.contains(item)) {
			return
		}

		if (index < this._countSorted) {
			this._countSorted = index
		}

		this._insert(index, item)

		return true
	}

	public add(item: T): boolean {
		const {_notAddIfExists, _autoSort} = this

		if (_notAddIfExists || _autoSort) {
			let i = this.indexOf(item)

			if (i < 0) {
				i = ~i
			} else if (_notAddIfExists) {
				return false
			}

			if (_autoSort) {
				this._countSorted++
			}

			this._insert((_autoSort) ? i : this._count, item)

			return true
		}

		this._insert(this._count, item)

		return true
	}

	// endregion

	// region Remove

	// endregion

	public get(index: number) {
		const {_count, _list} = this
		if (index < 0 || index >= _count) {
			throw new Error(`index (${index}) is out of range [0..${_count}]`)
		}

		if (this._autoSort) {
			// TODO
			// sort(true)
		}

		return _list[index]
	}

	// public set(index: number, item: T): this {
	// 	const {_count, _list} = this
	// 	if (index < 0 || index > _count) {
	// 		throw new Error(`index (${index}) is out of range [0..${_count}]`)
	// 	}
	//
	// 	if (index === _count) {
	// 		return this.add(item)
	// 	}
	//
	// 	_list[index] = item
	//
	// 	return this
	// }

	// public addAll(iterable: IIterable<T>) {
	// 	// TODO
	// }

	// public [Symbol.iterator](): IIterator<T> {
	// 	return this._list[Symbol.iterator]()
	// }

	// endregion
}
