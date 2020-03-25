import {isThenable, IThenable, ThenableIterator, ThenableOrIteratorOrValue} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {isIterator} from '../../helpers/helpers'
import {
	Func,
	FuncCallStatus,
	IFuncCallState,
	ISubscriberLink,
	TCall,
	TGetThis,
	TInnerValue,
	TIteratorOrValue,
	TOuterResult,
} from './contracts'
import {InternalError} from './helpers'
import {_subscribe, unsubscribeDependencies} from './subscribeDependency'

// region FuncCallStatus

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

export function getInvalidate(status: FuncCallStatus): Mask_Invalidate {
	return (status & Mask_Invalidate) as any
}

export function setInvalidate(status: FuncCallStatus, value: Mask_Invalidate | Flag_None): FuncCallStatus {
	return (status & ~Mask_Invalidate) | value
}

export function isInvalidating(status: FuncCallStatus): boolean {
	return (status & Flag_Invalidating) !== 0
}

export function isInvalidated(status: FuncCallStatus): boolean {
	return (status & Flag_Invalidated) !== 0
}

// endregion

// region Recalc

export function isRecalc(status: FuncCallStatus): boolean {
	return (status & Flag_Recalc) !== 0
}

export function setRecalc(status: FuncCallStatus, value: boolean): FuncCallStatus {
	return value
		? status | Flag_Recalc
		: status & ~Flag_Recalc
}

// endregion

// region Calculate

export function getCalculate(status: FuncCallStatus): Mask_Calculate {
	return (status & Mask_Calculate) as any
}

export function setCalculate(status: FuncCallStatus, value: Mask_Calculate | Flag_None): FuncCallStatus {
	return (status & ~Mask_Calculate) | value
}

export function isCheck(status: FuncCallStatus): boolean {
	return (status & Flag_Check) !== 0
}

export function isCalculating(status: FuncCallStatus): boolean {
	return (status & Flag_Calculating) !== 0
}

export function isCalculated(status: FuncCallStatus): boolean {
	return (status & Flag_Calculated) !== 0
}

// endregion

// region HasValue

export function isHasValue(status: FuncCallStatus): boolean {
	return (status & Flag_HasValue) !== 0
}

export function setHasValue(status: FuncCallStatus, value: boolean): FuncCallStatus {
	return value
		? status | Flag_HasValue
		: status & ~Flag_HasValue
}

// endregion

// region HasError

export function isHasError(status: FuncCallStatus): boolean {
	return (status & Flag_HasError) !== 0
}

export function setHasError(status: FuncCallStatus, value: boolean): FuncCallStatus {
	return value
		? status | Flag_HasError
		: status & ~Flag_HasError
}

// endregion

// endregion

// region Methods

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

let currentState: TFuncCallState = null
let nextCallId = 1

export function getCurrentState() {
	return currentState
}

// endregion

// region helpers

// tslint:disable-next-line:no-empty
function emptyFunc() { }

export function invalidateParent<
	TState extends TFuncCallState,
	TSubscriber extends TFuncCallState,
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
		childState.updateInvalidate(status, false)
	}

	return next
}

// endregion

export type TFuncCallState = FuncCallState<any, any, any, any>
export class FuncCallState<
	TThisOuter,
	TArgs extends any[],
	TInnerResult,
	TThisInner
