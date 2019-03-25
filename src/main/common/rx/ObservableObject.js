import './extensions/autoConnect'
import {HasSubscribersSubject} from './subjects/hasSubscribers'

export class ObservableObject {
	constructor() {
		Object.defineProperty(this,'__meta', {
			enumerable  : false,
			writable    : false,
			configurable: false,
			value       : {
				unsubscribers: {},
				propertyChanged     : new HasSubscribersSubject()
			}
		})
	}

	get propertyChanged() {
		return this.__meta.propertyChanged
	}
}


export class ObservableObjectBuilder {
	constructor(object) {
		this.object = object || new ObservableObject()
	}

	propagatePropertyChanged(propertyName, value) {
		if (!value) {
			return null
		}

		const propertyChanged = value._propertyChanged

		if (!propertyChanged) {
			return null
		}

		const {object} = this

		const subscriber = event => {
			object.propertyChanged.emit({
				propertyName,
				next: event
			})
		}

		return object.propertyChanged.hasSubscribersObservable
			.autoConnect(null, () => propertyChanged.subscribe(subscriber))
	}

	writable(name, initValue) {
		const {object} = this
		const {unsubscribers, propertyChanged} = object.__meta

		let unsubscribe = unsubscribers[name]
		let value = object[name]

		Object.defineProperty(object, name, {
			configurable: true,
			get() {
				return value
			},
			set: newValue => {
				if (newValue === value) {
					return
				}

				if (unsubscribe) {
					unsubscribe()
				}

				const oldValue = value
				value = newValue

				unsubscribers[name] = unsubscribe = this.propagatePropertyChanged(name, value)

				propertyChanged.emit({
					name,
					oldValue,
					newValue: value
				})
			}
		})

		if (typeof initValue !== 'undefined') {
			object[name] = initValue
		}

		return this
	}

	readable(name, value) {
		const {object} = this
		const {unsubscribers} = object.__meta

		const unsubscribe = unsubscribers[name]
		const oldValue = object[name]

		Object.defineProperty(object, name, {
			configurable: true,
			get() {
				return value
			}
		})

		if (typeof value === 'undefined') {
			value = oldValue
		} else if (value !== oldValue) {
			if (unsubscribe) {
				unsubscribe()
			}
			unsubscribers[name] = this.propagatePropertyChanged(name, value)
		}

		return this
	}
}
