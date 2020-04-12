import {AsyncValueOf, ThenableOrIteratorOrValue, ThenableOrValue} from '../../../../async/async'
import {AsyncHasDefaultValueOf, HasDefaultValueOf} from '../../../../helpers/value-property'
import {Path} from './builder'

// region TGetPropertyValue

export type TGetValue1<TValue, TNextValue>
	= (value: TValue, newValue?: TNextValue) => ThenableOrIteratorOrValue<HasDefaultValueOf<TNextValue>>
export type TGetValue2<TValue, TNextValue>
	= (value: HasDefaultValueOf<TValue>, newValue?: TNextValue) => ThenableOrIteratorOrValue<TNextValue>

export type TGetPropertyValueResult1<TNextValue> = TGetPropertyValue<AsyncValueOf<TNextValue>>
export type TGetPropertyValue1<TValue> =
	<TNextValue>(
		getValue: TGetValue1<TValue, TNextValue>,
		isValueProperty: true,
		newValue?: TNextValue,
	) => TGetPropertyValueResult1<TNextValue>

export type TGetPropertyValueResult2<TNextValue> = TGetPropertyValue<AsyncValueOf<TNextValue>>
export type TGetPropertyValue2<TValue> =
	<TNextValue>(
		getValue: TGetValue2<TValue, TNextValue>,
		isValueProperty?: false,
		newValue?: TNextValue,
	) => TGetPropertyValueResult2<TNextValue>

export type TGetPropertyValueResult3<TValue> = ThenableOrValue<AsyncHasDefaultValueOf<TValue>>
export type TGetPropertyValue3<TValue> = () => TGetPropertyValueResult3<TValue>

export type TGetPropertyValue<TValue> =
	TGetPropertyValue1<TValue> &
	TGetPropertyValue2<TValue> &
	TGetPropertyValue3<TValue>

// endregion

// region TPropertyPath

export type TSetValue1<TValue, TNextValue>
	= (value: TValue, newValue: TNextValue) => void
export type TSetValue2<TValue, TNextValue>
	= (value: HasDefaultValueOf<TValue>, newValue: TNextValue) => void

export type TGetPropertyPathResult1<TObject, TNextValue> = TGetPropertyPathGetSet<TObject, AsyncValueOf<TNextValue>>
export type TGetPropertyPath1<TObject, TValue> =
	<TNextValue>(
		getValue: TGetValue1<TValue, TNextValue>,
		isValueProperty: true,
	) => TGetPropertyPathResult1<TObject, TNextValue>
export type TSetPropertyPath1<TObject, TValue> =
	<TNextValue>(
		getValue: TGetValue1<TValue, TNextValue>,
		setValue: TSetValue1<TValue, TNextValue>,
		isValueProperty: true,
	) => TGetPropertyPathResult1<TObject, TNextValue>

export type TGetPropertyPathResult2<TObject, TNextValue> = TGetPropertyPathGetSet<TObject, AsyncValueOf<TNextValue>>
export type TGetPropertyPath2<TObject, TValue> =
	<TNextValue>(
		getValue: TGetValue2<TValue, TNextValue>,
		isValueProperty?: false,
	) => TGetPropertyPathResult2<TObject, TNextValue>
export type TSetPropertyPath2<TObject, TValue> =
	<TNextValue>(
		getValue: TGetValue2<TValue, TNextValue>,
		setValue: TSetValue2<TValue, TNextValue>,
		isValueProperty?: false,
	) => TGetPropertyPathResult2<TObject, TNextValue>

export type TGetValue<TObject, TValue> = (object: TObject) => TValue
export type TSetValue<TObject, TValue> = (object: TObject, value: TValue) => void

export interface IPathNode<TObject, TValue> {
	getValue: TGetValue<TObject, TValue>,
	setValue: TSetValue<TObject, TValue>,
	isValueProperty: boolean,
}

export type TPathNodes<TObject, TValue> = Array<IPathNode<TObject, TValue>>

export type TGetPropertyPathResult3<TObject, TValue>
	= Path<TObject, ThenableOrValue<AsyncHasDefaultValueOf<TValue>>>
export type TGetPropertyPath3<TObject, TValue> = () => TGetPropertyPathResult3<TObject, TValue>

export type TGetPropertyPathGet<TObject, TValue> =
	TGetPropertyPath1<TObject, TValue> &
	TGetPropertyPath2<TObject, TValue> &
	TGetPropertyPath3<TObject, TValue>

export type TGetPropertyPathSet<TObject, TValue> =
	TSetPropertyPath1<TObject, TValue> &
	TSetPropertyPath2<TObject, TValue> &
	TGetPropertyPath3<TObject, TValue>

export type TGetPropertyPathGetSet<TObject, TValue> =
	TGetPropertyPathGet<TObject, TValue> &
	TGetPropertyPathSet<TObject, TValue>

// export interface IPropertyPath<TObject, TValue> {
// 	canGet: boolean
// 	canSet: boolean
// 	get(object: TObject): TGetPropertyValue<TValue>
// 	set(object: TObject, newValue: TValue): TGetPropertyValue<void>
// 	concat<TNextValue>(nextPath: IPropertyPath<TValue, TNextValue>): IPropertyPath<TObject, TNextValue>
// }

// endregion
