import {enumerable} from "../helpers/typescript"
import {IIterable} from "./IIterable"
import {IIterator} from "./IIterator"

export interface IList<T> extends IIterable<T> {
	addAll(iterable: IIterable<T>)
}

export interface ISortedList<T> extends IList<T> {

}

export type ICompare<T> = (a: T, b: T) => number

export class SortedList<T> implements ISortedList<T> {
	private _list: T[] = []
	private _compare?: ICompare<T>
	private _countSorted?: number
	private _autoSort?: boolean
	private _notAddIfExists?: boolean

	constructor({
		list,
		compare,
		autoSort,
		notAddIfExists,
	}: {
		list?: T[],
		compare?: ICompare<T>,
		autoSort?: boolean,
		notAddIfExists?: boolean,
	} = {}) {
		// Object.assign(this, options)

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
	}

	// region Properties

	// region countSorted

	get countSorted(): number {
		return this._countSorted
	}

	// endregion

	// region countSorted

	get compare(): ICompare<T> {
		return this._compare
	}

	// endregion

	// region countSorted

	get autoSort(): boolean {
		return this._autoSort
	}

	set autoSort(value: boolean) {
		// tslint:disable-next-line:triple-equals
		if (this._autoSort == value) {
			this._autoSort = value
			return
		}

		this._autoSort = value

		// if (value && this._countSorted !== this._count && CollectionChangedExt != null)
		// {
		// 	OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Resorted, -1, -1, null, null));
		// }
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
