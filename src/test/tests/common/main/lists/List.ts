import {
	CollectionChangedType,
} from '../../../../../main/common/lists/contracts/ICollectionChanged'
import {List} from '../../../../../main/common/lists/List'
import {
	compareDefault,
	generateArray, IListAction,
	TestList,
	toIterable,
} from './helpers/TestList'
import {ITestActionsWithDescription} from './helpers/TestVariants'

declare const assert: any
declare const after: any

describe('common > main > lists > List', function() {
	this.timeout(5000)

	const testList = TestList.test

	after(function () {
		console.log('Total List tests >= ' + TestList.totalListTests)
	})

	// region helpers

	// function assertList<T>(list: List<T>, expectedArray: T[]) {
	// 	assert.deepStrictEqual(list.toArray(), expectedArray)
	// 	assert.strictEqual(list.size, expectedArray.length)
	// 	assert.ok(list.allocatedSize >= expectedArray.length)
	//
	// 	for (let i = 0; i < expectedArray.length; i++) {
	// 		assert.strictEqual(list.get(i), expectedArray[i])
	// 		assert.strictEqual(expectedArray[list.indexOf(expectedArray[i])], expectedArray[i])
	// 		assert.strictEqual(list.contains(expectedArray[i]), true)
	// 		assert.strictEqual(list.contains({} as any), false)
	// 	}
	//
	// 	assert.deepStrictEqual(Array.from(list), expectedArray)
	// }
	//
	// interface TestOptionsBase<T> {
	// 	orig: T[],
	// 	expected: T[] | (new () => Error),
	// 	returnValue: any,
	// 	defaultValue: any,
	// 	variants?: TestOptionsVariants,
	// 	collectionChanged?: Array<ICollectionChangedEvent<T>>,
	// }
	//
	// const baseVariants: TestOptionsVariants = {
	// 	notAddIfExists: [false, true],
	// 	withEquals: [false, true],
	// 	withCompare: [false, true],
	// 	reuseListInstance: [false, true],
	// 	useCollectionChanged: [false, true],
	// }
	//
	// interface TestOptionsVariants {
	// 	withEquals?: boolean[]
	// 	withCompare?: boolean[]
	// 	reuseListInstance?: boolean[]
	// 	useCollectionChanged?: boolean[]
	// 	autoSort?: boolean[]
	// 	notAddIfExists?: boolean[]
	// }
	//
	// interface TestOptionsVariant {
	// 	withEquals?: boolean
	// 	withCompare?: boolean
	// 	reuseListInstance?: boolean
	// 	useCollectionChanged?: boolean
	// 	autoSort?: boolean
	// 	notAddIfExists?: boolean
	// }
	//
	// interface TestOptions<T> extends TestOptionsBase<T>, TestOptionsVariant {
	// 	description?: string
	// 	testFunc?: (list: List<T>) => any
	// }
	//
	// const staticList = new List()
	//
	// function testChangeVariant<T>(
	// 	options: TestOptions<T>,
	// ) {
	// 	let unsubscribe
	// 	try {
	// 		const array = options.orig.slice()
	// 		// assert.deepStrictEqual(array, array.slice().sort(compareDefault))
	// 		const equals = options.withEquals ? (o1, o2) => o1 === o2 : undefined
	// 		const compare = options.withCompare ? compareDefault : undefined
	// 		let list: List<T>
	//
	// 		if (options.reuseListInstance) {
	// 			staticList.clear()
	// 			staticList.equals = equals
	// 			staticList.compare = compare
	// 			staticList.autoSort = false
	// 			staticList.notAddIfExists = false
	// 			staticList.addArray(array)
	// 			staticList.autoSort = options.autoSort
	// 			staticList.notAddIfExists = options.notAddIfExists
	// 			list = staticList as List<T>
	// 		} else {
	// 			list = new List({
	// 				array,
	// 				equals,
	// 				compare,
	// 				autoSort: options.autoSort,
	// 				notAddIfExists: options.notAddIfExists,
	// 			})
	// 		}
	//
	// 		const arrayReplicate = options.autoSort || options.notAddIfExists
	// 			? list.toArray().slice()
	// 			: array.slice()
	//
	// 		const collectionChangedEvents = []
	// 		if (options.useCollectionChanged) {
	// 			unsubscribe = list.collectionChanged.subscribe(event => {
	// 				collectionChangedEvents.push(event)
	// 				applyCollectionChangedToArray(event, arrayReplicate, compare)
	//
	// 				assert.deepStrictEqual(arrayReplicate, list.toArray())
	// 			})
	// 		}
	//
	// 		assert.strictEqual(list.minAllocatedSize, undefined)
	// 		if (!options.reuseListInstance) {
	// 			assertList(list, array)
	// 		}
	//
	// 		if (Array.isArray(options.expected)) {
	// 			assert.deepStrictEqual(options.testFunc(list), options.funcResult)
	//
	// 			assert.strictEqual(list.minAllocatedSize, undefined)
	// 			assertList(list, options.expected)
	// 		} else {
	// 			assert.throws(() => options.testFunc(list), options.expected)
	//
	// 			assert.strictEqual(list.minAllocatedSize, undefined)
	// 			assertList(list, options.orig)
	// 		}
	//
	// 		if (!options.reuseListInstance) {
	// 			assert.deepStrictEqual(array.slice(0, list.size), list.toArray())
	// 			for (let i = list.size; i < array.length; i++) {
	// 				assert.strictEqual(array[i], options.defaultValue)
	// 			}
	// 		}
	//
	// 		if (options.useCollectionChanged) {
	// 			if (unsubscribe) {
	// 				unsubscribe()
	// 			}
	// 			assert.deepStrictEqual(collectionChangedEvents, options.collectionChanged || [])
	// 			assert.deepStrictEqual(arrayReplicate, list.toArray())
	// 		}
	// 	} catch (ex) {
	// 		console.log(`Error in: ${
	// 			options.description
	// 			}\n${
	// 			JSON.stringify(options, null, 4)
	// 			}\n${options.testFunc.toString()}\n`)
	// 		throw ex
	// 	} finally {
	// 		if (unsubscribe) {
	// 			unsubscribe()
	// 		}
	// 		totalListTests++
	// 	}
	// }
	//
	// function testChange<T>(
	// 	baseOptions: TestOptionsBase<T>,
	// 	...testFuncsWithDescriptions: TestFuncsWithDescriptions<T>
	// ) {
	// 	if ((!baseOptions.orig || baseOptions.orig.length <= 1)
	// 		&& Array.isArray(baseOptions.expected)
	// 		&& (!baseOptions.expected || baseOptions.expected.length <= 1)
	// 	) {
	// 		baseOptions.variants = {
	// 			autoSort: [false, true],
	// 			...baseOptions.variants,
	// 		}
	// 	}
	//
	// 	testListBase(
	// 		baseOptions,
	// 		{
	// 			...baseVariants,
	// 			...baseOptions.variants,
	// 		},
	// 		testChangeVariant,
	// 		...testFuncsWithDescriptions,
	// 	)
	// }

	// endregion

	it('constructor', function () {
		let list

		list = new List()
		assert.strictEqual(list.size, 0)
		assert.strictEqual(list.minAllocatedSize, undefined)
		assert.strictEqual(list.allocatedSize, 0)
		assert.strictEqual(list.equals, undefined)
		assert.strictEqual(list.compare, undefined)
		assert.strictEqual(list.autoSort, undefined)
		assert.strictEqual(list.notAddIfExists, undefined)
		assert.deepStrictEqual(list.toArray(), [])

		list = new List({
			minAllocatedSize: 3,
		})
		assert.strictEqual(list.size, 0)
		assert.strictEqual(list.minAllocatedSize, 3)
		assert.strictEqual(list.allocatedSize, 0)
		assert.strictEqual(list.equals, undefined)
		assert.strictEqual(list.compare, undefined)
		assert.strictEqual(list.autoSort, undefined)
		assert.strictEqual(list.notAddIfExists, undefined)
		assert.deepStrictEqual(list.toArray(), [])

		let array = [0, 1, 2]
		list = new List({
			array,
		})
		assert.strictEqual(list.size, 3)
		assert.strictEqual(list.minAllocatedSize, undefined)
		assert.strictEqual(list.allocatedSize, 3)
		assert.strictEqual(list.equals, undefined)
		assert.strictEqual(list.compare, undefined)
		assert.strictEqual(list.autoSort, undefined)
		assert.strictEqual(list.notAddIfExists, undefined)
		let toArray = list.toArray()
		assert.deepStrictEqual(toArray, [0, 1, 2])
		assert.notStrictEqual(toArray, array)

		const equals = (o1, o2) => o1 === o2
		list = new List({
			equals,
		})
		assert.strictEqual(list.size, 0)
		assert.strictEqual(list.minAllocatedSize, undefined)
		assert.strictEqual(list.allocatedSize, 0)
		assert.strictEqual(list.equals, equals)
		assert.strictEqual(list.compare, undefined)
		assert.strictEqual(list.autoSort, undefined)
		assert.strictEqual(list.notAddIfExists, undefined)
		assert.deepStrictEqual(list.toArray(), [])

		list = new List({
			compare: compareDefault,
		})
		assert.strictEqual(list.size, 0)
		assert.strictEqual(list.minAllocatedSize, undefined)
		assert.strictEqual(list.allocatedSize, 0)
		assert.strictEqual(list.equals, undefined)
		assert.strictEqual(list.compare, compareDefault)
		assert.strictEqual(list.autoSort, undefined)
		assert.strictEqual(list.notAddIfExists, undefined)
		assert.deepStrictEqual(list.toArray(), [])

		list = new List({
			array: array = [2, 1, 1, 1, 1, 3],
			notAddIfExists: true,
		})
		assert.strictEqual(list.size, 6)
		assert.strictEqual(list.minAllocatedSize, undefined)
		assert.strictEqual(list.allocatedSize, 6)
		assert.strictEqual(list.equals, undefined)
		assert.strictEqual(list.compare, undefined)
		assert.strictEqual(list.autoSort, undefined)
		assert.strictEqual(list.notAddIfExists, true)
		toArray = list.toArray()
		assert.deepStrictEqual(toArray, [2, 1, 1, 1, 1, 3])
		// list.removeDuplicates()
		// assert.strictEqual(list.size, 3)
		// assert.deepStrictEqual(toArray, [2, 1, 3])
		assert.notStrictEqual(toArray, array)

		list = new List({
			array: array = [2, 1, 3],
			autoSort: true,
		})
		assert.strictEqual(list.size, 3)
		assert.strictEqual(list.minAllocatedSize, undefined)
		assert.strictEqual(list.allocatedSize, 3)
		assert.strictEqual(list.equals, undefined)
		assert.strictEqual(list.compare, undefined)
		assert.strictEqual(list.autoSort, true)
		assert.strictEqual(list.notAddIfExists, undefined)
		toArray = list.toArray()
		assert.deepStrictEqual(toArray, [1, 2, 3])
		assert.notStrictEqual(toArray, array)
	})

	it('size', function () {
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

	it('get', function () {
		testList({
			array: [[]],
			expected: {
				error: Error,
				returnValue: null,
				defaultValue: null,
			},
			actions: [
				list => list.get(0),
				list => list.get(1),
				list => list.get(-1),
			],
		})

		testList({
			array: [['0']],
			expected: {
				error: Error,
				returnValue: null,
				defaultValue: null,
			},
			actions: [
				list => list.get(1),
				list => list.get(2),
				list => list.get(-2),
				list => list.get(-3),
			],
		})

		testList({
			array: [['4', '2', '3']],
			autoSort: [true],
			expected: {
				array: ['2', '3', '4'],
				returnValue: '3',
				defaultValue: null,
			},
			actions: [
				list => list.get(1),
				list => list.get(-2),
			],
		})
	})

	it('set', function () {
		function set<T>(
			index: number,
			item: T,
		): ITestActionsWithDescription<IListAction<T>> {
			return {
				actions: [
					list => list.set(index, item),
				],
				description: `set(${index}, ${JSON.stringify(item)})\n`,
			}
		}

		testList({
			array: [[]],
			expected: {
				array: ['0'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Added,
					index: 0,
					newItems: ['0'],
					shiftIndex: 0,
				}],
			},
			actions: [
				set(0, '0'),
				set(-1, '0'),
			],
		})

		testList({
			array: [[]],
			expected: {
				array: ['0'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Added,
					index: 0,
					newItems: ['0'],
					shiftIndex: 0,
				}],
			},
			actions: [
				set(0, '0'),
				set(-1, '0'),
			],
		})

		testList({
			array: [[]],
			expected: {
				error: Error,
				returnValue: null,
				defaultValue: null,
			},
			actions: [
				set(1, '0'),
				set(-2, '0'),
			],
		})

		testList({
			array: [['0']],
			expected: {
				array: ['1'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Set,
					index: 0,
					oldItems: ['0'],
					newItems: ['1'],
				}],
			},
			actions: [
				set(0, '1'),
				set(-2, '1'),
			],
		})

		testList({
			array: [['0']],
			expected: {
				error: Error,
				returnValue: null,
				defaultValue: null,
			},
			actions: [
				set(-3, '0'),
				set(2, '0'),
			],
		})

		testList({
			array: [['0']],
			expected: {
				array: ['0', '1'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Added,
					index: 1,
					newItems: ['1'],
					shiftIndex: 1,
				}],
			},
			actions: [
				set(1, '1'),
				set(-1, '1'),
			],
		})

		testList({
			array: [['0', '1']],
			expected: {
				array: ['2', '1'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Set,
					index: 0,
					oldItems: ['0'],
					newItems: ['2'],
				}],
			},
			actions: [
				set(0, '2'),
				set(-3, '2'),
			],
		})
	})

	it('add', function () {
		function add<T>(
			item: T,
		): ITestActionsWithDescription<IListAction<T>> {
			return {
				actions: [
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

		testList({
			array: [[]],
			expected: {
				array: ['0'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Added,
					index: 0,
					newItems: ['0'],
					shiftIndex: 0,
				}],
			},
			actions: [
				add('0'),
			],
		})

		testList({
			array: [['0']],
			expected: {
				array: ['0', '1'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Added,
					index: 1,
					newItems: ['1'],
					shiftIndex: 1,
				}],
			},
			actions: [
				add('1'),
			],
		})
	})

	it('addArray', function () {
		function addArray<T>(
			sourceItems: T[],
			sourceStart?: number,
			sourceEnd?: number,
		): ITestActionsWithDescription<IListAction<T>> {
			return {
				actions: [
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

		testList({
			array: [[]],
			expected: {
				array: [],
				returnValue: false,
				defaultValue: null,
			},
			actions: [
				addArray([]),
				addArray(['0'], 1),
				addArray(['0'], 2),
				addArray(['0'], null, 0),
				addArray(['0'], null, -2),
				addArray(['0'], null, -3),
			],
		})

		testList({
			array: [[]],
			expected: {
				array: ['0'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Added,
					index: 0,
					newItems: ['0'],
					shiftIndex: 0,
				}],
			},
			actions: [
				addArray(['0']),
				addArray(['0'], 0),
				addArray(['0'], -1),
				addArray(['0'], null, 1),
				addArray(['0'], null, -1),
			],
		})

		testList({
			array: [[]],
			expected: {
				error: Error,
				returnValue: null,
				defaultValue: null,
			},
			actions: [
				addArray(['0'], -2),
				addArray(['0'], null, 2),
			],
		})

		testList({
			array: [['0']],
			expected: {
				array: ['0', '1', '2', '3'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Added,
					index: 1,
					newItems: ['1', '2', '3'],
					shiftIndex: 1,
				}],
			},
			actions: [
				addArray(['1', '2', '3']),
				addArray(['1', '2', '3'], 0, 3),
				addArray(['1', '2', '3'], -3, -1),
			],
		})

		testList({
			array: [['0']],
			expected: {
				array: ['0', '1', '2'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Added,
					index: 1,
					newItems: ['1', '2'],
					shiftIndex: 1,
				}],
			},
			actions: [
				addArray(['1', '2', '3'], null, 2),
				addArray(['1', '2', '3'], null, -2),
				addArray(['1', '2', '3'], 0, 2),
				addArray(['1', '2', '3'], 0, -2),
				addArray(['1', '2', '3'], -3, 2),
				addArray(['1', '2', '3'], -3, -2),
			],
		})

		testList({
			array: [['0']],
			expected: {
				array: ['0', '2', '3'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Added,
					index: 1,
					newItems: ['2', '3'],
					shiftIndex: 1,
				}],
			},
			actions: [
				addArray(['1', '2', '3'], 1, null),
				addArray(['1', '2', '3'], -2, null),
				addArray(['1', '2', '3'], 1, -1),
				addArray(['1', '2', '3'], -2, -1),
				addArray(['1', '2', '3'], 1, 3),
				addArray(['1', '2', '3'], -2, 3),
			],
		})
	})

	it('insert', function () {
		function insert<T>(
			index: number,
			item: T,
		): ITestActionsWithDescription<IListAction<T>> {
			return {
				actions: [
					list => list.insert(index, item),
					list => list.insertArray(index, [item]),
					list => list.insertIterable(index, toIterable([item]), 1),
				],
				description: `insert(${index}, ${JSON.stringify(item)})\n`,
			}
		}

		testList({
			array: [[]],
			expected: {
				array: ['0'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Added,
					index: 0,
					newItems: ['0'],
					shiftIndex: 0,
				}],
			},
			actions: [
				insert(0, '0'),
				insert(-1, '0'),
			],
		})

		testList({
			array: [[]],
			expected: {
				error: Error,
				returnValue: null,
				defaultValue: null,
			},
			actions: [
				insert(1, '0'),
				insert(-2, '0'),
			],
		})

		testList({
			array: [['0']],
			expected: {
				array: ['0', '1'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Added,
					index: 1,
					newItems: ['1'],
					shiftIndex: 1,
				}],
			},
			actions: [
				insert(1, '1'),
				insert(-1, '1'),
			],
		})

		testList({
			array: [['0']],
			expected: {
				error: Error,
				returnValue: null,
				defaultValue: null,
			},
			actions: [
				insert(2, '1'),
				insert(-3, '1'),
			],
		})

		testList({
			array: [['0', '1', '2', '3', '4']],
			expected: {
				array: ['0', '5', '1', '2', '3', '4'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Added,
					index: 1,
					newItems: ['5'],
					shiftIndex: 2,
				}],
			},
			actions: [
				insert(1, '5'),
				insert(-5, '5'),
			],
		})
	})

	it('insertArray', function () {
		function insertArray<T>(
			index: number,
			sourceItems: T[],
			sourceStart?: number,
			sourceEnd?: number,
		): ITestActionsWithDescription<IListAction<T>> {
			return {
				actions: [
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

		testList({
			array: [['0']],
			expected: {
				array: ['1', '2', '0'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Added,
					index: 0,
					newItems: ['1', '2'],
					shiftIndex: 2,
				}],
			},
			actions: [
				insertArray(0, ['1', '2']),
				insertArray(0, ['1', '2'], 0, 2),
				insertArray(0, ['1', '2'], -2, -1),
				insertArray(0, ['1', '2', '3'], null, 2),
				insertArray(0, ['1', '2', '3'], null, -2),
				insertArray(0, ['1', '2', '3'], 0, 2),
				insertArray(0, ['1', '2', '3'], 0, -2),
				insertArray(0, ['1', '2', '3'], -3, 2),
				insertArray(0, ['1', '2', '3'], -3, -2),
			],
		})

		testList({
			array: [['0', '1', '2', '3', '4']],
			expected: {
				array: ['0', '1', '4', '5', '2', '3', '4'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Added,
					index: 2,
					newItems: ['4', '5'],
					shiftIndex: 4,
				}],
			},
			actions: [
				insertArray(2, ['4', '5']),
				insertArray(2, ['4', '5'], 0, 2),
				insertArray(2, ['4', '5'], -2, -1),
				insertArray(2, ['4', '5', '6'], null, 2),
				insertArray(2, ['4', '5', '6'], null, -2),
				insertArray(2, ['4', '5', '6'], 0, 2),
				insertArray(2, ['4', '5', '6'], 0, -2),
				insertArray(2, ['4', '5', '6'], -3, 2),
				insertArray(2, ['4', '5', '6'], -3, -2),
			],
		})
	})

	it('remove', function () {
		function remove<T>(
			item: T,
		): ITestActionsWithDescription<IListAction<T>> {
			return {
				actions: [
					list => list.remove(item),
				],
				description: `remove(${JSON.stringify(item)})\n`,
			}
		}

		testList({
			array: [[]],
			expected: {
				array: [],
				returnValue: false,
				defaultValue: null,
			},
			actions: [
				remove('0'),
			],
		})

		testList({
			array: [['0']],
			expected: {
				array: [],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 0,
					oldItems: ['0'],
					shiftIndex: 0,
				}],
			},
			actions: [
				remove('0'),
			],
		})

		testList({
			array: [['0', '1', '2']],
			expected: {
				array: ['1', '2'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 0,
					oldItems: ['0'],
					shiftIndex: 1,
				}],
			},
			actions: [
				remove('0'),
			],
		})

		testList({
			array: [['0', '1', '2']],
			expected: {
				array: ['0', '2'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 1,
					oldItems: ['1'],
					shiftIndex: 2,
				}],
			},
			actions: [
				remove('1'),
			],
		})

		testList({
			array: [['0', '1', '2']],
			expected: {
				array: ['0', '1', '2'],
				returnValue: false,
				defaultValue: null,
			},
			actions: [
				remove('3'),
			],
		})

		testList({
			array: [[0, 1, 2]],
			expected: {
				array: [0, 2],
				returnValue: true,
				defaultValue: 0,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 1,
					oldItems: [1],
					shiftIndex: 2,
				}],
			},
			actions: [
				remove(1),
			],
		})

		testList({
			array: [[true, true]],
			notAddIfExists: [false],
			expected: {
				array: [true],
				returnValue: true,
				defaultValue: false,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 1,
					oldItems: [true],
					shiftIndex: 1,
				}],
			},
			actions: [
				remove(true),
			],
		})

		testList({
			array: [['', 0, true]],
			expected: {
				array: ['', 0],
				returnValue: true,
				defaultValue: 0,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 2,
					oldItems: [true],
					shiftIndex: 2,
				}],
			},
			actions: [
				remove(true),
			],
		})
	})

	it('removeAt', function () {
		function removeAt<T>(
			index: number,
			withoutShift?: boolean,
		): ITestActionsWithDescription<IListAction<T>> {
			return {
				actions: [
					list => list.removeAt(index, withoutShift),
				],
				description: `removeAt(${index})\n`,
			}
		}

		testList({
			array: [[]],
			expected: {
				error: Error,
				returnValue: null,
				defaultValue: null,
			},
			actions: [
				removeAt(0),
				removeAt(-1),
			],
		})

		testList({
			array: [['0']],
			expected: {
				error: Error,
				returnValue: null,
				defaultValue: null,
			},
			actions: [
				removeAt(1),
				removeAt(-2),
			],
		})

		testList({
			array: [['0']],
			expected: {
				array: [],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 0,
					oldItems: ['0'],
					shiftIndex: 0,
				}],
			},
			actions: [
				removeAt(0),
				removeAt(-1),
			],
		})

		testList({
			array: [[0, 1, 2, 3]],
			expected: {
				array: [0, 2, 3],
				returnValue: true,
				defaultValue: 0,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 1,
					oldItems: [1],
					shiftIndex: 2,
				}],
			},
			actions: [
				removeAt(1),
				removeAt(-3),
			],
		})

		testList({
			array: [['0', '1', '2', '3']],
			expected: {
				array: ['0', '3', '2'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 1,
					oldItems: ['1'],
					shiftIndex: 3,
				}],
			},
			actions: [
				removeAt(1, true),
				removeAt(-3, true),
			],
		})
	})

	it('removeRange', function () {
		function removeRange<T>(
			start: number,
			end?: number,
			withoutShift?: boolean,
		): ITestActionsWithDescription<IListAction<T>> {
			return {
				actions: [
					list => list.removeRange(start, end, withoutShift),
				],
				description: `removeRange(${start}, ${end}, ${withoutShift})\n`,
			}
		}

		testList({
			array: [[]],
			expected: {
				array: [],
				returnValue: false,
				defaultValue: null,
			},
			actions: [
				removeRange(0),
				removeRange(0, 0),
			],
		})

		testList({
			array: [[]],
			expected: {
				error: Error,
				returnValue: null,
				defaultValue: null,
			},
			actions: [
				removeRange(-1),
				removeRange(0, 1),
			],
		})

		testList({
			array: [['0']],
			expected: {
				array: [],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 0,
					oldItems: ['0'],
					shiftIndex: 0,
				}],
			},
			actions: [
				removeRange(0),
				removeRange(-1),
				removeRange(0, 1),
				removeRange(-1, 1),
				removeRange(0, -1),
				removeRange(-1, -1),
			],
		})

		testList({
			array: [['0']],
			expected: {
				array: ['0'],
				returnValue: false,
				defaultValue: null,
			},
			actions: [
				removeRange(1),
				removeRange(0, 0),
				removeRange(1, 0),
				removeRange(0, -2),
				removeRange(-1, -2),
			],
		})

		testList({
			array: [[-5, -4, -3, -2, -1, true]],
			expected: {
				array: [-5, -1, true],
				returnValue: true,
				defaultValue: false,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 1,
					oldItems: [-4, -3, -2],
					shiftIndex: 4,
				}],
			},
			actions: [
				removeRange(1, 4),
				removeRange(-5, -3),
			],
		})

		testList({
			array: [[-5, -4, -3, -2, -1, null]],
			expected: {
				array: [-5, -1, null],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 1,
					oldItems: [-4, -3, -2],
					shiftIndex: 4,
				}],
			},
			actions: [
				removeRange(1, 4),
				removeRange(-5, -3),
			],
		})

		testList({
			array: [[-5, -4, -3, -2, -1, undefined]],
			expected: {
				array: [-5, -1, undefined],
				returnValue: true,
				defaultValue: undefined,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 1,
					oldItems: [-4, -3, -2],
					shiftIndex: 4,
				}],
			},
			actions: [
				removeRange(1, 4),
				removeRange(-5, -3),
			],
		})

		testList({
			array: [['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']],
			expected: {
				array: ['0', '1', '7', '8', '9', '5', '6'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 2,
					oldItems: ['2', '3', '4'],
					shiftIndex: 7,
				}],
			},
			actions: [
				removeRange(2, 5, true),
			],
		})

		testList({
			array: [['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']],
			expected: {
				array: ['0', '1', '5', '6', '7', '8', '9'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 2,
					oldItems: ['2', '3', '4'],
					shiftIndex: 5,
				}],
			},
			actions: [
				removeRange(2, 5, false),
			],
		})
	})

	it('clear', function () {
		function clear<T>(): ITestActionsWithDescription<IListAction<T>> {
			return {
				actions: [
					list => list.clear(),
					list => list.removeRange(0, list.size),
				],
				description: 'clear()\n',
			}
		}

		testList({
			array: [[]],
			expected: {
				array: [],
				returnValue: false,
				defaultValue: null,
			},
			actions: [
				clear(),
			],
		})

		testList({
			array: [['0']],
			expected: {
				array: [],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 0,
					oldItems: ['0'],
					shiftIndex: 0,
				}],
			},
			actions: [
				clear(),
			],
		})

		testList({
			array: [[0, 1, 2]],
			expected: {
				array: [],
				returnValue: true,
				defaultValue: 0,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 0,
					oldItems: [0, 1, 2],
					shiftIndex: 0,
				}],
			},
			actions: [
				clear(),
			],
		})

		testList({
			array: [[-3, -2, -1, true]],
			expected: {
				array: [],
				returnValue: true,
				defaultValue: 0,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 0,
					oldItems: [-3, -2, -1, true],
					shiftIndex: 0,
				}],
			},
			actions: [
				clear(),
			],
		})

		testList({
			array: [[true, 'z1', 'z2', 'z3']],
			expected: {
				array: [],
				returnValue: true,
				defaultValue: false,
				collectionChanged: [{
					type: CollectionChangedType.Removed,
					index: 0,
					oldItems: [true, 'z1', 'z2', 'z3'],
					shiftIndex: 0,
				}],
			},
			actions: [
				clear(),
			],
		})
	})

	it('toArray', function () {
		function toArray<T>(
			start?: number,
			end?: number,
		): ITestActionsWithDescription<IListAction<T>> {
			return {
				actions: [
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

		testList({
			array: [[]],
			expected: {
				array: [],
				returnValue: [],
				defaultValue: null,
			},
			actions: [
				toArray(),
			],
		})

		testList({
			array: [['0']],
			expected: {
				array: ['0'],
				returnValue: ['0'],
				defaultValue: null,
			},
			actions: [
				toArray(),
			],
		})

		testList({
			array: [['0', '1']],
			expected: {
				array: ['0', '1'],
				returnValue: ['0'],
				defaultValue: null,
			},
			actions: [
				toArray(0, 1),
				toArray(null, 1),
				toArray(-2, 1),
				toArray(-2, -2),
			],
		})

		testList({
			array: [['0', '1']],
			expected: {
				array: ['0', '1'],
				returnValue: ['1'],
				defaultValue: null,
			},
			actions: [
				toArray(1, 2),
				toArray(-1, 2),
				toArray(1, -1),
				toArray(-1, -1),
			],
		})

		testList({
			array: [['0', '1', '2', '3']],
			expected: {
				array: ['0', '1', '2', '3'],
				returnValue: ['1', '2'],
				defaultValue: null,
			},
			actions: [
				toArray(1, 3),
				toArray(-3, 3),
				toArray(1, -2),
				toArray(-3, -2),
			],
		})
	})

	it('copyTo', function () {
		function copyTo<T>(
			result: boolean,
			destArray: T[],
			destIndex?: number,
			start?: number,
			end?: number,
		): ITestActionsWithDescription<IListAction<T>> {
			return {
				actions: [
					list => {
						assert.strictEqual(list.copyTo(destArray, destIndex, start, end), result)
						return destArray
					},
				],
				description: `copyTo(${JSON.stringify(destArray)}, ${destIndex}, ${start}, ${end})\n`,
			}
		}

		testList({
			array: [[]],
			expected: {
				array: [],
				returnValue: [],
				defaultValue: null,
			},
			actions: [
				copyTo(false, []),
			],
		})

		testList({
			array: [[]],
			expected: {
				error: Error,
				returnValue: null,
				defaultValue: null,
			},
			actions: [
				copyTo(false, [], null, -1),
				copyTo(false, [], null, null, 1),
			],
		})

		testList({
			array: [['0']],
			expected: {
				error: Error,
				returnValue: null,
				defaultValue: null,
			},
			actions: [
				copyTo(false, [], null, -2),
				copyTo(false, [], null, null, 2),
			],
		})

		testList({
			array: [['0', '1', '2']],
			expected: {
				error: Error,
				returnValue: ['0', '1'],
				defaultValue: null,
			},
			actions: [
				copyTo(false, [], null, null, 2),
				copyTo(false, [], null, 0, 2),
				copyTo(false, [], null, -3, 2),
				copyTo(false, [], null, -3, -2),
			],
		})

		testList({
			array: [['0', '1', '2']],
			expected: {
				error: Error,
				returnValue: ['1', '2'],
				defaultValue: null,
			},
			actions: [
				copyTo(false, [], null, 1, null),
				copyTo(false, [], null, 1, 2),
				copyTo(false, [], null, -2, null),
				copyTo(false, [], null, -2, -1),
			],
		})

		testList({
			array: [['0', '1', '2']],
			expected: {
				error: Error,
				returnValue: ['0', '1', '2', '1', '2'],
				defaultValue: null,
			},
			actions: [
				copyTo(false, ['0', '1', '2', '3'], 3, 1, null),
			],
		})
	})

	it('indexOf', function () {
		testList({
			array: [['b', 'd', 'f', 'h', 'j', 'l']],
			expected: {
				array: ['b', 'd', 'f', 'h', 'j', 'l'],
				returnValue: ~6,
				defaultValue: null,
			},
			actions: [
				list => list.indexOf('a'),
				list => list.indexOf('a', 0),
				list => list.indexOf('a', 0, 1),
				list => list.indexOf('a', 0, 1, -1),
				list => list.indexOf('a', 0, 1, 1),
			],
		})

		testList({
			array: [[]],
			expected: {
				error: Error,
				returnValue: null,
				defaultValue: null,
			},
			actions: [
				list => list.indexOf('a', -1),
				list => list.indexOf('a', null, 1),
			],
		})

		testList({
			array: [['b', 'd', 'd', 'd', 'd', 'd', 'j', 'l']],
			notAddIfExists: [false],
			expected: {
				array: ['b', 'd', 'd', 'd', 'd', 'd', 'j', 'l'],
				returnValue: 1,
				defaultValue: null,
			},
			actions: [
				list => list.indexOf('d'),
				list => list.indexOf('d', 1),
				list => list.indexOf('d', 1, 2),
				list => list.indexOf('d', 1, 8, -1),
				list => list.indexOf('d', null, 2, 1),
			],
		})

		testList({
			array: [['b', 'd', 'd', 'd', 'd', 'd', 'j', 'l']],
			notAddIfExists: [false],
			expected: {
				array: ['b', 'd', 'd', 'd', 'd', 'd', 'j', 'l'],
				returnValue: 5,
				defaultValue: null,
			},
			actions: [
				list => list.indexOf('d', 5),
				list => list.indexOf('d', 5, 6),
				list => list.indexOf('d', 5, 8, 1),
				list => list.indexOf('d', null, null, 1),
			],
		})
	})

	it('move', function () {
		function move<T>(
			oldIndex: number,
			newIndex?: number,
		): ITestActionsWithDescription<IListAction<T>> {
			return {
				actions: [
					list => list.move(oldIndex, newIndex),
					list => list.moveRange(oldIndex, oldIndex + 1, newIndex),
				],
				description: `move(${oldIndex}, ${newIndex})\n`,
			}
		}

		testList({
			array: [[]],
			expected: {
				array: [],
				returnValue: false,
				defaultValue: null,
			},
			actions: [
				move(-1, -1),
				move(-2, -2),
				move(2, 2),
				move(10, 10),
			],
		})

		testList({
			array: [[]],
			expected: {
				error: Error,
				returnValue: false,
				defaultValue: null,
			},
			actions: [
				move(-1, 1),
				move(-2, 1),
				move(0, 2),
				move(0, -3),
			],
		})

		testList({
			array: [['0']],
			expected: {
				array: ['0'],
				returnValue: false,
				defaultValue: null,
			},
			actions: [
				move(0, 0),
				move(-1, -1),
			],
		})

		testList({
			array: [['0', '1', '2', '3', '4']],
			expected: {
				array: ['0', '3', '1', '2', '4'],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Moved,
					index: 3,
					moveIndex: 1,
					moveSize: 1,
				}],
			},
			actions: [
				move(3, 1),
				move(-2, -4),
			],
		})
	})

	it('moveRange', function () {
		function moveRange<T>(
			start: number,
			end?: number,
			moveIndex?: number,
		): ITestActionsWithDescription<IListAction<T>> {
			return {
				actions: [
					list => list.moveRange(start, end, moveIndex),
				],
				description: `move(${start}, ${end}, ${moveIndex})\n`,
			}
		}

		testList({
			array: [[]],
			expected: {
				array: [],
				returnValue: false,
				defaultValue: null,
			},
			actions: [
				moveRange(0, 0, 0),
				moveRange(10, -10, 10),
			],
		})

		testList({
			array: [[0, 1, 2, 3, 4, 5, 6, 7, 8]],
			expected: {
				array: [0, 5, 6, 1, 2, 3, 4, 7, 8],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Moved,
					index: 1,
					moveIndex: 3,
					moveSize: 4,
				}],
			},
			actions: [
				moveRange(1, 5, 3),
			],
		})

		testList({
			array: [[0, 1, 2, 3, 4, 5, 6, 7, 8]],
			expected: {
				array: [0, 3, 4, 5, 6, 1, 2, 7, 8],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Moved,
					index: 3,
					moveIndex: 1,
					moveSize: 4,
				}],
			},
			actions: [
				moveRange(3, 7, 1),
			],
		})

		testList({
			array: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
			expected: {
				array: [0, 8, 9, 1, 2, 3, 4, 5, 6, 7],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Moved,
					index: 1,
					moveIndex: 3,
					moveSize: 7,
				}],
			},
			actions: [
				moveRange(1, 8, 3),
			],
		})

		testList({
			array: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
			expected: {
				array: [0, 3, 4, 5, 6, 7, 8, 9, 1, 2],
				returnValue: true,
				defaultValue: null,
				collectionChanged: [{
					type: CollectionChangedType.Moved,
					index: 3,
					moveIndex: 1,
					moveSize: 7,
				}],
			},
			actions: [
				moveRange(3, 10, 1),
			],
		})
	})
})
