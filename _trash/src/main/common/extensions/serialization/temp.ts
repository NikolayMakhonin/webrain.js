/* tslint:disable:no-empty */
import {ObservableMap} from '../../../../../../src/main/common/lists/ObservableMap'
import {TClass} from '../../../../../../src/main/common/extensions/TypeMeta';
import {ISerializedObject, ISerializedValue} from '../../../../../../src/main/common/extensions/serialization/contracts'

interface TAwait<TValue> {}

type IDeSerializeValue = <TValue = any>(
	serializedValue: ISerializedValue,
	set?: (value: TValue) => void,
	valueType?: TClass<TValue>,
	valueFactory?: (...args) => TValue,
) => TValue|TAwait<TValue>

const serializer = {
	*_deSerialize<K, V>(
		deSerialize: IDeSerializeValue,
		serializedValue: ISerializedObject,
		valueFactory?: (map?: Map<K, V>) => ObservableMap<K, V>,
	): Iterator<ObservableMap<K, V>|TAwait<any>> {
		const innerMap = yield deSerialize<Map<K, V>>(serializedValue.map)

		const value = valueFactory
			? valueFactory(innerMap)
			: new ObservableMap<K, V>(innerMap)

		deSerialize(serializedValue.param1, o => { (value as any).param1 = o })
		deSerialize(serializedValue.param2, o => { (value as any).param2 = o })
		yield deSerialize(serializedValue.param3, o => { (value as any).param3 = o })
		yield deSerialize(serializedValue.param4, o => { (value as any).param4 = o })

		return value
	},
}

const iterator = serializer._deSerialize()