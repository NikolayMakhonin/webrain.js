export interface IIteratorResult<T> {
	done: boolean
	value: T
}

export interface IIterator<T> {
	next(value?: any): IIteratorResult<T>
	return?(value?: any): IIteratorResult<T>
	throw?(e?: any): IIteratorResult<T>
}
