import {isThenable, IThenable} from '../../../../../../../main/common/async/async'
import {Func} from '../../../../../../../main/common/helpers/typescript'
import {Random} from '../../../../../../../main/common/random/Random'
import {
	getCallState,
	getOrCreateCallState,
	invalidateCallState,
} from '../../../../../../../main/common/rx/depend/core/CallState'
import {
	CallStatus,
	ICallState,
	ICallStateAny,
	IDeferredOptions, TCallStateAny,
} from '../../../../../../../main/common/rx/depend/core/contracts'
import {getCurrentState} from '../../../../../../../main/common/rx/depend/core/current-state'
import {depend, dependX} from '../../../../../../../main/common/rx/depend/core/depend'
import {assert} from '../../../../../../../main/common/test/Assert'
import {delay} from '../../../../../../../main/common/time/helpers'
import {clearCallStates} from './helpers'

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
	getCallState(): TCallState
	getOrCreateCallState(): TCallState
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
	this: ICall<TThis, TArgs, TResult>,
): ICallState<TThis, TArgs, TResult> {
	return checkCallState(
		this,
		getOrCreateCallState(this.dependFunc).apply(this._this, this.args),
		false,
	)
}

function _getCallState<TThis, TArgs extends any[], TResult>(
	this: ICall<TThis, TArgs, TResult>,
): ICallState<TThis, TArgs, TResult> {
	return checkCallState(
		this,
		getCallState(this.dependFunc).apply(this._this, this.args),
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

function checkDependenciesIsEmpty(state: ICallStateAny) {
	assert.strictEqual((state as any)._unsubscribersLength, 0)
}

function checkDependenciesNoDuplicates(state: ICallStateAny) {
	const {_unsubscribers, _unsubscribersLength} = state as any as TCallStateAny
	for (let i = 0; i < _unsubscribersLength; i++) {
		for (let j = i + 1; j < _unsubscribersLength; j++) {
			if (_unsubscribers[i].state === _unsubscribers[j].state) {
				throw new Error('Found duplicate dependency')
			}
		}
	}
}

function checkDependencies(state: ICallStateAny) {
	checkDependenciesNoDuplicates(state)

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
	const state = call.getCallState()
	assert.ok(state)

	if (!isCalculated(state) || state.data.noChanges) {
		return state.value
	}

	checkDependencies(state)

	const sumArgs = calcSumArgs.apply(call._this, call.args)

	const dependencies: TCall[] = state.data.dependencies
	assert.ok(Array.isArray(dependencies))

	let sum = sumArgs
	for (let i = 0, len = dependencies.length; i < len; i++) {
		const dependency = dependencies[i]
		const dependencyState = dependency.getCallState()
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

function checkSubscribers(state: TCallStateAny) {
	let prevLink = null
	let link = state._subscribersFirst
	while (link != null) {
		assert.strictEqual(link.prev, prevLink)
		assert.strictEqual(link.state, state)
		assert.ok(link.value)
		assert.notStrictEqual(link.value, state)
		prevLink = link
		link = link.next
	}
	assert.strictEqual(state._subscribersLast, prevLink)

	const {_unsubscribers, _unsubscribersLength} = state
	for (let i = 0; i < _unsubscribersLength; i++) {
		const _unsubscriber = _unsubscribers[i]
		assert.ok(_unsubscriber)
		assert.strictEqual(_unsubscriber.value, state)
		assert.ok(_unsubscriber.state)
		assert.notStrictEqual(_unsubscriber.state, state)
	}

	if (_unsubscribers != null) {
		for (let i = _unsubscribersLength, len3 = _unsubscribers.length; i < len3; i++) {
			assert.strictEqual(_unsubscribers[i], null)
		}
	}
}

function runCall(call: TCall, isLazy: boolean) {
	let result
	if (isLazy) {
		const state = call.getOrCreateCallState()
		result = state.getValue(true)
	} else {
		result = call()
		const state = call.getCallState()
		if (isThenable(result)) {
			assert.strictEqual(state.valueAsync, result)
			return (result as IThenable)
				.then(value => {
					checkCallResult(call, call.getCallState().value, false)
					// checkCallResult(call, value, false)
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
	getNextCall: (minLevel: number, parent: TCallState) => TCall,
) {
	let currentState = getCurrentState()
	assert.strictEqual(currentState, state)

	const minLevel = state.data.call.level + 1
	const dependencies = state.data.dependencies

	const oldDependencies = rnd.nextBoolean()
	if (oldDependencies) {
		countDependencies = dependencies.length
	} else {
		dependencies.length = 0
	}

	checkDependenciesIsEmpty(state)

	let sum = sumArgs
	for (let i = 0; i < countDependencies; i++) {
		const dependency = oldDependencies
			? dependencies[i]
			: getNextCall(minLevel, state)
		const result = runCall(dependency, true)

		currentState = getCurrentState()
		assert.strictEqual(currentState, state)

		if (oldDependencies) {
			checkDependenciesNoDuplicates(state)
		} else {
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
	getNextCall: (minLevel: number, parent: TCallState) => TCall,
	disableLazy: boolean,
) {
	let currentState = getCurrentState()
	assert.strictEqual(currentState, state)

	const minLevel = state.data.call.level + 1
	const dependencies = state.data.dependencies

	const oldDependencies = rnd.nextBoolean()
	if (oldDependencies) {
		countDependencies = dependencies.length
	} else {
		dependencies.length = 0
	}

	checkDependenciesIsEmpty(state)

	let sum = sumArgs
	for (let i = 0; i < countDependencies; i++) {
		const dependency = oldDependencies
			? dependencies[i]
			: getNextCall(minLevel, state)
		const isLazy = !disableLazy && rnd.nextBoolean()
		const result = yield runCall(dependency, isLazy)

		currentState = getCurrentState()
		assert.strictEqual(currentState, state)

		if (oldDependencies) {
			checkDependenciesNoDuplicates(state)
		} else {
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

export async function stressTest({
	seed,
	testsCount,
	iterationsPerTest,
	iterationsPerCall,
	maxLevelsCount,
	maxFuncsCount,
	maxCallsCount,
	countRootCalls,
	disableAsync,
	disableDeferred,
	disableLazy,
}: {
	seed?: number,
	testsCount: number,
	iterationsPerTest?: number,
	iterationsPerCall?: number,
	maxLevelsCount: number|[number, number],
	maxFuncsCount: number|[number, number],
	maxCallsCount: number|[number, number],
	countRootCalls: number|[number, number],
	disableAsync?: boolean|null,
	disableDeferred?: boolean|null,
	disableLazy?: boolean|null,
}) {
	for (let i = 0; i < testsCount; i++) {
		console.log(`test number: ${i}`)

		const _seed = seed != null
			? seed
			: new Random().nextInt(2 << 29)

		console.log(`seed = ${_seed}`)
		const rnd = new Random(_seed)

		const _maxLevelsCount = Array.isArray(maxLevelsCount)
			? rnd.nextInt(maxLevelsCount[0], maxLevelsCount[1] + 1)
			: maxLevelsCount

		const _maxFuncsCount = Array.isArray(maxFuncsCount)
			? rnd.nextInt(maxFuncsCount[0], maxFuncsCount[1] + 1)
			: maxFuncsCount

		const _maxCallsCount = Array.isArray(maxCallsCount)
			? rnd.nextInt(
				maxCallsCount[0],
				Math.min(_maxFuncsCount * 10, maxCallsCount[1] + 1),
			)
			: maxCallsCount

		const _countRootCalls = Array.isArray(countRootCalls)
			? rnd.nextInt(countRootCalls[0], countRootCalls[1] + 1)
			: countRootCalls

		const _disableAsync = disableAsync == null
			? rnd.nextBoolean()
			: disableAsync

		const _disableDeferred = disableDeferred == null
			? rnd.nextBoolean()
			: disableDeferred

		const _disableLazy = disableLazy == null
			? rnd.nextBoolean()
			: disableLazy

		const _iterationsPerTest = iterationsPerTest == null
			? iterationsPerCall * _maxCallsCount
			: iterationsPerTest

		await _stressTest({
			rnd,
			iterations: _iterationsPerTest,
			maxLevelsCount: _maxLevelsCount,
			maxFuncsCount: _maxFuncsCount,
			maxCallsCount: _maxCallsCount,
			countRootCalls: _countRootCalls,
			disableAsync: _disableAsync,
			disableDeferred: _disableDeferred,
			disableLazy: _disableLazy,
		})

		clearCallStates()
	}
}

function _stressTest({
	rnd,
	iterations,
	maxLevelsCount,
	maxFuncsCount,
	maxCallsCount,
	countRootCalls,
	disableAsync,
	disableDeferred,
	disableLazy,
}: {
	rnd: Random,
	iterations: number,
	maxLevelsCount: number,
	maxFuncsCount: number,
	maxCallsCount: number,
	countRootCalls: number,
	disableAsync?: boolean,
	disableDeferred?: boolean,
	disableLazy?: boolean,
}) {
	const funcs: TDependFunc[] = []
	const calls: TCall[][] = []
	const callsMap = new Map<TCallId, TCall>()

	function getRandomCall(minLevel: number, parent?: TCallState) {
		if (parent != null) {
			let dependency = null
			let dependencyState = parent
			const variant = rnd.next()
			if (variant < 0.14) {
				if (dependencyState == null || dependencyState.data.dependencies.length === 0) {
					dependency = null
				} else {
					dependency = rnd.nextArrayItem(dependencyState.data.dependencies)
					if (variant < 0.12) {
						dependencyState = dependency.getCallState()
						if (dependencyState == null || dependencyState.data.dependencies.length === 0) {
							dependency = null
						} else {
							dependency = rnd.nextArrayItem(dependencyState.data.dependencies)
							if (variant < 0.08) {
								dependencyState = dependency.getCallState()
								if (dependencyState == null || dependencyState.data.dependencies.length === 0) {
									dependency = null
								} else {
									dependency = rnd.nextArrayItem(dependencyState.data.dependencies)
								}
							}
						}
					}
				}
			}
			if (dependency != null) {
				return dependency
			}
		}

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

			checkDependenciesIsEmpty(state)

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
				const currentState = getCurrentState()
				assert.strictEqual(currentState, state)

				checkDependenciesIsEmpty(state)

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
				return (function*() {
					let currentState = getCurrentState()
					assert.strictEqual(currentState, state)

					if (rnd.nextBoolean()) {
						yield delay(0)
					}

					currentState = getCurrentState()
					assert.strictEqual(currentState, state)

					const result = yield calc()

					currentState = getCurrentState()
					assert.strictEqual(currentState, state)

					if (rnd.nextBoolean()) {
						yield delay(0)
					}

					currentState = getCurrentState()
					assert.strictEqual(currentState, state)

					return result
				})()
			}

			return calc()
		} as any

		func.id = nextObjectId++

		const isDeferred = !disableDeferred && rnd.nextBoolean()
		const deferredOptions: IDeferredOptions = isDeferred
			? {
				delayBeforeCalc: rnd.nextBoolean(0.3)
					? (rnd.nextBoolean() ? 0 : rnd.nextInt(1, 100))
					: void 0,
				minTimeBetweenCalc: rnd.nextBoolean()
					? (rnd.nextBoolean() ? 0 : rnd.nextInt(1, 100))
					: void 0,
				autoInvalidateInterval: rnd.nextBoolean(0.2)
					? (rnd.nextBoolean() ? 0 : rnd.nextInt(1, 100))
					: void 0,
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
		call.getCallState = _getCallState as any
		call.getOrCreateCallState = _getOrCreateCallState as any

		while (level >= calls.length) {
			calls.push([])
		}
		calls[level].push(call)
		callsMap.set(callId, call)

		return call
	}

	function getNextCall(minLevel: number, parent?: TCallState) {
		if (minLevel < calls.length && rnd.nextBoolean(callsMap.size / maxCallsCount)) {
			return getRandomCall(minLevel, parent)
		}

		const call = createCall(minLevel)

		return call
	}

	for (let i = 0; i < countRootCalls; i++) {
		const call = getNextCall(0)
	}

	function checkSubscribersAll() {
		for (let i = 0, len = calls.length; i < len; i++) {
			const level = calls[i]
			for (let j = 0, len2 = level.length; j < len2; j++) {
				const call = level[j]
				const state = call.getCallState()
				if (state != null) {
					checkSubscribers(state as any)
				}
			}
		}
	}

	async function waitAll() {
		const thenables = []

		await delay(150)

		for (let i = 0, len = calls.length; i < len; i++) {
			const level = calls[i]
			for (let j = 0, len2 = level.length; j < len2; j++) {
				const call = level[j]
				const value = call()
				if (isThenable(value)) {
					thenables.push(value)
				}
			}
		}

		await Promise.all(thenables)

		await delay(50)
	}

	async function test() {
		let time = Date.now()
		const thenables = []

		function calc() {
			const call = getRandomCall(0)
			const isLazy = !disableLazy && rnd.nextBoolean()
			const result = runCall(call, isLazy)
			const state = call.getCallState()
			assert.ok(state)
			if (isThenable(result)) {
				assert.ok(!disableDeferred || !disableAsync)
				thenables.push(result)
			} else {
				assert.strictEqual(state.value, result)
			}
		}

		function invalidate() {
			const call = getRandomCall(0)
			invalidateCallState(getCallState(call.dependFunc).apply(call._this, call.args))
		}

		for (let i = 0; i < iterations; i++) {
			const now = Date.now()
			if (now >= time + 10 * 1000) {
				time = now
				console.log(i)
			}

			const currentState = getCurrentState()
			assert.strictEqual(currentState, null)

			let func

			const step = rnd.next()
			if (step < thenables.length / 100) {
				await Promise.all(thenables)
			} else if (step < thenables.length / 20) {
				const index = rnd.nextInt(thenables.length)
				const thenable = thenables[index]
				thenables[index] = thenables[thenables.length - 1]
				thenables.length--
				await thenable
			} else {
				if (step < (i % 100) / 100) {
					func = calc
				} else {
					func = invalidate
				}

				if (rnd.nextBoolean()) {
					func()
				} else {
					setTimeout(func, rnd.nextBoolean() ? 0 : rnd.nextInt(100))
				}
			}

			// checkSubscribersAll()
		}

		await Promise.all(thenables)
		await waitAll()
	}

	return test()
}
