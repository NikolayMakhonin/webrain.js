// import {Func, ICallState} from './contracts'
// import {createCallState} from './CallState'
// import {createCallWithArgs} from './helpers'
//
// export function isRefType(value): boolean {
// 	return value != null && (typeof value === 'object' || typeof value === 'function')
// }
//
// interface ISemiWeakMap<K, V> {
// 	map: Map<K, V>
// 	weakMap: WeakMap<K extends object ? K : never, V>
// }
//
// export function createSemiWeakMap<K, V>(): ISemiWeakMap<K, V> {
// 	return {
// 		map: null,
// 		weakMap: null,
// 	}
// }
//
// export function semiWeakMapGet<K, V>(semiWeakMap: ISemiWeakMap<K, V>, key: K): V {
// 	let value
// 	if (isRefType(key)) {
// 		const weakMap = semiWeakMap.weakMap
// 		if (weakMap != null) {
// 			value = weakMap.get(key as any)
// 		}
// 	} else {
// 		const map = semiWeakMap.map
// 		if (map != null) {
// 			value = map.get(key)
// 		}
// 	}
// 	return value == null ? null : value
// }
//
// export function semiWeakMapSet<K, V>(semiWeakMap: ISemiWeakMap<K, V>, key: K, value: V): void {
// 	if (isRefType(key)) {
// 		let weakMap = semiWeakMap.weakMap
// 		if (weakMap == null) {
// 			semiWeakMap.weakMap = weakMap = new WeakMap()
// 		}
// 		weakMap.set(key as any, value)
// 	} else {
// 		let map = semiWeakMap.map
// 		if (map == null) {
// 			semiWeakMap.map = map = new Map()
// 		}
// 		map.set(key, value)
// 	}
// }
//
// // tslint:disable-next-line:no-shadowed-variable
// export function _getCallState<TThisOuter,
// 	TArgs extends any[],
// 	TInnerResult>(
// 	func: Func<TThisOuter, TArgs, TInnerResult>,
// ): Func<TThisOuter, TArgs, ICallState<TThisOuter, TArgs, TInnerResult>> {
// 	const funcStateMap = new Map<number, any>()
// 	return function() {
// 		const argumentsLength = arguments.length
// 		let argsLengthStateMap: ISemiWeakMap<any, any> = funcStateMap.get(argumentsLength)
// 		if (argsLengthStateMap == null) {
// 			argsLengthStateMap = createSemiWeakMap()
// 			funcStateMap.set(argumentsLength, argsLengthStateMap)
// 		}
//
// 		let state: ICallState<TThisOuter, TArgs, TInnerResult>
// 		let currentMap: ISemiWeakMap<any, any> = semiWeakMapGet(argsLengthStateMap, this)
// 		if (argumentsLength !== 0) {
// 			if (currentMap == null) {
// 				currentMap = createSemiWeakMap()
// 				semiWeakMapSet(argsLengthStateMap, this, currentMap)
// 			}
//
// 			for (let i = 0; i < argumentsLength - 1; i++) {
// 				const arg = arguments[i]
// 				let nextStateMap: ISemiWeakMap<any, any> = semiWeakMapGet(currentMap, arg)
// 				if (nextStateMap == null) {
// 					nextStateMap = createSemiWeakMap()
// 					semiWeakMapSet(currentMap, arg, nextStateMap)
// 				}
// 				currentMap = nextStateMap
// 			}
//
// 			const lastArg = arguments[argumentsLength - 1]
// 			state = semiWeakMapGet(currentMap, lastArg)
// 			if (state == null) {
// 				state = createCallState<TThisOuter, TArgs, TInnerResult>(
// 					func,
// 					this,
// 					createCallWithArgs.apply(null, arguments),
// 				)
// 				semiWeakMapSet(currentMap, lastArg, state)
// 			}
// 		} else {
// 			state = semiWeakMapGet(argsLengthStateMap, this)
// 			if (state == null) {
// 				state = createCallState<TThisOuter, TArgs, TInnerResult>(
// 					func,
// 					this,
// 					createCallWithArgs.apply(null, arguments),
// 				)
// 				semiWeakMapSet(argsLengthStateMap, this, state)
// 			}
// 		}
//
// 		return state
// 	}
// }
