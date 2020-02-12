import {isThenable, ThenableOrIteratorOrValue, ThenableOrValue} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {isIterator} from '../../helpers/helpers'
import {Func, FuncCallStatus, IFuncCallState, ILinkItem, ISubscriberLink} from './contracts'

// invalidate,
// getFuncCallState,
// makeDependentFunc,

// region subscriberLinkPool

export class SubscriberLinkPool {
	public size = 0
	public maxSize = 1000000
	public stack = []
}

export const subscriberLinkPool = new SubscriberLinkPool()
export let poolFirst: ISubscriberLink<any, any, any>
export let poolLast: ISubscriberLink<any, any, any>

export function getSubscriberLinkFromPool<TThis,
	TArgs extends any[],
	TValue,
	>(): ISubscriberLink<TThis, TArgs, TValue> {
	// Pool as Linked List
	// const result = poolLast
	// if (result != null) {
	// 	const {prev} = result
	// 	if (prev == null) {
	// 		poolFirst = null
	// 		poolLast = null
	// 	} else {
	// 		prev.next = null
	// 		poolLast = prev
	// 	}
	// }
	// return result

	// Pool as Array
	// this.usedSize++
	const lastIndex = subscriberLinkPool.size - 1
	if (lastIndex >= 0) {
		const obj = subscriberLinkPool.stack[lastIndex]
		subscriberLinkPool.stack[lastIndex] = null
		subscriberLinkPool.size = lastIndex
		if (obj == null) {
			throw new Error('obj == null')
		}
		return obj
	}
	return null
}

// tslint:disable-next-line:no-shadowed-variable
export function releaseSubscriberLink<TThis,
	TArgs extends any[],
	TValue,
	>(obj: ISubscriberLink<TThis, TArgs, TValue>) {
	// Pool as Linked List
	// if (poolLast == null) {
	// 	poolFirst = obj
	// 	obj.prev = null
	// } else {
	// 	poolLast.next = obj
	// 	obj.prev = poolLast
	// }
	// obj.next = null
	// poolLast = obj

	// Pool as Array
	// this.usedSize--
	if (subscriberLinkPool.size < subscriberLinkPool.maxSize) {
		subscriberLinkPool.stack[subscriberLinkPool.size] = obj
		subscriberLinkPool.size++
	}
}

// tslint:disable-next-line:no-shadowed-variable
export function getSubscriberLink<TThis,
	TArgs extends any[],
	TValue,
	>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	subscriber: IFuncCallState<TThis, TArgs, TValue>,
	prev: ISubscriberLink<TThis, TArgs, TValue>,
	next: ISubscriberLink<TThis, TArgs, TValue>,
): ISubscriberLink<TThis, TArgs, TValue> {
	const item = getSubscriberLinkFromPool<TThis, TArgs, TValue>()
	if (item != null) {
		item.state = state
		item.value = subscriber
		item.prev = prev
		item.next = next
		return item
	}
	return {
		state,
		value: subscriber,
		prev,
		next,
	}
}

// endregion

// region subscribeDependency

export function subscriberLinkDelete<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>, item) {
	if (state == null) {
		return
	}
	const {prev, next} = item
	if (prev == null) {
		if (next == null) {
			state._subscribersFirst = null
			state._subscribersLast = null
		} else {
			state._subscribersFirst = next
			next.prev = null
			item.next = null
		}
	} else {
		if (next == null) {
			state._subscribersLast = prev
			prev.next = null
		} else {
			prev.next = next
			next.prev = prev
			item.next = null
		}
		item.prev = null
	}
	item.state = null
	item.value = null
	releaseSubscriberLink(item)
}

