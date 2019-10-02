import {ValueKeyType} from '../contracts/common'

export function setObjectValue(object: any, key: any, keyType: ValueKeyType, value: any) {
	switch (keyType) {
		case ValueKeyType.Property:
		case ValueKeyType.ValueProperty:
			object[key] = value
			break
		case ValueKeyType.MapKey:
			(object as Map<any, any>).set(key, value)
			break
		case ValueKeyType.CollectionAny:
			throw new Error('Unsupported set value for ValueKeyType.CollectionAny')
		default:
			throw new Error('Unknown ValueKeyType: ' + keyType)
	}
}
