import {isThenable, Thenable, ThenableIterator, ThenableOrIteratorOrValue} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {isIterator} from '../../helpers/helpers'
import {Func, FuncCallStatus, IFuncCallState, ISubscriberLink, TCall} from './contracts'
import {InternalError} from './helpers'
import {_subscribe, unsubscribeDependencies} from './subscribeDependency'
import {getSubscriberLink, releaseSubscriberLink} from './subscriber-link-pool'

// region FuncCallStatus

// region Types

type Flag_None = 0

type Flag_Invalidating = 1
type Flag_Invalidated = 2
type Mask_Invalidate = (0 | Flag_Invalidating | Flag_Invalidated)
type Flag_Recalc = 4

type Flag_Parent_Invalidating = 8
type Flag_Parent_Invalidated = 16
type Mask_Parent_Invalidate = (0 | Flag_Parent_Invalidating | Flag_Parent_Invalidated)
type Flag_Parent_Recalc = 32

type Flag_Check = 128
type Flag_Calculating = 256
type Flag_Async = 512
type Flag_Calculated = 1024
type Mask_Calculate = (0 | Flag_Check | Flag_Calculating | Flag_Async | Flag_Calculated)

type Flag_HasValue = 2048

type Flag_HasError = 4096

type Update_Invalidating = Flag_Invalidating
type Update_Invalidated = Flag_Invalidated
type Update_Recalc = 4
type Update_Invalidating_Recalc = 5
type Update_Invalidated_Recalc = 6
type Update_Check = Flag_Check
type Update_Check_Async = 640
type Update_Calculating = Flag_Calculating
type Update_Calculating_Async = 768
type Update_Calculated_Value = 3072
type Update_Calculated_Error = 5120

type Mask_Update_Invalidate =
	Update_Invalidating
	| Update_Invalidated
	| Update_Recalc
	| Update_Invalidating_Recalc
	| Update_Invalidated_Recalc

type Mask_Update =
	Mask_Update_Invalidate
	| Update_Check
	| Update_Check_Async
	| Update_Calculating
	| Update_Calculating_Async
	| Update_Calculated_Value
	| Update_Calculated_Error

// endregion

// region Flags

const Flag_None: Flag_None = 0

const Flag_Invalidating: Flag_Invalidating = 1
const Flag_Invalidated: Flag_Invalidated = 2
const Mask_Invalidate = 3
const Flag_Recalc: Flag_Recalc = 4

const Flag_Parent_Invalidating: Flag_Parent_Invalidating = 8
const Flag_Parent_Invalidated: Flag_Parent_Invalidated = 16
const Mask_Parent_Invalidate = 24
const Flag_Parent_Recalc: Flag_Parent_Recalc = 32

const Flag_Check: Flag_Check = 128
const Flag_Calculating: Flag_Calculating = 256
const Flag_Async: Flag_Async = 512
const Flag_Calculated: Flag_Calculated = 1024
const Mask_Calculate = 1920

const Flag_HasValue: Flag_HasValue = 2048

const Flag_HasError: Flag_HasError = 4096

const Update_Invalidating: Update_Invalidating = Flag_Invalidating
const Update_Invalidated: Update_Invalidated = Flag_Invalidated
const Update_Recalc: Update_Recalc = 4
const Update_Invalidating_Recalc: Update_Invalidating_Recalc = 5
const Update_Invalidated_Recalc: Update_Invalidated_Recalc = 6
const Update_Check: Update_Check = Flag_Check
const Update_Check_Async: Update_Check_Async = 640
const Update_Calculating: Update_Calculating = Flag_Calculating
const Update_Calculating_Async: Update_Calculating_Async = 768
const Update_Calculated_Value: Update_Calculated_Value = 3072
const Update_Calculated_Error: Update_Calculated_Error = 5120

const Mask_Update_Invalidate =
	Update_Invalidating
	| Update_Invalidated
	| Update_Invalidating_Recalc
	| Update_Invalidated_Recalc

const Mask_Update =
	Mask_Update_Invalidate
	| Update_Check
	| Update_Check_Async
	| Update_Calculating
	| Update_Calculating_Async
	| Update_Calculated_Value
	| Update_Calculated_Error

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

