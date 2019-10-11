/* eslint-disable class-methods-use-this */
import {delay} from '../../../../../main/common/helpers/helpers'
import {now} from '../../../../../main/common/helpers/performance'
import {assert} from '../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../main/common/test/Mocha'

describe('common > helpers > performance', async function() {
	it('now', async function() {
		const interval = 200
		await delay(interval)
		const start = now()
		await delay(interval)
		assert.equal(Math.round((now() - start) / interval), 1)
		await delay(interval)
		assert.equal(Math.round((now() - start) / interval), 2)
		await delay(interval)
		assert.equal(Math.round((now() - start) / interval), 3)
	})
})
