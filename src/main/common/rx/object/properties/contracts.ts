import {ThenableOrIteratorOrValue, ThenableOrValue} from '../../../async/async'
import {VALUE_PROPERTY_DEFAULT} from '../../../helpers/value-property'
import {IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'

export type ValueKeys = '@last' | '@wait' | '@lastOrWait'

export interface ICalcProperty<TValue, TInput = any> {
	readonly [VALUE_PROPERTY_DEFAULT]: ThenableOrValue<TValue>
	readonly last: TValue
	readonly wait: ThenableOrValue<TValue>
	readonly lastOrWait: ThenableOrValue<TValue>
	readonly state: ICalcPropertyState<TValue, TInput>
}

export interface ICalcPropertyState<TValue, TInput> {
	value: TValue
	input: TInput
	readonly calcOptions: IDeferredCalcOptions,
	name: string
}
