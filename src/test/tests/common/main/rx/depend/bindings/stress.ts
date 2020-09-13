/* tslint:disable:no-identical-functions no-shadowed-variable */
import {webrainOptions} from '../../../../../../../main/common/helpers/webrainOptions'
import {assert} from '../../../../../../../main/common/test/Assert'
import {describe, it, xdescribe, xit} from '../../../../../../../main/common/test/Mocha'
import {stressTest} from '../src/stress-test'

declare const beforeEach: any

describe('common > main > rx > bindings > stress', function() {
	this.timeout(24 * 60 * 60 * 1000)

	beforeEach(function() {
		webrainOptions.callState.garbageCollect.disabled = false
		webrainOptions.callState.garbageCollect.bulkSize = 100
		webrainOptions.callState.garbageCollect.interval = 1000
		webrainOptions.callState.garbageCollect.minLifeTime = 500
	})

	it('all', async function() {
		await stressTest({
			// seed: 649781656,
			testsCount: 100000,
			iterationsPerCall: 500,
			maxLevelsCount: [1, 10],
			maxFuncsCount: [1, 10],
			maxCallsCount: [1, 100],
			countRootCalls: [1, 5],
			disableAsync: null,
			disableDeferred: null,
			disableLazy: null,
		})
	})
})
