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

	propagatePropertyChanged(propertyName, value) {
		if (!value) {
			return null
		}

		const {propertyChanged} = value

		if (!propertyChanged) {
			return null
		}

		const {object} = this

		const subscriber = event => {
			object.propertyChanged.emit({
				name: propertyName,
				next: event
			})
		}

		return object.propertyChanged.hasSubscribersObservable
			.autoConnect(null, () => propertyChanged.subscribe(subscriber))
	}

	_set(name, field, options) {

	}

	writable(name, options) {
		const {object} = this
		const {unsubscribers, propertyChanged} = object.__meta
		const {
			value: initValue,
			convertFunc,
			equalsFunc,
			fillFunc,
			beforeChange,
			afterChange
		} = options || {}

		let unsubscribe = unsubscribers[name]
		let value = object[name]

		Object.defineProperty(object, name, {
			configurable: true,
			enumerable  : true,
			get() {
				return value
			},
			set: newValue => {
				if (convertFunc) {
					newValue = convertFunc(newValue)
				}

				if (equalsFunc ? equalsFunc(value, newValue) : value === newValue) {
					return
				}

				if (fillFunc && value != null && newValue != null && fillFunc(value, newValue)) {
					return
				}

				if (beforeChange) {
					beforeChange(value)
				}

				if (unsubscribe) {
					unsubscribe()
				}

				const oldValue = value
				value = newValue

				unsubscribers[name] = unsubscribe = this.propagatePropertyChanged(name, value)

				if (afterChange) {
					afterChange(newValue)
				}

				propertyChanged.emit({
					name,
					oldValue,
					newValue: value
				})
			}
		})

		if (typeof initValue !== 'undefined') {
			if (initValue === value) {
				if (unsubscribe) {
					unsubscribe()
				}
				unsubscribers[name] = unsubscribe = this.propagatePropertyChanged(name, value)
			} else {
				object[name] = initValue
			}
		}

		return this
	}

	readable(name, options) {
		const {object} = this
		const {unsubscribers, propertyChanged} = object.__meta
		let {value} = options || {}

		const unsubscribe = unsubscribers[name]
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
			if (unsubscribe) {
				unsubscribe()
			}
			unsubscribers[name] = this.propagatePropertyChanged(name, value)

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
