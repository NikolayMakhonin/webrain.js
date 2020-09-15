// export class RandomTest<TOptions, TMetrics> {
// 	constructor(options) {
//
// 	}
// }

import {isAsync, ThenableIterator, ThenableOrIteratorOrValue} from '../async/async'
import {resolveAsyncAll} from '../async/ThenableSync'
import {Random} from '../random/Random'

export type TTestIteration<TState> = (rnd: Random, state: TState) => ThenableOrIteratorOrValue<any>

// region iterationBuilder

export type TAction<TState> = (rnd: Random, state: TState) => ThenableOrIteratorOrValue<any>

interface IBeforeAfter<TState> {
	before?: TAction<TState>
	after?: TAction<TState>
}

interface IIterationAction<TState> extends IBeforeAfter<TState> {
	/** Probability weight */
	weight: number
}

export function iterationBuilder<TState>({
	before,
	action,
	waitAsyncRandom,
	waitAsyncAll,
	after,
}: IBeforeAfter<TState> & {
	action: IIterationAction<TState> & {
		func: TAction<TState>,
	},
	waitAsyncRandom?: IIterationAction<TState>,
	waitAsyncAll?: IIterationAction<TState>,
}): TTestIteration<TState> {
	const sumWeights = action.weight
		+ (waitAsyncAll != null ? waitAsyncAll.weight : 0)
		+ (waitAsyncRandom != null ? waitAsyncRandom.weight : 0)

	const actionWeight = action.weight / sumWeights
	const waitAsyncRandomWeight = waitAsyncRandom != null ? waitAsyncRandom.weight / sumWeights : 0
	const waitAsyncAllWeight = waitAsyncAll != null ? waitAsyncAll.weight / sumWeights : 0

	const asyncs = []
	function *iteration(rnd: Random, state: TState): ThenableIterator<void> {
		if (before != null) {
			yield before(rnd, state)
		}

		const step = rnd.next()
		if (step < asyncs.length * waitAsyncAllWeight) {
			// wait all
			if (waitAsyncAll.before != null) {
				yield waitAsyncAll.before(rnd, state)
			}

			yield resolveAsyncAll(asyncs)
			asyncs.length = 0

			if (waitAsyncAll.after != null) {
				yield waitAsyncAll.after(rnd, state)
			}
		} else if (step < asyncs.length * waitAsyncRandomWeight) {
			// wait random
			if (waitAsyncRandom.before != null) {
				yield waitAsyncRandom.before(rnd, state)
			}

			const index = rnd.nextInt(asyncs.length)
			const async = asyncs[index]
			asyncs[index] = asyncs[asyncs.length - 1]
			asyncs.length--
			yield async

			if (waitAsyncRandom.after != null) {
				yield waitAsyncRandom.after(rnd, state)
			}
		} else {
			// action
			if (action.before != null) {
				yield action.before(rnd, state)
			}

			const async = action.func(rnd.nextRandom(), state)

			if (waitAsyncRandomWeight === 0 && waitAsyncAllWeight === 0) {
				yield async
			} else if (isAsync(async)) {
				async.push(async)
			}

			if (action.after != null) {
				yield action.after(rnd, state)
			}
		}

		if (after != null) {
			yield after(rnd, state)
		}
	}

	return iteration
}

// endregion

export type TTestIterator<TOptions> = (rnd: Random, options: TOptions) => ThenableOrIteratorOrValue<any>

// region iteratorBuilder

export function iteratorBuilder<
	TOptions,
	TState
>({
	createState,
	before,
	stopPredicate,
	iteration,
	after,
}: IBeforeAfter<TState> & {
	createState: (rnd: Random, options: TOptions) => ThenableOrIteratorOrValue<TState>,
	stopPredicate: (
		iterationNumber: number, timeStart: number, state: TState,
	) => ThenableOrIteratorOrValue<boolean>,
	iteration: TTestIteration<TState>,
}): TTestIterator<TOptions> {
	function *iterator(rnd: Random, options: TOptions): ThenableIterator<void> {
		const state = yield createState(rnd, options)

		if (before != null) {
			yield before(rnd, state)
		}

		const timeStart = Date.now()
		let iterationNumber = 0
		while (true) {
			const doStop = yield stopPredicate(iterationNumber, timeStart, state)
			if (doStop) {
				break
			}

			yield iteration(rnd, state)

			iterationNumber++
		}

		if (after != null) {
			yield after(rnd, state)
		}
	}

	return iterator
}

// endregion

export type TOptionsGenerator<TOptionsPattern, TOptions>
	= (rnd: Random, pattern: TOptionsPattern) => ThenableOrIteratorOrValue<TOptions>

export type TOptionsPatternBuilder<TMetrics, TOptionsPattern>
	= (metricsMin: TMetrics) => ThenableOrIteratorOrValue<TOptionsPattern>

export type TTest = () => ThenableOrIteratorOrValue<any>

export type TTestBuilder<TMetrics, TOptionsPattern> = (
	optionsPatternBuilder: TOptionsPatternBuilder<TMetrics, TOptionsPattern>,
) => ThenableOrIteratorOrValue<TTest>

export interface ITestOptions<TMetrics> {
	metrics: TMetrics
	metricsMin: TMetrics
}

export interface ITestState<TMetrics, TOptions extends ITestOptions<TMetrics>> {
	options: TOptions
}

export interface IIterationState {

}
