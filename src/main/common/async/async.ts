import {equals, isIterator} from '../helpers/helpers'
import {TCallStateAny} from '../rx/depend/core/CallState'
import {getCurrentState, setCurrentState} from '../rx/depend/core/current-state'

export type ThenableOrValue<T> = T | Thenable<T>

export type ThenableOrIterator<T> = ThenableIterator<T> | ThenableOrIteratorOrValueNested<T>

export type IteratorOrValue<T> = ThenableIterator<T> | T

export type ThenableOrIteratorOrValue<T> = T | ThenableOrIterator<T>

export type AsyncValueOf<T> = T extends ThenableOrIterator<infer V>	? V : T

export type ThenableOrIteratorOrValueNested<T>
	= IThenableOrIteratorOrValueNested<T> | IPromiseLikeOrIteratorOrValueNested<T>

// tslint:disable-next-line:class-name
export interface IThenableOrIteratorOrValueNested<T> extends IThenable<ThenableOrIteratorOrValue<T>>
{}

// tslint:disable-next-line:class-name
export interface IPromiseLikeOrIteratorOrValueNested<T> extends PromiseLike<ThenableOrIteratorOrValue<T>>
{}

export interface ThenableIterator<T> extends Iterator<any, ThenableOrIteratorOrValue<T>>
{}

export type TResolve<TValue> = (value?: ThenableOrIteratorOrValue<TValue>) => void
export type TReject = (error?: any) => void

export type TResolveAsyncValue<TValue = any, TResult = any> = (value: TValue) => ThenableOrIteratorOrValue<TResult>

export type TOnFulfilled<TValue = any, TResult = any>
	= (value: TValue) => ThenableOrIteratorOrValue<TResult>

export type TOnRejected<TResult = any>
	= (error: any) => ThenableOrIteratorOrValue<TResult>

// tslint:disable-next-line:class-name
export interface IThenable<T = any> extends PromiseLike<T> {
	then<TResult1 = T, TResult2 = never>(
		onfulfilled?: TOnFulfilled<T, TResult1>,
		onrejected?: TOnRejected<TResult2>,
	): Thenable<TResult1 | TResult2>,
	then<TResult1 = T, TResult2 = never>(
		onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
		onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
	): PromiseLike<TResult1 | TResult2>
}

export type Thenable<T = any> = IThenable<T> | PromiseLike<T>

export function isThenable(value: any): boolean {
	return value != null
		&& typeof value === 'object'
		&& typeof value.then === 'function'
}

export function isAsync(value: any): boolean {
	return isThenable(value) || isIterator(value)
}

export enum ResolveResult {
	None = 0,
	Immediate = 1,
	Deferred = 2,
	Error = 4,

	ImmediateError = Immediate | Error,
	DeferredError = Deferred | Error,
}

function resolveIterator<T>(
	iterator: ThenableIterator<T>,
	isError: boolean,
	onImmediate: (value: ThenableOrIteratorOrValue<T>, isError: boolean) => void,
	onDeferred: (value: ThenableOrIteratorOrValue<T>, isError: boolean) => void,
	customResolveValue: TResolveAsyncValue<T>,
): ResolveResult {
	if (!isIterator(iterator)) {
		return ResolveResult.None
	}

	function iterate(
		nextValue: any,
		isThrow: boolean,
		nextOnImmediate: (value: ThenableOrIteratorOrValue<T>, isError: boolean) => void,
		nextOnDeferred: (value: ThenableOrIteratorOrValue<T>, isError: boolean) => void,
	): ResolveResult {
		let _onImmediate: (value: T, isError: boolean) => void
		let _onDeferred: (value: T, isError: boolean) => void

		try {
			while (true) {
				let iteratorResult: IteratorResult<ThenableOrIteratorOrValue<T>>

				if (isThrow) {
					isThrow = false
					iteratorResult = iterator.throw(nextValue)
				} else {
					iteratorResult = iterator.next(nextValue)
				}

				if (iteratorResult.done) {
					nextOnImmediate(iteratorResult.value, isError)
					return isError ? ResolveResult.ImmediateError : ResolveResult.Immediate
				}

				if (_onImmediate == null) {
					_onImmediate = (o, nextIsError) => {
						nextValue = o
						isThrow = nextIsError
					}
				}

				if (_onDeferred == null) {
					_onDeferred = (o, nextIsError) => {
						iterate(o, nextIsError, nextOnDeferred, nextOnDeferred)
					}
				}

				const result = _resolveValue(
					iteratorResult.value,
					false,
					_onImmediate,
					_onDeferred,
					customResolveValue,
				)

				if ((result & ResolveResult.Deferred) !== 0) {
					return result
				}
			}
		} catch (err) {
			nextOnImmediate(err, true)
			return ResolveResult.ImmediateError
		}
	}

	return iterate(void 0, false, onImmediate, onDeferred)
}

