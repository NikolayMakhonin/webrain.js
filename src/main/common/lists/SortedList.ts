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

	get countSorted() {
		return this._countSorted
	}

	get autoSort() {
		return this._autoSort
	}

	// set autoSort() {
	//
	// }

	// endregion

	public addAll(iterable: IIterable<T>) {
		// TODO
	}

	public [Symbol.iterator](): IIterator<T> {
		return this._list[Symbol.iterator]()
	}
}
