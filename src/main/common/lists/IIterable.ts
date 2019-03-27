import {IIterator} from "./IIterator"

export interface IIterable<T> {
	[Symbol.iterator](): IIterator<T>
}
