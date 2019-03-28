import {EventsOrPropertyNames, IPropertyChangedEvent, ObservableObject} from '../rx/object/ObservableObject'
import {HasSubscribersSubject, IHasSubscribersSubject} from '../rx/subjects/hasSubscribers'
import {IIterable} from './IIterable'
import {IIterator} from './IIterator'

export interface IList<T> extends IIterable<T> {
	addAll(iterable: IIterable<T>)
}

export interface ISortedList<T> extends IList<T> {

}

export type ICompare<T> = (a: T, b: T) => number

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

export class SortedList<T> extends ObservableObject implements ISortedList<T> {
	private _list: T[] = []

	// region constructor

	constructor({
		list,
		compare,
		autoSort,
		notAddIfExists,
		capacity,
	}: {
		list?: T[],
		compare?: ICompare<T>,
		autoSort?: boolean,
		notAddIfExists?: boolean,
		capacity?: number,
	} = {}) {
		super()
		if (list) {
			this.addAll(list)
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
			this.capacity = capacity
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

	public set capacity(value: number) {
		if (value < SortedList.CAPACITY_MIN) {
			value = SortedList.CAPACITY_MIN
		} else if (value > SortedList.CAPACITY_MAX) {
			value = SortedList.CAPACITY_MAX
		}

		this._capacity = value
	}

	// endregion

	// region count

	private _count: number

	public get count(): number {
		return this._count
	}

	public set count(value: number) {
		this._capacity = value
	}

	private setCount(newCount: number, suppressCollectionChanged?: boolean) {
		const oldCount = this._count
		this._count = newCount
		if (newCount < this._countSorted) {
			this._countSorted = newCount
		}
		const {_list, _collectionChanged} = this

		if (newCount < oldCount)
		{
			if (!suppressCollectionChanged)
			{
				if (!_collectionChanged || !_collectionChanged.hasSubscribers)
				{
					const removedList = _list.slice(newCount, oldCount)
					_collectionChanged.emit(new CollectionChangedEventArgs<T>(
						CollectionChangedType.Removed, newCount, -1,
						removedList, null));
				}
			}
		}
		if (newCount > _list.length)
		{
			let newLength = newCount * 2;
			if (newLength < this._capacity) {
				newLength = this._capacity;
			}
			Array.Resize(_list, newLength);
		}
		if (newCount * 2 < _list.length)
		{
			let newLength = newCount * 2;
			if (newLength < this._capacity) {
				newLength = this._capacity;
			}
			if (newLength != _list.length)
			{
				Array.Resize(_list, newLength);
			}
		}
		// TODO
		// if (_default(T) == null && newCount < oldCount)
		// {
		// 	let newLength = _list.length
		// 	for (let i = newCount; i < newLength; i++)
		// 	{
		// 		_list[i] = _default(T)
		// 	}
		// }
		if (newCount > oldCount)
		{
			if (!suppressCollectionChanged)
			{
				if (!_collectionChanged || !_collectionChanged.hasSubscribers)
				{
					const addedList: T[] = new Array(newCount - oldCount)
					Array.Copy(_list, oldCount, addedList, 0, addedList.length)
					OnCollectionChanged(new CollectionChangedEventArgs<T>(
						CollectionChangedType.Added, -1, oldCount,
						null, addedList))
				}
			}
		}

		if (this._count !== oldCount)
		{
			OnPropertyChanged('count')
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

	public addAll(iterable: IIterable<T>) {
		// TODO
	}

	public [Symbol.iterator](): IIterator<T> {
		return this._list[Symbol.iterator]()
	}
}
