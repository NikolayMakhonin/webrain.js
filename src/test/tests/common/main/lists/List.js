import {List} from '../../../../../main/common/lists/List'

describe('common > main > lists > List', function () {
	function generateArray(size) {
		const arr = []
		for (let i = 0; i < size; i++) {
			arr.push(i)
		}

		return arr
	}

	it('constructor', function () {
		let list

		list = new List()
		assert.strictEqual(list.size, 0)
		assert.strictEqual(list.minAllocatedSize, undefined)
		assert.strictEqual(list.allocatedSize, 0)
		assert.deepStrictEqual(list.toArray(), [])

		list = new List({
			minAllocatedSize: 3
		})
		assert.strictEqual(list.size, 0)
		assert.strictEqual(list.minAllocatedSize, 3)
		assert.strictEqual(list.allocatedSize, 0)
		assert.deepStrictEqual(list.toArray(), [])

		const array = [0, 1, 2]
		list = new List({
			array
		})
		assert.strictEqual(list.size, 3)
		assert.strictEqual(list.minAllocatedSize, undefined)
		assert.strictEqual(list.allocatedSize, 3)
		const toArray = list.toArray()
		assert.deepStrictEqual(toArray, [0, 1, 2])
		assert.notStrictEqual(toArray, array)
	})

	it('size', function () {
		const array = generateArray(31)
		const list = new List({
			array,
			minAllocatedSize: 30
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
})
