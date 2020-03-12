import {isThenable, ThenableIterator, ThenableOrIteratorOrValue} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {isIterator} from '../../helpers/helpers'
import {Func, FuncCallStatus, IFuncCallState, TCall} from './contracts'
import {subscribeDependency, unsubscribeDependencies} from './subscribeDependency'
import {getSubscriberLink, releaseSubscriberLink} from './subscriber-link-pool'

// region FuncCallStatus

// region Types

type Flag_None = 0

type Flag_Invalidating = 1
type Flag_Invalidated = 2
type Mask_Invalidate = (0 | Flag_Invalidating | Flag_Invalidated | 3)

type Flag_Invalidate_Self = 4

type Flag_Calculating = 8
type Flag_Calculating_Async = 24
type Flag_Calculated = 32
type Mask_Calculate = (0 | Flag_Calculating | Flag_Calculating_Async | Flag_Calculated | 56)

type Flag_HasError = 64

type Flag_HasValue = 128

// endregion

// region Flags

const Flag_None: Flag_None = 0

const Flag_Invalidating: Flag_Invalidating = 1
const Flag_Invalidated: Flag_Invalidated = 2
const Mask_Invalidate: Mask_Invalidate = 3

const Flag_Invalidate_Self: Flag_Invalidate_Self = 4

const Flag_Calculating: Flag_Calculating = 8
const Flag_Calculating_Async: Flag_Calculating_Async = 24
const Flag_Calculated: Flag_Calculated = 32
const Mask_Calculate: Mask_Calculate = 56

const Flag_HasError: Flag_HasError = 64

const Flag_HasValue: Flag_HasValue = 128

// endregion

// region Properties

// region Invalidate

function getInvalidate(status: FuncCallStatus): Mask_Invalidate {
	return (status & Mask_Invalidate) as any
}

function setInvalidate(status: FuncCallStatus, value: Mask_Invalidate | Flag_None): FuncCallStatus {
	return (status & ~Mask_Invalidate) | value
}

function isInvalidating(status: FuncCallStatus): boolean {
	return (status & Flag_Invalidating) !== 0
}

function isInvalidated(status: FuncCallStatus): boolean {
	return (status & Flag_Invalidated) !== 0
}

// endregion

// region InvalidateSelf

function isInvalidateSelf(status: FuncCallStatus): boolean {
	return (status & Flag_Invalidate_Self) !== 0
}

function setInvalidateSelf(status: FuncCallStatus, value: boolean): FuncCallStatus {
	return value
		? status | Flag_Invalidate_Self
		: status & ~Flag_Invalidate_Self
}

// endregion

// region Calculate

function getCalculate(status: FuncCallStatus): Mask_Calculate {
	return (status & Mask_Calculate) as any
}

function setCalculate(status: FuncCallStatus, value: Mask_Calculate | Flag_None): FuncCallStatus {
	return (status & ~Mask_Calculate) | value
}

function isCalculating(status: FuncCallStatus): boolean {
	return (status & Flag_Calculating) !== 0
}

function isCalculated(status: FuncCallStatus): boolean {
	return (status & Flag_Calculated) !== 0
}

// endregion

// region HasValue

function isHasValue(status: FuncCallStatus): boolean {
	return (status & Flag_HasValue) !== 0
}

function setHasValue(status: FuncCallStatus, value: boolean): FuncCallStatus {
	return value
		? status | Flag_HasValue
		: status & ~Flag_HasValue
}

// endregion

// region HasError

function isHasError(status: FuncCallStatus): boolean {
	return (status & Flag_HasError) !== 0
}

function setHasError(status: FuncCallStatus, value: boolean): FuncCallStatus {
	return value
		? status | Flag_HasError
		: status & ~Flag_HasError
}

// endregion

// endregion

// endregion

