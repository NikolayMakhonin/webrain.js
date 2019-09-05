import {ThenableOrValue} from '../../../async/async'
import {VALUE_PROPERTY_DEFAULT} from '../../../helpers/value-property'

export type ValueKeys = '@last' | '@wait' | '@lastOrWait'

export interface ICalcProperty<TValue> {
	readonly [VALUE_PROPERTY_DEFAULT]: ThenableOrValue<TValue>
	readonly last: TValue
	readonly wait: ThenableOrValue<TValue>
	readonly lastOrWait: ThenableOrValue<TValue>
}
