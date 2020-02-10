import {TCall} from '../contracts'

export function createCallWithArgs<TArgs extends any[],
	>(...args: TArgs): TCall<TArgs>
export function createCallWithArgs<TArgs extends any[],
	>(): TCall<TArgs> {
	const args = arguments
	return function(func) {
		return func.apply(this, args)
	}
}
