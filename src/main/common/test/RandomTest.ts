// export class RandomTest<TOptions, TMetrics> {
// 	constructor(options) {
//
// 	}
// }

import {isAsync, ThenableIterator, ThenableOrIteratorOrValue} from '../async/async'
import {resolveAsync, resolveAsyncAll} from '../async/ThenableSync'
import {Random} from '../random/Random'
import {interceptConsole} from "./interceptConsole";

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

export interface IOptionsPatternBase {
	seed?: number
}

export type TOptionsGenerator<TOptionsPattern, TOptions>
	= (rnd: Random, pattern: TOptionsPattern) => ThenableOrIteratorOrValue<TOptions>

// region test

export async function *test<
	TOptionsPattern extends IOptionsPatternBase,
	TOptions,
>(
	optionsPattern: TOptionsPattern,
	optionsGenerator: TOptionsGenerator<TOptionsPattern, TOptions>,
	testIterator: TTestIterator<TOptions>,
): ThenableIterator<any> {
	const seed = optionsPattern.seed != null
		? optionsPattern.seed
		: new Random().nextSeed()

	console.log(`\r\nseed = ${seed}`)
	const rnd = new Random(seed)

	const options = yield optionsGenerator(rnd, optionsPattern)

	yield testIterator(rnd, options)
}

// endregion

export type TSearchBestError<TMetrics> = ({
	customSeed,
	metricsMin,
	testFunc,
}: {
	customSeed?: number,
	metricsMin?: TMetrics,
	testFunc: (seed: number, metrics: TMetrics, metricsMin: TMetrics) => void | Promise<void>,
}) => ThenableOrIteratorOrValue<any>

// region searchBestErrorBuilder

function searchBestErrorBuilder<TMetrics = any>({
	stopPredicate,
	compareMetrics,
	onFound,
	consoleOnlyBestErrors,
}: {
	stopPredicate: (
		iterationNumber: number, timeElapsed: number,
	) => ThenableOrIteratorOrValue<boolean>
	compareMetrics: (metrics1, metrics2) => boolean,
	onFound?: (reportMin: string) => void,
	consoleOnlyBestErrors?: boolean,
}): TSearchBestError<TMetrics> {
	return function*({
		customSeed,
		metricsMin,
		testFunc,
	}: {
		customSeed?: number,
		metricsMin?: TMetrics,
		testFunc: (seed: number, metrics: TMetrics, metricsMin: TMetrics) => void | Promise<void>,
	}) {
		let interceptConsoleDisabled
		const interceptConsoleDispose = customSeed == null
			&& consoleOnlyBestErrors
			&& interceptConsole(function() {
				return interceptConsoleDisabled
			})

		function interceptConsoleDisable(func: () => any) {
			interceptConsoleDisabled = true
			try {
				return func()
			} finally {
				interceptConsoleDisabled = false
			}
		}

		try {
			let iterationNumber = 0
			const timeStart = Date.now()

			let seedMin = null
			let errorMin = null
			let reportMin = null
			while (true) {
				const doStop = yield stopPredicate(iterationNumber, Date.now() - timeStart)
				if (doStop) {
					break
				}

				const seed = customSeed != null ? customSeed : new Random().nextInt(2 << 29)
				const metrics = {} as TMetrics

				try {
					yield testFunc(seed, metrics, metricsMin || {} as any)
				} catch (error) {
					if (customSeed != null) {
						interceptConsoleDisable(() => console.log(`customSeed: ${customSeed}`, metrics))
						throw error
					} else if (errorMin == null || compareMetrics(metrics, metricsMin)) {
						metricsMin = {...metrics}
						seedMin = seed
						errorMin = error
						reportMin = `\r\n\r\ncustomSeed: ${
							seedMin
						},\r\nmetricsMin: ${
							JSON.stringify(metricsMin)
						},\r\n${
							errorMin.stack || errorMin
						}`
						interceptConsoleDisable(() => console.error(reportMin))
						if (onFound) {
							onFound(reportMin)
						}
					}
				}

				iterationNumber++
				if (customSeed != null || iterationNumber >= iterations) {
					if (errorMin) {
						interceptConsoleDisable(() => console.error(reportMin))
						throw errorMin
					} else {
						return
					}
				}
			}
		} finally {
			if (interceptConsoleDispose) {
				interceptConsoleDispose()
			}
		}
	}
}

// endregion

export type TOptionsPatternBuilder<TMetrics, TOptionsPattern>
	= (metrics: TMetrics, metricsMin: TMetrics) => ThenableOrIteratorOrValue<TOptionsPattern>

export interface ITestOptions<TMetrics> {
	metrics: TMetrics
	metricsMin: TMetrics
}

export class RandomTest<
	TMetrics,
	TOptionsPattern extends IOptionsPatternBase & ITestOptions<TMetrics>,
	TOptions extends ITestOptions<TMetrics>,
> {
	private _optionsPatternBuilder: TOptionsPatternBuilder<TMetrics, TOptionsPattern>
	private _optionsPattern: TOptionsPattern
	private _optionsGenerator: TOptionsGenerator<TOptionsPattern, TOptions>
	private _testIterator: TTestIterator<TOptions>
	private _searchBestError: TSearchBestError<TMetrics>

	constructor({
		optionsPatternBuilder,
		optionsPattern,
		optionsGenerator,
		testIterator,
		searchBestError,
	}: {
		optionsPatternBuilder: TOptionsPatternBuilder<TMetrics, TOptionsPattern>,
		optionsPattern: TOptionsPattern,
		optionsGenerator: TOptionsGenerator<TOptionsPattern, TOptions>,
		testIterator: TTestIterator<TOptions>,
		searchBestError: TSearchBestError<TMetrics>,
	}) {
		this._optionsPatternBuilder = optionsPatternBuilder
		this._optionsPattern = optionsPattern
		this._optionsGenerator = optionsGenerator
		this._testIterator = testIterator
		this._searchBestError = searchBestError
	}

	public run({
		searchBestError,
	}: {
		searchBestError?: boolean,
	} = {}) {

	}
}

