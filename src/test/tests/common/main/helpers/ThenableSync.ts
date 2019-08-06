import {ThenableSync} from '../../../../../main/common/helpers/ThenableSync'
import {TestThenableSync} from './src/TestThenableSync'

declare const assert
declare const after

describe('common > main > helpers > ThenableSync', function() {
	this.timeout(60000)

	const testThenableSync = TestThenableSync.test

	after(function() {
		console.log('Total ObjectMerger tests >= ' + TestThenableSync.totalTests)
	})

	it('variants', function() {
		testThenableSync({
			expected: {
				value: o => o.value,
			},
			actions: null,
		})
	})

	xit('performance', function() {
		this.timeout(120000)

		const time0 = new Date().getTime()
		do {
			let resolve
			let result

			new ThenableSync(o => {
				resolve = o
			})
				.then(o => true)
				.then(o => (result = o))

			resolve(1)
		} while (new Date().getTime() - time0 < 60000)
	})
})