// region Recalc

function isRecalc(status: FuncCallStatus): boolean {
	return (status & Flag_Recalc) !== 0
}

function setRecalc(status: FuncCallStatus, value: boolean): FuncCallStatus {
	return value
		? status | Flag_Recalc
		: status & ~Flag_Recalc
}

// endregion

// region Calculate

function getCalculate(status: FuncCallStatus): Mask_Calculate {
	return (status & Mask_Calculate) as any
}

function setCalculate(status: FuncCallStatus, value: Mask_Calculate | Flag_None): FuncCallStatus {
	return (status & ~Mask_Calculate) | value
}

function isCheck(status: FuncCallStatus): boolean {
	return (status & Flag_Check) !== 0
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

// export function checkStatus(status: FuncCallStatus): boolean {
// 	if ((status & Mask_Invalidate) === Mask_Invalidate) {
// 		return false
// 	}
//
// 	if ((status & Flag_Recalc) !== 0 && (status & Mask_Invalidate) === 0) {
// 		return false
// 	}
//
// 	if ((status & Flag_Calculated) !== 0) {
// 		if ((status & Mask_Invalidate) !== 0) {
// 			return false
// 		}
// 		if ((status & Flag_Calculating) !== 0) {
// 			return false
// 		}
// 	}
//
// 	if ((status & Flag_Calculating) === 0 && (status & Flag_Async) !== 0) {
// 		return false
// 	}
//
// 	if ((status & (Mask_Invalidate | Mask_Calculate)) === 0) {
// 		return false
// 	}
//
// 	return true
// }

export function statusToString(status: FuncCallStatus): string {
	const buffer = []

	if ((status & Flag_Invalidating) !== 0) {
		buffer.push('Invalidating')
	}
	if ((status & Flag_Invalidated) !== 0) {
		buffer.push('Invalidated')
	}
	if ((status & Flag_Recalc) !== 0) {
		buffer.push('Recalc')
	}
	if ((status & Flag_Check) !== 0) {
		buffer.push('Check')
	}
	if ((status & Flag_Calculating) !== 0) {
		buffer.push('Calculating')
	}
	if ((status & Flag_Async) !== 0) {
		buffer.push('Async')
	}
	if ((status & Flag_Calculated) !== 0) {
		buffer.push('Calculated')
	}
	if ((status & Flag_HasError) !== 0) {
		buffer.push('HasError')
	}
	if ((status & Flag_HasValue) !== 0) {
		buffer.push('HasValue')
	}

	const remain = status & ~(
		Flag_Invalidating | Flag_Invalidated | Flag_Recalc
		| Flag_Check | Flag_Calculating | Flag_Async | Flag_Calculated
		| Flag_HasError | Flag_HasValue
	)

	if (remain !== 0) {
		buffer.push(remain)
	}

	return buffer.join(' | ')
}

type Flag_Before_Calc = 1
type Flag_After_Calc = 2
type Mask_Invalidate_Parent = 3
const Flag_Before_Calc: Flag_Before_Calc = 1
const Flag_After_Calc: Flag_After_Calc = 2
const Mask_Invalidate_Parent = 3

// tslint:disable-next-line:no-empty
function emptyFunc() { }

export function invalidateParent<
	TThis,
	TArgs extends any[],
	TValue,
>(
	link: ISubscriberLink<TThis, TArgs, TValue>,
	status: Mask_Update_Invalidate,
): ISubscriberLink<TThis, TArgs, TValue> {
	const next = link.next
	const childState = link.value
	const childStatus = childState.status & Mask_Update_Invalidate

	// this condition needed only for optimization
	if (childStatus === 0
		|| status !== childStatus
		&& childStatus !== Update_Invalidated_Recalc
		&& (
			childStatus === Update_Recalc
			|| childStatus === Update_Invalidating
			|| status !== Update_Invalidating
			&& (childStatus === Update_Invalidated
				|| status !== Update_Recalc)
		)
	) {
		updateInvalidate(childState, status, false)
	}

	return next
}

export function invalidateParents<
	TThis,
	TArgs extends any[],
	TValue,
>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	statusBefore: Mask_Update_Invalidate | Flag_None,
	statusAfter: Mask_Update_Invalidate | Flag_None,
) {
	const lastLink = state._subscribersCalculating

	let status: Mask_Update_Invalidate
	let link: ISubscriberLink<TThis, TArgs, TValue>
	if (statusBefore !== 0) {
		status = statusBefore
		link = state._subscribersFirst
	} else if (statusAfter !== 0) {
		status = statusAfter
		if (lastLink !== null) {
			link = lastLink.next
		} else {
			link = state._subscribersFirst
		}
	} else {
		throw new InternalError('statusBefore === 0 && statusAfter === 0')
	}

	for (; link !== null;) {
		const next = invalidateParent(link, status)

		if (statusAfter === 0) {
			if (link === lastLink) {
				break
			}
		} else {
			if (link === lastLink) {
				status = statusAfter
			}
		}

		link = next
	}
}

