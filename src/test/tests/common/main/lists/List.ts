import {List} from '../../../../../main/common/lists/List'

declare const assert: any

describe('common > main > lists > List', function() {
	function generateArray(size) {
		const arr = []
		for (let i = 0; i < size; i++) {
			arr.push(i)
		}

		return arr
	}

	it('constructor', function() {
		let list

		list = new List()
		assert.strictEqual(list.size, 0)
		assert.strictEqual(list.minAllocatedSize, undefined)
		assert.strictEqual(list.allocatedSize, 0)
		assert.deepStrictEqual(list.toArray(), [])

		list = new List({
			minAllocatedSize: 3,
		})
		assert.strictEqual(list.size, 0)
		assert.strictEqual(list.minAllocatedSize, 3)
		assert.strictEqual(list.allocatedSize, 0)
		assert.deepStrictEqual(list.toArray(), [])

		const array = [0, 1, 2]
		list = new List({
			array,
		})
		assert.strictEqual(list.size, 3)
		assert.strictEqual(list.minAllocatedSize, undefined)
		assert.strictEqual(list.allocatedSize, 3)
		const toArray = list.toArray()
		assert.deepStrictEqual(toArray, [0, 1, 2])
		assert.notStrictEqual(toArray, array)
	})

	it('size', function() {
		const array = generateArray(31)
		const list = new List({
			array,
			minAllocatedSize: 30,
		})

		assert.strictEqual(list.size, 31)
		assert.strictEqual(list.allocatedSize, 31)

		list.removeRange(-1)
		assert.strictEqual(list.size, 30)
		assert.strictEqual(list.allocatedSize, 31)

		list.removeRange(-1)
		assert.strictEqual(list.size, 29)
		assert.strictEqual(list.allocatedSize, 31)

		list.addArray([1, 2, 3, 4])
		assert.strictEqual(list.size, 33)
		assert.strictEqual(list.allocatedSize, 33)

		list.removeRange(-2)
		assert.strictEqual(list.size, 31)
		assert.strictEqual(list.allocatedSize, 33)

		list.removeRange(-2)
		assert.strictEqual(list.size, 29)
		assert.strictEqual(list.allocatedSize, 33)

		list.removeRange(-12)
		assert.strictEqual(list.size, 17)
		assert.strictEqual(list.allocatedSize, 33)

		list.removeRange(-1)
		assert.strictEqual(list.size, 16)
		assert.strictEqual(list.allocatedSize, 32)

		list.removeRange(-7)
		assert.strictEqual(list.size, 9)
		assert.strictEqual(list.allocatedSize, 32)

		list.removeRange(-1)
		assert.strictEqual(list.size, 8)
		assert.strictEqual(list.allocatedSize, 32)

		list.clear()
		assert.strictEqual(list.size, 0)
		assert.strictEqual(list.allocatedSize, 32)

		list.minAllocatedSize = 17
		assert.strictEqual(list.allocatedSize, 32)

		list.minAllocatedSize = 16
		assert.strictEqual(list.allocatedSize, 16)

		list.minAllocatedSize = 15
		assert.strictEqual(list.allocatedSize, 16)

		list.minAllocatedSize = 0
		assert.strictEqual(list.allocatedSize, 4)
	})

	function assertList<T>(list: List<T>, expectedArray: T[]) {
		assert.deepStrictEqual(list.toArray(), expectedArray)
		assert.strictEqual(list.size, expectedArray.length)
		assert.ok(list.allocatedSize >= expectedArray.length)

		for (let i = 0; i < expectedArray.length; i++) {
			assert.strictEqual(list.get(i), expectedArray[i])
		}

		{
			let i = 0
			for (const item of list) {
				assert.strictEqual(item, expectedArray[i++])
			}
		}
	}

	function testChange<T>(orig: T[], expected: T[]|(new () => Error), ...changeFuncs: ((list: List<T>) => any)[]) {
		for (const changeFunc of changeFuncs) {
			const list = new List({array: orig.slice()})

			assert.strictEqual(list.minAllocatedSize, undefined)
			assertList(list, orig)

			if (Array.isArray(expected)) {
				changeFunc(list)

				assert.strictEqual(list.minAllocatedSize, undefined)
				assertList(list, expected)
			} else {
				assert.throws(() => changeFunc(list), expected)

				assert.strictEqual(list.minAllocatedSize, undefined)
				assertList(list, orig)
			}
		}
	}

	it('add', function() {
		testChange(
			[],
			['0'],
			list => list.add('0'),
		)

		testChange(
			['0'],
			['0', '1'],
			list => list.add('1'),
		)
	})

	it('set', function() {
		testChange(
			[],
			['0'],
			list => list.set(0, '0'),
			list => list.set(-1, '0'),
		)

		testChange(
			[],
			Error,
			list => list.set(1, '0'),
			list => list.set(-2, '0'),
		)

		testChange(
			['0'],
			['1'],
			list => list.set(0, '1'),
			list => list.set(-2, '1'),
		)

		testChange(
			['0'],
			Error,
			list => list.set(-3, '0'),
			list => list.set(2, '0'),
		)

		testChange(
			['0'],
			['0', '1'],
			list => list.set(1, '1'),
			list => list.set(-1, '1'),
		)

		testChange(
			['0', '1'],
			['2', '1'],
			list => list.set(0, '2'),
			list => list.set(-3, '2'),
		)
	})

	// it('add / remove', function () {
	// 	const list = new List()
	//
	// 	assert.deepStrictEqual(list.toArray(), [])
	// 	assert.strictEqual(list.size, 0)
	//
	// 	list.add('0')
	// 	assert.deepStrictEqual(list.toArray(), ['0'])
	// 	assert.strictEqual(list.size, 1)
	//
	// 	assert.throws(() => list.removeAt(1), Error)
	// 	assert.throws(() => list.removeAt(-2), Error)
	// 	assert.strictEqual(list.size, 1)
	//
	// 	list.removeAt(-1)
	// 	assert.deepStrictEqual(list.toArray(), [])
	// 	assert.strictEqual(list.size, 0)
	//
	// 	assert.throws(() => list.removeAt(-1), Error)
	// 	assert.throws(() => list.removeAt(0), Error)
	// 	assert.strictEqual(list.size, 0)
	//
	// 	assert.throws(() => list.insert(1, '0'), Error)
	// 	assert.throws(() => list.insert(-2, '0'), Error)
	//
	// 	list.insert(-1, '0')
	// 	assert.deepStrictEqual(list.toArray(), ['0'])
	// 	assert.strictEqual(list.size, 1)
	//
	// 	list.insert(-1, '1')
	// 	assert.deepStrictEqual(list.toArray(), ['0', '1'])
	// 	assert.strictEqual(list.size, 2)
	//
	// 	list.removeAt(-1)
	// 	assert.deepStrictEqual(list.toArray(), ['0'])
	// 	assert.strictEqual(list.size, 1)
	//
	// 	list.removeAt(0)
	// 	assert.deepStrictEqual(list.toArray(), [])
	// 	assert.strictEqual(list.size, 0)
	// })
	//
	// it('add array / remove range', function () {
	// 	const list = new List()
	//
	// 	assert.deepStrictEqual(list.toArray(), [])
	// 	assert.strictEqual(list.size, 0)
	//
	// 	list.addArray(['0', '1', '2'])
	// 	assert.deepStrictEqual(list.toArray(), ['0', '1', '2'])
	// 	assert.strictEqual(list.size, 3)
	//
	// 	assert.throws(() => list.removeRange(null, 4), Error)
	// 	assert.throws(() => list.removeRange(-4, null), Error)
	// 	assert.throws(() => list.removeRange(-4, 4), Error)
	// 	// assert.throws(() => list.removeRange(-4, null), Error)
	// 	// assert.throws(() => list.removeRange(-4, 4), Error)
	// 	assert.strictEqual(list.size, 3)
	//
	// 	list.removeRange(null, -5)
	// 	assert.strictEqual(list.size, 3)
	//
	// 	list.removeRange(null, -4)
	// 	assert.strictEqual(list.size, 3)
	//
	// 	list.removeRange(3, null)
	// 	assert.strictEqual(list.size, 3)
	//
	// 	list.removeRange(4, null)
	// 	assert.strictEqual(list.size, 3)
	//
	// 	list.removeRange(3, -4)
	// 	assert.strictEqual(list.size, 3)
	// 	assert.deepStrictEqual(list.toArray(), ['0', '1', '2'])
	//
	// 	list.removeRange(-3, -1)
	// 	assert.deepStrictEqual(list.toArray(), [])
	// 	assert.strictEqual(list.size, 0)
	//
	// 	list.addArray(['0', '1', '2'])
	// 	list.insertArray(1, ['3', '4'])
	// 	assert.deepStrictEqual(list.toArray(), ['0', '3', '4', '1', '2'])
	// 	assert.strictEqual(list.size, 5)
	//
	// 	list.removeRange(0, 2)
	// 	assert.deepStrictEqual(list.toArray(), ['4', '1', '2'])
	// 	assert.strictEqual(list.size, 3)
	//
	// 	list.insertArray(3, ['5', '6'])
	// 	assert.deepStrictEqual(list.toArray(), ['4', '1', '2', '5', '6'])
	// 	assert.strictEqual(list.size, 5)
	//
	// 	list.removeRange(0, 2, false)
	// 	assert.deepStrictEqual(list.toArray(), ['5', '6', '2'])
	// 	assert.strictEqual(list.size, 3)
	//
	// 	list.addIterable(['7', '8', '9'], 2)
	// 	assert.deepStrictEqual(list.toArray(), ['5', '6', '2', '7', '8'])
	// 	assert.strictEqual(list.size, 5)
	//
	// 	list.insertIterable(4, ['a', 'b', 'c'], 2)
	// 	assert.deepStrictEqual(list.toArray(), ['5', '6', '2', '7', 'a', 'b', '8'])
	// 	assert.strictEqual(list.size, 7)
	//
	// 	list.removeAt(0)
	// 	assert.deepStrictEqual(list.toArray(), ['6', '2', '7', 'a', 'b', '8'])
	// 	assert.strictEqual(list.size, 6)
	//
	// 	list.removeAt(-1)
	// 	assert.deepStrictEqual(list.toArray(), ['6', '2', '7', 'a', 'b'])
	// 	assert.strictEqual(list.size, 5)
	//
	// 	list.removeRange(4, 5)
	// 	assert.deepStrictEqual(list.toArray(), ['6', '2', '7', 'a'])
	// 	assert.strictEqual(list.size, 4)
	//
	// 	list.addArray(['d', 'e', 'f', 'g'], 1, 3)
	// 	assert.deepStrictEqual(list.toArray(), ['6', '2', '7', 'a', 'e', 'f'])
	// 	assert.strictEqual(list.size, 6)
	//
	// 	list.removeRange(2, 4, false)
	// 	assert.deepStrictEqual(list.toArray(), ['6', '2', 'e', 'f'])
	// 	assert.strictEqual(list.size, 4)
	//
	// 	list.insertArray(1, ['h', 'i', 'j', 'k'], 1, 3)
	// 	assert.deepStrictEqual(list.toArray(), ['6', 'i', 'j', '2', 'e', 'f'])
	// 	assert.strictEqual(list.size, 6)
	//
	// 	// list.removeAt(-1)
	// 	// assert.deepStrictEqual(list.toArray(), [])
	// 	// assert.strictEqual(list.size, 0)
	// 	//
	// 	// assert.throws(() => list.removeAt(-1), Error)
	// 	// assert.throws(() => list.removeAt(0), Error)
	// 	// assert.strictEqual(list.size, 0)
	// 	//
	// 	// assert.throws(() => list.insert(1, '0'), Error)
	// 	// assert.throws(() => list.insert(-2, '0'), Error)
	// 	//
	// 	// list.insert(-1, '0')
	// 	// assert.deepStrictEqual(list.toArray(), ['0'])
	// 	// assert.strictEqual(list.size, 1)
	// 	//
	// 	// list.insert(-1, '1')
	// 	// assert.deepStrictEqual(list.toArray(), ['0', '1'])
	// 	// assert.strictEqual(list.size, 2)
	// 	//
	// 	// list.removeAt(-1)
	// 	// assert.deepStrictEqual(list.toArray(), ['0'])
	// 	// assert.strictEqual(list.size, 1)
	// 	//
	// 	// list.removeAt(0)
	// 	// assert.deepStrictEqual(list.toArray(), [])
	// 	// assert.strictEqual(list.size, 0)
	// })
})
