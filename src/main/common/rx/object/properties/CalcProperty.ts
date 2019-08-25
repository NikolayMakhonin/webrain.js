import {ThenableOrValue} from '../../../async/async'
import {resolveAsyncFunc} from '../../../async/ThenableSync'
import {PropertyChangedEvent} from '../../../lists/contracts/IPropertyChanged'
import {VALUE_PROPERTY_DEFAULT} from '../../deep-subscribe/contracts/constants'
import {DeferredCalc, IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {ObservableObject} from '../ObservableObject'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {IPropertyOptions, Property} from './property'

export type CalcPropertyFunc<TInput, TTarget, TSource>
	= (input: TInput, valueProperty: Property<TTarget, TSource>) => ThenableOrValue<void>

// export interface ICalcProperty<TInput, TValue, TMergeSource> {
// 	['@last']: TValue
// 	['@wait']: TValue
// 	['@lastOrWait']: TValue
// }

export class CalcProperty<TInput, TValue, TMergeSource> extends ObservableObject {
	private readonly _calcFunc: CalcPropertyFunc<TInput, TValue, TMergeSource>
	private readonly _valueProperty: Property<TValue, TMergeSource>
	private readonly _deferredCalc: DeferredCalc
	private _deferredValue: ThenableOrValue<TValue>
	private _hasValue: boolean

	public input: TInput

	constructor(
		calcFunc: CalcPropertyFunc<TInput, TValue, TMergeSource>,
		calcOptions: IDeferredCalcOptions,
		valueOptions?: IPropertyOptions<TValue, TMergeSource>,
		initValue?: TValue,
	) {
		super()

		if (typeof calcFunc !== 'function') {
			throw new Error(`calcFunc must be a function: ${calcFunc}`)
		}

		this._calcFunc = calcFunc
		this._valueProperty = new Property(valueOptions, initValue)

		this._deferredCalc = new DeferredCalc(
			() => {
				this.onValueChanged()
			},
			(done: () => void) => {
				this._deferredValue = resolveAsyncFunc(
					() => this._calcFunc(this.input, this._valueProperty),
					() => {
						this._hasValue = true
						const val = this._valueProperty.value
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

	public invalidate(): void {
		this._deferredCalc.invalidate()
	}

	public onValueChanged() {
		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			const oldValue = this._valueProperty.value
			propertyChangedIfCanEmit.onPropertyChanged(
				new PropertyChangedEvent('last', oldValue, () => this.last),
				new PropertyChangedEvent('wait', oldValue, () => this.wait),
				new PropertyChangedEvent('lastOrWait', oldValue, () => this.lastOrWait),
			)
		}
	}

	public get [VALUE_PROPERTY_DEFAULT](): ThenableOrValue<TValue>
	{
		return this.lastOrWait as any
	}

	public get last(): TValue {
		this._deferredCalc.calc()
		return this._valueProperty.value
	}

	public get wait(): ThenableOrValue<TValue> {
		this._deferredCalc.calc()
		return this._deferredValue as TValue
	}

	public get lastOrWait(): ThenableOrValue<TValue> {
		this._deferredCalc.calc()
		return this._hasValue
			? this._valueProperty.value
			: this._deferredValue as TValue
	}
}

new ObservableObjectBuilder(CalcProperty.prototype)
	.writable('input')

// Test:
// const test: RuleGetValueFunc<CalcProperty<any, { test1: { test2: 123 } }, any>, number> =
// 	o => o['@last']['@last']['@last'].test1['@last']['@wait'].test2['@last']
