/* tslint:disable:prefer-const no-identical-functions no-empty no-shadowed-variable no-conditional-assignment */
/* tslint:disable:no-var-requires one-variable-per-declaration */
/* eslint-disable no-new-func,no-array-constructor,object-property-newline,no-undef */
/* eslint-disable no-empty,no-shadow,no-prototype-builtins,prefer-destructuring */
/* eslint-disable prefer-rest-params,arrow-body-style */

// @ts-ignore
import {calcPerformance} from 'rdtsc'
import {resolveAsync} from '../../../main/common/async/ThenableSync'
import {makeDependentFunc} from '../../../main/common/rx/depend/core/facade'
import {IFuncMeta} from '../../../main/common/rx/depend/core/helpers'
import {IUnsubscribeOrVoid} from '../../../main/common/rx/subjects/observable'
import {assert} from '../../../main/common/test/Assert'
import {describe, it, xit} from '../../../main/common/test/Mocha'

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

	it('base', function() {
		this.timeout(300000)

		let func1
		let func2
		let func3

		function func1Body(a, b) {
			return (a || 0) + (b || 0)
		}

		function* func2Body() {
			yield func1(1)
			yield func1(2, 3)
			return func1(2, 3) + 10
		}

		function* func3Body() {
			const val = yield* func2()
			return val + 100
		}

		function getSubscriber1(...args) {
			return function subscriber1(onInvalidate: () => void) {
				return () => {
					return false
				}
			}
		}

		function getSubscriber2(...args) {
			return function subscriber2(onInvalidate: () => void) {
				return () => {
					return false
				}
			}
		}

		function getSubscriber3(...args) {
			return function subscriber3(onInvalidate: () => void) {
				return () => {
					return false
				}
			}
		}

		class FuncMeta implements IFuncMeta {
			public readonly id: number
			constructor(id: number) {
				this.id = id
			}

			public subscribers = new Map()
			public values = new Map()

			public hasDependency(callId: number): boolean {
				return this.subscribers.has(callId)
			}

			public subscribeDependency(callId: number, subscriber: (onInvalidate: () => void) => IUnsubscribeOrVoid) {
				assert.notOk(this.subscribers.has(callId))
				return this.subscribers.set(callId, subscriber)
			}

			public setValue(callId: number, value: any) {
				return this.values.set(callId, value)
			}
		}

		const meta1 = new FuncMeta(1)
		const meta2 = new FuncMeta(2)
		const meta3 = new FuncMeta(3)

		func1 = makeDependentFunc(func1Body, getSubscriber1, meta1)
		func2 = makeDependentFunc(func2Body, getSubscriber2, meta2)
		func3 = makeDependentFunc(func3Body, getSubscriber3, meta3)

		const result = resolveAsync(func3())

		assert.strictEqual(result, 115)

		assert.strictEqual(meta1.subscribers.size, 0)
		// assert.strictEqual(meta1.values.size, 0)
		assert.deepStrictEqual(Array.from(meta2.subscribers.values()).map(o => o.name), ['subscriber1', 'subscriber1'])
		assert.deepStrictEqual(Array.from(meta1.values.values()), [1, 5])
		assert.deepStrictEqual(Array.from(meta3.subscribers.values()).map(o => o.name), ['subscriber2'])
		assert.deepStrictEqual(Array.from(meta2.values.values()), [15])
		assert.deepStrictEqual(Array.from(meta3.values.values()), [115])

		console.log(new Date())

	})
})
