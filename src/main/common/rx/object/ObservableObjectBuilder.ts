import '../extensions/autoConnect'
import {ISetOptions, ObservableObject} from './ObservableObject'

export class ObservableObjectBuilder {
	public object: ObservableObject

	constructor(object: ObservableObject) {
		this.object = object || new ObservableObject()
	}

	public writable(name: string | number, options: ISetOptions, initValue): this {
		if (!options) {
			options = {}
		}

		const {object} = this

		const {__fields} = object

		if (__fields) {
			__fields[name] = object[name]
		}

		Object.defineProperty(object, name, {
			configurable: true,
			enumerable  : true,
			get(this: ObservableObject) {
				return this.__fields[name]
			},
			set(this: ObservableObject, newValue) {
				this._set(name, newValue, options)
			},
		})

		if (__fields && typeof initValue !== 'undefined') {
			const value = __fields[name]
			if (initValue === value) {
				const {__meta} = object

				object._propagatePropertyChanged(name, value)
			} else {
				object[name] = initValue
			}
		}

		return this
	}

	/**
	 * @param options - reserved
	 */
	public readable(name: string | number, options: null, value): this {
		const {object} = this

		const {__fields} = object

		if (__fields) {
			__fields[name] = object[name]
		}

		Object.defineProperty(object, name, {
			configurable: true,
			enumerable  : true,
			get(this: ObservableObject) {
				return this.__fields[name]
			},
		})

		if (__fields && typeof value !== 'undefined') {
			const oldValue = __fields[name]

			object._propagatePropertyChanged(name, value)

			if (value !== oldValue) {
				__fields[name] = value
				object.onPropertyChanged({
					name,
					oldValue,
					newValue: value,
				})
			}
		}

		return this
	}

	public delete(name: string | number): this {
		const {object} = this
		const oldValue = object[name]

		object._setUnsubscriber(name, null)

		delete object[name]

		const {__fields} = object
		if (__fields) {
			delete __fields[name]
			if (typeof oldValue !== 'undefined') {
				object.onPropertyChanged({
					name,
					oldValue,
				})
			}
		}

		return this
	}
}
