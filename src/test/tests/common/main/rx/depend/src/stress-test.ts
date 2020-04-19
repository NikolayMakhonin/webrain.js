import {Random} from '../../../../../../../main/common/random/Random'
import {
	getCallState,
	getOrCreateCallState,
	TCallStateAny,
} from '../../../../../../../main/common/rx/depend/core/CallState'
import {CallStatus, Func, ICallState, ICallStateAny} from '../../../../../../../main/common/rx/depend/core/contracts'
import {assert} from '../../../../../../../main/common/test/Assert'

// region contracts

interface IFunc<TThis, TArgs extends any[], TResult> {
	(this: TThis, ...args: TArgs): TResult
	id: number
}

interface ICall<TThis, TArgs extends any[], TResult> {
	(): TResult
	id: string
	func: IFunc<TThis, TArgs, TResult>
	_this: TThis
	args: TArgs
}

type TCallState = ICallState<number, number[], number> & {
	data: {
		dependencies: TCall[],
	},
}
type TCall = ICall<number, number[], number>
type TFunc = IFunc<number, number[], number>

// endregion

// region helpers

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

function getCallId<
	TThis,
	TArgs extends any[],
	TResult,
	>(
	func: Func<TThis, TArgs, TResult>,
): Func<
	TThis,
	TArgs,
	string
	> {
	return function() {
		const buffer = [(func as any).id, this]
		for (let i = 0, len = arguments.length; i < len; i++) {
			buffer[i] = arguments[i]
		}
		return buffer.join('_')
	}
}

function checkCallState<TThis, TArgs extends any[], TResult>(
	call: ICall<TThis, TArgs, TResult>,
	state: ICallState<TThis, TArgs, TResult>,
	canBeNull: boolean,
) {
	if (state == null && canBeNull) {
		return
	}

	assert.ok(state)
	assert.strictEqual(state.func, call.func)
	assert.strictEqual(state._this, call._this)

	let args
	state.callWithArgs(null, function() {
		args = Array.from(arguments)
	})

	assert.deepStrictEqual(args, call.args)

	return state
}

function _getOrCreateCallState<TThis, TArgs extends any[], TResult>(
	call: ICall<TThis, TArgs, TResult>,
): ICallState<TThis, TArgs, TResult> {
	return checkCallState(
		call,
		getOrCreateCallState(call.func).apply(call._this, call.args),
		false,
	)
}

function _getCallState<TThis, TArgs extends any[], TResult>(
	call: ICall<TThis, TArgs, TResult>,
): ICallState<TThis, TArgs, TResult> {
	return checkCallState(
		call,
		getCallState(call.func).apply(call._this, call.args),
		true,
	)
}

function calcSumArgs(this: number): number
function calcSumArgs(this: number, ...args: number[]): number {
	let sum = this
	for (let i = 0, len = arguments.length; i < len; i++) {
		sum += arguments[i]
	}
	return sum
}

function isCalculated(state: ICallStateAny) {
	const status = state.status
	if (
		(status & CallStatus.Flag_HasValue) === 0
		|| (status & CallStatus.Flag_Calculating) !== 0
		|| (status & CallStatus.Flag_Recalc) !== 0
	) {
		return false
	}

	return true
}

function calcCheckResult(call: TCall) {
	const state = _getCallState(call)
	assert.ok(state)

	if (!isCalculated(state)) {
		return null
	}

	let sum = calcSumArgs.apply(call._this, call.args)

	const dependencies: TCall[] = state.data.dependencies
	assert.ok(Array.isArray(dependencies))

	if (dependencies != null) {
		for (let i = 0, len = dependencies.length; i < len; i++) {
			const dependency = dependencies[i]
			const dependencyState = _getCallState(dependency)
			if (dependencyState.value != null) {
				sum += dependencyState.value
			}
		}
	}

	return sum
}

function checkCallResult(call: TCall, result: number, isLazy: boolean) {
	if (typeof result === 'undefined') {
		assert.ok(isLazy)
	} else {
		assert.strictEqual(typeof result, 'number')
	}

	const checkResult = calcCheckResult(call)
	if (checkResult == null) {
		return
	}

	assert.strictEqual(result, checkResult)
}

function runLazy(state: TCallState, sum: number, countDependencies: number, getNextCall: () => TCall) {
	state.data.dependencies.length = 0
	for (let i = 0; i < countDependencies; i++) {
		const dependency = getNextCall()
		const result = _getOrCreateCallState(dependency).getValue(true)
		checkCallResult(dependency, result, true)
		state.data.dependencies.push(dependency)
		sum += result
	}
	return sum
}

function *runAsIterator(state: TCallState, sum: number, countDependencies: number, getNextCall: () => TCall) {
	state.data.dependencies.length = 0
	for (let i = 0; i < countDependencies; i++) {
		const dependency = getNextCall()
		const result = yield _getOrCreateCallState(dependency).getValue(true)
		checkCallResult(dependency, result, false)
		state.data.dependencies.push(dependency)
		sum += result
	}
	return sum
}

//endregion

let nextObjectId = 1

function stressTest(iterations: number) {
	const rnd = new Random()
	const funcs: TFunc[] = []

	const callsFree = new Pool<TCall>(rnd, createCall)
	const callsUsed = new Pool<TCall>(rnd)

	function createCall() {
		const func = rnd.nextArrayItem(funcs)

		const countArgs = rnd.nextBoolean()
			? rnd.nextInt(3)
			: 0

		const _this = rnd.nextInt(3)

		const args = []
		for (let i = 0; i < countArgs; i++) {
			args[i] = rnd.nextInt(3)
		}

		const call: TCall = function() {
			return func.apply(_this, args)
		}

		call.func = func
		call._this = _this
		call.args = args
		call.id = getCallId(func).apply(_this, args)

		return call
	}

	function createFunc() {
		const isDependX = rnd.nextBoolean()
		const isLazy = rnd.nextBoolean()

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

			let sum = this
			for (let i = 0, len = arguments.length; i < len; i++) {
				sum += arguments[i]
			}

			if (isLazy) {
				let sum = 0
				for (let i = 0; i < countDependencies; i++) {
					const dependency = callsFree.get()
					const result = _getOrCreateCallState(dependency).getValue(true)
					// TODO assert result
					sum += result
				}
				return sum
			}
		}

		func.id = nextObjectId++
	}
}
