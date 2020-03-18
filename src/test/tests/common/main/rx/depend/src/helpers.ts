/* tslint:disable:no-identical-functions no-shadowed-variable no-duplicate-string no-construct use-primitive-type */
import {isThenable, Thenable, ThenableOrValue} from '../../../../../../../main/common/async/async'
import {invalidate, statusToString} from '../../../../../../../main/common/rx/depend/_dependentFunc'
import {
	callStateHashTable,
	reduceCallStates,
	valueIdsMap,
	valueStatesMap,
} from '../../../../../../../main/common/rx/depend/_getFuncCallState2'
import {Func, FuncCallStatus, IFuncCallState} from '../../../../../../../main/common/rx/depend/contracts'
import {getFuncCallState, makeDependentFunc} from '../../../../../../../main/common/rx/depend/facade'
import {assert} from '../../../../../../../main/common/test/Assert'
import {delay} from '../../../../../../../main/common/time/helpers'

(global as any).statusToString = statusToString

// region makeDependentFunc

// tslint:disable-next-line:no-shadowed-variable
export function __makeDependentFunc<TThis,
	TArgs extends any[],
	TValue,
	>(func: Func<TThis, TArgs, Iterator<TValue>>): Func<TThis, TArgs, ThenableOrValue<TValue>>
// tslint:disable-next-line:no-shadowed-variable
export function __makeDependentFunc<TThis,
	TArgs extends any[],
	TValue,
	>(func: Func<TThis, TArgs, TValue>): Func<TThis, TArgs, TValue>
// tslint:disable-next-line:no-shadowed-variable
export function __makeDependentFunc<TThis,
	TArgs extends any[],
	TValue,
	>(func: Func<TThis, TArgs, TValue | Iterator<TValue>>) {
	if (typeof func === 'function') {
		return makeDependentFunc<TThis, TArgs, TValue>(func as any)
	}
	return null
}

// endregion

export function createPerceptronNaked(layerSize, layersCount, check = true) {
	const countFuncs = layersCount * layerSize + 2

	const input = function() {
		return 1
	}

	// first layer
	let layer = []
	for (let i = 0; i < layerSize; i++) {
		layer[i] = function(a, b) {
			return i * a * b * input() * (this as any)
		}
	}
	const layers = [layer]

	for (let i = 0; i < layersCount - 1; i++) {
		const nextLayer = []
		for (let j = 0; j < layerSize; j++) {
			const prevLayer = layer
			nextLayer[j] = function(a, b) {
				let sum = 0
				for (let k = 0; k < layerSize; k++) {
					sum += prevLayer[k].call(this, a, b)
				}
				return sum
			}
		}
		layer = nextLayer
		layers.push(layer)
	}

	let output
	{
		const prevLayer = layer
		output = function(a, b) {
			let sum = 0
			for (let i = 0; i < layerSize; i++) {
				sum += prevLayer[i].call(this, a, b)
			}
			return sum
		}
	}

	if (check) {
		assert.strictEqual(
			output.call(2, 5, 10).toPrecision(6),
			(100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6),
		)
	}

	return output
}

export function __invalidate<TThis,
	TArgs extends any[],
	TValue,
>(state: IFuncCallState<TThis, TArgs, TValue>, status?: any) {
	return invalidate(state, status)
}

export function __outputCall(output): any {
	return output.call(2, 5, 10)
}

export function createPerceptron(
	layerSize,
	layersCount,
	check = true,
	makeDependentFunc = __makeDependentFunc,
	invalidate2 = __invalidate,
) {
	const countFuncs = layersCount * layerSize + 2

	let callId = 0
	const input = makeDependentFunc(function() {
		return ++callId
	})

	// first layer
	let layer = []
	for (let i = 0; i < layerSize; i++) {
		layer[i] = makeDependentFunc(function(a, b) {
			return i * a * b * input() * (this as any)
		})
	}
	const layers = [layer]

	for (let i = 0; i < layersCount - 1; i++) {
		const nextLayer = []
		for (let j = 0; j < layerSize; j++) {
			const prevLayer = layer
			nextLayer[j] = makeDependentFunc(function(a, b) {
				let sum = 0
				for (let k = 0; k < layerSize; k++) {
					sum += prevLayer[k].call(this, a, b)
				}
				return sum
			})
		}
		layer = nextLayer
		layers.push(layer)
	}

	let output
	{
		const prevLayer = layer
		output = makeDependentFunc(function(a, b) {
			let sum = 0
			for (let i = 0; i < layerSize; i++) {
				sum += prevLayer[i].call(this, a, b)
			}
			return sum
		})
	}

	let _states
	const getStates = () => {
		if (!_states) {
			_states = layers
				.flatMap(o => o)
				.map(o => getFuncCallState(o)())
		}
		return _states
	}

	const inputState = getFuncCallState(input)()
	const outputState = getFuncCallState(output).call(2, 5, 10)

	if (check) {
		assert.strictEqual(
			__outputCall(output).toPrecision(6),
			(callId * 100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6),
		)

		invalidate(inputState)

		assert.strictEqual(
			__outputCall(output).toPrecision(6),
			(callId * 100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6),
		)
	}

	let outputStateHash = 17
	for (let i = 0; i < outputState.valueIds.length; i++) {
		outputStateHash = (outputStateHash * 31 + outputState.valueIds[i]) | 0
	}

	return {
		getStates,
		countFuncs,
		input,
		inputState,
		output,
		outputState,
		outputStateHash,
	}
}

