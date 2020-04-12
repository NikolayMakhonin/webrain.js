import {getCallState, invalidateCallState, resolveAsync} from '../../..'
import {isAsync, Thenable, ThenableOrIteratorOrValue, ThenableOrValue} from '../../../async/async'
import {resolveAsyncFunc} from '../../../async/ThenableSync'
import {CalcStat} from '../../../helpers/CalcStat'
import {now} from '../../../helpers/performance'
import {VALUE_PROPERTY_DEFAULT} from '../../../helpers/value-property'
import {webrainOptions} from '../../../helpers/webrainOptions'
import {Debugger} from '../../Debugger'
import {DeferredCalc, IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {IDeferredOptions} from '../../depend/core/contracts'
import {dependX} from '../../depend/core/depend'
import {makeDependPropertySubscriber} from '../helpers'
import {ObservableClass} from '../ObservableClass'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {ICalcProperty, ICalcPropertyState} from './contracts'

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

function *thenableAsIterator<T>(thenable: Thenable<T>) {
	return thenable
}

/** @return true: value changed; false: value not changed; null - auto */
type CalcPropertyFunc<TValue, TInput>
	= (this: void, state: ICalcPropertyState<TValue, TInput>)
	=> ThenableOrIteratorOrValue<TValue>

export class DependCalcProperty_<TValue, TInput = any>
	extends ObservableClass
	implements ICalcProperty<TValue, TInput>
{
	public readonly state: ICalcPropertyState<TValue, TInput>

	constructor({
		calcFunc,
		name,
		calcOptions,
		initValue,
	}: {
		calcFunc: CalcPropertyFunc<TValue, TInput>,
		name?: string,
		calcOptions: IDeferredOptions,
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

		this._calcFunc = dependX(calcFunc, calcOptions, makeDependPropertySubscriber(VALUE_PROPERTY_DEFAULT))

		this.state = new CalcPropertyState(calcOptions, initValue)

		if (typeof name !== 'undefined') {
			this.state.name = name
		}
	}

	public calcFunc: (this: void, state: ICalcPropertyState<TValue, TInput>) => ThenableOrValue<TValue>

	public get [VALUE_PROPERTY_DEFAULT](): ThenableOrValue<TValue> {
		const {calcFunc} = this
		return calcFunc(this.state)
	}
}

// Test:
// const test: RuleGetValueFunc<CalcProperty<any, { test1: { test2: 123 } }, any>, number> =
// 	o => o['@last']['@last']['@last'].test1['@last']['@wait'].test2['@last']