>
	implements IFuncCallState<TThisOuter, TArgs, TInnerResult, TThisInner>
{
	constructor(
		func: Func<TThisInner, TArgs, TInnerResult>,
		thisOuter: TThisOuter,
		callWithArgs: TCall<TArgs>,
		getThisInner: TGetThis<TThisOuter, TArgs, TInnerResult, TThisInner>,
		valueIds: number[],
	) {
		this.func = func
		this.thisOuter = thisOuter
		this.callWithArgs = callWithArgs
		this.getThisInner = getThisInner
		this.valueIds = valueIds
	}

	// region properties

	// region public

	private readonly func: Func<TThisInner, TArgs, TInnerResult>
	public readonly thisOuter: TThisOuter
	public readonly callWithArgs: TCall<TArgs>
	public readonly getThisInner: TGetThis<TThisOuter, TArgs, TInnerResult, TThisInner>
	public readonly valueIds: number[]
	public deleteOrder: number = 0

	public status: FuncCallStatus = Flag_Invalidated | Flag_Recalc
	public valueAsync: IThenable<TInnerValue<TInnerResult>> = null
	public value: TInnerValue<TInnerResult> = void 0
	public error: any = void 0
	// for detect recursive async loop
	public parentCallState: TFuncCallState = null
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

	// region private

	private internalError(message: string) {
		unsubscribeDependencies(this)
		const error = new InternalError(message)
		this.updateCalculatedError(error)
		throw error
	}
	
	private invalidateParents(
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
			this.internalError('statusBefore === 0 && statusAfter === 0')
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

	private updateCheck() {
		const prevStatus = this.status
	
		if ((prevStatus & Mask_Invalidate) === 0) {
			this.internalError(`Set status ${statusToString(Update_Check)} called when current status is ${statusToString(prevStatus)}`)
		}
	
		this.status = (prevStatus & ~(Mask_Invalidate | Flag_Recalc | Mask_Calculate)) | Flag_Check
	}
	
	private updateCheckAsync(
		valueAsync: IThenable<TInnerValue<TInnerResult>>,
	) {
		const prevStatus = this.status
	
		if (!isCheck(prevStatus)) {
			this.internalError(`Set status ${statusToString(Update_Check_Async)} called when current status is ${statusToString(prevStatus)}`)
		}
		this.valueAsync = valueAsync
	
		this.status = (prevStatus & ~Mask_Calculate) | Update_Check_Async
	}
	
	private updateCalculating() {
		const prevStatus = this.status
	
		if ((prevStatus & (Mask_Invalidate | Flag_Check)) === 0) {
			this.internalError(`Set status ${statusToString(Update_Calculating)} called when current status is ${statusToString(prevStatus)}`)
		}
	
		this.status = (prevStatus & ~(Mask_Invalidate | Flag_Recalc | Mask_Calculate)) | Flag_Calculating
	
		this._subscribersCalculating = this._subscribersLast
	}
	
	private updateCalculatingAsync(
		valueAsync: IThenable<TInnerValue<TInnerResult>>,
	) {
		const prevStatus = this.status
	
		if (!isCalculating(prevStatus)) {
			this.internalError(`Set status ${statusToString(Update_Calculating_Async)} called when current status is ${statusToString(prevStatus)}`)
		}
		this.valueAsync = valueAsync
	
		this.status = (prevStatus & ~Mask_Calculate) | Update_Calculating_Async
	}
	
	private updateCalculated() {
		const prevStatus = this.status
	
		if ((prevStatus & (Flag_Check | Flag_Calculating)) === 0) {
			this.internalError(`Set status ${statusToString(Update_Calculated_Value)} called when current status is ${statusToString(prevStatus)}`)
		}
	
		this.status = (prevStatus & (Flag_HasValue | Flag_HasError)) | Flag_Calculated
	
		this._subscribersCalculating = null
	
		const invalidateStatus = getInvalidate(prevStatus)
		if (invalidateStatus !== 0) {
			this.updateInvalidate(invalidateStatus, false)
		}
	}
	
	private updateCalculatedValue(
		value: TInnerValue<TInnerResult>,
	) {
		const prevStatus = this.status
	
		if ((prevStatus & (Flag_Check | Flag_Calculating)) === 0) {
			this.internalError(`Set status ${statusToString(Update_Calculated_Value)} called when current status is ${statusToString(prevStatus)}`)
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
			this.afterCalc(prevStatus, true)
		} else {
			this.afterCalc(prevStatus, false)
		}
	}
	
	private updateCalculatedError(
		error: any,
	) {
		const prevStatus = this.status
	
		if (error instanceof InternalError) {
			this.status = Update_Calculated_Error | (prevStatus & Flag_HasValue) | Flag_InternalError
			this.parentCallState = null
			currentState = null
		} else {
			if ((prevStatus & (Flag_Check | Flag_Calculating)) === 0) {
				this.internalError(`Set status ${statusToString(Update_Calculated_Error)} called when current status is ${statusToString(prevStatus)}`)
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
			this.afterCalc(prevStatus, true)
		} else {
			this.afterCalc(prevStatus, false)
		}
	}
	
	private afterCalc(
		prevStatus: FuncCallStatus,
		valueChanged: boolean,
	) {
		if ((prevStatus & Mask_Invalidate) !== 0) {
			this.updateInvalidate(Update_Invalidating, valueChanged)
			this.updateInvalidate(Update_Invalidated, valueChanged)
		} else if (valueChanged) {
			this.invalidateParents(Update_Recalc, Flag_None)
		}
	
		this._subscribersCalculating = null
	}

	private *checkDependenciesChangedAsync(
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
	
				if ((this.status & FuncCallStatus.Flag_Recalc) !== 0) {
					return true
				}
	
				if ((dependencyState.status & (Flag_Check | Flag_Calculating)) !== 0
					|| (dependencyState.status & (Flag_HasError | Flag_HasValue)) === 0
				) {
					this.internalError(`Unexpected dependency status: ${statusToString(dependencyState.status)}`)
				}
			}
		}
	
		this.updateCalculated()
		return false
	}
	
	private checkDependenciesChanged(): ThenableIterator<boolean> | boolean {
		const {_unsubscribers, _unsubscribersLength} = this
		if (_unsubscribers != null) {
			for (let i = 0, len = _unsubscribersLength; i < len; i++) {
				const dependencyState = _unsubscribers[i].state
				if (getInvalidate(dependencyState.status) !== 0) {
					dependencyState.getValue(true)
				}
	
				if ((dependencyState.status & Flag_Async) !== 0) {
					return this.checkDependenciesChangedAsync(i)
				}
	
				if ((this.status & FuncCallStatus.Flag_Recalc) !== 0) {
					return true
				}
	
				if ((dependencyState.status & (Flag_Check | Flag_Calculating)) !== 0
					|| (dependencyState.status & (Flag_HasError | Flag_HasValue)) === 0
				) {
					this.internalError(`Unexpected dependency status: ${statusToString(dependencyState.status)}`)
				}
			}
		}
	
		this.updateCalculated()
		return false
	}

	private calc(
		dontThrowOnError?: boolean,
	): TOuterResult<TInnerResult> {
		this.updateCalculating()
		this.callId = nextCallId++
	
		let _isIterator = false
		try {
			currentState = this
	
			// let value: any = this.func.apply(this.thisOuter, arguments)
			let value: any
				= this.callWithArgs(this.getThisInner(), this.func)
	
			if (!isIterator(value)) {
				if (isThenable(value)) {
					this.internalError('You should use iterator instead thenable for async functions')
				}
				this.updateCalculatedValue(value)
				return value
			}
	
			_isIterator = true
	
			value = resolveAsync(
				this.makeDependentIterator(value) as ThenableOrIteratorOrValue<TInnerResult>,
			)
	
			if (isThenable(value)) {
				this.updateCalculatingAsync(value)
			}
	
			return value
		} catch (error) {
			if (!_isIterator) {
				this.updateCalculatedError(error)
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
	
	private* makeDependentIterator(
		iterator: Iterator<TInnerValue<TInnerResult>>,
		nested?: boolean,
	): Iterator<TInnerValue<TInnerResult>> {
		currentState = this
	
		try {
			let iteration = iterator.next()
			while (!iteration.done) {
				let value: TIteratorOrValue<TInnerValue<TInnerResult>> = iteration.value
	
				if (isIterator(value)) {
					value = this.makeDependentIterator(value as Iterator<TInnerValue<TInnerResult>>, true)
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
				this.updateCalculatedValue(iteration.value)
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
				this.updateCalculatedError(error)
			}
			throw error
		}
	}

	// endregion

	// region public

	public updateInvalidate(
		status: Mask_Update_Invalidate,
		parentRecalc: boolean,
	): void {
		const prevStatus = this.status

		let statusBefore: Mask_Update_Invalidate | Flag_None = 0
		let statusAfter: Mask_Update_Invalidate | Flag_None = 0

		if (isRecalc(status) && (prevStatus & Flag_Calculating) === 0 && this._unsubscribersLength !== 0) {
			unsubscribeDependencies(this)
		}

		if (status === Update_Recalc) {
			if (isCalculated(prevStatus)) {
				this.internalError(`Set status ${statusToString(Update_Recalc)} called when current status is ${statusToString(prevStatus)}`)
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
				this.internalError(`Unknown status: ${statusToString(status)}`)
			}
		}

		if (statusBefore !== 0 || statusAfter !== 0) {
			this.invalidateParents(statusBefore, statusAfter)
		}
	}

	// tslint:disable-next-line:no-shadowed-variable
	public invalidate(): void {
		this.updateInvalidate(Update_Invalidating_Recalc, false)
		this.updateInvalidate(Update_Invalidated_Recalc, false)
	}

	// tslint:disable-next-line:no-shadowed-variable
	public subscribeDependency<TDependency extends TFuncCallState>(
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
			const subscriberLink = _subscribe(dependency, this)
			const _unsubscribers = this._unsubscribers
			if (_unsubscribers == null) {
				this._unsubscribers = [subscriberLink]
				this._unsubscribersLength = 1
			} else {
				_unsubscribers[this._unsubscribersLength++] = subscriberLink
			}
		}
	}

	public getValue(
		dontThrowOnError?: boolean,
	): TOuterResult<TInnerResult> {
		if (currentState != null && (currentState.status & Flag_Check) === 0) {
			currentState.subscribeDependency(this)
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
						this.internalError('Recursive async loop detected')
					}
					parentCallState = parentCallState.parentCallState
				}
				return this.valueAsync as any
			} else if ((this.status & (Flag_Check | Flag_Calculating)) !== 0) {
				this.internalError('Recursive sync loop detected')
			} else {
				this.internalError(`Unknown FuncCallStatus: ${statusToString(this.status)}`)
			}
		} else if (getInvalidate(this.status) !== 0) {
			// nothing
		} else {
			this.internalError(`Unknown FuncCallStatus: ${statusToString(this.status)}`)
		}

		this.parentCallState = currentState
		currentState = null

		this.updateCheck()

		let shouldRecalc: ThenableIterator<boolean> | boolean
		if (isRecalc(prevStatus)) {
			shouldRecalc = true
		} else {
			shouldRecalc = this.checkDependenciesChanged()
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
			value = this.calc(dontThrowOnError)
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
				return this.calc(dontThrowOnError)
			})

			if (isThenable(value)) {
				this.updateCheckAsync(value as any)
			}
		} else {
			this.internalError(`shouldRecalc == ${shouldRecalc}`)
		}

		return value
	}

	// endregion

	// endregion
}

// tslint:disable-next-line:no-shadowed-variable
export function createFuncCallState<TThisOuter,
	TArgs extends any[],
	TInnerResult,
	TThisInner>(
	func: Func<TThisInner, TArgs, TInnerResult>,
	thisOuter: TThisOuter,
	callWithArgs: TCall<TArgs>,
	getThisInner: TGetThis<TThisOuter, TArgs, TInnerResult, TThisInner>,
	valueIds: number[],
): IFuncCallState<TThisOuter, TArgs, TInnerResult, TThisInner> {
	return new FuncCallState(
		func,
		thisOuter,
		callWithArgs,
		getThisInner,
		valueIds,
	)
}
