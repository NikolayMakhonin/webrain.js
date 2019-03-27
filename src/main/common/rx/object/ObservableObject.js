import '../extensions/autoConnect'
import {HasSubscribersSubject} from '../subjects/hasSubscribers'

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

export class ObservableObject {
	constructor() {
		Object.defineProperty(this, '__meta', {
			configurable: false,
			enumerable  : false,
			writable    : false,
			value       : {
				unsubscribers: {}
			}
		})

		Object.defineProperty(this, '__fields', {
			configurable: false,
			enumerable  : false,
			writable    : false,
			value       : {}
		})
	}

	// region propertyChanged

	get propertyChanged() {
		let {propertyChanged} = this.__meta
		if (!propertyChanged) {
			this.__meta.propertyChanged = propertyChanged = new HasSubscribersSubject()
		}
		return propertyChanged
	}

	get deepPropertyChanged() {
		let {deepPropertyChanged} = this.__meta
		if (!deepPropertyChanged) {
			this.__meta.deepPropertyChanged = deepPropertyChanged = new HasSubscribersSubject()
		}
		return deepPropertyChanged
	}

	_emitPropertyChanged(eventsOrPropertyNames, emitFunc) {
		if (eventsOrPropertyNames === null) {
			return
		}

		const toEvent = event => {
			if (event == null) {
				return {}
			}

			if (typeof event !== 'object') {
				const value = this[event]
				event = {
					name    : event,
					oldValue: value,
					newValue: value
				}
			}

			return event
		}

		if (!Array.isArray(eventsOrPropertyNames)) {
			emitFunc(toEvent(eventsOrPropertyNames))
		} else {
			const items = expandAndDistinct(eventsOrPropertyNames)

			for (let i = 0, len = items.length; i < len; i++) {
				emitFunc(toEvent(items[i]))
			}
		}
	}

	onPropertyChanged(eventsOrPropertyNames) {
		const {propertyChanged, deepPropertyChanged} = this.__meta

		if (!propertyChanged && !deepPropertyChanged) {
			return this
		}

		this._emitPropertyChanged(eventsOrPropertyNames, event => {
			if (propertyChanged) {
				propertyChanged.emit(event)
			}

			if (deepPropertyChanged) {
				deepPropertyChanged.emit(event)
			}
		})

		return this
	}

	onDeepPropertyChanged(eventsOrPropertyNames) {
		const {deepPropertyChanged} = this.__meta

		if (!deepPropertyChanged) {
			return this
		}

		this._emitPropertyChanged(eventsOrPropertyNames, event => {
			deepPropertyChanged.emit(event)
		})

		return this
	}

	// endregion

	_set(name, newValue, options) {
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

		const {unsubscribers} = this.__meta

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

		this.onPropertyChanged({
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

		const {deepPropertyChanged} = value

		if (!deepPropertyChanged) {
			return null
		}

		const subscriber = event => {
			this.deepPropertyChanged.emit({
				name: propertyName,
				next: event
			})
		}

		return this.deepPropertyChanged.hasSubscribersObservable
			.autoConnect(null, () => deepPropertyChanged.subscribe(subscriber))
	}
}
