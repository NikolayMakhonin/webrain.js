import {
	CollectionChangedType,
	ICollectionChangedEvent,
} from '../../../../../main/common/lists/contracts/ICollectionChanged'
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

	interface TestOptionsBase<T> {
		orig: T[],
		expected: T[]|(new () => Error),
		funcResult: any,
		defaultValue: any,
		collectionChanged?: Array<ICollectionChangedEvent<T>>,
	}

	function *generateOptions(base: {}, optionsVariants: {}) {
		let hasChilds
		for (const key in optionsVariants) {
			if (Object.prototype.hasOwnProperty.call(optionsVariants, key)) {
				for (const optionVariant of optionsVariants[key]) {
					const variant = {
						...base,
						[key]: optionVariant,
					}

					const newOptionsVariants = {
						...optionsVariants,
					}

					delete newOptionsVariants[key]

					hasChilds = true

					yield* generateOptions(variant, newOptionsVariants)
				}

				break
			}
		}

		if (!hasChilds) {
			yield base
		}
	}

	const variants = Array.from(generateOptions({}, {
		withCompare: [false, true],
		reuseListInstance: [false, true],
		useCollectionChanged: [false, true],
	}))

	interface TestOptionsVariant<T> extends TestOptionsBase<T> {
		description: string,
		testFunc: (list: List<T>) => any,
		withCompare: boolean,
		reuseListInstance: boolean
		useCollectionChanged: boolean
	}

	const staticList = new List()

	function testChangeVariant<T>(
		options: TestOptionsVariant<T>,
	) {
		let unsubscribe
		try {
			const array = options.orig.slice()
			const arrayReplicate = options.orig.slice()
			const compare = options.withCompare ? (o1, o2) => o1 === o2 : undefined
			let list: List<T>

			if (options.reuseListInstance) {
				staticList.clear()
				staticList.addArray(array)
				staticList.compare = compare
				list = staticList as List<T>
			} else {
				list = new List({
					array,
					compare,
				})
			}

			const collectionChangedEvents = []
			if (options.useCollectionChanged) {
				unsubscribe = list.collectionChanged.subscribe(event => {
					collectionChangedEvents.push(event)
					switch (event.type) {
						case CollectionChangedType.Added:
							{
								const len = arrayReplicate.length
								const shift = event.shiftIndex - event.index
								for (let i = len - shift; i < len; i++) {
									arrayReplicate[i + shift] = arrayReplicate[i]
								}
								for (let i = event.shiftIndex; i < len; i++) {
									arrayReplicate[i] = arrayReplicate[i - shift]
								}
							}

							for (let i = 0; i < event.newItems.length; i++) {
								arrayReplicate[event.index + i] = event.newItems[i]
							}
							break
						case CollectionChangedType.Removed:
							for (let i = 0; i < event.oldItems.length; i++) {
								assert.strictEqual(arrayReplicate[event.index + i], event.oldItems[i])
							}
							for (let i = event.shiftIndex; i < arrayReplicate.length; i++) {
								arrayReplicate[event.index + i - event.shiftIndex] = arrayReplicate[i]
							}
							arrayReplicate.length -= event.oldItems.length
							break
						case CollectionChangedType.Set:
							assert.strictEqual(arrayReplicate[event.index], event.oldItems[0])
							arrayReplicate[event.index] = event.newItems[0]
							break
						case CollectionChangedType.Shift:
							// if (event.shiftIndex > event.index) {
							// 	const len = arrayReplicate.length
							// 	const shift = event.shiftIndex - event.index
							// 	for (let i = len - shift; i < len; i++) {
							// 		arrayReplicate[i + shift] = arrayReplicate[i]
							// 	}
							// 	for (let i = event.shiftIndex; i < len; i++) {
							// 		arrayReplicate[i] = arrayReplicate[i - shift]
							// 	}
							// } else {
							// 	for (let i = event.index; i < arrayReplicate.length; i++) {
							// 		arrayReplicate[event.shiftIndex + i - event.index] = arrayReplicate[i]
							// 	}
							// }
							break
						case CollectionChangedType.ReSize:
							// if (event.newSize < event.oldSize) {
							// 	arrayReplicate.length = event.newSize
							// }
							break
						case CollectionChangedType.Moved:
							// TODO
							break
						case CollectionChangedType.Resorted:
							// TODO
							break
					}

					// if (event.type !== CollectionChangedType.Shift
					// 	&& event.type !== CollectionChangedType.Removed
					// 	&& (event.type !== CollectionChangedType.ReSize || event.newSize < event.oldSize)
					// ) {
					if (event.type !== CollectionChangedType.Shift
						&& event.type !== CollectionChangedType.ReSize
					) {
						assert.deepStrictEqual(arrayReplicate, list.toArray())
					}
				})
			}

			assert.strictEqual(list.minAllocatedSize, undefined)
			assertList(list, options.orig)

			if (Array.isArray(options.expected)) {
				assert.deepStrictEqual(options.testFunc(list), options.funcResult)

				assert.strictEqual(list.minAllocatedSize, undefined)
				assertList(list, options.expected)
			} else {
				assert.throws(() => options.testFunc(list), options.expected)

				assert.strictEqual(list.minAllocatedSize, undefined)
				assertList(list, options.orig)
			}

			if (!options.reuseListInstance) {
				assert.deepStrictEqual(array.slice(0, list.size), list.toArray())
				for (let i = list.size; i < array.length; i++) {
					assert.strictEqual(array[i], options.defaultValue)
				}
			}

			if (options.useCollectionChanged) {
				if (unsubscribe) {
					unsubscribe()
				}
				assert.deepStrictEqual(collectionChangedEvents, options.collectionChanged || [])
			}
		} catch (ex) {
			console.log(`Error in: ${
				options.description
				}\n${
				JSON.stringify(options, null, 4)
				}\n${options.testFunc.toString()}\n`)
			throw ex
		} finally {
			if (unsubscribe) {
				unsubscribe()
			}
		}
	}

	function testChange<T>(
		options: TestOptionsBase<T>,
		...testFuncsWithDescriptions: TestFuncsWithDescriptions<T>
	) {
		for (const testFuncsWithDescription of expandArray(testFuncsWithDescriptions)) {
			let {funcs, description} = testFuncsWithDescription
			if (typeof testFuncsWithDescription === 'function') {
				funcs = [testFuncsWithDescription]
				description = ''
			}

			for (const testFunc of expandArray(funcs)) {
				for (const variant of variants as Array<TestOptionsVariant<T>>) {
					testChangeVariant({
						...options,
						description,
						testFunc,
						...variant,
					})
				}
			}
		}
	}

	it('get', function() {
		testChange(
			{
				orig: [],
				expected: Error,
				funcResult: null,
				defaultValue: null,
			},
			list => list.get(0),
			list => list.get(1),
			list => list.get(-1),
		)

		testChange(
			{
				orig: ['0'],
				expected: Error,
				funcResult: null,
				defaultValue: null,
			},
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
			{
				orig: [],
				expected: ['0'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.ReSize,
					oldSize: 0,
					newSize: 1,
				}, {
					type: CollectionChangedType.Added,
					index: 0,
					newItems: ['0'],
					shiftIndex: 0,
				}],
			},
			set(0, '0'),
			set(-1, '0'),
		)

		testChange(
			{
				orig: [],
				expected: Error,
				funcResult: null,
				defaultValue: null,
			},
			set(1, '0'),
			set(-2, '0'),
		)

		testChange(
			{
				orig: ['0'],
				expected: ['1'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Set,
					index: 0,
					oldItems: ['0'],
					newItems: ['1'],
				}],
			},
			set(0, '1'),
			set(-2, '1'),
		)

		testChange(
			{
				orig: ['0'],
				expected: Error,
				funcResult: null,
				defaultValue: null,
			},
			set(-3, '0'),
			set(2, '0'),
		)

		testChange(
			{
				orig: ['0'],
				expected: ['0', '1'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.ReSize,
					oldSize: 1,
					newSize: 2,
				}, {
					type: CollectionChangedType.Added,
					index: 1,
					newItems: ['1'],
					shiftIndex: 1,
				}],
			},
			set(1, '1'),
			set(-1, '1'),
		)

		testChange(
			{
				orig: ['0', '1'],
				expected: ['2', '1'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Set,
					index: 0,
					oldItems: ['0'],
					newItems: ['2'],
				}],
			},
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
			{
				orig: [],
				expected: ['0'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.ReSize,
					oldSize: 0,
					newSize: 1,
				}, {
					type: CollectionChangedType.Added,
					index: 0,
					newItems: ['0'],
					shiftIndex: 0,
				}],
			},
			add('0'),
		)

		testChange(
			{
				orig: ['0'],
				expected: ['0', '1'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.ReSize,
					oldSize: 1,
					newSize: 2,
				}, {
					type: CollectionChangedType.Added,
					index: 1,
					newItems: ['1'],
					shiftIndex: 1,
				}],
			},
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
			{
				orig: [],
				expected: [],
				funcResult: false,
				defaultValue: null,
			},
			addArray([]),
			addArray(['0'], 1),
			addArray(['0'], 2),
			addArray(['0'], null, 0),
			addArray(['0'], null, -2),
			addArray(['0'], null, -3),
		)

		testChange(
			{
				orig: [],
				expected: ['0'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.ReSize,
					oldSize: 0,
					newSize: 1,
				}, {
					type: CollectionChangedType.Added,
					index: 0,
					newItems: ['0'],
					shiftIndex: 0,
				}],
			},
			addArray(['0']),
			addArray(['0'], 0),
			addArray(['0'], -1),
			addArray(['0'], null, 1),
			addArray(['0'], null, -1),
		)

		testChange(
			{
				orig: [],
				expected: Error,
				funcResult: null,
				defaultValue: null,
			},
			addArray(['0'], -2),
			addArray(['0'], null, 2),
		)

		testChange(
			{
				orig: ['0'],
				expected: ['0', '1', '2', '3'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.ReSize,
					oldSize: 1,
					newSize: 4,
				}, {
					type: CollectionChangedType.Added,
					index: 1,
					newItems: ['1', '2', '3'],
					shiftIndex: 1,
				}],
			},
			addArray(['1', '2', '3']),
			addArray(['1', '2', '3'], 0, 3),
			addArray(['1', '2', '3'], -3, -1),
		)

		testChange(
			{
				orig: ['0'],
				expected: ['0', '1', '2'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.ReSize,
					oldSize: 1,
					newSize: 3,
				}, {
					type: CollectionChangedType.Added,
					index: 1,
					newItems: ['1', '2'],
					shiftIndex: 1,
				}],
			},
			addArray(['1', '2', '3'], null, 2),
			addArray(['1', '2', '3'], null, -2),
			addArray(['1', '2', '3'], 0, 2),
			addArray(['1', '2', '3'], 0, -2),
			addArray(['1', '2', '3'], -3, 2),
			addArray(['1', '2', '3'], -3, -2),
		)

		testChange(
			{
				orig: ['0'],
				expected: ['0', '2', '3'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.ReSize,
					oldSize: 1,
					newSize: 3,
				}, {
					type: CollectionChangedType.Added,
					index: 1,
					newItems: ['2', '3'],
					shiftIndex: 1,
				}],
			},
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
			{
				orig: [],
				expected: ['0'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.ReSize,
					oldSize: 0,
					newSize: 1,
				}, {
					type: CollectionChangedType.Added,
					index: 0,
					newItems: ['0'],
					shiftIndex: 0,
				}],
			},
			insert(0, '0'),
			insert(-1, '0'),
		)

		testChange(
			{
				orig: [],
				expected: Error,
				funcResult: null,
				defaultValue: null,
			},
			insert(1, '0'),
			insert(-2, '0'),
		)

		testChange(
			{
				orig: ['0'],
				expected: ['0', '1'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.ReSize,
					oldSize: 1,
					newSize: 2,
				}, {
					type: CollectionChangedType.Added,
					index: 1,
					newItems: ['1'],
					shiftIndex: 1,
				}],
			},
			insert(1, '1'),
			insert(-1, '1'),
		)

		testChange(
			{
				orig: ['0'],
				expected: Error,
				funcResult: null,
				defaultValue: null,
			},
			insert(2, '1'),
			insert(-3, '1'),
		)

		testChange(
			{
				orig: ['0', '1', '2'],
				expected: ['0', '3', '1', '2'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.ReSize,
					oldSize: 3,
					newSize: 4,
				}, {
					type: CollectionChangedType.Shift,
					index: 1,
					shiftIndex: 2,
				}, {
					type: CollectionChangedType.Added,
					index: 1,
					newItems: ['3'],
					shiftIndex: 2,
				}],
			},
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
			{
				orig: ['0'],
				expected: ['1', '2', '0'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.ReSize,
					oldSize: 1,
					newSize: 3,
				}, {
					type: CollectionChangedType.Shift,
					index: 0,
					shiftIndex: 2,
				}, {
					type: CollectionChangedType.Added,
					index: 0,
					newItems: ['1', '2'],
					shiftIndex: 2,
				}],
			},
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
			{
				orig: ['0', '1', '2', '3', '4'],
				expected: ['0', '1', '4', '5', '2', '3', '4'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.ReSize,
					oldSize: 5,
					newSize: 7,
				}, {
					type: CollectionChangedType.Shift,
					index: 2,
					shiftIndex: 4,
				}, {
					type: CollectionChangedType.Added,
					index: 2,
					newItems: ['4', '5'],
					shiftIndex: 4,
				}],
			},
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
			{
				orig: [],
				expected: [],
				funcResult: false,
				defaultValue: null,
			},
			remove('0'),
		)

		testChange(
			{
				orig: ['0'],
				expected: [],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 0,
					oldItems: ['0'],
					shiftIndex: 0,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 1,
					newSize: 0,
				}],
			},
			remove('0'),
		)

		testChange(
			{
				orig: ['0', '1', '2'],
				expected: ['1', '2'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 0,
					oldItems: ['0'],
					shiftIndex: 1,
				}, {
					type: CollectionChangedType.Shift,
					index: 1,
					shiftIndex: 0,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 3,
					newSize: 2,
				}],
			},
			remove('0'),
		)

		testChange(
			{
				orig: ['0', '1', '2'],
				expected: ['0', '2'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 1,
					oldItems: ['1'],
					shiftIndex: 2,
				}, {
					type: CollectionChangedType.Shift,
					index: 2,
					shiftIndex: 1,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 3,
					newSize: 2,
				}],
			},
			remove('1'),
		)

		testChange(
			{
				orig: ['0', '1', '2'],
				expected: ['0', '1', '2'],
				funcResult: false,
				defaultValue: null,
			},
			remove('3'),
		)

		testChange(
			{
				orig: [0, 1, 2],
				expected: [0, 2],
				funcResult: true,
				defaultValue: 0,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 1,
					oldItems: [1],
					shiftIndex: 2,
				}, {
					type: CollectionChangedType.Shift,
					index: 2,
					shiftIndex: 1,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 3,
					newSize: 2,
				}],
			},
			remove(1),
		)

		testChange(
			{
				orig: [true, true],
				expected: [true],
				funcResult: true,
				defaultValue: false,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 1,
					oldItems: [true],
					shiftIndex: 1,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 2,
					newSize: 1,
				}],
			},
			remove(true),
		)

		testChange(
			{
				orig: ['', 0, true],
				expected: ['', 0],
				funcResult: true,
				defaultValue: 0,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 2,
					oldItems: [true],
					shiftIndex: 2,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 3,
					newSize: 2,
				}],
			},
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
			{
				orig: [],
				expected: Error,
				funcResult: null,
				defaultValue: null,
			},
			removeAt(0),
			removeAt(-1),
		)

		testChange(
			{
				orig: ['0'],
				expected: Error,
				funcResult: null,
				defaultValue: null,
			},
			removeAt(1),
			removeAt(-2),
		)

		testChange(
			{
				orig: ['0'],
				expected: [],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 0,
					oldItems: ['0'],
					shiftIndex: 0,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 1,
					newSize: 0,
				}],
			},
			removeAt(0),
			removeAt(-1),
		)

		testChange(
			{
				orig: [0, 1, 2, 3],
				expected: [0, 2, 3],
				funcResult: true,
				defaultValue: 0,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 1,
					oldItems: [1],
					shiftIndex: 2,
				}, {
					type: CollectionChangedType.Shift,
					index: 2,
					shiftIndex: 1,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 4,
					newSize: 3,
				}],
			},
			removeAt(1),
			removeAt(-3),
		)

		testChange(
			{
				orig: ['0', '1', '2', '3'],
				expected: ['0', '3', '2'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 1,
					oldItems: ['1'],
					shiftIndex: 3,
				}, {
					type: CollectionChangedType.Shift,
					index: 3,
					shiftIndex: 1,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 4,
					newSize: 3,
				}],
			},
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
			{
				orig: [],
				expected: [],
				funcResult: false,
				defaultValue: null,
			},
			removeRange(0),
			removeRange(0, 0),
		)

		testChange(
			{
				orig: [],
				expected: Error,
				funcResult: null,
				defaultValue: null,
			},
			removeRange(-1),
			removeRange(0, 1),
		)

		testChange(
			{
				orig: ['0'],
				expected: [],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 0,
					oldItems: ['0'],
					shiftIndex: 0,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 1,
					newSize: 0,
				}],
			},
			removeRange(0),
			removeRange(-1),
			removeRange(0, 1),
			removeRange(-1, 1),
			removeRange(0, -1),
			removeRange(-1, -1),
		)

		testChange(
			{
				orig: ['0'],
				expected: ['0'],
				funcResult: false,
				defaultValue: null,
			},
			removeRange(1),
			removeRange(0, 0),
			removeRange(1, 0),
			removeRange(0, -2),
			removeRange(-1, -2),
		)

		testChange(
			{
				orig: [0, 1, 2, 3, 4, true],
				expected: [0, 4, true],
				funcResult: true,
				defaultValue: false,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 1,
					oldItems: [1, 2, 3],
					shiftIndex: 4,
				}, {
					type: CollectionChangedType.Shift,
					index: 4,
					shiftIndex: 1,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 6,
					newSize: 3,
				}],
			},
			removeRange(1, 4),
			removeRange(-5, -3),
		)

		testChange(
			{
				orig: [0, 1, 2, 3, 4, null],
				expected: [0, 4, null],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 1,
					oldItems: [1, 2, 3],
					shiftIndex: 4,
				}, {
					type: CollectionChangedType.Shift,
					index: 4,
					shiftIndex: 1,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 6,
					newSize: 3,
				}],
			},
			removeRange(1, 4),
			removeRange(-5, -3),
		)

		testChange(
			{
				orig: [0, 1, 2, 3, 4, undefined],
				expected: [0, 4, undefined],
				funcResult: true,
				defaultValue: undefined,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 1,
					oldItems: [1, 2, 3],
					shiftIndex: 4,
				}, {
					type: CollectionChangedType.Shift,
					index: 4,
					shiftIndex: 1,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 6,
					newSize: 3,
				}],
			},
			removeRange(1, 4),
			removeRange(-5, -3),
		)

		testChange(
			{
				orig: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
				expected: ['0', '1', '7', '8', '9', '5', '6'],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 2,
					oldItems: ['2', '3', '4'],
					shiftIndex: 7,
				}, {
					type: CollectionChangedType.Shift,
					index: 7,
					shiftIndex: 2,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 10,
					newSize: 7,
				}],
			},
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
			{
				orig: [],
				expected: [],
				funcResult: false,
				defaultValue: null,
			},
			clear(),
		)

		testChange(
			{
				orig: ['0'],
				expected: [],
				funcResult: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 0,
					oldItems: ['0'],
					shiftIndex: 0,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 1,
					newSize: 0,
				}],
			},
			clear(),
		)

		testChange(
			{
				orig: [0, 1, 2],
				expected: [],
				funcResult: true,
				defaultValue: 0,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 0,
					oldItems: [0, 1, 2],
					shiftIndex: 0,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 3,
					newSize: 0,
				}],
			},
			clear(),
		)

		testChange(
			{
				orig: [0, 1, 2, true],
				expected: [],
				funcResult: true,
				defaultValue: 0,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 0,
					oldItems: [0, 1, 2, true],
					shiftIndex: 0,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 4,
					newSize: 0,
				}],
			},
			clear(),
		)

		testChange(
			{
				orig: [true, 0, 1, 2],
				expected: [],
				funcResult: true,
				defaultValue: false,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 0,
					oldItems: [true, 0, 1, 2],
					shiftIndex: 0,
				}, {
					type: CollectionChangedType.ReSize,
					oldSize: 4,
					newSize: 0,
				}],
			},
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
			{
				orig: [],
				expected: [],
				funcResult: [],
				defaultValue: null,
			},
			toArray(),
		)

		testChange(
			{
				orig: ['0'],
				expected: ['0'],
				funcResult: ['0'],
				defaultValue: null,
			},
			toArray(),
		)

		testChange(
			{
				orig: ['0', '1'],
				expected: ['0', '1'],
				funcResult: ['0'],
				defaultValue: null,
			},
			toArray(0, 1),
			toArray(null, 1),
			toArray(-2, 1),
			toArray(-2, -2),
		)

		testChange(
			{
				orig: ['0', '1'],
				expected: ['0', '1'],
				funcResult: ['1'],
				defaultValue: null,
			},
			toArray(1, 2),
			toArray(-1, 2),
			toArray(1, -1),
			toArray(-1, -1),
		)

		testChange(
			{
				orig: ['0', '1', '2', '3'],
				expected: ['0', '1', '2', '3'],
				funcResult: ['1', '2'],
				defaultValue: null,
			},
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
			{
				orig: [],
				expected: [],
				funcResult: [],
				defaultValue: null,
			},
			copyTo(false, []),
		)

		testChange(
			{
				orig: [],
				expected: Error,
				funcResult: null,
				defaultValue: null,
			},
			copyTo(false, [], null, -1),
			copyTo(false, [], null, null, 1),
		)

		testChange(
			{
				orig: ['0'],
				expected: Error,
				funcResult: null,
				defaultValue: null,
			},
			copyTo(false, [], null, -2),
			copyTo(false, [], null, null, 2),
		)

		testChange(
			{
				orig: ['0', '1', '2'],
				expected: Error,
				funcResult: ['0', '1'],
				defaultValue: null,
			},
			copyTo(false, [], null, null, 2),
			copyTo(false, [], null, 0, 2),
			copyTo(false, [], null, -3, 2),
			copyTo(false, [], null, -3, -2),
		)

		testChange(
			{
				orig: ['0', '1', '2'],
				expected: Error,
				funcResult: ['1', '2'],
				defaultValue: null,
			},
			copyTo(false, [], null, 1, null),
			copyTo(false, [], null, 1, 2),
			copyTo(false, [], null, -2, null),
			copyTo(false, [], null, -2, -1),
		)

		testChange(
			{
				orig: ['0', '1', '2'],
				expected: Error,
				funcResult: ['0', '1', '2', '1', '2'],
				defaultValue: null,
			},
			copyTo(false, ['0', '1', '2', '3'], 3, 1, null),
		)
	})

	it('indexOf', function() {
		testChange(
			{
				orig: ['b', 'd', 'f', 'h', 'j', 'l'],
				expected: ['b', 'd', 'f', 'h', 'j', 'l'],
				funcResult: ~6,
				defaultValue: null,
			},
			list => list.indexOf('a'),
			list => list.indexOf('a', 0),
			list => list.indexOf('a', 0, 1),
			list => list.indexOf('a', 0, 1, -1),
			list => list.indexOf('a', 0, 1, 1),
		)

		testChange(
			{
				orig: [],
				expected: Error,
				funcResult: null,
				defaultValue: null,
			},
			list => list.indexOf('a', -1),
			list => list.indexOf('a', null, 1),
		)

		testChange(
			{
				orig: ['b', 'd', 'd', 'd', 'j', 'l'],
				expected: ['b', 'd', 'd', 'd', 'j', 'l'],
				funcResult: 1,
				defaultValue: null,
			},
			list => list.indexOf('d'),
			list => list.indexOf('d', 1),
			list => list.indexOf('d', 1, 2),
			list => list.indexOf('d', 1, 6, -1),
			list => list.indexOf('d', null, 2, 1),
		)

		testChange(
			{
				orig: ['b', 'd', 'd', 'd', 'j', 'l'],
				expected: ['b', 'd', 'd', 'd', 'j', 'l'],
				funcResult: 3,
				defaultValue: null,
			},
			list => list.indexOf('d', 3),
			list => list.indexOf('d', 3, 4),
			list => list.indexOf('d', 3, 6, 1),
			list => list.indexOf('d', null, null, 1),
		)
	})
})
