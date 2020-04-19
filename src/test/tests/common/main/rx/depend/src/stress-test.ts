import {isThenable, IThenable} from '../../../../../../../main/common/async/async'
import {Random} from '../../../../../../../main/common/random/Random'
import {
	getCallState,
	getOrCreateCallState,
} from '../../../../../../../main/common/rx/depend/core/CallState'
import {
	CallStatus,
	Func,
	ICallState,
	ICallStateAny,
	IDeferredOptions,
} from '../../../../../../../main/common/rx/depend/core/contracts'
import {depend, dependX} from '../../../../../../../main/common/rx/depend/core/depend'
import {assert} from '../../../../../../../main/common/test/Assert'

// region contracts

type TFuncId = number
interface IFunc<TThis, TArgs extends any[], TResult> {
	(this: TThis, ...args: TArgs): TResult
	id: TFuncId
}

type TCallId = string
interface ICall<TThis, TArgs extends any[], TResult> {
	(): TResult
	id: TCallId
	level: number
	func: IFunc<TThis, TArgs, TResult>
	_this: TThis
	args: TArgs
}

type TCallState = ICallState<number, number[], number> & {
	data: {
		call: TCall,
		dependencies: TCall[],
	},
}

type TFunc = IFunc<number, number[], number>
type TCall = ICall<number, number[], number>

// endregion

// region helpers

class Pool<TObject> {
	private _length: number = 0
	private readonly _objects: TObject[]
	private readonly _rnd: Random
	private readonly _createObject: () => TObject
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
>(
	func: Func<TThis, TArgs, any>,
): Func<
	TThis,
	TArgs,
	TCallId
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
		return state.value
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

	assert.strictEqual(state.value, sum)

	return sum
}

function checkCallResult(call: TCall, result: number, isLazy: boolean) {
	if (typeof result === 'undefined') {
		assert.ok(isLazy)
	} else {
		assert.strictEqual(typeof result, 'number')
	}

	const checkResult = calcCheckResult(call)

	assert.strictEqual(result, checkResult)
}

function runCall(call: TCall, isLazy: boolean) {
	let result
	if (isLazy) {
		const dependencyState = _getOrCreateCallState(call)
		result = dependencyState.getValue(true)
	} else {
		result = call()
		if (isThenable(result)) {
			return (result as IThenable)
				.then(value => {
					checkCallResult(call, value, true)
					return value
				}, error => {
					console.error(error)
					assert.fail()
				})
		}
	}

	checkCallResult(call, result, true)
	return result
}

function runLazy(
	state: TCallState,
	sumArgs: number,
	countDependencies: number,
	getNextCall: (minLevel: number) => TCall,
) {
	const minLevel = state.data.call.level + 1
	const dependencies = state.data.dependencies
	dependencies.length = 0

	let sum = sumArgs
	for (let i = 0; i < countDependencies; i++) {
		const dependency = getNextCall(minLevel)
		const result = runCall(dependency, false)
		checkCallResult(dependency, result, true)
		dependencies.push(dependency)
		sum += result
	}

	return sum
}

function *runAsIterator(
	state: TCallState,
	sumArgs: number,
	countDependencies: number,
	getNextCall: (minLevel: number) => TCall,
) {
	const minLevel = state.data.call.level + 1
	const dependencies = state.data.dependencies
	dependencies.length = 0

	let sum = sumArgs
	for (let i = 0; i < countDependencies; i++) {
		const dependency = getNextCall(minLevel)
		const result = yield runCall(dependency, false)
		dependencies.push(dependency)
		sum += result
	}

	return sum
}

//endregion

let nextObjectId = 1

