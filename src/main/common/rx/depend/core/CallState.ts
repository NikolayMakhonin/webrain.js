import {
	isAsync,
	isThenable,
	IThenable,
	ThenableIterator,
	ThenableOrIterator,
	ThenableOrIteratorOrValue,
	ThenableOrValue,
} from '../../../async/async'
import {resolveAsync, ThenableSync} from '../../../async/ThenableSync'
import {isIterator, nextHash} from '../../../helpers/helpers'
import {webrainOptions} from '../../../helpers/webrainOptions'
import {ObjectPool} from '../../../lists/ObjectPool'
import {PairingHeap, PairingNode} from '../../../lists/PairingHeap'
import {DeferredCalc, IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {ISubscriber, IUnsubscribe} from '../../subjects/observable'
import {ISubject, Subject} from '../../subjects/subject'
import {
	CallStatus, CallStatusShort,
	Func,
	ICallState,
	ILinkItem,
	TCall,
	TInnerValue,
	TResultOuter,
} from './contracts'
import {getCurrentState, setCurrentState} from './current-state'
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

// TODO inline these methods
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
	const buffer = ['']

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
		buffer.push(remain + '')
	}

	return buffer.join(' | ')
}

export function toStatusShort(status: CallStatus): CallStatusShort {
	if ((status & (Flag_Check | Flag_Calculating | Flag_Invalidating)) !== 0) {
		return CallStatusShort.Handling
	}
	if ((status & Flag_Invalidated) !== 0) {
		return CallStatusShort.Invalidated
	}
	if ((status & Flag_Calculated) !== 0) {
		if ((status & Flag_HasValue) !== 0) {
			return CallStatusShort.CalculatedValue
		}
		if ((status & Flag_HasError) !== 0) {
			return CallStatusShort.CalculatedError
		}
	}

	throw new InternalError(`Cannot convert CallStatus (${statusToString(status)}) to CallStatusShort`)
}

// endregion

// endregion

// region constants

// tslint:disable-next-line:no-construct use-primitive-type
export const ALWAYS_CHANGE_VALUE = new String('ALWAYS_CHANGE_VALUE')
// tslint:disable-next-line:no-construct use-primitive-type
export const NO_CHANGE_VALUE = new String('NO_CHANGE_VALUE')

type Flag_Before_Calc = 1
type Flag_After_Calc = 2
type Mask_Invalidate_Parent = 3
const Flag_Before_Calc: Flag_Before_Calc = 1
const Flag_After_Calc: Flag_After_Calc = 2
const Mask_Invalidate_Parent = 3

// endregion

// region variables

let nextCallId = 1

// endregion

// region subscriberLinkPool

export type TSubscriberLink = ISubscriberLink<any, any>
export interface ISubscriberLink<TState extends TCallStateAny,
	TSubscriber extends TCallStateAny,
	>
	extends ILinkItem<TSubscriber>
{
	state: TState,
	prev: ISubscriberLink<TState, any>,
	next: ISubscriberLink<TState, any>,
	isLazy: boolean,
}

export const subscriberLinkPool = new ObjectPool<TSubscriberLink>(1000000)

export function releaseSubscriberLink(obj: TSubscriberLink) {
	subscriberLinkPool.release(obj)
}

export function getSubscriberLink<
	TState extends TCallStateAny,
	TSubscriber extends TCallStateAny,
>(
	state: TState,
	subscriber: TSubscriber,
	prev: ISubscriberLink<TState, any>,
	next: ISubscriberLink<TState, any>,
	isLazy: boolean,
): ISubscriberLink<TState, TSubscriber> {
	const item: ISubscriberLink<TState, TSubscriber> = subscriberLinkPool.get()
	if (item != null) {
		item.state = state
		item.value = subscriber
		item.prev = prev
		item.next = next
		item.isLazy = isLazy
		return item
	}
	return {
		state,
		value: subscriber,
		prev,
		next,
		isLazy,
	}
}

