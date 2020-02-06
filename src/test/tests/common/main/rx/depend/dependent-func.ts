/* tslint:disable:prefer-const no-identical-functions no-empty no-shadowed-variable no-conditional-assignment */
/* tslint:disable:no-var-requires one-variable-per-declaration */
/* eslint-disable no-new-func,no-array-constructor,object-property-newline,no-undef */
/* eslint-disable no-empty,no-shadow,no-prototype-builtins,prefer-destructuring */
/* eslint-disable prefer-rest-params,arrow-body-style */

// @ts-ignore
import {calcPerformance} from 'rdtsc'
import {isThenable, Thenable, ThenableOrValue} from '../../../../../../main/common/async/async'
import {IFuncCallState} from '../../../../../../main/common/rx/depend/contracts'
import {getFuncCallState, makeDependentFunc} from '../../../../../../main/common/rx/depend/dependent-func'
import {assert} from '../../../../../../main/common/test/Assert'
import {describe, it, xit} from '../../../../../../main/common/test/Mocha'
import {delay} from '../../../../../../main/common/time/helpers'

describe('common > main > rx > depend > dependent-func', function() {
	xit('perf', function() {
		this.timeout(300000)

		let arr1 = []
		let arr2 = new Array(10)

		const result = calcPerformance(
			5000,
			() => {
				// no operations
			}, () => {
				arr1 = new Array()
			}, () => {
				arr2 = new Array(10)
			},
		)

		console.log(result)
	})

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
				for (let i = 0, len = dependencies.length; i < len; i++) {
					const dependency = dependencies[i]
					const value = dependency()
					assert.strictEqual(value, dependency.id)
				}
			}
			return callId
		}) as any

		result.id = id

		return result
	}

	function funcSyncIterator(id: string) {
		const nested = function*(dependencies: IDependencyCall[]) {
			yield 1
			if (Array.isArray(dependencies)) {
				for (let i = 0, len = dependencies.length; i < len; i++) {
					const dependency = dependencies[i]
					const value = yield dependency()
					assert.strictEqual(value, dependency.id)
				}
			}
			return 1
		}
		const run = function*(callId, dependencies: IDependencyCall[]) {
			yield 1
			yield nested(dependencies)
			return callId
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
		const run = function*(callId, dependencies: IDependencyCall[]) {
			yield 1
			yield delay(0)
			yield nested()
			yield nestedAsync(dependencies)
			return callId
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
		assert.ok(result.state.call)
		assert.strictEqual(result.state._this, _this)

		let callArgs
		let callThis
		let checkCallThis = {}
		result.state.call(checkCallThis, function() {
			callThis = this
			callArgs = [...arguments]
		})
		assert.strictEqual(callThis, checkCallThis)
		assert.deepStrictEqual(callArgs, rest)

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

	function invalidate(funcCall: IDependencyCall) {
		checkCallHistory([])
		funcCall.state.invalidate()
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

	it('base', async function() {
		this.timeout(300000)

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

		invalidate(S2)
		checkFuncSync(S2, S2)
		checkFuncNotChanged(allFuncs)

		invalidate(I2)
		checkFuncSync(I2, I2)
		checkFuncNotChanged(allFuncs)

		invalidate(A2)
		await checkFuncAsync(A2, A2)
		checkFuncNotChanged(allFuncs)

		// level 1

		invalidate(S1)
		checkFuncSync(S2, S1, S2)
		checkFuncSync(I2, I2)
		checkFuncNotChanged(allFuncs)

		// invalidate(I2)
		// checkFuncSync(I2, I2)
		// checkFuncNotChanged(allFuncs)
		//
		// invalidate(A2)
		// await checkFuncAsync(A2, A2)
		// checkFuncNotChanged(allFuncs)

		// endregion
	})
})
