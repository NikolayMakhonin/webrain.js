import {isIterable} from '../../../../../src/main/common/helpers/helpers'

export type TThen<TValue> = (resolve: TResolve<TValue>) => void
export type TThenAny = TThen<any>

const THEN_FUNC_TAG = Math.random().toString(36)

export function isThenFunc<T>(func: TThen<T>): boolean {
	return Object.prototype.hasOwnProperty.call(func, THEN_FUNC_TAG)
}

export function toThenFunc<T>(func: TThen<T>): TThen<T> {
	if (!isThenFunc(func)) {
		Object.defineProperty(func, THEN_FUNC_TAG, {
			configurable: true,
			enumerable: false,
			writable: false,
			value: true,
		})
	}

	return func
}

export function resolveThenableIterator<TValue>(
	iteratorOrValue: TValue|Iterator<TValue|TThenAny>,
): TValue|TThenAny {
	if (!isIterable(iteratorOrValue)) {
		return iteratorOrValue as TValue
	}

	let resolveValueQueue

	const resolveValue = (value: TValue) => {
		if (resolveValueQueue) {
			for (let i = 0, len = resolveValueQueue.length; i < len; i++) {
				resolveValueQueue[i](value)
			}
		}

		return value
	}

	const thenValueFunc = (resolve: (value: TValue) => void): void => {
		if (!resolveValueQueue) {
			resolveValueQueue = []
		}
		resolveValueQueue.push(resolve)
	}

	const resolveIterator = (
		iteration: IteratorResult<TValue|TThenAny>,
	): TValue|TThenAny => {
		if (iteration.done) {
			return resolveValue(iteration.value as TValue)
		}

		(iteration.value as TThenAny)(o => {
			resolveIterator((iteratorOrValue as Iterator<TValue|TThenAny>).next(o))
		})

		return thenValueFunc
	}

	return resolveIterator((iteratorOrValue as Iterator<TValue|TThenAny>).next())
}
