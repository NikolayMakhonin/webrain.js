import {isAsync, ThenableIterator, ThenableOrIteratorOrValue, ThenableOrValue} from '../async/async'
import {resolveAsync, resolveAsyncAll} from '../async/ThenableSync'
import {Random} from '../random/Random'
import {interceptConsole, TConsoleType, throwOnConsoleError} from './interceptConsole'

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
>(
	createState: (rnd: Random, options: TOptions) => ThenableOrIteratorOrValue<TState>,
	{
		before,
		stopPredicate,
		iteration,
		after,
	}: IBeforeAfter<TState> & {
		stopPredicate: (
			iterationNumber: number, timeStart: number, state: TState,
		) => ThenableOrIteratorOrValue<boolean>,
		iteration: TTestIteration<TState>,
	},
): TTestIterator<TOptions> {
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

export type TTestRunnerStopPredicate = (
	iterationNumber: number, timeElapsed: number,
) => ThenableOrIteratorOrValue<boolean>

// region testRunner

function *testRunner<TContext>(_this: TContext, {
	stopPredicate,
	func,
}: {
	stopPredicate: TTestRunnerStopPredicate,
	func: (this: TContext) => ThenableOrIteratorOrValue<any>,
}) {
	let iterationNumber = 0
	const timeStart = Date.now()

	while (true) {
		const doStop = yield stopPredicate(iterationNumber, Date.now() - timeStart)
		if (doStop) {
			break
		}

		yield func.call(_this)

		iterationNumber++
	}
}

// endregion

export interface ISearchBestErrorParams<TMetrics> {
	customSeed?: number,
	metricsMin?: TMetrics,
	stopPredicate: (
		iterationNumber: number, timeElapsed: number,
	) => ThenableOrIteratorOrValue<boolean>
}

export type TSearchBestError<TContext, TMetrics> = (_this: TContext, {
	customSeed,
	metricsMin,
	stopPredicate,
	createMetrics,
	compareMetrics,
	func,
}: ISearchBestErrorParams<TMetrics> & {
	createMetrics: () => ThenableOrIteratorOrValue<TMetrics>,
	compareMetrics: (metrics1, metrics2) => boolean,
	func: (this: TContext, seed: number, metrics: TMetrics, metricsMin: TMetrics) => void | Promise<void>,
}) => ThenableOrIteratorOrValue<any>

// region searchBestErrorBuilder

export function searchBestErrorBuilder<TMetrics = any>({
	onFound,
	consoleOnlyBestErrors,
}: {
	onFound?: (reportMin: string) => ThenableOrIteratorOrValue<any>,
	consoleOnlyBestErrors?: boolean,
}): TSearchBestError<TMetrics> {
	return function*(
		_this: TContext,
		{
			customSeed,
			metricsMin,
			stopPredicate,
			createMetrics,
			compareMetrics,
			func,
		}: ISearchBestErrorParams<TMetrics> & {
			createMetrics: () => ThenableOrIteratorOrValue<TMetrics>,
			compareMetrics: (metrics1, metrics2) => boolean,
			func: (seed: number, metrics: TMetrics, metricsMin: TMetrics) => void | Promise<void>,
		},
	) {
		let interceptConsoleDisabled
		const interceptConsoleDispose = customSeed == null
			&& consoleOnlyBestErrors
			&& interceptConsole(function() {
				return interceptConsoleDisabled
			})

		function interceptConsoleDisable(_func: () => any) {
			interceptConsoleDisabled = true
			try {
				return _func()
			} finally {
				interceptConsoleDisabled = false
			}
		}

		try {
			let seedMin = null
			let errorMin = null
			let reportMin = null

			yield testRunner(_this, {
				stopPredicate: (iterationNumber, timeElapsed) => {
					return customSeed != null || stopPredicate(iterationNumber, timeElapsed)
				},
				*func() {
					const seed = customSeed != null ? customSeed : new Random().nextInt(2 << 29)
					const metrics = createMetrics()

					try {
						yield func.call(this, seed, metrics, metricsMin || {} as any)
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
								yield onFound(reportMin)
							}
						}
					}
				},
			})

			if (errorMin) {
				interceptConsoleDisable(() => console.error(reportMin))
				throw errorMin
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

// region RandomTest

export class RandomTest<
	TMetrics,
	TOptionsPattern extends IOptionsPatternBase & ITestOptions<TMetrics>,
	TOptions extends ITestOptions<TMetrics>,
> {
	private readonly _optionsPatternBuilder: TOptionsPatternBuilder<TMetrics, TOptionsPattern>
	private readonly _optionsGenerator: TOptionsGenerator<TOptionsPattern, TOptions>
	private readonly _testIterator: TTestIterator<TOptions>
	private readonly _searchBestError: TSearchBestError<TMetrics>
	private readonly _consoleThrowPredicate: (this: TConsoleType, ...args: any[]) => boolean
	private readonly _createMetrics: () => ThenableOrIteratorOrValue<TMetrics>
	private readonly _compareMetrics: (metrics1, metrics2) => boolean

	constructor(
		createMetrics?: () => ThenableOrIteratorOrValue<TMetrics>,
		optionsPatternBuilder: TOptionsPatternBuilder<TMetrics, TOptionsPattern>,
		optionsGenerator: TOptionsGenerator<TOptionsPattern, TOptions>,
		{
			compareMetrics,
			consoleThrowPredicate,
			searchBestError,
			testIterator,
		}: {
			compareMetrics?: (metrics: TMetrics, metricsMin: TMetrics) => boolean,
			consoleThrowPredicate?: (this: TConsoleType, ...args: any[]) => boolean,
			searchBestError?: TSearchBestError<TMetrics>,
			testIterator: TTestIterator<TOptions>,
		},
	) {
		this._createMetrics = createMetrics
		this._optionsPatternBuilder = optionsPatternBuilder
		this._optionsGenerator = optionsGenerator

		this._compareMetrics = compareMetrics
		this._consoleThrowPredicate = consoleThrowPredicate
		this._searchBestError = searchBestError

		this._testIterator = testIterator
	}

	public run({
		stopPredicate,
		searchBestError,
		customSeed,
		metricsMin,
	}: ISearchBestErrorParams<TMetrics> & {
		searchBestError?: boolean,
	}): ThenableOrValue<any> {
		function func(this: this, seed: number|null, metrics, _metricsMin) {
			const optionsPattern = this._optionsPatternBuilder(metrics, _metricsMin)
			return test(optionsPattern, this._optionsGenerator, this._testIterator)
		}

		return resolveAsync(throwOnConsoleError(this, this._consoleThrowPredicate, function(this: this) {
			if (searchBestError) {
				return this._searchBestError(
					this,
					{
						customSeed,
						metricsMin,
						stopPredicate,
						createMetrics: this._createMetrics,
						compareMetrics: this._compareMetrics,
						func,
					},
				)
			} else {
				const metrics = this._createMetrics()
				return testRunner(this, {
					stopPredicate,
					func() {
						return func.call(this, customSeed, metrics, metricsMin)
					},
				})
			}
		}))
	}
}

// endregion
