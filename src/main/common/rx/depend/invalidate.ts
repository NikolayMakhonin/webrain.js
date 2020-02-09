import {FuncCallStatus, IFuncCallState} from './contracts'
import {update} from './update'

export function invalidate<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>, status?: FuncCallStatus) {
	if (status == null) {
		update(state, FuncCallStatus.Invalidating)
		update(state, FuncCallStatus.Invalidated)
	} else {
		update(state, status)
	}
}
