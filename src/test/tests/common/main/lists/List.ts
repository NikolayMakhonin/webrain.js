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
		try {
			assert.strictEqual(1, 2)
		} catch (ex) {
			console.log('qweqwe')
			throw ex
		}

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

	type TestFunc<T> = ((list: List<T>) => any) | TestFuncs<T>
	interface TestFuncs<T> extends Array<TestFunc<T>> { }

	interface ITestFuncsWithDescription<T> {
		funcs: TestFuncs<T>,
		description: string
	}
	type TestFuncsWithDescription<T> = ITestFuncsWithDescription<T> | TestFuncsWithDescriptions<T>
	interface TestFuncsWithDescriptions<T> extends Array<TestFuncsWithDescription<T>> { }

	function expandArray<T>(array: T[], output: any[] = []): any[] {
		for (const item of array) {
			if (!item) {
				continue
			}

			if (Array.isArray(item)) {
				expandArray(item, output)
			} else {
				output.push(item)
			}
		}

		return output
	}

	function *toIterable<T>(array: T[]): Iterable<T> {
		for (const item of array) {
			yield item
		}
	}

	function assertList<T>(list: List<T>, expectedArray: T[], description: string) {
		assert.deepStrictEqual(list.toArray(), expectedArray, description)
		assert.strictEqual(list.size, expectedArray.length, description)
		assert.ok(list.allocatedSize >= expectedArray.length, description)

		for (let i = 0; i < expectedArray.length; i++) {
			assert.strictEqual(list.get(i), expectedArray[i], description)
		}

		{
			let i = 0
			for (const item of list) {
				assert.strictEqual(item, expectedArray[i++], description)
			}
		}
	}

	function testChange<T>(
		orig: T[],
		expected: T[]|(new () => Error),
		...testFuncsWithDescriptions: TestFuncsWithDescriptions<T>
	) {
		for (const {testFuncs, description} of expandArray(testFuncsWithDescriptions)) {
			for (const testFunc of expandArray(testFuncs)) {
				const descriptionWithFunc = description + '\n' + testFunc.toString() + '\n'
				const list = new List({array: orig.slice()})

				assert.strictEqual(list.minAllocatedSize, undefined, descriptionWithFunc)
				assertList(list, orig, descriptionWithFunc)

				if (Array.isArray(expected)) {
					testFunc(list)

					assert.strictEqual(list.minAllocatedSize, undefined, descriptionWithFunc)
					assertList(list, expected, descriptionWithFunc)
				} else {
					assert.throws(() => testFunc(list), expected, descriptionWithFunc)

					assert.strictEqual(list.minAllocatedSize, undefined, descriptionWithFunc)
					assertList(list, orig, descriptionWithFunc)
				}
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

	it('get', function() {
		testChange(
			[],
			Error,
			list => list.get(0),
			list => list.get(1),
			list => list.get(-1),
		)

		testChange(
			['0'],
			Error,
			list => list.get(1),
			list => list.get(2),
			list => list.get(-2),
			list => list.get(-3),
		)
	})

	it('addArray', function() {
		function addArray<T>(
			sourceItems: T[],
			sourceStart?: number,
			sourceEnd?: number,
		): TestFuncs<T> {
			return [
				list => list.addArray(sourceItems, sourceStart, sourceEnd),
				!sourceStart && sourceEnd != null && (list => list.addIterable(sourceItems, sourceEnd)),
			].map(o => [
				o,
				`Error in arrArray(${JSON.stringify(sourceItems)}, ${sourceStart}, ${sourceEnd})\n`,
			])
		}

		testChange(
			[],
			[],
			addArray([]),
			addArray(['0'], 1),
			addArray(['0'], 2),
			addArray(['0'], null, 0),
			addArray(['0'], null, -2),
			addArray(['0'], null, -3),
		)

		testChange(
			[],
			['0'],
			addArray(['0']),
			addArray(['0'], 0),
			addArray(['0'], -1),
			addArray(['0'], null, 1),
			addArray(['0'], null, -1),
		)

		testChange(
			[],
			Error,
			addArray(['0'], -2),
			addArray(['0'], null, 2),
		)

		testChange(
			['0'],
			['0', '1', '2', '3'],
			addArray(['1', '2', '3']),
			addArray(['1', '2', '3'], 0, 3),
			addArray(['1', '2', '3'], -3, -1),
		)

		testChange(
			['0'],
			['0', '1', '2'],
			addArray(['1', '2', '3'], null, 2),
			addArray(['1', '2', '3'], null, -2),
			addArray(['1', '2', '3'], 0, 2),
			addArray(['1', '2', '3'], 0, -2),
			addArray(['1', '2', '3'], -3, 2),
			addArray(['1', '2', '3'], -3, -2),
		)

		testChange(
			['0'],
			['0', '2', '3'],
			addArray(['1', '2', '3'], 1, null),
			addArray(['1', '2', '3'], -2, null),
			addArray(['1', '2', '3'], 1, -1),
			addArray(['1', '2', '3'], -2, -1),
			addArray(['1', '2', '3'], 1, 3),
			addArray(['1', '2', '3'], -2, 3),
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
