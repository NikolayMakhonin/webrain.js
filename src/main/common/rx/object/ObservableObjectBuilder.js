import '../extensions/autoConnect'
import {ObservableObject} from './ObservableObject'

export class ObservableObjectBuilder {
	constructor(object) {
		this.object = object || new ObservableObject()
	}

	writable(name, options, initValue) {
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
			get() {
				return this.__fields[name]
			},
			set(newValue) {
				this._set(name, newValue, options)
			}
		})

		if (__fields) {
			if (typeof initValue !== 'undefined') {
				const value = __fields[name]
				if (initValue === value) {
					const {unsubscribers} = object.__meta
					const unsubscribe = unsubscribers[name]
					if (unsubscribe) {
						unsubscribe()
					}
					unsubscribers[name] = object._propagatePropertyChanged(name, value)
				} else {
					object[name] = initValue
				}
			}
		}

		return this
	}

	readable(name, options, value) {
		const {object} = this

		const {__fields} = object

		if (__fields) {
			__fields[name] = object[name]
		}

		Object.defineProperty(object, name, {
			configurable: true,
			enumerable  : true,
			get() {
				return this.__fields[name]
			}
		})

		if (__fields) {
			if (typeof value !== 'undefined') {
				const oldValue = __fields[name]
				const {unsubscribers} = object.__meta
				const unsubscribe = unsubscribers[name]
				if (unsubscribe) {
					unsubscribe()
				}
				unsubscribers[name] = object._propagatePropertyChanged(name, value)

				if (value !== oldValue) {
					__fields[name] = value
					object.onPropertyChanged({
						name,
						oldValue,
						newValue: value
					})
				}
			}
		}

		return this
	}

	delete(name) {
		const {object} = this
		const oldValue = object[name]
		const {__fields, __meta} = object

		if (__meta) {
			const {unsubscribers} = __meta
			const unsubscribe = unsubscribers[name]

			if (unsubscribe) {
				unsubscribe()
			}
		}

		delete object[name]

		if (__fields) {
			delete __fields[name]
			if (typeof oldValue !== 'undefined') {
				object.onPropertyChanged({
					name,
					oldValue
				})
			}
		}

		return this
	}
}
