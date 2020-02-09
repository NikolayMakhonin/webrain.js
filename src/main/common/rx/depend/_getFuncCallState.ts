import {_createDependentFunc} from './_createDependentFunc'
import {Func, IFuncCallState} from './contracts'
import {createFuncCallState} from './createFuncCallState'
import {createSemiWeakMap, ISemiWeakMap} from './semi-weak-map/create'
import {semiWeakMapGet} from './semi-weak-map/get'
import {semiWeakMapSet} from './semi-weak-map/set'

export function _getFuncCallState<TThis,
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
