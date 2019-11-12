import {AsyncValueOf, isThenable, Thenable, ThenableOrIteratorOrValue, ThenableOrValue} from '../../../async/async'
import {resolveAsync, ThenableSync} from '../../../async/ThenableSync'
import {
	AsyncHasDefaultValueOf,
	HasDefaultOrValue,
	HasDefaultValueOf,
	VALUE_PROPERTY_DEFAULT,
} from '../../../helpers/value-property'
import {CalcPropertyValue} from './CalcProperty'

type TGetValue1<TValue> = (value: any) => ThenableOrIteratorOrValue<HasDefaultValueOf<TValue>>
type TGetPropertyValueResult1<TValue> = TGetPropertyValue<HasDefaultValueOf<TValue>>
type TGetPropertyValue1<TValue> = <TNextValue>(
	getValue: TGetValue1<TValue>,
	isValueProperty: true,
) => TGetPropertyValueResult1<TValue>

type TGetValue2<TValue, TNextValue> = (value: HasDefaultValueOf<TValue>) => ThenableOrIteratorOrValue<TNextValue>
type TGetPropertyValueResult2<TNextValue> = TGetPropertyValue<AsyncValueOf<TNextValue>>
type TGetPropertyValue2<TValue> =
	<TNextValue>(
		getValue: TGetValue2<TValue, TNextValue>,
		isValueProperty?: false,
	) => TGetPropertyValueResult2<TNextValue>

type TGetPropertyValueResult3<TValue> = ThenableOrValue<AsyncHasDefaultValueOf<TValue>>
type TGetPropertyValue3<TValue> = () => TGetPropertyValueResult3<TValue>

type TGetPropertyValue<TValue> = (
	TGetPropertyValue1<TValue> &
	TGetPropertyValue2<TValue> &
	TGetPropertyValue3<TValue>
)
	& { value: ThenableOrValue<TValue> }

function resolveValueProperty(value: any, getValue?: (value: any) => any) {
	if (value != null && typeof value === 'object') {
		if (VALUE_PROPERTY_DEFAULT in value) {
			if (getValue) {
				const newValue = getValue(value)
				if (typeof newValue !== 'undefined') {
					return newValue
				}
			}
			return value[VALUE_PROPERTY_DEFAULT]
		}

		if (value instanceof CalcPropertyValue) {
			return value.get()
		}
	}

	return value
}

export function resolvePath<TValue>(value: ThenableOrIteratorOrValue<TValue>): TGetPropertyValue<TValue> {
	const get: any = <TNextValue>(getValue, isValueProperty) => {
		const _getValue = getValue && (val =>
			val != null && typeof val === 'object' || typeof val === 'string'
				? getValue(val)
				: void 0)

		const customResolveValue = _getValue && isValueProperty
			? val => resolveValueProperty(val, _getValue)
			: resolveValueProperty

		value = resolveAsync(
			value as ThenableOrIteratorOrValue<HasDefaultOrValue<TValue>>,
			null, null, null, customResolveValue)

		if (!_getValue) {
			return value as ThenableOrValue<TValue>
		}

		if (!isValueProperty) {
			if (value instanceof ThenableSync) {
				value = (value as ThenableSync<TValue>).then(
					_getValue,
					null,
					false,
				)
			} else if (isThenable(value)) {
				value = (value as Thenable<TValue>).then(
					_getValue,
				)
			} else {
				value = resolveAsync(_getValue(value as TValue))
			}
		}

		return get
	}

	return get
}

// Test
// const x: TGetPropertyValue<ICalcProperty<Date>>
// const r = x(o => o, true)()
