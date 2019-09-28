import {compareStrict, compareFast} from '../../../../../../main/common/lists/helpers/compare'
import {assert} from '../../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../../main/common/test/Mocha'
import {allValues, shuffle} from '../src/helpers/common'

describe('common > main > lists > helpers > compare', function () {
	it('strict', function () {
		function testCompare(obj1, obj2) {
			assert.strictEqual(compareStrict(obj1, obj2), -1)
			assert.strictEqual(compareStrict(obj2, obj1), 1)
			assert.strictEqual(compareStrict(obj1, obj1), 0)
			assert.strictEqual(compareStrict(obj2, obj2), 0)
		}

		testCompare(-Infinity, -1)
		testCompare(-1, 0)
		testCompare(0, 1)
		testCompare(1, Infinity)
		testCompare(Infinity, NaN)
		testCompare(NaN, false)
		testCompare(false, '')
		testCompare('', {})
		testCompare([], {})
		testCompare({}, () => {})
		testCompare(() => {}, null)
		testCompare(null, undefined)

		testCompare(Infinity, NaN)
		testCompare(Number.NEGATIVE_INFINITY, Infinity)
		testCompare(-Infinity, Number.POSITIVE_INFINITY)
		testCompare(Number.NEGATIVE_INFINITY, 0)

		for (let i = 0; i < 100; i++) {
			testCompare([], [])
			testCompare({}, {})
			testCompare(() => {}, () => {})

			const array = shuffle(allValues)

			array.sort(compareStrict)
			assert.deepStrictEqual(array, [
				-Infinity,
				0,
				1,
				Infinity,
				NaN,
				false,
				true,
				'',
				'0',
				'1',
				'NaN',
				'false',
				'null',
				'true',
				'undefined',
				[],
				{},
				null,
				undefined
			])
		}
	})

	it('fast', function () {
		function testCompare(obj1, obj2) {
			const result = compareStrict(obj1, obj2)
			assert.ok(result === -1 || result === 1)
			assert.strictEqual(compareStrict(obj2, obj1), -result)
			assert.strictEqual(compareStrict(obj1, obj1), 0)
			assert.strictEqual(compareStrict(obj2, obj2), 0)
		}

		testCompare(-Infinity, -1)
		testCompare(-1, 0)
		testCompare(0, 1)
		testCompare(1, Infinity)
		testCompare(Infinity, NaN)
		testCompare(NaN, false)
		testCompare(false, '')
		testCompare('', {})
		testCompare([], {})
		testCompare({}, () => {})
		testCompare(() => {}, null)
		testCompare(null, undefined)

		testCompare(Infinity, NaN)
		testCompare(Number.NEGATIVE_INFINITY, Infinity)
		testCompare(-Infinity, Number.POSITIVE_INFINITY)
		testCompare(Number.NEGATIVE_INFINITY, 0)

		const arrayCheck = allValues.slice().sort(compareFast)

		for (let i = 0; i < 100; i++) {
			testCompare([], [])
			testCompare({}, {})
			testCompare(() => {}, () => {})

			const array = shuffle(allValues)

			array.sort(compareFast)
			// console.log(array)
			assert.deepStrictEqual(array, arrayCheck)
		}
	})
})
