import { registerSerializable } from '../../../../../main/common/serialization/serializers'
import {
	IDeSerializerVisitor, IDeSerializeValue,
	ISerializable, ISerializedObject,
	ISerializedTypedValue, ISerializerVisitor, ISerializeValue
} from "../../../../../main/common/serialization/contracts";

describe('common > serialization > serializers', function() {
	it('base', function() {
		class Class1 {
			public prop1: string
		}

		class Class2 extends Class1 implements ISerializable {
			public prop2: string
			public prop3: string = 'prop3'

			constructor(prop2: string) {
				super()
				this.prop2 = prop2
			}

			public static uuid: string = '3cd34642-9e19-4a0d-8a57-ff526b445100'

			public serialize(serialize: ISerializeValue): ISerializedObject {
				return {
					prop3: serialize(this.prop3),
				}
			}

			public deSerialize(deSerialize: IDeSerializeValue, serializedValue: ISerializedObject) {
				this.prop3 = deSerialize(serializedValue.prop3)
			}
		}

		registerSerializable(Class2, () => new Class2('prop2'))

		main.main('test')
	})
})
