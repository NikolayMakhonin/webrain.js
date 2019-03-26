import '../extensions/autoConnect'
import {HasSubscribersSubject} from '../subjects/hasSubscribers'

export class ObservableObject {
	constructor() {
		Object.defineProperty(this, '__meta', {
			configurable: false,
			enumerable  : false,
			writable    : false,
			value       : {
				unsubscribers  : {},
				propertyChanged: new HasSubscribersSubject()
			}
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

	_set(name, options, field, newValue) {
		const {value: oldValue} = field

		const {convertFunc} = options
		if (convertFunc) {
			newValue = convertFunc(newValue)
		}

		const {equalsFunc} = options
		if (equalsFunc ? equalsFunc(oldValue, newValue) : oldValue === newValue) {
			return
		}

		const {fillFunc} = options
		if (fillFunc && oldValue != null && newValue != null && fillFunc(oldValue, newValue)) {
			return
		}

		const {beforeChange} = options
		if (beforeChange) {
			beforeChange(oldValue)
		}

		const {unsubscribers, propertyChanged} = this.__meta

		const unsubscribe = unsubscribers[name]
		if (unsubscribe) {
			unsubscribe()
		}

		field.value = newValue

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

// Object.defineProperty(ObservableObject.prototype, 'propertyChanged', {
// 	configurable: true,
// 	enumerable  : false,
// 	get() {
// 		return this.__meta.propertyChanged
// 	}
// })

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

		const field = {value: object[name]}

		Object.defineProperty(object, name, {
			configurable: true,
			enumerable  : true,
			get() {
				return field.value
			},
			set(newValue) {
				this._set(name, options, field, newValue)
			}
		})

		if (typeof initValue !== 'undefined') {
			const {value} = field
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

		return this
	}

	readable(name, options, value) {
		const {object} = this
		const oldValue = object[name]

		Object.defineProperty(object, name, {
			configurable: true,
			enumerable  : true,
			get() {
				return value
			}
		})

		if (typeof value === 'undefined') {
			value = oldValue
		} else {
			const {unsubscribers, propertyChanged} = object.__meta
			const unsubscribe = unsubscribers[name]

			if (unsubscribe) {
				unsubscribe()
			}
			unsubscribers[name] = object._propagatePropertyChanged(name, value)

			if (value !== oldValue) {
				propertyChanged.emit({
					name,
					oldValue,
					newValue: value
				})
			}
		}

		return this
	}

	delete(name) {
		const {object} = this
		const {unsubscribers, propertyChanged} = object.__meta

		const unsubscribe = unsubscribers[name]
		const oldValue = object[name]

		if (unsubscribe) {
			unsubscribe()
		}

		delete object[name]
		delete unsubscribers[name]

		if (typeof oldValue !== 'undefined') {
			propertyChanged.emit({
				name,
				oldValue
			})
		}

		return this
	}
}
