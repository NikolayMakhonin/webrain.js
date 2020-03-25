import {ThenableSync} from '../../async/ThenableSync'
import {Func, TCall} from './contracts'

export function createCallWithArgs<TArgs extends any[]>(...args: TArgs): TCall<TArgs>
export function createCallWithArgs<TArgs extends any[]>(): TCall<TArgs> {
	const args = arguments
	return function(_this, func) {
		return func.apply(_this, args)
	}
}

export class InternalError extends Error {

}

// function makeDeferredFunc<
// 	TThisOuter,
// 	TArgs extends any[],
// 	TInnerResult,
// >(
// 	this: TThisOuter,
// 	func: Func<TThisOuter, TArgs, TInnerResult | Iterator<TInnerResult>>,
// ): Func<TThisOuter, TArgs, Iterator<TInnerResult>> {
// 	return function() {
// 		return {
// 			next: () => new ThenableSync((resolve, reject) => {
// 				setTimeout(() => {
// 					try {
// 						resolve(func.apply(this, arguments))
// 					} catch (err) {
// 						reject(err)
// 					}
// 				})
// 			}),
// 		}
// 	}
// }
//
// const x = {
// 	y: 0,
// 	z: makeDeferredFunc(function(this: { x: this}) {
// 		const r = this
// 	}),
// }
//
// x.z()
