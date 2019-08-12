import {
	ISerializable,
	ISerializedObject,
	ReadValue,
	WriteValue,
} from '../../../../../../../src/main/common/extensions/serialization/contracts'
import {Property} from '../../../../../../../src/main/common/rx/object/properties/property'

export class PropertySerializable<TValue> extends Property<TValue> implements ISerializable {
	private readonly _writeValue: WriteValue<TValue>
	private readonly _readValue: ReadValue<TValue>

	constructor(
		valueFactory: () => TValue,
		writeValue: WriteValue<TValue>,
		readValue: ReadValue<TValue>,
	) {
		super(valueFactory)
		this._writeValue = writeValue
		this._readValue = readValue
	}

	// region ISerializable

	public serialize(): ISerializedObject {
		return {
			value: this._writeValue(this.value),
		}
	}

	public deSerialize(serializedObject: ISerializedObject) {
		this.value = this._readValue(serializedObject.value, this._valueFactory)
	}

	// endregion
}
