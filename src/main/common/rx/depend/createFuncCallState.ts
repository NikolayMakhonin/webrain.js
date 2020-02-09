import {Func, FuncCallStatus, IFuncCallState} from './contracts'

export function createFuncCallState<TThis,
	TArgs extends any[],
	TValue,
	>(
	func: Func<TThis, TArgs, TValue>,
	_this: TThis,
	dependentFunc: Func<TThis, TArgs, TValue>,
): IFuncCallState<TThis, TArgs, TValue> {
	return {
		func,
		_this,
		dependentFunc,
		status: FuncCallStatus.Invalidated,
		hasValue: false,
		hasError: false,
		valueAsync: null,
		value: void 0,
		error: void 0,
		// for detect recursive async loop
		parentCallState: null,
		_subscribersFirst: null,
		_subscribersLast: null,
		// for prevent multiple subscribe equal dependencies
		callId: 0,
		_unsubscribers: null,
		_unsubscribersLength: 0,
	}
}
