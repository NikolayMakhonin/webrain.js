import {isThenable, IThenable, ThenableIterator, ThenableOrIteratorOrValue} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {isIterator} from '../../helpers/helpers'
import {ObjectPool} from '../../lists/ObjectPool'
import {
	CallStatus,
	Func,
	ICallState,
	ILinkItem,
	TCall,
	TGetThis,
	TInnerValue,
	TIteratorOrValue,
	TResultOuter,
} from './contracts'
import {InternalError} from './helpers'

// region CallStatus

// region Types

export type Flag_None = 0

export type Flag_Invalidating = 1
export type Flag_Invalidated = 2
export type Mask_Invalidate = (0 | Flag_Invalidating | Flag_Invalidated)
export type Flag_Recalc = 4

export type Flag_Parent_Invalidating = 8
export type Flag_Parent_Invalidated = 16
export type Mask_Parent_Invalidate = (0 | Flag_Parent_Invalidating | Flag_Parent_Invalidated)
export type Flag_Parent_Recalc = 32

export type Flag_Check = 128
export type Flag_Calculating = 256
export type Flag_Async = 512
export type Flag_Calculated = 1024
export type Mask_Calculate = (0 | Flag_Check | Flag_Calculating | Flag_Async | Flag_Calculated)

export type Flag_HasValue = 2048

export type Flag_HasError = 4096

export type Flag_InternalError = 8192

export type Update_Invalidating = Flag_Invalidating
export type Update_Invalidated = Flag_Invalidated
export type Update_Recalc = 4
export type Update_Invalidating_Recalc = 5
export type Update_Invalidated_Recalc = 6
export type Update_Check = Flag_Check
export type Update_Check_Async = 640
export type Update_Calculating = Flag_Calculating
export type Update_Calculating_Async = 768
export type Update_Calculated_Value = 3072
export type Update_Calculated_Error = 5120

export type Mask_Update_Invalidate =
	Update_Invalidating
	| Update_Invalidated
	| Update_Recalc
	| Update_Invalidating_Recalc
	| Update_Invalidated_Recalc

export type Mask_Update =
	Mask_Update_Invalidate
	| Update_Check
	| Update_Check_Async
	| Update_Calculating
	| Update_Calculating_Async
	| Update_Calculated_Value
	| Update_Calculated_Error

// endregion

// region Constants

export const Flag_None: Flag_None = 0

export const Flag_Invalidating: Flag_Invalidating = 1
export const Flag_Invalidated: Flag_Invalidated = 2
export const Mask_Invalidate = 3
export const Flag_Recalc: Flag_Recalc = 4

export const Flag_Parent_Invalidating: Flag_Parent_Invalidating = 8
export const Flag_Parent_Invalidated: Flag_Parent_Invalidated = 16
export const Mask_Parent_Invalidate = 24
export const Flag_Parent_Recalc: Flag_Parent_Recalc = 32

export const Flag_Check: Flag_Check = 128
export const Flag_Calculating: Flag_Calculating = 256
export const Flag_Async: Flag_Async = 512
export const Flag_Calculated: Flag_Calculated = 1024
export const Mask_Calculate = 1920

export const Flag_HasValue: Flag_HasValue = 2048

export const Flag_HasError: Flag_HasError = 4096

export const Flag_InternalError: Flag_InternalError = 8192

export const Update_Invalidating: Update_Invalidating = Flag_Invalidating
export const Update_Invalidated: Update_Invalidated = Flag_Invalidated
export const Update_Recalc: Update_Recalc = 4
export const Update_Invalidating_Recalc: Update_Invalidating_Recalc = 5
export const Update_Invalidated_Recalc: Update_Invalidated_Recalc = 6
export const Update_Check: Update_Check = Flag_Check
export const Update_Check_Async: Update_Check_Async = 640
export const Update_Calculating: Update_Calculating = Flag_Calculating
export const Update_Calculating_Async: Update_Calculating_Async = 768
export const Update_Calculated_Value: Update_Calculated_Value = 3072
export const Update_Calculated_Error: Update_Calculated_Error = 5120

