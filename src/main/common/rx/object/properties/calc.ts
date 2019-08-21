import {isThenable, Thenable, ThenableOrValue} from '../../../async/async'
import {resolveAsync, resolveAsyncFunc} from '../../../async/ThenableSync'
import {DeferredCalc, IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {ObservableObject} from '../ObservableObject'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {IPropertyOptions, Property} from './property'

export type CalcPropertyFunc<TInput, TTarget, TSource>
	= (input: TInput, value: Property<TTarget, TSource>) => ThenableOrValue<void>

const valuePropertiesNames = ['current', 'wait', 'currentOrWait']

export class CalcProperty<TInput, TValue, TMergeSource> extends ObservableObject {
	private readonly _calcFunc: CalcPropertyFunc<TInput, TValue, TMergeSource>
	private readonly _value: Property<TValue, TMergeSource>
	private readonly _deferredCalc: DeferredCalc
	private _waiter: ThenableOrValue<TValue>
	private hasValue: boolean
	private isCalculated: boolean

	public input: TInput

	constructor(
		calcFunc: CalcPropertyFunc<TInput, TValue, TMergeSource>,
		calcOptions: IDeferredCalcOptions,
		valueOptions?: IPropertyOptions<TValue, TMergeSource>,
		value?: TValue,
	) {
		super()

		if (typeof calcFunc !== 'function') {
			throw new Error(`calcFunc must be a function: ${calcFunc}`)
		}

		this._calcFunc = calcFunc
		this._value = new Property(valueOptions, value)

		this._deferredCalc = new DeferredCalc(
			() => {
				this.onPropertyChanged(propertyNames)
			},
			(done: () => void) => {
				this._waiter = resolveAsyncFunc(
					() => this._calcFunc(this.input, this._value),
					() => {
						const val = this._value.value
						done()
						return val
					},
					done,
					true,
				)
			},
			function() {
				this.onPropertyChanged(propertyNames)
			},
			calcOptions,
		)
	}

	get current(): TValue {
		if (!this.isCalculated) {
			this._deferredCalc.calc()

			if (!isThenable(this._waiter)) {
				return this._waiter as TValue
			}
		}

		return this._value.value
	}

	get wait(): ThenableOrValue<TValue> {
		if (!this.isCalculated) {
			this._deferredCalc.calc()
		}

		return this._waiter as TValue
	}

	get currentOrWait(): ThenableOrValue<TValue> {
		if (!this.isCalculated) {
			this._deferredCalc.calc()
			if (!isThenable(this._waiter)) {
				return this._waiter as TValue
			}
		}

		return this._value.value
	}

	public invalidate(): void {
		// this.onPropertyChanged(valuePropertiesNames)
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

new ObservableObjectBuilder(CalcProperty.prototype)
	.writable('input')