export function updateInvalidate<
	TThis,
	TArgs extends any[],
	TValue,
>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	status: Mask_Update_Invalidate,
	parentRecalc: boolean,
) {
	const prevStatus = state.status

	let statusBefore: Mask_Update_Invalidate | Flag_None = 0
	let statusAfter: Mask_Update_Invalidate | Flag_None = 0

	if (isRecalc(status) && (prevStatus & Flag_Calculating) === 0 && state._unsubscribersLength !== 0) {
		unsubscribeDependencies(state)
	}

	if (status === Update_Recalc) {
		if (isCalculated(prevStatus)) {
			throw new InternalError(`Set status ${statusToString(Update_Recalc)} called when current status is ${statusToString(prevStatus)}`)
		}
		state.status = prevStatus | status
	} else {
		if (isInvalidated(prevStatus)) {
			if (!isRecalc(prevStatus) && isRecalc(status)) {
				state.status = prevStatus | Flag_Recalc
			}
			if (parentRecalc) {
				statusBefore = Update_Invalidated_Recalc
			}
		} else if (status === Update_Invalidating || status === Update_Invalidating_Recalc) {
			state.status = (prevStatus & ~(Mask_Invalidate | Flag_Calculated)) | status

			statusBefore = parentRecalc ? Update_Invalidating_Recalc : Update_Invalidating
			statusAfter = Update_Invalidating
		} else if (status === Update_Invalidated || status === Update_Invalidated_Recalc) {
			state.status = (prevStatus & ~(Mask_Invalidate | Flag_Calculated)) | status

			statusBefore = parentRecalc ? Update_Invalidated_Recalc : Update_Invalidated
			statusAfter = Update_Invalidated
		} else {
			throw new InternalError(`Unknown status: ${statusToString(status)}`)
		}
	}

	if (statusBefore !== 0 || statusAfter !== 0) {
		invalidateParents(state, statusBefore, statusAfter)
	}
}

export function updateCheck<
	TThis,
	TArgs extends any[],
	TValue,
>(
	state: IFuncCallState<TThis, TArgs, TValue>,
) {
	const prevStatus = state.status

	if ((prevStatus & Mask_Invalidate) === 0) {
		throw new InternalError(`Set status ${statusToString(Update_Check)} called when current status is ${statusToString(prevStatus)}`)
	}

	state.status = (prevStatus & ~(Mask_Invalidate | Flag_Recalc | Mask_Calculate)) | Flag_Check
}

export function updateCheckAsync<
	TThis,
	TArgs extends any[],
	TValue,
>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	valueAsync: Thenable<TValue>,
) {
	const prevStatus = state.status

	if (!isCheck(prevStatus)) {
		throw new InternalError(`Set status ${statusToString(Update_Check_Async)} called when current status is ${statusToString(prevStatus)}`)
	}
	state.valueAsync = valueAsync

	state.status = setCalculate(prevStatus, Update_Check_Async)
}

export function updateCalculating<
	TThis,
	TArgs extends any[],
	TValue,
