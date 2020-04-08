import {AsyncValueOf, ThenableOrIteratorOrValue, ThenableOrValue} from '../../../../async/async'
import {AsyncHasDefaultValueOf, HasDefaultValueOf} from '../../../../helpers/value-property'

// region common

type TGetValue1<TValue>
	= (value: any, newValue?: TValue) => ThenableOrIteratorOrValue<HasDefaultValueOf<TValue>>
type TGetValue2<TValue, TNextValue>
	= (value: HasDefaultValueOf<TValue>, newValue?: TNextValue) => ThenableOrIteratorOrValue<TNextValue>

// endregion

// region TGetPropertyValue

type TGetPropertyValueResult1<TValue>
	= TGetPropertyValue<HasDefaultValueOf<TValue>>
type TGetPropertyValue1<TValue> = <TNextValue>(
	getValue: TGetValue1<TValue>,
	isValueProperty: true,
	newValue?: TNextValue,
) => TGetPropertyValueResult1<TValue>

type TGetPropertyValueResult2<TNextValue> = TGetPropertyValue<AsyncValueOf<TNextValue>>
type TGetPropertyValue2<TValue> =
	<TNextValue>(
		getValue: TGetValue2<TValue, TNextValue>,
		isValueProperty?: false,
		newValue?: TNextValue,
	) => TGetPropertyValueResult2<TNextValue>

export type TGetPropertyValueResult3<TValue> = ThenableOrValue<AsyncHasDefaultValueOf<TValue>>
type TGetPropertyValue3<TValue> = () => TGetPropertyValueResult3<TValue>

export type TGetPropertyValue<TValue> = (
	TGetPropertyValue1<TValue> &
	TGetPropertyValue2<TValue> &
	TGetPropertyValue3<TValue>
)
	& { value: ThenableOrValue<TValue> }

// endregion

// region TPropertyPath

type TGetPropertyPathResult1<TObject, TValue>
	= TGetPropertyPath<TObject, HasDefaultValueOf<TValue>>
type TGetPropertyPath1<TObject, TValue> = <TNextValue>(
	getValue: TGetValue1<TValue>,
	isValueProperty: true,
) => TGetPropertyPathResult1<TObject, TValue>

type TGetPropertyPathResult2<TObject, TNextValue> = TGetPropertyPath<TObject, AsyncValueOf<TNextValue>>
type TGetPropertyPath2<TObject, TValue> =
	<TNextValue>(
		getValue: TGetValue2<TValue, TNextValue>,
		isValueProperty?: false,
	) => TGetPropertyPathResult2<TObject, TNextValue>

export type TGetValue<TObject, TValue> = (object: TObject) => TValue
export type TSetValue<TObject, TValue> = (object: TObject, value: TValue) => void

export interface IPathNode<TObject, TValue> {
	getValue: TGetValue<TObject, TValue>,
	setValue: TSetValue<TObject, TValue>,
	isValueProperty: boolean,
}

export type TPropertyPathArray<TObject, TValue> = Array<IPathNode<TObject, TValue>>
type TGetPropertyPathResult3<TObject, TValue> = TPropertyPathArray<TObject, TValue>
type TGetPropertyPath3<TObject, TValue> = () => TGetPropertyPathResult3<TObject, TValue>

export type TGetPropertyPath<TObject, TValue> = (
	TGetPropertyPath1<TObject, TValue> &
	TGetPropertyPath2<TObject, TValue> &
	TGetPropertyPath3<TObject, TValue>
)

export interface IPropertyPath<TObject, TValue> {
	get(object: TObject): TGetPropertyValueResult3<TValue>
	set(object: TObject, newValue: TValue): TGetPropertyValueResult3<void>
}

// endregion
