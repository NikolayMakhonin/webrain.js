/* tslint:disable:no-identical-functions no-shadowed-variable no-duplicate-string no-construct use-primitive-type */
import {isAsync, isThenable, Thenable, ThenableOrValue} from '../../../../../../../main/common/async/async'
import {resolveAsync, ThenableSync} from '../../../../../../../main/common/async/ThenableSync'
import {
	deleteCallState,
	getOrCreateCallState,
	statusToString,

} from '../../../../../../../main/common/rx/depend/core/CallState'
import {CallStatus, IDeferredOptions, TCallStateAny} from '../../../../../../../main/common/rx/depend/core/contracts'
import {getCurrentState} from '../../../../../../../main/common/rx/depend/core/current-state'
import {depend} from '../../../../../../../main/common/rx/depend/core/facade'
import {InternalError} from '../../../../../../../main/common/rx/depend/core/helpers'
import {assert} from '../../../../../../../main/common/test/Assert'
import {delay} from '../../../../../../../main/common/time/helpers'

if (typeof global !== 'undefined') {
	// for debug only
	(global as any).statusToString = statusToString
}

// region baseTest

const _callHistory = []

type IDependencyCall = (() => ThenableOrValue<string>) & {
	id: string,
	state: TCallStateAny,
	hasLoop: boolean,
}

type IDependencyFunc = ((this: IDependencyCall[], a?: number, b?: number) => ThenableOrValue<string>) & {
	id: string,
}

function getCallId(funcId: string, _this?: any, ...rest: any[]) {
	let callId = funcId
	for (let i = 0, len = rest.length; i < len; i++) {
		callId += rest[i] || 0
	}
	callId += '(' + (
		Array.isArray(_this)
			? _this.filter(o => !o.hasLoop).map(o => o.id).join(',')
			: _this || 0
	) + ')'
	return callId
}

let resultsAsError: string[] = []
function setResultsAsError(...calls: IDependencyCall[]) {
	resultsAsError = calls.map(o => o.id)
}

let alwaysChange: string[] = []
function setAlwaysChange(...calls: IDependencyCall[]) {
	alwaysChange = calls.map(o => o.id)
}

let lazyCalls: string[] = []
function setLazyCalls(...calls: IDependencyCall[]) {
	lazyCalls = calls.map(o => o.id)
}

function callIdToResult(callId: string) {
	let result: any = callId

	if (alwaysChange.indexOf(callId) >= 0) {
		result = new String(result)
	}

	if (resultsAsError.indexOf(callId) >= 0) {
		throw result
	}

	return result
}

function getDeferredOptions(async: boolean): IDeferredOptions {
	return async
		? {
			delayBeforeCalc: 1,
			minTimeBetweenCalc: 10,
		}
		: {}
}

function funcSync(id: string, deferred: boolean) {
	const result: IDependencyFunc = depend(function() {
		const callId = getCallId(id, this, ...arguments)
		const isLazy = lazyCalls.indexOf(callId) >= 0
		_callHistory.push(callId)
		const dependencies = this
		const currentState = getCurrentState()
		assert.strictEqual((currentState as any).id, callId)
		if (Array.isArray(dependencies)) {
			for (let i = 0, len = dependencies.length; i < len * 2; i++) {
				const dependency = dependencies[i % len]
				if (isLazy) {
					const value = dependency.state.getValue(true)
					assert.notOk(dependency.state.error)
					assert.strictEqual(isAsync(value), false)
					if ((dependency.state.status & CallStatus.Flag_Calculated) === 0) {
						assert.strictEqual(value, dependency.state.value)
					} else {
						assert.strictEqual(value + '', dependency.id)
					}
				} else {
					const value = dependency()
					assert.notOk(dependency.state.error)
					assert.strictEqual(value + '', dependency.id)
				}
				assert.strictEqual(getCurrentState(), currentState)
				checkCurrentStateAsync(currentState)
			}
		}
		return callIdToResult(callId)
	}, !deferred ? null : getDeferredOptions(false)) as any

	result.id = id

	return result
}

function funcSyncIterator(id: string, deferred: boolean) {
	const nested = function*(dependencies: IDependencyCall[], currentState, isLazy?: boolean) {
		assert.strictEqual(getCurrentState(), currentState)
		yield 1
		assert.strictEqual(getCurrentState(), currentState)
		if (Array.isArray(dependencies)) {
			for (let i = 0, len = dependencies.length; i < len * 2; i++) {
				const dependency = dependencies[i % len]
				if (isLazy) {
					const value = dependency.state.getValue(true)
					assert.notOk(dependency.state.error)
					assert.strictEqual(isAsync(value), false)
					if ((dependency.state.status & CallStatus.Flag_Calculated) === 0) {
						assert.strictEqual(value, dependency.state.value)
					} else {
						assert.strictEqual(value + '', dependency.id)
					}
				} else {
					const valueAsync = dependency()
					assert.strictEqual(getCurrentState(), currentState)
					const value = yield valueAsync
					assert.notOk(dependency.state.error)
					assert.strictEqual(value + '', dependency.id)
				}
				assert.strictEqual(getCurrentState(), currentState)
				checkCurrentStateAsync(currentState)
			}
		}
		return 1
	}
	const run = function*(callId: string, dependencies: IDependencyCall[], currentState) {
		assert.strictEqual(getCurrentState(), currentState)
		yield 1
		assert.strictEqual(getCurrentState(), currentState)
		yield nested(dependencies, currentState, lazyCalls.indexOf(callId) >= 0)
		assert.strictEqual(getCurrentState(), currentState)
		return callIdToResult(callId)
	}

	const result: IDependencyFunc = depend(function() {
		const callId = getCallId(id, this, ...arguments)
		_callHistory.push(callId)
		const currentState = getCurrentState()
		assert.strictEqual((currentState as any).id, callId)
		const res = run(callId, this as any, currentState)
		assert.strictEqual(getCurrentState(), currentState)
		return res
	}, !deferred ? null : getDeferredOptions(false)) as any

	result.id = id

	return result
}

function funcAsync(id: string, deferred: boolean) {
	const nested = function*() {
		yield 1
		return 1
	}
	const nestedAsync = function*(dependencies: IDependencyCall[], currentState, isLazy?: boolean) {
		assert.strictEqual(getCurrentState(), currentState)
		yield 1
		assert.strictEqual(getCurrentState(), currentState)
		if (dependencies) {
			for (let i = 0, len = dependencies.length; i < len * 2; i++) {
				const dependency = dependencies[i % len]
				if (isLazy) {
					const value = dependency.state.getValue(true)
					assert.notOk(dependency.state.error)
					assert.strictEqual(isAsync(value), false)
					if ((dependency.state.status & CallStatus.Flag_Calculated) === 0) {
						assert.strictEqual(value, dependency.state.value)
					} else {
						assert.strictEqual(value + '', dependency.id)
					}
				} else {
					const valueAsync = dependency()
					assert.strictEqual(getCurrentState(), currentState)
					const value = yield valueAsync
					assert.notOk(dependency.state.error)
					assert.strictEqual(value + '', dependency.id)
				}
				assert.strictEqual(getCurrentState(), currentState)
				checkCurrentStateAsync(currentState)
			}
		}
		yield delay(0)
		assert.strictEqual(getCurrentState(), currentState)
		return 1
	}
	const run = function*(callId: string, dependencies: IDependencyCall[], currentState) {
		assert.strictEqual(getCurrentState(), currentState)
		yield 1
		assert.strictEqual(getCurrentState(), currentState)
		yield delay(0)
		assert.strictEqual(getCurrentState(), currentState)
		yield nested()
		assert.strictEqual(getCurrentState(), currentState)
		yield nestedAsync(dependencies, currentState, lazyCalls.indexOf(callId) >= 0)
		assert.strictEqual(getCurrentState(), currentState)
		return callIdToResult(callId)
	}

	const result: IDependencyFunc = depend(function() {
		const callId = getCallId(id, this, ...arguments)
		_callHistory.push(callId)
		const currentState = getCurrentState()
		assert.strictEqual((currentState as any).id, callId)
		const res = run(callId, this as any, currentState)
		assert.strictEqual(getCurrentState(), currentState)
		return res
	}, !deferred ? null : getDeferredOptions(true)) as any

	result.id = id

	return result
}

function _funcCall(func: IDependencyFunc, callId: string, _this?: any, ...rest: any[]) {
	const result: IDependencyCall = (() => {
		const currentState = getCurrentState()
		const res = func.apply(_this, rest)
		assert.strictEqual(getCurrentState(), currentState)
		return res
	}) as any

	result.id = callId
	result.state = getOrCreateCallState(func).apply(_this, rest)
	assert.ok(result.state)
	assert.strictEqual(result.state.status, CallStatus.Flag_Invalidated | CallStatus.Flag_Recalc);
	(result.state as any).id = callId

	return result
}

