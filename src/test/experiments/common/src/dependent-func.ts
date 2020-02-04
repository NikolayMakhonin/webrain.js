import {isIterator} from '../../../../main/common/helpers/helpers'
import {IUnsubscribe} from '../../../../main/common/rx/subjects/observable'

export type Func<TThis, TArgs extends any[], TValue = void> = (this: TThis, ...args: TArgs) => TValue

export enum FuncStatus {
	Calculating = 'Calculating',
	CalculatingAsync = 'CalculatingAsync',
	Calculated = 'Calculated',
	Error = 'Error',
}

export interface IFuncState<
	TThis,
	TArgs extends any[],
	TValue,
> {
	status: FuncStatus
	valueAsync: Iterator<TValue>
	value: TValue
	error: any
	updateStatus(status: FuncStatus, valueAsyncOrValueOrError?: TValue|Iterator<TValue>|any): void
	/** clear status, value, error & unsubscribe dependencies */
	invalidate(): void
	subscribe<This extends this>(handler: Func<This, TArgs, void>): IUnsubscribe

	// TODO: parent subscribe for invalidate (clear status & value & error & unsubscribe dependencies)
	subscribeDependency(dependency: IFuncState<any, any, any>): void
	unsubscribeDependencies(): void
}

function getOrCreateFuncState<
	TThis,
	TArgs extends any[],
	TValue,
>(func: Func<TThis, TArgs, TValue>): Func<TThis, TArgs, IFuncState<TThis, TArgs, TValue>> {
	return null // TODO
}

let currentState: IFuncState<any, any, any>

function* makeDependentIterator<
	TThis,
	TArgs extends any[],
	TValue,
	TFunc extends Func<TThis, TArgs, TValue>
>(
	state: IFuncState<TThis, TArgs, TValue>,
	iterator: Iterator<TValue>,
): Iterator<TValue> {
	currentState = state

	try {
		let iteration = iterator.next()
		while (!iteration.done) {
			const value = yield iteration.value
			currentState = state
			iteration = iterator.next(value)
		}

		state.updateStatus(FuncStatus.Calculated, iteration.value)
		return iteration.value
	} catch (error) {
		state.updateStatus(FuncStatus.Error, error)
		throw error
	}
}

export function makeDependentFunc<
	TThis,
	TArgs extends any[],
	TValue,
	TFunc extends Func<TThis, TArgs, TValue>
>(func: TFunc): TFunc {
	const _getOrCreateFuncState = getOrCreateFuncState(func)

	return function() {
		const state = _getOrCreateFuncState.apply(this, arguments) as IFuncState<TThis, TArgs, TValue>

		if (state.status) {
			switch (state.status) {
				case FuncStatus.Calculating:
					throw new Error('Infinity loop detected')
				case FuncStatus.CalculatingAsync:
					// TODO: Can be async infinity loop, which is hard to debug
					return state.valueAsync
				case FuncStatus.Calculated:
					return state.value
				case FuncStatus.Error:
					throw state.error
				default:
					throw new Error('Unknown FuncStatus: ' + state.status)
			}
		}

		const parentState = currentState

		try {
			currentState = state

			if (parentState) {
				parentState.subscribeDependency(state)
			}

			state.updateStatus(FuncStatus.Calculating)

			const value = func.apply(this, arguments)

			if (isIterator(value)) {
				const valueAsync = makeDependentIterator(state, value as Iterator<any>)
				state.updateStatus(FuncStatus.CalculatingAsync, valueAsync)
				return valueAsync
			}

			state.updateStatus(FuncStatus.Calculated, value)
			return value
		} catch (error) {
			state.updateStatus(FuncStatus.Error, error)
			throw error
		} finally {
			currentState = parentState
		}
	} as any
}
