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

	withEquals?: boolean
	withCompare?: boolean
	reuseListInstance?: boolean
	useCollectionChanged?: boolean
	autoSort?: boolean
	notAddIfExists?: boolean
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

	withEquals?: boolean[]
	withCompare?: boolean[]
	reuseListInstance?: boolean[]
	useCollectionChanged?: boolean[]
	autoSort?: boolean[]
	notAddIfExists?: boolean[]
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

const staticList = new List()

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
		withEquals: [false, true],
		withCompare: [false, true],
		reuseListInstance: [false, true],
		useCollectionChanged: [false, true],
	}

	protected testVariant(options: IListOptionsVariant<T> & IOptionsVariant<IListAction<T>, IListExpected<T>>) {
		let unsubscribe
		try {
			const array = options.array.slice()
			// assert.deepStrictEqual(array, array.slice().sort(compareDefault))
			const equals = options.withEquals ? (o1, o2) => o1 === o2 : undefined
			const compare = options.withCompare ? compareDefault : undefined
			let list: List<T>

			if (options.reuseListInstance) {
				staticList.clear()
				staticList.equals = equals
				staticList.compare = compare
				staticList.autoSort = false
				staticList.notAddIfExists = false
				staticList.addArray(array)
				staticList.autoSort = options.autoSort
				staticList.notAddIfExists = options.notAddIfExists
				list = staticList as List<T>
			} else {
				list = new List({
					array,
					equals,
					compare,
					autoSort: options.autoSort,
					notAddIfExists: options.notAddIfExists,
				})
			}

			assert.strictEqual(list.countSorted, 0)

			const arrayReplicate = options.autoSort || options.notAddIfExists
				? list.toArray().slice()
				: array.slice()

			if (options.autoSort) {
				assert.strictEqual(list.countSorted, list.size)
			}

			const collectionChangedEvents = []
			if (options.useCollectionChanged) {
				unsubscribe = list.collectionChanged.subscribe(event => {
					collectionChangedEvents.push(event)
					applyCollectionChangedToArray(event, arrayReplicate, compare)

					assert.deepStrictEqual(arrayReplicate, list.toArray())
				})
			}

			assert.strictEqual(list.minAllocatedSize, undefined)
			if (!options.reuseListInstance) {
				assertList(list, array)
			}

			if (options.expected.error) {
				assert.throws(() => options.action(list, array), options.expected.error)
				assert.strictEqual(list.minAllocatedSize, undefined)
				assertList(list, options.array)
			} else {
				assert.deepStrictEqual(options.action(list, array), options.expected.returnValue)
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

			assert.strictEqual(
				list.countSorted,
				options.expected.countSorted || (options.autoSort ? list.size : 0),
			)
		} catch (ex) {
			console.log(`Error in: ${
				options.description
				}\n${
				JSON.stringify(options, null, 4)
				}\n${options.action.toString()}\n`)
			throw ex
		} finally {
			if (unsubscribe) {
				unsubscribe()
			}
			TestList.totalListTests++
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

		(TestList._instance as TestList<T>).test(testCases)
	}

}
