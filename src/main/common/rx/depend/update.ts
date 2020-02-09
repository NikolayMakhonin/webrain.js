import {FuncCallStatus, IFuncCallState} from './contracts'
import {emit} from './emit'
import {unsubscribeDependencies} from './unsubscribeDependencies'

export function update<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>, status, valueAsyncOrValueOrError?) {
	const prevStatus = state.status
	state.status = status
	switch (status) {
		case FuncCallStatus.Invalidating:
			if (prevStatus === FuncCallStatus.Invalidated) {
				return
			}
			// tslint:disable-next-line:no-nested-switch
			if (prevStatus !== FuncCallStatus.Invalidating
				&& prevStatus !== FuncCallStatus.Calculated
				&& prevStatus !== FuncCallStatus.Error
			) {
				throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
			}
			unsubscribeDependencies(state)
			emit(state, status)
			break
		case FuncCallStatus.Invalidated:
			if (prevStatus !== FuncCallStatus.Invalidating) {
				return
			}
			emit(state, status)
			break
		case FuncCallStatus.Calculating:
			if (prevStatus != null
				&& prevStatus !== FuncCallStatus.Invalidating
				&& prevStatus !== FuncCallStatus.Invalidated
			) {
				throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
			}
			break
		case FuncCallStatus.CalculatingAsync:
			if (prevStatus !== FuncCallStatus.Calculating) {
				throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
			}
			state.valueAsync = valueAsyncOrValueOrError
			break
		case FuncCallStatus.Calculated:
			if (prevStatus !== FuncCallStatus.Calculating && prevStatus !== FuncCallStatus.CalculatingAsync) {
				throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
			}
			if (typeof state.valueAsync !== 'undefined') {
				state.valueAsync = null
			}
			state.error = void 0
			state.value = valueAsyncOrValueOrError
			state.hasError = false
			state.hasValue = true
			break
		case FuncCallStatus.Error:
			if (prevStatus !== FuncCallStatus.Calculating && prevStatus !== FuncCallStatus.CalculatingAsync) {
				throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
			}
			if (typeof state.valueAsync !== 'undefined') {
				state.valueAsync = null
			}
			state.error = valueAsyncOrValueOrError
			state.hasError = true
			break
		default:
			throw new Error('Unknown FuncCallStatus: ' + status)
	}
}
