// @ts-ignore
import {calcPerformance} from 'rdtsc'
import {describe, it, xit} from '../../../main/common/test/Mocha'
import {fastNow} from '../../../main/common/time/helpers'

describe('fastNow perf', function() {
	it('base', function() {
		this.timeout(300000)

		let value = 0

		const result = calcPerformance(
			10000,
			() => {
				// empty
			},
			() => { // 4
				value = fastNow()
			},
			() => { // 387 (x 96.75)
				value = Date.now()
			},
		)

		/*
		96.75
		16.95
		26
		35.5
		20.8
		34.45
		35.18
		32
		 */

		console.log(result)
	})
})