// region baseTest

const _callHistory = []

type IDependencyCall = (() => ThenableOrValue<string>) & {
	id: string,
	state: IFuncCallState<any, any, any>,
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
		Array.isArray(_this) && _this.map(o => o.id).join(',') || _this || 0
	) + ')'
	return callId
}

let resultsAsError: string[] = []

function setResultsAsError(...calls: IDependencyCall[]) {
	resultsAsError = calls.map(o => o.id)
}

function callIdToResult(callId: string) {
	let result

	switch (callId) {
		case 'I(0)': // I0
		case 'I1(I(0),A(_))': // I1
		case 'I20(S1(S(0),I(0)),I1(I(0),A(_)))': // I2
			result = new String(callId)
			break
		default:
			result = callId
			break
	}

	if (resultsAsError.indexOf(callId) >= 0) {
		throw result
	}

	return result
}

function funcSync(id: string) {
	const result: IDependencyFunc = makeDependentFunc(function() {
		const callId = getCallId(id, this, ...arguments)
		_callHistory.push(callId)
		const dependencies = this
		if (Array.isArray(dependencies)) {
			for (let i = 0, len = dependencies.length; i < len * 2; i++) {
				const dependency = dependencies[i % len]
				const value = dependency()
				assert.strictEqual(value + '', dependency.id)
			}
		}
		return callIdToResult(callId)
	}) as any

	result.id = id

	return result
}

function funcSyncIterator(id: string) {
	const nested = function*(dependencies: IDependencyCall[]) {
		yield 1
		if (Array.isArray(dependencies)) {
			for (let i = 0, len = dependencies.length; i < len * 2; i++) {
				const dependency = dependencies[i % len]
				const value = yield dependency()
				assert.strictEqual(value + '', dependency.id)
			}
		}
		return 1
	}
	const run = function*(callId: string, dependencies: IDependencyCall[]) {
		yield 1
		yield nested(dependencies)
		return callIdToResult(callId)
	}

	const result: IDependencyFunc = makeDependentFunc(function() {
		const callId = getCallId(id, this, ...arguments)
		_callHistory.push(callId)
		return run(callId, this as any)
	}) as any

	result.id = id

	return result
}

function funcAsync(id: string) {
	const nested = function*() {
		yield 1
		return 1
	}
	const nestedAsync = function*(dependencies: IDependencyCall[]) {
		yield 1
		if (dependencies) {
			for (let i = 0, len = dependencies.length; i < len; i++) {
				const dependency = dependencies[i]
				const value = yield dependency()
				assert.strictEqual(value + '', dependency.id)
			}
		}
		yield delay(0)
		return 1
	}
	const run = function*(callId: string, dependencies: IDependencyCall[]) {
		yield 1
		yield delay(0)
		yield nested()
		yield nestedAsync(dependencies)
		return callIdToResult(callId)
	}

	const result: IDependencyFunc = makeDependentFunc(function() {
		const callId = getCallId(id, this, ...arguments)
		_callHistory.push(callId)
		return run(callId, this as any)
	}) as any

	result.id = id

	return result
}

