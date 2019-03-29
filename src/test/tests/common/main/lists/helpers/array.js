import {binarySearch, binarySearchFirst, binarySearchLast} from '../../../../../../main/common/lists/helpers/array'

describe('common > main > lists > helpers > array', function () {
	it('binarySearch full', function () {
		const indexToItem = index => `item${(index + 2).toString().padStart(3, '0')}`
		const arr = new Array(51).fill(0).map((o, i) => indexToItem(i) + (i % 2 ? '_' : ''))
		for (let index = -2; index < arr.length + 2; index++) {
			const item = indexToItem(index)
			for (let bound = -1; bound < 1; bound++) {
				for (let start = -1; start <= Math.min(arr.length - 1, Math.max(0, index)); start++) {
					for (let end = arr.length; end >= Math.min(arr.length, index + 1); end--) {
						const result = binarySearch(
							arr,
							item,
							start < 0 ? null : start,
							end >= arr.length ? null : end,
							// eslint-disable-next-line no-nested-ternary
							index % 3 ? (o1, o2) => (o1 > o2 ? 1 : o1 < o2 ? -1 : 0) : null,
							bound
						)

						const log = JSON.stringify({
							index,
							start,
							end,
							bound
						})

						if (index < 0) {
							assert.strictEqual(result, ~0, log)
						} else if (index >= arr.length) {
							assert.strictEqual(result, ~arr.length, log)
						} else if (index % 2) {
							assert.strictEqual(result, ~index, log)
						} else {
							assert.strictEqual(result, index, log)
						}
					}
				}
			}
		}
	})

	it('binarySearch specific', function () {
		assert.strictEqual(binarySearch([], 0), ~0)
		assert.strictEqual(binarySearch([1], 0), ~0)
		assert.strictEqual(binarySearch([-1], 0), ~1)
		assert.strictEqual(binarySearch([0], 0), 0)
		assert.strictEqual(binarySearch([0, 1, 1, 1, 2], 1, null, null, null, -1), 1)
		assert.strictEqual(binarySearch([0, 1, 1, 1, 2], 1, null, null, null, 1), 3)
		assert.strictEqual(binarySearch([0, 0, 1, 1, 1, 2], 1, null, null, null, -1), 2)
		assert.strictEqual(binarySearch([0, 0, 1, 1, 1, 2], 1, null, null, null, 1), 4)
		assert.strictEqual(binarySearch([0, 0, 1, 1, 1], 1, null, null, null, -1), 2)
		assert.strictEqual(binarySearch([0, 0, 1, 1, 1], 1, null, null, null, 1), 4)
		assert.strictEqual(binarySearch([1, 1, 1], 1, null, null, null, -1), 0)
		assert.strictEqual(binarySearch([1, 1, 1], 1, null, null, null, 1), 2)
		assert.strictEqual(binarySearch([0], 0, 0, 0), ~0)
		assert.strictEqual(binarySearch([0], 0, 0, 1), 0)
	})
})
