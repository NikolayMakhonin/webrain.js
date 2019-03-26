import '../extensions/autoConnect'
import {HasSubscribersSubject} from '../subjects/hasSubscribers'

export class ObservableObject {
	constructor(fields) {
		Object.defineProperty(this, '__meta', {
			configurable: false,
			enumerable  : false,
			writable    : false,
			value       : {
				unsubscribers  : {},
				propertyChanged: new HasSubscribersSubject()
			}
		})

		Object.defineProperty(this, '__fields', {
			configurable: false,
			enumerable  : false,
			writable    : false,
			value       : fields || {}
		})
	}

	get propertyChanged() {
		return this.__meta.propertyChanged
	}

	onPropertyChanged(...propertyNames) {
		if (propertyNames.length === 0) {
			this.propertyChanged.emit({})
		}

		propertyNames = expandAndDistinct(propertyNames)

		for (const propertyName of propertyNames) {
			const value = this[propertyName]
			this.propertyChanged.emit({
				name    : propertyName,
				oldValue: value,
				newValue: value
			})
		}
	}

	_set(name, newValue, options) {
		const {__fields} = this
		const oldValue =  __fields[name]

		const {convertFunc} = options
		if (convertFunc) {
			newValue = convertFunc(newValue)
		}

		const {equalsFunc} = options
		if (equalsFunc ? equalsFunc(oldValue, newValue) : oldValue === newValue) {
			return false
		}

		const {fillFunc} = options
		if (fillFunc && oldValue != null && newValue != null && fillFunc(oldValue, newValue)) {
			return false
		}

		const {beforeChange} = options
		if (beforeChange) {
			beforeChange(oldValue)
		}

		const {propertyChanged, unsubscribers} = this.__meta

		const unsubscribe = unsubscribers[name]
		if (unsubscribe) {
			unsubscribe()
		}

		__fields[name] = newValue

		unsubscribers[name] = this._propagatePropertyChanged(name, newValue)

		const {afterChange} = options
		if (afterChange) {
			afterChange(newValue)
		}

		propertyChanged.emit({
			name,
			oldValue,
			newValue
		})

		return true
	}

	_propagatePropertyChanged(propertyName, value) {
		if (!value) {
			return null
		}

		const {propertyChanged} = value

		if (!propertyChanged) {
			return null
		}

		const subscriber = event => {
			this.propertyChanged.emit({
				name: propertyName,
				next: event
			})
		}

		return this.propertyChanged.hasSubscribersObservable
			.autoConnect(null, () => propertyChanged.subscribe(subscriber))
	}
}

function expandAndDistinct(inputItems, output = [], map = {}) {
	if (inputItems == null) {
		return output
	}

	if (Array.isArray(inputItems)) {
		for (const item of inputItems) {
			expandAndDistinct(item, output, map)
		}
		return output
	}

	if (!map[inputItems]) {
		map[inputItems] = true
		output[output.length] = inputItems
	}

	return output
}

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
					const {propertyChanged} = object.__meta
					propertyChanged.emit({
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

		if (__meta) {
			delete __fields[name]
			if (typeof oldValue !== 'undefined') {
				const {propertyChanged} = __meta
				propertyChanged.emit({
					name,
					oldValue
				})
			}
		}

		return this
	}
}
