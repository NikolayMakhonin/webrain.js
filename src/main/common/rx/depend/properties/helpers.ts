import {webrainOptions} from '../../../helpers/webrainOptions'
import {ISetOptions} from './contracts'

/** @internal */
export function _set(
	name: string | number,
	getValue: () => any,
	setValue: (v) => void,
	object: object,
	newValue,
) {
	const oldValue = getValue.call(object)

	if (oldValue === newValue || webrainOptions.equalsFunc && webrainOptions.equalsFunc.call(object, oldValue, newValue)) {
		return false
	}

	setValue.call(object, newValue)

	return true
}

/** @internal */
export function _setExt(
	name: string | number,
	getValue: () => any,
	setValue: (v) => void,
	options: ISetOptions<any, any>,
	object: object,
	newValue,
) {
	if (!options) {
		return _set(name, getValue, setValue, object, newValue)
	}

	const oldValue = getValue.call(object)

	const equalsFunc = options.equalsFunc || webrainOptions.equalsFunc
	if (oldValue === newValue || equalsFunc && equalsFunc.call(object, oldValue, newValue)) {
		return false
	}

	const fillFunc = options.fillFunc
	if (fillFunc && oldValue != null && newValue != null && fillFunc.call(object, oldValue, newValue)) {
		return false
	}

	const convertFunc = options.convertFunc
	if (convertFunc) {
		newValue = convertFunc.call(object, oldValue, newValue)
	}

	// if (oldValue === newValue) {
	// 	return false
	// }

	const beforeChange = options.beforeChange
	if (beforeChange) {
		beforeChange.call(object, oldValue, newValue)
	}

	setValue.call(object, newValue)

	const afterChange = options.afterChange
	if (afterChange) {
		afterChange.call(object, oldValue, newValue)
	}

	return true
}
