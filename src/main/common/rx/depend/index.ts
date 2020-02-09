import {createGetFuncCallState} from './createGetFuncCallState'
import {createMakeDependentFunc, TRootStateMap} from './createMakeDependentFunc'

const rootStateMap: TRootStateMap = new WeakMap()

export const getFuncCallState = createGetFuncCallState(rootStateMap)
export const makeDependentFunc = createMakeDependentFunc(rootStateMap)
