import {isThenable, IThenable} from '../../../../../../../main/common/async/async'
import {Random} from '../../../../../../../main/common/random/Random'
import {
	getCallState,
	getOrCreateCallState,
	invalidateCallState, TCallStateAny,
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
import {delay} from '../../../../../../../main/common/time/helpers'

// region contracts

type TFuncId = number
interface IFunc<TThis, TArgs extends any[], TResult> extends Func<TThis, TArgs, TResult> {
	id: TFuncId
}

interface IDependFunc<TThis, TArgs extends any[], TResult> extends Func<TThis, TArgs, TResult> {
	func: IFunc<TThis, TArgs, TResult>
}

type TCallId = string
interface ICall<TThis, TArgs extends any[], TResult> {
	(): TResult
	id: TCallId
	level: number
	dependFunc: IDependFunc<TThis, TArgs, TResult>
	_this: TThis
	args: TArgs
}

type TCallState = ICallState<number, number[], number> & {
	data: {
		call: TCall,
		dependencies: TCall[],
		noChanges: boolean,
	},
}

type TFunc = IFunc<number, number[], number>
type TDependFunc = IDependFunc<number, number[], number>
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
	funcId: number,
): Func<
	TThis,
	TArgs,
	TCallId
> {
	return function() {
		const buffer = [funcId, this]
		for (let i = 0, len = arguments.length; i < len; i++) {
			buffer.push(arguments[i])
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
	assert.strictEqual(state.func, call.dependFunc.func)
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
		getOrCreateCallState(call.dependFunc).apply(call._this, call.args),
		false,
	)
}

function _getCallState<TThis, TArgs extends any[], TResult>(
	call: ICall<TThis, TArgs, TResult>,
): ICallState<TThis, TArgs, TResult> {
	return checkCallState(
		call,
		getCallState(call.dependFunc).apply(call._this, call.args),
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

function checkDependencies(state: ICallStateAny) {
	const dependencies = state.data.dependencies
	const {_unsubscribers, _unsubscribersLength} = state as any as TCallStateAny

	for (let i = 0, len = dependencies.length; i < len; i++) {
		const dependency = dependencies[i]
		let found
		for (let j = 0; j < _unsubscribersLength; j++) {
			const _dependency = _unsubscribers[j].state.data.call
			if (_dependency === dependency) {
				found = true
				break
			}
		}
		assert.ok(found)
	}

	for (let i = 0; i < _unsubscribersLength; i++) {
		const _dependency = _unsubscribers[i].state.data.call
		assert.ok(dependencies.indexOf(_dependency) >= 0)
	}
}

function calcCheckResult(call: TCall) {
	const state = _getCallState(call)
	assert.ok(state)

	checkDependencies(state)

	if (!isCalculated(state) || state.data.noChanges) {
		return state.value
	}

	const sumArgs = calcSumArgs.apply(call._this, call.args)

	const dependencies: TCall[] = state.data.dependencies
	assert.ok(Array.isArray(dependencies))

	let sum = sumArgs
	for (let i = 0, len = dependencies.length; i < len; i++) {
		const dependency = dependencies[i]
		const dependencyState = _getCallState(dependency)
		assert.ok(dependencyState)
		if (typeof dependencyState.value !== 'undefined') {
			sum += dependencyState.value
		}
	}

	if (state.value !== sum) {
		assert.strictEqual(state.value, sum)
	}

	return sum
}

function checkCallResult(call: TCall, result: number, isLazy: boolean) {
	if (typeof result === 'undefined') {
		assert.ok(isLazy)
	} else {
		assert.ok(Number.isFinite(result))
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
					checkCallResult(call, value, false)
					return value
				}, error => {
					console.error(error)
					assert.fail()
				})
		}
	}

	checkCallResult(call, result, isLazy)

	return result
}

function runLazy(
	rnd: Random,
	state: TCallState,
	sumArgs: number,
	countDependencies: number,
	getNextCall: (minLevel: number) => TCall,
) {
	const minLevel = state.data.call.level + 1
	const dependencies = state.data.dependencies

	const oldDependencies = rnd.nextBoolean()
	if (oldDependencies) {
		countDependencies = dependencies.length
	} else {
		dependencies.length = 0
	}

	let sum = sumArgs
	for (let i = 0; i < countDependencies; i++) {
		const dependency = oldDependencies
			? dependencies[i]
			: getNextCall(minLevel)
		const result = runCall(dependency, true)
		if (!oldDependencies) {
			dependencies.push(dependency)
			checkDependencies(state)
		}
		if (typeof result !== 'undefined') {
			sum += result
		}
	}

	assert.ok(Number.isFinite(sum))
	checkDependencies(state)

	return sum
}

function *runAsIterator(
	rnd: Random,
	state: TCallState,
	sumArgs: number,
	countDependencies: number,
	getNextCall: (minLevel: number) => TCall,
	disableLazy: boolean,
) {
	const minLevel = state.data.call.level + 1
	const dependencies = state.data.dependencies

	const oldDependencies = rnd.nextBoolean()
	if (oldDependencies) {
		countDependencies = dependencies.length
	} else {
		dependencies.length = 0
	}

	let sum = sumArgs
	for (let i = 0; i < countDependencies; i++) {
		const dependency = oldDependencies
			? dependencies[i]
			: getNextCall(minLevel)
		const isLazy = !disableLazy && rnd.nextBoolean()
		const result = yield runCall(dependency, isLazy)
		if (!oldDependencies) {
			dependencies.push(dependency)
			checkDependencies(state)
		}
		if (typeof result !== 'undefined') {
			sum += result
		}
	}

	assert.ok(Number.isFinite(sum))
	checkDependencies(state)

	return sum
}

