import {AsyncValueOf, ThenableOrIterator} from '../../../../async/async'
import {VALUE_PROPERTY_DEFAULT} from '../../../../helpers/value-property'
import {Path} from './builder'

// export type PropertyValueOf<TValue>
// 	= TValue extends { [VALUE_PROPERTY_DEFAULT]: infer TValue }
// 		? AsyncValueOf<TValue>
// 		: TValue

// export type AsyncPropertyValueOf<TObject>
// 	= PropertyValueOf<AsyncValueOf<TObject>>
// type _ThenableOrIteratorOrValue<T> = Thenable<T> | Iterator<any, T> | T
// type _ThenableOrIterator<T> = Thenable<T> | Iterator<any, T>
// type _AsyncValueOf<T> = T extends _ThenableOrIterator<infer V>	? V : T
// type _ThenableOrIterator<T> = ThenableOrIterator<T>
// type _AsyncValueOf<T> = AsyncValueOf<T>

export type AsyncPropertyValueOf<TValue>
	// = TValue extends _ThenableOrIterator<infer V>
	// 	? (V extends { [VALUE_PROPERTY_DEFAULT]: infer V2 }
	// 		? V2
	// 		: V)
	// 	: (TValue extends { [VALUE_PROPERTY_DEFAULT]: infer V3 }
	// 		? V3
	// 		: TValue)
	= TValue extends { [VALUE_PROPERTY_DEFAULT]: infer V }
		? (V extends ThenableOrIterator<infer V2>
			? V2
			: V)
		: (TValue extends ThenableOrIterator<infer V3>
			? V3
			: TValue)

export type AsyncPropertyPathOf<TObject, TValue>
	// = TValue extends _ThenableOrIterator<infer V>
	// 	? (V extends { [VALUE_PROPERTY_DEFAULT]: infer V2 }
	// 		? Path<TObject, V2>
	// 		: Path<TObject, V>)
	// 	: (TValue extends { [VALUE_PROPERTY_DEFAULT]: infer V3 }
	// 		? Path<TObject, V3>
	// 		: Path<TObject, TValue>)
	= TValue extends { [VALUE_PROPERTY_DEFAULT]: infer V }
		? (V extends ThenableOrIterator<infer V2>
			? Path<TObject, V2>
			: Path<TObject, V>)
		: (TValue extends ThenableOrIterator<infer V3>
			? Path<TObject, V3>
			: Path<TObject, TValue>)

// region TGetPropertyValue

export type TNextValueFunc<TNextValue> = (nextValue: TNextValue) => void

export type TGetValue1<TValue, TNextValue>
	= (
		value: AsyncValueOf<TValue>,
		newValue?: AsyncValueOf<TNextValue>,
		next?: TNextValueFunc<TNextValue>,
	) => TNextValue
export type TGetValue2<TValue, TNextValue>
	= (
		value: AsyncPropertyValueOf<TValue>,
		newValue?: AsyncPropertyValueOf<TNextValue>,
		next?: TNextValueFunc<TNextValue>,
	) => TNextValue

export type TGetPropertyValueResult1<TNextValue> = TGetPropertyValue<TNextValue>
export type TGetPropertyValue1<TValue> =
	<TNextValue>(
		getValue: TGetValue1<TValue, TNextValue>,
		isValueProperty: true,
		newValue?: TNextValue,
		next?: TNextValueFunc<TNextValue>,
	) => TGetPropertyValueResult1<TNextValue>

export type TGetPropertyValueResult2<TNextValue> = TGetPropertyValue<TNextValue>
export type TGetPropertyValue2<TValue> =
	<TNextValue>(
		getValue: TGetValue2<TValue, TNextValue>,
		isValueProperty?: false,
		newValue?: TNextValue,
		next?: TNextValueFunc<TNextValue>,
	) => TGetPropertyValueResult2<TNextValue>

export type TGetPropertyValueResult3<TValue> = AsyncPropertyValueOf<TValue>
export type TGetPropertyValue3<TValue> = () => TGetPropertyValueResult3<TValue>

export type TGetPropertyValue<TValue> =
	TGetPropertyValue1<TValue> &
	TGetPropertyValue2<TValue> &
	TGetPropertyValue3<TValue>

// endregion

// region TPropertyPath

export type TSetValue1<TValue, TNextValue>
	= (value: AsyncValueOf<TValue>, newValue: AsyncValueOf<TNextValue>) => void
export type TSetValue2<TValue, TNextValue>
	= (value: AsyncPropertyValueOf<TValue>, newValue: AsyncPropertyValueOf<TNextValue>) => void

export type TGetPropertyPathResult1<TObject, TNextValue> = TGetPropertyPathGetSet<TObject, TNextValue>
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

export type TGetPropertyPathResult2<TObject, TNextValue> = TGetPropertyPathGetSet<TObject, TNextValue>
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
	= AsyncPropertyPathOf<TObject, TValue>
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

// endregion

// class Class1<TValue> {
// 	public value: TValue
// }
//
// class Class2<TValue> {
// 	public prop: Class1<TValue>
// }
//
// const getSet: TGetPropertyPathGetSet<Class2<number>, Class2<number>>
// const get: TGetPropertyPathGet<Class2<number>, Class2<number>>
// const get2: TGetPropertyPath2<Class2<number>, Class2<number>>
// const get3: TGetPropertyPath3<number, number>
// const _get = get(o => o.prop)(o => o.value)()
// const _get2 = get2(o => o.prop)(o => o.value)()
// const _get3 = get3()
