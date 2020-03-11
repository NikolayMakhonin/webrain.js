/* tslint:disable:no-identical-functions no-shadowed-variable */
import {isThenable, Thenable, ThenableOrValue} from '../../../../../../../main/common/async/async'
import {invalidate} from '../../../../../../../main/common/rx/depend/_dependentFunc'
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
>(state: IFuncCallState<TThis, TArgs, TValue>, status?: FuncCallStatus) {
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

	const input = makeDependentFunc(function() {
		return 1
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
			(100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6),
		)

		invalidate(inputState)

		assert.strictEqual(
			__outputCall(output).toPrecision(6),
			(100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6),
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

function funcSync(id: string) {
	const result: IDependencyFunc = makeDependentFunc(function() {
		const callId = getCallId(id, this, ...arguments)
		_callHistory.push(callId)
		const dependencies = this
		if (Array.isArray(dependencies)) {
			for (let i = 0, len = dependencies.length; i < len * 2; i++) {
				const dependency = dependencies[i % len]
				const value = dependency()
				assert.strictEqual(value, dependency.id)
			}
		}
		return String(callId)
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
				assert.strictEqual(value, dependency.id)
			}
		}
		return 1
	}
	const run = function*(callId: string, dependencies: IDependencyCall[]) {
		yield 1
		yield nested(dependencies)
		return String(callId)
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
				assert.strictEqual(value, dependency.id)
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
		return String(callId)
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
	assert.strictEqual(result.state.status, FuncCallStatus.Invalidated);
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

function checkAsync<TValue>(value: ThenableOrValue<TValue>): Thenable<TValue> {
	assert.ok(isThenable(value))
	return value as Thenable<TValue>
}

function checkCallHistory(callHistory: IDependencyCall[]) {
	assert.deepStrictEqual(_callHistory, callHistory.map(o => o.id))
	_callHistory.length = 0
}

function checkFuncSync<TValue>(funcCall: IDependencyCall, ...callHistory: IDependencyCall[]) {
	assert.strictEqual(funcCall(), funcCall.id)
	checkCallHistory(callHistory)
}

async function checkFuncAsync<TValue>(funcCall: IDependencyCall, ...callHistory: IDependencyCall[]) {
	checkCallHistory([])
	assert.strictEqual(await checkAsync(funcCall()), funcCall.id)
	checkCallHistory(callHistory)
}

function _invalidate(funcCall: IDependencyCall) {
	checkCallHistory([])
	invalidate(funcCall.state)
	checkCallHistory([])
}

function _checkFuncNotChanged<TValue>(...funcCalls: IDependencyCall[]) {
	for (let i = 0, len = funcCalls.length; i < len; i++) {
		checkFuncSync(funcCalls[i])
	}
}

function checkFuncNotChanged<TValue>(allFuncCalls: IDependencyCall[], ...changedFuncCalls: IDependencyCall[]) {
	_checkFuncNotChanged(...allFuncCalls.filter(o => changedFuncCalls.indexOf(o) < 0))
}

function isInvalidated(funcCall: IDependencyCall) {
	return funcCall.state.status === FuncCallStatus.Invalidating || funcCall.state.status === FuncCallStatus.Invalidated
}

export async function baseTest() {
	// region init

	const S = funcSync('S')
	const I = funcSyncIterator('I')
	const A = funcAsync('A')

	const S0 = funcCall(S)
	const I0 = funcCall(I, null)
	const A0 = funcCall(A, new ThisObj('_'))

	const S1 = funcCall(S, [S0, I0], 1)
	const I1 = funcCall(I, [I0, A0], 1)

	const S2 = funcCall(S, [S1], 2, void 0)
	const I2 = funcCall(I, [S1, I1], 2, null)
	const A2 = funcCall(A, [I1], 2, 2)

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

	checkFuncSync(S0, S0)
	checkFuncSync(I0, I0)
	await checkFuncAsync(A0, A0)

	checkFuncSync(S1, S1)
	checkFuncSync(I1, I1)

	checkFuncSync(S2, S2)
	checkFuncSync(I2, I2)
	await checkFuncAsync(A2, A2)

	// endregion

	// region invalidate

	const allFuncs = [S0, I0, A0, S1, I1, S2, I2, A2]
	checkFuncNotChanged(allFuncs)

	// level 2

	_invalidate(S2)
	checkFuncSync(S2, S2)
	checkFuncNotChanged(allFuncs)

	_invalidate(I2)
	checkFuncSync(I2, I2)
	checkFuncNotChanged(allFuncs)

	_invalidate(A2)
	await checkFuncAsync(A2, A2)
	checkFuncNotChanged(allFuncs)

	// level 1

	_invalidate(S1)
	checkFuncSync(S2, S2, S1)
	checkFuncSync(I2, I2)
	checkFuncNotChanged(allFuncs)

	_invalidate(I1)
	checkFuncSync(I2, I2, I1)
	await checkFuncAsync(A2, A2)
	checkFuncNotChanged(allFuncs)

	// level 0

	_invalidate(S0)
	// console.log(allFuncs.filter(isInvalidated).map(o => o.id))
	checkFuncSync(S2, S2, S1, S0)
	checkFuncSync(I2, I2)
	checkFuncNotChanged(allFuncs)

	_invalidate(I0)
	checkFuncSync(S2, S2, S1, I0)
	checkFuncSync(I2, I2, I1)
	await checkFuncAsync(A2, A2)
	checkFuncNotChanged(allFuncs)

	_invalidate(A0)
	await checkFuncAsync(I2, I2, I1, A0)
	await checkFuncAsync(A2, A2)
	checkFuncNotChanged(allFuncs)

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
