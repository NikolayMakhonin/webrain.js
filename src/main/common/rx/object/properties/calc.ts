import {isThenable, Thenable, ThenableOrValue} from '../../../async/async'
import {resolveAsyncFunc} from '../../../async/ThenableSync'
import {PropertyChangedEvent} from '../../../lists/contracts/IPropertyChanged'
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
	private _hasValue: boolean

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
				this.onValueChanged()
			},
			(done: () => void) => {
				this._waiter = resolveAsyncFunc(
					() => this._calcFunc(this.input, this._value),
					() => {
						this._hasValue = true
						const val = this._value.value
						done()
						return val
					},
					done,
					true,
				)
			},
			() => {
				this.onValueChanged()
			},
			calcOptions,
		)
	}

	get current(): TValue {
		this._deferredCalc.calc()
		return this._value.value
	}

	get wait(): ThenableOrValue<TValue> {
		this._deferredCalc.calc()
		return this._waiter as TValue
	}

	get currentOrWait(): ThenableOrValue<TValue> {
		this._deferredCalc.calc()
		return this._hasValue
			? this._value.value
			: this._waiter as TValue
	}

	public onValueChanged() {
		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			const oldValue = this._value.value
			propertyChangedIfCanEmit.onPropertyChanged(
				new PropertyChangedEvent('current', oldValue, () => this.current),
				new PropertyChangedEvent('wait', oldValue, () => this.wait),
				new PropertyChangedEvent('currentOrWait', oldValue, () => this.currentOrWait),
			)
		}
	}

	public invalidate(): void {
		this._deferredCalc.invalidate()
	}
}

new ObservableObjectBuilder(CalcProperty.prototype)
	.writable('input')
