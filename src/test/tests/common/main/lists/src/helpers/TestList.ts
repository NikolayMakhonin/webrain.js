import {ObjectSerializer} from '../../../../../../../main/common/extensions/serialization/serializers'
import {TClass} from '../../../../../../../main/common/helpers/helpers'
import {ICompare} from '../../../../../../../main/common/lists/contracts/ICompare'
import {
	IListChangedEvent,
	ListChangedType,
} from '../../../../../../../main/common/lists/contracts/IListChanged'
import {IPropertyChangedEvent} from '../../../../../../../main/common/lists/contracts/IPropertyChanged'
import {compareFast} from '../../../../../../../main/common/lists/helpers/compare'
import {SortedList} from '../../../../../../../main/common/lists/SortedList'
import {Assert} from '../../../../../../../main/common/test/Assert'
import {DeepCloneEqual} from '../../../../../../../main/common/test/DeepCloneEqual'
import {IOptionsVariant, IOptionsVariants, ITestCase, TestVariants} from '../../../src/helpers/TestVariants'

export const assert = new Assert(new DeepCloneEqual({
	commonOptions: {

	},
	equalOptions: {
		// noCrossReferences: true,
		equalInnerReferences: true,
		equalTypes: true,
		equalMapSetOrder: true,
		strictEqualFunctions: true,
	},
}))

export function applyListChangedToArray<T>(event: IListChangedEvent<T>, array: T[], compare: ICompare<T>) {
	switch (event.type) {
		case ListChangedType.Added:
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
		case ListChangedType.Removed:
			for (let i = 0; i < event.oldItems.length; i++) {
				assert.strictEqual(array[event.index + i], event.oldItems[i])
			}
			for (let i = event.shiftIndex; i < array.length; i++) {
				array[event.index + i - event.shiftIndex] = array[i]
			}
			array.length -= event.oldItems.length
			break
		case ListChangedType.Set:
			assert.strictEqual(array[event.index], event.oldItems[0])
			array[event.index] = event.newItems[0]
			if (event.moveIndex !== event.index) {
				array.splice(event.moveIndex, 0, ...array.splice(event.index, 1))
			}
			break
		case ListChangedType.Moved:
			array.splice(event.moveIndex, 0, ...array.splice(event.index, event.moveSize))
			break
		case ListChangedType.Resorted:
			array.sort(compare)
			break
	}
}

export type IListAction<T> = (list: SortedList<T>, array?: T[]) => any

interface IListOptionsVariant<T> {
	expected: T[]
	array: T[]

	compare?: ICompare<T>
	withCompare?: boolean
	reuseListInstance?: boolean
	useListChanged?: boolean
	autoSort?: boolean
	notAddIfExists?: boolean
	countSorted?: number
}

interface IListExpected<T> {
	array?: T[],
	error?: TClass<Error>|Array<TClass<Error>>
	returnValue: any,
	defaultValue: any,
	listChanged?: Array<IListChangedEvent<T>>,
	propertyChanged?: IPropertyChangedEvent[],
	countSorted?: number
}

interface IListOptionsVariants<T> extends IOptionsVariants {
	array?: T[][]

	compare?: Array<ICompare<T>>
	withCompare?: boolean[]
	reuseListInstance?: boolean[]
	useListChanged?: boolean[]
	autoSort?: boolean[]
	notAddIfExists?: boolean[]
	countSorted?: number[]
}

function equalsWithNaN(o1, o2) {
	return o1 === o2 || (o1 !== o1) && (o2 !== o2)
}

function testSerialization<T>(list: SortedList<T>) {
	const serialized = ObjectSerializer.default.serialize(list)
	const result: SortedList<T> = ObjectSerializer.default.deSerialize(serialized)

	assert.notStrictEqual(result, list)
	assert.strictEqual(!!result.autoSort, !!list.autoSort)
	assert.strictEqual(result.countSorted, list.countSorted)
	assert.strictEqual(result.minAllocatedSize, list.minAllocatedSize)
	assert.strictEqual(!!result.notAddIfExists, !!list.notAddIfExists)
	assert.strictEqual(result.size, list.size)
	assert.deepStrictEqual(result.toArray(), list.toArray())
}

