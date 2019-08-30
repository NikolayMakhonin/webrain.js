import {isThenable, Thenable, ThenableOrIteratorOrValue, ThenableOrValue} from '../../../async/async'
import {resolveAsync} from '../../../async/ThenableSync'
import {HasDefaultOrValue, VALUE_PROPERTY_DEFAULT} from '../../../helpers/helpers'
import {ICalcProperty} from './CalcProperty'

export type ICalcPropertyOrAsyncValue<TValue> = ThenableOrIteratorOrValue<TValue> | ICalcProperty<TValue>

type TGetPropertyValue<TValue> =
	(<TNextValue>(getValue: (value: TValue) => HasDefaultOrValue<TNextValue>) => TGetPropertyValue<TNextValue>)
		& { value: ThenableOrValue<HasDefaultOrValue<TValue>> }

function resolveValueProperty(value: any, getValue?: (value: any) => any) {
	if (VALUE_PROPERTY_DEFAULT in value) {
		if (getValue) {
			const newValue = getValue(value)
			if (typeof newValue !== 'undefined') {
				return newValue
			}
		}
		return value[VALUE_PROPERTY_DEFAULT]
	}
	return value
}

function get<TValue, TNextValue>(
	getValue: (value: TValue) => HasDefaultOrValue<TNextValue>,
	isValueProperty?: boolean,
): TGetPropertyValue<TNextValue> {
	const customResolveValue = (!getValue || !isValueProperty)
		? resolveValueProperty
		: val => resolveValueProperty(val, getValue)

	const value = resolveAsync(
		(get as TGetPropertyValue<TValue>).value as ThenableOrIteratorOrValue<HasDefaultOrValue<TValue>>,
		null, null, null, customResolveValue) as ThenableOrValue<HasDefaultOrValue<TValue>>

	if (isValueProperty) {
		(get as TGetPropertyValue<TNextValue>).value = value as any
	} else {
		(get as TGetPropertyValue<TNextValue>).value = isThenable(value)
			? (value as Thenable<HasDefaultOrValue<TValue>>).then(getValue, customResolveValue)
			: resolveAsync(getValue(value as TValue))
	}

	return get as TGetPropertyValue<TNextValue>
}

function resolvePath<TValue>(value: TValue): TGetPropertyValue<TValue> {
	(get as TGetPropertyValue<TValue>).value = value
	return get as any
}
