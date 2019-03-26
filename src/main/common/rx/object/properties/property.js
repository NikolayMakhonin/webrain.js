import {ObservableObject} from "../ObservableObject";

export class Property extends ObservableObject {
	constructor(valueFactory) {
		super()
		this._valueFactory = valueFactory
	}

	get value() {
		return this._value
	}

	set value(value) {
		this.set(value)
	}

	set() {

	}
}