import {ArraySet} from '../../../../../../../main/common/lists/ArraySet'
import {IPropertyChangedEvent} from '../../../../../../../main/common/lists/contracts/IPropertyChanged'
import {
	ISetChangedEvent,
	SetChangedType,
} from '../../../../../../../main/common/lists/contracts/ISetChanged'
import {compareFast} from '../../../../../../../main/common/lists/helpers/compare'
import {ObjectSet} from '../../../../../../../main/common/lists/ObjectSet'
import {ObservableSet} from '../../../../../../../main/common/lists/ObservableSet'
import {IOptionsVariant, IOptionsVariants, ITestCase, TestVariants, THIS} from '../../../helpers/TestVariants'
import {indexOfNaN} from './common'

declare const assert

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
	innerSet?: string
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
	innerSet?: string[]
}

function assertSet<T>(set: ObservableSet<T>, expectedArray: T[]) {
	expectedArray = expectedArray.sort(compareFast)
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
const staticSet = new ObservableSet(staticSetInner)

const valueToObjectMap = new Map()
function convertToObject(value: any) {
	if (value
		&& typeof value === 'object'
		&& Object.prototype.hasOwnProperty.call(value, 'value')
	) {
		assert.fail('typeof value === ' + typeof value)
	}

	let obj = valueToObjectMap.get(value)
	if (!obj) {
		valueToObjectMap.set(value, obj = {value})
	}

	return obj
}

class SetWrapper implements Set<string> {
	private readonly _set: Set<any>

	constructor(set: Set<any>) {
		this._set = set
	}

	public readonly [Symbol.toStringTag]: string = 'Set'
	public get size(): number {
		return this._set.size
	}

	public *[Symbol.iterator](): IterableIterator<string> {
		for (const item of this._set) {
			yield item.value
		}
	}

	public add(value: string): this {
		this._set.add(convertToObject(value))
		return this
	}

	public clear(): void {
		this._set.clear()
	}

	public delete(value: string): boolean {
		return this._set.delete(convertToObject(value))
	}

	public *entries(): IterableIterator<[string, string]> {
		for (const entry of this._set.entries()) {
			yield [entry[0].value, entry[1].value]
		}
	}

	public forEach(callbackfn: (key: string, value: string, set: Set<string>) => void, thisArg?: any): void {
		this._set.forEach(function(key, value) {
			callbackfn(key.value, value.value, this)
		}, thisArg)
	}

	public has(value: string): boolean {
		return this._set.has(convertToObject(value))
	}

	public *keys(): IterableIterator<string> {
		for (const item of this._set.keys()) {
			yield item.value
		}
	}

	public *values(): IterableIterator<string> {
		for (const item of this._set.values()) {
			yield item.value
		}
	}
}

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
		innerSet: ['Set', 'Set<Object>', 'ObjectSet', 'ArraySet'],
		convertToObject: [false, true],
	}

	protected testVariant(options: ISetOptionsVariant<T> & IOptionsVariant<ISetAction<T>, ISetExpected<T>>) {
		let error
		for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
			let unsubscribeSetChanged
			let unsubscribePropertyChanged
			try {
				const array = options.array.slice()
				const expectedArray = options.expected.array.slice()

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
					switch (options.innerSet) {
						case 'ObjectSet':
							setInner = new ObjectSet({}) as any
							break
						case 'ArraySet':
							setInner = new SetWrapper(new ArraySet([])) as any
							break
						case 'Set<Object>':
							setInner = new SetWrapper(new Set()) as any
							break
						case 'Set':
							setInner = new Set() as any
							break
						default:
							assert.fail('Unknown options.innerSet: ' + options.innerSet)
							break
					}

					for (const item of array) {
						setInner.add(item)
					}

					set = new ObservableSet(setInner)
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
					assertSet(set, array)
				} else {
					assert.deepStrictEqual(options.action(set), options.expected.returnValue === THIS
						? set
						: options.expected.returnValue)
					assertSet(set, expectedArray)
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
					&& array.length !== expectedArray.length
				) {
					expectedPropertyChanged = [{
						name: 'size',
						oldValue: array.length,
						newValue: expectedArray.length,
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
