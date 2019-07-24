/* tslint:disable:no-empty no-identical-functions */
// @ts-ignore
// noinspection ES6UnusedImports
import { copy as deepClone } from 'fast-copy'
// @ts-ignore
// noinspection ES6UnusedImports
import { deepEqual as deepStrictEqual } from 'fast-equals'
import {BASE, isRefer, NEWER, NONE, OLDER, TestMerger} from './src/TestMerger'

declare const assert
declare const after
declare function deepStrictEqual(a, b): boolean
declare function deepClone<T extends any>(o: T): T

describe('common > extensions > merge > ObjectMerger', function() {
	this.timeout(20000)

	const testMerger = TestMerger.test

	after(function() {
		console.log('Total ObjectMerger tests >= ' + TestMerger.totalTests)
	})

	function canBeReferObject(value) {
		return value != null
			&& !isRefer(value)
			&& (typeof value === 'object' || typeof value === 'function')
	}

	it('base', function() {
		const common = [null, void 0, 0, 1, false, true, BASE, OLDER, NEWER]
		testMerger({
			base: [...common, {}, { x: {y: 1} }, { x: {y: 2, z: 3} }, { x: {y: 4}, z: 3 }],
			older: [...common, {}, { x: {y: 1} }, { x: {y: 2, z: 3} }, { x: {y: 4}, z: 3 }],
			newer: [...common, {}, { x: {y: 1} }, { x: {y: 2, z: 3} }, { x: {y: 4}, z: 3 }],
			preferCloneOlderParam: [null, false, true],
			preferCloneNewerParam: [null, false, true],
			preferCloneMeta: [null, false, true],
			valueType: [null],
			valueFactory: [null],
			setFunc: [false, true],
			exclude: o => {
				if (o.newer === NEWER || (o.base === NEWER || o.older === NEWER) && !canBeReferObject(o.newer)) {
					return true
				}
				if (o.older === OLDER || (o.base === OLDER || o.newer === OLDER) && !canBeReferObject(o.older)) {
					return true
				}
				if (o.base === BASE || (o.older === BASE || o.newer === BASE) && !canBeReferObject(o.base)) {
					return true
				}
				return false
			},
			expected: {
				error: null,
				returnValue: o => !deepStrictEqual(o.base, o.newer) || !deepStrictEqual(o.base, o.older),
				setValue: o => !o.setFunc || deepStrictEqual(o.base, o.newer)
					? (!o.setFunc || deepStrictEqual(o.base, o.older) ? NONE : OLDER)
					: NEWER,
				base: BASE,
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})
	})
})