function clearState(call: IDependencyCall) {
	const oldState = call.state
	const callId = (oldState as any).id

	let oldArgs
	oldState.callWithArgs(null, function() {
		oldArgs = Array.from(arguments)
	})

	deleteCallState(oldState)

	const newState = oldState.callWithArgs(oldState._this, getOrCreateCallState(oldState.func)) as typeof oldState
	assert.ok(newState)
	assert.notStrictEqual(newState, oldState)
	assert.strictEqual(newState._this, oldState._this)
	assert.strictEqual(newState.func, oldState.func)

	let newArgs
	newState.callWithArgs(null, function() {
		newArgs = Array.from(arguments)
	})

	assert.deepStrictEqual(newArgs, oldArgs);

	(newState as any).id = callId

	call.state = newState
}

function clearStates(...call: IDependencyCall[]) {
	for (let i = 0, len = call.length; i < len; i++) {
		clearState(call[i])
	}
}

function funcCall(func: IDependencyFunc, _this?: any, ...rest: any[]) {
	const callId = getCallId(func.id, _this, ...rest)
	return _funcCall(func, callId, _this, ...rest)
}

class ThisObj {
	private readonly value: string

	constructor(value: string) {
		this.value = value
	}

	public toString() {
		return this.value
	}
}

function checkSync<TValue>(value: TValue): TValue {
	assert.notOk(isThenable(value))
	return value
}

function checkAsync<TValue>(value: ThenableOrValue<TValue>): Thenable<TValue> {
	assert.ok(isThenable(value))
	return value as Thenable<TValue>
}

let callHistoryCheckDisabled = false
function checkCallHistory(...callHistory: IDependencyCall[]) {
	if (callHistoryCheckDisabled) {
		_callHistory.length = 0
		return
	}

	assert.deepStrictEqual(_callHistory, callHistory.map(o => o.id))
	_callHistory.length = 0
}

function checkDependenciesDuplicates(...funcCalls: IDependencyCall[]) {
	const set = new Set()
	for (let i = 0, len = funcCalls.length; i < len; i++) {
		const {state} = funcCalls[i]
		const {_unsubscribers, _unsubscribersLength} = state
		if (_unsubscribers != null) {
			for (let j = 0, len = _unsubscribersLength; j < len; j++) {
				const id = (_unsubscribers[j].state as any).id
				assert.ok(id, (state as any).id)
				assert.notOk(set.has(id), `Duplicate ${id} in ${(state as any).id}`)
				set.add(id)
			}
			set.clear()
		}
	}
}

enum ResultType {
	Any,
	Error,
	Value,
}

function checkFuncSync<TValue>(
	resultType: ResultType,
	funcCall: IDependencyCall,
	...callHistory: IDependencyCall[]
) {
	checkCallHistory()
	checkDependenciesDuplicates(funcCall)
	assert.strictEqual(getCurrentState(), null)

	let value
	let error
	try {
		value = checkSync(funcCall())
	} catch (err) {
		if (err instanceof InternalError) {
			assert.strictEqual(getCurrentState(), null)
			throw err
		}
		error = err
	}

	assert.strictEqual(getCurrentState(), null)
	if (resultType === ResultType.Error || resultType === ResultType.Any && error) {
		// if (resultsAsError.indexOf(error + '') < 0) {
		// 	assert.fail(`funcCall.id = ${funcCall.id}, error = ${error}`)
		// }
	} else if (resultType === ResultType.Value || resultType === ResultType.Any && !error) {
		assert.notOk(funcCall.state.error)
		assert.strictEqual(value + '', funcCall.id)
	} else {
		throw new Error('Unknown ResultType: ' + resultType)
	}

	// assertStatus(funcCall.state.status)
	checkCallHistory(...callHistory)
}

function checkFuncAsync<TValue>(
	resultType: ResultType,
	funcCall: IDependencyCall,
	...callHistory: IDependencyCall[]
) {
	checkCallHistory()
	checkDependenciesDuplicates(funcCall)
	assert.strictEqual(getCurrentState(), null)
	let thenable
	try {
		thenable = checkAsync(funcCall())
			.then(o => {
				assert.strictEqual(getCurrentState(), null)
				return o
			}, o => {
				assert.strictEqual(getCurrentState(), null)
				return ThenableSync.createRejected(o)
			})
	} catch (err) {
		if (err instanceof InternalError) {
			assert.strictEqual(getCurrentState(), null)
			throw err
		}
		assert.fail(err)
	}
	// assertStatus(funcCall.state.status)
	checkCallHistory(...callHistory)
	return (async () => {
		assert.strictEqual(getCurrentState(), null)

		let value
		let error
		try {
			value = await thenable
		} catch (err) {
			if (err instanceof InternalError) {
				assert.strictEqual(getCurrentState(), null)
				throw err
			}
			error = err
		}

		assert.strictEqual(getCurrentState(), null)
		if (resultType === ResultType.Error || resultType === ResultType.Any && error) {
			assert.ok(error)
			// if (resultsAsError.indexOf(error + '') < 0) {
			// 	assert.fail(`funcCall.id = ${funcCall.id}, error = ${error}`)
			// }
		} else if (resultType === ResultType.Value || resultType === ResultType.Any && !error) {
			assert.notOk(funcCall.state.error)
			assert.strictEqual(value + '', funcCall.id)
		} else {
			throw new Error('Unknown ResultType: ' + resultType)
		}

		// assertStatus(funcCall.state.status)
		checkDependenciesDuplicates(funcCall, ...callHistory)
	})()
}

const statusesShort = {
	i: CallStatus.Flag_Invalidating,
	I: CallStatus.Flag_Invalidated,
	f: CallStatus.Flag_Invalidating | CallStatus.Flag_Recalc,
	F: CallStatus.Flag_Invalidated | CallStatus.Flag_Recalc,
	x: CallStatus.Flag_Check,
	c: CallStatus.Flag_Calculating,
	a: CallStatus.Flag_Async,
	C: CallStatus.Flag_Calculated,
	V: CallStatus.Flag_HasValue,
	E: CallStatus.Flag_HasError,
}

function parseStatusShort(statusShort: string) {
	let status: CallStatus = 0
	for (let i = 0, len = statusShort.length; i < len; i++) {
		status |= statusesShort[statusShort[i]]
	}
	return status
}

function statusToShortString(status: CallStatus) {
	let result = ''
	if ((status & CallStatus.Flag_Invalidating) !== 0) {
		result += 'i'
		status &= ~CallStatus.Flag_Invalidating
	}
	if ((status & CallStatus.Flag_Invalidated) !== 0) {
		result += 'I'
		status &= ~CallStatus.Flag_Invalidated
	}
	if ((status & CallStatus.Flag_Recalc) !== 0) {
		result += 'r'
		status &= ~CallStatus.Flag_Recalc
	}

	if ((status & CallStatus.Flag_Check) !== 0) {
		result += 'x'
		status &= ~CallStatus.Flag_Check
	}
	if ((status & CallStatus.Flag_Calculating) !== 0) {
		result += 'c'
		status &= ~CallStatus.Flag_Calculating
	}
	if ((status & CallStatus.Flag_Async) !== 0) {
		result += 'a'
		status &= ~CallStatus.Flag_Async
	}

	if ((status & CallStatus.Flag_Calculated) !== 0) {
		result += 'C'
		status &= ~CallStatus.Flag_Calculated
	}
	if ((status & CallStatus.Flag_HasValue) !== 0) {
		result += 'V'
		status &= ~CallStatus.Flag_HasValue
	}
	if ((status & CallStatus.Flag_HasError) !== 0) {
		result += 'E'
		status &= ~CallStatus.Flag_HasError
	}
	if (status !== 0) {
		result += status
	}
	return result
}

function checkStatuses(...funcCalls: IDependencyCall[]) {
	return function(...statusesShort: string[]) {
		assert.deepStrictEqual(
			funcCalls.map(o => statusToShortString(o.state.status)),
			statusesShort,
		)
	}
}

function _invalidate(...funcCalls: IDependencyCall[]) {
	checkCallHistory()
	for (let i = 0; i < funcCalls.length; i++) {
		funcCalls[i].state.invalidate()
	}
	checkCallHistory()
}

function _checkFuncNotChanged<TValue>(...funcCalls: IDependencyCall[]) {
	for (let i = 0, len = funcCalls.length; i < len; i++) {
		checkFuncSync(ResultType.Any, funcCalls[i])
	}
}

function checkFuncNotChanged<TValue>(allFuncCalls: IDependencyCall[], ...changedFuncCalls: IDependencyCall[]) {
	_checkFuncNotChanged(...allFuncCalls.filter(o => changedFuncCalls.indexOf(o) < 0))
}

function isInvalidated(funcCall: IDependencyCall) {
	return (funcCall.state.status & CallStatus.Mask_Invalidate) !== 0
}

// export function assertStatus(status: FuncCallStatus) {
// 	assert.ok(checkStatus(status), statusToString(status))
// }

