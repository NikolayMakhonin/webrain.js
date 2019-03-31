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
			assert.strictEqual(expectedArray[list.indexOf(expectedArray[i])], expectedArray[i])
			assert.strictEqual(list.contains(expectedArray[i]), true)
			assert.strictEqual(list.contains({} as any), false)
		}

		assert.deepStrictEqual(Array.from(list), expectedArray)
	}

	function testChange<T>(
		orig: T[],
		expected: T[]|(new () => Error),
		funcResult: any,
		defaultValue: any,
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
					const array = orig.slice()
					const list = new List({array})

					assert.strictEqual(list.minAllocatedSize, undefined)
					assertList(list, orig)

					if (Array.isArray(expected)) {
						assert.deepStrictEqual(testFunc(list), funcResult)

						assert.strictEqual(list.minAllocatedSize, undefined)
						assertList(list, expected)
					} else {
						assert.throws(() => testFunc(list), expected)

						assert.strictEqual(list.minAllocatedSize, undefined)
						assertList(list, orig)
					}

					assert.deepStrictEqual(array.slice(0, list.size), list.toArray())
					for (let i = list.size; i < array.length; i++) {
						assert.strictEqual(array[i], defaultValue)
					}
				} catch (ex) {
					console.log(`Error in: ${description}\n${testFunc.toString()}\n`)
					throw ex
				}
			}
		}
	}

	it('get', function() {
		testChange(
			[],
			Error, null, null,
			list => list.get(0),
			list => list.get(1),
			list => list.get(-1),
		)

		testChange(
			['0'],
			Error, null, null,
			list => list.get(1),
			list => list.get(2),
			list => list.get(-2),
			list => list.get(-3),
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
				description: `set(${index}, ${JSON.stringify(item)})\n`,
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
				description: `add(${JSON.stringify(item)})\n`,
			}
		}

		testChange(
			[],
			['0'],
			true, null,
			add('0'),
		)

		testChange(
			['0'],
			['0', '1'],
			true, null,
			add('1'),
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
			false, null,
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
			true, null,
			addArray(['0']),
			addArray(['0'], 0),
			addArray(['0'], -1),
			addArray(['0'], null, 1),
			addArray(['0'], null, -1),
		)

		testChange(
			[],
			Error,
			null, null,
			addArray(['0'], -2),
			addArray(['0'], null, 2),
		)

		testChange(
			['0'],
			['0', '1', '2', '3'],
			true, null,
			addArray(['1', '2', '3']),
			addArray(['1', '2', '3'], 0, 3),
			addArray(['1', '2', '3'], -3, -1),
		)

		testChange(
			['0'],
			['0', '1', '2'],
			true, null,
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
			true, null,
			addArray(['1', '2', '3'], 1, null),
			addArray(['1', '2', '3'], -2, null),
			addArray(['1', '2', '3'], 1, -1),
			addArray(['1', '2', '3'], -2, -1),
			addArray(['1', '2', '3'], 1, 3),
			addArray(['1', '2', '3'], -2, 3),
		)
	})

	it('insert', function() {
		function insert<T>(
			index: number,
			item: T,
		): ITestFuncsWithDescription<T> {
			return {
				funcs: [
					list => list.insert(index, item),
					list => list.insertArray(index, [item]),
					list => list.insertIterable(index, toIterable([item]), 1),
				],
				description: `insert(${index}, ${JSON.stringify(item)})\n`,
			}
		}

		testChange(
			[],
			['0'],
			true, null,
			insert(0, '0'),
			insert(-1, '0'),
		)

		testChange(
			[],
			Error,
			null, null,
			insert(1, '0'),
			insert(-2, '0'),
		)

		testChange(
			['0'],
			['0', '1'],
			true, null,
			insert(1, '1'),
			insert(-1, '1'),
		)

		testChange(
			['0'],
			Error,
			null, null,
			insert(2, '1'),
			insert(-3, '1'),
		)

		testChange(
			['0', '1', '2'],
			['0', '3', '1', '2'],
			true, null,
			insert(1, '3'),
			insert(-3, '3'),
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
				description: `insertArray(${index}, ${JSON.stringify(sourceItems)}, ${sourceStart}, ${sourceEnd})\n`,
			}
		}

		testChange(
			['0'],
			['1', '2', '0'],
			true, null,
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
			['0', '1', '2', '3', '4'],
			['0', '1', '4', '5', '2', '3', '4'],
			true, null,
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

	it('remove', function() {
		function remove<T>(
			item: T,
		): ITestFuncsWithDescription<T> {
			return {
				funcs: [
					list => list.remove(item),
				],
				description: `remove(${JSON.stringify(item)})\n`,
			}
		}

		testChange(
			[],
			[],
			false, null,
			remove('0'),
		)

		testChange(
			['0'],
			[],
			true, null,
			remove('0'),
		)

		testChange(
			['0', '1', '2'],
			['1', '2'],
			true, null,
			remove('0'),
		)

		testChange(
			['0', '1', '2'],
			['0', '2'],
			true, null,
			remove('1'),
		)

		testChange(
			['0', '1', '2'],
			['0', '1', '2'],
			false, null,
			remove('3'),
		)

		testChange(
			[0, 1, 2],
			[0, 2],
			true, 0,
			remove(1),
		)

		testChange(
			[true, true],
			[true],
			true, false,
			remove(true),
		)

		testChange(
			['', 0, true],
			['', 0],
			true, 0,
			remove(true),
		)
	})

	it('removeAt', function() {
		function removeAt<T>(
			index: number,
			withoutShift?: boolean,
		): ITestFuncsWithDescription<T> {
			return {
				funcs: [
					list => list.removeAt(index, withoutShift),
				],
				description: `removeAt(${index})\n`,
			}
		}

		testChange(
			[],
			Error,
			null, null,
			removeAt(0),
			removeAt(-1),
		)

		testChange(
			['0'],
			Error,
			null, null,
			removeAt(1),
			removeAt(-2),
		)

		testChange(
			['0'],
			[],
			'0', null,
			removeAt(0),
			removeAt(-1),
		)

		testChange(
			[0, 1, 2, 3],
			[0, 2, 3],
			1, 0,
			removeAt(1),
			removeAt(-3),
		)

		testChange(
			['0', '1', '2', '3'],
			['0', '3', '2'],
			'1', null,
			removeAt(1, true),
			removeAt(-3, true),
		)
	})

	it('removeRange', function() {
		function removeRange<T>(
			start: number,
			end?: number,
			withoutShift?: boolean,
		): ITestFuncsWithDescription<T> {
			return {
				funcs: [
					list => list.removeRange(start, end, withoutShift),
				],
				description: `removeRange(${start}, ${end}, ${withoutShift})\n`,
			}
		}

		testChange(
			[],
			[],
			false, null,
			removeRange(0),
			removeRange(0, 0),
		)

		testChange(
			[],
			Error,
			null, null,
			removeRange(-1),
			removeRange(0, 1),
		)

		testChange(
			['0'],
			[],
			true, null,
			removeRange(0),
			removeRange(-1),
			removeRange(0, 1),
			removeRange(-1, 1),
			removeRange(0, -1),
			removeRange(-1, -1),
		)

		testChange(
			['0'],
			['0'],
			false, null,
			removeRange(1),
			removeRange(0, 0),
			removeRange(1, 0),
			removeRange(0, -2),
			removeRange(-1, -2),
		)

		testChange(
			[0, 1, 2, 3, 4, true],
			[0, 4, true],
			true, false,
			removeRange(1, 4),
			removeRange(-5, -3),
		)

		testChange(
			[0, 1, 2, 3, 4, null],
			[0, 4, null],
			true, null,
			removeRange(1, 4),
			removeRange(-5, -3),
		)

		testChange(
			[0, 1, 2, 3, 4, undefined],
			[0, 4, undefined],
			true, undefined,
			removeRange(1, 4),
			removeRange(-5, -3),
		)

		testChange(
			['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
			['0', '1', '7', '8', '9', '5', '6'],
			true, null,
			removeRange(2, 5, true),
		)
	})

	it('clear', function() {
		function clear<T>(): ITestFuncsWithDescription<T> {
			return {
				funcs: [
					list => list.clear(),
					list => list.removeRange(0, list.size),
				],
				description: 'clear()\n',
			}
		}

		testChange(
			[],
			[],
			false, null,
			clear(),
		)

		testChange(
			['0'],
			[],
			true, null,
			clear(),
		)

		testChange(
			[0, 1, 2],
			[],
			true, 0,
			clear(),
		)

		testChange(
			[0, 1, 2, true],
			[],
			true, 0,
			clear(),
		)

		testChange(
			[true, 0, 1, 2],
			[],
			true, false,
			clear(),
		)
	})

	it('toArray', function() {
		function toArray<T>(
			start?: number,
			end?: number,
		): ITestFuncsWithDescription<T> {
			return {
				funcs: [
					list => list.toArray(start, end),
					list => {
						const result = []
						list.copyTo(result, null, start, end)
						return result
					},
				],
				description: `toArray(${start}, ${end})\n`,
			}
		}

		testChange(
			[],
			[],
			[], null,
			toArray(),
		)

		testChange(
			['0'],
			['0'],
			['0'], null,
			toArray(),
		)

		testChange(
			['0', '1'],
			['0', '1'],
			['0'], null,
			toArray(0, 1),
			toArray(null, 1),
			toArray(-2, 1),
			toArray(-2, -2),
		)

		testChange(
			['0', '1'],
			['0', '1'],
			['1'], null,
			toArray(1, 2),
			toArray(-1, 2),
			toArray(1, -1),
			toArray(-1, -1),
		)

		testChange(
			['0', '1', '2', '3'],
			['0', '1', '2', '3'],
			['1', '2'], null,
			toArray(1, 3),
			toArray(-3, 3),
			toArray(1, -2),
			toArray(-3, -2),
		)
	})

	it('copyTo', function() {
		function copyTo<T>(
			result: boolean,
			destArray: T[],
			destIndex?: number,
			start?: number,
			end?: number,
		): ITestFuncsWithDescription<T> {
			return {
				funcs: [
					list => {
						assert.strictEqual(list.copyTo(destArray, destIndex, start, end), result)
						return destArray
					},
				],
				description: `copyTo(${JSON.stringify(destArray)}, ${destIndex}, ${start}, ${end})\n`,
			}
		}

		testChange(
			[],
			[],
			[], null,
			copyTo(false, []),
		)

		testChange(
			[],
			Error,
			null, null,
			copyTo(false, [], null, -1),
			copyTo(false, [], null, null, 1),
		)

		testChange(
			['0'],
			Error,
			null, null,
			copyTo(false, [], null, -2),
			copyTo(false, [], null, null, 2),
		)

		testChange(
			['0', '1', '2'],
			Error,
			['0', '1'], null,
			copyTo(false, [], null, null, 2),
			copyTo(false, [], null, 0, 2),
			copyTo(false, [], null, -3, 2),
			copyTo(false, [], null, -3, -2),
		)

		testChange(
			['0', '1', '2'],
			Error,
			['1', '2'], null,
			copyTo(false, [], null, 1, null),
			copyTo(false, [], null, 1, 2),
			copyTo(false, [], null, -2, null),
			copyTo(false, [], null, -2, -1),
		)

		testChange(
			['0', '1', '2'],
			Error,
			['0', '1', '2', '1', '2'], null,
			copyTo(false, ['0', '1', '2', '3'], 3, 1, null),
		)
	})

	it('indexOf', function() {
		testChange(
			['b', 'd', 'f', 'h', 'j', 'l'],
			['b', 'd', 'f', 'h', 'j', 'l'],
			~6, null,
			list => list.indexOf('a'),
			list => list.indexOf('a', 0),
			list => list.indexOf('a', 0, 1),
			list => list.indexOf('a', 0, 1, -1),
			list => list.indexOf('a', 0, 1, 1),
		)

		testChange(
			[],
			Error,
			null, null,
			list => list.indexOf('a', -1),
			list => list.indexOf('a', null, 1),
		)

		testChange(
			['b', 'd', 'd', 'd', 'j', 'l'],
			['b', 'd', 'd', 'd', 'j', 'l'],
			1, null,
			list => list.indexOf('d'),
			list => list.indexOf('d', 1),
			list => list.indexOf('d', 1, 2),
			list => list.indexOf('d', 1, 6, -1),
			list => list.indexOf('d', null, 2, 1),
		)

		testChange(
			['b', 'd', 'd', 'd', 'j', 'l'],
			['b', 'd', 'd', 'd', 'j', 'l'],
			3, null,
			list => list.indexOf('d', 3),
			list => list.indexOf('d', 3, 4),
			list => list.indexOf('d', 3, 6, 1),
			list => list.indexOf('d', null, null, 1),
		)
	})
})
