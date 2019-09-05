import {ThenableOrIteratorOrValue, ThenableOrValue} from '../../../async/async'
import {resolveAsyncFunc} from '../../../async/ThenableSync'
import {VALUE_PROPERTY_DEFAULT} from '../../../helpers/value-property'
import {DeferredCalc, IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {ObservableObject} from '../ObservableObject'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {CalcObjectDebugger} from './CalcObjectDebugger'
import {ICalcProperty} from './contracts'
import {IPropertyOptions, Property} from './Property'

export type CalcPropertyFunc<TInput, TTarget, TSource>
	= (input: TInput, property: Property<TTarget, TSource>) => ThenableOrIteratorOrValue<void>

export class CalcPropertyValue<TValue, TInput = any, TMergeSource = any> {
	public get: () => CalcProperty<TValue, TInput, TMergeSource>
	constructor(property: CalcProperty<TValue, TInput, TMergeSource>) {
		this.get = () => property
	}
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
				this.onInvalidated()
			},
			(done: (isChanged: boolean) => void) => {
				const prevValue = this._valueProperty.value
				this._deferredValue = resolveAsyncFunc(
					() => this._calcFunc(this.input, this._valueProperty),
					() => {
						this._hasValue = true
						const val = this._valueProperty.value
						CalcObjectDebugger.Instance.onCalculated(this, val, prevValue)
						done(prevValue !== val)
						return val
					},
					err => {
						CalcObjectDebugger.Instance.onError(this, this._valueProperty.value, prevValue, err)
						done(prevValue !== this._valueProperty.value)
						return err
					},
					true,
				)
			},
			isChanged => {
				if (isChanged) {
					this.onCalculated()
				}
			},
			calcOptions,
		)
	}

	public invalidate(): void {
		this._deferredCalc.invalidate()
	}

	public onInvalidated() {
		CalcObjectDebugger.Instance.onInvalidated(this, this._valueProperty.value)

		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			const oldValue = this._valueProperty.value
			const newValue = new CalcPropertyValue(this)
			propertyChangedIfCanEmit.onPropertyChanged(
				{name: VALUE_PROPERTY_DEFAULT, oldValue, newValue},
				{name: 'wait', oldValue, newValue},
				{name: 'last', oldValue, newValue},
				{name: 'lastOrWait', oldValue, newValue},
			)
		}
	}

	public onCalculated() {
		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			const oldValue = this._valueProperty.value
			const newValue = new CalcPropertyValue(this)
			propertyChangedIfCanEmit.onPropertyChanged(
				{name: 'last', oldValue, newValue},
				{name: 'lastOrWait', oldValue, newValue},
			)
		}
	}

	public get [VALUE_PROPERTY_DEFAULT](): ThenableOrValue<TValue>
	{
		return this.wait as any
	}

	get wait(): ThenableOrValue<TValue> {
		this._deferredCalc.calc()
		return this._deferredValue as TValue
	}

	get last(): TValue {
		this._deferredCalc.calc()
		return this._valueProperty.value
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
			this.invalidate()
		}
	}
}

new ObservableObjectBuilder(CalcProperty.prototype)
	.writable('input')

// Test:
// const test: RuleGetValueFunc<CalcProperty<any, { test1: { test2: 123 } }, any>, number> =
// 	o => o['@last']['@last']['@last'].test1['@last']['@wait'].test2['@last']
