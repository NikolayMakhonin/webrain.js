import {DeferredCalc} from '../../deferred-calc/DeferredCalc'
import {ObservableObject} from '../ObservableObject'
import {Property} from './property'

export class DeferredCalcProperty<TValue> extends ObservableObject {
	private readonly _deferredCalc: DeferredCalc
	private readonly _calcFunc: () => Promise<TValue>|TValue
	private isCalculated: boolean
	private _property: Property

	constructor(calcFunc: () => TValue) {
		super()

		if (typeof calcFunc !== 'function') {
			throw new Error(`calcFunc must be a function: ${calcFunc}`)
		}

		this._calcFunc = calcFunc
	}

	get deferredValue() {
		return this._property.value
	}

	get value(): TValue {
		if (this.isCalculated) {
			return this._value
		}

		const value = this._calcFunc()
		this._value = value

		this.isCalculated = true

		return value
	}

	public invalidate(): void {
		if (this.isCalculated) {
			const {_propertyChangedIfCanEmit} = this
			if (!_propertyChangedIfCanEmit) {
				this.isCalculated = false
				return
			}

			const event = {
				name    : 'value',
				oldValue: this.value,
			}

			this.isCalculated = false

			Object.defineProperty(event, 'newValue', {
				configurable: true,
				enumerable  : true,
				get         : () => this.value,
			})

			_propertyChangedIfCanEmit.emit(event)
		}
	}
}
