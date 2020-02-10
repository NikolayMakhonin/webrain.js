import {isThenable, Thenable, ThenableOrIteratorOrValue} from '../../async/async'
import {isIterator} from '../../helpers/helpers'
import {resolveAsync} from '../../index'
import {Func, ISubscriberLink} from './contracts'
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

export interface IFuncCallState<TThis,
	TArgs extends any[],
	TValue,
	> {
	readonly func: Func<TThis, TArgs, TValue>
	readonly _this: TThis
	readonly dependentFunc: Func<TThis, TArgs, TValue>

	status: FuncCallStatus
	hasValue: boolean
	hasError: boolean

	valueAsync: Thenable<TValue>
	value: TValue
	error: any

	/** for detect recursive async loop */
	parentCallState: IFuncCallState<any, any, any>

	// for prevent multiple subscribe equal dependencies
	callId: number

	_subscribersFirst: ISubscriberLink<TThis, TArgs, TValue>
	_subscribersLast: ISubscriberLink<TThis, TArgs, TValue>
	_unsubscribers: Array<ISubscriberLink<TThis, TArgs, TValue>>,
	_unsubscribersLength: number,
}

export const {
	invalidate,
	createFuncCallState,
	_createDependentFunc,
} = (function() {
	const FuncCallStatus_Invalidating: FuncCallStatus = 1
	const FuncCallStatus_Invalidated: FuncCallStatus = 2
	const FuncCallStatus_Calculating: FuncCallStatus = 3
	const FuncCallStatus_CalculatingAsync: FuncCallStatus = 4
	const FuncCallStatus_Calculated: FuncCallStatus = 5
	const FuncCallStatus_Error: FuncCallStatus = 6

	function update<TThis,
		TArgs extends any[],
		TValue,
		>(state: IFuncCallState<TThis, TArgs, TValue>, status, valueAsyncOrValueOrError?) {
		const prevStatus = state.status
		state.status = status
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
				unsubscribeDependencies(state)
				emit(state, status)
				break
			case FuncCallStatus_Invalidated:
				if (prevStatus !== FuncCallStatus_Invalidating) {
					return
				}
				emit(state, status)
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
	}

	// tslint:disable-next-line:no-shadowed-variable
	function invalidate<TThis,
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

	function emit<TThis,
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

	// tslint:disable-next-line:no-shadowed-variable
	function createFuncCallState<TThis,
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
			status: FuncCallStatus_Invalidated,
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

	// tslint:disable-next-line:no-shadowed-variable
	function _createDependentFunc<TThis,
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

			state.parentCallState = currentState
			currentState = state

			// return tryInvoke.apply(state, args)

			try {
				update(state, FuncCallStatus_Calculating)

				let value: any = state.func.apply(state._this, args)

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
				update(state, FuncCallStatus_Calculated, iteration.value)
			}
			return iteration.value
		} catch (error) {
			if (!nested) {
				update(state, FuncCallStatus_Error, error)
			}
			throw error
		} finally {
			currentState = null
			state.parentCallState = null
		}
	}

	return {
		update,
		invalidate,
		emit,
		createFuncCallState,
		_createDependentFunc,
	}
})()
