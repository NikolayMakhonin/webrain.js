import {isIterator} from '../helpers/helpers'

export type ThenableOrValue<T> = T|Thenable<T>

export type ThenableOrIteratorOrValue<T> = T | ThenableIterator<T> | ThenableOrIteratorOrValueNested<T>

export interface ThenableOrIteratorOrValueNested<T> extends Thenable<ThenableOrIteratorOrValue<T>>
{}

export interface ThenableIterator<T> extends Iterator<ThenableOrIteratorOrValue<T|any>>
{}

export type TOnFulfilled<TValue = any, TResult = any>
	= (value: TValue) => ThenableOrIteratorOrValue<TResult>

export type TOnRejected<TResult = any>
	= (error: any) => ThenableOrIteratorOrValue<TResult>

export type TResolve<TValue> = (value?: ThenableOrIteratorOrValue<TValue>) => void
export type TReject = (error?: any) => void

export interface Thenable<T> {
	then<TResult1 = T, TResult2 = never>(
		onfulfilled?: TOnFulfilled<T, TResult1>,
		onrejected?: TOnRejected<TResult2>,
	): Thenable<TResult1 | TResult2>
}

export function isThenable(value: any): boolean {
	return value != null && typeof value.then === 'function'
}

export enum ResolveResult {
	None = 0,
	Immediate = 1,
	Deferred = 2,
	Error = 4,

	ImmediateError = Immediate | Error,
	DeferredError = Deferred | Error,
}

export function resolveIterator<T>(
	iterator: ThenableIterator<T>,
	isError: boolean,
	onImmediate: (value: ThenableOrIteratorOrValue<T>, isError: boolean) => void,
	onDeferred: (value: ThenableOrIteratorOrValue<T>, isError: boolean) => void,
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
		const body = () => {
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

				const result = _resolveValue(
					iteratorResult.value,
					isError,
					(o, nextIsError) => {
						nextValue = o
						isThrow = nextIsError
					},
					(o, nextIsError) => {
						iterate(o, nextIsError, nextOnDeferred, nextOnDeferred)
					},
				)

				if ((result & ResolveResult.Deferred) !== 0) {
					return result
				}
			}
		}

		try {
			return body()
		} catch (err) {
			nextOnImmediate(err, true)
			return ResolveResult.ImmediateError
		}
	}

	return iterate(void 0, false, onImmediate, onDeferred)
}

export function resolveThenable<T>(
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

	((thenable as any).thenLast || thenable.then).call(thenable, value => {
		if (deferred) {
			onDeferred(value, isError)
		} else {
			result = isError ? ResolveResult.ImmediateError : ResolveResult.Immediate
			onImmediate(value, isError)
		}
	}, err => {
		if (deferred) {
			onDeferred(err, true)
		} else {
			result = ResolveResult.ImmediateError
			onImmediate(err, true)
		}
	})

	deferred = true

	return result
}

function _resolveValue<T>(
	value: ThenableOrIteratorOrValue<T>,
	isError: boolean,
	onImmediate: (value: T, isError: boolean) => void,
	onDeferred: (value: T, isError: boolean) => void,
): ResolveResult {
	const nextOnImmediate = (o, nextIsError) => {
		if (nextIsError) {
			isError = true
		}
		value = o
	}
	const nextOnDeferred = (val, nextIsError) => {
		_resolveValue(val, isError || nextIsError, onDeferred, onDeferred)
	}

	while (true) {
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
			)

			if ((result & ResolveResult.Deferred) !== 0) {
				return result
			}
			if ((result & ResolveResult.Immediate) !== 0) {
				continue
			}
		}

		onImmediate(value as T, isError)
		return isError ? ResolveResult.ImmediateError : ResolveResult.Immediate
	}
}

export function resolveValue<T>(
	value: ThenableOrIteratorOrValue<T>,
	onImmediate: (value: T, isError: boolean) => void,
	onDeferred: (value: T, isError: boolean) => void,
): ResolveResult {
	return _resolveValue(
		value,
		false,
		onImmediate,
		onDeferred,
	)
}

export function resolveValueFunc<T>(
	func: () => ThenableOrIteratorOrValue<T>,
	onImmediate: (value: T, isError: boolean) => void,
	onDeferred: (value: T, isError: boolean) => void,
): ResolveResult {
	try {
		return resolveValue(func(), onImmediate, onDeferred)
	} catch (err) {
		onImmediate(err, true)
		return ResolveResult.ImmediateError
	}
}
