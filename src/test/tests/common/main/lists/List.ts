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

	type TestFunc<T> = ((list: List<T>) => any) | TestFuncs<T>
	interface TestFuncs<T> extends Array<TestFunc<T>> { }

	interface ITestFuncsWithDescription<T> {
		funcs: TestFuncs<T>,
		description: string
	}
	type TestFuncsWithDescription<T> = TestFunc<T> | ITestFuncsWithDescription<T> | TestFuncsWithDescriptions<T>
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

	function testChange<T>(
		orig: T[],
		expected: T[]|(new () => Error),
		...testFuncsWithDescriptions: TestFuncsWithDescriptions<T>
	) {
		for (const testFuncsWithDescription of expandArray(testFuncsWithDescriptions)) {
			let {funcs, description} = testFuncsWithDescription
			if (typeof testFuncsWithDescription === 'function') {
				funcs = [testFuncsWithDescription]
				description = ''
			}

			for (const testFunc of expandArray(funcs)) {
				try {
					const list = new List({array: orig.slice()})

					assert.strictEqual(list.minAllocatedSize, undefined)
					assertList(list, orig)

					if (Array.isArray(expected)) {
						testFunc(list)

						assert.strictEqual(list.minAllocatedSize, undefined)
						assertList(list, expected)
					} else {
						assert.throws(() => testFunc(list), expected)

						assert.strictEqual(list.minAllocatedSize, undefined)
						assertList(list, orig)
					}
				} catch (ex) {
					console.log(`Error in: ${description}\n${testFunc.toString()}\n`)
					throw ex
				}
			}
		}
	}

	it('add', function() {
		function add<T>(
			item: T,
		): ITestFuncsWithDescription<T> {
			return {
				funcs: [
					list => list.add(item),
					list => list.set(list.size, item),
					list => list.insert(list.size, item),
					list => list.addArray([item]),
					list => list.addIterable(toIterable([item]), 1),
					list => list.insertArray(list.size, [item]),
					list => list.insertIterable(list.size, toIterable([item]), 1),
				],
				description: `add(${item})\n`,
			}
		}

		testChange(
			[],
			['0'],
			add('0'),
		)

		testChange(
			['0'],
			['0', '1'],
			add('1'),
		)
	})

	it('set', function() {
		function set<T>(
			index: number,
			item: T,
		): ITestFuncsWithDescription<T> {
			return {
				funcs: [
					list => list.set(index, item),
				],
				description: `add(${item})\n`,
			}
		}

		testChange(
			[],
			['0'],
			set(0, '0'),
			set(-1, '0'),
		)

		testChange(
			[],
			Error,
			set(1, '0'),
			set(-2, '0'),
		)

		testChange(
			['0'],
			['1'],
			set(0, '1'),
			set(-2, '1'),
		)

		testChange(
			['0'],
			Error,
			set(-3, '0'),
			set(2, '0'),
		)

		testChange(
			['0'],
			['0', '1'],
			set(1, '1'),
			set(-1, '1'),
		)

		testChange(
			['0', '1'],
			['2', '1'],
			set(0, '2'),
			set(-3, '2'),
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
		): ITestFuncsWithDescription<T> {
			return {
				funcs: [
					list => list.addArray(sourceItems, sourceStart, sourceEnd),
					list => list.insertArray(list.size, sourceItems, sourceStart, sourceEnd),
					!sourceStart
						&& sourceEnd != null
						&& sourceEnd >= 0
						&& [
							list => list.addIterable(sourceItems, sourceEnd),
							list => list.addIterable(toIterable(sourceItems), sourceEnd),
							list => list.insertIterable(list.size, sourceItems, sourceEnd),
							list => list.insertIterable(list.size, toIterable(sourceItems), sourceEnd),
						],
				],
				description: `arrArray(${JSON.stringify(sourceItems)}, ${sourceStart}, ${sourceEnd})\n`,
			}
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

	it('insertArray', function() {
		function insertArray<T>(
			index: number,
			sourceItems: T[],
			sourceStart?: number,
			sourceEnd?: number,
		): ITestFuncsWithDescription<T> {
			return {
				funcs: [
					list => list.insertArray(index, sourceItems, sourceStart, sourceEnd),
					!sourceStart
					&& sourceEnd != null
					&& sourceEnd >= 0
					&& [
						list => list.insertIterable(index, sourceItems, sourceEnd),
						list => list.insertIterable(index, toIterable(sourceItems), sourceEnd),
					],
				],
				description: `insertArray(${JSON.stringify(sourceItems)}, ${sourceStart}, ${sourceEnd})\n`,
			}
		}

		testChange(
			['0'],
			['1', '2', '0'],
			insertArray(0, ['1', '2']),
			insertArray(0, ['1', '2'], 0, 2),
			insertArray(0, ['1', '2'], -2, -1),
			insertArray(0, ['1', '2', '3'], null, 2),
			insertArray(0, ['1', '2', '3'], null, -2),
			insertArray(0, ['1', '2', '3'], 0, 2),
			insertArray(0, ['1', '2', '3'], 0, -2),
			insertArray(0, ['1', '2', '3'], -3, 2),
			insertArray(0, ['1', '2', '3'], -3, -2),
		)

		testChange(
			['0', '1', '2', '3'],
			['0', '1', '4', '5', '2', '3'],
			insertArray(2, ['4', '5']),
			insertArray(2, ['4', '5'], 0, 2),
			insertArray(2, ['4', '5'], -2, -1),
			insertArray(2, ['4', '5', '6'], null, 2),
			insertArray(2, ['4', '5', '6'], null, -2),
			insertArray(2, ['4', '5', '6'], 0, 2),
			insertArray(2, ['4', '5', '6'], 0, -2),
			insertArray(2, ['4', '5', '6'], -3, 2),
			insertArray(2, ['4', '5', '6'], -3, -2),
		)
	})
})
