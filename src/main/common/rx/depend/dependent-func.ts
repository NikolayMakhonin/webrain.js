import {isThenable, ThenableOrIteratorOrValue, ThenableOrValue} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {isIterator} from '../../helpers/helpers'
import {Func, FuncCallStatus, IFuncCallState} from './contracts'
import {createCallWithArgs, FuncCallState} from './FuncCallState'
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
			state.update(FuncCallStatus.Calculated, iteration.value)
		}
		return iteration.value
	} catch (error) {
		if (!nested) {
			state.update(FuncCallStatus.Error, error)
		}
		throw error
	} finally {
		currentState = null
		state.parentCallState = null
	}
}

const rootStateMap = new WeakMap<Func<any, any, any>, Func<any, any, IFuncCallState<any, any, any>>>()
// tslint:disable-next-line:no-empty
const emptyFunc: Func<any, any, any> = () => {}
export function getFuncCallState<
	TThis,
	TArgs extends any[],
	TValue
>(func: Func<TThis, TArgs, TValue>): Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>> {
	return rootStateMap.get(func) || emptyFunc
}

function _getFuncCallState<
	TThis,
	TArgs extends any[],
	TValue
>(
	func: Func<TThis, TArgs, TValue>,
	funcStateMap: Map<number, any>,
): Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>> {
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
				state = new FuncCallState<TThis, TArgs, TValue>(func, this, createCallWithArgs.apply(void 0, arguments))
				argsStateMap.set(lastArg, state)
			}
		} else {
			state = argsLengthStateMap.get(this)
			if (!state) {
				state = new FuncCallState<TThis, TArgs, TValue>(func, this, createCallWithArgs.apply(void 0, arguments))
				argsLengthStateMap.set(this, state)
			}
		}

		return state
	}
}

function invoke<TValue>() {
	this.update(FuncCallStatus.Calculating)

	let value: any = this.func.apply(this._this, arguments)

	if (isIterator(value)) {
		value = resolveAsync(
			makeDependentIterator(this, value as Iterator<TValue>)	as ThenableOrIteratorOrValue<TValue>,
		)

		if (isThenable(value)) {
			this.update(FuncCallStatus.CalculatingAsync, value)
		}

		return value
	} else if (isThenable(value)) {
		throw new Error('You should use iterator instead thenable for async functions')
	}

	this.update(FuncCallStatus.Calculated, value)

	return value
}

function tryInvoke() {
	try {
		return invoke.apply(this, arguments)
	} catch (error) {
		this.update(FuncCallStatus.Error, error)
		throw error
	} finally {
		currentState = this.parentCallState
		this.parentCallState = null
	}
}

let nextCallId = 1

function _dependentFunc() {
	if (currentState) {
		currentState.subscribeDependency(this)
	}

	this.callId = nextCallId++

	if (this.status) {
		switch (this.status) {
			case FuncCallStatus.Calculated:
				return this.value

			case FuncCallStatus.Invalidating:
			case FuncCallStatus.Invalidated:
				break
			case FuncCallStatus.CalculatingAsync:
				let parentCallState = this.parentCallState
				while (parentCallState) {
					if (parentCallState === this) {
						throw new Error('Recursive async loop detected')
					}
					parentCallState = parentCallState.parentCallState
				}
				return this.valueAsync

			case FuncCallStatus.Error:
				throw this.error

			case FuncCallStatus.Calculating:
				throw new Error('Recursive sync loop detected')
			default:
				throw new Error('Unknown FuncStatus: ' + this.status)
		}
	}

	this.parentCallState = currentState
	currentState = this

	return tryInvoke.apply(this, arguments)
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
	const getState = _getFuncCallState(func, new Map<number, any>())
	rootStateMap.set(func, getState)

	const dependentFunc = function() {
		const state = getState.apply(this, arguments)
		// return _dependentFunc.apply(state, arguments)

		if (currentState) {
			currentState.subscribeDependency(state)
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

		// return tryInvoke.apply(state, arguments)

		try {
			state.update(FuncCallStatus.Calculating)

			let value: any = func.apply(this, arguments)

			if (isIterator(value)) {
				value = resolveAsync(
					makeDependentIterator(state, value as Iterator<TValue>)	as ThenableOrIteratorOrValue<TValue>,
				)

				if (isThenable(value)) {
					state.update(FuncCallStatus.CalculatingAsync, value)
				}

				return value
			} else if (isThenable(value)) {
				throw new Error('You should use iterator instead thenable for async functions')
			}

			state.update(FuncCallStatus.Calculated, value)
			return value
		} catch (error) {
			state.update(FuncCallStatus.Error, error)
			throw error
		} finally {
			currentState = state.parentCallState
			state.parentCallState = null
		}
	}

	rootStateMap.set(dependentFunc, getState)

	return dependentFunc
}
