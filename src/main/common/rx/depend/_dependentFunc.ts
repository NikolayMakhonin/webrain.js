import {isThenable, ThenableIterator, ThenableOrIteratorOrValue} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {isIterator} from '../../helpers/helpers'
import {Func, FuncCallStatus, IFuncCallState, TCall} from './contracts'
import {subscribeDependency, unsubscribeDependencies} from './subscribeDependency'
import {getSubscriberLink, releaseSubscriberLink} from './subscriber-link-pool'

const Flag_Invalidate: FuncCallStatus = 1
const Flag_Invalidating: FuncCallStatus = 2
const Flag_Invalidated: FuncCallStatus = 4
const Flag_Invalidate_Self: FuncCallStatus = 8
const Flag_Calculate: FuncCallStatus = 16
const Flag_Calculating: FuncCallStatus = 32
const Flag_Calculated: FuncCallStatus = 64
const Flag_Calculate_Async: FuncCallStatus = 128
const Flag_Calculate_Error: FuncCallStatus = 256

const Status_Invalidating: FuncCallStatus = Flag_Invalidate | Flag_Invalidating
const Status_Invalidated: FuncCallStatus = Flag_Invalidate | Flag_Invalidated
const Status_Invalidating_Self = Flag_Invalidate | Flag_Invalidating | Flag_Invalidate_Self
const Status_Invalidated_Self = Flag_Invalidate | Flag_Invalidated | Flag_Invalidate_Self

const Status_Calculating: FuncCallStatus = Flag_Calculate | Flag_Calculating
const Status_Calculated: FuncCallStatus = Flag_Calculate | Flag_Calculated
const Status_Calculating_Async = Flag_Calculate | Flag_Calculating | Flag_Calculate_Async
const Status_Calculated_Error = Flag_Calculate | Flag_Calculated | Flag_Calculate_Error

export function update<TThis,
	TArgs extends any[],
	TValue,
	>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	status: FuncCallStatus,
	valueAsyncOrValueOrError?,
) {
	const prevStatus = state.status
	if ((status & Flag_Invalidating) !== 0) {
		if ((prevStatus & Flag_Invalidated) !== 0) {
			if ((prevStatus & Flag_Invalidate_Self) < (status & Flag_Invalidate_Self)) {
				state.status = prevStatus | Flag_Invalidate_Self
			}
			return
		}
		if ((prevStatus & (Flag_Invalidating | Flag_Calculated)) === 0) {
			throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
		}
		if ((prevStatus & Flag_Invalidate_Self) !== 0) {
			status |= Flag_Invalidate_Self
		}
	} else if ((status & Flag_Invalidated) !== 0) {
		if ((prevStatus & Flag_Invalidating) === 0) {
			if ((prevStatus & Flag_Invalidate_Self) < (status & Flag_Invalidate_Self)) {
				state.status = prevStatus | Flag_Invalidate_Self
			}
			return
		}
		if ((prevStatus & Flag_Invalidate_Self) !== 0) {
			status |= Flag_Invalidate_Self
		}
	} else if (status === Status_Calculating) {
		if ((prevStatus & Flag_Invalidate) === 0) {
			throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
		}
	} else if (status === Status_Calculating_Async) {
		if (prevStatus !== Status_Calculating) {
			throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
		}
		state.valueAsync = valueAsyncOrValueOrError
	} else if (status === Status_Calculated) {
		if ((prevStatus & Flag_Calculating) === 0) {
			throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
		}
		if (state.valueAsync != null) {
			state.valueAsync = null
		}
		if (state.hasError || !state.hasValue || state.value !== valueAsyncOrValueOrError) {
			state.error = void 0
			state.value = valueAsyncOrValueOrError
			state.hasError = false
			state.hasValue = true
			state.changeResultId = state.callId
		}
	} else if (status === Status_Calculated_Error) {
		if ((prevStatus & Flag_Calculating) === 0) {
			throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
		}
		if (state.valueAsync != null) {
			state.valueAsync = null
		}
		state.error = valueAsyncOrValueOrError
		if (!state.hasError) {
			state.hasError = true
			state.changeResultId = state.callId
		}
	} else {
		throw new Error('Unknown FuncCallStatus: ' + status)
	}

	state.status = status

	if ((status & Flag_Invalidating) !== 0) {
		// emit(state, Status_Invalidating)
		// region inline call
		if (state._subscribersFirst != null) {
			// let clonesFirst
			// let clonesLast
			// for (let link = state._subscribersFirst; link; link = link.next) {
			// 	const cloneLink = getSubscriberLink(state, link.value, null, link.next)
			// 	if (clonesLast == null) {
			// 		clonesFirst = cloneLink
			// 	} else {
			// 		clonesLast.next = cloneLink
			// 	}
			// 	clonesLast = cloneLink
			// }
			for (let link = state._subscribersFirst; link;) {
				const next = link.next
				if ((link.value.status & Flag_Invalidate) === 0) {
					// invalidate(link.value, Status_Invalidating)
					// region inline call
					{
						// tslint:disable-next-line:no-shadowed-variable
						const state = link.value
						update(state, Status_Invalidating)
					}
					// endregion
					// link.value = null
					// link.next = null
					// releaseSubscriberLink(link)
				}
				link = next
			}
		}
		// endregion
	} else if ((status & Flag_Invalidated) !== 0) {
		// emit(state, Status_Invalidated)
		// region inline call
		if (state._subscribersFirst != null) {
			// let clonesFirst
			// let clonesLast
			// for (let link = state._subscribersFirst; link; link = link.next) {
			// 	const cloneLink = getSubscriberLink(state, link.value, null, link.next)
			// 	if (clonesLast == null) {
			// 		clonesFirst = cloneLink
			// 	} else {
			// 		clonesLast.next = cloneLink
			// 	}
			// 	clonesLast = cloneLink
			// }
			for (let link = state._subscribersFirst; link;) {
				const next = link.next
				// invalidate(link.value, Status_Invalidated)
				// region inline call
				{
					// tslint:disable-next-line:no-shadowed-variable
					const state = link.value
					update(state, Status_Invalidated)
				}
				// endregion
				// link.value = null
				// link.next = null
				// releaseSubscriberLink(link)
				link = next
			}
		}
		// endregion
	}
}

