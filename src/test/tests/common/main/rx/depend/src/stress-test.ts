import {Random} from '../../../../../../../main/common/random/Random'
import {getCallState} from '../../../../../../../main/common/rx/depend/core/CallState'
import {Func} from '../../../../../../../main/common/rx/depend/core/contracts'

class Pool<TObject> {
	private _length: number = 0
	private _objects: TObject[]
	private _rnd: Random
	private _createObject: () => TObject
	constructor(
		rnd: Random,
		createObject?: () => TObject,
	) {
		this._rnd = rnd
		this._createObject = createObject
		this._objects = []
	}

	public get(): TObject {
		const {_length, _objects} = this
		if (this._length === 0) {
			if (this._createObject == null) {
				throw new Error('Pool is empty')
			}
			return this._createObject()
		}
		const index = this._rnd.nextInt(_length)
		const object = _objects[index]
		const lastIndex = _length - 1
		_objects[index] = _objects[lastIndex]
		_objects[lastIndex] = null
		this._length = lastIndex
		return object
	}

	public release(object: TObject) {
		this._objects.push(object)
		this._length++
	}
}

function stressTest(iterations: number) {
	const rnd = new Random()
	const funcsFree = new Pool<Func<number, number[], number>>(rnd, createFunc)
	const funcsUsed = new Pool<Func<number, number[], number>>(rnd)

	function createFunc() {
		const isDependX = rnd.nextBoolean()
		const func = function() {
			const state = isDependX
				? this
				: getCallState(func).apply(this, arguments)
			const _this = isDependX
				? this._this
				: this

			const countDependencies = rnd.nextBoolean()
				? rnd.nextInt(10)
				: 0

			for (let i = 0; i < countDependencies; i++) {
				const func = funcsFree.get()
			}
		}
	}
}
