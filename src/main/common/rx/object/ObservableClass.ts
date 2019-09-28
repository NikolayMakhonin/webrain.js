import {IMergeOptions, IMergeValue} from '../../extensions/merge/contracts'
import {createMergeMapWrapper, mergeMaps} from '../../extensions/merge/merge-maps'
import {registerMerger} from '../../extensions/merge/mergers'
import {
	IDeSerializeValue,
	ISerializedObject,
	ISerializeOptions,
	ISerializeValue,
} from '../../extensions/serialization/contracts'
import {deSerializeObject, registerSerializer, serializeObject} from '../../extensions/serialization/serializers'
import '../extensions/autoConnect'
import {ObservableObject} from './ObservableObject'

export class ObservableClass extends ObservableObject
{

}

registerMerger<ObservableClass, object>(ObservableClass, {
	merger: {
		canMerge(target: object, source: object): boolean {
			return source instanceof Object
		},
		merge(
			merge: IMergeValue,
			base: ObservableClass,
			older: ObservableClass | object,
			newer: ObservableClass | object,
			set?: (value: ObservableClass) => void,
			preferCloneOlder?: boolean,
			preferCloneNewer?: boolean,
			options?: IMergeOptions,
		): boolean {
			return mergeMaps(
				createMergeMapWrapper,
				merge,
				base,
				older,
				newer,
				preferCloneOlder,
				preferCloneNewer,
				options,
			)
		},
	},
	preferClone: o => Object.isFrozen(o) ? true : null,
})

registerSerializer<ObservableClass>(ObservableClass, {
	uuid: '1380d053394748e58406c1c0e62a2be9',
	serializer: {
		serialize(
			serialize: ISerializeValue,
			value: ObservableClass,
			options?: ISerializeOptions,
		): ISerializedObject {
			return serializeObject(serialize, value, options)
		},
		deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory: (...args) => ObservableClass,
			// options?: IDeSerializeOptions,
		): ObservableClass {
			const value = valueFactory()
			return deSerializeObject(deSerialize, serializedValue, value)
		},
	},
	valueFactory: () => (new ObservableClass()),
})
