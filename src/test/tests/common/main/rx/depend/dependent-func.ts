/* tslint:disable:prefer-const no-identical-functions no-empty no-shadowed-variable no-conditional-assignment */
/* tslint:disable:no-var-requires one-variable-per-declaration */
/* eslint-disable no-new-func,no-array-constructor,object-property-newline,no-undef */
/* eslint-disable no-empty,no-shadow,no-prototype-builtins,prefer-destructuring */
/* eslint-disable prefer-rest-params,arrow-body-style */

// @ts-ignore
import {calcPerformance} from 'rdtsc'
import {delay} from '../../../../../../main/common'
import {ThenableOrValue} from '../../../../../../main/common/async/async'
import {makeDependentFunc} from '../../../../../../main/common/rx/depend/dependent-func'
import {assert} from '../../../../../../main/common/test/Assert'
import {describe, it, xit} from '../../../../../../main/common/test/Mocha'

describe('dependent-func', function() {
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

	function getCallId(funcId: string, _this?: any, a?: number, b?: number) {
		return funcId + '_' + (a || 0) + '_' + (b || 0) + '_' + (
			Array.isArray(_this) && _this.map(o => o.id).join('') || _this || 0
		)
	}

	function funcSync(id: string) {
		const result: IDependencyFunc = makeDependentFunc((a, b) => {
			const callId = getCallId(id, this, a, b)
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

		const result: IDependencyFunc = makeDependentFunc(function(a, b) {
			const callId = getCallId(id, this, a, b)
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

		const result: IDependencyFunc = makeDependentFunc(function(a, b) {
			const callId = getCallId(id, this, a, b)
			callHistory.push(callId)
			return run(callId, this as any)
		}) as any

		result.id = id

		return result
	}
	
	function funcCall(func: IDependencyFunc, _this?: any, a?: number, b?: number) {
		const callId = getCallId(func.id, _this, a, b)
		const result: IDependencyCall = (() => {
			switch (arguments.length) {
				case 2:
					return func.call(_this)
				case 3:
					return func.call(_this, a)
				case 4:
					return func.call(_this, a, b)
				default:
					throw new Error('arguments.length === ' + arguments.length)
			}
		}) as any

		result.id = callId

		return result
	}

	class ThisObj {
		private value: number

		constructor(value: number) {

		}

		public toString() {
			return this.value + ''
		}
	}

	it('base', function() {
		this.timeout(300000)

		const S = funcSync('S')
		const I = funcSyncIterator('I')
		const A = funcAsync('A')

		const S3 = funcCall(S)
		const I3 = funcCall(I, null)
		const A3 = funcCall(A, new ThisObj(1))

		const S2 = funcCall(S, [S3, I3], void 0)
		const I2 = funcCall(I, [I3, A3], null)

		const S1 = funcCall(S, [S2], 1)
		const I1 = funcCall(I, [S2, I2], 1, 2)
		const A1 = funcCall(S, [I2], 1, void 0)
		
		assert.strictEqual(S1(), 'S1_1_0_S2')
	})
})
