/* tslint:disable:object-literal-key-quotes */
import {
	IDeSerializeValue,
	ISerializable, ISerializedObject,
	ISerializedTypedValue,
	ISerializeValue,
} from '../../../../../../main/common/extensions/serialization/contracts'
import {registerSerializable} from '../../../../../../main/common/extensions/serialization/serializers'
import {isIterable} from '../../../../../../main/common/helpers/helpers'
import {ThenableSyncIterator} from '../../../../../../main/common/helpers/ThenableSync'
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
	): ThenableSyncIterator<any> {
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
		): ThenableSyncIterator<CircularClass> | CircularClass {
			const array = yield deSerialize(serializedValue.array)
			const value = valueFactory(array)
			yield value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})

new ObservableObjectBuilder(CircularClass.prototype)
	.writable('array')

export interface IComplexObjectOptions {
	undefined?: boolean,

	circular?: boolean,

	circularClass?: boolean,

	sortedList?: boolean,

	set?: boolean,
	arraySet?: boolean,
	objectSet?: boolean,
	observableSet?: boolean,

	map?: boolean,
	arrayMap?: boolean,
	objectMap?: boolean,
	observableMap?: boolean,
}

// const defaultOptions: IOptions = {
// 	circular: true,
//
// 	circularClass: true,
//
// 	sortedList: true,
//
// 	set: true,
// 	arraySet: true,
// 	objectSet: true,
// 	observableSet: true,
//
// 	map: true,
// 	arrayMap: true,
// 	objectMap: true,
// 	observableMap: true,
// }

export function createComplexObject(options: IComplexObjectOptions = {}) {
	// options = {
	// 	...defaultOptions,
	// 	...options,
	// }

	const array = []
	const object: any = {}

	const circularClass = new CircularClass(array)
	circularClass.value = object

	Object.assign(object, {
		_undefined: void 0,
		_null: null,
		_false: false,
		_strEmpty: '',
		_zero: 0,
		true: true,
		str: 'str',
		date: new Date(12345),
		number: 123.45,
		'nan': NaN,
		'infinity': Infinity,
		'-infinity': -Infinity,
		circularClass: options.circular && options.circularClass && circularClass,
		object: options.circular && object,
		array,
		sortedList: options.sortedList && new SortedList() as any,
		set: options.set && new Set() as any,
		arraySet: options.arraySet && new ArraySet() as any,
		objectSet: options.objectSet && new ObjectSet() as any,
		map: options.map && new Map() as any,
		arrayMap: options.arrayMap && new ArrayMap() as any,
		objectMap: options.objectMap && new ObjectMap() as any,
	})

	object.setObservable = options.set && options.observableSet && new ObservableSet(object.set)
	object.arraySetObservable = options.arraySet && options.observableSet && new ObservableSet(object.arraySet)
	object.objectSetObservable = options.objectSet && options.observableSet && new ObservableSet(object.objectSet)

	object.mapObservable = options.map && options.observableMap && new ObservableSet(object.map)
	object.arrayMapObservable = options.arrayMap && options.observableMap && new ObservableSet(object.arrayMap)
	object.objectMapObservable = options.objectMap && options.observableMap && new ObservableSet(object.objectMap)

	const valueIsCollection = value => {
		return value && (
			isIterable(value)
			|| value.constructor === Object
		)
	}

	for (const key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			const value = object[key]

			if (!value && !key.startsWith('_')) {
				delete object[key]
				continue
			}

			if (!options.undefined && typeof value === 'undefined') {
				delete object[key]
			}

			if (options.circular || !valueIsCollection(value)) {
				if (object.sortedList) {
					object.sortedList.add(value)
				}

				if (object.set) {
					object.set.add(value)
				}
				if (object.arraySet && value && typeof value === 'object') {
					object.arraySet.add(value)
				}
				if (object.objectSet) {
					object.objectSet.add(key)
				}

				if (object.map) {
					object.map.set(value, value)
				}
				if (object.arrayMap && value && typeof value === 'object') {
					object.arrayMap.set(value, value)
				}
				if (object.objectMap) {
					object.objectMap.set(key, value)
				}

				if (object.array) {
					array.push(value)
				}
			}
		}
	}

	return object
}