function resolveThenable<T>(
	thenable: ThenableOrIteratorOrValueNested<T>,
	isError: boolean,
	onImmediate: (value: ThenableOrIteratorOrValue<T>, isError: boolean) => void,
	onDeferred: (value: ThenableOrIteratorOrValue<T>, isError: boolean) => void,
): ResolveResult {
	if (!isThenable(thenable)) {
		return ResolveResult.None
	}

	let result = isError ? ResolveResult.DeferredError : ResolveResult.Deferred
	let deferred

	const _onfulfilled: TOnFulfilled<T, void> = value => {
		if (deferred) {
			onDeferred(value, isError)
		} else {
			result = isError ? ResolveResult.ImmediateError : ResolveResult.Immediate
			onImmediate(value, isError)
		}
	}

	const _onrejected: TOnRejected = err => {
		if (deferred) {
			onDeferred(err, true)
		} else {
			result = ResolveResult.ImmediateError
			onImmediate(err, true)
		}
	}

	if ((thenable as any).thenLast != null) {
		(thenable as any).thenLast(_onfulfilled, _onrejected)
	} else {
		thenable.then(_onfulfilled, _onrejected)
	}

	deferred = true

	return result
}

function _resolveValue<T>(
	value: ThenableOrIteratorOrValue<T>,
	isError: boolean,
	onImmediate: (value: T, isError: boolean) => void,
	onDeferred: (value: T, isError: boolean) => void,
	customResolveValue: TResolveAsyncValue<T>,
	callState?: TCallStateAny,
): ResolveResult {
	const prevCallState = getCurrentState()
	if (callState == null) {
		callState = prevCallState
	} else {
		setCurrentState(callState)
	}

	try {
		const nextOnImmediate = (o, nextIsError) => {
			if (nextIsError) {
				isError = true
			}
			value = o
		}

		const nextOnDeferred = (val, nextIsError) => {
			_resolveValue(
				val,
				isError || nextIsError,
				onDeferred,
				onDeferred,
				customResolveValue,
				callState,
			)
		}

		let iterations = 0
		while (true) {
			iterations++
			if (iterations > 1000) {
				throw new Error('_resolveAsync infinity loop')
			}

			{
				const result = resolveThenable(
					value as ThenableOrIteratorOrValueNested<T>,
					isError,
					nextOnImmediate,
					nextOnDeferred,
				)

				if ((result & ResolveResult.Deferred) !== 0) {
					return result
				}
				if ((result & ResolveResult.Immediate) !== 0) {
					continue
				}
			}

			{
				const result = resolveIterator(
					value as ThenableIterator<T>,
					isError,
					nextOnImmediate,
					nextOnDeferred,
					customResolveValue,
				)

				if ((result & ResolveResult.Deferred) !== 0) {
					return result
				}
				if ((result & ResolveResult.Immediate) !== 0) {
					continue
				}
			}

			if (value != null && customResolveValue != null) {
				const newValue = customResolveValue(value as T)
				if (!equals(newValue, value)) {
					value = newValue
					continue
				}
			}

			onImmediate(value as T, isError)

			return isError ? ResolveResult.ImmediateError : ResolveResult.Immediate
		}
	} finally {
		setCurrentState(prevCallState)
	}
}

export function resolveValue<T>(
	value: ThenableOrIteratorOrValue<T>,
	onImmediate: (value: T, isError: boolean) => void,
	onDeferred: (value: T, isError: boolean) => void,
	customResolveValue?: TResolveAsyncValue<T>,
): ResolveResult {
	return _resolveValue(
		value,
		false,
		onImmediate,
		onDeferred,
		customResolveValue,
	)
}

export function resolveValueFunc<T>(
	func: () => ThenableOrIteratorOrValue<T>,
	onImmediate: (value: T, isError: boolean) => void,
	onDeferred: (value: T, isError: boolean) => void,
	customResolveValue: TResolveAsyncValue<T>,
): ResolveResult {
	try {
		return resolveValue(func(), onImmediate, onDeferred, customResolveValue)
	} catch (err) {
		onImmediate(err, true)
		return ResolveResult.ImmediateError
	}
}
