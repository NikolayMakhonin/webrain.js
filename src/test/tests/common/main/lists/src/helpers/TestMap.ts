import {
	IMapChangedEvent,
	MapChangedType,
} from '../../../../../../../main/common/lists/contracts/IMapChanged'
import {compareFast} from '../../../../../../../main/common/lists/helpers/compare'
import {ObservableMap} from '../../../../../../../main/common/lists/ObservableMap'
import {IPropertyChangedEvent} from '../../../../../../../main/common/rx/object/PropertyChangedObject'
import {IOptionsVariant, IOptionsVariants, ITestCase, TestVariants} from './TestVariants'

declare const assert: any

export const THIS = {}

function compareEntries<K, V>(o1: [K, V], o2: [K, V]) {
	return compareFast(o1[0], o2[0])
}

function indexOf<K, V>(array: Array<[K, V]>, item: [K, V]) {
	for (let i = 0; i < array.length; i++) {
		if (compareEntries(array[i], item) === 0) {
			return i
		}
	}

	return -1
}

export function applyMapChangedToArray<K, V>(event: IMapChangedEvent<K, V>, array: Array<[K, V]>) {
	switch (event.type) {
		case MapChangedType.Added:
			array.push([event.key, event.newValue])
			break
		case MapChangedType.Removed:
			{
				const index = indexOf(array, [event.key, event.newValue])
				array.splice(index, 1)
			}
			break
		case MapChangedType.Set:
			{
				const index = indexOf(array, [event.key, undefined])
				array[index][1] = event.newValue
			}
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
	array?: Array<Array<[K, V]>>

	reuseMapInstance?: boolean[]
	useMapChanged?: boolean[]
}

function assertMap<K, V>(map: ObservableMap<K, V>, expectedArray: Array<[K, V]>) {
	expectedArray = expectedArray.map(o => o.slice() as [K, V]).sort(compareEntries)
	assert.deepStrictEqual(Array.from(map.keys()).sort(compareFast), expectedArray.map(o => o[0]))
	assert.deepStrictEqual(Array.from(map.values()).sort(compareFast), expectedArray.map(o => o[1]).sort(compareFast))
	assert.deepStrictEqual(Array.from(map.entries()).sort(compareEntries), expectedArray)
	assert.deepStrictEqual(Array.from(map.entries()).sort(compareEntries), expectedArray)
	assert.strictEqual(map.size, expectedArray.length)

	for (const item of expectedArray) {
		assert.strictEqual(map.has(item[0]), true)
		assert.strictEqual(map.has(Math.random() as any), false)
	}

	assert.deepStrictEqual(Array.from(map).sort(compareEntries), expectedArray)
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
				const array = options.array.map(o => o.slice() as [K, V])
				let map: ObservableMap<K, V>
				let mapInner = new Map<K, V>()
				for (const item of array) {
					mapInner.set(...item)
				}

				if (options.reuseMapInstance) {
					staticMap.clear()
					for (const item of array) {
						staticMap.set(...item)
					}
					map = staticMap as ObservableMap<K, V>
					mapInner = staticMapInner
				} else {
					map = new ObservableMap({
						map: mapInner,
					})
				}

				const arrayReplicate = array.map(o => o.slice() as [K, V])

				const mapChangedEvents = []
				if (options.useMapChanged) {
					unsubscribeMapChanged = map.mapChanged.subscribe(event => {
						mapChangedEvents.push(event)
						applyMapChangedToArray(event, arrayReplicate)
						assert.deepStrictEqual(
							arrayReplicate.map(o => o.slice() as [K, V]).sort(compareEntries),
							Array.from(mapInner.entries()).sort(compareEntries),
						)
					})
				}

				const propertyChangedEvents = []
				unsubscribePropertyChanged = map.propertyChanged.subscribe(event => {
					propertyChangedEvents.push(event)
				})

				if (!options.reuseMapInstance) {
					assertMap(map, Array.from(mapInner.entries()))
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

				assert.deepStrictEqual(
					Array.from(mapInner.entries()).sort(compareEntries),
					Array.from(map.entries()).sort(compareEntries),
				)

				if (options.useMapChanged) {
					if (unsubscribeMapChanged) {
						unsubscribeMapChanged()
					}
					assert.deepStrictEqual(mapChangedEvents, options.expected.mapChanged || [])
					assert.deepStrictEqual(
						arrayReplicate.map(o => o.slice() as [K, V]).sort(compareEntries),
						Array.from(map.entries()).sort(compareEntries),
					)
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
