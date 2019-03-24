import {Subject} from './subject'
import './extensions/observable'

export class ObservableObject {

}

ObservableObject.prototype.__propertyChanged = new Subject()

function propagatePropertyChanged(object, propertyName, value) {
	if (!value) {
		return null
	}

	const propertyChanged = value.__propertyChanged

	if (!propertyChanged) {
		return null
	}

	return object.__propertyChanged.hasObserversObservable
		.unsubscribeValue(false)
		.autoConnect(null, () => propertyChanged.subscribe(event => {
			object.__propertyChanged.emit({
				propertyName,
				next: event
			})
		}))
}

export function createWritableProperty(object, name, value) {
	let unsubscribe = propagatePropertyChanged(object, name, value)

	Object.defineProperty(object, name, {
		get() {
			return value
		},
		set(newValue) {
			if (newValue === value) {
				return
			}

			if (unsubscribe) {
				unsubscribe()
				unsubscribe = null
			}

			const oldValue = value
			value = newValue

			unsubscribe = propagatePropertyChanged(object, name, value)

			object.__propertyChanged.emit({
				name,
				oldValue,
				newValue: value
			})
		}
	})
}

export function createReadOnlyProperty(object, name, value) {
	propagatePropertyChanged(object, name, value)

	Object.defineProperty(object, name, {
		get() {
			return value
		}
	})
}