export const Mask_Update_Invalidate =
	Update_Invalidating
	| Update_Invalidated
	| Update_Invalidating_Recalc
	| Update_Invalidated_Recalc

export const Mask_Update =
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

export function getInvalidate(status: CallStatus): Mask_Invalidate {
	return (status & Mask_Invalidate) as any
}

export function setInvalidate(status: CallStatus, value: Mask_Invalidate | Flag_None): CallStatus {
	return (status & ~Mask_Invalidate) | value
}

export function isInvalidating(status: CallStatus): boolean {
	return (status & Flag_Invalidating) !== 0
}

export function isInvalidated(status: CallStatus): boolean {
	return (status & Flag_Invalidated) !== 0
}

// endregion

// region Recalc

export function isRecalc(status: CallStatus): boolean {
	return (status & Flag_Recalc) !== 0
}

export function setRecalc(status: CallStatus, value: boolean): CallStatus {
	return value
		? status | Flag_Recalc
		: status & ~Flag_Recalc
}

// endregion

// region Calculate

export function getCalculate(status: CallStatus): Mask_Calculate {
	return (status & Mask_Calculate) as any
}

export function setCalculate(status: CallStatus, value: Mask_Calculate | Flag_None): CallStatus {
	return (status & ~Mask_Calculate) | value
}

export function isCheck(status: CallStatus): boolean {
	return (status & Flag_Check) !== 0
}

export function isCalculating(status: CallStatus): boolean {
	return (status & Flag_Calculating) !== 0
}

export function isCalculated(status: CallStatus): boolean {
	return (status & Flag_Calculated) !== 0
}

// endregion

// region HasValue

export function isHasValue(status: CallStatus): boolean {
	return (status & Flag_HasValue) !== 0
}

export function setHasValue(status: CallStatus, value: boolean): CallStatus {
	return value
		? status | Flag_HasValue
		: status & ~Flag_HasValue
}

// endregion

// region HasError

export function isHasError(status: CallStatus): boolean {
	return (status & Flag_HasError) !== 0
}

export function setHasError(status: CallStatus, value: boolean): CallStatus {
	return value
		? status | Flag_HasError
		: status & ~Flag_HasError
}

// endregion

// endregion

// region Methods

// export function checkStatus(status: CallStatus): boolean {
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

