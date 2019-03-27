import {IIterable} from "./IIterable"
import {IIterator} from "./IIterator"

export interface IList<T> extends IIterable<T> {
	addAll(iterable: IIterable<T>)
}

export interface ISortedList<T> extends IList<T> {

}

export type ICompare<T> = (a: T, b: T) => number

export class SortedList<T> implements ISortedList<T> {
	private readonly _list: T[] = []
	private _compare: ICompare<T>
	private _countSorted: number
	private _autoSort: boolean
	private _notAddIfExists: boolean

	constructor(options) {
		// Object.assign(this, options)

		if (options.list) {
			this.addAll(options.list)
		}

		if (options.compare) {
			this._compare = options.compare
		}

		if (options.autoSort) {
			this._autoSort = options.autoSort
		}

		if (options.notAddIfExists) {
			this._notAddIfExists = options.notAddIfExists
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
