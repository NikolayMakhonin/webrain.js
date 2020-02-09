export class ObjectPool<TObject> {
	private readonly _stack = []
	private readonly _maxSize: number
	public usedSize: number = 0
	public size: number = 0

	constructor(maxSize: number) {
		this._maxSize = maxSize
	}

	public get allocatedSize() {
		return this._stack.length
	}

	public get(...args: any[]): TObject
	public get() {
		this.usedSize++
		const {_stack} = this
		const lastIndex = this.size - 1
		if (lastIndex >= 0) {
			const obj = _stack[lastIndex]
			_stack[lastIndex] = null
			this.size = lastIndex
			if (obj == null) {
				throw new Error('obj == null')
			}
			return obj
		}
		return null
	}

	public release(obj: TObject) {
		if (obj == null) {
			throw new Error('obj == null')
		}
		this.usedSize--
		const size = this.size
		if (size < this._maxSize) {
			this._stack[size] = obj
			this.size = size + 1
		}
	}
}
