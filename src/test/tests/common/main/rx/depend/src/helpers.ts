// tslint:disable-next-line:no-shadowed-variable
import {ThenableOrValue} from '../../../../../../../main/common/async/async'
import {
	callStateHashTable,
	reduceCallStates,
	valueIdToStateMap,
	valueToIdMap,
} from '../../../../../../../main/common/rx/depend/core/CallState'
import {ICallState} from '../../../../../../../main/common/rx/depend/core/contracts'
import {depend} from '../../../../../../../main/common/rx/depend/core/depend'
import {assert} from '../../../../../../../main/common/test/Assert'
import {Func} from "../../../../../../../main/common/helpers/typescript";

// region makeDependentFunc

// tslint:disable-next-line:no-shadowed-variable
export function __makeDependentFunc<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	>(func: Func<TThisOuter, TArgs, Iterator<TResultInner>>): Func<TThisOuter, TArgs, ThenableOrValue<TResultInner>>
// tslint:disable-next-line:no-shadowed-variable
export function __makeDependentFunc<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	>(func: Func<TThisOuter, TArgs, TResultInner>): Func<TThisOuter, TArgs, TResultInner>
// tslint:disable-next-line:no-shadowed-variable
export function __makeDependentFunc<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	>(func: Func<TThisOuter, TArgs, TResultInner | Iterator<TResultInner>>) {
	if (typeof func === 'function') {
		return depend<TThisOuter, TArgs, TResultInner>(func as any)
	}
	return null
}

// endregion

export function __invalidate<TThisOuter,
	TArgs extends any[],
	TResultInner,
	>(state: ICallState<TThisOuter, TArgs, TResultInner>) {
	return state.invalidate()
}

export function __outputCall(output): any {
	return output.call(2, 5, 10)
}

export function clearCallStates() {
	reduceCallStates(2000000000, 0)
	assert.strictEqual(callStateHashTable && callStateHashTable.size, 0)
	assert.strictEqual(valueIdToStateMap.size, 0)
	assert.strictEqual(valueToIdMap.size, 0)
}
