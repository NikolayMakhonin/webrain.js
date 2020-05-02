import {equals} from '../../helpers/helpers'
import {webrainEquals, webrainOptions} from '../../helpers/webrainOptions'
import {getCallState, invalidateCallState} from '../../rx/depend/core/CallState'
import {PropertyChangedObject} from './PropertyChangedObject'

export interface ISetOptions<TObject, TValue> {
	equalsFunc?: (this: TObject, oldValue: TValue, newValue: TValue) => boolean,
	fillFunc?: (this: TObject, oldValue: TValue, newValue: TValue) => boolean,
	convertFunc?: (this: TObject, oldValue: TValue, newValue: TValue) => any,
	beforeChange?: (this: TObject, oldValue: TValue, newValue: TValue) => void,
	afterChange?: (this: TObject, oldValue: TValue, newValue: TValue) => void,
	suppressPropertyChanged?: boolean,
}

export class ObservableClass extends PropertyChangedObject {

	/** @internal */
	public readonly __fields?: {
		[key: string]: any;
		[key: number]: any;
	}

	constructor() {
		super()

		Object.defineProperty(this, '__fields', {
			configurable: false,
			enumerable  : false,
			writable    : false,
			value       : {},
		})
	}
}

/** @internal */
export function _setExt(
	this: ObservableClass,
	name: string | number,
	getValue: () => any,
	setValue: (v) => void,
	options: ISetOptions<any, any>,
	newValue,
) {
	if (!options) {
		return _set.call(this, name, getValue, setValue, newValue)
	}

	const oldValue = getValue ? getValue.call(this) : this.__fields[name]

	const equalsFunc = options.equalsFunc || webrainOptions.equalsFunc
	if (equals(oldValue, newValue) || equalsFunc && equalsFunc.call(this, oldValue, newValue)) {
		return false
	}

	const fillFunc = options.fillFunc
	if (fillFunc && oldValue != null && newValue != null && fillFunc.call(this, oldValue, newValue)) {
		return false
	}

	const convertFunc = options.convertFunc
	if (convertFunc) {
		newValue = convertFunc.call(this, oldValue, newValue)
	}

	// TODO uncomment this and run tests
	// if (equals(oldValue, newValue)) {
	// 	return false
	// }

	const beforeChange = options.beforeChange
	if (beforeChange) {
		beforeChange.call(this, oldValue, newValue)
	}

	if (setValue) {
		setValue.call(this, newValue)
	} else {
		this.__fields[name] = newValue
	}

	invalidateCallState(getCallState(getValue).call(this))

	if (!options || !options.suppressPropertyChanged) {
		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			propertyChangedIfCanEmit.onPropertyChanged({
				name,
				oldValue,
				newValue,
			})
		}
	}

	const afterChange = options.afterChange
	if (afterChange) {
		afterChange.call(this, oldValue, newValue)
	}

	return true
}

/** @internal */
export function _set(
	this: ObservableClass,
	name: string | number,
	getValue: () => any,
	setValue: (v) => void,
	newValue,
) {
	const oldValue = getValue.call(this)

	if (webrainEquals.call(this, oldValue, newValue)) {
		return false
	}

	setValue.call(this, newValue)

	invalidateCallState(getCallState(getValue).call(this))

	const {propertyChangedDisabled, propertyChanged} = this.__meta
	if (!propertyChangedDisabled && propertyChanged) {
		propertyChanged.emit({
			name,
			oldValue,
			newValue,
		})
	}

	return true
}
