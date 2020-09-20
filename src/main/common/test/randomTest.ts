import {isAsync, ThenableIterator, ThenableOrIteratorOrValue, ThenableOrValue} from '../async/async'
import {resolveAsync, resolveAsyncAll} from '../async/ThenableSync'
import {Random} from '../random/Random'
import {interceptConsole, TConsoleType, throwOnConsoleError} from './interceptConsole'

export type TTestIteration<TState> = (rnd: Random, state: TState) => ThenableOrIteratorOrValue<any>

// region testIterationBuilder

export type TTestAction<TState> = (rnd: Random, state: TState) => ThenableOrIteratorOrValue<any>

interface IBeforeAfter<TState> {
	before?: TTestAction<TState>
	after?: TTestAction<TState>
}

interface ITestIterationAction<TState> extends IBeforeAfter<TState> {
	/** Probability weight */
	weight: number
}

export function testIterationBuilder<TState>({
	before,
	action,
	waitAsyncRandom,
	waitAsyncAll,
	after,
}: IBeforeAfter<TState> & {
	action: ITestIterationAction<TState> & {
		func: TTestAction<TState>,
	},
	waitAsyncRandom?: ITestIterationAction<TState>,
	waitAsyncAll?: ITestIterationAction<TState>,
}): TTestIteration<TState> {
	const sumWeights = action.weight
		+ (waitAsyncAll != null ? waitAsyncAll.weight : 0)
		+ (waitAsyncRandom != null ? waitAsyncRandom.weight : 0)

	const waitAsyncRandomWeight = waitAsyncRandom != null ? waitAsyncRandom.weight / sumWeights : 0
	const waitAsyncAllWeight = waitAsyncAll != null ? waitAsyncAll.weight / sumWeights : 0

	const asyncs = []
	function *testIteration(rnd: Random, state: TState): ThenableIterator<void> {
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

	return testIteration
}

// endregion

export type TTestIterator<TOptions> = (rnd: Random, options: TOptions) => ThenableOrIteratorOrValue<any>

export type TCreateState<TOptions, TState> = (rnd: Random, options: TOptions) => ThenableOrIteratorOrValue<TState>

// region testIteratorBuilder

export function testIteratorBuilder<
	TOptions,
	TState
>(
	createState: TCreateState<TOptions, TState>,
	{
		before,
		stopPredicate,
		testIteration,
		after,
	}: IBeforeAfter<TState> & {
		stopPredicate: (
			iterationNumber: number, timeStart: number, state: TState,
		) => ThenableOrIteratorOrValue<boolean>,
		testIteration: TTestIteration<TState>,
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

			yield testIteration(rnd, state)

			iterationNumber++
		}

		if (after != null) {
			yield after(rnd, state)
		}
	}

	return iterator
}

// endregion

export type TTestOptionsGenerator<TOptionsPattern, TOptions>
	= (rnd: Random, pattern: TOptionsPattern) => ThenableOrIteratorOrValue<TOptions>

// region test

export function *test<
	TOptionsPattern,
	TOptions,
>(
	seed: number|null,
	optionsPattern: TOptionsPattern,
	optionsGenerator: TTestOptionsGenerator<TOptionsPattern, TOptions>,
	testIterator: TTestIterator<TOptions>,
): ThenableIterator<any> {
	if (seed == null) {
		seed = new Random().nextSeed()
	}

	console.log(`\r\nseed = ${seed}`)
	const rnd = new Random(seed)

	const options = yield optionsGenerator(rnd, optionsPattern)

	yield testIterator(rnd, options)
}

// endregion

export interface ITestRunnerMetrics {
	iterationNumber: number
	timeFromStart: number
}

export type TTestRunnerStopPredicate<
	TTestRunnerMetrics extends ITestRunnerMetrics = ITestRunnerMetrics
> = (testRunnerMetrics: TTestRunnerMetrics)
	=> ThenableOrIteratorOrValue<boolean>

// region testRunner

function *testRunner<
	TContext,
	TTestRunnerMetrics extends ITestRunnerMetrics = ITestRunnerMetrics
