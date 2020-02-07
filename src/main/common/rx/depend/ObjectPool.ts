export class ObjectPool<TObject> {
	private readonly _stack = []
	private readonly _maxSize: number
	public size: number = 0

	constructor(maxSize: number) {
		this._maxSize = maxSize
	}

	public get(...args: any[]): TObject
	public get() {
		const {_stack} = this
		const lastIndex = this.size - 1
		if (lastIndex > 0) {
			const obj = _stack[lastIndex]
			_stack[lastIndex] = null
			this.size = lastIndex
			return obj
		}
	}

	public release(obj: TObject) {
		const size = this.size
		if (size < this._maxSize) {
			this._stack[size] = obj
			this.size = size + 1
		}
	}
}