function assertList<T>(list: SortedList<T>, expectedArray: T[]) {
	assert.deepStrictEqual(list.toArray(), expectedArray)
	assert.strictEqual(list.size, expectedArray.length)
	assert.ok(list.allocatedSize >= expectedArray.length)

	for (let i = 0; i < expectedArray.length; i++) {
		assert.ok(equalsWithNaN(list.get(i), expectedArray[i]))
		assert.ok(equalsWithNaN(expectedArray[list.indexOf(expectedArray[i])], expectedArray[i]))
		assert.strictEqual(list.contains(expectedArray[i]), true)
		assert.strictEqual(list.contains(Math.random() as any), false)
	}

	assert.deepStrictEqual(Array.from(list), expectedArray)

	testSerialization(list)
}

const staticArray = []
const staticList = new SortedList({
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
		useListChanged: [false, true],
	}

	protected testVariant(options: IListOptionsVariant<T> & IOptionsVariant<IListAction<T>, IListExpected<T>>) {
		let error
		for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
			let unsubscribeListChanged
			let unsubscribePropertyChanged
			try {
				let array = options.array.slice()
				// assert.deepStrictEqual(array, array.slice().sort(compareFast))
				const compare = options.compare || (options.withCompare ? compareFast : undefined)
				let list: SortedList<T>

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
					list = staticList as SortedList<T>
					array = staticArray
				} else {
					list = new SortedList({
						array,
						compare,
						autoSort: options.autoSort,
						notAddIfExists: options.notAddIfExists,
						countSorted: options.countSorted,
					})
				}

				assert.strictEqual(list.countSorted, options.countSorted || 0)

				const arrayReplicate = options.autoSort
					? array.slice(0, list.size).sort(compare || compareFast)
					: array.slice(0, list.size)

				// assert.strictEqual(
				// 	list.countSorted,
				// 	options.autoSort ? list.size : options.countSorted || 0,
				// )

				const listChangedEvents = []
				if (options.useListChanged) {
					unsubscribeListChanged = list.listChanged.subscribe(event => {
						listChangedEvents.push(event)
						applyListChangedToArray(event, arrayReplicate, compare || compareFast)

						if (event.type !== ListChangedType.Resorted) {
							assert.deepStrictEqual(arrayReplicate, array.slice(0, list.size))
						}
					})
				}

				const propertyChangedEvents = []
				unsubscribePropertyChanged = list.propertyChanged.subscribe(event => {
					propertyChangedEvents.push(event)
				})

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

				if (options.useListChanged) {
					if (unsubscribeListChanged) {
						unsubscribeListChanged()
					}
					assert.deepStrictEqual(listChangedEvents, options.expected.listChanged || [])
					assert.deepStrictEqual(arrayReplicate, list.toArray())
				}

				if (unsubscribePropertyChanged) {
					unsubscribePropertyChanged()
				}

				let expectedPropertyChanged = options.expected.propertyChanged
				if (!expectedPropertyChanged
					&& !options.expected.error
					&& options.array.length !== options.expected.array.length
				) {
					expectedPropertyChanged = [{
						name: 'size',
						oldValue: options.array.length,
						newValue: options.expected.array.length,
					}]
				}

				assert.deepStrictEqual(propertyChangedEvents, expectedPropertyChanged || [])

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
				if (unsubscribeListChanged) {
					unsubscribeListChanged()
				}
				if (unsubscribePropertyChanged) {
					unsubscribePropertyChanged()
				}
				TestList.totalListTests++
			}
		}

		if (error) {
			throw error
		}
	}

	private static readonly _instance = new TestList()

	public static test<T>(
		testCases: ITestCase<IListAction<T>, IListExpected<T>, IListOptionsVariant<T>> & IListOptionsVariants<T>,
	) {
		let maxArrayLength = 0
		if (testCases.array) {
			for (let i = 0; i < testCases.array.length; i++) {
				const array = testCases.array[i]
				if (array.length > maxArrayLength) {
					maxArrayLength = array.length
				}
			}
		}

		if (maxArrayLength <= 1
			&& !testCases.expected.error
			&& (!testCases.expected.array || testCases.expected.array.length <= 1)
		) {
			testCases.autoSort = [false, true]
		}

		if (!testCases.countSorted
			&& maxArrayLength <= 1
			&& (!testCases.compare || testCases.compare.length <= 0)
		) {
			const compare = testCases.compare && testCases.compare.length && testCases.compare[0]
				|| compareFast

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
