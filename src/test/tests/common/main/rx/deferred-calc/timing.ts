import {assert} from '../../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../../main/common/test/Mocha'
import {TestTiming} from './src/timing'

describe('common > main > rx > deferred-calc > timing', function() {
	it('base', function() {
		const timing = new TestTiming()
		let results = []

		assert.throws(() => timing.setTime(0), Error)
		assert.throws(() => timing.addTime(-1), Error)

		timing.setTimeout(() => results.push(1), 0)
		timing.addTime(0)
		assert.deepStrictEqual(results, [1])
		results = []
		timing.addTime(0)
		assert.deepStrictEqual(results, [])

		timing.setTimeout(() => results.push(2), 0)
		const timerId1 = timing.setTimeout(() => results.push(3), 0)
		timing.setTimeout(() => results.push(4), 0)
		timing.setTimeout(() => results.push(5), 1)
		const timerId2 = timing.setTimeout(() => results.push(6), 1)
		timing.setTimeout(() => results.push(7), 1)
		timing.setTimeout(() => results.push(8), 1)
		timing.setTimeout(() => results.push(9), 1)
		timing.setTimeout(() => results.push(10), 1)
		timing.clearTimeout(timerId1)
		timing.clearTimeout(timerId2)
		assert.deepStrictEqual(results, [])
		timing.addTime(0)
		assert.deepStrictEqual(results, [2, 4])
		results = []
		timing.addTime(0)
		assert.deepStrictEqual(results, [])

		timing.addTime(1)
		assert.deepStrictEqual(results, [5, 7, 8, 9, 10])
		results = []
		timing.addTime(1)
		assert.deepStrictEqual(results, [])

		timing.setTime(4)
		timing.setTimeout(() => results.push(1), 1) // 5
		timing.setTimeout(() => results.push(2), 2) // 6
		timing.setTime(1)
		timing.setTimeout(() => results.push(5), 4) // 5
		timing.setTimeout(() => results.push(3), 2) // 3
		timing.setTimeout(() => results.push(4), 2) // 3
		timing.setTimeout(() => results.push(6), 2) // 3
		timing.setTimeout(() => results.push(0), 0) // 0
		results = []
		timing.addTime(10)
		assert.deepStrictEqual(results, [0, 3, 4, 6, 1, 5, 2])
		results = []
		timing.addTime(1)
		assert.deepStrictEqual(results, [])
		assert.strictEqual(timing.now(), 12)

		timing.setTimeout(() => results.push(1), 1)
		timing.setTimeout(() => results.push(2), 2)
		timing.setTimeout(() => results.push(3), 3)
		timing.setTimeout(() => results.push(4), 4)
		timing.setTimeout(() => results.push(5), 5)
		timing.addTime(5)
		assert.deepStrictEqual(results, [1, 2, 3, 4, 5])
		results = []
		timing.addTime(10)
		assert.deepStrictEqual(results, [])
		assert.strictEqual(timing.now(), 27)
	})
})
