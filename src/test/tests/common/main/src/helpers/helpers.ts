import {
	IDeSerializeValue,
	ISerializable, ISerializedObject,
	ISerializedTypedValue,
	ISerializeValue, ThenableIterator,
} from '../../../../../../main/common/extensions/serialization/contracts'
import {registerSerializable} from '../../../../../../main/common/extensions/serialization/serializers'
import {ArrayMap} from '../../../../../../main/common/lists/ArrayMap'
import {ArraySet} from '../../../../../../main/common/lists/ArraySet'
import {ObjectMap} from '../../../../../../main/common/lists/ObjectMap'
import {ObjectSet} from '../../../../../../main/common/lists/ObjectSet'
import {ObservableSet} from '../../../../../../main/common/lists/ObservableSet'
import {SortedList} from '../../../../../../main/common/lists/SortedList'
import {ObservableObject} from '../../../../../../main/common/rx/object/ObservableObject'
import {ObservableObjectBuilder} from '../../../../../../main/common/rx/object/ObservableObjectBuilder'

export class CircularClass extends ObservableObject implements ISerializable {
	public array: any[]
	public value: {}

	constructor(array: any[], value?: {}) {
		super()
		this.array = array
		this.value = value
	}

	// region ISerializable

	public static uuid: string = 'e729e03f-d0f4-4994-9f0f-97da23c7bab8'

	public serialize(serialize: ISerializeValue): ISerializedTypedValue {
		return {
			array: serialize(this.array),
			value: serialize(this.value),
		}
	}

	public *deSerialize(
		deSerialize: IDeSerializeValue,
		serializedValue: ISerializedObject,
	): ThenableIterator<any> {
		this.value = yield deSerialize(serializedValue.value)
	}

	// endregion
}

registerSerializable(CircularClass, {
	serializer: {
		*deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory: (...args) => CircularClass,
		): ThenableIterator<CircularClass> | CircularClass {
			const array = yield deSerialize(serializedValue.array)
			const value = valueFactory(array)
			yield value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})

new ObservableObjectBuilder(CircularClass.prototype)
	.writable('array')

export function createComplexObject() {
	const array = []
	const object: any = {}

	const circularClass = new CircularClass(array)
	circularClass.value = object

	Object.assign(object, {
		p1: void 0,
		p2: null,
		p3: false,
		p4: true,
		p5: '',
		p6: 'str',
		p7: new Date(),
		circularClass,
		object,
		array,
		sortedList: new SortedList() as any,
		set: new Set() as any,
		arraySet: new ArraySet() as any,
		objectSet: new ObjectSet() as any,
		map: new Map() as any,
		arrayMap: new ArrayMap() as any,
		objectMap: new ObjectMap() as any,
	})

	object.setObservable = new ObservableSet(object.set)
	object.arraySetObservable = new ObservableSet(object.arraySet)
	object.objectSetObservable = new ObservableSet(object.objectSet)

	object.mapObservable = new ObservableSet(object.map)
	object.arrayMapObservable = new ObservableSet(object.arrayMap)
	object.objectMapObservable = new ObservableSet(object.objectMap)

	for (const key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			const value = object[key]

			object.sortedList.add(value)

			object.set.add(value)
			if (value && typeof value === 'object') {
				object.arraySet.add(value)
			}
			object.objectSet.add(key)

			object.map.set(value, value)
			if (value && typeof value === 'object') {
				object.arrayMap.set(value, value)
			}
			object.objectMap.set(key, value)

			array.push(value)
		}
	}

	return object
}
