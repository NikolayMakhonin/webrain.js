export class ObjectPool<TArgs extends any[], TObject> {
	private readonly _stack = []
	private readonly _maxSize: number

	constructor(maxSize: number) {
		this._maxSize = maxSize
	}

	public get(...args: TArgs): TObject
	public get() {
		const {_stack} = this
		const lastIndex = _stack.length - 1
		if (lastIndex > 0) {
			const obj = _stack[lastIndex]
			_stack.length = lastIndex
			return obj
		}
	}

	public release(obj: TObject) {
		if (this._stack.length < this._maxSize) {
			this._stack.push(obj)
		}
	}
}
