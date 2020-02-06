import {isThenable, ThenableOrIteratorOrValue, ThenableOrValue} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {isIterator} from '../../helpers/helpers'
import {Func, FuncCallStatus, IFuncCallState} from './contracts'
import {createCall, FuncCallState} from './FuncCallState'
import {ISemiWeakMap, SemiWeakMap} from './SemiWeakMap'

let currentState: IFuncCallState<any, any, any>

function* makeDependentIterator<
	TThis,
	TArgs extends any[],
	TValue,
	TFunc extends Func<TThis, TArgs, TValue>
>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	iterator: Iterator<TValue>,
): Iterator<TValue> {
	currentState = state

	try {
		let iteration = iterator.next()
		while (!iteration.done) {
			let value = iteration.value

			if (isIterator(value)) {
				value = makeDependentIterator(state, value as Iterator<TValue>)
			}

			value = yield value
			currentState = state
			iteration = iterator.next(value)
		}

		state.update(FuncCallStatus.Calculated, iteration.value)
		return iteration.value
	} catch (error) {
		state.update(FuncCallStatus.Error, error)
		throw error
	}
}

const rootStateMap = new WeakMap<Func<any, any, any>, Map<number, any>>()
// tslint:disable-next-line:no-empty
const emptyFunc: Func<any, any, any> = () => {}
export function getFuncCallState<
	TThis,
	TArgs extends any[],
	TValue
>(func: Func<TThis, TArgs, TValue>): Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>> {
	const funcStateMap = rootStateMap.get(func)
	return funcStateMap
		? _getFuncCallState(funcStateMap)
		: emptyFunc
}

function _getFuncCallState<
	TThis,
	TArgs extends any[],
	TValue
>(funcStateMap: Map<number, any>): Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>> {
	return function() {
		const argumentsLength = arguments.length
		let argsLengthStateMap = funcStateMap.get(argumentsLength)
		if (!argsLengthStateMap) {
			argsLengthStateMap = new SemiWeakMap()
			funcStateMap.set(argumentsLength, argsLengthStateMap)
		}

		let state: IFuncCallState<TThis, TArgs, TValue>
		if (argumentsLength) {
			let argsStateMap: ISemiWeakMap<any, any> = argsLengthStateMap.get(this)
			if (!argsStateMap) {
				argsStateMap = new SemiWeakMap()
				argsLengthStateMap.set(this, argsStateMap)
			}

			for (let i = 0; i < argumentsLength - 1; i++) {
				const arg = arguments[i]
				let nextStateMap: ISemiWeakMap<any, any> = argsStateMap.get(arg)
				if (!nextStateMap) {
					nextStateMap = new SemiWeakMap()
					argsStateMap.set(arg, nextStateMap)
				}
				argsStateMap = nextStateMap
			}

			const lastArg = arguments[argumentsLength - 1]
			state = argsStateMap.get(lastArg)
			if (!state) {
				state = new FuncCallState<TThis, TArgs, TValue>(this, createCall.apply(this, arguments))
				argsStateMap.set(lastArg, state)
			}
		} else {
			state = argsLengthStateMap.get(this)
			if (!state) {
				state = new FuncCallState<TThis, TArgs, TValue>(this, createCall.apply(this, arguments))
				argsLengthStateMap.set(this, state)
			}
		}

		return state
	}
}

export function makeDependentFunc<
	TThis,
	TArgs extends any[],
	TValue
>(func: Func<TThis, TArgs, Iterator<TValue>>): Func<TThis, TArgs, ThenableOrValue<TValue>>
export function makeDependentFunc<
	TThis,
	TArgs extends any[],
	TValue
>(func: Func<TThis, TArgs, TValue>): Func<TThis, TArgs, TValue>
export function makeDependentFunc<
	TThis,
	TArgs extends any[],
	TValue
>(func: Func<TThis, TArgs, TValue|Iterator<TValue>>): Func<TThis, TArgs, TValue> {
	if (rootStateMap.get(func)) {
		throw new Error('Multiple call makeDependentFunc() for func: ' + func)
	}
	const funcStateMap = new Map<number, any>()
	rootStateMap.set(func, funcStateMap)
	const getState = _getFuncCallState(funcStateMap)

	return function() {
		const state = getState.apply(this, arguments)

		if (state.status) {
			switch (state.status) {
				case FuncCallStatus.Invalidating:
					throw new Error('Call func during Invalidating')
				case FuncCallStatus.Calculating:
					throw new Error('Recursive sync loop detected')
				case FuncCallStatus.CalculatingAsync:
					let parentCallState = state.parentCallState
					while (parentCallState) {
						if (parentCallState === state) {
							throw new Error('Recursive async loop detected')
						}
						parentCallState = parentCallState.parentCallState
					}
					return state.valueAsync
				case FuncCallStatus.Calculated:
					return state.value
				case FuncCallStatus.Error:
					throw state.error
				default:
					throw new Error('Unknown FuncStatus: ' + state.status)
			}
		}

		const parentState = currentState

		try {
			state.parentCallState = parentState

			currentState = state

			if (parentState) {
				parentState.subscribeDependency(state)
			}

			state.update(FuncCallStatus.Calculating)

			let value: any = func.apply(this, arguments)

			if (isIterator(value)) {
				value = resolveAsync(
					makeDependentIterator(state, value as Iterator<TValue>)	as ThenableOrIteratorOrValue<TValue>,
				)

				if (isThenable(value)) {
					state.update(FuncCallStatus.CalculatingAsync, value)
					return value
				}
			} else if (isThenable(value)) {
				throw new Error('You should use iterator instead thenable for async functions')
			}

			state.update(FuncCallStatus.Calculated, value)
			return value
		} catch (error) {
			state.update(FuncCallStatus.Error, error)
			throw error
		} finally {
			currentState = parentState
		}
	}
}