>(
	state: IFuncCallState<TThis, TArgs, TValue>,
) {
	const prevStatus = state.status

	if ((prevStatus & (Mask_Invalidate | Flag_Check)) === 0) {
		throw new InternalError(`Set status ${statusToString(Update_Calculating)} called when current status is ${statusToString(prevStatus)}`)
	}

	state.status = (prevStatus & ~(Mask_Invalidate | Flag_Recalc | Mask_Calculate)) | Flag_Calculating

	state._subscribersCalculating = state._subscribersLast
}

export function updateCalculatingAsync<
	TThis,
	TArgs extends any[],
	TValue,
>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	valueAsync: Thenable<TValue>,
) {
	const prevStatus = state.status

	if (!isCalculating(prevStatus)) {
		throw new InternalError(`Set status ${statusToString(Update_Calculating_Async)} called when current status is ${statusToString(prevStatus)}`)
	}
	state.valueAsync = valueAsync

	state.status = setCalculate(prevStatus, Update_Calculating_Async)
}

export function updateCalculated<
	TThis,
	TArgs extends any[],
	TValue,
>(
	state: IFuncCallState<TThis, TArgs, TValue>,
) {
	const prevStatus = state.status

	if ((prevStatus & (Flag_Check | Flag_Calculating)) === 0) {
		throw new InternalError(`Set status ${statusToString(Update_Calculated_Value)} called when current status is ${statusToString(prevStatus)}`)
	}

	state.status = (prevStatus & (Flag_HasValue | Flag_HasError)) | Flag_Calculated

	state._subscribersCalculating = null

	const invalidateStatus = getInvalidate(prevStatus)
	if (invalidateStatus !== 0) {
		updateInvalidate(state, invalidateStatus, false)
	}
}

export function updateCalculatedValue<
	TThis,
	TArgs extends any[],
	TValue,
>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	value: TValue,
) {
	const prevStatus = state.status

	if ((prevStatus & (Flag_Check | Flag_Calculating)) === 0) {
		throw new InternalError(`Set status ${statusToString(Update_Calculated_Value)} called when current status is ${statusToString(prevStatus)}`)
	}
	if (state.valueAsync != null) {
		state.valueAsync = null
	}

	state.status = Update_Calculated_Value

	if ((prevStatus & (Flag_HasError | Flag_HasValue)) !== Flag_HasValue
		|| state.value !== value
	) {
		state.error = void 0
		state.value = value
		afterCalc(state, prevStatus, true)
	} else {
		afterCalc(state, prevStatus, false)
	}
}

export function updateCalculatedError<
	TThis,
	TArgs extends any[],
	TValue,
>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	error: any,
) {
	const prevStatus = state.status

	if ((prevStatus & (Flag_Check | Flag_Calculating)) === 0) {
		throw new InternalError(`Set status ${statusToString(Update_Calculated_Error)} called when current status is ${statusToString(prevStatus)}`)
	}
	if (state.valueAsync != null) {
		state.valueAsync = null
	}

	state.status = Update_Calculated_Error | (prevStatus & Flag_HasValue)

	if ((prevStatus & Flag_HasError) === 0
		|| state.error !== error
	) {
		state.error = error
		afterCalc(state, prevStatus, true)
	} else {
		afterCalc(state, prevStatus, false)
	}
}

export function afterCalc<
	TThis,
	TArgs extends any[],
	TValue,
>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	prevStatus: FuncCallStatus,
	valueChanged: boolean,
) {
	if ((prevStatus & Mask_Invalidate) !== 0) {
		updateInvalidate(state, Update_Invalidating, valueChanged)
		updateInvalidate(state, Update_Invalidated, valueChanged)
	} else if (valueChanged) {
		invalidateParents(state, Update_Recalc, Flag_None)
	}

	state._subscribersCalculating = null
}

// tslint:disable-next-line:no-shadowed-variable
export function invalidate<
	TThis,
	TArgs extends any[],
	TValue,
