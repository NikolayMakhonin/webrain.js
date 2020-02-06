/* tslint:disable:prefer-const no-identical-functions no-empty no-shadowed-variable no-conditional-assignment */
/* tslint:disable:no-var-requires one-variable-per-declaration */
/* eslint-disable no-new-func,no-array-constructor,object-property-newline,no-undef */
/* eslint-disable no-empty,no-shadow,no-prototype-builtins,prefer-destructuring */
/* eslint-disable prefer-rest-params,arrow-body-style */

// @ts-ignore
import {calcPerformance} from 'rdtsc'
import {isThenable, Thenable, ThenableOrValue} from '../../../../../../main/common/async/async'
import {makeDependentFunc} from '../../../../../../main/common/rx/depend/dependent-func'
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

	const callHistory = []

	type IDependencyCall = (() => ThenableOrValue<string>) & {
		id: string,
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
			callHistory.push(callId)
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
			callHistory.push(callId)
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
			callHistory.push(callId)
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

		return result
	}

	class ThisObj {
		private value: string

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

	it('base', async function() {
		this.timeout(300000)

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

		assert.strictEqual(S0(), 'S(0)')
		assert.strictEqual(I0(), 'I(0)')
		assert.strictEqual(await checkAsync(A0()), 'A(_)')

		assert.strictEqual(S1(), 'S1(S(0),I(0))')
		assert.strictEqual(I1(), 'I1(I(0),A(_))')

		assert.strictEqual(S2(), 'S20(S1(S(0),I(0)))')
		assert.strictEqual(I2(), 'I20(S1(S(0),I(0)),I1(I(0),A(_)))')
		assert.strictEqual(await checkAsync(A2()), 'A22(I1(I(0),A(_)))')
	})
})