export function stressTest({
   iterations,
   maxFuncsCount,
   maxCallsCount,
   countRootCalls,
}: {
   iterations: number,
   maxFuncsCount: number,
   maxCallsCount: number,
   countRootCalls: number,
}) {
	const rnd = new Random()
	const funcs: TFunc[] = []
	const calls: TCall[][] = []
	const callsMap = new Map<TCallId, TCall>()

	function getRandomCall(minLevel: number) {
		const countLevels = calls.length
		let countAvailable = 0
		let countMax = 0
		for (let i = 0; i < countLevels; i++) {
			const count = calls[i].length
			if (i >= minLevel) {
				countAvailable += count
			}
			if (count > countMax) {
				countMax = count
			}
		}

		if (countAvailable > 0) {
			let index = rnd.nextInt(countAvailable)
			for (let i = minLevel; i < countLevels; i++) {
				const count = calls[i].length
				if (index < count) {
					return calls[i][index]
				}
				index -= count
			}
			throw new Error('Call not found')
		}

		throw new Error('countAvailable == 0')
	}

	function initCallState(state: TCallState) {
		state.data.dependencies = []
		state.data.parents = []
		const callId = state.callWithArgs(state._this, getCallId(state.func))
		const call = callsMap.get(callId)
		assert.ok(call)
	}

	function createFunc() {
		const isDependX = rnd.nextBoolean()
		const isLazy = rnd.nextBoolean()

		const func: TFunc = function() {
			const state: TCallState = isDependX
				? this
				: getCallState(func).apply(this, arguments)
			const _this = isDependX
				? this._this
				: this

			let sumArgs = this
			for (let i = 0, len = arguments.length; i < len; i++) {
				sumArgs += arguments[i]
			}

			const countDependencies = rnd.nextBoolean()
				? rnd.nextInt(10)
				: 0

			const result = isLazy
				? runLazy(state, sumArgs, countDependencies, getNextCall)
				: runAsIterator(state, sumArgs, countDependencies, getNextCall)

			return result
		} as any

		func.id = nextObjectId++

		const isDeferred = rnd.nextBoolean()
		const deferredOptions: IDeferredOptions = isDeferred
			? {
				delayBeforeCalc: rnd.nextBoolean()
					? void 0
					: (rnd.nextBoolean() ? 0 : rnd.nextInt(1, 2)),
				minTimeBetweenCalc: rnd.nextBoolean()
					? void 0
					: (rnd.nextBoolean() ? 0 : rnd.nextInt(1, 2)),
			}
			: null

		const dependFunc: TFunc = isDependX
			? dependX(func as any, deferredOptions, initCallState as any) as any
			: depend(func, deferredOptions, initCallState as any) as any

		dependFunc.id = func.id

		return dependFunc
	}

	function getNextFunc() {
		if (funcs.length !== 0 && rnd.nextBoolean(funcs.length / maxFuncsCount)) {
			return rnd.nextArrayItem(funcs)
		}

		const func = createFunc()
		funcs.push(func)
		return func
	}

	function createCall(level: number) {
		for (let i = 0; i < 100; i++) {
			const call = _createCall(level)
			if (call != null) {
				return call
			}
		}
		throw new Error('Cannot create call')
	}

	function _createCall(level: number) {
		const func = getNextFunc()

		const countArgs = rnd.nextBoolean()
			? rnd.nextInt(3)
			: 0

		const _this = rnd.nextInt(3)

		const args = []
		for (let i = 0; i < countArgs; i++) {
			args[i] = rnd.nextInt(3)
		}

		const callId = getCallId(func).apply(_this, args)

		if (callsMap.has(callId)) {
			return null
		}

		const call: TCall = function() {
			return func.apply(_this, args)
		}

		call.id = callId
		call.level = level
		call.func = func
		call._this = _this
		call.args = args

		while (level >= calls.length) {
			calls.push([])
		}
		calls[level].push(call)
		callsMap.set(callId, call)

		return call
	}

	function getNextCall(minLevel: number) {
		if (minLevel < calls.length && rnd.nextBoolean(callsMap.size / maxCallsCount)) {
			return getRandomCall(minLevel)
		}

		const call = createCall(minLevel)

		return call
	}

	for (let i = 0; i < countRootCalls; i++) {
		const call = getNextCall(0)
	}

	async function test() {
		const thenables = []
		for (let i = 0; i < iterations; i++) {
			if (thenables.length > 0) {
				if (rnd.nextBoolean(thenables.length / 100)) {
					await Promise.all(thenables)
				} else if (rnd.nextBoolean(thenables.length / 20)) {
					const index = rnd.nextInt(thenables.length)
					const thenable = thenables[index]
					thenables[index] = thenables[thenables.length - 1]
					thenables.length--
					await thenable
				}
			}

			const call = getRandomCall(0)
			const isLazy = rnd.nextBoolean()
			const result = runCall(call, isLazy)
			if (isThenable(result)) {
				thenables.push(result)
			}
		}

		await Promise.all(thenables)
	}

	return test()
}
