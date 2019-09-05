import {AsyncValueOf, ThenableOrIteratorOrValue} from '../async/async'

export const VALUE_PROPERTY_DEFAULT = ''
export type VALUE_PROPERTY_DEFAULT = ''

export interface HasDefaultValue<T> {
	[VALUE_PROPERTY_DEFAULT]: ThenableOrIteratorOrValue<T>
}

export type HasDefaultOrValue<T> = T | HasDefaultValue<T>
export type HasDefaultValueOf<T> = T extends HasDefaultValue<any>
	? AsyncValueOf<T[VALUE_PROPERTY_DEFAULT]>
	: T
export type AsyncHasDefaultValueOf<T> = HasDefaultValueOf<AsyncValueOf<T>>
