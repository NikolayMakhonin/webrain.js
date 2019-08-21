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
	public _set(name: string | number, newValue, options?: ISetOptions) {
		const {__fields} = this
		const oldValue = __fields[name]

		const equalsFunc = options && options.equalsFunc
		if (equalsFunc ? equalsFunc.call(this, oldValue, newValue) : oldValue === newValue) {
			return false
		}

		const fillFunc = options && options.fillFunc
		if (fillFunc && oldValue != null && newValue != null && fillFunc.call(this, oldValue, newValue)) {
			return false
		}

		const convertFunc = options && options.convertFunc
		if (convertFunc) {
			newValue = convertFunc.call(this, newValue)
		}

		if (oldValue === newValue) {
			return false
		}

		const beforeChange = options && options.beforeChange
		if (beforeChange) {
			beforeChange.call(this, oldValue)
		}

		__fields[name] = newValue

		const afterChange = options && options.afterChange
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
}
