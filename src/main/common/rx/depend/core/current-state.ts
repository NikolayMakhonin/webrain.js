import {IteratorOrValue, ThenableIterator} from '../../../async/async'
import {isIterator} from '../../../helpers/helpers'
import {TCallStateAny} from './CallState'

let currentState: TCallStateAny = null

export function getCurrentState() {
	return currentState
}

export function setCurrentState(state: TCallStateAny) {
	currentState = state
}

function _noSubscribe<TValue>(func: () => TValue): TValue {
	const prevState = getCurrentState()
	try {
		setCurrentState(null)
		return func()
	} finally {
		setCurrentState(prevState)
	}
}

function *_noSubscribeAsync<TValue>(iterator: Iterator<any, TValue>): Iterator<any, TValue> {
	const prevState = getCurrentState()
	try {
		setCurrentState(null)
		return yield iterator
	} finally {
		setCurrentState(prevState)
	}
}

export function noSubscribe<TValue>(func: () => ThenableIterator<TValue>): ThenableIterator<TValue>
export function noSubscribe<TValue>(func: () => TValue): TValue
export function noSubscribe<TValue>(func: () => IteratorOrValue<TValue>): IteratorOrValue<TValue> {
	const prevState = getCurrentState()

	let result
	try {
		setCurrentState(null)
		result = func()
	} finally {
		setCurrentState(prevState)
	}

	if (isIterator(result)) {
		return _noSubscribeAsync(result)
	}
}
