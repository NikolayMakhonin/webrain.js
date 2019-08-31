import {
	ThenableOrIteratorOrValue,
	ThenableOrValue,
} from '../../../async/async'
import {resolveAsyncFunc} from '../../../async/ThenableSync'
import {VALUE_PROPERTY_DEFAULT} from '../../../helpers/helpers'
import {DeferredCalc, IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {PropertyChangedEvent} from '../IPropertyChanged'
import {ObservableObject} from '../ObservableObject'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {IPropertyOptions, Property} from './property'

export type CalcPropertyFunc<TInput, TTarget, TSource>
	= (input: TInput, valueProperty: Property<TTarget, TSource>) => ThenableOrIteratorOrValue<void>

// export interface ICalcProperty<TInput, TValue, TMergeSource> {
// 	['@last']: TValue
// 	['@wait']: TValue
// 	['@lastOrWait']: TValue
// }

export interface ICalcProperty<TValue> {
	readonly [VALUE_PROPERTY_DEFAULT]: ThenableOrValue<TValue>
	readonly last: TValue
	readonly wait: ThenableOrValue<TValue>
	readonly lastOrWait: ThenableOrValue<TValue>
}

export class CalcProperty<TValue, TInput = any, TMergeSource = any>
	extends ObservableObject
	implements ICalcProperty<TValue>
{
	private readonly _calcFunc: CalcPropertyFunc<TInput, TValue, TMergeSource>
	private readonly _valueProperty: Property<TValue, TMergeSource>
	private readonly _deferredCalc: DeferredCalc
	private _deferredValue: ThenableOrValue<TValue>
	private _hasValue: boolean
	private readonly _initValue?: TValue

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

		if (typeof initValue !== 'function') {
			this._initValue = initValue
		}

		this._calcFunc = calcFunc
		this._valueProperty = new Property(valueOptions, initValue)

		this._deferredCalc = new DeferredCalc(
			() => {
				this.onValueChanged()
			},
			(done: (isChanged: boolean) => void) => {
				const prevValue = this._valueProperty.value
				this._deferredValue = resolveAsyncFunc(
					() => this._calcFunc(this.input, this._valueProperty),
					() => {
						this._hasValue = true
						const val = this._valueProperty.value
						done(prevValue !== val)
						return val
					},
					err => {
						done(prevValue !== this._valueProperty.value)
						return err
					},
					true,
				)
			},
			isChanged => {
				if (isChanged) {
					this.onValueChanged()
				}
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
				new PropertyChangedEvent(VALUE_PROPERTY_DEFAULT, oldValue, () => this[VALUE_PROPERTY_DEFAULT]),
				new PropertyChangedEvent('last', oldValue, () => this.last),
				new PropertyChangedEvent('wait', oldValue, () => this.wait),
				new PropertyChangedEvent('lastOrWait', oldValue, () => this.lastOrWait),
			)
		}
	}

	public get [VALUE_PROPERTY_DEFAULT](): ThenableOrValue<TValue>
	{
		return this.wait as any
	}

	get last(): TValue {
		this._deferredCalc.calc()
		return this._valueProperty.value
	}

	get wait(): ThenableOrValue<TValue> {
		this._deferredCalc.calc()
		return this._deferredValue as TValue
	}

	get lastOrWait(): ThenableOrValue<TValue> {
		this._deferredCalc.calc()
		return this._hasValue
			? this._valueProperty.value
			: this._deferredValue as TValue
	}

	public clear() {
		if (this._valueProperty.value !== this._initValue) {
			this._valueProperty.value = this._initValue
			this.onValueChanged()
		}
	}
}

new ObservableObjectBuilder(CalcProperty.prototype)
	.writable('input')

// Test:
// const test: RuleGetValueFunc<CalcProperty<any, { test1: { test2: 123 } }, any>, number> =
// 	o => o['@last']['@last']['@last'].test1['@last']['@wait'].test2['@last']