// tslint:disable-next-line:no-shadowed-variable
export function unsubscribeDependencies<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>) {
	const _unsubscribers = state._unsubscribers
	if (_unsubscribers != null) {
		const len = state._unsubscribersLength
		for (let i = 0; i < len; i++) {
			const item = _unsubscribers[i]
			_unsubscribers[i] = null
			// subscriberLinkDelete(item.state, item)
			// region inline call
			{
				// tslint:disable-next-line:no-shadowed-variable
				const {prev, next, state} = item
				if (state == null) {
					return
				}
				if (prev == null) {
					if (next == null) {
						state._subscribersFirst = null
						state._subscribersLast = null
					} else {
						state._subscribersFirst = next
						next.prev = null
						item.next = null
					}
				} else {
					if (next == null) {
						state._subscribersLast = prev
						prev.next = null
					} else {
						prev.next = next
						next.prev = prev
						item.next = null
					}
					item.prev = null
				}
				item.state = null
				item.value = null
				releaseSubscriberLink(item)
			}
			// endregion
		}
		state._unsubscribersLength = 0
		if (len > 256) {
			_unsubscribers.length = 256
		}
	}
}

export function _subscribe<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>, subscriber: IFuncCallState<TThis, TArgs, TValue>) {
	const _subscribersLast = state._subscribersLast
	const subscriberLink = getSubscriberLink<TThis, TArgs, TValue>(state, subscriber, _subscribersLast, null)
	if (_subscribersLast == null) {
		state._subscribersFirst = subscriberLink
	} else {
		_subscribersLast.next = subscriberLink
	}
	state._subscribersLast = subscriberLink
	return subscriberLink
}

// tslint:disable-next-line:no-shadowed-variable
export function subscribeDependency<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>, dependency) {
	if (dependency.callId > state.callId) {
		return
	}
	const subscriberLink = _subscribe(dependency, state)
	const _unsubscribers = state._unsubscribers
	if (_unsubscribers == null) {
		state._unsubscribers = [subscriberLink]
		state._unsubscribersLength = 1
	} else {
		_unsubscribers[state._unsubscribersLength++] = subscriberLink
	}
}

// endregion

// region _createDependentFunc

const FuncCallStatus_Invalidating: FuncCallStatus = 1
const FuncCallStatus_Invalidated: FuncCallStatus = 2
const FuncCallStatus_Calculating: FuncCallStatus = 3
const FuncCallStatus_CalculatingAsync: FuncCallStatus = 4
const FuncCallStatus_Calculated: FuncCallStatus = 5
const FuncCallStatus_Error: FuncCallStatus = 6