//endregion

let nextObjectId = 1

export function stressTest({
	iterations,
	maxLevelsCount,
	maxFuncsCount,
	maxCallsCount,
	countRootCalls,
	disableAsync,
	disableDeferred,
	disableLazy,
}: {
	iterations: number,
	maxLevelsCount: number,
	maxFuncsCount: number,
	maxCallsCount: number,
	countRootCalls: number,
	disableAsync?: boolean,
	disableDeferred?: boolean,
	disableLazy?: boolean,
}) {
	const rnd = new Random(1)
	const funcs: TDependFunc[] = []
	const calls: TCall[][] = []
	const callsMap = new Map<TCallId, TCall>()

	function getRandomCall(minLevel: number) {
		const countLevels = calls.length
		let countAvailable = 0
		for (let i = 0; i < countLevels; i++) {
			const count = calls[i].length
			if (i >= minLevel) {
				countAvailable += count
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
		const callId = state.callWithArgs(state._this, getCallId((state.func as any).id))
		const call = callsMap.get(callId)
		assert.ok(call)
		state.data.call = call
		state.data.dependencies = []
		state.data.noChanges = false
	}

	function createDependFunc() {
		const isDependX = rnd.nextBoolean()

		const func: TFunc = function() {
			const state: TCallState = isDependX
				? this
				: getCallState(func).apply(this, arguments)
			const _this = isDependX
				? this._this
				: this

			let sumArgs = _this
			for (let i = 0, len = arguments.length; i < len; i++) {
				sumArgs += arguments[i]
			}

			assert.ok(state.data.call.level < maxLevelsCount)

			const countDependencies = rnd.nextBoolean()
				? rnd.nextInt(maxLevelsCount - state.data.call.level - 1)
				: 0

			const isLazyAll = !disableLazy && rnd.nextBoolean()

			function calc() {
				const noChanges = rnd.nextBoolean()
				if (noChanges && (state.status & CallStatus.Flag_HasValue) !== 0) {
					state.data.dependencies.length = 0
					state.data.noChanges = true
					return state.value
				}

				state.data.noChanges = false

				return isLazyAll
					? runLazy(rnd, state, sumArgs, countDependencies, getNextCall)
					: runAsIterator(rnd, state, sumArgs, countDependencies, getNextCall, disableLazy)
			}

			if (!disableAsync && rnd.nextBoolean(0.1)) {
				return (async () => {
					if (rnd.nextBoolean()) {
						await delay(0)
					}

					const result = calc()

					if (rnd.nextBoolean()) {
						await delay(0)
					}

					return result
				})()
			}

			return calc()
		} as any

		func.id = nextObjectId++

		const isDeferred = !disableDeferred && rnd.nextBoolean()
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

		const dependFunc: TDependFunc = isDependX
			? dependX(func as any, deferredOptions, initCallState as any) as any
			: depend(func, deferredOptions, initCallState as any) as any

		dependFunc.func = func

		return dependFunc
	}

	function getNextDependFunc() {
		if (funcs.length !== 0 && rnd.nextBoolean(funcs.length / maxFuncsCount)) {
			return rnd.nextArrayItem(funcs)
		}

		const dependFunc = createDependFunc()
		funcs.push(dependFunc)
		return dependFunc
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
		const dependFunc = getNextDependFunc()

		const countArgs = rnd.nextBoolean()
			? rnd.nextInt(3)
			: 0

		const _this = rnd.nextInt(1, 4)

		const args = []
		for (let i = 0; i < countArgs; i++) {
			args[i] = rnd.nextInt(1, 4)
		}

		const callId = getCallId(dependFunc.func.id).apply(_this, args)

		if (callsMap.has(callId)) {
			return null
		}

		const call: TCall = function() {
			return dependFunc.apply(_this, args)
		}

		call.id = callId
		call.level = level
		call.dependFunc = dependFunc
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
			const step = rnd.next()
			if (step < thenables.length / 100) {
				await Promise.all(thenables)
			} else if (step < thenables.length / 20) {
				const index = rnd.nextInt(thenables.length)
				const thenable = thenables[index]
				thenables[index] = thenables[thenables.length - 1]
				thenables.length--
				await thenable
			} else if (step < 0.6) {
				const call = getRandomCall(0)
				const isLazy = !disableLazy && rnd.nextBoolean()
				const result = runCall(call, isLazy)
				const state = _getCallState(call)
				assert.ok(state)
				if (isThenable(result)) {
					assert.ok(!disableDeferred || !disableAsync)
					thenables.push(result)
					assert.strictEqual(state.valueAsync, result)
				} else {
					assert.strictEqual(state.value, result)
				}
			} else {
				const call = getRandomCall(0)
				invalidateCallState(getCallState(call.dependFunc).apply(call._this, call.args))
			}
		}

		await Promise.all(thenables)
	}

	return test()
}
