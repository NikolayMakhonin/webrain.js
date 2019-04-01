import '../extensions/autoConnect'
import {DeepPropertyChangedObject} from './DeepPropertyChangedObject'

export interface ISetOptions {
	equalsFunc?: (oldValue, newValue) => boolean,
	fillFunc?: (oldValue, newValue) => boolean,
	convertFunc?: (newValue) => any,
	beforeChange?: (oldValue) => void,
	afterChange?: (newValue) => void,
}

export class ObservableObject extends DeepPropertyChangedObject {

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
	public _set(name: string | number, newValue, options: ISetOptions) {
		const {__fields} = this
		const oldValue =  __fields[name]

		const {equalsFunc} = options
		if (equalsFunc ? equalsFunc(oldValue, newValue) : oldValue === newValue) {
			return false
		}

		const {fillFunc} = options
		if (fillFunc && oldValue != null && newValue != null && fillFunc(oldValue, newValue)) {
			return false
		}

		const {convertFunc} = options
		if (convertFunc) {
			newValue = convertFunc(newValue)
		}

		if (oldValue === newValue) {
			return false
		}

		const {beforeChange} = options
		if (beforeChange) {
			beforeChange(oldValue)
		}

		__fields[name] = newValue

		this._propagatePropertyChanged(name, newValue)

		const {afterChange} = options
		if (afterChange) {
			afterChange(newValue)
		}

		this.onPropertyChanged({
			name,
			oldValue,
			newValue,
		})

		return true
	}
}
