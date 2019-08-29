import '../extensions/autoConnect'
import {PropertyChangedObject} from './PropertyChangedObject'

export interface ISetOptions {
	equalsFunc?: (oldValue, newValue) => boolean,
	fillFunc?: (oldValue, newValue) => boolean,
	convertFunc?: (newValue) => any,
	beforeChange?: (oldValue) => void,
	afterChange?: (newValue) => void,
	suppressPropertyChanged?: boolean,
}

export class ObservableObject extends PropertyChangedObject {

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

	/** @internal */
	public _setExt(
		name: string | number,
		newValue,
		getValue: (o) => any,
		setValue: (o, v) => void,
		options?: ISetOptions,
	) {
		if (!options) {
			return this._set(name, newValue, getValue, setValue)
		}

		const oldValue = getValue ? getValue(this) : this.__fields[name]

		const equalsFunc = options.equalsFunc
		if (equalsFunc ? equalsFunc.call(this, oldValue, newValue) : oldValue === newValue) {
			return false
		}

		const fillFunc = options.fillFunc
		if (fillFunc && oldValue != null && newValue != null && fillFunc.call(this, oldValue, newValue)) {
			return false
		}

		const convertFunc = options.convertFunc
		if (convertFunc) {
			newValue = convertFunc.call(this, newValue)
		}

		if (oldValue === newValue) {
			return false
		}

		const beforeChange = options.beforeChange
		if (beforeChange) {
			beforeChange.call(this, oldValue)
		}

		if (setValue) {
			setValue(this, newValue)
		} else {
			this.__fields[name] = newValue
		}

		const afterChange = options.afterChange
		if (afterChange) {
			afterChange.call(this, newValue)
		}

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

		return true
	}

	/** @internal */
	public _set(
		name: string | number,
		newValue,
		getValue: (o) => any,
		setValue: (o, v) => void,
	) {
		const oldValue = getValue(this)

		if (oldValue === newValue) {
			return false
		}

		setValue(this, newValue)

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
}
