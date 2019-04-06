import {
	IMapChangedEvent,
	MapChangedType,
} from '../../../../../../../main/common/lists/contracts/IMapChanged'
import {ObservableMap} from '../../../../../../../main/common/lists/ObservableMap'
import {IPropertyChangedEvent} from '../../../../../../../main/common/rx/object/PropertyChangedObject'
import {IOptionsVariant, IOptionsVariants, ITestCase, TestVariants} from './TestVariants'

declare const assert: any

export const THIS = {}

function compareEntities(o1, o2) {
	if (o1 > o2) {
		return 1
	} else if (o1 < o2) {
		return -1
	}

	const t1 = typeof o1
	const t2 = typeof o2

	if (t1 > t2) {
		return 1
	} else if (t1 < t2) {
		return -1
	}

	if (!o1.hashCode) {
		Object.defineProperty(o1, 'hashCode', {
			writable: false,
			enumerable: false,
			configurable: false,
			value: nextHashCode++,
		})
	}
	if (!o2.hashCode) {
		Object.defineProperty(o2, 'hashCode', {
			writable: false,
			enumerable: false,
			configurable: false,
			value: nextHashCode++,
		})
	}

	const h1 = o1.hashCode
	const h2 = o2.hashCode

	if (t1 > t2) {
		return 1
	} else if (t1 < t2) {
		return -1
	}

	return 0
}

export function applyMapChangedToArray<K, V>(event: IMapChangedEvent<K, V>, array: Array<[K, V]>) {
	switch (event.type) {
		case MapChangedType.Added:
			array.push([event.key, event.newValue])
			break
		case MapChangedType.Removed:
			const index = array.indexOf(event.oldValue)
			array.splice(index, 1)
			break
	}
}

export type IMapAction<K, V> = (map: ObservableMap<K, V>) => any

interface IMapOptionsVariant<K, V> {
	expected: Array<[K, V]>
	array: Array<[K, V]>

	reuseMapInstance?: boolean
	useMapChanged?: boolean
}

interface IMapExpected<K, V> {
	array?: Array<[K, V]>,
	error?: new () => Error,
	returnValue: any,
	mapChanged?: Array<IMapChangedEvent<K, V>>,
	propertyChanged?: IPropertyChangedEvent[],
}

interface IMapOptionsVariants<K, V> extends IOptionsVariants {
	array?: Array<[K, V]>[]

	reuseMapInstance?: boolean[]
	useMapChanged?: boolean[]
}

function assertMap<K, V>(map: ObservableMap<K, V>, expectedArray: Array<[K, V]>) {
	expectedArray = expectedArray.slice().sort()
	assert.deepStrictEqual(Array.from(map.keys()).sort(), expectedArray)
	assert.deepStrictEqual(Array.from(map.values()).sort(), expectedArray)
	assert.deepStrictEqual(Array.from(map.entries()).map(o => o[0]).sort(), expectedArray)
	assert.deepStrictEqual(Array.from(map.entries()).map(o => o[1]).sort(), expectedArray)
	assert.strictEqual(map.size, expectedArray.length)

	for (const item of expectedArray) {
		assert.strictEqual(map.has(item), true)
		assert.strictEqual(map.has(Math.random() as any), false)
	}

	assert.deepStrictEqual(Array.from(map).sort(), expectedArray)
}

const staticMapInner = new Map()
const staticMap = new ObservableMap({
	map: staticMapInner,
})

export class TestMap<K, V> extends TestVariants<
	IMapAction<K, V>,
	IMapExpected<K, V>,
	IMapOptionsVariant<K, V>,
	IMapOptionsVariants<K, V>
> {
	private constructor() {
		super()
	}

	public static totalMapTests: number = 0

	protected baseOptionsVariants: IMapOptionsVariants<K, V> = {
		reuseMapInstance: [false, true],
		useMapChanged: [false, true],
	}

	protected testVariant(options: IMapOptionsVariant<K, V> & IOptionsVariant<IMapAction<K, V>, IMapExpected<K, V>>) {
		let error
		for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
			let unsubscribeMapChanged
			let unsubscribePropertyChanged
			try {
				const array = options.array.slice()
				let map: ObservableMap<K, V>
				let mapInner = new Map<K, V>()
				for (const item of array) {
					mapInner.add(item)
				}

				if (options.reuseMapInstance) {
					staticMap.clear()
					for (const item of array) {
						staticMap.add(item)
					}
					map = staticMap as ObservableMap<K, V>
					mapInner = staticMapInner
				} else {
					map = new ObservableMap({
						map: mapInner,
					})
				}

				const arrayReplicate = array.slice(0, map.size)

				const mapChangedEvents = []
				if (options.useMapChanged) {
					unsubscribeMapChanged = map.mapChanged.subscribe(event => {
						mapChangedEvents.push(event)
						applyMapChangedToArray(event, arrayReplicate)
						assert.deepStrictEqual(arrayReplicate.sort(), Array.from(mapInner.values()).sort())
					})
				}

				const propertyChangedEvents = []
				unsubscribePropertyChanged = map.propertyChanged.subscribe(event => {
					propertyChangedEvents.push(event)
				})

				if (!options.reuseMapInstance) {
					assertMap(map, Array.from(mapInner.values()))
				}

				if (options.expected.error) {
					assert.throws(() => options.action(map), options.expected.error)
					assertMap(map, options.array)
				} else {
					assert.deepStrictEqual(options.action(map), options.expected.returnValue === THIS
						? map
						: options.expected.returnValue)
					assertMap(map, options.expected.array)
				}

				assert.deepStrictEqual(Array.from(mapInner.values()).sort(), Array.from(map.values()).sort())

				if (options.useMapChanged) {
					if (unsubscribeMapChanged) {
						unsubscribeMapChanged()
					}
					assert.deepStrictEqual(mapChangedEvents, options.expected.mapChanged || [])
					assert.deepStrictEqual(arrayReplicate.slice().sort(), Array.from(map.values()).sort())
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
				if (unsubscribeMapChanged) {
					unsubscribeMapChanged()
				}
				if (unsubscribePropertyChanged) {
					unsubscribePropertyChanged()
				}
				TestMap.totalMapTests++
			}
		}

		if (error) {
			throw error
		}
	}

	private static readonly _instance = new TestMap()

	public static test<K, V>(testCases: ITestCase<IMapAction<K, V>, IMapExpected<K, V>> & IMapOptionsVariants<K, V>) {
		(TestMap._instance as TestMap<K, V>).test(testCases)
	}
}
