/* tslint:disable:no-identical-functions no-shadowed-variable */
import {AsyncValueOf} from '../../../../../main/common/async/async'
import {webrainOptions} from '../../../../../main/common/helpers/webrainOptions'
import {Random} from '../../../../../main/common/random/Random'
import {assert} from '../../../../../main/common/test/Assert'
import {describe, it, xdescribe, xit} from '../../../../../main/common/test/Mocha'
import {
	ISearchBestErrorMetrics,
	randomTestBuilder, randomTestFactory,
	searchBestErrorBuilder,
	testIterationBuilder,
	testIteratorBuilder,
} from '../../../../../main/common/test/randomTest'

declare const beforeEach: any

describe('common > main > test > randomTest', function () {
	this.timeout(24 * 60 * 60 * 1000)

	// region metrics

	function createMetrics(testRunnerMetrics: ISearchBestErrorMetrics) {
		return {
			metric: 0,
		}
	}
	type IMetrics = AsyncValueOf<ReturnType<typeof createMetrics>>

	function compareMetrics(metrics: IMetrics, metricsMin: IMetrics): number {
		if (metrics.metric !== metricsMin.metric) {
			return metrics.metric < metricsMin.metric ? -1 : 0
		}
		return 0
	}

	// endregion

	// region options

	function optionsPatternBuilder(metrics: IMetrics, metricsMin: IMetrics) {
		return {
			option: ['value1', 'value2'],
			metrics,
			metricsMin,
		}
	}
	type IOptionsPattern = AsyncValueOf<ReturnType<typeof optionsPatternBuilder>>

	function optionsGenerator(rnd: Random, {
		option,
		metrics,
		metricsMin,
	}: IOptionsPattern) {
		return {
			option: rnd.nextArrayItem(option),
			metrics,
			metricsMin,
		}
	}
	type IOptions = AsyncValueOf<ReturnType<typeof optionsGenerator>>

	// endregion

	// region state

	function createState(rnd: Random, options: IOptions) {
		return {
			value: 'state_' + options.option,
			options,
		}
	}
	type IState = AsyncValueOf<ReturnType<typeof createState>>

	// endregion

	// region action

	function action(rnd: Random, state: IState) {
		assert.ok(['state_value1', 'state_value2'].indexOf(state.value) >= 0)
		assert.ok(['value1', 'value2'].indexOf(state.options.option) >= 0)
		assert.ok(typeof state.options.metrics.metric === 'number')
	}

	// endregion

	// region testIteration

	const testIteration = testIterationBuilder({
		action: {
			weight: 1,
			func  : action,
		},
	})

	// endregion

	// region testIterator

	const testIterator = testIteratorBuilder(
		createState,
		{
			stopPredicate(iterationNumber, timeStart, state) {
				return iterationNumber >= 100
			},
			testIteration,
		},
	)

	// endregion

	// region randomTest

	const randomTest = randomTestBuilder(
		createMetrics,
		optionsPatternBuilder,
		optionsGenerator,
		{
			compareMetrics,
			consoleThrowPredicate() {
				return this === 'error' || this === 'warn'
			},
			// searchBestError: searchBestErrorBuilderNode({
			// 	reportFilePath: './tmp/test-cases/depend/bindings/base.txt',
			// 	consoleOnlyBestErrors: true,
			// }),
			searchBestError: searchBestErrorBuilder({
				consoleOnlyBestErrors: true,
			}),
			testIterator,
		},
	)

	// endregion

	// it('factory', async function() {
	// 	const result = randomTestFactory()
	// 		.createMetrics(() => {
	// 			return {
	// 				count: 123,
	// 			}
	// 		})
	// 		// .compareMetrics((metrics, metricsMin): number => {
	// 		// 	if (metrics.count !== metricsMin.count) {
	// 		// 		return metrics.count < metricsMin.count ? -1 : 0
	// 		// 	}
	// 		// 	return 0
	// 		// })
	// 		.optionsPatternBuilder((metrics, metricsMin) => {
	// 			return {
	// 				metrics,
	// 				metricsMin,
	// 			}
	// 		})
	// 		.optionsGenerator((rnd: Random, {
	// 			metrics,
	// 			metricsMin,
	// 		}) => {
	// 			return {
	// 				metrics,
	// 				metricsMin,
	// 			}
	// 		})
	// 		.createState((rnd, options) => {
	// 			return {
	// 				options,
	// 				x: 'qwe',
	// 			}
	// 		})
	// 		.action((rnd, state) => {
	// 			// TODO
	// 		})
	// })

	it('base', async function () {
		await randomTest({
			stopPredicate: testRunnerMetrics => {
				return testRunnerMetrics.iterationNumber >= 50
			},
			customSeed     : null,
			metricsMin     : null,
			searchBestError: true,
		})
	})
})
