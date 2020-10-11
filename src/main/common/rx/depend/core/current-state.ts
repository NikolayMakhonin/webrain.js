/* tslint:disable:no-circular-imports no-shadowed-variable */
import {IteratorOrValue, registerStateProvider, ThenableIterator} from '../../../async/async'
import {isIterator} from '../../../helpers/helpers'
import {TCallStateAny} from './contracts'

// region currentState

let currentState: TCallStateAny = null

export function getCurrentState() {
	return currentState
}

export function setCurrentState(state: TCallStateAny) {
	currentState = state
}

registerStateProvider({
	getState: getCurrentState,
	setState: setCurrentState,
})

// endregion

// region forceLazy

let _forceLazy: boolean = null

export function getForceLazy() {
	return _forceLazy
}

export function setForceLazy(value: boolean|null) {
	_forceLazy = value
}

// endregion

// region withMode

function *_withModeAsync<TValue>(
	noSubscribe: boolean, forceLazy: boolean|null, iterator: Iterator<any, TValue>,
): Iterator<any, TValue> {
	const prevState = noSubscribe
		? getCurrentState()
		: null
	const prevForceLazy = forceLazy != null
		? getForceLazy()
		: null

	try {
		if (noSubscribe) {
			setCurrentState(null)
		}
		if (forceLazy != null) {
			setForceLazy(forceLazy)
		}
		return yield iterator
	} finally {
		if (noSubscribe) {
			setCurrentState(prevState)
		}
		if (forceLazy != null) {
			setForceLazy(prevForceLazy)
		}
	}
}

export function withMode<TValue>(
	noSubscribe: boolean, forceLazy: boolean|null, func: () => ThenableIterator<TValue>,
): ThenableIterator<TValue>
export function withMode<TValue>(
	noSubscribe: boolean, forceLazy: boolean|null, func: () => TValue,
): TValue
export function withMode<TValue>(
	noSubscribe: boolean, forceLazy: boolean|null, func: () => IteratorOrValue<TValue>,
): IteratorOrValue<TValue> {
	const prevState = noSubscribe
		? getCurrentState()
		: null
	const prevForceLazy = forceLazy != null
		? getForceLazy()
		: null

	let result
	try {
		if (noSubscribe) {
			setCurrentState(null)
		}
		if (forceLazy != null) {
			setForceLazy(forceLazy)
		}
		result = func()
	} finally {
		if (noSubscribe) {
			setCurrentState(prevState)
		}
		if (forceLazy != null) {
			setForceLazy(prevForceLazy)
		}
	}

	if (isIterator(result)) {
		return _withModeAsync(noSubscribe, forceLazy, result)
	}

	return result
}

// endregion

// region noSubscribe

export function noSubscribe<TValue>(func: () => ThenableIterator<TValue>): ThenableIterator<TValue>
export function noSubscribe<TValue>(func: () => TValue): TValue
export function noSubscribe<TValue>(func: () => IteratorOrValue<TValue>): IteratorOrValue<TValue> {
	return withMode(true, null, func)
}

// endregion

// region forceLazy

export function forceLazy<TValue>(func: () => ThenableIterator<TValue>): ThenableIterator<TValue>
export function forceLazy<TValue>(func: () => TValue): TValue
export function forceLazy<TValue>(func: () => IteratorOrValue<TValue>): IteratorOrValue<TValue> {
	return withMode(null, true, func)
}

// endregion
