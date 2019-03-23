import {Observable} from './Observable'

export class ObservableObject {

}

ObservableObject.prototype.__propertyChanged = new Observable()

export function createWritableProperty(object, name, value) {
	function propagatePropertyChanged(valueObject) {
		return valueObject?.__propertyChanged?.subscribe(event => {
			object.__propertyChanged.emit({
				name,
				next: event
			})
		})
	}

	let unsubscribe = propagatePropertyChanged(value)

	Object.defineProperty(object, name, {
		get() {
			return value
		},
		set(newValue) {
			if (newValue === value) {
				return
			}

			unsubscribe?.()

			const oldValue = value
			value = newValue

			unsubscribe = propagatePropertyChanged(value)

			object.__propertyChanged.emit({
				name,
				oldValue,
				newValue: value
			})
		}
	})
}
