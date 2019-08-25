export class PeekIterator<T> {
	private readonly _iterator: Iterator<T>
	private _buffer: IteratorResult<T>
	constructor(iterator: Iterator<T>) {
		this._iterator = iterator
	}

	public next(): IteratorResult<T> {
		const iteration = this._buffer
		if (iteration) {
			this._buffer = null
			return iteration
		}
		return this._iterator.next()
	}

	public peek(): IteratorResult<T> {
		let iteration = this._buffer
		if (!iteration) {
			this._buffer = iteration = this._iterator.next()
		}
		return iteration
	}
}
