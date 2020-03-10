import {isThenable, ThenableOrIteratorOrValue} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {isIterator} from '../../helpers/helpers'
import {Func, FuncCallStatus, IFuncCallState, IValueState, TCall} from './contracts'
import {subscribeDependency} from './subscribeDependency'
import {getSubscriberLink, releaseSubscriberLink} from './subscriber-link-pool'

const FuncCallStatus_Invalidating: FuncCallStatus = 1
const FuncCallStatus_Invalidated: FuncCallStatus = 2
const FuncCallStatus_Calculating: FuncCallStatus = 3
const FuncCallStatus_CalculatingAsync: FuncCallStatus = 4
const FuncCallStatus_Calculated: FuncCallStatus = 5
const FuncCallStatus_Error: FuncCallStatus = 6

export function update<TThis,
	TArgs extends any[],
	TValue,
	>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	status: FuncCallStatus,
	valueAsyncOrValueOrError?,
) {
	const prevStatus = state.status
	switch (status) {
		case FuncCallStatus_Invalidating:
			if (prevStatus === FuncCallStatus_Invalidated) {
				return
			}
			if (prevStatus !== FuncCallStatus_Invalidating
				&& prevStatus !== FuncCallStatus_Calculated
				&& prevStatus !== FuncCallStatus_Error
			) {
				throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
			}
			break
		case FuncCallStatus_Invalidated:
			if (prevStatus !== FuncCallStatus_Invalidating) {
				return
			}
			break
		case FuncCallStatus_Calculating:
			if (prevStatus != null
				&& prevStatus !== FuncCallStatus_Invalidating
				&& prevStatus !== FuncCallStatus_Invalidated
			) {
				throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
			}
			break
		case FuncCallStatus_CalculatingAsync:
			if (prevStatus !== FuncCallStatus_Calculating) {
				throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
			}
			state.valueAsync = valueAsyncOrValueOrError
			break
		case FuncCallStatus_Calculated:
			if (prevStatus !== FuncCallStatus_Calculating && prevStatus !== FuncCallStatus_CalculatingAsync) {
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
		case FuncCallStatus_Error:
			if (prevStatus !== FuncCallStatus_Calculating && prevStatus !== FuncCallStatus_CalculatingAsync) {
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

	state.status = status

	switch (status) {
		case FuncCallStatus_Invalidating:
			// emit(state, status)
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
					if (link.value.status !== FuncCallStatus.Invalidating && link.value.status !== FuncCallStatus.Invalidated) {
						// invalidate(link.value, status)
						// region inline call
						{
							// tslint:disable-next-line:no-shadowed-variable
							const state = link.value
							update(state, FuncCallStatus_Invalidating)
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
			break
		case FuncCallStatus_Invalidated:
			// emit(state, status)
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
					// invalidate(link.value, status)
					// region inline call
					{
						// tslint:disable-next-line:no-shadowed-variable
						const state = link.value
						update(state, FuncCallStatus_Invalidated)
					}
					// endregion
					// link.value = null
					// link.next = null
					// releaseSubscriberLink(link)
					link = next
				}
			}
			// endregion
			break
	}
}

// tslint:disable-next-line:no-shadowed-variable
export function invalidate<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>, status?: FuncCallStatus) {
	if (status == null) {
		update(state, FuncCallStatus_Invalidating)
		update(state, FuncCallStatus_Invalidated)
	} else {
		update(state, status)
	}
}

export function emit<TThis,
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
		valueStates: IValueState[],
	) {
		this.func = func
		this._this = _this
		this.callWithArgs = callWithArgs
		this.valueStates = valueStates
	}

	public readonly func: Func<TThis, TArgs, TValue>
	public readonly _this: TThis
	public readonly callWithArgs: TCall<TArgs>
	public readonly valueStates: IValueState[]
	public deletePriority: number = 0

	public status = FuncCallStatus_Invalidated
	public hasValue = false
	public hasError = false
	public valueAsync = null
	public value = void 0
	public error = void 0
	// for detect recursive async loop
	public parentCallState = null
	public _subscribersFirst = null
	public _subscribersLast = null
	// for prevent multiple subscribe equal dependencies
	public callId = 0
	public _unsubscribers = null
	public _unsubscribersLength = 0

	// calculable
	public get hasSubscribers(): boolean {
		return this._subscribersFirst != null
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
	valueStates: IValueState[],
): IFuncCallState<TThis, TArgs, TValue> {
	return new FuncCallState(
		func,
		_this,
		callWithArgs,
		valueStates,
	)
}

let currentState: IFuncCallState<any, any, any>
let nextCallId = 1

export function _dependentFunc<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>) {
	if (currentState != null) {
		subscribeDependency(currentState, state)
	}

	state.callId = nextCallId++

	if (state.status != null) {
		switch (state.status) {
			case FuncCallStatus_Calculated:
				return state.value

			case FuncCallStatus_Invalidating:
			case FuncCallStatus_Invalidated:
				break
			case FuncCallStatus_CalculatingAsync:
				let parentCallState = state.parentCallState
				while (parentCallState) {
					if (parentCallState === state) {
						throw new Error('Recursive async loop detected')
					}
					parentCallState = parentCallState.parentCallState
				}
				return state.valueAsync

			case FuncCallStatus_Error:
				throw state.error

			case FuncCallStatus_Calculating:
				throw new Error('Recursive sync loop detected')
			default:
				throw new Error('Unknown FuncStatus: ' + state.status)
		}
	}

	// unsubscribeDependencies(state)
	// region inline call
	{
		const _unsubscribers = state._unsubscribers
		if (_unsubscribers != null) {
			const len = state._unsubscribersLength
			for (let i = 0; i < len; i++) {
				const item = _unsubscribers[i]
				_unsubscribers[i] = null
				// subscriberLinkDelete(item.state, item)
				// region inline call
				{
					// tslint:disable-next-line:no-shadowed-variable
					const {prev, next, state} = item
					if (state == null) {
						return
					}
					if (prev == null) {
						if (next == null) {
							state._subscribersFirst = null
							state._subscribersLast = null
						} else {
							state._subscribersFirst = next
							next.prev = null
							item.next = null
						}
					} else {
						if (next == null) {
							state._subscribersLast = prev
							prev.next = null
						} else {
							prev.next = next
							next.prev = prev
							item.next = null
						}
						item.prev = null
					}
					item.state = null
					item.value = null
					releaseSubscriberLink(item)
				}
				// endregion
			}
			state._unsubscribersLength = 0
			if (len > 256) {
				_unsubscribers.length = 256
			}
		}
	}
	// endregion

	state.parentCallState = currentState
	currentState = state

	// return tryInvoke.apply(state, arguments)

	try {
		update(state, FuncCallStatus_Calculating)

		// let value: any = state.func.apply(state._this, arguments)
		let value: any = state.callWithArgs(state._this, state.func)

		if (isIterator(value)) {
			value = resolveAsync(
				makeDependentIterator(state, value as Iterator<TValue>) as ThenableOrIteratorOrValue<TValue>,
			)

			if (isThenable(value)) {
				update(state, FuncCallStatus_CalculatingAsync, value)
			}

			return value
		} else if (isThenable(value)) {
			throw new Error('You should use iterator instead thenable for async functions')
		}

		update(state, FuncCallStatus_Calculated, value)
		return value
	} catch (error) {
		update(state, FuncCallStatus_Error, error)
		throw error
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
			update(state, FuncCallStatus_Calculated, iteration.value)
		}
		return iteration.value
	} catch (error) {
		if (nested == null) {
			update(state, FuncCallStatus_Error, error)
		}
		throw error
	} finally {
		currentState = null
		state.parentCallState = null
	}
}
