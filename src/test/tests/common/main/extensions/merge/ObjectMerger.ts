/* tslint:disable:no-empty no-identical-functions max-line-length */
// @ts-ignore
// noinspection ES6UnusedImports
import deepClone from 'fast-copy'
// @ts-ignore
// noinspection ES6UnusedImports
import { deepEqual as deepStrictEqual } from 'fast-equals'
import {BASE, IMergerOptionsVariant, isRefer, NEWER, NONE, OLDER, TestMerger} from './src/TestMerger'

declare const assert
declare const after
declare function deepStrictEqual(a, b): boolean
declare function deepClone<T extends any>(o: T): T

describe('common > extensions > merge > ObjectMerger', function() {
	this.timeout(60000)

	const testMerger = TestMerger.test

	after(function() {
		console.log('Total ObjectMerger tests >= ' + TestMerger.totalTests)
	})

	function canBeReferObject(value) {
		return value != null
			&& !isRefer(value)
			&& (value.constructor === Object || typeof value === 'function')
	}

	function mustBeChanged(o: IMergerOptionsVariant) {
		if (o.base === o.older && o.base === o.newer) {
			return false
		}

		if (o.base != null && o.base.constructor === Object && Object.isFrozen(o.base)) {
			return true
		}

		return !deepStrictEqual(o.base, o.newer) || !deepStrictEqual(o.base, o.older)
	}

	it('combinations', function() {
		const common = [null, void 0, 0, 1, false, true, '', '1', BASE, OLDER, NEWER]
		testMerger({
			base: [...common, {}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 }, Object.freeze({ x: {y: 1} }), new Date(1), new Date(2)],
			older: [...common, {}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 }, Object.freeze({ x: {y: 1} }), new Date(1), new Date(2)],
			newer: [...common, {}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 }, Object.freeze({ x: {y: 1} }), new Date(1), new Date(2)],
			preferCloneOlderParam: [null, false, true],
			preferCloneNewerParam: [null, false, true],
			preferCloneMeta: [null, false, true],
			valueType: [null],
			valueFactory: [null],
			setFunc: [false, true],
			exclude: o => {
				// if (typeof o.older.constructor === Object && typeof o.newer.constructor === Object) {
				// 	return true
				// }
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
				returnValue: mustBeChanged,
				setValue: o => {
					if (!o.setFunc || !mustBeChanged(o)) {
						return NONE
					}
					if (o.older != null && o.older.constructor === Object && !Object.isFrozen(o.older)
						&& o.newer != null && o.newer.constructor === Object
					) {
						return OLDER
					}

					if (!deepStrictEqual(o.base, o.newer)
						&& o.older !== o.newer
						&& deepStrictEqual(o.older, o.newer)
						&& o.older instanceof Date && o.newer instanceof Date
						&& o.preferCloneMeta == null && o.preferCloneNewerParam && !o.preferCloneOlderParam
					) {
						return OLDER
					}

					return !deepStrictEqual(o.base, o.newer)
						|| o.newer !== o.base
							&& o.base != null && o.base.constructor === Object && Object.isFrozen(o.base)
						? NEWER
						: OLDER
				},
				base: BASE,
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})
	})

	xit('specific', function() {
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
				if (o.older.constructor === Object && o.newer.constructor === Object) {
					return true
				}
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
