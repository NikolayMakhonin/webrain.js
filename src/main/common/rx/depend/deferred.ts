import {ThenableOrIterator, ThenableOrValue, TReject, TResolve} from '../../async/async'
import {ThenableSync} from '../../async/ThenableSync'
import {TCallStateX} from './CallState'
import {Func, TGetThis} from './contracts'
import {dependX, makeDependentFunc} from './depend'

type TFuncWrapperAsync<TResultInner> = (
	resolve: TResolve<TResultInner>,
	reject: TReject,
) => void

function deferredWrapper<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	TResultWrapper = TResultInner,
>(func: Func<TThisOuter, TArgs, TResultInner>)
: Func<TThisOuter, TArgs, TResultWrapper>
{
	return function _deferredWrapper() {
		return {
			next: () => new ThenableSync((resolve, reject) => {
				setTimeout(() => {
					try {
						resolve(func.apply(this, arguments))
					} catch (err) {
						reject(err)
					}
				})
			}),
		} as any
	}
}

// region deferred / deferredX

/** Inner this same as outer this */
export function deferred<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	TResultWrapper = TResultInner,
>(
	func: Func<TThisOuter, TArgs, TResultInner>,
	funcWrapper?: (func: Func<TThisOuter, TArgs, TResultInner>)
		=> Func<TThisOuter, TArgs, TResultWrapper>,
) {
	return makeDependentFunc(func, false, funcWrapper)
}

/** Inner this as CallState */
export function deferredX<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	TResultWrapper = TResultInner,
>(
	func: Func<TCallStateX<TThisOuter, TArgs, TResultInner>, TArgs, TResultInner>,
	funcWrapper?: (func: Func<TCallStateX<TThisOuter, TArgs, TResultInner>, TArgs, TResultInner>)
		=> Func<TCallStateX<TThisOuter, TArgs, TResultInner>, TArgs, TResultWrapper>,
) {
	return makeDependentFunc(func, true, funcWrapper)
}

// endregion

export function makeDeferredFunc<
	TThisOuter,
	TArgs extends any[],
	TResultInner
>(
	calc: (
		resolve: TResolve<TResultInner>,
		reject: TReject,
	) => void,
)
: TResultInner extends Iterator<infer V> ? ThenableOrValue<V> : ThenableOrValue<TResultInner>
{
	return dependX<
		TThisOuter,
		TArgs,
		TResultInner extends Iterator<infer V> ? TResultInner : Iterator<TResultInner>
	>(function() {
		return {
			next: () => new ThenableSync(calc),
		} as any
	}) as any
}

export function makeDeferredFunc<
	TThisOuter,
	TArgs extends any[],
	TResultInner
>(
	func: Func<TCallStateX<TThisOuter, TArgs, TResultInner>, TArgs, TResultInner>,
	calc: (
		func: Func<TCallStateX<TThisOuter, TArgs, TResultInner>, TArgs, TResultInner>,
		resolve: TResolve<TResultInner>,
		reject: TReject,
	) => void,
)
: TResultInner extends Iterator<infer V> ? ThenableOrValue<V> : ThenableOrValue<TResultInner>
{
	return dependX<
		TThisOuter,
		TArgs,
		TResultInner extends Iterator<infer V> ? TResultInner : Iterator<TResultInner>
	>(function() {
		return {
			next: () => new ThenableSync((resolve, reject) => {
				setTimeout(() => {
					try {
						resolve(func.apply(this, arguments))
					} catch (err) {
						reject(err)
					}
				})
			}),
		} as any
	}) as any
}

export function makeDeferredFunc<
	TThisOuter,
	TArgs extends any[],
	TResultInner
>(
	func: Func<TCallStateX<TThisOuter, TArgs, TResultInner>, TArgs, TResultInner>,
	calc: (
		func: Func<TCallStateX<TThisOuter, TArgs, TResultInner>, TArgs, TResultInner>,
		resolve: TResolve<TResultInner>,
		reject: TReject,
	) => void,
)
: TResultInner extends Iterator<infer V> ? ThenableOrValue<V> : ThenableOrValue<TResultInner> {

}

// const x = {
// 	y: 0,
// 	z: makeDeferredFunc(function(this: { x: this}) {
// 		const r = this
// 	}),
// }
//
// x.z()
