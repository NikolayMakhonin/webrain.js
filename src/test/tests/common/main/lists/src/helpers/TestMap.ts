import {ThenableIterator} from '../../../../../../../main/common/async/async'
import {
	IDeSerializeValue, ISerializable,
	ISerializedObject,
	ISerializeValue,
} from '../../../../../../../main/common/extensions/serialization/contracts'
import {
	ObjectSerializer, registerSerializable,
	registerSerializer,
} from '../../../../../../../main/common/extensions/serialization/serializers'
import {ArrayMap} from '../../../../../../../main/common/lists/ArrayMap'
import {IMapChangedEvent, MapChangedType} from '../../../../../../../main/common/lists/contracts/IMapChanged'
import {IPropertyChangedEvent} from '../../../../../../../main/common/lists/contracts/IPropertyChanged'
import {compareFast} from '../../../../../../../main/common/lists/helpers/compare'
import {ObjectHashMap} from '../../../../../../../main/common/lists/ObjectHashMap'
import {ObjectMap} from '../../../../../../../main/common/lists/ObjectMap'
import {ObservableMap} from '../../../../../../../main/common/lists/ObservableMap'
import {Assert} from '../../../../../../../main/common/test/Assert'
import {DeepCloneEqual} from '../../../../../../../main/common/test/DeepCloneEqual'
import {IOptionsVariant, IOptionsVariants, ITestCase, TestVariants, THIS} from '../../../src/helpers/TestVariants'
import {convertToObject} from './common'

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
	innerMap?: string
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
	innerMap?: string[]
}

function testSerialization<K, V>(map: Map<K, V>) {
	const serialized = ObjectSerializer.default.serialize(map)
	const result: Map<K, V> = ObjectSerializer.default.deSerialize(serialized)

	assert.notStrictEqual(result, map)
	assert.deepStrictEqual(Array.from(result.entries()), Array.from(map.entries()))
}

function assertMap<K, V>(map: Map<K, V>, expectedArray: Array<[K, V]>) {
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

	const forEachArray = []
	const thisArg = {}
	map.forEach(function(value, key, instance) {
		assert.strictEqual(this, thisArg)
		assert.strictEqual(instance, map)
		forEachArray.push([key, value])
	}, thisArg)
	assert.deepStrictEqual(forEachArray.sort(compareEntries), expectedArray)

	assert.deepStrictEqual(Array.from(map).sort(compareEntries), expectedArray)

	testSerialization(map)
}

const staticMapInner = new Map()
const staticMap = new ObservableMap(staticMapInner)

// class ObjectMapWrapper<V> implements Map<string, V> {
// 	private readonly _object: { [key: string]: V }
// 	constructor(object: { [key: string]: V }) {
// 		this._object = object
// 	}
//
// 	public get size(): number {
// 		return Object.keys(this._object).length
// 	}
//
// 	public entries(): IterableIterator<[string, V]> {
// 		const {_object} = this
// 		return Object.keys(_object).map(o => [o, _object[o]] as [string, V])[Symbol.iterator]()
// 	}
//
// 	public set(key: string, value: V): this {
// 		this._object[key] = value
// 		return this
// 	}
//
// }
class MapWrapper<K, V> implements Map<K, V>, ISerializable {
	private readonly _map: Map<any, any>

	constructor(map: Map<any, any>) {
		this._map = map
	}

	public readonly [Symbol.toStringTag]: string = 'Map'
	public get size(): number {
		return this._map.size
	}

	public *[Symbol.iterator](): IterableIterator<[K, V]> {
		for (const item of this._map) {
			yield [item[0].value, item[1]]
		}
	}

	public clear(): void {
		this._map.clear()
	}

	public delete(key: K): boolean {
		return this._map.delete(convertToObject(key))
	}

	public *entries(): IterableIterator<[K, V]> {
		for (const entry of this._map.entries()) {
			yield [entry[0].value, entry[1]]
		}
	}

	public forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
		this._map.forEach(function(value, key) {
			callbackfn(value, key.value, this)
		}, thisArg)
	}

	public get(key: K): V | undefined {
		return this._map.get(convertToObject(key))
	}

	public has(key: K): boolean {
		return this._map.has(convertToObject(key))
	}

	public *keys(): IterableIterator<K> {
		for (const item of this._map.keys()) {
			yield item.value
		}
	}

	public set(key: K, value: V): this {
		this._map.set(convertToObject(key), value)
		return this
	}

	public values(): IterableIterator<V> {
		return this._map.values()
	}

	// region ISerializable

	public static uuid: string = 'bc06eeb6-5139-444a-a735-57a6e1928ac9'

	public serialize(serialize: ISerializeValue): ISerializedObject {
		return {
			map: serialize(this._map),
		}
	}

	// tslint:disable-next-line:no-empty
	public deSerialize(deSerialize: IDeSerializeValue, serializedValue: ISerializedObject) {

	}

	// endregion
}

registerSerializable(MapWrapper, {
	serializer: {
		*deSerialize<K, V>(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory: (map?: Map<K, V>) => MapWrapper<K, V>,
		): ThenableIterator<MapWrapper<K, V>> {
			const innerMap = yield deSerialize<Map<K, V>>(serializedValue.map)
			const value = valueFactory(innerMap)
			value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
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
		innerMap: ['Map', 'Map<Object>', 'ObjectMap', 'ObjectHashMap', 'ArrayMap'],
	}

	protected testVariant(options: IMapOptionsVariant<K, V> & IOptionsVariant<IMapAction<K, V>, IMapExpected<K, V>>) {
		let error
		for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
			let unsubscribeMapChanged
			let unsubscribePropertyChanged
			try {
				const array = options.array.map(o => o.slice() as [K, V])
				let map: ObservableMap<K, V>
				let mapInner: Map<K, V>

				if (options.reuseMapInstance) {
					staticMap.clear()
					for (const item of array) {
						staticMap.set(...item)
					}
					map = staticMap as ObservableMap<K, V>
					mapInner = staticMapInner
				} else {
					switch (options.innerMap) {
						case 'ObjectMap':
							mapInner = new ObjectMap({}) as any
							break
						case 'ObjectHashMap':
							mapInner = new MapWrapper(new ObjectHashMap({})) as any
							break
						case 'ArrayMap':
							mapInner = new MapWrapper(new ArrayMap([])) as any
							break
						case 'Map<Object>':
							mapInner = new MapWrapper(new Map()) as any
							break
						case 'Map':
							mapInner = new Map() as any
							break
						default:
							assert.fail('Unknown options.innerMap: ' + options.innerMap)
							break
					}

					for (const item of array) {
						mapInner.set(...item)
					}

					map = new ObservableMap(mapInner)
				}

				const arrayReplicate = array.map(o => o.slice() as [K, V])

				const mapChangedEvents = []
				if (options.useMapChanged) {
					unsubscribeMapChanged = map.mapChanged.subscribe(event => {
						mapChangedEvents.push(event)
						applyMapChangedToArray(event, arrayReplicate)
						if (event.type !== MapChangedType.Removed || mapInner.size > 0) {
							assert.deepStrictEqual(
								arrayReplicate.map(o => o.slice() as [K, V]).sort(compareEntries),
								Array.from(mapInner.entries()).sort(compareEntries),
							)
						}
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

	public static test<K, V>(
		testCases: ITestCase<IMapAction<K, V>, IMapExpected<K, V>, IMapOptionsVariant<K, V>> & IMapOptionsVariants<K, V>,
	) {
		(TestMap._instance as TestMap<K, V>).test(testCases)
	}
}