>(
	_this: TContext,
	{
		stopPredicate,
		func,
		testRunnerMetrics,
	}: {
		stopPredicate: TTestRunnerStopPredicate<TTestRunnerMetrics>,
		func: (this: TContext, testRunnerMetrics: TTestRunnerMetrics) => ThenableOrIteratorOrValue<any>,
		testRunnerMetrics?: TTestRunnerMetrics,
	},
) {
	const timeStart = Date.now()
	if (testRunnerMetrics == null) {
		testRunnerMetrics = {} as any
	}
	testRunnerMetrics.iterationNumber = 0

	while (true) {
		const now = Date.now()
		testRunnerMetrics.timeFromStart = now - timeStart

		const doStop = yield stopPredicate(testRunnerMetrics)
		if (doStop) {
			break
		}

		yield func.call(_this, testRunnerMetrics)

		testRunnerMetrics.iterationNumber++
	}
}

// endregion

export interface ISearchBestErrorMetrics extends ITestRunnerMetrics {
	iterationsFromLastError?: number
	timeFromLastError?: number
	iterationsFromMinError?: number
	timeFromMinError?: number
	iterationsFromEqualError?: number
	timeFromEqualError?: number
}

export interface ISearchBestErrorParams<TMetrics> {
	customSeed?: number,
	metricsMin?: TMetrics,
	stopPredicate: (searchBestErrorMetrics: ISearchBestErrorMetrics)
		=> ThenableOrIteratorOrValue<boolean>
}

export type TCreateMetrics<TMetrics> = (metrics: ISearchBestErrorMetrics) => ThenableOrIteratorOrValue<TMetrics>

export type TCompareMetrics<TMetrics> = (metrics1: TMetrics, metrics2: TMetrics) => number

export type TSearchBestError<TMetrics> = <TContext>(_this: TContext, {
	customSeed,
	metricsMin,
	stopPredicate,
	createMetrics,
	compareMetrics,
	func,
}: ISearchBestErrorParams<TMetrics> & {
	createMetrics: TCreateMetrics<TMetrics>,
	compareMetrics: TCompareMetrics<TMetrics>,
	func: (this: TContext, seed: number, metrics: TMetrics, metricsMin: TMetrics) => ThenableOrIteratorOrValue<any>,
}) => ThenableOrIteratorOrValue<any>

// region searchBestErrorBuilder

