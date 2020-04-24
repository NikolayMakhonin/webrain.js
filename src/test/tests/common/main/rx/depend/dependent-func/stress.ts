/* tslint:disable:no-identical-functions no-shadowed-variable */
import {assert} from '../../../../../../../main/common/test/Assert'
import {describe, it, xdescribe, xit} from '../../../../../../../main/common/test/Mocha'
import {stressTest} from '../src/stress-test'

xdescribe('common > main > rx > depend > dependent-func / stress', function() {
	this.timeout(60 * 60 * 1000)

	xit('all', async function() {
		await stressTest({
			// seed: 20385142,
			testsCount: 1000,
			iterationsPerCall: 2000,
			maxLevelsCount: [1, 10],
			maxFuncsCount: [1, 10],
			maxCallsCount: [1, 100],
			countRootCalls: [1, 5],
			disableAsync: null,
			disableDeferred: null,
			disableLazy: null,
		})
	})

	it('async + deferred + sync + lazy', async function() {
		await stressTest({
			// seed: 1,
			testsCount: 1000,
			iterationsPerCall: 2000,
			maxLevelsCount: [1, 10],
			maxFuncsCount: [1, 10],
			maxCallsCount: [1, 100],
			countRootCalls: [1, 5],
			disableAsync: false,
			disableDeferred: false,
			disableLazy: false,
		})
	})

	xit('async + deferred + sync', async function() {
		await stressTest({
			// seed: 1,
			testsCount: 100,
			iterationsPerTest: 200000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: false,
			disableDeferred: false,
			disableLazy: true,
		})
	})

	xit('deferred + sync', async function() {
		await stressTest({
			// seed: 843622927,
			testsCount: 100,
			iterationsPerTest: 200000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: true,
			disableDeferred: false,
			disableLazy: true,
		})
	})

	xit('async + sync + lazy', async function() {
		await stressTest({
			// seed: 593595214,
			testsCount: 100,
			iterationsPerTest: 200000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: false,
			disableDeferred: true,
			disableLazy: false,
		})
	})

	xit('async + sync', async function() {
		await stressTest({
			// seed: 788871949,
			testsCount: 100,
			iterationsPerTest: 200000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: false,
			disableDeferred: true,
			disableLazy: true,
		})
	})

	xit('sync + lazy', async function() {
		await stressTest({
			// seed: 92684389,
			testsCount: 100,
			iterationsPerTest: 200000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: true,
			disableDeferred: true,
			disableLazy: false,
		})
	})

	xit('sync', async function() {
		await stressTest({
			// seed: 1,
			testsCount: 100,
			iterationsPerTest: 200000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: true,
			disableDeferred: true,
			disableLazy: true,
		})
	})
})