export function update<TThis,
	TArgs extends any[],
	TValue,
	>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	status: FuncCallStatus,
	valueAsyncOrValueOrError?,
) {
	const prevStatus = state.status
	switch (status) {
		case FuncCallStatus_Invalidating:
			if (prevStatus === FuncCallStatus_Invalidated) {
				return
			}
			if (prevStatus !== FuncCallStatus_Invalidating
				&& prevStatus !== FuncCallStatus_Calculated
				&& prevStatus !== FuncCallStatus_Error
			) {
				throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
			}
			break
		case FuncCallStatus_Invalidated:
			if (prevStatus !== FuncCallStatus_Invalidating) {
				return
			}
			break
		case FuncCallStatus_Calculating:
			if (prevStatus != null
				&& prevStatus !== FuncCallStatus_Invalidating
				&& prevStatus !== FuncCallStatus_Invalidated
			) {
				throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
			}
			break
		case FuncCallStatus_CalculatingAsync:
			if (prevStatus !== FuncCallStatus_Calculating) {
				throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
			}
			state.valueAsync = valueAsyncOrValueOrError
			break
		case FuncCallStatus_Calculated:
			if (prevStatus !== FuncCallStatus_Calculating && prevStatus !== FuncCallStatus_CalculatingAsync) {
				throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
			}
			if (typeof state.valueAsync !== 'undefined') {
				state.valueAsync = null
			}
			state.error = void 0
			state.value = valueAsyncOrValueOrError
			state.hasError = false
			state.hasValue = true
			break
		case FuncCallStatus_Error:
			if (prevStatus !== FuncCallStatus_Calculating && prevStatus !== FuncCallStatus_CalculatingAsync) {
				throw new Error(`Set status ${status} called when current status is ${prevStatus}`)
			}
			if (typeof state.valueAsync !== 'undefined') {
				state.valueAsync = null
			}
			state.error = valueAsyncOrValueOrError
			state.hasError = true
			break
		default:
			throw new Error('Unknown FuncCallStatus: ' + status)
	}

	state.status = status

	switch (status) {
		case FuncCallStatus_Invalidating:
			// unsubscribeDependencies(state)
			// region inline call
			{
				const _unsubscribers = state._unsubscribers
				if (_unsubscribers != null) {
					const len = state._unsubscribersLength
					for (let i = 0; i < len; i++) {
						const item = _unsubscribers[i]
						_unsubscribers[i] = null
						// subscriberLinkDelete(item.state, item)
						// region inline call
						{
							// tslint:disable-next-line:no-shadowed-variable
							const {prev, next, state} = item
							if (state == null) {
								return
							}
							if (prev == null) {
								if (next == null) {
									state._subscribersFirst = null
									state._subscribersLast = null
								} else {
									state._subscribersFirst = next
									next.prev = null
									item.next = null
								}
							} else {
								if (next == null) {
									state._subscribersLast = prev
									prev.next = null
								} else {
									prev.next = next
									next.prev = prev
									item.next = null
								}
								item.prev = null
							}
							item.state = null
							item.value = null
							releaseSubscriberLink(item)
						}
						// endregion
					}
					state._unsubscribersLength = 0
					if (len > 256) {
						_unsubscribers.length = 256
					}
				}
			}
			// endregion
			// emit(state, status)
			// region inline call
			if (state._subscribersFirst != null) {
				// let clonesFirst
				// let clonesLast
				// for (let link = state._subscribersFirst; link; link = link.next) {
				// 	const cloneLink = getSubscriberLink(state, link.value, null, link.next)
				// 	if (clonesLast == null) {
				// 		clonesFirst = cloneLink
				// 	} else {
				// 		clonesLast.next = cloneLink
				// 	}
				// 	clonesLast = cloneLink
				// }
				for (let link = state._subscribersFirst; link;) {
					const next = link.next
					// invalidate(link.value, status)
					// region inline call
					{
						// tslint:disable-next-line:no-shadowed-variable
						const state = link.value
						update(state, FuncCallStatus_Invalidating)
					}
					// endregion
					// link.value = null
					// link.next = null
					// releaseSubscriberLink(link)
					link = next
				}
			}
			// endregion
			break
		case FuncCallStatus_Invalidated:
			// emit(state, status)
			// region inline call
			if (state._subscribersFirst != null) {
				// let clonesFirst
				// let clonesLast
				// for (let link = state._subscribersFirst; link; link = link.next) {
				// 	const cloneLink = getSubscriberLink(state, link.value, null, link.next)
				// 	if (clonesLast == null) {
				// 		clonesFirst = cloneLink
				// 	} else {
				// 		clonesLast.next = cloneLink
				// 	}
				// 	clonesLast = cloneLink
				// }
				for (let link = state._subscribersFirst; link;) {
					const next = link.next
					// invalidate(link.value, status)
					// region inline call
					{
						// tslint:disable-next-line:no-shadowed-variable
						const state = link.value
						update(state, FuncCallStatus_Invalidated)
					}
					// endregion
					// link.value = null
					// link.next = null
					// releaseSubscriberLink(link)
					link = next
				}
			}
			// endregion
			break
	}
}

// tslint:disable-next-line:no-shadowed-variable
export function invalidate<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>, status?: FuncCallStatus) {
	if (status == null) {
		update(state, FuncCallStatus_Invalidating)
		update(state, FuncCallStatus_Invalidated)
	} else {
		update(state, status)
	}
}

