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
	None,
	ImmediateResolved,
	ImmediateRejected,
	Deferred,
}

export function tryCatch<T>(func: () => T|void, onValue: (value: T) => void, onError: (error) => void): boolean {
	let value
	try {
		value = func()
	} catch (err) {
		onError(err)
		return true
	}

	if (onValue) {
		onValue(value)
	}
	return false
}

export function resolveIterator<T>(
	iterator: ThenableIterator<T>,
	onImmediate: (value: ThenableOrIteratorOrValue<T>) => void,
	onDeferred: (value: ThenableOrIteratorOrValue<T>) => void,
	reject: TReject,
): ResolveResult {
	if (!isIterator(iterator)) {
		return ResolveResult.None
	}

	function iterate(
		nextValue: any,
		nextOnImmediate: (value: ThenableOrIteratorOrValue<T>) => void,
		nextOnDeferred: (value: ThenableOrIteratorOrValue<T>) => void,
	): ResolveResult {
		while (true) {
			let iteratorResult
			if (tryCatch(() => {
					iteratorResult = iterator.next(nextValue) as IteratorResult<ThenableOrIteratorOrValue<T>>
				},
				null,
				reject,
			)) {
				return ResolveResult.ImmediateRejected
			}

			if (iteratorResult.done) {
				nextOnImmediate(iteratorResult.value)
				return ResolveResult.ImmediateResolved
			}

			switch (_resolveValue(
				iteratorResult.value,
				o => { nextValue = o },
				o => iterate(o, nextOnDeferred, nextOnDeferred),
				reject,
			)) {
				case ResolveResult.Deferred:
					return ResolveResult.Deferred
				case ResolveResult.ImmediateRejected:
					return ResolveResult.ImmediateRejected
			}
		}
	}

	return iterate(void 0, onImmediate, onDeferred)
}

export function resolveThenable<T>(
	thenable: ThenableOrIteratorOrValueNested<T>,
	onImmediate: (value: ThenableOrIteratorOrValue<T>) => void,
	onDeferred: (value: ThenableOrIteratorOrValue<T>) => void,
	reject: TReject,
): ResolveResult {
	if (!isThenable(thenable)) {
		return ResolveResult.None
	}

	let result = ResolveResult.Deferred
	let immediate = true;

	((thenable as any).thenLast || thenable.then).call(thenable, value => {
		if (immediate) {
			result = ResolveResult.ImmediateResolved
			onImmediate(value)
		} else {
			onDeferred(value)
		}
	}, err => {
		if (immediate) {
			result = ResolveResult.ImmediateRejected
		}
		reject(err)
	})

	immediate = false

	return result
}

function _resolveValue<T>(
	value: ThenableOrIteratorOrValue<T>,
	onImmediate: (value: T) => void,
	onDeferred: (value: T) => void,
	reject: TReject,
): ResolveResult {
	while (true) {
		const nextOnImmediate = o => { value = o }
		const nextOnDeferred = val => { _resolveValue(val, onDeferred, onDeferred, reject) }

		switch (resolveThenable(
			value as ThenableOrIteratorOrValueNested<T>,
			nextOnImmediate,
			nextOnDeferred,
			reject,
		)) {
			case ResolveResult.Deferred:
				return ResolveResult.Deferred
			case ResolveResult.ImmediateRejected:
				return ResolveResult.ImmediateRejected
			case ResolveResult.ImmediateResolved:
				continue
		}

		switch (resolveIterator(
			value as ThenableIterator<T>,
			nextOnImmediate,
			nextOnDeferred,
			reject,
		)) {
			case ResolveResult.Deferred:
				return ResolveResult.Deferred
			case ResolveResult.ImmediateRejected:
				return ResolveResult.ImmediateRejected
			case ResolveResult.ImmediateResolved:
				continue
		}

		onImmediate(value as T)
		return ResolveResult.ImmediateResolved
	}
}

export function resolveValue<T>(
	value: ThenableOrIteratorOrValue<T>,
	onImmediate: (value: T) => void,
	onDeferred: (value: T) => void,
	reject: TReject,
): ResolveResult {
	let result
	if (tryCatch(
		() => { result = _resolveValue(value, onImmediate, onDeferred, reject) },
		null,
		err => {
			const onResult = o => {
				try {
					reject(o)
				} catch {
					throw o
				}
			}
			_resolveValue(err, onResult, onResult, onResult)
		},
	)) {
		return ResolveResult.ImmediateRejected
	}

	return result
}
