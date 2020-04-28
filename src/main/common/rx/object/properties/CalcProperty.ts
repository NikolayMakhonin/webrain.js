import {isAsync, ThenableOrValue} from '../../../async/async'
import {resolveAsyncFunc} from '../../../async/ThenableSync'
import {CalcStat} from '../../../helpers/CalcStat'
import {equals} from '../../../helpers/helpers'
import {now} from '../../../helpers/performance'
import {VALUE_PROPERTY_DEFAULT} from '../../../helpers/value-property'
import {webrainEquals, webrainOptions} from '../../../helpers/webrainOptions'
import {Debugger} from '../../Debugger'
import {DeferredCalc, IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {ObservableClass} from '../ObservableClass'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'
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

	public readonly timeSyncStat: CalcStat
	public readonly timeAsyncStat: CalcStat
	public readonly timeDebuggerStat: CalcStat
	public readonly timeEmitEventsStat: CalcStat
	public readonly timeTotalStat: CalcStat

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

		this.timeSyncStat = new CalcStat()
		this.timeAsyncStat = new CalcStat()
		this.timeDebuggerStat = new CalcStat()
		this.timeEmitEventsStat = new CalcStat()
		this.timeTotalStat = new CalcStat()

		this._calcFunc = calcFunc
		// this._calcFunc = dependX(function(state) {
		// 	const result = calcFunc(state)
		// 	return isThenable(result) ? thenableAsIterator(result) : result
		// })

		// let dependUnsubscribe
		// this.propertyChanged.hasSubscribersObservable
		// 	.subscribe(hasSubscribers => {
		// 		if (dependUnsubscribe) {
		// 			dependUnsubscribe()
		// 			dependUnsubscribe = null
		// 		}
		//
		// 		if (hasSubscribers) {
		// 			dependUnsubscribe = getOrCreateCallState(this._calcFunc)
		// 				.call(this, this.state)
		// 				.subscribe(() => {
		// 					this._invalidate()
		// 				})
		// 		}
		// 	})

		this.state = new CalcPropertyState(calcOptions, initValue)

		if (typeof name !== 'undefined') {
			this.state.name = name
		}

		this._deferredCalc = new DeferredCalc(
			() => {
				this.onInvalidated()
			},
			() => {
				const prevValue = this.state.value

				const timeStart = now()
				let timeSync
				let timeAsync
				let timeDebugger
				let timeEmitEvents
				const deferredValue = resolveAsyncFunc(
					() => {
						if (typeof this.state.input === 'undefined') {
							return false
						}
						const result = this._calcFunc(this.state)
						timeSync = now()
						return result
					},
					(isChangedForce: boolean) => {
						this._hasValue = true
						let val = this.state.value
						if (webrainOptions.equalsFunc.call(this.state, prevValue, this.state.value)) {
							this.state.value = val = prevValue
						}
						timeAsync = now()
						Debugger.Instance.onCalculated(this, prevValue, val)
						timeDebugger = now()
						this._deferredCalc.done(isChangedForce, prevValue, val)
						timeEmitEvents = now()

						this.timeSyncStat.add(timeSync - timeStart)
						this.timeAsyncStat.add(timeAsync - timeStart)
						this.timeDebuggerStat.add(timeDebugger - timeAsync)
						this.timeEmitEventsStat.add(timeEmitEvents - timeDebugger)
						this.timeTotalStat.add(timeEmitEvents - timeStart)

						return val
					},
					err => {
						this._error = err
						timeAsync = now()
						console.error(err)
						Debugger.Instance.onError(this, this.state.value, prevValue, err)
						timeDebugger = now()
						let val = this.state.value
						if (webrainOptions.equalsFunc.call(this.state, prevValue, this.state.value)) {
							this.state.value = val = prevValue
						}
						this._deferredCalc.done(!equals(prevValue, val), prevValue, val)
						timeEmitEvents = now()

						this.timeSyncStat.add(timeSync - timeStart)
						this.timeAsyncStat.add(timeAsync - timeStart)
						this.timeDebuggerStat.add(timeDebugger - timeAsync)
						this.timeEmitEventsStat.add(timeEmitEvents - timeDebugger)
						this.timeTotalStat.add(timeEmitEvents - timeStart)

						return val // ThenableSync.createRejected(err)
					},
					true,
				)

				if (isAsync(deferredValue)) {
					this.setDeferredValue(deferredValue)
				}
			},
			(isChangedForce, oldValue, newValue) => {
				if (isChangedForce || !equals(oldValue, newValue)) {
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
		if (!force && webrainEquals.call(this, oldValue, newValue)) {
			return
		}

		this._deferredValue = newValue

		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			propertyChangedIfCanEmit.onPropertyChanged(
				{name: VALUE_PROPERTY_DEFAULT, oldValue, newValue},
				{name: 'wait', oldValue, newValue},
				// this._hasValue ? null : {name: 'lastOrWait', oldValue, newValue},
			)
		}
	}

	private onValueChanged(oldValue, newValue, force?: boolean) {
		if (!force && webrainEquals.call(this, oldValue, newValue)) {
			return
		}

		const {propertyChangedIfCanEmit} = this
		if (propertyChangedIfCanEmit) {
			propertyChangedIfCanEmit.onPropertyChanged(
				{name: 'last', oldValue, newValue},
				// {name: 'lastOrWait', oldValue, newValue},
			)
		}
	}

	public invalidate(): void {
		this._invalidate()
		// invalidateCallState(getCallState(this._calcFunc).call(this, this.state))
	}

	private _invalidate(): void {
		if (!this._error) {
			// console.log('invalidate: ' + this.state.name)
			this._deferredCalc.invalidate()
		}
	}

	public onInvalidated() {
		Debugger.Instance.onInvalidated(this, this.state.value)

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

	/** @deprecated not needed and not implemented. Use 'last' instead. */
	get lastOrWait(): ThenableOrValue<TValue> {
		this._deferredCalc.calc()
		return this._hasValue
			? this.state.value
			: this._deferredValue as TValue
	}

	public clear() {
		if (!webrainEquals.call(this, this.state.value, this._initValue)) {
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