function getSubscribers(state: TCallStateAny) {
	const subscribers = []
	for (let link = state._subscribersFirst; link !== null;) {
		subscribers.push(link.value)
		link = link.next
	}
	return subscribers
}

function checkSubscribers(funcCall: IDependencyCall, ...subscribersFuncCalls: IDependencyCall[]) {
	const ids = getSubscribers(funcCall.state)
		.map(o => o.id).sort()
	const checkIds = subscribersFuncCalls
		.map(o => o.id).sort()
	assert.deepStrictEqual(ids, checkIds, funcCall.id)
}

function checkUnsubscribers(funcCall: IDependencyCall, ...unsubscribersFuncCalls: IDependencyCall[]) {
	const ids = funcCall.state._unsubscribers === null || funcCall.state._unsubscribersLength === 0
		? []
		: funcCall.state._unsubscribers.filter(o => o)
			.map(o => (o.state as any).id)
			.sort()

	const checkIds = unsubscribersFuncCalls
		.map(o => o.id).sort()
	assert.deepStrictEqual(ids, checkIds, funcCall.id)
}

function checkCurrentStateAsync(state: TCallStateAny) {
	assert.strictEqual(getCurrentState(), state)
	return resolveAsync(
		resolveAsync(
			delay(0),
			() => {
				assert.strictEqual(getCurrentState(), state)
				throw 1
			},
			() => {
				assert.fail()
			},
		),
		() => {
			assert.fail()
		},
		() => {
			assert.strictEqual(getCurrentState(), state)
		},
	)
}

function checkCurrentStateAsyncContinuous(state: TCallStateAny) {
	let stop = false

	async function start() {
		while (!stop) {
			await checkCurrentStateAsync(state)
		}
	}
	// noinspection JSIgnoredPromiseFromCall
	start()

	return () => {
		stop = true
	}
}