export function emit<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>, status) {
	if (state._subscribersFirst != null) {
		let clonesFirst
		let clonesLast
		for (let link = state._subscribersFirst; link; link = link.next) {
			const cloneLink = getSubscriberLink(state, link.value, null, link.next)
			if (clonesLast == null) {
				clonesFirst = cloneLink
			} else {
				clonesLast.next = cloneLink
			}
			clonesLast = cloneLink
		}
		for (let link = clonesFirst; link;) {
			invalidate(link.value, status)
			link.value = null
			const next = link.next
			link.next = null
			releaseSubscriberLink(link)
			link = next
		}
	}
}

export class FuncCallState<TThis,
	TArgs extends any[],
	TValue,
> {
	constructor(
		func: Func<TThis, TArgs, TValue>,
		_this: TThis,
		dependentFunc: Func<TThis, TArgs, TValue>,
	) {
		this.func = func
		this._this = _this
		this.dependentFunc = dependentFunc
	}

	public readonly func
	public readonly _this
	public readonly dependentFunc

	public status = FuncCallStatus_Invalidated
	public hasValue = false
	public hasError = false
	public valueAsync = null
	public value = void 0
	public error = void 0
	// for detect recursive async loop
	public parentCallState = null
	public _subscribersFirst = null
	public _subscribersLast = null
	// for prevent multiple subscribe equal dependencies
	public callId = 0
	public _unsubscribers = null
	public _unsubscribersLength = 0
}

// tslint:disable-next-line:no-shadowed-variable
export function createFuncCallState<TThis,
	TArgs extends any[],
	TValue,
	>(
	func: Func<TThis, TArgs, TValue>,
	_this: TThis,
	dependentFunc: Func<TThis, TArgs, TValue>,
): IFuncCallState<TThis, TArgs, TValue> {
	return new FuncCallState(
		func,
		_this,
		dependentFunc,
	)
}

let currentState: IFuncCallState<any, any, any>
let nextCallId = 1

// tslint:disable-next-line:no-shadowed-variable
export function _createDependentFunc<TThis,
	TArgs extends any[],
	TValue>(this: IFuncCallState<TThis, TArgs, TValue>): (this: IFuncCallState<TThis, TArgs, TValue>) => TValue {
	const args = arguments
	return function() {
		const state = this

		if (currentState) {
			subscribeDependency(currentState, state)
		}

		state.callId = nextCallId++

		if (state.status) {
			switch (state.status) {
				case FuncCallStatus_Calculated:
					return state.value

				case FuncCallStatus_Invalidating:
				case FuncCallStatus_Invalidated:
					break
				case FuncCallStatus_CalculatingAsync:
					let parentCallState = state.parentCallState
					while (parentCallState) {
						if (parentCallState === state) {
							throw new Error('Recursive async loop detected')
						}
						parentCallState = parentCallState.parentCallState
					}
					return state.valueAsync

				case FuncCallStatus_Error:
					throw state.error

				case FuncCallStatus_Calculating:
					throw new Error('Recursive sync loop detected')
				default:
					throw new Error('Unknown FuncStatus: ' + state.status)
			}
		}

		state.parentCallState = currentState
		currentState = state

		// return tryInvoke.apply(state, args)

		try {
			update(state, FuncCallStatus_Calculating)

			let value: any = state.func.apply(state._this, args)

			if (isIterator(value)) {
				value = resolveAsync(
					makeDependentIterator(state, value as Iterator<TValue>) as ThenableOrIteratorOrValue<TValue>,
				)

				if (isThenable(value)) {
					update(state, FuncCallStatus_CalculatingAsync, value)
				}

				return value
			} else if (isThenable(value)) {
				throw new Error('You should use iterator instead thenable for async functions')
			}

			update(state, FuncCallStatus_Calculated, value)
			return value
		} catch (error) {
			update(state, FuncCallStatus_Error, error)
			throw error
		} finally {
			currentState = state.parentCallState
			state.parentCallState = null
		}
	}
}

