import {assert} from '../../../../../main/common/test/Assert'
import {describe, it, xit} from '../../../../../main/common/test/Mocha'
import {TestThenableSync, ValueType} from './src/TestThenableSync'

declare const after

describe('common > main > helpers > ThenableSync', function() {
	this.timeout(120000)

	const testThenableSync = TestThenableSync.test

	after(function() {
		console.log('Total ThenableSync tests >= ' + TestThenableSync.totalTests)
	})

	it('variants', function() {
		testThenableSync({
			exclude: o => {
				if (o.thenValue0 === ValueType.IteratorThrow && o.thenValue1 === ValueType.IteratorThrow) {
					return true
				}
				if (o.createValue0 === ValueType.IteratorThrow && o.createValue1 === ValueType.IteratorThrow) {
					return true
				}
				return false
			},
			expected: {
				value: o => {
					return o.value
				},
			},
			actions: null,
		})
	})
	//
	// it('variants', function() {
	// 	testThenableSync({
	// 		exclude: o => {
	// 			if ((o.type === ResolveType.Rejected
	// 				|| o.type === ResolveType.Throwed
	// 				|| o.type === ResolveType.Reject
	// 				|| o.valueType === ResolveType.Rejected
	// 				|| o.valueType === ResolveType.Throwed
	// 				|| o.valueType === ResolveType.Reject)
	// 				&& (o.getValueWithResolve || o.createWithIterator)) {
	// 				return true
	// 			}
	//
	// 			return false
	// 		},
	// 		expected: {
	// 			value: o => {
	// 				return o.value
	// 			},
	// 		},
	// 		actions: null,
	// 	})
	// })

	// xit('performance', function() {
	// 	this.timeout(120000)
	//
	// 	const time0 = new Date().getTime()
	// 	do {
	// 		let resolve
	// 		let result
	//
	// 		new ThenableSync(o => {
	// 			resolve = o
	// 		})
	// 			.then(o => true)
	// 			.then(o => (result = o))
	//
	// 		resolve(1)
	// 	} while (new Date().getTime() - time0 < 60000)
	// })
})