function funcCall(func: IDependencyFunc, _this?: any, ...rest: any[]) {
	const callId = getCallId(func.id, _this, ...rest)
	const result: IDependencyCall = (() => {
		return func.apply(_this, rest)
	}) as any

	result.id = callId
	result.state = getFuncCallState(func).apply(_this, rest)
	assert.ok(result.state)
	assert.strictEqual(result.state.status, FuncCallStatus.Flag_Invalidated | FuncCallStatus.Flag_Recalc);
	(result.state as any).id = callId

	return result
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

function checkCallHistory(...callHistory: IDependencyCall[]) {
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

	let value
	let error
	try {
		value = checkSync(funcCall())
	} catch (err) {
		error = err
	}

	if (resultType === ResultType.Error || resultType === ResultType.Any && error) {
		// if (resultsAsError.indexOf(error + '') < 0) {
		// 	assert.fail(`funcCall.id = ${funcCall.id}, error = ${error}`)
		// }
	} else if (resultType === ResultType.Value || resultType === ResultType.Any && !error) {
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
	const promise = checkAsync(funcCall())
	// assertStatus(funcCall.state.status)
	checkCallHistory(...callHistory)
	return (async () => {
		let value
		let error
		try {
			value = await promise
		} catch (err) {
			error = err
		}

		if (resultType === ResultType.Error || resultType === ResultType.Any && error) {
			assert.ok(error)
			// if (resultsAsError.indexOf(error + '') < 0) {
			// 	assert.fail(`funcCall.id = ${funcCall.id}, error = ${error}`)
			// }
		} else if (resultType === ResultType.Value || resultType === ResultType.Any && !error) {
			assert.notOk(error)
			assert.strictEqual(value + '', funcCall.id)
		} else {
			throw new Error('Unknown ResultType: ' + resultType)
		}

		// assertStatus(funcCall.state.status)
		checkDependenciesDuplicates(funcCall, ...callHistory)
	})()
}

const statusesShort = {
	i: FuncCallStatus.Flag_Invalidating,
	I: FuncCallStatus.Flag_Invalidated,
	f: FuncCallStatus.Flag_Invalidating | FuncCallStatus.Flag_Recalc,
	F: FuncCallStatus.Flag_Invalidated | FuncCallStatus.Flag_Recalc,
	x: FuncCallStatus.Flag_Check,
	c: FuncCallStatus.Flag_Calculating,
	a: FuncCallStatus.Flag_Async,
	C: FuncCallStatus.Flag_Calculated,
	V: FuncCallStatus.Flag_HasValue,
	E: FuncCallStatus.Flag_HasError,
}

function parseStatusShort(statusShort: string) {
	let status: FuncCallStatus = 0
	for (let i = 0, len = statusShort.length; i < len; i++) {
		status |= statusesShort[statusShort[i]]
	}
	return status
}

function statusToShortString(status: FuncCallStatus) {
	let result = ''
	if ((status & FuncCallStatus.Flag_Invalidating) !== 0) {
		result += 'i'
		status &= ~FuncCallStatus.Flag_Invalidating
	}
	if ((status & FuncCallStatus.Flag_Invalidated) !== 0) {
		result += 'I'
		status &= ~FuncCallStatus.Flag_Invalidated
	}
	if ((status & FuncCallStatus.Flag_Recalc) !== 0) {
		result += 'r'
		status &= ~FuncCallStatus.Flag_Recalc
	}

	if ((status & FuncCallStatus.Flag_Check) !== 0) {
		result += 'x'
		status &= ~FuncCallStatus.Flag_Check
	}
	if ((status & FuncCallStatus.Flag_Calculating) !== 0) {
		result += 'c'
		status &= ~FuncCallStatus.Flag_Calculating
	}
	if ((status & FuncCallStatus.Flag_Async) !== 0) {
		result += 'a'
		status &= ~FuncCallStatus.Flag_Async
	}

	if ((status & FuncCallStatus.Flag_Calculated) !== 0) {
		result += 'C'
		status &= ~FuncCallStatus.Flag_Calculated
	}
	if ((status & FuncCallStatus.Flag_HasValue) !== 0) {
		result += 'V'
		status &= ~FuncCallStatus.Flag_HasValue
	}
	if ((status & FuncCallStatus.Flag_HasError) !== 0) {
		result += 'E'
		status &= ~FuncCallStatus.Flag_HasError
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
		invalidate(funcCalls[i].state)
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
	return (funcCall.state.status & FuncCallStatus.Mask_Invalidate) !== 0
}

// export function assertStatus(status: FuncCallStatus) {
// 	assert.ok(checkStatus(status), statusToString(status))
// }

function getSubscribers(state: IFuncCallState<any, any, any>) {
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

export async function baseTestOld() {
	// region init

	const S = funcSync('S')
	const I = funcSyncIterator('I')
	const A = funcAsync('A')

	const S0 = funcCall(S) // S(0)
	const I0 = funcCall(I, null) // I(0)
	const A0 = funcCall(A, new ThisObj('_')) // A(_)

	const S1 = funcCall(S, [S0, I0], 1) // S1(S(0),I(0))
	const I1 = funcCall(I, [I0, A0], 1) // I1(I(0),A(_))

	const S2 = funcCall(S, [S1], 2, void 0) // S20(S1(S(0),I(0)))
	const I2 = funcCall(I, [S1, I1], 2, null) // I20(S1(S(0),I(0)),I1(I(0),A(_)))
	const A2 = funcCall(A, [I1], 2, 2) // A22(I1(I(0),A(_)))

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

	checkFuncSync(ResultType.Value, S0, S0)
	checkFuncSync(ResultType.Value, I0, I0)
	await checkFuncAsync(ResultType.Value, A0, A0)

	checkFuncSync(ResultType.Value, S1, S1)
	checkFuncSync(ResultType.Value, I1, I1)

	checkFuncSync(ResultType.Value, S2, S2)
	checkFuncSync(ResultType.Value, I2, I2)
	await checkFuncAsync(ResultType.Value, A2, A2)

	// endregion

	// region invalidate

	const allFuncs = [S0, I0, A0, S1, I1, S2, I2, A2]
	checkFuncNotChanged(allFuncs)

	// level 2

	_invalidate(S2)
	checkFuncSync(ResultType.Value, S2, S2)
	checkFuncNotChanged(allFuncs)

	_invalidate(I2)
	checkFuncSync(ResultType.Value, I2, I2)
	checkFuncNotChanged(allFuncs)

	_invalidate(A2)
	await checkFuncAsync(ResultType.Value, A2, A2)
	checkFuncNotChanged(allFuncs)

	// level 1

	_invalidate(S1)
	checkFuncSync(ResultType.Value, S2, S2, S1)
	checkFuncSync(ResultType.Value, I2, I2)
	checkFuncNotChanged(allFuncs)

	_invalidate(I1)
	checkFuncSync(ResultType.Value, I2, I2, I1)
	await checkFuncAsync(ResultType.Value, A2, A2)
	checkFuncNotChanged(allFuncs)

	// level 0

	_invalidate(S0)
	// console.log(allFuncs.filter(isInvalidated).map(o => o.id))
	checkFuncSync(ResultType.Value, S2, S2, S1, S0)
	checkFuncSync(ResultType.Value, I2, I2)
	checkFuncNotChanged(allFuncs)

	_invalidate(I0)
	checkFuncSync(ResultType.Value, S2, S2, S1, I0)
	checkFuncSync(ResultType.Value, I2, I2, I1)
	await checkFuncAsync(ResultType.Value, A2, A2)
	checkFuncNotChanged(allFuncs)

	_invalidate(A0)
	await checkFuncAsync(ResultType.Value, I2, I2, I1, A0)
	await checkFuncAsync(ResultType.Value, A2, A2)
	checkFuncNotChanged(allFuncs)

	// endregion

	return {
		states: [S0, I0, A0, S1, I1, S2, I2, A2].map(o => {
			return o.state
		}),
	}
}

export async function baseTest() {
	// region init

	const S = funcSync('S')
	const I = funcSyncIterator('I')
	const A = funcAsync('A')

	const S0 = funcCall(S) // S(0)
	const I0 = funcCall(I, null) // I(0)
	const A0 = funcCall(A, new ThisObj('_')) // A(_)

	const S1 = funcCall(S, [S0, I0], 1) // S1(S(0),I(0))
	const I1 = funcCall(I, [I0, A0], 1) // I1(I(0),A(_))

	const S2 = funcCall(S, [S1], 2, void 0) // S20(S1(S(0),I(0)))
	const I2 = funcCall(I, [S1, I1], 2, null) // I20(S1(S(0),I(0)),I1(I(0),A(_)))
	const A2 = funcCall(A, [I1], 2, 2) // A22(I1(I(0),A(_)))

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
	_checkStatuses('CV', 'CV', 'IV',   'CV', 'IV',   'CV', 'IV', 'IV')
	_invalidate(I0)
	_checkStatuses('CV', 'IrV', 'IV',   'IV', 'IV',   'IV', 'IV', 'IV')
	await promise1
	_checkStatuses('CV', 'IrV', 'IV',   'IV', 'IV',   'IV', 'IV', 'IV')
	checkFuncSync(ResultType.Value, I2, I0, S1, I1, I2)
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
	_checkStatuses('CV', 'CV', 'IV',   'CV', 'IV',   'CV', 'IV', 'IV')
	_invalidate(I0)
	_checkStatuses('CV', 'IrV', 'IV',   'IV', 'IV',   'IV', 'IV', 'IV')
	await promise1
	_checkStatuses('CV', 'IrV', 'IV',   'IV', 'IV',   'IV', 'IV', 'IV')
	checkFuncSync(ResultType.Value, I2, I0, S1, I1, I2)
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

	return {
		states: [S0, I0, A0, S1, I1, S2, I2, A2].map(o => {
			return o.state
		}),
	}
}

// endregion

export function clearCallStates() {
	reduceCallStates(2000000000)
	assert.strictEqual(callStateHashTable && callStateHashTable.size, 0)
	assert.strictEqual(valueStatesMap.size, 0)
	assert.strictEqual(valueIdsMap.size, 0)
}