export async function baseTest(deferred?: boolean) {
	if (deferred == null) {
		await baseTest(false)
		return await baseTest(true)
	}

	const stopCheckCurrentState = checkCurrentStateAsyncContinuous(null)

	callHistoryCheckDisabled = deferred

	// region init

	const S = funcSync('S', deferred)
	const I = funcSyncIterator('I', deferred)
	const A = funcAsync('A', deferred)

	const S0 = funcCall(S) // S(0)
	const I0 = funcCall(I, null) // I(0)
	const A0 = funcCall(A, new ThisObj('_')) // A(_)

	const S1 = funcCall(S, [S0, I0], 1) // S1(S(0),I(0))
	const I1 = funcCall(I, [I0, A0], 1) // I1(I(0),A(_))

	const S2 = funcCall(S, [S1], 2, void 0) // S20(S1(S(0),I(0)))
	const I2 = funcCall(I, [S1, I1], 2, null) // I20(S1(S(0),I(0)),I1(I(0),A(_)))
	const A2 = funcCall(A, [I1], 2, 2) // A22(I1(I(0),A(_)))

	setAlwaysChange(I0, I1, I2)

	const allFuncs = [S0, I0, A0, S1, I1, S2, I2, A2]
	const _checkStatuses = checkStatuses(...allFuncs)

	function _checkSubscribersAll() {
		checkSubscribers(S0, S1)
		checkSubscribers(I0, S1, I1)
		checkSubscribers(A0, I1)
		checkSubscribers(S1, S2, I2)
		checkSubscribers(I1, I2, A2)
		checkSubscribers(S2)
		checkSubscribers(I2)
		checkSubscribers(A2)
	}

	function _checkUnsubscribersAll() {
		checkUnsubscribers(S0)
		checkUnsubscribers(I0)
		checkUnsubscribers(A0)
		checkUnsubscribers(S1, S0, I0)
		checkUnsubscribers(I1, I0, A0)
		checkUnsubscribers(S2, S1)
		checkUnsubscribers(I2, S1, I1)
		checkUnsubscribers(A2, I1)
	}

	function checkSubscribersAll() {
		_checkSubscribersAll()
		_checkUnsubscribersAll()
	}

	// endregion

	// region check init

	assert.strictEqual(S0.id, 'S(0)')
	assert.strictEqual(I0.id, 'I(0)')
	assert.strictEqual(A0.id, 'A(_)')

	assert.strictEqual(S1.id, 'S1(S(0),I(0))')
	assert.strictEqual(I1.id, 'I1(I(0),A(_))')

	assert.strictEqual(S2.id, 'S20(S1(S(0),I(0)))')
	assert.strictEqual(I2.id, 'I20(S1(S(0),I(0)),I1(I(0),A(_)))')
	assert.strictEqual(A2.id, 'A22(I1(I(0),A(_)))')

	// endregion

	// region base tests

	_checkStatuses('Ir', 'Ir', 'Ir',   'Ir', 'Ir',   'Ir', 'Ir', 'Ir')
	checkFuncSync(ResultType.Value, S0, S0)
	_checkStatuses('CV', 'Ir', 'Ir',   'Ir', 'Ir',   'Ir', 'Ir', 'Ir')
	checkFuncSync(ResultType.Value, I0, I0)
	_checkStatuses('CV', 'CV', 'Ir',   'Ir', 'Ir',   'Ir', 'Ir', 'Ir')
	await checkFuncAsync(ResultType.Value, A0, A0)
	_checkStatuses('CV', 'CV', 'CV',   'Ir', 'Ir',   'Ir', 'Ir', 'Ir')

	checkFuncSync(ResultType.Value, S1, S1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'Ir',   'Ir', 'Ir', 'Ir')
	checkFuncSync(ResultType.Value, I1, I1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'Ir', 'Ir', 'Ir')

	checkFuncSync(ResultType.Value, S2, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'Ir', 'Ir')
	checkFuncSync(ResultType.Value, I2, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'Ir')
	await checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkSubscribersAll()

	checkFuncNotChanged(allFuncs)

	// endregion

	// region Without Errors

	// region invalidate

	// region Forward

	// region level 2

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkSubscribersAll()
	_invalidate(S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IrV', 'CV', 'CV')
	checkFuncSync(ResultType.Value, S2, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkSubscribersAll()
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkSubscribersAll()
	_invalidate(I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'IrV', 'CV')
	checkFuncSync(ResultType.Value, I2, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkSubscribersAll()
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkSubscribersAll()
	_invalidate(A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'IrV')
	await checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkSubscribersAll()
	checkFuncNotChanged(allFuncs)

	// endregion

	// region level 1

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkSubscribersAll()
	_invalidate(S1)
	_checkStatuses('CV', 'CV', 'CV',   'IrV', 'CV',   'IV', 'IV', 'CV')
	checkFuncSync(ResultType.Value, S2, S1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'IV', 'CV')
	checkFuncSync(ResultType.Value, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkSubscribersAll()
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkSubscribersAll()
	_invalidate(I1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'IrV',   'CV', 'IV', 'IV')
	checkFuncSync(ResultType.Value, I2, I1, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'IrV')
	await checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkSubscribersAll()
	checkFuncNotChanged(allFuncs)

	// endregion

	// region level 0

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(S0)
	_checkStatuses('IrV', 'CV', 'CV',   'IV', 'CV',   'IV', 'IV', 'CV')
	// console.log(allFuncs.filter(isInvalidated).map(o => o.id))
	checkFuncSync(ResultType.Value, S2, S0)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'IV', 'CV')
	checkFuncSync(ResultType.Value, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(I0)
	_checkStatuses('CV', 'IrV', 'CV',   'IV', 'IV',   'IV', 'IV', 'IV')
	checkFuncSync(ResultType.Value, S2, I0, S1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'IrV',   'CV', 'IV', 'IV')
	checkFuncSync(ResultType.Value, I2, I1, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'IrV')
	await checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(A0)
	_checkStatuses('CV', 'CV', 'IrV',   'CV', 'IV',   'CV', 'IV', 'IV')
	await checkFuncAsync(ResultType.Value, I2, A0)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'IV')
	checkFuncSync(ResultType.Value, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	// endregion

	// endregion

	// region Backward

	// region level 0

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(A0)
	_checkStatuses('CV', 'CV', 'IrV',   'CV', 'IV',   'CV', 'IV', 'IV')
	await checkFuncAsync(ResultType.Value, A2, A0)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'IV', 'CV')
	checkFuncSync(ResultType.Value, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(I0)
	_checkStatuses('CV', 'IrV', 'CV',   'IV', 'IV',   'IV', 'IV', 'IV')
	await checkFuncAsync(ResultType.Value, A2, I0, I1, A2)
	_checkStatuses('CV', 'CV', 'CV',   'IrV', 'CV',   'IV', 'IrV', 'CV')
	checkFuncSync(ResultType.Value, I2, I2, S1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IV', 'CV', 'CV')
	checkFuncSync(ResultType.Value, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(S0)
	_checkStatuses('IrV', 'CV', 'CV',   'IV', 'CV',   'IV', 'IV', 'CV')
	checkFuncSync(ResultType.Value, I2, S0)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IV', 'CV', 'CV')
	checkFuncSync(ResultType.Value, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	// endregion

	// region level 1

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(I1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'IrV',   'CV', 'IV', 'IV')
	await checkFuncAsync(ResultType.Value, A2, I1, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'IrV', 'CV')
	checkFuncSync(ResultType.Value, I2, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(S1)
	_checkStatuses('CV', 'CV', 'CV',   'IrV', 'CV',   'IV', 'IV', 'CV')
	checkFuncSync(ResultType.Value, I2, S1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IV', 'CV', 'CV')
	checkFuncSync(ResultType.Value, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	// endregion

	// region level 2

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'IrV')
	await checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'IrV', 'CV')
	checkFuncSync(ResultType.Value, I2, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IrV', 'CV', 'CV')
	checkFuncSync(ResultType.Value, S2, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	// endregion

	// endregion

	// endregion

	// region invalidate during calc async

	let promise1
	let promise2

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(I1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'IrV',   'CV', 'IV', 'IV')
	checkFuncSync(ResultType.Value, I2, I1, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'IrV')
	promise1 = checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'caV')
	_invalidate(I1)
	checkUnsubscribers(A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'IrV',   'CV', 'IV', 'caV')
	checkFuncSync(ResultType.Value, I2, I1, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'caV')
	await promise1
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncSync(ResultType.Value, A2)
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(A0)
	_checkStatuses('CV', 'CV', 'IrV',   'CV', 'IV',   'CV', 'IV', 'IV')
	promise1 = checkFuncAsync(ResultType.Value, A2, A0)
	_checkStatuses('CV', 'CV', 'caV',   'CV', 'xaV',   'CV', 'IV', 'xaV')
	_invalidate(A0)
	_checkStatuses('CV', 'CV', 'IrcaV',   'CV', 'IxaV',   'CV', 'IV', 'IxaV')
	promise2 = checkFuncAsync(ResultType.Value, I2)
	_checkStatuses('CV', 'CV', 'IrcaV',   'CV', 'IxaV',   'CV', 'xaV', 'IxaV')
	await checkFuncAsync(ResultType.Value, A0)
	_checkStatuses('CV', 'CV', 'IrV',   'CV', 'IV',   'CV', 'IV', 'IV')
	_invalidate(I0)
	_checkStatuses('CV', 'IrV', 'IrV',   'IV', 'IV',   'IV', 'IV', 'IV')
	await promise1
	_checkStatuses('CV', 'IrV', 'IrV',   'IV', 'IV',   'IV', 'IV', 'IV')
	await checkFuncAsync(ResultType.Value, I2, I0, S1, I1, A0)
	checkCallHistory(I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IV', 'CV', 'IrV')
	await promise2
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IV', 'CV', 'IrV')
	checkCallHistory()
	await checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IV', 'CV', 'CV')
	checkFuncSync(ResultType.Value, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(A0, I0)
	_checkStatuses('CV', 'IrV', 'IrV',   'IV', 'IV',   'IV', 'IV', 'IV')
	promise1 = checkFuncAsync(ResultType.Value, A2, I0, I1, A0)
	_checkStatuses('CV', 'CV', 'caV',   'IrV', 'caV',   'IV', 'IV', 'xaV')
	_invalidate(A0)
	_checkStatuses('CV', 'CV', 'IrcaV',   'IrV', 'IcaV',   'IV', 'IV', 'IxaV')
	promise2 = checkFuncAsync(ResultType.Value, I2, S1)
	_checkStatuses('CV', 'CV', 'IrcaV',   'CV', 'IcaV',   'IV', 'xaV', 'IxaV')
	await checkFuncAsync(ResultType.Value, A0)
	checkCallHistory(A0)
	_checkStatuses('CV', 'CV', 'caV',   'CV', 'IcaV',   'IV', 'xaV', 'IxaV')
	await checkFuncAsync(ResultType.Value, A0)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IV', 'CV', 'caV')
	checkCallHistory(A2, I2)
	_invalidate(I0)
	_checkStatuses('CV', 'IrV', 'CV',   'IV', 'IV',   'IV', 'IV', 'caV')
	await promise1
	_checkStatuses('CV', 'CV', 'CV',   'IrV', 'CV',   'IV', 'IrV', 'CV')
	checkCallHistory(I0, I1)
	checkFuncSync(ResultType.Value, I2, I2, S1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IV', 'CV', 'CV')
	await promise2
	checkCallHistory()
	checkFuncSync(ResultType.Value, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')

	// endregion

	// endregion

	// region With Errors

	// region invalidate

	// region Forward

	// region level 2

	// region error

	setResultsAsError(S2, I2, A2)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IrV', 'CV', 'CV')
	checkFuncSync(ResultType.Error, S2, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CVE', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CVE', 'CV', 'CV')
	_invalidate(I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CVE', 'IrV', 'CV')
	checkFuncSync(ResultType.Error, I2, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CVE', 'CVE', 'CV')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CVE', 'CVE', 'CV')
	_invalidate(A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CVE', 'CVE', 'IrV')
	await checkFuncAsync(ResultType.Error, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CVE', 'CVE', 'CVE')
	checkFuncNotChanged(allFuncs)

	// endregion

	// region value

	setResultsAsError()

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CVE', 'CVE', 'CVE')
	_invalidate(S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IrVE', 'CVE', 'CVE')
	checkFuncSync(ResultType.Value, S2, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CVE', 'CVE')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CVE', 'CVE')
	_invalidate(I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'IrVE', 'CVE')
	checkFuncSync(ResultType.Value, I2, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CVE')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CVE')
	_invalidate(A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'IrVE')
	await checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	// endregion

	// endregion

	// region level 1

	setResultsAsError(S1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(S1)
	_checkStatuses('CV', 'CV', 'CV',   'IrV', 'CV',   'IV', 'IV', 'CV')
	checkFuncSync(ResultType.Error, S2, S1, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CVE', 'CV',   'CVE', 'IrV', 'CV')
	checkFuncSync(ResultType.Error, I2, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CVE', 'CV',   'CVE', 'CVE', 'CV')
	checkFuncNotChanged(allFuncs)
	_checkStatuses('CV', 'CV', 'CV',   'CVE', 'CV',   'CVE', 'CVE', 'CV')
	_invalidate(S1)
	_checkStatuses('CV', 'CV', 'CV',   'IrVE', 'CV',   'IVE', 'IVE', 'CV')
	checkFuncSync(ResultType.Error, S2, S1)
	_checkStatuses('CV', 'CV', 'CV',   'CVE', 'CV',   'CVE', 'IVE', 'CV')
	checkFuncSync(ResultType.Error, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CVE', 'CV',   'CVE', 'CVE', 'CV')
	checkFuncNotChanged(allFuncs)
	setResultsAsError()
	_checkStatuses('CV', 'CV', 'CV',   'CVE', 'CV',   'CVE', 'CVE', 'CV')
	_invalidate(S1)
	_checkStatuses('CV', 'CV', 'CV',   'IrVE', 'CV',   'IVE', 'IVE', 'CV')
	checkFuncSync(ResultType.Value, S2, S1, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'IrVE', 'CV')
	checkFuncSync(ResultType.Value, I2, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(S1)
	_checkStatuses('CV', 'CV', 'CV',   'IrV', 'CV',   'IV', 'IV', 'CV')
	checkFuncSync(ResultType.Value, S2, S1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'IV', 'CV')
	checkFuncSync(ResultType.Value, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	setResultsAsError(I1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(I1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'IrV',   'CV', 'IV', 'IV')
	checkFuncSync(ResultType.Error, I2, I1, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CVE',   'CV', 'CVE', 'IrV')
	await checkFuncAsync(ResultType.Error, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CVE',   'CV', 'CVE', 'CVE')
	checkFuncNotChanged(allFuncs)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CVE',   'CV', 'CVE', 'CVE')
	_invalidate(I1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'IrVE',   'CV', 'IVE', 'IVE')
	checkFuncSync(ResultType.Error, I2, I1, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CVE',   'CV', 'CVE', 'IrVE')
	await checkFuncAsync(ResultType.Error, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CVE',   'CV', 'CVE', 'CVE')
	checkFuncNotChanged(allFuncs)
	setResultsAsError()
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CVE',   'CV', 'CVE', 'CVE')
	_invalidate(I1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'IrVE',   'CV', 'IVE', 'IVE')
	checkFuncSync(ResultType.Value, I2, I1, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'IrVE')
	await checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(I1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'IrV',   'CV', 'IV', 'IV')
	checkFuncSync(ResultType.Value, I2, I1, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'IrV')
	await checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	// endregion

	// region level 0

	setResultsAsError(S0)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(S0)
	_checkStatuses('IrV', 'CV', 'CV',   'IV', 'CV',   'IV', 'IV', 'CV')
	// console.log(allFuncs.filter(isInvalidated).map(o => o.id))
	checkFuncSync(ResultType.Error, S2, S0, S1, S2)
	_checkStatuses('CVE', 'CV', 'CV',   'CVE', 'CV',   'CVE', 'IrV', 'CV')
	checkFuncSync(ResultType.Error, I2, I2)
	_checkStatuses('CVE', 'CV', 'CV',   'CVE', 'CV',   'CVE', 'CVE', 'CV')
	checkFuncNotChanged(allFuncs)
	_checkStatuses('CVE', 'CV', 'CV',   'CVE', 'CV',   'CVE', 'CVE', 'CV')
	_invalidate(S0)
	_checkStatuses('IrVE', 'CV', 'CV',   'IVE', 'CV',   'IVE', 'IVE', 'CV')
	// console.log(allFuncs.filter(isInvalidated).map(o => o.id))
	checkFuncSync(ResultType.Error, S2, S0)
	_checkStatuses('CVE', 'CV', 'CV',   'CVE', 'CV',   'CVE', 'IVE', 'CV')
	checkFuncSync(ResultType.Error, I2)
	_checkStatuses('CVE', 'CV', 'CV',   'CVE', 'CV',   'CVE', 'CVE', 'CV')
	checkFuncNotChanged(allFuncs)
	setResultsAsError()
	_checkStatuses('CVE', 'CV', 'CV',   'CVE', 'CV',   'CVE', 'CVE', 'CV')
	_invalidate(S0)
	_checkStatuses('IrVE', 'CV', 'CV',   'IVE', 'CV',   'IVE', 'IVE', 'CV')
	// console.log(allFuncs.filter(isInvalidated).map(o => o.id))
	checkFuncSync(ResultType.Value, S2, S0, S1, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'IrVE', 'CV')
	checkFuncSync(ResultType.Value, I2, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(S0)
	_checkStatuses('IrV', 'CV', 'CV',   'IV', 'CV',   'IV', 'IV', 'CV')
	// console.log(allFuncs.filter(isInvalidated).map(o => o.id))
	checkFuncSync(ResultType.Value, S2, S0)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'IV', 'CV')
	checkFuncSync(ResultType.Value, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	setResultsAsError(I0)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(I0)
	_checkStatuses('CV', 'IrV', 'CV',   'IV', 'IV',   'IV', 'IV', 'IV')
	checkFuncSync(ResultType.Error, S2, I0, S1, S2)
	_checkStatuses('CV', 'CVE', 'CV',   'CVE', 'IrV',   'CVE', 'IrV', 'IV')
	checkFuncSync(ResultType.Error, I2, I2)
	_checkStatuses('CV', 'CVE', 'CV',   'CVE', 'IrV',   'CVE', 'CVE', 'IV')
	await checkFuncAsync(ResultType.Error, A2, I1, A2)
	_checkStatuses('CV', 'CVE', 'CV',   'CVE', 'CVE',   'CVE', 'CVE', 'CVE')
	checkFuncNotChanged(allFuncs)
	_checkStatuses('CV', 'CVE', 'CV',   'CVE', 'CVE',   'CVE', 'CVE', 'CVE')
	_invalidate(I0)
	_checkStatuses('CV', 'IrVE', 'CV',   'IVE', 'IVE',   'IVE', 'IVE', 'IVE')
	checkFuncSync(ResultType.Error, S2, I0, S1, S2)
	_checkStatuses('CV', 'CVE', 'CV',   'CVE', 'IrVE',   'CVE', 'IrVE', 'IVE')
	checkFuncSync(ResultType.Error, I2, I2)
	_checkStatuses('CV', 'CVE', 'CV',   'CVE', 'IrVE',   'CVE', 'CVE', 'IVE')
	await checkFuncAsync(ResultType.Error, A2, I1, A2)
	_checkStatuses('CV', 'CVE', 'CV',   'CVE', 'CVE',   'CVE', 'CVE', 'CVE')
	checkFuncNotChanged(allFuncs)
	setResultsAsError()
	_checkStatuses('CV', 'CVE', 'CV',   'CVE', 'CVE',   'CVE', 'CVE', 'CVE')
	_invalidate(I0)
	_checkStatuses('CV', 'IrVE', 'CV',   'IVE', 'IVE',   'IVE', 'IVE', 'IVE')
	checkFuncSync(ResultType.Value, S2, I0, S1, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'IrVE',   'CV', 'IrVE', 'IVE')
	checkFuncSync(ResultType.Value, I2, I2, I1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'IrVE')
	await checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(I0)
	_checkStatuses('CV', 'IrV', 'CV',   'IV', 'IV',   'IV', 'IV', 'IV')
	checkFuncSync(ResultType.Value, S2, I0, S1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'IrV',   'CV', 'IV', 'IV')
	checkFuncSync(ResultType.Value, I2, I1, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'IrV')
	await checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	setResultsAsError(A0)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(A0)
	_checkStatuses('CV', 'CV', 'IrV',   'CV', 'IV',   'CV', 'IV', 'IV')
	await checkFuncAsync(ResultType.Error, I2, A0)
	checkCallHistory(I1, I2)
	_checkStatuses('CV', 'CV', 'CVE',   'CV', 'CVE',   'CV', 'CVE', 'IrV')
	await checkFuncAsync(ResultType.Error, A2, A2)
	_checkStatuses('CV', 'CV', 'CVE',   'CV', 'CVE',   'CV', 'CVE', 'CVE')
	checkFuncNotChanged(allFuncs)
	_checkStatuses('CV', 'CV', 'CVE',   'CV', 'CVE',   'CV', 'CVE', 'CVE')
	_invalidate(A0)
	_checkStatuses('CV', 'CV', 'IrVE',   'CV', 'IVE',   'CV', 'IVE', 'IVE')
	await checkFuncAsync(ResultType.Error, I2, A0)
	_checkStatuses('CV', 'CV', 'CVE',   'CV', 'CVE',   'CV', 'CVE', 'IVE')
	checkFuncSync(ResultType.Error, A2)
	_checkStatuses('CV', 'CV', 'CVE',   'CV', 'CVE',   'CV', 'CVE', 'CVE')
	checkFuncNotChanged(allFuncs)
	setResultsAsError()
	_checkStatuses('CV', 'CV', 'CVE',   'CV', 'CVE',   'CV', 'CVE', 'CVE')
	_invalidate(A0)
	_checkStatuses('CV', 'CV', 'IrVE',   'CV', 'IVE',   'CV', 'IVE', 'IVE')
	await checkFuncAsync(ResultType.Value, I2, A0)
	checkCallHistory(I1, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'IrVE')
	await checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(A0)
	_checkStatuses('CV', 'CV', 'IrV',   'CV', 'IV',   'CV', 'IV', 'IV')
	await checkFuncAsync(ResultType.Value, I2, A0)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'IV')
	checkFuncSync(ResultType.Value, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	// endregion

	// endregion

	// region Backward

	// region level 0

	setResultsAsError(A0)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(A0)
	_checkStatuses('CV', 'CV', 'IrV',   'CV', 'IV',   'CV', 'IV', 'IV')
	await checkFuncAsync(ResultType.Error, A2, A0)
	checkCallHistory(I1, A2)
	_checkStatuses('CV', 'CV', 'CVE',   'CV', 'CVE',   'CV', 'IrV', 'CVE')
	checkFuncSync(ResultType.Error, I2, I2)
	_checkStatuses('CV', 'CV', 'CVE',   'CV', 'CVE',   'CV', 'CVE', 'CVE')
	checkFuncNotChanged(allFuncs)
	setResultsAsError()
	_checkStatuses('CV', 'CV', 'CVE',   'CV', 'CVE',   'CV', 'CVE', 'CVE')
	_invalidate(A0)
	_checkStatuses('CV', 'CV', 'IrVE',   'CV', 'IVE',   'CV', 'IVE', 'IVE')
	await checkFuncAsync(ResultType.Value, A2, A0)
	checkCallHistory(I1, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'IrVE', 'CV')
	checkFuncSync(ResultType.Value, I2, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(A0)
	_checkStatuses('CV', 'CV', 'IrV',   'CV', 'IV',   'CV', 'IV', 'IV')
	await checkFuncAsync(ResultType.Value, A2, A0)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'IV', 'CV')
	checkFuncSync(ResultType.Value, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	setResultsAsError(I0)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(I0)
	_checkStatuses('CV', 'IrV', 'CV',   'IV', 'IV',   'IV', 'IV', 'IV')
	await checkFuncAsync(ResultType.Error, A2, I0, I1, A2)
	_checkStatuses('CV', 'CVE', 'CV',   'IrV', 'CVE',   'IV', 'IrV', 'CVE')
	checkFuncSync(ResultType.Error, I2, I2, S1)
	_checkStatuses('CV', 'CVE', 'CV',   'CVE', 'CVE',   'IrV', 'CVE', 'CVE')
	checkFuncSync(ResultType.Error, S2, S2)
	_checkStatuses('CV', 'CVE', 'CV',   'CVE', 'CVE',   'CVE', 'CVE', 'CVE')
	checkFuncNotChanged(allFuncs)
	setResultsAsError()
	_checkStatuses('CV', 'CVE', 'CV',   'CVE', 'CVE',   'CVE', 'CVE', 'CVE')
	_invalidate(I0)
	_checkStatuses('CV', 'IrVE', 'CV',   'IVE', 'IVE',   'IVE', 'IVE', 'IVE')
	await checkFuncAsync(ResultType.Value, A2, I0, I1, A2)
	_checkStatuses('CV', 'CV', 'CV',   'IrVE', 'CV',   'IVE', 'IVE', 'CV')
	checkFuncSync(ResultType.Value, I2, S1, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IrVE', 'CV', 'CV')
	checkFuncSync(ResultType.Value, S2, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(I0)
	_checkStatuses('CV', 'IrV', 'CV',   'IV', 'IV',   'IV', 'IV', 'IV')
	await checkFuncAsync(ResultType.Value, A2, I0, I1, A2)
	_checkStatuses('CV', 'CV', 'CV',   'IrV', 'CV',   'IV', 'IrV', 'CV')
	checkFuncSync(ResultType.Value, I2, I2, S1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IV', 'CV', 'CV')
	checkFuncSync(ResultType.Value, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	setResultsAsError(S0)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(S0)
	_checkStatuses('IrV', 'CV', 'CV',   'IV', 'CV',   'IV', 'IV', 'CV')
	checkFuncSync(ResultType.Error, I2, S0, S1, I2)
	_checkStatuses('CVE', 'CV', 'CV',   'CVE', 'CV',   'IrV', 'CVE', 'CV')
	checkFuncSync(ResultType.Error, S2, S2)
	_checkStatuses('CVE', 'CV', 'CV',   'CVE', 'CV',   'CVE', 'CVE', 'CV')
	checkFuncNotChanged(allFuncs)
	setResultsAsError()
	_checkStatuses('CVE', 'CV', 'CV',   'CVE', 'CV',   'CVE', 'CVE', 'CV')
	_invalidate(S0)
	_checkStatuses('IrVE', 'CV', 'CV',   'IVE', 'CV',   'IVE', 'IVE', 'CV')
	checkFuncSync(ResultType.Value, I2, S0, S1, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IrVE', 'CV', 'CV')
	checkFuncSync(ResultType.Value, S2, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(S0)
	_checkStatuses('IrV', 'CV', 'CV',   'IV', 'CV',   'IV', 'IV', 'CV')
	checkFuncSync(ResultType.Value, I2, S0)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IV', 'CV', 'CV')
	checkFuncSync(ResultType.Value, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	// endregion

	// region level 1

	setResultsAsError(I1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(I1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'IrV',   'CV', 'IV', 'IV')
	await checkFuncAsync(ResultType.Error, A2, I1, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CVE',   'CV', 'IrV', 'CVE')
	checkFuncSync(ResultType.Error, I2, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CVE',   'CV', 'CVE', 'CVE')
	checkFuncNotChanged(allFuncs)
	setResultsAsError()
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CVE',   'CV', 'CVE', 'CVE')
	_invalidate(I1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'IrVE',   'CV', 'IVE', 'IVE')
	await checkFuncAsync(ResultType.Value, A2, I1, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'IrVE', 'CV')
	checkFuncSync(ResultType.Value, I2, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(I1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'IrV',   'CV', 'IV', 'IV')
	await checkFuncAsync(ResultType.Value, A2, I1, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'IrV', 'CV')
	checkFuncSync(ResultType.Value, I2, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	setResultsAsError(S1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(S1)
	_checkStatuses('CV', 'CV', 'CV',   'IrV', 'CV',   'IV', 'IV', 'CV')
	checkFuncSync(ResultType.Error, I2, S1, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CVE', 'CV',   'IrV', 'CVE', 'CV')
	checkFuncSync(ResultType.Error, S2, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CVE', 'CV',   'CVE', 'CVE', 'CV')
	checkFuncNotChanged(allFuncs)
	setResultsAsError()
	_checkStatuses('CV', 'CV', 'CV',   'CVE', 'CV',   'CVE', 'CVE', 'CV')
	_invalidate(S1)
	_checkStatuses('CV', 'CV', 'CV',   'IrVE', 'CV',   'IVE', 'IVE', 'CV')
	checkFuncSync(ResultType.Value, I2, S1, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IrVE', 'CV', 'CV')
	checkFuncSync(ResultType.Value, S2, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(S1)
	_checkStatuses('CV', 'CV', 'CV',   'IrV', 'CV',   'IV', 'IV', 'CV')
	checkFuncSync(ResultType.Value, I2, S1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IV', 'CV', 'CV')
	checkFuncSync(ResultType.Value, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	// endregion

	// region level 2

	// region error

	setResultsAsError(S2, I2, A2)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'IrV')
	await checkFuncAsync(ResultType.Error, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CVE')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CVE')
	_invalidate(I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'IrV', 'CVE')
	checkFuncSync(ResultType.Error, I2, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CVE', 'CVE')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CVE', 'CVE')
	_invalidate(S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IrV', 'CVE', 'CVE')
	checkFuncSync(ResultType.Error, S2, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CVE', 'CVE', 'CVE')
	checkFuncNotChanged(allFuncs)

	// endregion

	// region value

	setResultsAsError()

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CVE', 'CVE', 'CVE')
	_invalidate(A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CVE', 'CVE', 'IrVE')
	await checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CVE', 'CVE', 'CV')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CVE', 'CVE', 'CV')
	_invalidate(I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CVE', 'IrVE', 'CV')
	checkFuncSync(ResultType.Value, I2, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CVE', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CVE', 'CV', 'CV')
	_invalidate(S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IrVE', 'CV', 'CV')
	checkFuncSync(ResultType.Value, S2, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	// endregion

	// endregion

	// endregion

	// endregion

	// region invalidate during calc async

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(I1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'IrV',   'CV', 'IV', 'IV')
	checkFuncSync(ResultType.Value, I2, I1, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'IrV')
	promise1 = checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'caV')
	_invalidate(I1)
	checkUnsubscribers(A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'IrV',   'CV', 'IV', 'caV')
	checkFuncSync(ResultType.Value, I2, I1, I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'caV')
	await promise1
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncSync(ResultType.Value, A2)
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(A0)
	_checkStatuses('CV', 'CV', 'IrV',   'CV', 'IV',   'CV', 'IV', 'IV')
	promise1 = checkFuncAsync(ResultType.Value, A2, A0)
	_checkStatuses('CV', 'CV', 'caV',   'CV', 'xaV',   'CV', 'IV', 'xaV')
	_invalidate(A0)
	_checkStatuses('CV', 'CV', 'IrcaV',   'CV', 'IxaV',   'CV', 'IV', 'IxaV')
	promise2 = checkFuncAsync(ResultType.Value, I2)
	_checkStatuses('CV', 'CV', 'IrcaV',   'CV', 'IxaV',   'CV', 'xaV', 'IxaV')
	await checkFuncAsync(ResultType.Value, A0)
	_checkStatuses('CV', 'CV', 'IrV',   'CV', 'IV',   'CV', 'IV', 'IV')
	_invalidate(I0)
	_checkStatuses('CV', 'IrV', 'IrV',   'IV', 'IV',   'IV', 'IV', 'IV')
	await promise1
	_checkStatuses('CV', 'IrV', 'IrV',   'IV', 'IV',   'IV', 'IV', 'IV')
	await checkFuncAsync(ResultType.Value, I2, I0, S1, I1, A0)
	checkCallHistory(I2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IV', 'CV', 'IrV')
	await promise2
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IV', 'CV', 'IrV')
	checkCallHistory()
	await checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IV', 'CV', 'CV')
	checkFuncSync(ResultType.Value, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	_invalidate(A0, I0)
	_checkStatuses('CV', 'IrV', 'IrV',   'IV', 'IV',   'IV', 'IV', 'IV')
	promise1 = checkFuncAsync(ResultType.Value, A2, I0, I1, A0)
	_checkStatuses('CV', 'CV', 'caV',   'IrV', 'caV',   'IV', 'IV', 'xaV')
	_invalidate(A0)
	_checkStatuses('CV', 'CV', 'IrcaV',   'IrV', 'IcaV',   'IV', 'IV', 'IxaV')
	promise2 = checkFuncAsync(ResultType.Value, I2, S1)
	_checkStatuses('CV', 'CV', 'IrcaV',   'CV', 'IcaV',   'IV', 'xaV', 'IxaV')
	await checkFuncAsync(ResultType.Value, A0)
	checkCallHistory(A0)
	_checkStatuses('CV', 'CV', 'caV',   'CV', 'IcaV',   'IV', 'xaV', 'IxaV')
	await checkFuncAsync(ResultType.Value, A0)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IV', 'CV', 'caV')
	checkCallHistory(A2, I2)
	_invalidate(I0)
	_checkStatuses('CV', 'IrV', 'CV',   'IV', 'IV',   'IV', 'IV', 'caV')
	await promise1
	_checkStatuses('CV', 'CV', 'CV',   'IrV', 'CV',   'IV', 'IrV', 'CV')
	checkCallHistory(I0, I1)
	checkFuncSync(ResultType.Value, I2, I2, S1)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'IV', 'CV', 'CV')
	await promise2
	checkCallHistory()
	checkFuncSync(ResultType.Value, S2)
	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	checkFuncNotChanged(allFuncs)

	_checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')

	// endregion

	// endregion

	// region Loops

	// region init

	const SL = funcSync('SL', deferred)
	const IL = funcSyncIterator('IL', deferred)
	const AL = funcAsync('AL', deferred)

	const SL3_dependencies = []
	const SL3 = _funcCall(SL, 'SL33()', SL3_dependencies, 3, 3)
	const SL4 = _funcCall(SL, 'SL44()', [SL3], 4, 4)
	const SL5 = _funcCall(SL, 'SL55()', [SL4], 5, 5)
	SL3.hasLoop = true
	SL4.hasLoop = true
	SL5.hasLoop = true

	const IL3_dependencies = []
	const IL3 = _funcCall(IL, 'IL33()', IL3_dependencies, 3, 3)
	const IL4 = _funcCall(IL, 'IL44()', [IL3], 4, 4)
	const IL5 = _funcCall(IL, 'IL55()', [IL4], 5, 5)
	IL3.hasLoop = true
	IL4.hasLoop = true
	IL5.hasLoop = true

	const AL3_dependencies = []
	const AL3 = _funcCall(AL, 'AL33()', AL3_dependencies, 3, 3)
	const AL4 = _funcCall(AL, 'AL44()', [AL3], 4, 4)
	const AL5 = _funcCall(AL, 'AL55()', [AL4], 5, 5)
	AL3.hasLoop = true
	AL4.hasLoop = true
	AL5.hasLoop = true

	// endregion

	// region check init

	SL3_dependencies.push(SL5)
	assert.strictEqual(SL3.id, 'SL33()')
	assert.strictEqual(SL4.id, 'SL44()')
	assert.strictEqual(SL5.id, 'SL55()')

	IL3_dependencies.push(IL5)
	assert.strictEqual(IL3.id, 'IL33()')
	assert.strictEqual(IL4.id, 'IL44()')
	assert.strictEqual(IL5.id, 'IL55()')

	AL3_dependencies.push(AL5)
	assert.strictEqual(AL3.id, 'AL33()')
	assert.strictEqual(AL4.id, 'AL44()')
	assert.strictEqual(AL5.id, 'AL55()')

	// endregion

	// region sync

	assert.throws(() => {
		checkFuncSync(ResultType.Value, SL3, SL3)
	}, InternalError, /\bsync loop\b/i)
	checkCallHistory(SL3, SL5, SL4)

	assert.throws(() => {
		checkFuncSync(ResultType.Value, SL4, SL4)
	}, InternalError, /\bsync loop\b/i)
	checkCallHistory()

	assert.throws(() => {
		checkFuncSync(ResultType.Value, SL5, SL5)
	}, InternalError, /\bsync loop\b/i)
	checkCallHistory()

	// endregion

	// region iterator

	assert.throws(() => {
		checkFuncSync(ResultType.Value, IL3, IL3)
	}, InternalError, /\bsync loop\b/i)
	checkCallHistory(IL3, IL5, IL4)

	assert.throws(() => {
		checkFuncSync(ResultType.Value, IL4, IL4)
	}, InternalError, /\bsync loop\b/i)
	// checkCallHistory(IL4, IL3, IL5)

	assert.throws(() => {
		checkFuncSync(ResultType.Value, IL5, IL5)
	}, InternalError, /\bsync loop\b/i)
	// checkCallHistory(IL5, IL4, IL3)

	// endregion

	// region async

	await assert.throwsAsync(async () => {
		await checkFuncAsync(ResultType.Value, AL3, AL3)
	}, InternalError, /\basync loop\b/i)
	checkCallHistory(AL5, AL4)

	await assert.throwsAsync(async () => {
		await checkFuncAsync(ResultType.Value, AL4)
	}, InternalError, /\basync loop\b/i)
	checkCallHistory()

	await assert.throwsAsync(async () => {
		await checkFuncAsync(ResultType.Value, AL5)
	}, InternalError, /\basync loop\b/i)
	checkCallHistory()

	// endregion

	// endregion

	setAlwaysChange()
	stopCheckCurrentState()

	return {
		states: [S0, I0, A0, S1, I1, S2, I2, A2, AL3, AL4, AL5].map(o => {
			return o.state
		}),
	}
}

export async function lazyTest(deferred?: boolean) {
	if (deferred == null) {
		await lazyTest(false)
		return await lazyTest(true)
	}

	const stopCheckCurrentState = checkCurrentStateAsyncContinuous(null)

	callHistoryCheckDisabled = deferred

	// region init

	const S = funcSync('S', deferred)
	const A = funcAsync('A', deferred)
	const SL = funcSync('SL', deferred)
	const AL = funcAsync('AL', deferred)

	const A0 = funcCall(A, new ThisObj('_')) // A(_)

	const S1 = funcCall(S, [A0], 1) // S1(A(_))
	const SL1 = funcCall(SL, [A0], 1) // SL1(A(_))
	const A1 = funcCall(A, [A0], 1) // A1(A(_))
	const AL1 = funcCall(AL, [A0], 1) // AL1(A(_))
	const A2 = funcCall(A, [A0], 2) // A2(A(_))
	const AL2 = funcCall(AL, [A0], 2) // AL2(A(_))

	setLazyCalls(SL1, AL1, AL2)

	const allFuncs = [A0, S1, SL1, A1, AL1, A2, AL2]
	const _checkStatuses = checkStatuses(...allFuncs)

	// function _checkSubscribersAll() {
	// 	checkSubscribers(S0, S1)
	// 	checkSubscribers(I0, S1, I1)
	// 	checkSubscribers(A0, I1)
	// 	checkSubscribers(S1, S2, I2)
	// 	checkSubscribers(I1, I2, A2)
	// 	checkSubscribers(S2)
	// 	checkSubscribers(I2)
	// 	checkSubscribers(A2)
	// }
	//
	// function _checkUnsubscribersAll() {
	// 	checkUnsubscribers(S0)
	// 	checkUnsubscribers(I0)
	// 	checkUnsubscribers(A0)
	// 	checkUnsubscribers(S1, S0, I0)
	// 	checkUnsubscribers(I1, I0, A0)
	// 	checkUnsubscribers(S2, S1)
	// 	checkUnsubscribers(I2, S1, I1)
	// 	checkUnsubscribers(A2, I1)
	// }
	//
	// function checkSubscribersAll() {
	// 	_checkSubscribersAll()
	// 	_checkUnsubscribersAll()
	// }

	function _clearStates() {
		clearStates(...allFuncs)
	}

	// endregion

	// region check init

	assert.strictEqual(A0.id, 'A(_)')
	assert.strictEqual(S1.id, 'S1(A(_))')
	assert.strictEqual(SL1.id, 'SL1(A(_))')
	assert.strictEqual(A1.id, 'A1(A(_))')
	assert.strictEqual(AL1.id, 'AL1(A(_))')
	assert.strictEqual(A2.id, 'A2(A(_))')
	assert.strictEqual(AL2.id, 'AL2(A(_))')

	// endregion

	// region base tests

	// SL
	_checkStatuses('Ir',  'Ir', 'Ir',   'Ir', 'Ir', 'Ir', 'Ir')
	checkFuncSync(ResultType.Value, SL1, SL1, A0)
	_checkStatuses('ca',  'Ir', 'CV',   'Ir', 'Ir', 'Ir', 'Ir')
	await checkFuncAsync(ResultType.Value, A0)
	_checkStatuses('CV',  'Ir', 'IrV',   'Ir', 'Ir', 'Ir', 'Ir')
	checkFuncSync(ResultType.Value, SL1, SL1)
	_checkStatuses('CV',  'Ir', 'CV',   'Ir', 'Ir', 'Ir', 'Ir')
	_invalidate(A0)
	_checkStatuses('IrV',  'Ir', 'IV',   'Ir', 'Ir', 'Ir', 'Ir')
	checkFuncSync(ResultType.Value, SL1, A0)
	_checkStatuses('caV',  'Ir', 'CV',   'Ir', 'Ir', 'Ir', 'Ir')
	await checkFuncAsync(ResultType.Value, A0)
	_checkStatuses('CV',  'Ir', 'CV',   'Ir', 'Ir', 'Ir', 'Ir')
	checkCallHistory()
	_clearStates()

	// SL-A
	_checkStatuses('Ir',  'Ir', 'Ir',   'Ir', 'Ir', 'Ir', 'Ir')
	checkFuncSync(ResultType.Value, SL1, SL1, A0)
	_checkStatuses('ca',  'Ir', 'CV',   'Ir', 'Ir', 'Ir', 'Ir')
	let promise1 = checkFuncAsync(ResultType.Value, A1, A1)
	_checkStatuses('ca',  'Ir', 'CV',   'ca', 'Ir', 'Ir', 'Ir')
	await promise1
	_checkStatuses('CV',  'Ir', 'IrV',   'CV', 'Ir', 'Ir', 'Ir')
	checkFuncSync(ResultType.Value, SL1, SL1)
	_checkStatuses('CV',  'Ir', 'CV',   'CV', 'Ir', 'Ir', 'Ir')
	checkCallHistory()
	_clearStates()

	// SL-A-AL
	_checkStatuses('Ir',  'Ir', 'Ir',   'Ir', 'Ir', 'Ir', 'Ir')
	checkFuncSync(ResultType.Value, SL1, SL1, A0)
	_checkStatuses('ca',  'Ir', 'CV',   'Ir', 'Ir', 'Ir', 'Ir')
	promise1 = checkFuncAsync(ResultType.Value, A1, A1)
	_checkStatuses('ca',  'Ir', 'CV',   'ca', 'Ir', 'Ir', 'Ir')
	let promise2 = checkFuncAsync(ResultType.Value, AL1, AL1)
	_checkStatuses('ca',  'Ir', 'CV',   'ca', 'ca', 'Ir', 'Ir')
	await promise1
	await promise2
	await A0()
	await delay(100)

	// TODO: test result is different sometimes
	// _checkStatuses('CV',  'Ir', 'IrV',   'CV', 'IrV', 'Ir', 'Ir')
	// checkFuncSync(ResultType.Value, SL1, SL1)
	// _checkStatuses('CV',  'Ir', 'CV',   'CV', 'IrV', 'Ir', 'Ir')
	// promise2 = checkFuncAsync(ResultType.Value, AL1, AL1)
	// _checkStatuses('CV',  'Ir', 'CV',   'CV', 'caV', 'Ir', 'Ir')
	// await promise2
	// _checkStatuses('CV',  'Ir', 'CV',   'CV', 'CV', 'Ir', 'Ir')
	// checkCallHistory()

	_clearStates()

	// AL-AL
	_checkStatuses('Ir',  'Ir', 'Ir',   'Ir', 'Ir', 'Ir', 'Ir')
	promise1 = checkFuncAsync(ResultType.Value, AL1, AL1)
	_checkStatuses('Ir',  'Ir', 'Ir',   'Ir', 'ca', 'Ir', 'Ir')
	promise2 = checkFuncAsync(ResultType.Value, AL2, AL2)
	_checkStatuses('Ir',  'Ir', 'Ir',   'Ir', 'ca', 'Ir', 'ca')
	await promise1
	_checkStatuses('ca',  'Ir', 'Ir',   'Ir', 'CV', 'Ir', 'ca')
	await promise2
	checkCallHistory(A0)
	_checkStatuses('ca',  'Ir', 'Ir',   'Ir', 'CV', 'Ir', 'CV')
	await checkFuncAsync(ResultType.Value, A0)
	_checkStatuses('CV',  'Ir', 'Ir',   'Ir', 'IrV', 'Ir', 'IrV')
	promise1 = checkFuncAsync(ResultType.Value, AL1, AL1)
	_checkStatuses('CV',  'Ir', 'Ir',   'Ir', 'caV', 'Ir', 'IrV')
	promise2 = checkFuncAsync(ResultType.Value, AL2, AL2)
	_checkStatuses('CV',  'Ir', 'Ir',   'Ir', 'caV', 'Ir', 'caV')
	await promise1
	await promise2
	_checkStatuses('CV',  'Ir', 'Ir',   'Ir', 'CV', 'Ir', 'CV')
	checkCallHistory()
	_clearStates()

	// A-AL
	_checkStatuses('Ir',  'Ir', 'Ir',   'Ir', 'Ir', 'Ir', 'Ir')
	promise1 = checkFuncAsync(ResultType.Value, AL1, AL1)
	_checkStatuses('Ir',  'Ir', 'Ir',   'Ir', 'ca', 'Ir', 'Ir')
	promise2 = checkFuncAsync(ResultType.Value, A1, A1)
	_checkStatuses('Ir',  'Ir', 'Ir',   'ca', 'ca', 'Ir', 'Ir')
	await promise1
	_checkStatuses('ca',  'Ir', 'Ir',   'ca', 'CV', 'Ir', 'Ir')
	await promise2
	checkCallHistory(A0)
	_checkStatuses('CV',  'Ir', 'Ir',   'CV', 'IrV', 'Ir', 'Ir')
	promise1 = checkFuncAsync(ResultType.Value, AL1, AL1)
	_checkStatuses('CV',  'Ir', 'Ir',   'CV', 'caV', 'Ir', 'Ir')
	await promise1
	_checkStatuses('CV',  'Ir', 'Ir',   'CV', 'CV', 'Ir', 'Ir')
	checkCallHistory()
	_clearStates()

	// AL-SL-S-|-A-A-AL
	setAlwaysChange(A0)
	setLazyCalls(SL1)
	_checkStatuses('Ir',  'Ir', 'Ir',   'Ir', 'Ir', 'Ir', 'Ir')
	promise1 = checkFuncAsync(ResultType.Value, AL1, AL1)
	_checkStatuses('Ir',  'Ir', 'Ir',   'Ir', 'ca', 'Ir', 'Ir')
	await promise1
	checkCallHistory(A0)
	_checkStatuses('CV',  'Ir', 'Ir',   'Ir', 'CV', 'Ir', 'Ir')
	checkFuncSync(ResultType.Value, SL1, SL1)
	_checkStatuses('CV',  'Ir', 'CV',   'Ir', 'CV', 'Ir', 'Ir')
	checkFuncSync(ResultType.Value, S1, S1)
	_checkStatuses('CV',  'CV', 'CV',   'Ir', 'CV', 'Ir', 'Ir')
	// ----
	setLazyCalls(SL1, AL1, AL2)
	_invalidate(A0)
	_checkStatuses('IrV',  'IV', 'IV',   'Ir', 'IV', 'Ir', 'Ir')
	promise1 = checkFuncAsync(ResultType.Value, A1, A1)
	_checkStatuses('IrV',  'IV', 'IV',   'ca', 'IV', 'Ir', 'Ir')
	promise2 = checkFuncAsync(ResultType.Value, A2, A2)
	_checkStatuses('IrV',  'IV', 'IV',   'ca', 'IV', 'ca', 'Ir')
	checkFuncSync(ResultType.Value, SL1, A0)
	_checkStatuses('caV',  'IV', 'CV',   'ca', 'IV', 'ca', 'Ir')
	const promise3 = checkFuncAsync(ResultType.Value, AL2, AL2)
	_checkStatuses('caV',  'IV', 'CV',   'ca', 'IV', 'ca', 'ca')
	await promise1
	// _checkStatuses('CV',  'IrV', 'IrV',   'CV', 'IrV', 'ca', 'IrV')
	await promise2
	// _checkStatuses('CV',  'IrV', 'IrV',   'CV', 'IrV', 'CV', 'IrV')
	await promise3
	await A0()
	_checkStatuses('CV',  'IrV', 'IrV',   'CV', 'IrV', 'CV', 'IrV')
	setAlwaysChange()
	checkCallHistory()
	_clearStates()

	// _checkStatuses('CV', 'Ir', 'Ir',   'Ir', 'Ir',   'Ir', 'Ir', 'Ir')
	// checkFuncSync(ResultType.Value, I0, I0)
	// _checkStatuses('CV', 'CV', 'Ir',   'Ir', 'Ir',   'Ir', 'Ir', 'Ir')
	// await checkFuncAsync(ResultType.Value, A0, A0)
	// _checkStatuses('CV', 'CV', 'CV',   'Ir', 'Ir',   'Ir', 'Ir', 'Ir')
	//
	// checkFuncSync(ResultType.Value, S1, S1)
	// _checkStatuses('CV', 'CV', 'CV',   'CV', 'Ir',   'Ir', 'Ir', 'Ir')
	// checkFuncSync(ResultType.Value, I1, I1)
	// _checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'Ir', 'Ir', 'Ir')
	//
	// checkFuncSync(ResultType.Value, S2, S2)
	// _checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'Ir', 'Ir')
	// checkFuncSync(ResultType.Value, I2, I2)
	// _checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'Ir')
	// await checkFuncAsync(ResultType.Value, A2, A2)
	// _checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
	// checkSubscribersAll()
	//
	// checkFuncNotChanged(allFuncs)

	// endregion

	setLazyCalls()
	setAlwaysChange()
	stopCheckCurrentState()

	return {
		states: [...allFuncs].map(o => {
			return o.state
		}),
	}
}

// endregion
