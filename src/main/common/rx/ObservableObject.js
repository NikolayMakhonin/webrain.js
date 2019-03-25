import './extensions/unsubscribeValue'
import {HasSubscribersSubject} from './subjects/hasSubscribers'

export class ObservableObject {
	get propertyChanged() {
		let {_propertyChanged} = this
		if (!_propertyChanged) {
			this._propertyChanged = _propertyChanged = new HasSubscribersSubject()
		}

		return _propertyChanged
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

	writable(name, value) {
		let unsubscribe = this.propagatePropertyChanged(name, value)

		const {object} = this

		Object.defineProperty(object, name, {
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

				unsubscribe = this.propagatePropertyChanged(object, name, value)

				object.propertyChanged.emit({
					name,
					oldValue,
					newValue: value
				})
			}
		})
	}

	readable(name, value) {
		this.propagatePropertyChanged(name, value)

		const {object} = this

		Object.defineProperty(object, name, {
			get() {
				return value
			}
		})
	}
}
