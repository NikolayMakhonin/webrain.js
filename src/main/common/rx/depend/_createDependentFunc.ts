import {isThenable, ThenableOrIteratorOrValue} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {isIterator} from '../../helpers/helpers'
import {Func, FuncCallStatus, IFuncCallState} from './contracts'
import {subscribeDependency} from './subscribeDependency'
import {update} from './update'

let currentState: IFuncCallState<any, any, any>

let nextCallId = 1

export function _createDependentFunc<TThis,
	TArgs extends any[],
	TValue>(this: IFuncCallState<TThis, TArgs, TValue>): (this: IFuncCallState<TThis, TArgs, TValue>) => TValue {
	const args = arguments
	return function() {
		const state = this

		if (currentState) {
			subscribeDependency(currentState, state)
		}

		state.callId = nextCallId++

		if (state.status) {
			switch (state.status) {
				case FuncCallStatus.Calculated:
					return state.value

				case FuncCallStatus.Invalidating:
				case FuncCallStatus.Invalidated:
					break
				case FuncCallStatus.CalculatingAsync:
					let parentCallState = state.parentCallState
					while (parentCallState) {
						if (parentCallState === state) {
							throw new Error('Recursive async loop detected')
						}
						parentCallState = parentCallState.parentCallState
					}
					return state.valueAsync

				case FuncCallStatus.Error:
					throw state.error

				case FuncCallStatus.Calculating:
					throw new Error('Recursive sync loop detected')
				default:
					throw new Error('Unknown FuncStatus: ' + state.status)
			}
		}

		state.parentCallState = currentState
		currentState = state

		// return tryInvoke.apply(state, args)

		try {
			update(state, FuncCallStatus.Calculating)

			let value: any = state.func.apply(state._this, args)

			if (isIterator(value)) {
				value = resolveAsync(
					makeDependentIterator(state, value as Iterator<TValue>) as ThenableOrIteratorOrValue<TValue>,
				)

				if (isThenable(value)) {
					update(state, FuncCallStatus.CalculatingAsync, value)
				}

				return value
			} else if (isThenable(value)) {
				throw new Error('You should use iterator instead thenable for async functions')
			}

			update(state, FuncCallStatus.Calculated, value)
			return value
		} catch (error) {
			update(state, FuncCallStatus.Error, error)
			throw error
		} finally {
			currentState = state.parentCallState
			state.parentCallState = null
		}
	}
}

function* makeDependentIterator<TThis,
	TArgs extends any[],
	TValue,
	TFunc extends Func<TThis, TArgs, TValue>>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	iterator: Iterator<TValue>,
	nested?: boolean,
): Iterator<TValue> {
	currentState = state

	try {
		let iteration = iterator.next()
		while (!iteration.done) {
			let value = iteration.value

			if (isIterator(value)) {
				value = makeDependentIterator(state, value as Iterator<TValue>, true)
			}

			value = yield value
			currentState = state
			iteration = iterator.next(value)
		}

		if (!nested) {
			update(state, FuncCallStatus.Calculated, iteration.value)
		}
		return iteration.value
	} catch (error) {
		if (!nested) {
			update(state, FuncCallStatus.Error, error)
		}
		throw error
	} finally {
		currentState = null
		state.parentCallState = null
	}
}
