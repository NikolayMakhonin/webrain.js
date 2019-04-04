import {
	CollectionChangedType,
	ICollectionChangedEvent,
} from '../../../../../../main/common/lists/contracts/ICollectionChanged'
import {ICompare} from '../../../../../../main/common/lists/contracts/ICompare'
import {compareDefault, List} from '../../../../../../main/common/lists/List'
import {IOptionsVariant, IOptionsVariants, ITestCase, TestVariants} from './TestVariants'

declare const assert: any

export function generateArray(size) {
	const arr = []
	for (let i = 0; i < size; i++) {
		arr.push(i)
	}

	return arr
}

export function *toIterable<T>(array: T[]): Iterable<T> {
	for (const item of array) {
		yield item
	}
}

export function applyCollectionChangedToArray<T>(event: ICollectionChangedEvent<T>, array: T[], compare: ICompare<T>) {
	switch (event.type) {
		case CollectionChangedType.Added:
			{
				const len = array.length
				const shift = event.shiftIndex - event.index
				for (let i = len - shift; i < len; i++) {
					array[i + shift] = array[i]
				}
				for (let i = len - 1; i >= event.shiftIndex; i--) {
					array[i] = array[i - shift]
				}
			}

			for (let i = 0; i < event.newItems.length; i++) {
				array[event.index + i] = event.newItems[i]
			}
			break
		case CollectionChangedType.Removed:
			for (let i = 0; i < event.oldItems.length; i++) {
				assert.strictEqual(array[event.index + i], event.oldItems[i])
			}
			for (let i = event.shiftIndex; i < array.length; i++) {
				array[event.index + i - event.shiftIndex] = array[i]
			}
			array.length -= event.oldItems.length
			break
		case CollectionChangedType.Set:
			assert.strictEqual(array[event.index], event.oldItems[0])
			array[event.index] = event.newItems[0]
			if (event.moveIndex !== event.index) {
				array.splice(event.moveIndex, 0, ...array.splice(event.index, 1))
			}
			break
		case CollectionChangedType.Moved:
			array.splice(event.moveIndex, 0, ...array.splice(event.index, event.moveSize))
			break
		case CollectionChangedType.Resorted:
			array.sort(compare)
			break
	}
}

export type IListAction<T> = (list: List<T>, array?: T[]) => any

interface IListOptionsVariant<T> {
	expected: T[]
	array: T[]

	compare?: ICompare<T>
	withCompare?: boolean
	reuseListInstance?: boolean
	useCollectionChanged?: boolean
	autoSort?: boolean
	notAddIfExists?: boolean
	countSorted?: number
}

interface IListExpected<T> {
	array?: T[],
	error?: new () => Error,
	returnValue: any,
	defaultValue: any,
	collectionChanged?: Array<ICollectionChangedEvent<T>>,
	countSorted?: number
}

interface IListOptionsVariants<T> extends IOptionsVariants {
	array?: T[][]

	compare?: Array<ICompare<T>>
	withCompare?: boolean[]
	reuseListInstance?: boolean[]
	useCollectionChanged?: boolean[]
	autoSort?: boolean[]
	notAddIfExists?: boolean[]
	countSorted?: number[]
}

function assertList<T>(list: List<T>, expectedArray: T[]) {
	assert.deepStrictEqual(list.toArray(), expectedArray)
	assert.strictEqual(list.size, expectedArray.length)
	assert.ok(list.allocatedSize >= expectedArray.length)

	for (let i = 0; i < expectedArray.length; i++) {
		assert.strictEqual(list.get(i), expectedArray[i])
		assert.strictEqual(expectedArray[list.indexOf(expectedArray[i])], expectedArray[i])
		assert.strictEqual(list.contains(expectedArray[i]), true)
		assert.strictEqual(list.contains(Math.random() as any), false)
	}

	assert.deepStrictEqual(Array.from(list), expectedArray)
}

const staticArray = []
const staticList = new List({
	array: staticArray,
})

export class TestList<T> extends TestVariants<
	IListAction<T>,
	IListExpected<T>,
	IListOptionsVariant<T>,
	IListOptionsVariants<T>