export function* makeDependentIterator<TThis,
	TArgs extends any[],
	TValue,
	TFunc extends Func<TThis, TArgs, TValue>>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	iterator: Iterator<TValue>,
	nested?: boolean,
): Iterator<TValue> {
	currentState = state

	try {
		let iteration = iterator.next()
		while (!iteration.done) {
			let value = iteration.value

			if (isIterator(value)) {
				value = makeDependentIterator(state, value as Iterator<TValue>, true)
			}

			value = yield value
			currentState = state
			iteration = iterator.next(value)
		}

		if (!nested) {
			update(state, FuncCallStatus_Calculated, iteration.value)
		}
		return iteration.value
	} catch (error) {
		if (!nested) {
			update(state, FuncCallStatus_Error, error)
		}
		throw error
	} finally {
		currentState = null
		state.parentCallState = null
	}
}

// endregion

// region _getFuncCallState

export function isRefType(value): boolean {
	return value != null && (typeof value === 'object' || typeof value === 'function')
}

interface ISemiWeakMap<K, V> {
	map: Map<K, V>
	weakMap: WeakMap<K extends object ? K : never, V>
}

export function createSemiWeakMap<K, V>(): ISemiWeakMap<K, V> {
	return {
		map: null,
		weakMap: null,
	}
}

export function semiWeakMapGet<K, V>(semiWeakMap: ISemiWeakMap<K, V>, key: K): V {
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

export function semiWeakMapSet<K, V>(semiWeakMap: ISemiWeakMap<K, V>, key: K, value: V): void {
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

// endregion

// region facade

export function createDependentFunc<TThis,
	TArgs extends any[],
	TValue,
	>(getState: Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>>) {
	return function() {
		const state = getState.apply(this, arguments)
		return state.dependentFunc()
	}
}

type TRootStateMap = WeakMap<Func<any, any, any>, Func<any, any, IFuncCallState<any, any, any>>>

// tslint:disable-next-line:no-shadowed-variable
export function createMakeDependentFunc(rootStateMap: TRootStateMap) {
	// tslint:disable-next-line:no-shadowed-variable
	function makeDependentFunc<TThis,
		TArgs extends any[],
		TValue,
		>(func: Func<TThis, TArgs, Iterator<TValue>>): Func<TThis, TArgs, ThenableOrValue<TValue>>
	// tslint:disable-next-line:no-shadowed-variable
	function makeDependentFunc<TThis,
		TArgs extends any[],
		TValue,
		>(func: Func<TThis, TArgs, TValue>): Func<TThis, TArgs, TValue>
	// tslint:disable-next-line:no-shadowed-variable
	function makeDependentFunc<TThis,
		TArgs extends any[],
		TValue,
		>(func: Func<TThis, TArgs, TValue | Iterator<TValue>>): Func<TThis, TArgs, TValue> {
		if (rootStateMap.get(func)) {
			throw new Error('Multiple call makeDependentFunc() for func: ' + func)
		}
		const getState = _getFuncCallState(func, new Map<number, any>())
		rootStateMap.set(func, getState)

		const dependentFunc = createDependentFunc(getState)

		rootStateMap.set(dependentFunc, getState)

		return dependentFunc
	}

	return makeDependentFunc
}

// tslint:disable-next-line:no-empty
const emptyFunc: Func<any, any, any> = () => {}

// tslint:disable-next-line:no-shadowed-variable
export function createGetFuncCallState(rootStateMap: TRootStateMap) {
	// tslint:disable-next-line:no-shadowed-variable
	function getFuncCallState<TThis,
		TArgs extends any[],
		TValue>(func: Func<TThis, TArgs, TValue>): Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>> {
		return rootStateMap.get(func) || emptyFunc
	}

	return getFuncCallState
}

const rootStateMap: TRootStateMap = new WeakMap()
// tslint:disable-next-line:no-shadowed-variable
export const getFuncCallState = createGetFuncCallState(rootStateMap)
// tslint:disable-next-line:no-shadowed-variable
export const makeDependentFunc = createMakeDependentFunc(rootStateMap)

// endregion