// tslint:disable-next-line:no-shadowed-variable
export function invalidate<
	TThis,
	TArgs extends any[],
	TValue,
>(state: IFuncCallState<TThis, TArgs, TValue>, status?: FuncCallStatus) {
	if (status == null) {
		update(state, Status_Invalidating_Self)
		update(state, Status_Invalidated_Self)
	} else {
		update(state, status)
	}
}

export function emit<
	TThis,
	TArgs extends any[],
	TValue,
>(state: IFuncCallState<TThis, TArgs, TValue>, status) {
	if (state._subscribersFirst != null) {
		let clonesFirst
		let clonesLast
		for (let link = state._subscribersFirst; link; link = link.next) {
			const cloneLink = getSubscriberLink(state, link.value, null, link.next)
			if (clonesLast == null) {
				clonesFirst = cloneLink
			} else {
				clonesLast.next = cloneLink
			}
			clonesLast = cloneLink
		}
		for (let link = clonesFirst; link;) {
			invalidate(link.value, status)
			link.value = null
			const next = link.next
			link.next = null
			releaseSubscriberLink(link)
			link = next
		}
	}
}

export class FuncCallState<TThis,
	TArgs extends any[],
	TValue,
	> {
	constructor(
		func: Func<TThis, TArgs, TValue>,
		_this: TThis,
		callWithArgs: TCall<TArgs>,
		valueIds: number[],
	) {
		this.func = func
		this._this = _this
		this.callWithArgs = callWithArgs
		this.valueIds = valueIds
	}

	public readonly func: Func<TThis, TArgs, TValue>
	public readonly _this: TThis
	public readonly callWithArgs: TCall<TArgs>
	public readonly valueIds: number[]
	public deleteOrder: number = 0

	public status = Status_Invalidated_Self
	public hasValue = false
	public hasError = false
	public valueAsync = null
	public value = void 0
	public error = void 0
	// for detect recursive async loop
	public parentCallState = null
	public _subscribersFirst = null
	public _subscribersLast = null
	/** for prevent recalc dependent funcs if dependencies.changeResultId <= dependent.changeResultId */
	public changeResultId = 0
	// for prevent multiple subscribe equal dependencies
	public callId = 0
	public _unsubscribers = null
	public _unsubscribersLength = 0

	// calculable
	public get hasSubscribers(): boolean {
		return this._subscribersFirst != null
	}

	public get isHandling(): boolean {
		return (this.status & (Flag_Calculating | Flag_Invalidating)) !== 0
	}
}

// tslint:disable-next-line:no-shadowed-variable
export function createFuncCallState<TThis,
	TArgs extends any[],
	TValue,
	>(
	func: Func<TThis, TArgs, TValue>,
	_this: TThis,
	callWithArgs: TCall<TArgs>,
	valueIds: number[],
): IFuncCallState<TThis, TArgs, TValue> {
	return new FuncCallState(
		func,
		_this,
		callWithArgs,
		valueIds,
	)
}

function* checkDependenciesChangedAsync(
	callState: IFuncCallState<any, any, any>,
	fromIndex?: number,
): ThenableIterator<boolean> {
	const {_unsubscribers, _unsubscribersLength} = callState
	if (_unsubscribers != null) {
		const {changeResultId} = callState
		for (let i = fromIndex || 0, len = _unsubscribersLength; i < len; i++) {
			const dependencyState = _unsubscribers[i].state
			if ((dependencyState.status & Flag_Invalidate) !== 0) {
				_dependentFunc(dependencyState, true)
			}

			if (dependencyState.status === Status_Calculating_Async) {
				yield resolveAsync(dependencyState.valueAsync, null, () => { }) as any
			}

			if (dependencyState.status === Status_Calculated) {
				if (dependencyState.changeResultId > changeResultId) {
					unsubscribeDependencies(callState)
					return true
				}
			} else if (dependencyState.status === Status_Calculated_Error) {
				unsubscribeDependencies(callState, i + 1)
				update(callState, Status_Calculated_Error, dependencyState.error)
				return false
			} else {
				throw new Error('Unexpected dependency status: ' + dependencyState.status)
			}
		}
	}

	return false
}