> {
	private constructor() {
		super()
	}

	public static totalListTests: number = 0

	protected baseOptionsVariants: IListOptionsVariants<T> = {
		notAddIfExists: [false, true],
		withCompare: [false, true],
		reuseListInstance: [false, true],
		useCollectionChanged: [false, true],
	}

	protected testVariant(options: IListOptionsVariant<T> & IOptionsVariant<IListAction<T>, IListExpected<T>>) {
		let error
		for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
			let unsubscribe
			try {
				let array = options.array.slice()
				// assert.deepStrictEqual(array, array.slice().sort(compareDefault))
				const compare = options.compare || (options.withCompare ? compareDefault : undefined)
				let list: List<T>

				if (options.reuseListInstance) {
					staticList.clear()
					staticList.compare = compare
					staticList.notAddIfExists = false
					if (options.countSorted != null) {
						staticList.autoSort = true
						for (let i = 0; i < options.countSorted; i++) {
							staticList.add(array[i])
						}
						staticList.autoSort = false
						for (let i = options.countSorted; i < array.length; i++) {
							staticList.add(array[i])
						}
					} else {
						staticList.autoSort = false
						staticList.addArray(array)
					}
					staticList.autoSort = options.autoSort
					staticList.notAddIfExists = options.notAddIfExists
					list = staticList as List<T>
					array = staticArray
				} else {
					list = new List({
						array,
						compare,
						autoSort: options.autoSort,
						notAddIfExists: options.notAddIfExists,
						countSorted: options.countSorted,
					})
				}

				assert.strictEqual(list.countSorted, options.countSorted || 0)

				const arrayReplicate = array.slice(0, list.size)

				// assert.strictEqual(
				// 	list.countSorted,
				// 	options.autoSort ? list.size : options.countSorted || 0,
				// )

				const collectionChangedEvents = []
				if (options.useCollectionChanged) {
					unsubscribe = list.collectionChanged.subscribe(event => {
						collectionChangedEvents.push(event)
						applyCollectionChangedToArray(event, arrayReplicate, compare || compareDefault)

						if (event.type !== CollectionChangedType.Resorted) {
							assert.deepStrictEqual(arrayReplicate, array.slice(0, list.size))
						}
					})
				}

				assert.strictEqual(list.minAllocatedSize, undefined)
				// if (!options.reuseListInstance) {
				// 	assertList(list, array)
				// }

				if (options.expected.error) {
					assert.throws(() => options.action(list, array), options.expected.error)
					assert.strictEqual(
						list.countSorted,
						options.expected.countSorted == null
							? (options.autoSort ? list.size : options.countSorted || 0)
							: options.expected.countSorted,
					)

					assert.strictEqual(list.minAllocatedSize, undefined)
					assertList(list, options.array)
				} else {
					assert.deepStrictEqual(options.action(list, array), options.expected.returnValue)
					if (options.expected.countSorted != null) {
						assert.strictEqual(list.countSorted, options.expected.countSorted)
					}
					assert.strictEqual(list.minAllocatedSize, undefined)
					assertList(list, options.expected.array)
				}

				if (!options.reuseListInstance) {
					assert.deepStrictEqual(array.slice(0, list.size), list.toArray())
					for (let i = list.size; i < array.length; i++) {
						assert.strictEqual(array[i], options.expected.defaultValue)
					}
				}

				if (options.useCollectionChanged) {
					if (unsubscribe) {
						unsubscribe()
					}
					assert.deepStrictEqual(collectionChangedEvents, options.expected.collectionChanged || [])
					assert.deepStrictEqual(arrayReplicate, list.toArray())
				}

				if (options.expected.countSorted != null) {
					assert.strictEqual(list.countSorted, options.expected.countSorted)
				} else if (options.autoSort) {
					assert.strictEqual(list.countSorted, list.size)
				}

				break
			} catch (ex) {
				if (!debugIteration) {
					console.log(`Error in: ${
						options.description
						}\n${
						JSON.stringify(options, null, 4)
						}\n${options.action.toString()}\n${ex.stack}`)
					error = ex
				}
			} finally {
				if (unsubscribe) {
					unsubscribe()
				}
				TestList.totalListTests++
			}
		}

		if (error) {
			throw error
		}
	}

	private static readonly _instance = new TestList()

	public static test<T>(testCases: ITestCase<IListAction<T>, IListExpected<T>> & IListOptionsVariants<T>) {
		if ((!testCases.array || testCases.array.length <= 1)
			&& !testCases.expected.error
			&& (!testCases.expected.array || testCases.expected.array.length <= 1)
		) {
			testCases.autoSort = [false, true]
		}

		if (!testCases.countSorted
			&& testCases.array
			&& testCases.array.length >= 1
			&& (!testCases.compare || testCases.compare.length <= 0)
		) {
			const compare = testCases.compare && testCases.compare.length && testCases.compare[0]
				|| compareDefault

			let minCountSorted
			for (const array of testCases.array) {
				let countSorted = 0
				for (let i = 0; i < array.length; i++) {
					if (i > 0 && compare(array[i - 1], array[i]) > 0) {
						break
					}
					countSorted++
				}

				if (minCountSorted == null || countSorted < minCountSorted) {
					minCountSorted = countSorted
				}

				if (minCountSorted === 0) {
					break
				}
			}

			testCases.countSorted = [undefined, 0]
			for (let i = 1; i <= minCountSorted; i++) {
				testCases.countSorted.push(i)
			}
		}

		(TestList._instance as TestList<T>).test(testCases)
	}

}
