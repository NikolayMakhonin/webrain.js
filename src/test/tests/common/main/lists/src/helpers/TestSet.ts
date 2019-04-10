import {IPropertyChangedEvent} from '../../../../../../../main/common/lists/contracts/IPropertyChanged'
import {
	ISetChangedEvent,
	SetChangedType,
} from '../../../../../../../main/common/lists/contracts/ISetChanged'
import {compareFast} from '../../../../../../../main/common/lists/helpers/compare'
import {ObjectSet} from '../../../../../../../main/common/lists/ObjectSet'
import {ObservableSet} from '../../../../../../../main/common/lists/ObservableSet'
import {indexOfNaN} from './common'
import {IOptionsVariant, IOptionsVariants, ITestCase, TestVariants} from './TestVariants'

declare const assert

export const THIS = {}

export function applySetChangedToArray<T>(event: ISetChangedEvent<T>, array: T[]) {
	switch (event.type) {
		case SetChangedType.Added:
			for (const item of event.newItems) {
				array.push(item)
			}
			break
		case SetChangedType.Removed:
			for (const item of event.oldItems) {
				const index = item === item
					? array.indexOf(item)
					: indexOfNaN(array)
				array.splice(index, 1)
			}
			break
	}
}

export type ISetAction<T> = (set: ObservableSet<T>) => any

interface ISetOptionsVariant<T> {
	expected: T[]
	array: T[]

	reuseSetInstance?: boolean
	useSetChanged?: boolean
	useObjectSet?: boolean
}

interface ISetExpected<T> {
	array?: T[],
	error?: new () => Error,
	returnValue: any,
	setChanged?: Array<ISetChangedEvent<T>>,
	propertyChanged?: IPropertyChangedEvent[],
}

interface ISetOptionsVariants<T> extends IOptionsVariants {
	array?: T[][]

	reuseSetInstance?: boolean[]
	useSetChanged?: boolean[]
	useObjectSet?: boolean[]
}

function assertSet<T>(set: ObservableSet<T>, expectedArray: T[]) {
	expectedArray = expectedArray.slice().sort(compareFast)
	assert.deepStrictEqual(Array.from(set.keys()).sort(compareFast), expectedArray)
	assert.deepStrictEqual(Array.from(set.values()).sort(compareFast), expectedArray)
	assert.deepStrictEqual(Array.from(set.entries()).map(o => o[0]).sort(compareFast), expectedArray)
	assert.deepStrictEqual(Array.from(set.entries()).map(o => o[1]).sort(compareFast), expectedArray)
	assert.strictEqual(set.size, expectedArray.length)

	for (const item of expectedArray) {
		assert.strictEqual(set.has(item), true)
		assert.strictEqual(set.has(Math.random() as any), false)
	}

	const forEachArray = []
	const thisArg = {}
	set.forEach(function(value, key, instance) {
		assert.strictEqual(this, thisArg)
		assert.strictEqual(instance, set)
		forEachArray.push([key, value])
	}, thisArg)
	assert.deepStrictEqual(forEachArray.map(o => o[0]).sort(compareFast), expectedArray)
	assert.deepStrictEqual(forEachArray.map(o => o[1]).sort(compareFast), expectedArray)

	assert.deepStrictEqual(Array.from(set).sort(compareFast), expectedArray)
}

const staticSetInner = new Set()
const staticSet = new ObservableSet({
	set: staticSetInner,
})

export class TestSet<T> extends TestVariants<
	ISetAction<T>,
	ISetExpected<T>,
	ISetOptionsVariant<T>,
	ISetOptionsVariants<T>
> {
	private constructor() {
		super()
	}

	public static totalSetTests: number = 0

	protected baseOptionsVariants: ISetOptionsVariants<T> = {
		reuseSetInstance: [false, true],
		useSetChanged: [false, true],
		useObjectSet: [false, true],
	}

	protected testVariant(options: ISetOptionsVariant<T> & IOptionsVariant<ISetAction<T>, ISetExpected<T>>) {
		let error
		for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
			let unsubscribeSetChanged
			let unsubscribePropertyChanged
			try {
				const array = options.array.slice()
				let set: ObservableSet<T>
				let setInner: Set<T>

				if (options.reuseSetInstance) {
					staticSet.clear()
					for (const item of array) {
						staticSet.add(item)
					}
					set = staticSet as ObservableSet<T>
					setInner = staticSetInner
				} else {
					setInner = options.useObjectSet
						? new ObjectSet({}) as any
						: new Set() as any

					for (const item of array) {
						setInner.add(item)
					}

					set = new ObservableSet({
						set: setInner,
					})
				}

				const arrayReplicate = array.slice(0, set.size)

				const setChangedEvents = []
				if (options.useSetChanged) {
					unsubscribeSetChanged = set.setChanged.subscribe(event => {
						setChangedEvents.push(event)
						applySetChangedToArray(event, arrayReplicate)
						assert.deepStrictEqual(arrayReplicate.slice().sort(compareFast), Array.from(setInner.values()).sort(compareFast))
					})
				}

				const propertyChangedEvents = []
				unsubscribePropertyChanged = set.propertyChanged.subscribe(event => {
					propertyChangedEvents.push(event)
				})

				if (!options.reuseSetInstance) {
					assertSet(set, Array.from(setInner.values()))
				}

				if (options.expected.error) {
					assert.throws(() => options.action(set), options.expected.error)
					assertSet(set, options.array)
				} else {
					assert.deepStrictEqual(options.action(set), options.expected.returnValue === THIS
						? set
						: options.expected.returnValue)
					assertSet(set, options.expected.array)
				}

				assert.deepStrictEqual(Array.from(setInner.values()).sort(compareFast), Array.from(set.values()).sort(compareFast))

				if (options.useSetChanged) {
					if (unsubscribeSetChanged) {
						unsubscribeSetChanged()
					}
					assert.deepStrictEqual(setChangedEvents, options.expected.setChanged || [])
					assert.deepStrictEqual(arrayReplicate.slice().sort(compareFast), Array.from(set.values()).sort(compareFast))
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
				if (unsubscribeSetChanged) {
					unsubscribeSetChanged()
				}
				if (unsubscribePropertyChanged) {
					unsubscribePropertyChanged()
				}
				TestSet.totalSetTests++
			}
		}

		if (error) {
			throw error
		}
	}

	private static readonly _instance = new TestSet()

	public static test<T>(testCases: ITestCase<ISetAction<T>, ISetExpected<T>> & ISetOptionsVariants<T>) {
		(TestSet._instance as TestSet<T>).test(testCases)
	}
}
