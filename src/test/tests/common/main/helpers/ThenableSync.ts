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
})
