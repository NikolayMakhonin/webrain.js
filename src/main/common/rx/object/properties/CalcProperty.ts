import {isAsync, ThenableOrValue} from '../../../async/async'
import {resolveAsyncFunc} from '../../../async/ThenableSync'
import {VALUE_PROPERTY_DEFAULT} from '../../../helpers/value-property'
import {DeferredCalc, IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {ObservableClass} from '../ObservableClass'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {CalcObjectDebugger} from './CalcObjectDebugger'
import {CalcPropertyFunc, ICalcProperty, ICalcPropertyState} from './contracts'

export class CalcPropertyValue<TValue, TInput = any> {
	public get: () => CalcProperty<TValue, TInput>
	constructor(property: CalcProperty<TValue, TInput>) {
		this.get = () => property
	}
}

export class CalcPropertyState<TValue, TInput = any>
	extends ObservableClass
	implements ICalcPropertyState<TValue, TInput>
{
	public readonly calcOptions: IDeferredCalcOptions
	public name: string

	constructor(
		calcOptions: IDeferredCalcOptions,
		initValue: TValue,
	) {
		super()
		this.calcOptions = calcOptions
		this.value = initValue
	}

	public value: TValue
	public input: TInput
}

new ObservableObjectBuilder(CalcPropertyState.prototype)
	.writable('input')
	.writable('value')

export class CalcProperty<TValue, TInput = any>
	extends ObservableClass
	implements ICalcProperty<TValue, TInput>
{
	private readonly _calcFunc: CalcPropertyFunc<TValue, TInput>
	private readonly _deferredCalc: DeferredCalc
	private _deferredValue: ThenableOrValue<TValue>
	private _hasValue: boolean
	private _error: Error
	private readonly _initValue?: TValue

	public readonly state: ICalcPropertyState<TValue, TInput>

	constructor({
		calcFunc,
		name,
		calcOptions,
		initValue,
	}: {
		calcFunc: CalcPropertyFunc<TValue, TInput>,
		name?: string,
		calcOptions: IDeferredCalcOptions,
		initValue?: TValue,
	}) {
		super()

		if (typeof calcFunc !== 'function') {
			throw new Error(`calcFunc must be a function: ${calcFunc}`)
		}

		if (typeof initValue !== 'function') {
			this._initValue = initValue
		}

		if (!calcOptions) {
			calcOptions = {}
		}

		this._calcFunc = calcFunc
		this.state = new CalcPropertyState(calcOptions, initValue)

		if (typeof name !== 'undefined') {
			this.state.name = name
		}

		this._deferredCalc = new DeferredCalc(
			() => {
				this.onInvalidated()
			},
			(done: (isChanged: boolean, oldValue: TValue, newValue: TValue) => void) => {
				const prevValue = this.state.value

				const deferredValue = resolveAsyncFunc(
					() => {
						if (typeof this.state.input === 'undefined') {
							return false
						}
						return this._calcFunc(this.state)
					},
					valueChanged => {
						this._hasValue = true
						const val = this.state.value
						CalcObjectDebugger.Instance.onCalculated(this, val, prevValue)
						done(valueChanged != null
							? valueChanged as boolean
							: (prevValue !== val ? true : null), prevValue, val)
						return val
					},
					err => {
						this._error = err
						console.error(err)
						CalcObjectDebugger.Instance.onError(this, this.state.value, prevValue, err)
						const val = this.state.value
						done(prevValue !== val, prevValue, val)
						return val // ThenableSync.createRejected(err)
					},
					true,
				)

				if (isAsync(deferredValue)) {
					this.setDeferredValue(deferredValue)
				}
			},
			(isChanged, oldValue, newValue) => {
				if (isChanged !== false) {
					this.setDeferredValue(newValue, isChanged)
					this.onValueChanged(oldValue, newValue, isChanged)
				}
			},
			calcOptions,
		)
	}

	private setDeferredValue(newValue, force?: boolean) {
		const oldValue = this._deferredValue
		if (!force && newValue === oldValue) {
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

	private onValueChanged(oldValue, newValue, force?: boolean) {
		if (!force && newValue === oldValue) {
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
		if (!this._error) {
			this._deferredCalc.invalidate()
		}
	}

	public onInvalidated() {
		CalcObjectDebugger.Instance.onInvalidated(this, this.state.value)

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
		return this.state.value
	}

	get lastOrWait(): ThenableOrValue<TValue> {
		this._deferredCalc.calc()
		return this._hasValue
			? this.state.value
			: this._deferredValue as TValue
	}

	public clear() {
		if (this.state.value !== this._initValue) {
			const oldValue = this.state.value
			const newValue = this._initValue
			this.state.value = newValue

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