export function subscriberLinkDelete<TState extends TCallStateAny>(
	item: ISubscriberLink<TState, any>,
) {
	const {prev, next, state} = item
	if (state == null) {
		return
	}
	if (item === state._subscribersCalculatingLazy) {
		state._subscribersCalculatingLazy = next
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
function EMPTY_FUNC(this: any, ...args: any[]): any { }

export function invalidateParent<
	TState extends TCallStateAny,
	TSubscriber extends TCallStateAny,
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

export type TCallStateAny = CallState<any, any, any>

export type TFuncCall<
	TThisOuter,
	TArgs extends any[],
	TResultInner
	> = (
	state: CallState<TThisOuter, TArgs, TResultInner>,
) => TResultInner

let usageNextId = 1

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
		valueIds: Int32Array,
	) {
		this.func = func
		this._this = thisOuter
		this.callWithArgs = callWithArgs
		this.funcCall = funcCall
		this.valueIds = valueIds
	}

	// region properties

	// region public/private

	public readonly func: Func<unknown, TArgs, unknown>
	public readonly _this: TThisOuter
	public readonly callWithArgs: TCall<TArgs>
	public funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>
	public readonly valueIds: Int32Array

	/** @internal */
	public _deleteOrder: number = 0

	public status: CallStatus = Flag_Invalidated | Flag_Recalc
	public valueAsync: IThenable<TInnerValue<TResultInner>> = null
	public value: TInnerValue<TResultInner> = void 0
	public error: any = void 0

	private _data: {
		[key: string]: any;
		[key: number]: any;
	} = null

	public get data() {
		let {_data} = this
		if (_data == null) {
			this._data = _data = {}
		}
		return _data
	}

	public deferredOptions: IDeferredCalcOptions = null
	/** @internal */
	public _deferredCalc: DeferredCalc = null

	// for detect recursive async loop
	private _parentCallState: TCallStateAny = null
	/** @internal */
	public _subscribersFirst: ISubscriberLink<this, any> = null
	/** @internal */
	public _subscribersLast: ISubscriberLink<this, any> = null
	/** @internal */
	public _subscribersCalculatingLazy: ISubscriberLink<this, any> = null
	/** @internal */
	public _subscribersCalculating: ISubscriberLink<this, any> = null
	// for prevent multiple subscribe equal dependencies
	private _callId: number = 0
	/** @internal */
	public _unsubscribers: Array<ISubscriberLink<any, this>> = null
	/** @internal */
	public _unsubscribersLength: number = 0

	private _changedSubject: ISubject<this> = null

	// endregion

	// region calculable

	public get hasSubscribers(): boolean {
		return this._subscribersFirst != null
			|| this._changedSubject != null && this._changedSubject.hasSubscribers
	}

	public get statusShort(): CallStatusShort {
		return toStatusShort(this.status)
	}

	public get statusString(): string {
		return statusToString(this.status)
	}

	// public get hasValue(): boolean {
	// 	return (this.status & Flag_HasValue) !== 0
	// }
	//
	// public get hasError(): boolean {
	// 	return (this.status & Flag_HasError) !== 0
	// }
	//
	// public get hasValueOrAsync(): boolean {
	// 	return (this.status & (Flag_HasValue | Flag_Async)) !== 0
	// }
	//
	// public get valueOrAsync(): IThenable<TInnerValue<TResultInner>> | TInnerValue<TResultInner> {
	// 	return this.valueAsync != null
	// 		? this.valueAsync
	// 		: this.value
	// }

	// endregion

	// endregion

	// region methods

	public updateUsageStat() {
		this._deleteOrder = usageNextId++
	}

	// region 1: calc

	public getValue(
		isLazy?: boolean,
		dontThrowOnError?: boolean,
	): TResultOuter<TResultInner> {
		const currentState = getCurrentState()
		if (currentState != null && (currentState.status & Flag_Check) === 0) {
			currentState._subscribeDependency.call(currentState, this, isLazy)
		}
		this._callId = nextCallId++

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
					parentCallState = parentCallState._parentCallState
				}

				if (isLazy) {
					return this.value
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

		this._parentCallState = currentState
		setCurrentState(null)

		this._updateCheck()

		let shouldRecalc: ThenableIterator<boolean> | boolean
		if (isRecalc(prevStatus)) {
			shouldRecalc = true
		} else {
			shouldRecalc = this._checkDependenciesChanged()
		}

		if (shouldRecalc === false) {
			setCurrentState(this._parentCallState)
			this._parentCallState = null
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
					setCurrentState(null)
					this._parentCallState = null
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

		if (isLazy && isThenable(value)) {
			return this.value
		}

		return value
	}

	private _calc(
		dontThrowOnError?: boolean,
	): TResultOuter<TResultInner> {
		this._updateCalculating()
		this._callId = nextCallId++

		let _isAsync = false
		try {
			setCurrentState(this)

			let value: any = this.funcCall(this)

			if (!isAsync(value)) {
				this._updateCalculatedValue(value)
				return value
			}

			if (isThenable(value) && !(value instanceof ThenableSync)) {
				this._internalError('You should use iterator or ThenableSync instead Promise for async functions')
			}

			_isAsync = true

			// Old method:
			// value = resolveAsync(
			// 	this._makeDependentIterator(value) as ThenableOrIteratorOrValue<TResultInner>,
			// )

			// New method (more functionality)
			value = resolveAsync(
				value as ThenableOrIteratorOrValue<TResultInner>,
				val => {
					if ((this.status & Flag_Async) !== 0) {
						this._parentCallState = null
					}
					this._updateCalculatedValue(val as any)
					return val
				},
				error => {
					if ((this.status & Flag_Async) !== 0) {
						this._parentCallState = null
					}
					this._updateCalculatedError(error)

					// TODO delete this line (it needed only for replace old deepSubscribe to new depend funcs)
					console.error(error)

					throw error
				},
			)

			if (isThenable(value)) {
				this._updateCalculatingAsync(value)
			}

			return value
		} catch (error) {
			if (!_isAsync) {
				this._updateCalculatedError(error)
			}
			if (dontThrowOnError !== true || error instanceof InternalError) {
				throw error
			}
		} finally {
			setCurrentState(this._parentCallState)
			if (!_isAsync) {
				this._parentCallState = null
			}
		}
	}

	// private* _makeDependentIterator(
	// 	iterator: Iterator<TInnerValue<TResultInner>>,
	// 	nested?: boolean,
	// ): Iterator<TInnerValue<TResultInner>> {
	// 	setCurrentState(this)
	//
	// 	try {
	// 		let iteration = iterator.next()
	// 		let value: TIteratorOrValue<TInnerValue<TResultInner>>
	//
	// 		while (true) {
	// 			value = iteration.value
	//
	// 			if (isIterator(value)) {
	// 				value = this._makeDependentIterator(value as Iterator<TInnerValue<TResultInner>>, true)
	// 			}
	//
	// 			value = yield value as any
	//
	// 			if (iteration.done) {
	// 				break
	// 			}
	//
	// 			setCurrentState(this)
	// 			iteration = iterator.next(value as any)
	// 			setCurrentState(null)
	// 		}
	//
	// 		if ((this.status & Flag_Async) !== 0) {
	// 			// setCurrentState(this._parentCallState)
	// 			if (nested == null) {
	// 				this._parentCallState = null
	// 			}
	// 		}
	// 		if (nested == null) {
	// 			this._updateCalculatedValue(value as any)
	// 		}
	// 		return value
	// 	} catch (error) {
	// 		if ((this.status & Flag_Async) !== 0) {
	// 			// setCurrentState(this._parentCallState)
	// 			if (nested == null) {
	// 				this._parentCallState = null
	// 			}
	// 		}
	// 		if (nested == null) {
	// 			this._updateCalculatedError(error)
	// 		}
	// 		throw error
	// 	}
	// }

	// endregion

	// region 2: subscribe / unsubscribe

	private _subscribeDependency<TDependency extends TCallStateAny>(
		dependency: TDependency,
		isLazy: boolean,
	) {
		if (this._callId < dependency._callId) {
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
			const subscriberLink = dependency._subscribe(this, isLazy)
			const _unsubscribers = this._unsubscribers
			if (_unsubscribers == null) {
				this._unsubscribers = [subscriberLink]
				this._unsubscribersLength = 1
			} else {
				_unsubscribers[this._unsubscribersLength++] = subscriberLink
			}
		}
	}

	private _subscribe<TSubscriber extends TCallStateAny>(
		subscriber: TSubscriber,
		isLazy: boolean,
	) {
		const _subscribersLast = this._subscribersLast
		const subscriberLink = getSubscriberLink(this, subscriber, _subscribersLast, null, isLazy)

		if (_subscribersLast == null) {
			this._subscribersFirst = subscriberLink
		} else if (isLazy && this._subscribersCalculating != null) {
			// insert after calculating
			const {_subscribersCalculatingLazy, _subscribersCalculating} = this
			const {next} = _subscribersCalculating
			if (next != null) {
				subscriberLink.next = next
				next.prev = subscriberLink
			}
			_subscribersCalculating.next = subscriberLink
			subscriberLink.prev = _subscribersCalculating
			this._subscribersCalculating = subscriberLink

			if (_subscribersCalculatingLazy == null) {
				this._subscribersCalculatingLazy = subscriberLink
			}
		} else {
			_subscribersLast.next = subscriberLink
			subscriberLink.prev = _subscribersLast
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
				const link = _unsubscribers[i]
				const dependencyState = link.state
				const {isLazy} = link
				if (getInvalidate(dependencyState.status) !== 0) {
					dependencyState.getValue(isLazy, true)
				}

				if (!isLazy && (dependencyState.status & Flag_Async) !== 0) {
					yield resolveAsync(dependencyState.valueAsync, null, EMPTY_FUNC) as any
				}

				if ((this.status & CallStatus.Flag_Recalc) !== 0) {
					return true
				}

				if (!isLazy && (
					(dependencyState.status & (Flag_Check | Flag_Calculating)) !== 0
					|| (dependencyState.status & (Flag_HasError | Flag_HasValue)) === 0
				)) {
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
				const link = _unsubscribers[i]
				const dependencyState = link.state
				const {isLazy} = link
				if (getInvalidate(dependencyState.status) !== 0) {
					dependencyState.getValue(isLazy, true)
				}

				if (!isLazy && (dependencyState.status & Flag_Async) !== 0) {
					return this._checkDependenciesChangedAsync(i)
				}

				if ((this.status & CallStatus.Flag_Recalc) !== 0) {
					return true
				}

				if (!isLazy && (
					(dependencyState.status & (Flag_Check | Flag_Calculating)) !== 0
					|| (dependencyState.status & (Flag_HasError | Flag_HasValue)) === 0
				)) {
					this._internalError(`Unexpected dependency status: ${statusToString(dependencyState.status)}`)
				}
			}
		}

		this._updateCalculated()
		return false
	}

	// endregion

	// region 4: change value & status

	/** @internal */
	public _internalError(message: string) {
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

		const {_subscribersLast} = this
		if (_subscribersLast != null) {
			this._subscribersCalculating = _subscribersLast
			if (_subscribersLast.isLazy) {
				this._subscribersCalculatingLazy = _subscribersLast
			}
		}
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

		this._subscribersCalculatingLazy = null
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

		if (value !== NO_CHANGE_VALUE
			&& (
				(prevStatus & (Flag_HasError | Flag_HasValue)) !== Flag_HasValue
					|| value === ALWAYS_CHANGE_VALUE
					|| !(
						this.value === value || webrainOptions.equalsFunc && webrainOptions.equalsFunc(this.value, value)
					)
			)
		) {
			this.error = void 0
			this.value = value
			this._afterCalc(prevStatus, true)
			this.onChanged()
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
			this._parentCallState = null
			setCurrentState(null)
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
			this.onChanged()
		} else {
			this._afterCalc(prevStatus, false)
		}
	}

	private _afterCalc(
		prevStatus: CallStatus,
		valueChanged: boolean,
	) {
		if ((prevStatus & Mask_Invalidate) !== 0) {
			if ((prevStatus & Flag_Recalc) !== 0) {
				this._updateInvalidate(Update_Invalidating_Recalc, valueChanged)
				this._updateInvalidate(Update_Invalidated_Recalc, valueChanged)
			} else {
				this._updateInvalidate(Update_Invalidating, valueChanged)
				this._updateInvalidate(Update_Invalidated, valueChanged)
			}
		} else if (valueChanged) {
			this._invalidateParents(Update_Recalc, Update_Invalidating_Recalc, Flag_None)
			this._invalidateParents(Flag_None, Update_Invalidated_Recalc, Flag_None)
		}

		this._subscribersCalculatingLazy = null
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

		if (isRecalc(status)
			&& (prevStatus & Flag_Calculating) === 0
			&& (this.status & Flag_Invalidating) === 0
			&& this._unsubscribersLength !== 0
		) {
			this._unsubscribeDependencies()
		}

		if (isInvalidated(status) && !isInvalidated(prevStatus)) {
			this.onChanged()
		}

		if (statusBefore !== 0 || statusAfter !== 0) {
			this._invalidateParents(statusBefore, statusAfter, statusAfter)
		}
	}

	private _invalidateParents(
		statusCalculated: Mask_Update_Invalidate | Flag_None,
		statusCalculatingLazy: Mask_Update_Invalidate | Flag_None,
		statusCalculating: Mask_Update_Invalidate | Flag_None,
	) {
		const {_subscribersFirst, _subscribersCalculatingLazy, _subscribersCalculating} = this

		if (_subscribersFirst == null) {
			return
		}

		const _subscribersCalculatingLazyPrev = _subscribersCalculatingLazy != null
			? _subscribersCalculatingLazy.prev
			: _subscribersCalculatingLazy

		let status: Mask_Update_Invalidate
		let lastLink: ISubscriberLink<this, any>
		let link: ISubscriberLink<this, any>
		if (statusCalculated !== 0 && _subscribersFirst !== _subscribersCalculatingLazy) {
			status = statusCalculated
			lastLink = _subscribersCalculatingLazy != null
				? _subscribersCalculatingLazyPrev
				: _subscribersCalculating
			link = this._subscribersFirst
		} else if (statusCalculatingLazy !== 0 && _subscribersCalculatingLazy != null) {
			status = statusCalculatingLazy
			lastLink = _subscribersCalculating
			link = _subscribersCalculatingLazy
		} else if (statusCalculating !== 0 && _subscribersCalculating != null) {
			status = statusCalculating
			lastLink = null
			link = _subscribersCalculating.next
		} else {
			return
		}

		for (; link !== null;) {
			let next = invalidateParent(
				link,
				link.isLazy && status === Update_Recalc && statusCalculatingLazy !== 0
					? statusCalculatingLazy
					: status,
			)

			if (link === lastLink) {
				if (lastLink === _subscribersCalculating) {
					if (statusCalculating !== 0) {
						status = statusCalculating
						lastLink = null
					} else {
						break
					}
				} else if (lastLink === _subscribersCalculatingLazyPrev) {
					if (statusCalculatingLazy !== 0) {
						status = statusCalculatingLazy
						lastLink = _subscribersCalculating
					} else if (statusCalculating !== 0 && _subscribersCalculating != null) {
						status = statusCalculating
						lastLink = null
						next = _subscribersCalculating.next
					} else {
						this._internalError('Unexpected behavior 1')
					}
				} else {
					this._internalError('Unexpected behavior 2')
				}
			}

			link = next
		}
	}

	// endregion

	// region 6: subscribe other tools

	private onChanged() {
		const {_changedSubject} = this
		if (_changedSubject != null) {
			// TODO setTimeout needed until not resolved problem
			// with delete subscriber link during iterate subscribers links
			setTimeout(() => _changedSubject.emit(this), 0)
		}
	}

	/**
	 * Subscribe "on invalidated" or "on calculated"
	 * @param subscriber The first argument is {@link ICallState};
	 * [statusShort]{@link ICallState.statusShort} is [Invalidated]{@link CallStatusShort.Invalidated},
	 * [CalculatedValue]{@link CallStatusShort.CalculatedValue}
	 * or [CalculatedError]{@link CallStatusShort.CalculatedError}
	 */
	public subscribe(subscriber: ISubscriber<this>): IUnsubscribe {
		let {_changedSubject} = this
		if (_changedSubject == null) {
			this._changedSubject = _changedSubject = new Subject<this>()
		}
		return _changedSubject.subscribe(subscriber)
	}

	// endregion

	// endregion
}

// region get/create/delete ValueState

export interface IValueState {
	usageCount: number
	value: any
}

export const valueIdToStateMap = new Map<number, IValueState>()
export const valueToIdMap = new Map<any, number>()
let nextValueId: number = 1

export function getValueState(valueId: number): IValueState {
	return valueIdToStateMap.get(valueId)
}

export function getValueId(value: any): number {
	const id = valueToIdMap.get(value)
	if (id == null) {
		return 0
	}
	return id
}

export function getOrCreateValueId(value: any): number {
	let id = valueToIdMap.get(value)
	if (id == null) {
		id = nextValueId++
		const state: IValueState = {
			usageCount: 0,
			value,
		}
		valueToIdMap.set(value, id)
		valueIdToStateMap.set(id, state)
	}
	return id
}

export function deleteValueState(valueId: number, value: any): void {
	if (!valueIdToStateMap.delete(valueId)) {
		throw new InternalError('value not found')
	}
	if (!valueToIdMap.delete(value)) {
		throw new InternalError('valueState not found')
	}
}

// endregion

// region CallStateProviderState

const valueIdsBuffer: Int32Array = new Int32Array(100)

// interface ICallStateProviderState<
// 	TThisOuter,
// 	TArgs extends any[],
// 	TResultInner,
// > {
// 	func: Func<unknown, TArgs, unknown>
// 	funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>
// 	initCallState: (state: CallState<TThisOuter, TArgs, TResultInner>) => void
// 	funcId: number
// 	funcHash: number
// }

interface ICallStateProvider<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	> {
	get: Func<TThisOuter, TArgs, CallState<TThisOuter, TArgs, TResultInner>>
	getOrCreate: Func<TThisOuter, TArgs, CallState<TThisOuter, TArgs, TResultInner>>
	func: Func<unknown, TArgs, unknown>,
	dependFunc: Func<
		TThisOuter,
		TArgs,
		TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner
		>,
}

// let currentCallStateProviderState: ICallStateProviderState<any, any, any> = null

function findCallState<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	>(
	callStates: Array<CallState<TThisOuter, TArgs, TResultInner>>,
	countValueStates: number,
	_valueIdsBuffer: Int32Array,
) {
	for (let i = 0, len = callStates.length; i < len; i++) {
		const state = callStates[i]
		const valueIds = state.valueIds
		if (valueIds.length === countValueStates) {
			let j = 0
			for (; j < countValueStates; j++) {
				if (valueIds[j] !== _valueIdsBuffer[j]) {
					break
				}
			}

			if (j === countValueStates) {
				return state
			}
		}
	}

	return null
}

// tslint:disable-next-line:no-shadowed-variable
export function createCallStateProvider<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	>(
	func: Func<unknown, TArgs, unknown>,
	funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>,
	initCallState: (state: CallState<TThisOuter, TArgs, TResultInner>) => void,
): ICallStateProvider<TThisOuter, TArgs, TResultInner> {
	const funcId = nextValueId++
	const funcHash = nextHash(17, funcId)

	// noinspection DuplicatedCode
	function _getCallState(this: TThisOuter) {
		// region getCallState

		const countArgs = arguments.length
		const countValueStates = countArgs + 2

		// region calc hash

		const _valueIdsBuffer = valueIdsBuffer
		_valueIdsBuffer[0] = funcId
		let hash = funcHash

		{
			const valueId = getValueId(this)
			if (valueId === 0) {
				return null
			}
			_valueIdsBuffer[1] = valueId
			hash = nextHash(hash, valueId)
		}

		for (let i = 0; i < countArgs; i++) {
			const valueId = getValueId(arguments[i])
			if (valueId === 0) {
				return null
			}
			_valueIdsBuffer[i + 2] = valueId
			hash = nextHash(hash, valueId)
		}

		// endregion

		let callState: CallState<TThisOuter, TArgs, TResultInner>
		const callStates = callStateHashTable.get(hash)
		if (callStates != null) {
			callState = findCallState(callStates, countValueStates, _valueIdsBuffer)
		}

		// endregion

		if (callState != null) {
			callState.updateUsageStat()
		}

		return callState
	}

	function createCallWithArgs(...args: TArgs): TCall<TArgs>
	function createCallWithArgs(): TCall<TArgs> {
		const args = arguments
		return function(_this, _func) {
			return _func.apply(_this, args)
		}
	}

	// noinspection DuplicatedCode
	function _getOrCreateCallState(this: TThisOuter) {
		// region getCallState

		const countArgs = arguments.length
		const countValueStates = countArgs + 2

		// region calc hash

		const _valueIdsBuffer = valueIdsBuffer
		_valueIdsBuffer[0] = funcId
		let hash = funcHash

		{
			const valueId = getOrCreateValueId(this)
			_valueIdsBuffer[1] = valueId
			hash = nextHash(hash, valueId)
		}

		for (let i = 0; i < countArgs; i++) {
			const valueId = getOrCreateValueId(arguments[i])
			_valueIdsBuffer[i + 2] = valueId
			hash = nextHash(hash, valueId)
		}

		// endregion

		let callState: CallState<TThisOuter, TArgs, TResultInner>
		let callStates = callStateHashTable.get(hash)
		if (callStates != null) {
			callState = findCallState(callStates, countValueStates, _valueIdsBuffer)
		}

		// endregion

		if (callState != null) {
			callState.updateUsageStat()
			return callState
		}

		const valueIdsClone: Int32Array = _valueIdsBuffer.slice(0, countValueStates)
		for (let i = 0; i < countValueStates; i++) {
			if (i > 0) {
				const valueState = getValueState(_valueIdsBuffer[i])
				valueState.usageCount++
			}
		}

		callState = new CallState(
			func,
			this,
			createCallWithArgs.apply(null, arguments),
			funcCall,
			valueIdsClone,
		)

		if (
			callStatesCount === 0 // for prevent deoptimize
			|| callStatesCount >= nextCallStatesCount
		) {
			if (callStatesCount === 0) {
				callStatesCount = 1
			}
			reduceCallStates.call(null, callStatesCount - maxCallStatesCount + minDeleteCallStatesCount)
			nextCallStatesCount = callStatesCount + minDeleteCallStatesCount
			if (nextCallStatesCount < maxCallStatesCount) {
				nextCallStatesCount = maxCallStatesCount
			}
		}
		callStatesCount++

		if (initCallState != null) {
			initCallState(callState)
		}

		callState.updateUsageStat()

		if (callStates == null) {
			callStates = [callState]
			callStateHashTable.set(hash, callStates)
		} else {
			callStates.push(callState)
		}

		return callState
	}

	const state: ICallStateProvider<TThisOuter, TArgs, TResultInner> = {
		get: _getCallState,
		getOrCreate: _getOrCreateCallState,
		func,
		dependFunc: null,
	}

	return state
}

// endregion

// region CallState Provider

type TCallStateProviderMap = WeakMap<Func<any, any, any>, ICallStateProvider<any, any, any>>
const callStateProviderMap: TCallStateProviderMap = new WeakMap()

// region getCallState / getOrCreateCallState

export function invalidateCallState<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	>(
	state: ICallState<TThisOuter, TArgs, TResultInner>,
) {
	if (state != null) {
		state.invalidate()
		return true
	}
	return false
}

export function getCallState<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(
	func: Func<TThisOuter, TArgs, TResultInner>,
): Func<
	TThisOuter,
	TArgs,
	ICallState<TThisOuter, TArgs, TResultInner>
> {
	const callStateProvider = callStateProviderMap.get(func)
	if (callStateProvider == null) {
		return EMPTY_FUNC
	} else {
		return callStateProvider.get
	}
}

export function getOrCreateCallState<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	>(
	func: Func<TThisOuter, TArgs, TResultInner>,
): Func<
	TThisOuter,
	TArgs,
	ICallState<TThisOuter, TArgs, TResultInner>
	> {
	const callStateProviderState = callStateProviderMap.get(func)
	if (callStateProviderState == null) {
		return EMPTY_FUNC
	} else {
		// currentCallStateProviderState = callStateProviderState
		return callStateProviderState.getOrCreate
		// return _getOrCreateCallState
	}
}

// endregion

// endregion

// region get/create/delete/reduce CallStates

export const callStateHashTable = new Map<number, TCallStateAny[]>()
let callStatesCount = 0

// region createCallState

const maxCallStatesCount = 1500
const minDeleteCallStatesCount = 500
let nextCallStatesCount = maxCallStatesCount

// endregion

// region deleteCallState

export function deleteCallState(callState: TCallStateAny) {
	callState._unsubscribeDependencies()

	const valueIds = callState.valueIds

	let hash = 17
	for (let i = 0, len = valueIds.length; i < len; i++) {
		const valueId = valueIds[i]
		hash = nextHash(hash, valueId)
		if (i > 0) {
			const valueState = getValueState(valueId)
			const usageCount = valueState.usageCount
			if (usageCount <= 0) {
				throw new InternalError('usageCount <= 0')
			} else if (usageCount === 1 && i > 0) {
				deleteValueState(valueId, valueState.value)
			} else {
				valueState.usageCount--
			}
		}
	}

	// search and delete callState
	const callStates = callStateHashTable.get(hash)
	const callStatesLastIndex = callStates.length - 1
	if (callStatesLastIndex === -1) {
		throw new InternalError('callStates.length === 0')
	} else if (callStatesLastIndex === 0) {
		if (callStates[0] !== callState) {
			throw new InternalError('callStates[0] !== callState')
		}
		callStateHashTable.delete(hash)
	} else {
		let index = 0
		for (index = 0; index <= callStatesLastIndex; index++) {
			if (callStates[index] === callState) {
				if (index !== callStatesLastIndex) {
					callStates[index] = callStates[callStatesLastIndex]
				}
				callStates.length = callStatesLastIndex
				break
			}
		}
		if (index > callStatesLastIndex) {
			throw new InternalError('callState not found')
		}
	}

	callStatesCount--
}

// endregion

// region reduceCallStates to free memory

export const reduceCallStatesHeap = new PairingHeap<TCallStateAny>({
	objectPool: new ObjectPool<PairingNode<TCallStateAny>>(10000000),
	lessThanFunc(o1, o2) {
		return o1._deleteOrder < o2._deleteOrder
	},
})

function reduceCallStatesHeapAdd(states: TCallStateAny[]) {
	for (let i = 0, len = states.length; i < len; i++) {
		const callState = states[i]
		if (!callState.hasSubscribers && callState.statusShort !== CallStatusShort.Handling) {
			reduceCallStatesHeap.add(callState)
		}
	}
}

export function reduceCallStates(deleteSize: number) {
	callStateHashTable.forEach(reduceCallStatesHeapAdd)

	while (deleteSize > 0 && reduceCallStatesHeap.size > 0) {
		const callState = reduceCallStatesHeap.deleteMin()
		const {_unsubscribers, _unsubscribersLength} = callState
		if (_unsubscribers != null) {
			for (let i = 0, len = _unsubscribersLength; i < len; i++) {
				const state = _unsubscribers[i].state
				if (state._subscribersFirst === state._subscribersLast) {
					reduceCallStatesHeap.add(state)
				}
			}
		}
		deleteCallState(callState)
		deleteSize--
	}

	reduceCallStatesHeap.clear()
}

// endregion

// endregion

// region makeDependentFunc

export function createDependentFunc<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	>(
	func: Func<unknown, TArgs, unknown>,
	callStateProvider: ICallStateProvider<TThisOuter, TArgs, TResultInner>,
	canAlwaysRecalc: boolean,
)
	: Func<TThisOuter,
	TArgs,
	Func<TThisOuter,
		TArgs,
		TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner>> {
	return function _dependentFunc() {
		const getState = canAlwaysRecalc && getCurrentState() == null
			? callStateProvider.get
			: callStateProvider.getOrCreate

		const state: CallState<TThisOuter, TArgs, TResultInner>
			= getState.apply(this, arguments)

		return state != null
			? state.getValue() as any
			: func.apply(this, arguments)
	}
}

/**
 * @param canAlwaysRecalc sync, no deferred, without dependencies
 */
export function makeDependentFunc<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	>(
	func: Func<unknown, TArgs, unknown>,
	funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>,
	initCallState?: (state: CallState<TThisOuter, TArgs, TResultInner>) => void,
	canAlwaysRecalc?: boolean,
): Func<
	TThisOuter,
	TArgs,
	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner
	> {
	let callStateProvider = callStateProviderMap.get(func)
	if (callStateProvider != null) {
		return callStateProvider.dependFunc
	}

	callStateProvider = createCallStateProvider(func, funcCall, initCallState)

	callStateProviderMap.set(func, callStateProvider)

	const dependFunc = createDependentFunc(
		func,
		callStateProvider,
		canAlwaysRecalc,
	)

	callStateProvider.dependFunc = dependFunc

	callStateProviderMap.set(dependFunc, callStateProvider)

	return dependFunc as any
}

// endregion