export function searchBestErrorBuilder<TMetrics>({
	onFound,
	consoleOnlyBestErrors,
}: {
	onFound?: (reportMin: string) => ThenableOrIteratorOrValue<any>,
	consoleOnlyBestErrors?: boolean,
}): TSearchBestError<TMetrics> {
	return function*<TContext>(
		_this: TContext,
		{
			customSeed,
			metricsMin,
			stopPredicate,
			createMetrics,
			compareMetrics,
			func,
		}: ISearchBestErrorParams<TMetrics> & {
			createMetrics: TCreateMetrics<TMetrics>,
			compareMetrics: TCompareMetrics<TMetrics>,
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

			let lastErrorIteration: number
			let lastErrorTime: number
			let minErrorIteration: number
			let minErrorTime: number
			let equalErrorIteration: number
			let equalErrorTime: number
			const searchBestErrorMetrics: ISearchBestErrorMetrics = {} as any

			yield testRunner(_this,
				{
					stopPredicate: testRunnerMetrics => {
						const now = Date.now()
						if (lastErrorIteration != null) {
							testRunnerMetrics.iterationsFromLastError = testRunnerMetrics.iterationNumber - lastErrorIteration
						}
						if (lastErrorTime != null) {
							testRunnerMetrics.iterationsFromLastError = now - lastErrorTime
						}
						if (minErrorIteration != null) {
							testRunnerMetrics.iterationsFromMinError = testRunnerMetrics.iterationNumber - minErrorIteration
						}
						if (minErrorTime != null) {
							testRunnerMetrics.iterationsFromMinError = now - minErrorTime
						}
						if (equalErrorIteration != null) {
							testRunnerMetrics.iterationsFromEqualError = testRunnerMetrics.iterationNumber - equalErrorIteration
						}
						if (equalErrorTime != null) {
							testRunnerMetrics.iterationsFromEqualError = now - equalErrorTime
						}

						return customSeed != null || stopPredicate(testRunnerMetrics)
					},
					*func(testRunnerMetrics) {
						const metrics: TMetrics = yield createMetrics(testRunnerMetrics)

						const seed = customSeed != null ? customSeed : new Random().nextInt(2 << 29)

						try {
							yield func.call(this, seed, metrics, metricsMin || {} as any)
						} catch (error) {
							lastErrorIteration = testRunnerMetrics.iterationNumber
							lastErrorTime = Date.now()

							if (customSeed != null) {
								interceptConsoleDisable(() => console.log(`customSeed: ${customSeed}`, metrics))
								throw error
							} else {
								const compareMetricsResult = errorMin == null
									? null
									: compareMetrics(metrics, metricsMin)

								if (compareMetricsResult == null || compareMetricsResult <= 0) {
									equalErrorIteration = testRunnerMetrics.iterationNumber
									equalErrorTime = Date.now()
									if (compareMetricsResult !== 0) {
										minErrorIteration = testRunnerMetrics.iterationNumber
										minErrorTime = Date.now()
									}

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
						}
					},
					testRunnerMetrics: searchBestErrorMetrics,
				},
			)

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

export type TTestOptionsPatternBuilder<TMetrics, TOptionsPattern>
	= (metrics: TMetrics, metricsMin: TMetrics) => ThenableOrIteratorOrValue<TOptionsPattern>

export interface ITestOptionsBase<TMetrics> {
	metrics: TMetrics
	metricsMin: TMetrics
}

export type TRandomTest<TMetrics> = ({
	stopPredicate,
	searchBestError,
	customSeed,
	metricsMin,
}: ISearchBestErrorParams<TMetrics> & {
	searchBestError?: boolean,
}) => ThenableOrValue<any>

// region randomTestBuilder

export function randomTestBuilder<
	TMetrics,
	TOptionsPattern extends ITestOptionsBase<TMetrics>,
	TOptions extends ITestOptionsBase<TMetrics>,
>(
	createMetrics: (metrics: ISearchBestErrorMetrics) => ThenableOrIteratorOrValue<TMetrics>,
	optionsPatternBuilder: TTestOptionsPatternBuilder<TMetrics, TOptionsPattern>,
	optionsGenerator: TTestOptionsGenerator<TOptionsPattern, TOptions>,
	{
		compareMetrics,
		consoleThrowPredicate,
		searchBestError: _searchBestError,
		testIterator,
	}: {
		compareMetrics?: (metrics: TMetrics, metricsMin: TMetrics) => number,
		consoleThrowPredicate?: (this: TConsoleType, ...args: any[]) => boolean,
		searchBestError?: TSearchBestError<TMetrics>,
		testIterator: TTestIterator<TOptions>,
	},
): TRandomTest<TMetrics> {
	return function randomTest({
		stopPredicate,
		searchBestError,
		customSeed,
		metricsMin,
	}: ISearchBestErrorParams<TMetrics> & {
		searchBestError?: boolean,
	}): ThenableOrValue<any> {
		const _this = this
		function *func(this: typeof _this, seed: number|null, metrics, _metricsMin) {
			const optionsPattern = yield optionsPatternBuilder(metrics, _metricsMin)
			return test(seed, optionsPattern, optionsGenerator, testIterator)
		}

		return resolveAsync(throwOnConsoleError(
			_this,
			consoleThrowPredicate,
			function(this: typeof _this) {
				if (searchBestError) {
					return _searchBestError(
						this,
						{
							customSeed,
							metricsMin,
							stopPredicate,
							createMetrics,
							compareMetrics,
							func,
						},
					)
				} else {
					return testRunner(this, {
						stopPredicate,
						*func(testRunnerMetrics) {
							const metrics = yield createMetrics(testRunnerMetrics)
							return func.call(this, customSeed, metrics, metricsMin)
						},
					})
				}
			},
		))
	}
}

// endregion

// region

// type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N
type If<T, Y, N> = T extends boolean ? (T extends false ? N : Y) : N
type Not<T> = T extends true ? false : true
type IfNever<T, Y, N> = [T] extends [never] ? Y : N
type IsNever<T> = IfNever<T, true, false>
type NotNever<T> = IfNever<T, false, true>

export type IRandomTestFactory<
	TMetrics = never,
	TOptionsPattern = never,
	TOptions = never,
	TState = never,
	HasCreateMetrics = false,
	HasCompareMetrics = false,
	HasOptionsPatternBuilder = false,
	HasOptionsGenerator = false,
	HasCreateState = false,
	HasAction = false,
> = {}
& If<HasCreateMetrics, {}, {
	createMetrics<_TMetrics>(value: TCreateMetrics<_TMetrics>): IRandomTestFactory<
		_TMetrics, TOptionsPattern, TOptions, TState,
		true, HasCompareMetrics, HasOptionsPatternBuilder, HasOptionsGenerator, HasCreateState, HasAction
	>,
}>
& If<HasCompareMetrics | IsNever<TMetrics>, {}, {
	compareMetrics(value: TCompareMetrics<TMetrics>): IRandomTestFactory<
		TMetrics, TOptionsPattern, TOptions, TState,
		HasCreateMetrics, true, HasOptionsPatternBuilder, HasOptionsGenerator, HasCreateState, HasAction
	>,
}>
& If<HasOptionsPatternBuilder | IsNever<TMetrics>, {}, {
	optionsPatternBuilder<_TOptionsPattern>(
		value: TTestOptionsPatternBuilder<TMetrics, _TOptionsPattern>,
	): IRandomTestFactory<
		TMetrics, _TOptionsPattern, TOptions, TState,
		HasCreateMetrics, HasCompareMetrics, true, HasOptionsGenerator, HasCreateState, HasAction
	>,
}>
& If<HasOptionsGenerator | IsNever<TOptionsPattern>, {}, {
	optionsGenerator<_TOptions>(value: TTestOptionsGenerator<TOptionsPattern, _TOptions>): IRandomTestFactory<
		TMetrics, TOptionsPattern, _TOptions, TState,
		HasCreateMetrics, HasCompareMetrics, HasOptionsPatternBuilder, true, HasCreateState, HasAction
	>,
}>
& If<HasCreateState | IsNever<TOptions>, {}, {
	createState<_TState>(value: TCreateState<TOptions, _TState>): IRandomTestFactory<
		TMetrics, TOptionsPattern, TOptions, _TState,
		HasCreateMetrics, HasCompareMetrics, HasOptionsPatternBuilder, HasOptionsGenerator, true, HasAction
	>,
}>
& If<HasAction | IsNever<TState>, {}, {
	action(value: TTestAction<TState>): IRandomTestFactory<
		TMetrics, TOptionsPattern, TOptions, TState,
		HasCreateMetrics, HasCompareMetrics, HasOptionsPatternBuilder, HasOptionsGenerator, HasCreateState, true
	>,
}>

const x: IRandomTestFactory

class RandomTestFactory<
	TMetrics = any,
	TOptionsPattern = any,
	TOptions = any,
	TState = any,
> {
	private _createMetrics: TCreateMetrics<any>
	private _compareMetrics: TCompareMetrics<any>
	private _optionsPatternBuilder: TTestOptionsPatternBuilder<TMetrics, TOptionsPattern>
	private _optionsGenerator: TTestOptionsGenerator<TOptionsPattern, TOptions>
	private _createState: TCreateState<TOptions, TState>
	private _action: TTestAction<TState>

	public createMetrics<_TMetrics>(value: TCreateMetrics<_TMetrics>) {
		this._createMetrics = value
		return this
	}

	public compareMetrics(value: TCompareMetrics<TMetrics>) {
		this._compareMetrics = value
		return this
	}

	public optionsPatternBuilder(value: TTestOptionsPatternBuilder<TMetrics, TOptionsPattern>) {
		this._optionsPatternBuilder = value
		return this
	}

	public optionsGenerator(value: TTestOptionsGenerator<TOptionsPattern, TOptions>) {
		this._optionsGenerator = value
		return this
	}

	public createState(value: TCreateState<TOptions, TState>) {
		this._createState = value
		return this
	}

	public action(value: TTestAction<TState>) {
		this._action = value
		return this
	}

	public testIterationBuilder
}

export function randomTestFactory(): IRandomTestFactory {
	return new RandomTestFactory() as any
}

// endregion