function checkDependenciesChanged(callState: IFuncCallState<any, any, any>): ThenableIterator<boolean>|boolean {
	const {_unsubscribers, _unsubscribersLength} = callState
	if (_unsubscribers != null) {
		const {callId} = callState
		for (let i = 0, len = _unsubscribersLength; i < len; i++) {
			const dependencyState = _unsubscribers[i].state
			if ((dependencyState.status & Flag_Invalidate) !== 0) {
				_dependentFunc(dependencyState, true)
			}

			if (dependencyState.status === Status_Calculated) {
				if (dependencyState.changeResultId > callId) {
					unsubscribeDependencies(callState)
					return true
				}
			} else if (dependencyState.status === Status_Calculated_Error) {
				unsubscribeDependencies(callState, i + 1)
				update(callState, Status_Calculated_Error, dependencyState.error)
				return false
			} else if (dependencyState.status === Status_Calculating_Async) {
				return checkDependenciesChangedAsync(callState, i)
			} else {
				throw new Error('Unexpected dependency status: ' + dependencyState.status)
			}
		}
	}

	return false
}

let currentState: IFuncCallState<any, any, any>
let nextCallId = 1

export function _dependentFunc<
	TThis,
	TArgs extends any[],
	TValue,
>(state: IFuncCallState<TThis, TArgs, TValue>, dontThrowOnError?: boolean) {
	if (currentState != null) {
		subscribeDependency(currentState, state)
	}

	if (state.status === Status_Calculated) {
		state.callId = nextCallId++
		return state.value
	} else if ((state.status & Flag_Invalidate) === 0) {
		state.callId = nextCallId++
		if (state.status === Status_Calculating_Async) {
			let parentCallState = state.parentCallState
			while (parentCallState) {
				if (parentCallState === state) {
					throw new Error('Recursive async loop detected')
				}
				parentCallState = parentCallState.parentCallState
			}
			return state.valueAsync
		} else if (state.status === Status_Calculated_Error) {
			throw state.error
		} else if (state.status === Status_Calculating) {
			throw new Error('Recursive sync loop detected')
		} else {
			throw new Error('Unknown FuncCallStatus: ' + state.status)
		}
	}

	state.parentCallState = currentState
	currentState = null

	const prevStatus = state.status

	update(state, Status_Calculating)

	// TODO remove this
	// unsubscribeDependencies(state)
	// return calc(state, dontThrowOnError)

	let shouldRecalc: ThenableIterator<boolean> | boolean
	if ((prevStatus & Flag_Invalidate_Self) !== 0) {
		shouldRecalc = true
		unsubscribeDependencies(state)
	} else {
		shouldRecalc = checkDependenciesChanged(state)
	}

	if (shouldRecalc === false) {
		state.status = Status_Calculated
		return state.value
	}

	let value
	if (shouldRecalc === true) {
		value = calc(state, dontThrowOnError)
	} else if (isIterator(shouldRecalc)) {
		value = resolveAsync(shouldRecalc, o => {
			if (o === false) {
				state.status = Status_Calculated
				return state.value
			}
			return calc(state, dontThrowOnError)
		})

		if (isThenable(value)) {
			update(state, Status_Calculating_Async, value)
		}
	} else {
		throw new Error(`shouldRecalc == ${shouldRecalc}`)
	}

	return value
}

export function calc<
	TThis,
	TArgs extends any[],
	TValue,
>(state: IFuncCallState<TThis, TArgs, TValue>, dontThrowOnError?: boolean) {
	state.callId = nextCallId++

	try {
		currentState = state

		// let value: any = state.func.apply(state._this, arguments)
		let value: any = state.callWithArgs(state._this, state.func)

		if (isIterator(value)) {
			value = resolveAsync(
				makeDependentIterator(state, value as Iterator<TValue>) as ThenableOrIteratorOrValue<TValue>,
			)

			if (isThenable(value)) {
				update(state, Status_Calculating_Async, value)
			}

			return value
		} else if (isThenable(value)) {
			throw new Error('You should use iterator instead thenable for async functions')
		}

		update(state, Status_Calculated, value)
		return value
	} catch (error) {
		update(state, Status_Calculated_Error, error)
		if (dontThrowOnError !== true) {
			throw error
		}
	} finally {
		currentState = state.parentCallState
		state.parentCallState = null
	}
}

export function* makeDependentIterator<TThis,
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

		if (nested == null) {
			update(state, Status_Calculated, iteration.value)
		}
		return iteration.value
	} catch (error) {
		if (nested == null) {
			update(state, Status_Calculated_Error, error)
		}
		throw error
	} finally {
		currentState = null
		state.parentCallState = null
	}
}
