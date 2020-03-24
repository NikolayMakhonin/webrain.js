import {ThenableOrIterator, ThenableOrValue} from '../../async/async'
import {_dependentFunc} from './_dependentFunc'
import {_getFuncCallState} from './_getFuncCallState'
import {Func, IFuncCallState, TFuncCallState, TGetThis} from './contracts'
import {InternalError} from './helpers'

export function createDependentFunc<
	TThis,
	TArgs extends any[],
	TValue,
	TNewThis
>(getState: Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue, TNewThis>>): Func<
	TThis,
	TArgs,
	Func<
		TThis,
		TArgs,
		TValue extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TValue
	>
> {
	return function() {
		const state: IFuncCallState<TThis, TArgs, TValue, TNewThis>
			= getState.apply(this, arguments)
		return _dependentFunc(state) as any
	}
}

type TRootStateMap = WeakMap<Func<any, any, any>, Func<any, any, TFuncCallState>>

// interface TMakeDependentFunc {
// 	<TThis, TArgs extends any[], TValue, TNewThis>(
// 		func: Func<TNewThis, TArgs, Iterator<TValue>>,
// 	): Func<TNewThis, TArgs, ThenableOrValue<TValue>>
//
// 	<TThis, TArgs extends any[], TValue, TNewThis>(
// 		func: Func<TNewThis, TArgs, TValue>,
// 	): Func<TNewThis, TArgs, TValue>
// }

// type TMakeDependentFunc = <
// 	TThis,
// 	TArgs extends any[],
// 	TValue
// >(
// 	func: Func<TThis, TArgs, TValue>,
// ) => Func<
// 	TThis,
// 	TArgs,
// 	TValue extends Iterator<infer V, any, any> ? ThenableOrValue<V> : TValue
// >
//
// type TMakeDependentFuncX = <
// 	TThis,
// 	TArgs extends any[],
// 	TValue,
// >(
// 	func: Func<IFuncCallState<TThis, TArgs, TValue>, TArgs, TValue>,
// ) => Func<
// 	TThis,
// 	TArgs,
// 	TValue extends Iterator<infer V, any, any> ? ThenableOrValue<V> : TValue
// >

// tslint:disable-next-line:no-empty
const EMPTY_FUNC: Func<any, any, any> = () => {}

// tslint:disable-next-line:no-shadowed-variable
export function createGetFuncCallState(rootStateMap: TRootStateMap) {
	// tslint:disable-next-line:no-shadowed-variable
	function getFuncCallState<
		TThis,
		TArgs extends any[],
		TValue,
		TNewThis
	>(
		func: Func<TThis, TArgs, TValue>,
	): Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue, TNewThis>> {
		return rootStateMap.get(func) || EMPTY_FUNC
	}

	return getFuncCallState
}

const rootStateMap: TRootStateMap = new WeakMap()
// tslint:disable-next-line:no-shadowed-variable
export const getFuncCallState = createGetFuncCallState(rootStateMap)

function makeDependentFunc<
	TThis,
	TArgs extends any[],
	TValue,
	TNewThis
>(
	func: Func<TNewThis, TArgs, TValue>,
	getThis: TGetThis<TThis, TArgs, TValue, TNewThis>,
): Func<
	TThis,
	TArgs,
	TValue extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TValue
> {
	if (rootStateMap.get(func)) {
		throw new InternalError('Multiple call makeDependentFunc() for func: ' + func)
	}

	const getState = _getFuncCallState(func, getThis)

	rootStateMap.set(func, getState)

	const dependentFunc = createDependentFunc(getState)

	rootStateMap.set(dependentFunc, getState)

	return dependentFunc as any
}

function ThisAsOrig<
	TThis,
	TArgs extends any[],
	TValue,
	TNewThis
>(state: IFuncCallState<TThis, TArgs, TValue, TNewThis>): TThis {
	return state._this
}

function ThisAsState<
	TThis,
	TArgs extends any[],
	TValue,
	TNewThis
>(
	state: IFuncCallState<TThis, TArgs, TValue, TNewThis>,
): IFuncCallState<TThis, TArgs, TValue, TNewThis> {
	return state
}

interface TFuncCallStateX<TThis, TArgs extends any[], TValue>
	extends IFuncCallState<TThis, TArgs, TValue, TFuncCallStateX<TThis, TArgs, TValue>>
{}

export function dependX<
	TThis,
	TArgs extends any[],
	TValue
>(func: Func<TFuncCallStateX<TThis, TArgs, TValue>, TArgs, TValue>) {
	return makeDependentFunc<TThis, TArgs, TValue, TFuncCallStateX<TThis, TArgs, TValue>>
		(func, ThisAsState)
}

export function depend<
	TThis,
	TArgs extends any[],
	TValue,
>(func: Func<TThis, TArgs, TValue>) {
	return makeDependentFunc<TThis, TArgs, TValue, TThis>
		(func, ThisAsOrig)
}
