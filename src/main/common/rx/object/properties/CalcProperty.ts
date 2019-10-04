import {isAsync, ThenableOrValue} from '../../../async/async'
import {resolveAsyncFunc} from '../../../async/ThenableSync'
import {VALUE_PROPERTY_DEFAULT} from '../../../helpers/value-property'
import {webrainOptions} from '../../../helpers/webrainOptions'
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
					isChangedForce => {
						this._hasValue = true
						let val = this.state.value
						if (webrainOptions.equalsFunc.call(this.state, prevValue, this.state.value)) {
							this.state.value = val = prevValue
						}
						CalcObjectDebugger.Instance.onCalculated(this, val, prevValue)
						done(isChangedForce, prevValue, val)
						return val
					},
					err => {
						this._error = err
						console.error(err)
						CalcObjectDebugger.Instance.onError(this, this.state.value, prevValue, err)
						let val = this.state.value
						if (webrainOptions.equalsFunc.call(this.state, prevValue, this.state.value)) {
							this.state.value = val = prevValue
						}
						done(prevValue !== val, prevValue, val)
						return val // ThenableSync.createRejected(err)
					},
					true,
				)

				if (isAsync(deferredValue)) {
					this.setDeferredValue(deferredValue)
				}
			},
			(isChangedForce, oldValue, newValue) => {
				if (isChangedForce || oldValue !== newValue) {
					if (!isChangedForce && isAsync(this._deferredValue)) {
						this._deferredValue = newValue
					} else {
						this.setDeferredValue(newValue, isChangedForce)
					}
					this.onValueChanged(oldValue, newValue, isChangedForce)
				}
			},
			calcOptions,
		)
	}

	private setDeferredValue(newValue, force?: boolean) {
		const oldValue = this._deferredValue
		if (!force && (webrainOptions.equalsFunc
			? webrainOptions.equalsFunc.call(this, oldValue, newValue)
			: oldValue === newValue)
		) {
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
		if (!force && (webrainOptions.equalsFunc
			? webrainOptions.equalsFunc.call(this, oldValue, newValue)
			: oldValue === newValue)
		) {
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
		if ((webrainOptions.equalsFunc
			? !webrainOptions.equalsFunc.call(this, this.state.value, this._initValue)
			: this.state.value !== this._initValue)
		) {
			const oldValue = this.state.value
			const newValue = this._initValue
			this.state.value = newValue

			this.onValueChanged(oldValue, newValue)
			this.setDeferredValue(newValue)

			this.invalidate()
		}
	}
}

// Test:
// const test: RuleGetValueFunc<CalcProperty<any, { test1: { test2: 123 } }, any>, number> =
// 	o => o['@last']['@last']['@last'].test1['@last']['@wait'].test2['@last']