export function update<TThis,
	TArgs extends any[],
	TValue,
	>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	status: FuncCallStatus,
	valueAsyncOrValueOrError?,
) {
	const prevStatus = state.status
	if (isInvalidating(status)) {
		if (isInvalidated(prevStatus)) {
			if (!isInvalidateSelf(prevStatus) && isInvalidateSelf(status)) {
				state.status = setInvalidateSelf(prevStatus, true)
			}
			return
		}
		if ((prevStatus & (Flag_Invalidating | Flag_Calculated)) === 0) {
			throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
		}
		if (isInvalidateSelf(prevStatus)) {
			status = setInvalidateSelf(status, true)
		}
	} else if (isInvalidated(status)) {
		if (!isInvalidating(prevStatus)) {
			if (!isInvalidateSelf(prevStatus) && isInvalidateSelf(status)) {
				state.status = setInvalidateSelf(prevStatus, true)
			}
			return
		}
		if (isInvalidateSelf(prevStatus)) {
			status = setInvalidateSelf(status, true)
		}
	} else if (getCalculate(status) === Flag_Calculating) {
		if (getInvalidate(prevStatus) === 0) {
			throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
		}
	} else if (getCalculate(status) === Flag_Calculating_Async) {
		if (getCalculate(prevStatus) !== Flag_Calculating) {
			throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
		}
		state.valueAsync = valueAsyncOrValueOrError
	} else if (isCalculated(status)) {
		if (!isCalculating(prevStatus)) {
			throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
		}
		if (isHasError(status)) {
			if (state.valueAsync != null) {
				state.valueAsync = null
			}
			state.error = valueAsyncOrValueOrError
			if (!state.hasError) {
				state.hasError = true
				state.changeResultId = state.callId
			}
		} else {
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
		}
	} else {
		throw new Error('Unknown FuncCallStatus: ' + status)
	}

	state.status = status

	if (isInvalidating(status)) {
		// emit(state, Flag_Invalidating)
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
				if (getInvalidate(link.value.status) === 0) {
					// invalidate(link.value, Flag_Invalidating)
					// region inline call
					{
						// tslint:disable-next-line:no-shadowed-variable
						const state = link.value
						update(state, Flag_Invalidating)
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
	} else if (isInvalidated(status)) {
		// emit(state, Flag_Invalidated)
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
				// invalidate(link.value, Flag_Invalidated)
				// region inline call
				{
					// tslint:disable-next-line:no-shadowed-variable
					const state = link.value
					update(state, Flag_Invalidated)
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
		update(state, Flag_Invalidating | Flag_Invalidate_Self)
		update(state, Flag_Invalidated | Flag_Invalidate_Self)
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

	public status = Flag_Invalidated | Flag_Invalidate_Self
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
			if (getInvalidate(dependencyState.status) !== 0) {
				_dependentFunc(dependencyState, true)
			}

			if (getCalculate(dependencyState.status) === Flag_Calculating_Async) {
				yield resolveAsync(dependencyState.valueAsync, null, () => { }) as any
			}

			if (isCalculated(dependencyState.status)) {
				if (isHasError(dependencyState.status)) {
					unsubscribeDependencies(callState, i + 1)
					update(callState, Flag_Calculated | Flag_HasError, dependencyState.error)
					return false
				} else if (dependencyState.changeResultId > changeResultId) {
					unsubscribeDependencies(callState)
					return true
				}
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
			if (getInvalidate(dependencyState.status) !== 0) {
				_dependentFunc(dependencyState, true)
			}

			if (isCalculated(dependencyState.status)) {
				if (isHasError(dependencyState.status)) {
					unsubscribeDependencies(callState, i + 1)
					update(callState, Flag_Calculated | Flag_HasError, dependencyState.error)
					return false
				} else if (dependencyState.changeResultId > callId) {
					unsubscribeDependencies(callState)
					return true
				}
			} else if (getCalculate(dependencyState.status) === Flag_Calculating_Async) {
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

	if (isCalculated(state.status)) {
		if (isHasError(state.status)) {
			throw state.error
		}
		state.callId = nextCallId++
		return state.value
	} else if (getInvalidate(state.status) === 0) {
		state.callId = nextCallId++
		if (getCalculate(state.status) === Flag_Calculating_Async) {
			let parentCallState = state.parentCallState
			while (parentCallState) {
				if (parentCallState === state) {
					throw new Error('Recursive async loop detected')
				}
				parentCallState = parentCallState.parentCallState
			}
			return state.valueAsync
		} else if (getCalculate(state.status) === Flag_Calculating) {
			throw new Error('Recursive sync loop detected')
		} else {
			throw new Error('Unknown FuncCallStatus: ' + state.status)
		}
	}

	state.parentCallState = currentState
	currentState = null

	const prevStatus = state.status

	update(state, Flag_Calculating)

	// TODO remove this
	// unsubscribeDependencies(state)
	// return calc(state, dontThrowOnError)

	let shouldRecalc: ThenableIterator<boolean> | boolean
	if (isInvalidateSelf(prevStatus)) {
		shouldRecalc = true
		unsubscribeDependencies(state)
	} else {
		shouldRecalc = checkDependenciesChanged(state)
	}

	if (shouldRecalc === false) {
		state.status = Flag_Calculated // TODO setCalculate(state.status, Flag_Calculated)
		return state.value
	}

	let value
	if (shouldRecalc === true) {
		value = calc(state, dontThrowOnError)
	} else if (isIterator(shouldRecalc)) {
		value = resolveAsync(shouldRecalc, o => {
			if (o === false) {
				state.status = Flag_Calculated // TODO setCalculate(state.status, Flag_Calculated)
				return state.value
			}
			return calc(state, dontThrowOnError)
		})

		if (isThenable(value)) {
			update(state, Flag_Calculating_Async, value)
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
				update(state, Flag_Calculating_Async, value)
			}

			return value
		} else if (isThenable(value)) {
			throw new Error('You should use iterator instead thenable for async functions')
		}

		update(state, Flag_Calculated, value)
		return value
	} catch (error) {
		update(state, Flag_Calculated | Flag_HasError, error)
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
			update(state, Flag_Calculated, iteration.value)
		}
		return iteration.value
	} catch (error) {
		if (nested == null) {
			update(state, Flag_Calculated | Flag_HasError, error)
		}
		throw error
	} finally {
		currentState = null
		state.parentCallState = null
	}
}