export function statusToString(status: CallStatus): string {
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

// endregion

// endregion

// region constants

type Flag_Before_Calc = 1
type Flag_After_Calc = 2
type Mask_Invalidate_Parent = 3
const Flag_Before_Calc: Flag_Before_Calc = 1
const Flag_After_Calc: Flag_After_Calc = 2
const Mask_Invalidate_Parent = 3

// endregion

// region variables

let currentState: TCallState = null
let nextCallId = 1

export function getCurrentState() {
	return currentState
}

// endregion

// region subscriberLinkPool

export type TSubscriberLink = ISubscriberLink<any, any>
export interface ISubscriberLink<TState extends TCallState,
	TSubscriber extends TCallState,
	>
	extends ILinkItem<TSubscriber> {
	state: TState,
	prev: ISubscriberLink<TState, any>,
	next: ISubscriberLink<TState, any>,
}

export const subscriberLinkPool = new ObjectPool<TSubscriberLink>(1000000)

export function releaseSubscriberLink(obj: TSubscriberLink) {
	subscriberLinkPool.release(obj)
}

export function getSubscriberLink<TState extends TCallState,
	TSubscriber extends TCallState,
	>(
	state: TState,
	subscriber: TSubscriber,
	prev: ISubscriberLink<TState, any>,
	next: ISubscriberLink<TState, any>,
): ISubscriberLink<TState, TSubscriber> {
	const item: ISubscriberLink<TState, TSubscriber> = subscriberLinkPool.get()
	if (item != null) {
		item.state = state
		item.value = subscriber
		item.prev = prev
		item.next = next
		return item
	}
	return {
		state,
		value: subscriber,
		prev,
		next,
	}
}

export function subscriberLinkDelete<TState extends TCallState>(
	item: ISubscriberLink<TState, any>,
) {
	const {prev, next, state} = item
	if (state == null) {
		return
	}
	if (item === state._subscribersCalculating) {
		state._subscribersCalculating = next
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

// region helpers

// tslint:disable-next-line:no-empty
function emptyFunc() { }

export function invalidateParent<
	TState extends TCallState,
	TSubscriber extends TCallState,
>(
	link: ISubscriberLink<TState, TSubscriber>,
	status: Mask_Update_Invalidate,
): ISubscriberLink<TState, any> {
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
		childState._updateInvalidate(status, false)
	}

	return next
}

// endregion

export type TCallState = CallState<any, any, any>
// export interface TCallStateX<TThisOuter, TArgs extends any[], TResultInner>
// 	extends CallState<TThisOuter, TArgs, TResultInner, true, TCallStateX<TThisOuter, TArgs, TResultInner>>
// {}

export type TFuncCall<
	TThisOuter,
	TArgs extends any[],
	TResultInner
> = (
	this: CallState<TThisOuter, TArgs, TResultInner>,
) => TResultInner

export class CallState<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>
	implements ICallState<TThisOuter, TArgs, TResultInner>
{
	constructor(
		func: Func<unknown, TArgs, unknown>,
		thisOuter: TThisOuter,
		callWithArgs: TCall<TArgs>,
		funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>,
		valueIds: number[],
	) {
		this.func = func
		this.thisOuter = thisOuter
		this.callWithArgs = callWithArgs
		this.funcCall = funcCall
		this.valueIds = valueIds
	}

	// region properties

	// region public

	public readonly func: Func<unknown, TArgs, unknown>
	public readonly thisOuter: TThisOuter
	public readonly callWithArgs: TCall<TArgs>
	public readonly funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>
	public readonly valueIds: number[]
	public deleteOrder: number = 0

	public status: CallStatus = Flag_Invalidated | Flag_Recalc
	public valueAsync: IThenable<TInnerValue<TResultInner>> = null
	public value: TInnerValue<TResultInner> = void 0
	public error: any = void 0
	// for detect recursive async loop
	public parentCallState: TCallState = null
	public _subscribersFirst: ISubscriberLink<this, any> = null
	public _subscribersLast: ISubscriberLink<this, any> = null
	public _subscribersCalculating: ISubscriberLink<this, any> = null
	// for prevent multiple subscribe equal dependencies
	public callId: number = 0
	public _unsubscribers: Array<ISubscriberLink<any, this>> = null
	public _unsubscribersLength: number = 0

	// endregion

	// region calculable

	public get hasSubscribers(): boolean {
		return this._subscribersFirst != null
	}

	public get isHandling(): boolean {
		return (this.status & (Flag_Check | Flag_Calculating | Flag_Invalidating)) !== 0
	}

	public get statusString(): string {
		return statusToString(this.status)
	}

	// endregion

	// endregion

	// region methods

	// region 1: calc

	public getValue(
		dontThrowOnError?: boolean,
	): TResultOuter<TResultInner> {
		if (currentState != null && (currentState.status & Flag_Check) === 0) {
			currentState._subscribeDependency(this)
		}
		this.callId = nextCallId++

		const prevStatus = this.status

		if (isCalculated(this.status)) {
			if (isHasError(this.status)) {
				throw this.error
			}
			return this.value as any
		} else if (getCalculate(this.status) !== 0) {
			if ((this.status & Flag_Async) !== 0) {
				let parentCallState = currentState
				while (parentCallState) {
					if (parentCallState === this) {
						this._internalError('Recursive async loop detected')
					}
					parentCallState = parentCallState.parentCallState
				}
				return this.valueAsync as any
			} else if ((this.status & (Flag_Check | Flag_Calculating)) !== 0) {
				this._internalError('Recursive sync loop detected')
			} else {
				this._internalError(`Unknown CallStatus: ${statusToString(this.status)}`)
			}
		} else if (getInvalidate(this.status) !== 0) {
			// nothing
		} else {
			this._internalError(`Unknown CallStatus: ${statusToString(this.status)}`)
		}

		this.parentCallState = currentState
		currentState = null

		this._updateCheck()

		let shouldRecalc: ThenableIterator<boolean> | boolean
		if (isRecalc(prevStatus)) {
			shouldRecalc = true
		} else {
			shouldRecalc = this._checkDependenciesChanged()
		}

		if (shouldRecalc === false) {
			currentState = this.parentCallState
			this.parentCallState = null
			if (isHasError(this.status)) {
				if (dontThrowOnError !== true) {
					throw this.error
				}
				return
			}
			return this.value as any
		}

		let value: any
		if (shouldRecalc === true) {
			value = this._calc(dontThrowOnError)
		} else if (isIterator(shouldRecalc)) {
			value = resolveAsync(shouldRecalc, o => {
				if (o === false) {
					currentState = null
					this.parentCallState = null
					if (isHasError(this.status)) {
						if (dontThrowOnError !== true) {
							throw this.error
						}
						return
					}
					return this.value
				}
				return this._calc(dontThrowOnError)
			})

			if (isThenable(value)) {
				this._updateCheckAsync(value as any)
			}
		} else {
			this._internalError(`shouldRecalc == ${shouldRecalc}`)
		}

		return value
	}

	private _calc(
		dontThrowOnError?: boolean,
	): TResultOuter<TResultInner> {
		this._updateCalculating()
		this.callId = nextCallId++

		let _isIterator = false
		try {
			currentState = this

			// let value: any = this.func.apply(this.thisOuter, arguments)
			let value: any = this.funcCall()
			// this.callWithArgs<TThisInner, TResultInner>(
			// 	this.thisAsState ? this as any : this.thisOuter,
			// 	this.func,
			// )

			if (!isIterator(value)) {
				if (isThenable(value)) {
					this._internalError('You should use iterator instead thenable for async functions')
				}
				this._updateCalculatedValue(value)
				return value
			}

			_isIterator = true

			value = resolveAsync(
				this._makeDependentIterator(value) as ThenableOrIteratorOrValue<TResultInner>,
			)

			if (isThenable(value)) {
				this._updateCalculatingAsync(value)
			}

			return value
		} catch (error) {
			if (!_isIterator) {
				this._updateCalculatedError(error)
			}
			if (dontThrowOnError !== true || error instanceof InternalError) {
				throw error
			}
		} finally {
			currentState = this.parentCallState
			if (!_isIterator) {
				this.parentCallState = null
			}
		}
	}

	private* _makeDependentIterator(
		iterator: Iterator<TInnerValue<TResultInner>>,
		nested?: boolean,
	): Iterator<TInnerValue<TResultInner>> {
		currentState = this

		try {
			let iteration = iterator.next()
			while (!iteration.done) {
				let value: TIteratorOrValue<TInnerValue<TResultInner>> = iteration.value

				if (isIterator(value)) {
					value = this._makeDependentIterator(value as Iterator<TInnerValue<TResultInner>>, true)
				}

				value = yield value as any
				currentState = this
				iteration = iterator.next(value as any)
			}

			if ((this.status & Flag_Async) !== 0) {
				currentState = this.parentCallState
				if (nested == null) {
					this.parentCallState = null
				}
			}
			if (nested == null) {
				this._updateCalculatedValue(iteration.value)
			}
			return iteration.value
		} catch (error) {
			if ((this.status & Flag_Async) !== 0) {
				currentState = this.parentCallState
				if (nested == null) {
					this.parentCallState = null
				}
			}
			if (nested == null) {
				this._updateCalculatedError(error)
			}
			throw error
		}
	}

	// endregion

	// region 2: subscribe / unsubscribe

	private _subscribeDependency<TDependency extends TCallState>(
		dependency: TDependency,
	): void {
		if (this.callId < dependency.callId) {
			if ((this.status & Flag_Async) === 0) {
				return
			}
			const _unsubscribers = this._unsubscribers
			for (let i = 0, len = this._unsubscribersLength; i < len; i++) {
				if (_unsubscribers[i].state === dependency) {
					return
				}
			}
		}
		{
			const subscriberLink = dependency._subscribe(this)
			const _unsubscribers = this._unsubscribers
			if (_unsubscribers == null) {
				this._unsubscribers = [subscriberLink]
				this._unsubscribersLength = 1
			} else {
				_unsubscribers[this._unsubscribersLength++] = subscriberLink
			}
		}
	}

	private _subscribe<TSubscriber extends TCallState>(
		subscriber: TSubscriber,
	) {
		const _subscribersLast = this._subscribersLast
		const subscriberLink = getSubscriberLink(this, subscriber, _subscribersLast, null)
		if (_subscribersLast == null) {
			this._subscribersFirst = subscriberLink
		} else {
			_subscribersLast.next = subscriberLink
		}
		this._subscribersLast = subscriberLink
		return subscriberLink
	}

	/** @internal */
	public _unsubscribeDependencies(fromIndex?: number) {
		const _unsubscribers = this._unsubscribers
		if (_unsubscribers != null) {
			const len = this._unsubscribersLength
			const _fromIndex = fromIndex == null ? 0 : fromIndex
			for (let i = _fromIndex; i < len; i++) {
				const item = _unsubscribers[i]
				_unsubscribers[i] = null
				subscriberLinkDelete(item)
			}
			this._unsubscribersLength = _fromIndex
			if (_fromIndex < 256 && len > 256) {
				_unsubscribers.length = 256
			}
		}
	}

	// endregion

	// region 3: check dependencies

	private *_checkDependenciesChangedAsync(
		fromIndex?: number,
	): ThenableIterator<boolean> {
		const {_unsubscribers, _unsubscribersLength} = this
		if (_unsubscribers != null) {
			for (let i = fromIndex || 0, len = _unsubscribersLength; i < len; i++) {
				const dependencyState = _unsubscribers[i].state
				if (getInvalidate(dependencyState.status) !== 0) {
					dependencyState.getValue(true)
				}

				if ((dependencyState.status & Flag_Async) !== 0) {
					yield resolveAsync(dependencyState.valueAsync, null, emptyFunc) as any
				}

				if ((this.status & CallStatus.Flag_Recalc) !== 0) {
					return true
				}

				if ((dependencyState.status & (Flag_Check | Flag_Calculating)) !== 0
					|| (dependencyState.status & (Flag_HasError | Flag_HasValue)) === 0
				) {
					this._internalError(`Unexpected dependency status: ${statusToString(dependencyState.status)}`)
				}
			}
		}

		this._updateCalculated()
		return false
	}

	private _checkDependenciesChanged(): ThenableIterator<boolean> | boolean {
		const {_unsubscribers, _unsubscribersLength} = this
		if (_unsubscribers != null) {
			for (let i = 0, len = _unsubscribersLength; i < len; i++) {
				const dependencyState = _unsubscribers[i].state
				if (getInvalidate(dependencyState.status) !== 0) {
					dependencyState.getValue(true)
				}

				if ((dependencyState.status & Flag_Async) !== 0) {
					return this._checkDependenciesChangedAsync(i)
				}

				if ((this.status & CallStatus.Flag_Recalc) !== 0) {
					return true
				}

				if ((dependencyState.status & (Flag_Check | Flag_Calculating)) !== 0
					|| (dependencyState.status & (Flag_HasError | Flag_HasValue)) === 0
				) {
					this._internalError(`Unexpected dependency status: ${statusToString(dependencyState.status)}`)
				}
			}
		}

		this._updateCalculated()
		return false
	}

	// endregion

	// region 4: change value & status

	private _internalError(message: string) {
		this._unsubscribeDependencies()
		const error = new InternalError(message)
		this._updateCalculatedError(error)
		throw error
	}

	private _updateCheck() {
		const prevStatus = this.status

		if ((prevStatus & Mask_Invalidate) === 0) {
			this._internalError(`Set status ${statusToString(Update_Check)} called when current status is ${statusToString(prevStatus)}`)
		}

		this.status = (prevStatus & ~(Mask_Invalidate | Flag_Recalc | Mask_Calculate)) | Flag_Check
	}

	private _updateCheckAsync(
		valueAsync: IThenable<TInnerValue<TResultInner>>,
	) {
		const prevStatus = this.status

		if (!isCheck(prevStatus)) {
			this._internalError(`Set status ${statusToString(Update_Check_Async)} called when current status is ${statusToString(prevStatus)}`)
		}
		this.valueAsync = valueAsync

		this.status = (prevStatus & ~Mask_Calculate) | Update_Check_Async
	}

	private _updateCalculating() {
		const prevStatus = this.status

		if ((prevStatus & (Mask_Invalidate | Flag_Check)) === 0) {
			this._internalError(`Set status ${statusToString(Update_Calculating)} called when current status is ${statusToString(prevStatus)}`)
		}

		this.status = (prevStatus & ~(Mask_Invalidate | Flag_Recalc | Mask_Calculate)) | Flag_Calculating

		this._subscribersCalculating = this._subscribersLast
	}

	private _updateCalculatingAsync(
		valueAsync: IThenable<TInnerValue<TResultInner>>,
	) {
		const prevStatus = this.status

		if (!isCalculating(prevStatus)) {
			this._internalError(`Set status ${statusToString(Update_Calculating_Async)} called when current status is ${statusToString(prevStatus)}`)
		}
		this.valueAsync = valueAsync

		this.status = (prevStatus & ~Mask_Calculate) | Update_Calculating_Async
	}

	private _updateCalculated() {
		const prevStatus = this.status

		if ((prevStatus & (Flag_Check | Flag_Calculating)) === 0) {
			this._internalError(`Set status ${statusToString(Update_Calculated_Value)} called when current status is ${statusToString(prevStatus)}`)
		}

		this.status = (prevStatus & (Flag_HasValue | Flag_HasError)) | Flag_Calculated

		this._subscribersCalculating = null

		const invalidateStatus = getInvalidate(prevStatus)
		if (invalidateStatus !== 0) {
			this._updateInvalidate(invalidateStatus, false)
		}
	}

	private _updateCalculatedValue(
		value: TInnerValue<TResultInner>,
	) {
		const prevStatus = this.status

		if ((prevStatus & (Flag_Check | Flag_Calculating)) === 0) {
			this._internalError(`Set status ${statusToString(Update_Calculated_Value)} called when current status is ${statusToString(prevStatus)}`)
		}
		if (this.valueAsync != null) {
			this.valueAsync = null
		}

		this.status = Update_Calculated_Value

		if ((prevStatus & (Flag_HasError | Flag_HasValue)) !== Flag_HasValue
			|| this.value !== value
		) {
			this.error = void 0
			this.value = value
			this._afterCalc(prevStatus, true)
		} else {
			this._afterCalc(prevStatus, false)
		}
	}

	private _updateCalculatedError(
		error: any,
	) {
		const prevStatus = this.status

		if (error instanceof InternalError) {
			this.status = Update_Calculated_Error | (prevStatus & Flag_HasValue) | Flag_InternalError
			this.parentCallState = null
			currentState = null
		} else {
			if ((prevStatus & (Flag_Check | Flag_Calculating)) === 0) {
				this._internalError(`Set status ${statusToString(Update_Calculated_Error)} called when current status is ${statusToString(prevStatus)}`)
			}
			if (this.valueAsync != null) {
				this.valueAsync = null
			}

			this.status = Update_Calculated_Error | (prevStatus & Flag_HasValue)
		}

		if ((prevStatus & Flag_HasError) === 0
			|| this.error !== error
		) {
			this.error = error
			this._afterCalc(prevStatus, true)
		} else {
			this._afterCalc(prevStatus, false)
		}
	}

	private _afterCalc(
		prevStatus: CallStatus,
		valueChanged: boolean,
	) {
		if ((prevStatus & Mask_Invalidate) !== 0) {
			this._updateInvalidate(Update_Invalidating, valueChanged)
			this._updateInvalidate(Update_Invalidated, valueChanged)
		} else if (valueChanged) {
			this._invalidateParents(Update_Recalc, Flag_None)
		}

		this._subscribersCalculating = null
	}

	// endregion

	// region 5: invalidate self and dependent

	public invalidate(): void {
		this._updateInvalidate(Update_Invalidating_Recalc, false)
		this._updateInvalidate(Update_Invalidated_Recalc, false)
	}

	/** @internal */
	public _updateInvalidate(
		status: Mask_Update_Invalidate,
		parentRecalc: boolean,
	): void {
		const prevStatus = this.status

		let statusBefore: Mask_Update_Invalidate | Flag_None = 0
		let statusAfter: Mask_Update_Invalidate | Flag_None = 0

		if (isRecalc(status) && (prevStatus & Flag_Calculating) === 0 && this._unsubscribersLength !== 0) {
			this._unsubscribeDependencies()
		}

		if (status === Update_Recalc) {
			if (isCalculated(prevStatus)) {
				this._internalError(`Set status ${statusToString(Update_Recalc)} called when current status is ${statusToString(prevStatus)}`)
			}
			this.status = prevStatus | status
		} else {
			if (isInvalidated(prevStatus)) {
				if (!isRecalc(prevStatus) && isRecalc(status)) {
					this.status = prevStatus | Flag_Recalc
				}
				if (parentRecalc) {
					statusBefore = Update_Invalidated_Recalc
				}
			} else if (status === Update_Invalidating || status === Update_Invalidating_Recalc) {
				this.status = (prevStatus & ~(Mask_Invalidate | Flag_Calculated)) | status

				statusBefore = parentRecalc ? Update_Invalidating_Recalc : Update_Invalidating
				statusAfter = Update_Invalidating
			} else if (status === Update_Invalidated || status === Update_Invalidated_Recalc) {
				this.status = (prevStatus & ~(Mask_Invalidate | Flag_Calculated)) | status

				statusBefore = parentRecalc ? Update_Invalidated_Recalc : Update_Invalidated
				statusAfter = Update_Invalidated
			} else {
				this._internalError(`Unknown status: ${statusToString(status)}`)
			}
		}

		if (statusBefore !== 0 || statusAfter !== 0) {
			this._invalidateParents(statusBefore, statusAfter)
		}
	}

	private _invalidateParents(
		statusBefore: Mask_Update_Invalidate | Flag_None,
		statusAfter: Mask_Update_Invalidate | Flag_None,
	) {
		const lastLink = this._subscribersCalculating

		let status: Mask_Update_Invalidate
		let link: ISubscriberLink<this, any>
		if (statusBefore !== 0) {
			status = statusBefore
			link = this._subscribersFirst
		} else if (statusAfter !== 0) {
			status = statusAfter
			if (lastLink !== null) {
				link = lastLink.next
			} else {
				link = this._subscribersFirst
			}
		} else {
			this._internalError('statusBefore === 0 && statusAfter === 0')
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

	// endregion

	// endregion
}
