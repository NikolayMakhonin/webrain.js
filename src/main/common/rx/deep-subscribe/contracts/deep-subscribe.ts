import {ValueKeyType} from './common'

export interface ISubscribedValue {
	value: any
	parent: any
	key: any,
	keyType: ValueKeyType,
	isOwnProperty?: boolean
}
