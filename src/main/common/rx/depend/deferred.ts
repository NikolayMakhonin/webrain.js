import {ThenableOrIterator, ThenableOrValue, TReject, TResolve} from '../../async/async'
import {ThenableSync} from '../../async/ThenableSync'
import {CallState} from './CallState'
import {Func} from './contracts'
import { makeDependentFunc} from './depend'

// region deferred / deferredX

function funcCallDeferred<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(this: CallState<TThisOuter, TArgs, TResultInner>) {
	return {
		next: () => new ThenableSync((resolve, reject) => {
			setTimeout(() => {
				try {
					resolve(this.callWithArgs(this.thisOuter, this.func))
				} catch (err) {
					reject(err)
				}
			})
		}),
	} as any
}

/** Inner this same as outer this */
export function deferred<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	TResultWrapper = TResultInner,
>(
	func: Func<TThisOuter, TArgs, TResultInner>,
): Func<
	TThisOuter,
	TArgs,
	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : ThenableOrValue<TResultInner>
> {
	return makeDependentFunc(func, funcCallDeferred) as any
}

function funcCallDeferredX<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(this: CallState<TThisOuter, TArgs, TResultInner>) {
	return {
		next: () => new ThenableSync((resolve, reject) => {
			setTimeout(() => {
				try {
					resolve(this.callWithArgs(this, this.func))
				} catch (err) {
					reject(err)
				}
			})
		}),
	} as any
}

/** Inner this as CallState */
export function deferredX<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(
	func: Func<
		CallState<TThisOuter, TArgs, TResultInner>,
		TArgs,
		TResultInner
	>,
): Func<
	TThisOuter,
	TArgs,
	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : ThenableOrValue<TResultInner>
> {
	return makeDependentFunc(func, funcCallDeferredX) as any
}

// endregion
