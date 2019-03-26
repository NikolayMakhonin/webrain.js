import {ObservableObject} from '../ObservableObject'

export class CalcSync extends ObservableObject {
	constructor(calcValue) {
		super()

		if (typeof calcValue !== 'function') {
			throw new Error(`calcValue must be a function: ${calcValue}`)
		}

		this._calcValue = calcValue
	}

	get value() {
		if (this.isCalculated) {
			return this._value
		}

		const value = this._calcValue()
		this._value = value

		this.isCalculated = true

		return value
	}

	invalidate() {
		if (this.isCalculated) {
			this.isCalculated = false
			this.onPropertyChanged('value')
		}
	}
}
