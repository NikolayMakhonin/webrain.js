import {_createDependentFunc, createFuncCallState, IFuncCallState} from './_createDependentFunc'
import {Func} from './contracts'

export const {
	_getFuncCallState,
} = (function() {
	function isRefType(value): boolean {
		return value != null && (typeof value === 'object' || typeof value === 'function')
	}

	interface ISemiWeakMap<K, V> {
		map: Map<K, V>
		weakMap: WeakMap<K extends object ? K : never, V>
	}

	function createSemiWeakMap<K, V>(): ISemiWeakMap<K, V> {
		return {
			map: null,
			weakMap: null,
		}
	}

	function semiWeakMapGet<K, V>(semiWeakMap: ISemiWeakMap<K, V>, key: K): V {
		let value
		if (isRefType(key)) {
			const weakMap = semiWeakMap.weakMap
			if (weakMap) {
				value = weakMap.get(key as any)
			}
		} else {
			const map = semiWeakMap.map
			if (map) {
				value = map.get(key)
			}
		}
		return value == null ? null : value
	}

	function semiWeakMapSet<K, V>(semiWeakMap: ISemiWeakMap<K, V>, key: K, value: V): void {
		if (isRefType(key)) {
			let weakMap = semiWeakMap.weakMap
			if (!weakMap) {
				semiWeakMap.weakMap = weakMap = new WeakMap()
			}
			weakMap.set(key as any, value)
		} else {
			let map = semiWeakMap.map
			if (!map) {
				semiWeakMap.map = map = new Map()
			}
			map.set(key, value)
		}
	}

	// tslint:disable-next-line:no-shadowed-variable
	function _getFuncCallState<TThis,
		TArgs extends any[],
		TValue>(
		func: Func<TThis, TArgs, TValue>,
		funcStateMap: Map<number, any>,
	): Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>> {
		return function() {
			const argumentsLength = arguments.length
			let argsLengthStateMap: ISemiWeakMap<any, any> = funcStateMap.get(argumentsLength)
			if (!argsLengthStateMap) {
				argsLengthStateMap = createSemiWeakMap()
				funcStateMap.set(argumentsLength, argsLengthStateMap)
			}

			let state: IFuncCallState<TThis, TArgs, TValue>
			if (argumentsLength) {
				let argsStateMap: ISemiWeakMap<any, any> = semiWeakMapGet(argsLengthStateMap, this)
				if (!argsStateMap) {
					argsStateMap = createSemiWeakMap()
					semiWeakMapSet(argsLengthStateMap, this, argsStateMap)
				}

				for (let i = 0; i < argumentsLength - 1; i++) {
					const arg = arguments[i]
					let nextStateMap: ISemiWeakMap<any, any> = semiWeakMapGet(argsStateMap, arg)
					if (!nextStateMap) {
						nextStateMap = createSemiWeakMap()
						semiWeakMapSet(argsStateMap, arg, nextStateMap)
					}
					argsStateMap = nextStateMap
				}

				const lastArg = arguments[argumentsLength - 1]
				state = semiWeakMapGet(argsStateMap, lastArg)
				if (!state) {
					state = createFuncCallState<TThis, TArgs, TValue>(func, this, _createDependentFunc.apply(void 0, arguments))
					semiWeakMapSet(argsStateMap, lastArg, state)
				}
			} else {
				state = semiWeakMapGet(argsLengthStateMap, this)
				if (!state) {
					state = createFuncCallState<TThis, TArgs, TValue>(func, this, _createDependentFunc.apply(void 0, arguments))
					semiWeakMapSet(argsLengthStateMap, this, state)
				}
			}

			return state
		}
	}

	return {
		_getFuncCallState,
	}
})()
