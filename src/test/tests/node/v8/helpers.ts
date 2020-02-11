/* tslint:disable:no-identical-functions no-shadowed-variable no-var-requires */
// @ts-ignore
import {assert, AssertionError} from '../../../../main/common/test/Assert'
import {describe, it, xit} from '../../../../main/common/test/Mocha'
import {
	assertFuncOptimizationStatus,
	assertIsOptimized,
	getFuncOptimizationStatusString, getObjectOptimizationInfo,
	OptimizationStatus,
	v8,
} from './helpers/helpers'

describe('node > v8 > helpers', function() {
	it('optimization asserts', function() {
		const obj = {
			x: 0,
			y: 0,
		}
		function test(o) {
			return Date.now() * (o.x + o.y)
		}

		const arr = []
		for (let i = 0; i < 6146 * 100; i++) {
			obj.x = i
			obj.y = i * i
			arr[i % 100] = test(obj)
		}

		// console.log(getFuncOptimizationStatusString({test}))

		// console.log(getObjectOptimizationInfo(obj))
		// console.log(getObjectOptimizationInfo(arr))

		assertIsOptimized({test, obj, arr})

		for (let i = 0; i < 1000; i++) {
			obj[i * i] = 'qwe'
			arr[i * i] = 'ert'
		}

		// console.log(getObjectOptimizationInfo(obj))
		// console.log(getObjectOptimizationInfo(arr))

		assert.throws(() => assertIsOptimized({obj}), AssertionError)
		assert.throws(() => assertIsOptimized({arr}), AssertionError)

		assertIsOptimized({test})
		test({})
		assert.throws(() => assertIsOptimized({test}), AssertionError)
	})
})
