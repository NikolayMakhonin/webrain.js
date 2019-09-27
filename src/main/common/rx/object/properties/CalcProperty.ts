import {isAsync, ThenableOrIteratorOrValue, ThenableOrValue} from '../../../async/async'
import {resolveAsyncFunc, ThenableSync} from '../../../async/ThenableSync'
import {VALUE_PROPERTY_DEFAULT} from '../../../helpers/value-property'
import {DeferredCalc, IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {ObservableObject} from '../ObservableObject'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {CalcObjectDebugger} from './CalcObjectDebugger'
import {ICalcProperty} from './contracts'
import {IPropertyOptions, Property} from './Property'

/** @return true: value changed; false: value not changed; null - auto */
export type CalcPropertyFunc<TInput, TTarget, TSource>
	= (input: TInput, property: Property<TTarget, TSource>) => ThenableOrIteratorOrValue<boolean|void>

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
	public name: string

	constructor({
		calcFunc,
		name,
		calcOptions,
		valueOptions,
		initValue,
	}: {
		calcFunc: CalcPropertyFunc<TInput, TValue, TMergeSource>,
		name?: string,
		calcOptions: IDeferredCalcOptions,
		valueOptions?: IPropertyOptions<TValue, TMergeSource>,
		initValue?: TValue,
	}) {
		super()

		if (typeof calcFunc !== 'function') {
			throw new Error(`calcFunc must be a function: ${calcFunc}`)
		}

		if (typeof initValue !== 'function') {
			this._initValue = initValue
		}

		if (typeof name !== 'undefined') {
			this.name = name
		}

		this._calcFunc = calcFunc
		this._valueProperty = new Property(valueOptions, initValue)

		this._deferredCalc = new DeferredCalc(
			() => {
				this.onInvalidated()
			},
			(done: (isChanged: boolean, oldValue: TValue, newValue: TValue) => void) => {
				const prevValue = this._valueProperty.value

				const deferredValue = resolveAsyncFunc(
					() => {
						if (typeof this.input === 'undefined') {
							return false
						}
						return this._calcFunc(this.input, this._valueProperty)
					},
					valueChanged => {
						this._hasValue = true
						const val = this._valueProperty.value
						CalcObjectDebugger.Instance.onCalculated(this, val, prevValue)
						done(valueChanged != null
							? valueChanged as boolean
							: prevValue !== val, prevValue, val)
						return val
					},
					err => {
						CalcObjectDebugger.Instance.onError(this, this._valueProperty.value, prevValue, err)
						const val = this._valueProperty.value
						done(prevValue !== val, prevValue, val)
						return ThenableSync.createRejected(err)
					},
					true,
				)

				if (isAsync(deferredValue)) {
					this.setDeferredValue(deferredValue)
				}
			},
			(isChanged, oldValue, newValue) => {
				if (isChanged) {
					this.setDeferredValue(newValue)
					this.onValueChanged(oldValue, newValue)
				}
			},
			calcOptions,
		)
	}

	private setDeferredValue(newValue) {
		const oldValue = this._deferredValue
		if (newValue === oldValue) {
			return
		}

		this._deferredValue = newValue

		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			propertyChangedIfCanEmit.onPropertyChanged(
				{name: VALUE_PROPERTY_DEFAULT, oldValue, newValue},
				{name: 'wait', oldValue, newValue},
			)
		}
	}

	private onValueChanged(oldValue, newValue) {
		if (newValue === oldValue) {
			return
		}

		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			propertyChangedIfCanEmit.onPropertyChanged(
				{name: 'last', oldValue, newValue},
			)
		}
	}

	public invalidate(): void {
		this._deferredCalc.invalidate()
	}

	public onInvalidated() {
		CalcObjectDebugger.Instance.onInvalidated(this, this._valueProperty.value)

		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			this._deferredCalc.calc()
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
			const oldValue = this._valueProperty.value
			const newValue = this._initValue
			this._valueProperty.value = newValue

			this.onValueChanged(oldValue, newValue)
			this.setDeferredValue(newValue)

			this.invalidate()
		}
	}
}

new ObservableObjectBuilder(CalcProperty.prototype)
	.writable('input')

// Test:
// const test: RuleGetValueFunc<CalcProperty<any, { test1: { test2: 123 } }, any>, number> =
// 	o => o['@last']['@last']['@last'].test1['@last']['@wait'].test2['@last']
