/* tslint:disable:no-identical-functions no-shadowed-variable */
import {webrainOptions} from '../../../../../../../main/common/helpers/webrainOptions'
import {describe, it, xdescribe, xit} from '../../../../../../../main/common/test/Mocha'
import {iterationBuilder, iteratorBuilder, RandomTest} from '../../../../../../../main/common/test/RandomTest'
import {searchBestErrorBuilderNode} from "../../../../../../../main/node/test/RandomTest";

declare const beforeEach: any

describe('common > main > rx > depend > bindings > stress', function() {
	this.timeout(24 * 60 * 60 * 1000)

	beforeEach(function() {
		webrainOptions.callState.garbageCollect.disabled = false
		webrainOptions.callState.garbageCollect.bulkSize = 100
		webrainOptions.callState.garbageCollect.interval = 1000
		webrainOptions.callState.garbageCollect.minLifeTime = 500
	})

	const randomTest = new RandomTest(
		// createMetrics
		() => {
			return {
				count: 0,
			}
		},
		// optionsPatternBuilder
		(metrics, metricsMin) => {
			return {
				metrics,
				metricsMin,
			}
		},
		// optionsGenerator
		(rnd, {
			metrics,
			metricsMin,
		}) => {
			return {
				metrics,
				metricsMin,
			}
		},
		{
			compareMetrics(metrics, metricsMin) {
				if (metrics.count !== metricsMin.count) {
					return metrics.count < metricsMin.count
				}
				return true
			},
			consoleThrowPredicate() {
				return this === 'error' || this === 'warn'
			},
			searchBestError: searchBestErrorBuilderNode({
				reportFilePath: './tmp/test-cases/depend/bindings/base.txt',
				consoleOnlyBestErrors: true,
			}),
			testIterator: iteratorBuilder(
				(rnd, options) => {
					return {
						options,
					}
				},
				{
					stopPredicate(iterationNumber, timeStart, state) {
						return iterationNumber >= 100
					},
					iteration: iterationBuilder({
						action: {
							weight: 1,
							func(rnd, state) {
								// TODO
							},
						},
					}),
				},
			),
		},
	)

	it('base', async function() {
		await randomTest.run({
			stopPredicate: (iterationNumber, timeElapsed) => {
				return timeElapsed >= 5000
			},
			customSeed: null,
			metricsMin: null,
			searchBestError: true,
		})
	})
})
