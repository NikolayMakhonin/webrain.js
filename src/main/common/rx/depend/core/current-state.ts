import {TCallState} from './CallState'

let currentState: TCallState = null

export function getCurrentState() {
	return currentState
}

export function setCurrentState(state: TCallState) {
	currentState = state
}