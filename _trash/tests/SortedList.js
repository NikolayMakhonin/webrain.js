import {SortedList} from '../lists/SortedList'

describe('common > main > lists > SortedList', function () {
	xit('constructor', function () {
		let list = new SortedList()
		assert.strictEqual(Object.keys(list).length, 3, JSON.stringify(list))

		list = new SortedList({autoSort: true})
		assert.strictEqual(Object.keys(list).length, 4, JSON.stringify(list))
		assert.strictEqual(list.autoSort, true)

		const compare = () => {}
		list = new SortedList({compare})
		assert.strictEqual(Object.keys(list).length, 4, JSON.stringify(list))
		assert.strictEqual(list.compare, compare)

		list = new SortedList({notAddIfExists: true})
		assert.strictEqual(Object.keys(list).length, 4, JSON.stringify(list))
		assert.strictEqual(list.notAddIfExists, true)
	})

	it('indexOf', function () {
		function testIndexOf(array, item, countSorted, start, end, expectedFirstIndex, expectedLastIndex) {
			for (let notUsedLast = 0; notUsedLast < 1; notUsedLast++) {
				if (notUsedLast) {
					array = array.concat([item])
				}

				const list = new SortedList({
					list: array
				})
				list._list = array
				list._count = array.length

				if (notUsedLast) {
					list._count--
				}

				list._countSorted = countSorted == null
					? list._count
					: countSorted

				assert.strictEqual(list.indexOf(item, start, end, -1), expectedFirstIndex)
				assert.strictEqual(list.firstIndexOf(item, start, end), expectedFirstIndex)

				assert.strictEqual(list.indexOf(item, start, end, 1), expectedLastIndex)
				assert.strictEqual(list.lastIndexOf(item, start, end), expectedLastIndex)

				const index = list.indexOf(item, start, end)

				if (index >= 0) {
					assert.ok(index >= expectedFirstIndex)
					assert.ok(index <= expectedLastIndex)
				} else {
					assert.ok(~index >= ~expectedFirstIndex)
					assert.ok(~index <= ~expectedLastIndex)
				}
			}
		}

		testIndexOf([], 0, null, null, null, ~0, ~0)
		testIndexOf([0], 0, null, null, null, 0, 0)
		testIndexOf([0], 0, null, null, 0, ~0, ~0)
		testIndexOf([0], 0, null, 1, null, ~1, ~1)
		testIndexOf([0, 1, 1, 1, 2], 1, null, null, null, 1, 3)
		testIndexOf([0, 1, 2, 1, 2], 1, 2, null, null, 1, 3)
		testIndexOf([0, 1, 2, 1, 2], 2, 2, null, null, 2, 4)
		testIndexOf([0, 1, 3, 3, 1, 3, 3], 3, 3, null, null, 2, 6)
		testIndexOf([0, 1, 3, 3, 1, 3, 3], 2, 3, null, null, ~2, ~7)
		testIndexOf([0, 1, 3, 3, 1, 3, 3], 2, 4, 3, 6, ~3, ~6)
	})

	it('insert', function () {
		function testInsert(array, index, item, countSorted, autoSort, expectedResult, expectedArray) {
			for (let notUsedLast = 0; notUsedLast < 1; notUsedLast++) {
				for (let useAdd = 0; useAdd < 1; useAdd++) {
					if (useAdd && !autoSort && index !== array.length) {
						continue
					}

					if (notUsedLast) {
						array = array.concat([item])
					}

					const list = new SortedList({
						list: array
					})
					list._list = array.slice()
					list._count = array.length

					if (notUsedLast) {
						list._count--
					}

					list._autoSort = autoSort
					list._countSorted = countSorted == null
						? list._count
						: countSorted

					if (useAdd) {
						assert.strictEqual(list.add(item), expectedResult)
					} else {
						assert.strictEqual(list.insert(index, item), expectedResult)
					}
					assert.strictEqual(list.toArray(), expectedArray)
				}
			}
		}

		testInsert()
	})
	
	it('autoSort', function () {
		const list = new SortedList({
			autoSort: true,
			list    : [5, 3, 2, 4, 1],
		})
		assert.deepStrictEqual(list, [1, 2, 3, 4, 5])
		list.remove(2)
		assert.strictEqual(list.countSorted, 4)
		assert.deepStrictEqual(list, [1, 3, 4, 5])
		list.remove(5)
		assert.strictEqual(list.countSorted, 3)
		assert.deepStrictEqual(list, [1, 3, 4])
		list.removeAt(0)
		assert.strictEqual(list.countSorted, 2)
		assert.deepStrictEqual(list, [3, 4])
		list.add(1)
		assert.strictEqual(list.countSorted, 3)
		assert.deepStrictEqual(list, [1, 3, 4])
		list.addAll([0, 5, 2, 3])
		assert.strictEqual(list.countSorted, 7)
		assert.deepStrictEqual(list, [0, 1, 2, 3, 3, 4, 5])
		list[3] = 7
		assert.strictEqual(list.countSorted, 7)
		list[3] = -1
		assert.strictEqual(list.countSorted, 7)
		assert.deepStrictEqual(list, [-1, 0, 1, 2, 4, 5, 7])
	})
})
