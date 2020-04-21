/* tslint:disable:no-identical-functions no-shadowed-variable */
import {assert} from '../../../../../../../main/common/test/Assert'
import {describe, it, xit} from '../../../../../../../main/common/test/Mocha'
import {clearCallStates} from '../src/helpers'
import {stressTest} from '../src/stress-test'

describe('common > main > rx > depend > dependent-func / stress', function() {
	this.timeout(600000)

	xit('async + deferred + sync + lazy', async function() {
		await stressTest({
			// seed: 1,
			testsCount: 100,
			iterationsPerTest: 100000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: false,
			disableDeferred: false,
			disableLazy: false,
		})

		clearCallStates()
	})

	xit('async + deferred + sync', async function() {
		await stressTest({
			// seed: 1,
			testsCount: 100,
			iterationsPerTest: 100000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: false,
			disableDeferred: false,
			disableLazy: true,
		})

		clearCallStates()
	})

	xit('async + sync + lazy', async function() {
		await stressTest({
			// seed: 1,
			testsCount: 100,
			iterationsPerTest: 100000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: false,
			disableDeferred: true,
			disableLazy: false,
		})

		clearCallStates()
	})

	xit('async + sync', async function() {
		await stressTest({
			// seed: 1,
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

		clearCallStates()
	})

	it('sync + lazy', async function() {
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

		clearCallStates()
	})

	it('sync', async function() {
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
