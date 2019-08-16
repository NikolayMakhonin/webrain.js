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

export function resolveIterator<T>(
	iterator: ThenableIterator<T>,
	onImmediate: (value: ThenableOrIteratorOrValue<T>) => void,
	onDeferred: (value: ThenableOrIteratorOrValue<T>) => void,
	reject: TReject,
): boolean {
	if (!isIterator(iterator)) {
		return null
	}

	function iterate(
		nextValue: any,
		nextOnImmediate: (value: ThenableOrIteratorOrValue<T>) => void,
		nextOnDeferred: (value: ThenableOrIteratorOrValue<T>) => void,
	): boolean|null {
		while (true) {
			const iteratorResult = iterator.next(nextValue) as IteratorResult<ThenableOrIteratorOrValue<T>>

			if (iteratorResult.done) {
				nextOnImmediate(iteratorResult.value)
				return false
			}

			if (resolveValue(
				iteratorResult.value,
				o => { nextValue = o },
				o => iterate(o, nextOnDeferred, nextOnDeferred),
				reject,
			)) {
				return true
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
): boolean|null {
	if (!isThenable(thenable)) {
		return null
	}

	let resolved
	let immediate = true;

	((thenable as any).thenLast || thenable.then).call(thenable, value => {
		if (immediate) {
			resolved = true
			onImmediate(value)
		} else {
			onDeferred(value)
		}
	}, err => {
		reject(err)
	})

	immediate = false
	if (resolved) {
		return false
	}

	return true
}

export function resolveValue<T>(
	value: ThenableOrIteratorOrValue<T>,
	onImmediate: (value: T) => void,
	onDeferred: (value: T) => void,
	reject: TReject,
): boolean {
	while (true) {
		const nextOnImmediate = o => { value = o }
		const nextOnDeferred = val => { resolveValue(val, onDeferred, onDeferred, reject) }

		switch (resolveThenable(
			value as ThenableOrIteratorOrValueNested<T>,
			nextOnImmediate,
			nextOnDeferred,
			reject,
		)) {
			case true:
				return true
			case false:
				continue
		}

		switch (resolveIterator(
			value as ThenableIterator<T>,
			nextOnImmediate,
			nextOnDeferred,
			reject,
		)) {
			case true:
				return true
			case false:
				continue
		}

		onImmediate(value as T)
		return false
	}
}
