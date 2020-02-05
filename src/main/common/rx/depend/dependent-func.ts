import {isThenable, ThenableOrIteratorOrValue, ThenableOrValue} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {isIterator} from '../../helpers/helpers'
import {Func, FuncCallStatus, IFuncCallState} from './contracts'

function getOrCreateFuncCallState<
	TThis,
	TArgs extends any[],
	TValue,
>(func: Func<TThis, TArgs, TValue>): Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>> {
	return null // TODO
}

let currentState: IFuncCallState<any, any, any>
/**  for detect recursive async loop */
let currentStateAsync: IFuncCallState<any, any, any>

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

export function makeDependentFunc<
	TThis,
	TArgs extends any[],
	TValue
>(func: Func<TThis, TArgs, Iterator<TValue>>): Func<TThis, TArgs, ThenableOrValue<TValue>>
export function makeDependentFunc<
	TThis,
	TArgs extends any[],
	TValue
>(func: Func<TThis, TArgs, TValue>): Func<TThis, TArgs, TValue> {
	const _getOrCreateFuncCallState = getOrCreateFuncCallState(func)

	return function() {
		const state = _getOrCreateFuncCallState.apply(this, arguments) as IFuncCallState<TThis, TArgs, TValue>

		if (state.status) {
			switch (state.status) {
				case FuncCallStatus.Calculating:
					throw new Error('Recursive sync loop detected')
				case FuncCallStatus.CalculatingAsync:
					// TODO: Can be async infinity loop, which is hard to debug
					// this is solved by eliminating cyclic dependencies
					// throw new Error('Recursive async loop detected')
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
			currentState = state

			if (parentState) {
				parentState.subscribeDependency(state)
			}

			state.update(FuncCallStatus.Calculating)

			let value: any = func.apply(this, arguments)

			if (isIterator(value)) {
				// TODO currentStateAsync - for detect recursive async loop
				value = resolveAsync(
					makeDependentIterator(state, value as Iterator<TValue>)	as ThenableOrIteratorOrValue<TValue>,
				)

				if (isThenable(value)) {
					if (currentStateAsync) {
						state.parentStateAsync = currentStateAsync
					}
					// TODO ...

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
	} as any
}