>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	status?: Mask_Update_Invalidate,
) {
	if (status == null) {
		updateInvalidate(state, Update_Invalidating_Recalc, false)
		updateInvalidate(state, Update_Invalidated_Recalc, false)
	} else {
		updateInvalidate(state, status, false)
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
		for (let link = state._subscribersFirst; link != null; link = link.next) {
			const cloneLink = getSubscriberLink(state, link.value, null, link.next)
			if (clonesLast == null) {
				clonesFirst = cloneLink
			} else {
				clonesLast.next = cloneLink
			}
			clonesLast = cloneLink
		}
		for (let link = clonesFirst; link != null;) {
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

	public status = Flag_Invalidated | Flag_Recalc
	public valueAsync = null
	public value = void 0
	public error = void 0
	// for detect recursive async loop
	public parentCallState = null
	public _subscribersFirst = null
	public _subscribersLast = null
	public _subscribersCalculating = null
	// for prevent multiple subscribe equal dependencies
	public callId = 0
	public _unsubscribers = null
	public _unsubscribersLength = 0

	// calculable
	public get hasSubscribers(): boolean {
		return this._subscribersFirst != null
	}

	public get isHandling(): boolean {
		return (this.status & (Flag_Check | Flag_Calculating | Flag_Invalidating)) !== 0
	}

	public get statusString(): string {
		return statusToString(this.status)
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
	state: IFuncCallState<any, any, any>,
	fromIndex?: number,
): ThenableIterator<boolean> {
	const {_unsubscribers, _unsubscribersLength} = state
	if (_unsubscribers != null) {
		for (let i = fromIndex || 0, len = _unsubscribersLength; i < len; i++) {
			const dependencyState = _unsubscribers[i].state
			if (getInvalidate(dependencyState.status) !== 0) {
				_dependentFunc(dependencyState, true)
			}

			if ((dependencyState.status & Flag_Async) !== 0) {
				yield resolveAsync(dependencyState.valueAsync, null, emptyFunc) as any
			}

			if ((state.status & FuncCallStatus.Flag_Recalc) !== 0) {
				return true
			}

			if ((dependencyState.status & (Flag_Check | Flag_Calculating)) !== 0
				|| (dependencyState.status & (Flag_HasError | Flag_HasValue)) === 0
			) {
				throw new InternalError(`Unexpected dependency status: ${statusToString(dependencyState.status)}`)
			}
		}
	}

	updateCalculated(state)
	return false
}

function checkDependenciesChanged(state: IFuncCallState<any, any, any>): ThenableIterator<boolean>|boolean {
	const {_unsubscribers, _unsubscribersLength} = state
	if (_unsubscribers != null) {
		for (let i = 0, len = _unsubscribersLength; i < len; i++) {
			const dependencyState = _unsubscribers[i].state
			if (getInvalidate(dependencyState.status) !== 0) {
				_dependentFunc(dependencyState, true)
			}

			if ((dependencyState.status & Flag_Async) !== 0) {
				return checkDependenciesChangedAsync(state, i)
			}

			if ((state.status & FuncCallStatus.Flag_Recalc) !== 0) {
				return true
			}

			if ((dependencyState.status & (Flag_Check | Flag_Calculating)) !== 0
				|| (dependencyState.status & (Flag_HasError | Flag_HasValue)) === 0
			) {
				throw new InternalError(`Unexpected dependency status: ${statusToString(dependencyState.status)}`)
			}
		}
	}

	updateCalculated(state)
	return false
}

let currentState: IFuncCallState<any, any, any> = null
let nextCallId = 1

export function getCurrentState() {
	return currentState
}

// tslint:disable-next-line:no-shadowed-variable
export function subscribeDependency<
	TThis,
	TArgs extends any[],
	TValue,
>(state: IFuncCallState<TThis, TArgs, TValue>, dependency) {
	if (state.callId < dependency.callId) {
		if ((state.status & Flag_Async) === 0) {
			return
		}
		const _unsubscribers = state._unsubscribers
		for (let i = 0, len = state._unsubscribersLength; i < len; i++) {
			if (_unsubscribers[i].state === dependency) {
				return
			}
		}
	}
	{
		const subscriberLink = _subscribe(dependency, state)
		const _unsubscribers = state._unsubscribers
		if (_unsubscribers == null) {
			state._unsubscribers = [subscriberLink]
			state._unsubscribersLength = 1
		} else {
			_unsubscribers[state._unsubscribersLength++] = subscriberLink
		}
	}
}

export function _dependentFunc<
	TThis,
	TArgs extends any[],
	TValue,
>(state: IFuncCallState<TThis, TArgs, TValue>, dontThrowOnError?: boolean) {
	if (currentState != null && (currentState.status & Flag_Check) === 0) {
		subscribeDependency(currentState, state)
	}
	state.callId = nextCallId++

	const prevStatus = state.status

	if (isCalculated(state.status)) {
		if (isHasError(state.status)) {
			throw state.error
		}
		return state.value
	} else if (getCalculate(state.status) !== 0) {
		if ((state.status & Flag_Async) !== 0) {
			let parentCallState = state.parentCallState
			while (parentCallState) {
				if (parentCallState === state) {
					throw new InternalError('Recursive async loop detected')
				}
				parentCallState = parentCallState.parentCallState
			}
			return state.valueAsync
		} else if ((state.status & (Flag_Check | Flag_Calculating)) !== 0) {
			throw new InternalError('Recursive sync loop detected')
		} else {
			throw new InternalError(`Unknown FuncCallStatus: ${statusToString(state.status)}`)
		}
	} else if (getInvalidate(state.status) !== 0) {
		// nothing
	} else {
		throw new InternalError(`Unknown FuncCallStatus: ${statusToString(state.status)}`)
	}

	state.parentCallState = currentState
	currentState = null

	updateCheck(state)

	let shouldRecalc: ThenableIterator<boolean> | boolean
	if (isRecalc(prevStatus)) {
		shouldRecalc = true
	} else {
		shouldRecalc = checkDependenciesChanged(state)
	}

	if (shouldRecalc === false) {
		currentState = state.parentCallState
		state.parentCallState = null
		if (isHasError(state.status)) {
			if (dontThrowOnError !== true) {
				throw state.error
			}
			return
		}
		return state.value
	}

	let value
	if (shouldRecalc === true) {
		value = calc(state, dontThrowOnError)
	} else if (isIterator(shouldRecalc)) {
		value = resolveAsync(shouldRecalc, o => {
			if (o === false) {
				currentState = null
				state.parentCallState = null
				if (isHasError(state.status)) {
					if (dontThrowOnError !== true) {
						throw state.error
					}
					return
				}
				return state.value
			}
			return calc(state, dontThrowOnError)
		})

		if (isThenable(value)) {
			updateCheckAsync(state, value)
		}
	} else {
		throw new InternalError(`shouldRecalc == ${shouldRecalc}`)
	}

	return value
}

export function calc<
	TThis,
	TArgs extends any[],
	TValue,
>(state: IFuncCallState<TThis, TArgs, TValue>, dontThrowOnError?: boolean) {
	updateCalculating(state)
	state.callId = nextCallId++

	let _isIterator = false
	try {
		currentState = state

		// let value: any = state.func.apply(state._this, arguments)
		let value: any = state.callWithArgs(state._this, state.func)

		if (!isIterator(value)) {
			if (isThenable(value)) {
				throw new InternalError('You should use iterator instead thenable for async functions')
			}
			updateCalculatedValue(state, value)
			return value
		}

		_isIterator = true

		value = resolveAsync(
			makeDependentIterator(state, value as Iterator<TValue>) as ThenableOrIteratorOrValue<TValue>,
		)

		if (isThenable(value)) {
			updateCalculatingAsync(state, value)
		}

		return value
	} catch (error) {
		if (error instanceof InternalError) {
			throw error
		}
		if (!_isIterator) {
			updateCalculatedError(state, error)
		}
		if (dontThrowOnError !== true) {
			throw error
		}
	} finally {
		currentState = state.parentCallState
		if (!_isIterator) {
			state.parentCallState = null
		}
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

		if ((state.status & Flag_Async) !== 0) {
			currentState = null
			if (nested == null) {
				state.parentCallState = null
			}
		}
		if (nested == null) {
			updateCalculatedValue(state, iteration.value)
		}
		return iteration.value
	} catch (error) {
		if ((state.status & Flag_Async) !== 0) {
			currentState = null
			if (nested == null) {
				state.parentCallState = null
			}
		}
		if (error instanceof InternalError) {
			throw error
		}
		if (nested == null) {
			updateCalculatedError(state, error)
		}
		throw error
	}
}
