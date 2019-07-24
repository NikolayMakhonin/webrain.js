/* tslint:disable:no-empty no-identical-functions */
import { deepEqual as deepStrictEqual } from 'fast-equals'
import {BASE, NEWER, OLDER, TestMerger} from './src/TestMerger'

declare const assert
declare const after
declare function deepStrictEqual(a, b): boolean

describe('common > extensions > merge > ObjectMerger', function() {
	this.timeout(20000)

	const testMerger = TestMerger.test

	after(function() {
		console.log('Total ObjectMerger tests >= ' + TestMerger.totalTests)
	})

	it('base', function() {
		testMerger({
			base: [null, void 0, 0, 1, false, true],
			older: [null, void 0, 0, 1, false, true],
			newer: [null, void 0, 0, 1, false, true],
			preferCloneOlderParam: [false, true],
			preferCloneNewerParam: [false, true],
			preferCloneMeta: [false, true],
			valueType: [null],
			valueFactory: [null],
			setFunc: [false, true],
			exclude: o => {
				if (deepStrictEqual(o.base, o.newer)) {
					return true
				}
				return false
			},
			expected: {
				error: null,
				returnValue: true,
				setValue: NEWER,
				base: BASE,
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})
	})
})
