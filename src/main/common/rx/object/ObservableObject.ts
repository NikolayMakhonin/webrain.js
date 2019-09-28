import {IMergeOptions, IMergeValue} from '../../extensions/merge/contracts'
import {mergeMaps, MergeObjectWrapper} from '../../extensions/merge/merge-maps'
import {registerMerger} from '../../extensions/merge/mergers'
import {
	IDeSerializeValue,
	ISerializedObject,
	ISerializeOptions,
	ISerializeValue,
} from '../../extensions/serialization/contracts'
import {deSerializeObject, registerSerializer, serializeObject} from '../../extensions/serialization/serializers'
import '../extensions/autoConnect'
import {ObservableClass} from './ObservableClass'

export class ObservableObject extends ObservableClass
{

}

registerMerger<ObservableObject, object>(ObservableObject, {
	merger: {
		canMerge(target: object, source: object): boolean {
			return source instanceof Object
		},
		merge(
			merge: IMergeValue,
			base: ObservableObject,
			older: ObservableObject | object,
			newer: ObservableObject | object,
			set?: (value: ObservableObject) => void,
			preferCloneOlder?: boolean,
			preferCloneNewer?: boolean,
			options?: IMergeOptions,
		): boolean {
			return mergeMaps(
				(target, source) => new MergeObjectWrapper(source),
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

registerSerializer<ObservableObject>(ObservableObject, {
	uuid: '1380d053394748e58406c1c0e62a2be9',
	serializer: {
		serialize(
			serialize: ISerializeValue,
			value: ObservableObject,
			options?: ISerializeOptions,
		): ISerializedObject {
			return serializeObject(serialize, value, options)
		},
		deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory: (...args) => ObservableObject,
			// options?: IDeSerializeOptions,
		): ObservableObject {
			const value = valueFactory()
			return deSerializeObject(deSerialize, serializedValue, value)
		},
	},
	valueFactory: () => (new ObservableObject()),
})
