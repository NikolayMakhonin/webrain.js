import {resolveAsync} from '../../index'
import {isThenable, ThenableOrIteratorOrValue} from '../../async/async'
import {isIterator} from '../../helpers/helpers'
import {Func, IFuncCallState} from './contracts'
import {subscribeDependency, unsubscribeDependencies} from './subscribeDependency'
import {getSubscriberLink, releaseSubscriberLink} from './subscriberLinkPool'

export enum FuncCallStatus {
	Invalidating = 1,
	Invalidated = 2,
	Calculating = 3,
	CalculatingAsync = 4,
	Calculated = 5,
	Error = 6,
}

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

export function emit<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>, status) {
	if (state._subscribersFirst == null) {
		return
	}

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

let currentState: IFuncCallState<any, any, any>
let nextCallId = 1

export function _createDependentFunc<TThis,
	TArgs extends any[],
	TValue>(this: IFuncCallState<TThis, TArgs, TValue>): (this: IFuncCallState<TThis, TArgs, TValue>) => TValue {
	const args = arguments
	return function () {
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