import {IObjectPool} from './contracts/IObjectPool'

export class ObjectPool<TObject> implements IObjectPool<TObject> {
	public size = 0
	public maxSize
	private readonly _stack = [null]

	constructor(maxSize: number) {
		this.maxSize = maxSize
	}

	public get(): TObject {
		// this.usedSize++
		const lastIndex = this.size - 1
		if (lastIndex >= 0) {
			const obj = this._stack[lastIndex]
			this._stack[lastIndex] = null
			this.size = lastIndex
			if (obj === null) {
				throw new Error('obj === null')
			}
			return obj
		}

		return null
	}

	public release(obj: TObject) {
		// this.usedSize--
		if (this.size < this.maxSize) {
			this._stack[this.size] = obj
			this.size++
		}
	}
}
