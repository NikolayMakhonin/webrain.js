/* tslint:disable:no-identical-functions no-shadowed-variable no-var-requires */
// @ts-ignore
import {assert, AssertionError} from '../../../../main/common/test/Assert'
import {describe, it, xit} from '../../../../main/common/test/Mocha'
import {v8} from './src/helpers/common/helpers'
import {OptimizationStatus} from './src/helpers/contracts'
import {
	assertIsNotOptimized,
	assertIsOptimized,

} from './src/helpers/helpers'

describe('node > v8 > helpers', function() {
	it('base', function() {
		function test(o) {
			return o * o
		}

		assertIsNotOptimized({test})

		test(1)

		assertIsNotOptimized({test})

		test(2)

		assertIsNotOptimized({test})

		v8.OptimizeFunctionOnNextCall(test)

		test(3)

		assertIsOptimized({test})
	})

	it('optimization asserts', function() {
		const obj = {
			x: 0,
			y: 0,
		}
		function test(o) {
			return Date.now() * (o.x + o.y)
		}

		assertIsNotOptimized({test})
		assert.throws(() => assertIsOptimized({test}), AssertionError)

		const arr = []
		for (let i = 0; i < 6146; i++) {
			obj.x = i
			obj.y = i * i
			arr[i % 100] = test(obj)
		}

		// console.log(getFuncOptimizationStatusString({test}))

		// console.log(getObjectOptimizationInfo(obj))
		// console.log(getObjectOptimizationInfo(arr))

		assert.throws(() => assertIsNotOptimized({test}), AssertionError)
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
