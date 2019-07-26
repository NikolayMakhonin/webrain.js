/* tslint:disable:no-empty no-identical-functions max-line-length */
// @ts-ignore
// noinspection ES6UnusedImports
import deepClone from 'fast-copy'
// @ts-ignore
// noinspection ES6UnusedImports
import { deepEqual as deepStrictEqual } from 'fast-equals'
import {IMergeable, IMergeValue} from '../../../../../../main/common/extensions/merge/contracts'
import {registerMergeable} from '../../../../../../main/common/extensions/merge/mergers'
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

		if (o.base instanceof Class
			&& (deepStrictEqual(o.base, o.older) || deepStrictEqual(o.base.value, o.older) && o.older != null && o.older.constructor === Object)
			&& (deepStrictEqual(o.base, o.newer) || deepStrictEqual(o.base.value, o.newer) && o.newer != null && o.newer.constructor === Object)
		) {
			return false
		}

		return !deepStrictEqual(o.base, o.newer) || !deepStrictEqual(o.base, o.older)
	}

	class Class implements IMergeable<Class, object> {
		public value: any

		constructor(value: any) {
			this.value = value
		}

		public canMerge(source: (Class | object)): boolean {
			if (source.constructor !== Class && source.constructor !== Object) {
				return false
			}
			return true
		}

		public merge(
			merge: IMergeValue,
			older: Class | object,
			newer: Class | object,
			preferCloneOlder?: boolean,
			preferCloneNewer?: boolean,
		): boolean {
			let changed = false
			changed = merge(
				this.value,
				older instanceof Class ? (older as any).value : older,
				newer instanceof Class ? (newer as any).value : newer,
				o => this.value = o) || changed

			return changed
		}
	}

	registerMergeable(Class)

	it('combinations', function() {
		assert.ok(deepStrictEqual(
			new Class({ a: {a: 1, b: 2}, b: 3 }),
			new Class({ a: {a: 1, b: 2}, b: 3 }),
		))

		assert.ok(deepStrictEqual(
			deepClone(new Class({ a: {a: 1, b: 2}, b: 3 })),
			new Class({ a: {a: 1, b: 2}, b: 3 }),
		))

		// tslint:disable-next-line:use-primitive-type no-construct
		const symbol = { x: new String('SYMBOL') }
		const symbolClone = deepClone(symbol)
		assert.ok(deepStrictEqual(symbol, symbolClone))

		const common = [null, void 0, 0, 1, false, true, '', '1', BASE, OLDER, NEWER]
		testMerger({
			base: [/* new Class(new Date(1)), new Class({ a: {a: 1, b: 2}, b: 3 }), new Class(Object.freeze({ x: {y: 1} })), */ ...common, {}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 }, Object.freeze({ x: {y: 1} }), new Date(1), new Date(2)],
			older: [/* new Class(new Date(1)), new Class({ a: {a: 1, b: 2}, b: 3 }), new Class(Object.freeze({ x: {y: 1} })), */ ...common, {}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 }, Object.freeze({ x: {y: 1} }), new Date(1), new Date(2)],
			newer: [/* new Class(new Date(1)), new Class({ a: {a: 1, b: 2}, b: 3 }), new Class(Object.freeze({ x: {y: 1} })), */ ...common, {}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 }, Object.freeze({ x: {y: 1} }), new Date(1), new Date(2)],
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
				if (o.preferCloneMeta != null
					&& (o.older != null && typeof o.older === 'object'
						|| o.newer != null && typeof o.newer === 'object')
				) {
					return true
				}

				if (typeof o.base === 'object' && !Object.isFrozen(o.base) && !isRefer(o.base)) {
					o.base = deepClone(o.base)
				}
				if (typeof o.older === 'object' && !Object.isFrozen(o.older) && !isRefer(o.base)) {
					o.older = deepClone(o.older)
				}

				return false
			},
			expected: {
				error: null,
				returnValue: mustBeChanged,
				setValue: o => {
					const deepStrictEqual2 = deepStrictEqual

					if (!o.setFunc || !mustBeChanged(o)) {
						return NONE
					}

					if (o.base != null && o.base.constructor === Object && !Object.isFrozen(o.base)
						&& o.older != null && o.older.constructor === Object
						&& o.newer != null && o.newer.constructor === Object
					) {
						return NONE
					}

					if (o.base instanceof Class
						&& (o.older instanceof Class || o.older != null && o.older.constructor === Object)
						&& (o.newer instanceof Class || o.newer != null && o.newer.constructor === Object)
					) {
						return NONE
					}

					if (o.base instanceof Class
						&& !(o.older instanceof Class || o.older != null && o.older.constructor === Object)
						&& (o.newer instanceof Class || o.newer != null && o.newer.constructor === Object)
						&& !deepStrictEqual2(o.base, o.newer)
						&& !deepStrictEqual2(o.base.value, o.newer)
					) {
						return NONE
					}

					if (o.base != null && o.base.constructor === Object && !Object.isFrozen(o.base)
						&& !(o.older != null && o.older.constructor === Object)
						&& (o.newer != null && o.newer.constructor === Object)
						&& !deepStrictEqual2(o.base, o.newer)
					) {
						return NONE
					}

					if (!(o.base instanceof Class)
						&& o.older instanceof Class
						&& (o.newer instanceof Class || o.newer != null && o.newer.constructor === Object)
					) {
						return OLDER
					}

					if (!deepStrictEqual2(o.base, o.newer)
						&& o.older !== o.newer
						&& deepStrictEqual2(o.older, o.newer)
						&& o.older instanceof Date && o.newer instanceof Date
						&& o.preferCloneNewer && !o.preferCloneOlder
					) {
						return OLDER
					}

					if ((o.older instanceof Class || o.older != null && o.older.constructor === Object)
						&& o.newer != null && o.newer.constructor === Object
						&& (o.preferCloneOlder && !deepStrictEqual2(o.older, o.newer)
							|| o.preferCloneOlder && o.preferCloneNewer)
						|| o.newer === o.older && (o.preferCloneOlder || o.preferCloneNewer)
					) {
						return deepClone(o.newer)
					}

					if (o.older != null && o.older.constructor === Object && !Object.isFrozen(o.older)
						&& o.newer != null && o.newer.constructor === Object
					) {
						return OLDER
					}

					return !(deepStrictEqual2(o.base, o.newer)
							|| o.base instanceof Class && deepStrictEqual2(o.base.value, o.newer)
							&& o.newer != null && o.newer.constructor === Object)
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
