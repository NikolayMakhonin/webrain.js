/* tslint:disable:no-empty no-identical-functions max-line-length no-construct use-primitive-type */
// @ts-ignore
// noinspection ES6UnusedImports
import deepClone from 'fast-copy'
// @ts-ignore
// noinspection ES6UnusedImports
import {
	circularDeepEqual as circularDeepStrictEqual,
} from 'fast-equals'
import {IMergeable, IMergeOptions, IMergeValue} from '../../../../../../main/common/extensions/merge/contracts'
import {registerMergeable} from '../../../../../../main/common/extensions/merge/mergers'
import {ArrayMap} from '../../../../../../main/common/lists/ArrayMap'
import {ArraySet} from '../../../../../../main/common/lists/ArraySet'
import {isFrozenWithoutUniqueId} from '../../../../../../main/common/lists/helpers/object-unique-id'
import {fillMap, fillObject, fillObjectKeys, fillSet} from '../../../../../../main/common/lists/helpers/set'
import {ObjectHashMap} from '../../../../../../main/common/lists/ObjectHashMap'
import {ObjectMap} from '../../../../../../main/common/lists/ObjectMap'
import {ObjectSet} from '../../../../../../main/common/lists/ObjectSet'
import {ObservableMap} from '../../../../../../main/common/lists/ObservableMap'
import {ObservableSet} from '../../../../../../main/common/lists/ObservableSet'
import {SortedList} from '../../../../../../main/common/lists/SortedList'
import {toIterable} from '../../lists/src/helpers/common'
import {createComplexObject, IComplexObjectOptions} from '../../src/helpers/helpers'
import {BASE, IMergerOptionsVariant, isRefer, NEWER, NONE, OLDER, TestMerger} from './src/TestMerger'

declare const assert
declare const after
// declare function deepStrictEqual(a, b): boolean
// declare function circularDeepStrictEqual(a, b): boolean
// declare function deepClone<T = any>(o: T): T

function circularDeepStrictEqualExt(a, b): boolean {
	if (isFrozenWithoutUniqueId(a) || isFrozenWithoutUniqueId(b)) {
		return a === b
	}
	return circularDeepStrictEqual(a, b)
}

describe('common > extensions > merge > ObjectMerger', function() {
	this.timeout(60000)

	const testMerger = TestMerger.test

	after(function() {
		console.log('Total ObjectMerger tests >= ' + TestMerger.totalTests)
	})

	function canBeReferObject(value) {
		return value != null
			&& !isRefer(value)
			&& (isObject(value) || typeof value === 'function')
	}

	function mustBeSet(o: IMergerOptionsVariant) {
		if (!o.setFunc) {
			return false
		}

		if (o.base === o.older && o.base === o.newer) {
			return false
		}

		// if (isObject(o.base) && Object.isFrozen(o.base)) {
		// 	return true
		// }

		if (o.base instanceof Class
			&& (circularDeepStrictEqualExt(o.base, o.older) || circularDeepStrictEqualExt(o.base.value, o.older) && isObject(o.older))
			&& (circularDeepStrictEqualExt(o.base, o.newer) || circularDeepStrictEqualExt(o.base.value, o.newer) && isObject(o.newer))
		) {
			return false
		}

		return !circularDeepStrictEqualExt(o.base, o.newer) || !circularDeepStrictEqualExt(o.base, o.older)
	}

	function isObject(value: any) {
		return value != null && value.constructor === Object && !isFrozenWithoutUniqueId(value)
	}

	function mustBeFilled(o: IMergerOptionsVariant) {
		return !o.preferCloneBase
			&& isObject(o.base)
			&& (!circularDeepStrictEqualExt(o.base, o.newer) && isObject(o.newer)
				|| circularDeepStrictEqualExt(o.base, o.newer)
					&& !circularDeepStrictEqualExt(o.base, o.older) && isObject(o.older))
	}

	class Class implements IMergeable<Class, object> {
		public value: any

		constructor(value: any) {
			this.value = value
		}

		public _canMerge(source: (Class | object)): boolean {
			if (source.constructor !== Class && source.constructor !== Object) {
				return false
			}
			return true
		}

		public _merge(
			merge: IMergeValue,
			older: Class | object,
			newer: Class | object,
			preferCloneOlder?: boolean,
			preferCloneNewer?: boolean,
			options?: IMergeOptions,
		): boolean {
			let changed = false
			changed = merge(
				this.value,
				older instanceof Class ? (older as any).value : older,
				newer instanceof Class ? (newer as any).value : newer,
				o => { this.value = o },
				null,
				null,
				{
					isNotCircularOlder: !(older instanceof Class),
					isNotCircularNewer: !(newer instanceof Class),
				},
			) || changed

			return changed
		}
	}

	registerMergeable(Class)

	it('base', function() {
		assert.ok(circularDeepStrictEqualExt(
			new Class({a: {a: 1, b: 2}, b: 3}),
			new Class({a: {a: 1, b: 2}, b: 3}),
		))

		assert.ok(circularDeepStrictEqualExt(
			deepClone(new Class({a: {a: 1, b: 2}, b: 3})),
			new Class({a: {a: 1, b: 2}, b: 3}),
		))

		// tslint:disable-next-line:use-primitive-type no-construct
		const symbol = {x: new String('SYMBOL')}
		const symbolClone = deepClone(symbol)
		assert.ok(circularDeepStrictEqualExt(symbol, symbolClone))
	})

	it('custom class', function() {
		testMerger({
			base: [new Class({ a: {a: 1, b: 2}, b: 3 })],
			older: [new Class({ a: {a: 4, b: 5}, c: 6 }), { a: {a: 4, b: 5}, c: 6 }],
			newer: [new Class({ a: {a: 7, b: 2}, d: 9 }), { a: {a: 7, b: 2}, d: 9 }],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [null],
			valueFactory: [null],
			setFunc: [true],
			expected: {
				error: null,
				returnValue: true,
				setValue: NONE,
				base: new Class({ a: {a: 7, b: 5}, c: 6, d: 9 }),
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})
	})

	it('strings', function() {
		testMerger({
			base: ['', '1', '2', new String('1')],
			older: ['2', new String('2')],
			newer: ['3', new String('3')],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [null],
			valueFactory: [null],
			setFunc: [true],
			expected: {
				error: null,
				returnValue: true,
				setValue: '3',
				base: BASE,
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})
	})

	it('number / boolean', function() {
		testMerger({
			base: [new Number(1)],
			older: [2, new Number(2)],
			newer: [3, new Number(3)],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [null],
			valueFactory: [null],
			setFunc: [true],
			expected: {
				error: null,
				returnValue: true,
				setValue: 3,
				base: BASE,
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})

		testMerger({
			base: [new Boolean(false)],
			older: [true, false, new Boolean(true), new Boolean(false)],
			newer: [true, new Boolean(true)],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [null],
			valueFactory: [null],
			setFunc: [true],
			expected: {
				error: null,
				returnValue: true,
				setValue: true,
				base: BASE,
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})
	})

	it('merge 3 objects', function() {
		testMerger({
			base: [{ a: {a: 1, b: 2}, b: 3 }],
			older: [{ a: {a: 4, b: 5}, c: 6 }],
			newer: [{ a: {a: 7, b: 2}, d: 9 }],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [null],
			valueFactory: [null],
			setFunc: [false, true],
			expected: {
				error: null,
				returnValue: true,
				setValue: NONE,
				base: { a: {a: 7, b: 5}, c: 6, d: 9 },
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})
	})

	it('value type', function() {
		testMerger({
			base: [{ a: {a: 1, b: 2}, b: 3 }],
			older: [{ a: {a: 4, b: 5}, c: 6 }],
			newer: [{ a: {a: 7, b: 2}, d: 9 }],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [Class],
			valueFactory: [null],
			setFunc: [true],
			expected: {
				error: null,
				returnValue: true,
				setValue: new Class({ a: {a: 7, b: 5}, c: 6, d: 9 }),
				base: BASE,
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})

		testMerger({
			base: [null, void 0, 0, 1, false, true, '', '1'],
			older: [{ a: {a: 4, b: 5}, c: 6 }],
			newer: [{ a: {a: 7, b: 2}, d: 9 }],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [Class],
			valueFactory: [null, o => {
				const instance = new Class(null);
				(instance as any).custom = true
				return instance
			}],
			setFunc: [true],
			expected: {
				error: null,
				returnValue: true,
				setValue: o => {
					const value = new Class({ a: {a: 7, b: 2}, d: 9 })
					if (o.valueFactory) {
						(value as any).custom = true
					}
					return value
				},
				base: BASE,
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})
	})

	it('array as primitive', function() {
		testMerger({
			base: [[], [1], [2]],
			older: [[], [1], [2]],
			newer: [[3]],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [null],
			valueFactory: [null],
			setFunc: [true],
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

	it('simple circular', function() {
		const createValue = (value: any) => {
			const obj: any = { value }
			obj.obj = {}
			return obj
		}

		testMerger({
			base: [createValue(1), createValue(2), null],
			older: [createValue(1), createValue(2), null],
			newer: [createValue(1), createValue(2), null],
			preferCloneOlderParam: [null],
			preferCloneNewerParam: [null],
			preferCloneMeta: [null],
			options: [null, {}],
			valueType: [null],
			valueFactory: [null],
			setFunc: [true],
			expected: {
				error: null,
				returnValue: o => {
					return !circularDeepStrictEqual(o.base, o.newer) || !circularDeepStrictEqual(o.base, o.older)
				},
				setValue: o => {
					if (circularDeepStrictEqual(o.base, o.newer) && circularDeepStrictEqual(o.base, o.older)) {
						return NONE
					}

					if (!o.newer) {
						if (o.newer === o.base) {
							return OLDER
						}
						return NEWER
					}

					if (o.base) {
						if (!o.older && circularDeepStrictEqual(o.base, o.newer)) {
							return OLDER
						}
						return NONE
					}

					if (!o.older) {
						return NEWER
					}

					if (circularDeepStrictEqual(o.older, o.newer)) {
						return NEWER
					} else {
						return OLDER
					}
				},
				base: o => {
					if (o.base && o.older && o.newer) {
						if (circularDeepStrictEqual(o.base, o.newer)) {
							return OLDER
						} else {
							return NEWER
						}
					}
					return BASE
				},
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		})

		// testMerger({
		// 	...options,
		// 	base: createValues(),
		// 	older: createValues(),
		// 	newer: createValues(),
		// })
	})

	describe('collections', function() {
		describe('maps', function() {
			const func = () => {
			}
			const func2 = () => {
			}
			const func3 = () => {
			}
			const func4 = () => {
			}
			const object = new Error('test error')
			assert.strictEqual(deepClone(func), func)
			assert.strictEqual(deepClone(object), object)
			const iterable = toIterable([1, 2, 3])
			assert.ok(iterable[Symbol.iterator])
			assert.deepStrictEqual(Array.from(iterable), [1, 2, 3])
			assert.deepStrictEqual(Array.from(iterable), [1, 2, 3])

			const testMergeMaps = (targetFactories, sourceFactories, base, older, newer, result) => {
				testMerger({
					base: [
						...targetFactories.map(o => o(base)),
					],
					older: [
						...sourceFactories.map(o => o(older)),
						older,
						toIterable(older),
					],
					newer: [
						...sourceFactories.map(o => o(newer)),
						newer,
						toIterable(newer),
					],
					preferCloneOlderParam: [null],
					preferCloneNewerParam: [null],
					preferCloneMeta: [true],
					options: [null, {}],
					valueType: [null],
					valueFactory: [null],
					setFunc: [true],
					expected: {
						error: null,
						returnValue: true,
						setValue: fillMap(new Map(), result),
						base: BASE,
						older: OLDER,
						newer: NEWER,
					},
					actions: null,
				})
			}

			it('Map', function() {
				testMergeMaps(
					[o => fillMap(new Map(), o), o => fillMap(new ObservableMap(new Map()), o)],
					[o => fillMap(new Map(), o), o => fillMap(new ObservableMap(new Map()), o)],
					[[0, null], [func, func], [void 0, {a: 1, b: 2}], [object, {a: 2, c: 3}]],
					[[0, object], [null, func], [void 0, {a: 4, c: 5}], [object, {a: 6, b: 7}]],
					[[0, null], [null, null], [func, func], [void 0, {a: 1, b: 2}], [object, {a: 10, c: 11}]],
					[[0, object], [void 0, {a: 4, c: 5}], [object, {a: 10, b: 7, c: 11}], [null, null]],
				)
			})

			it('ArrayMap', function() {
				testMergeMaps(
					[
						o => fillMap(new ArrayMap(), o), o => fillMap(new ObservableMap(new ArrayMap()), o),
						o => fillMap(new ObjectHashMap(), o), o => fillMap(new ObservableMap(new ObjectHashMap()), o),
					],
					[
						o => fillMap(new Map(), o), o => fillMap(new ObservableMap(new Map()), o),
						o => fillMap(new ArrayMap(), o), o => fillMap(new ObservableMap(new ArrayMap()), o),
						o => fillMap(new ObjectHashMap(), o), o => fillMap(new ObservableMap(new ObjectHashMap()), o),
					],
					[[func2, null], [func, func], [func4, {a: 1, b: 2}], [object, {a: 2, c: 3}]],
					[[func2, object], [func3, func], [func4, {a: 4, c: 5}], [object, {a: 6, b: 7}]],
					[[func2, null], [func3, null], [func, func], [func4, {a: 1, b: 2}], [object, {a: 10, c: 11}]],
					[[func2, object], [func4, {a: 4, c: 5}], [object, {a: 10, b: 7, c: 11}], [func3, null]],
				)
			})

			it('ObjectMap', function() {
				testMergeMaps(
					[o => fillMap(new ObjectMap(), o), o => fillMap(new ObservableMap(new ObjectMap()), o)],
					[
						o => fillMap(new Map(), o), o => fillMap(new ObservableMap(new Map()), o),
						o => fillMap(new ObjectMap(), o), o => fillMap(new ObservableMap(new ObjectMap()), o),
						o => fillObject({}, o),
					],
					[['0', null], ['1', func], ['3', {a: 1, b: 2}], ['5', {a: 2, c: 3}]],
					[['0', object], ['6', func], ['3', {a: 4, c: 5}], ['5', {a: 6, b: 7}]],
					[['0', null], ['6', null], ['1', func], ['3', {a: 1, b: 2}], ['5', {a: 10, c: 11}]],
					[['0', object], ['3', {a: 4, c: 5}], ['5', {a: 10, c: 11, b: 7}], ['6', null]],
				)
			})
		})

		describe('sets', function() {
			const func = () => {
			}
			const func2 = () => {
			}
			const func3 = () => {
			}
			const func4 = () => {
			}
			const object = new Error('test error')
			assert.strictEqual(deepClone(func), func)
			assert.strictEqual(deepClone(object), object)
			const iterable = toIterable([1, 2, 3])
			assert.ok(iterable[Symbol.iterator])
			assert.deepStrictEqual(Array.from(iterable), [1, 2, 3])
			assert.deepStrictEqual(Array.from(iterable), [1, 2, 3])

			const testMergeSets = (targetFactories, sourceFactories, base, older, newer, result) => {
				testMerger({
					base: [
						...targetFactories.map(o => o(base)),
					],
					older: [
						...sourceFactories.map(o => o(older)),
						older,
						toIterable(older),
					],
					newer: [
						...sourceFactories.map(o => o(newer)),
						newer,
						toIterable(newer),
					],
					preferCloneOlderParam: [null],
					preferCloneNewerParam: [null],
					preferCloneMeta: [true],
					options: [null, {}],
					valueType: [null],
					valueFactory: [null],
					setFunc: [true],
					expected: {
						error: null,
						returnValue: true,
						setValue: fillSet(new Set(), result),
						base: BASE,
						older: OLDER,
						newer: NEWER,
					},
					actions: null,
				})
			}

			it('Set', function() {
				testMergeSets(
					[o => fillSet(new Set(), o), o => fillSet(new ObservableSet(new Set()), o)],
					[o => fillSet(new Set(), o), o => fillSet(new ObservableSet(new Set()), o)],
					[0, func, void 0],
					[0, func, object],
					[0, 1, void 0, object],
					[0, 1, object],
				)
			})

			it('ArraySet', function() {
				testMergeSets(
					[
						o => fillSet(new ArraySet(), o), o => fillSet(new ObservableSet(new ArraySet()), o),
						// o => fillSet(new ObjectHashSet(), o), o => fillSet(new ObservableSet(new ObjectHashSet()), o),
					],
					[
						o => fillSet(new Set(), o), o => fillSet(new ObservableSet(new Set()), o),
						o => fillSet(new ArraySet(), o), o => fillSet(new ObservableSet(new ArraySet()), o),
						// o => fillSet(new ObjectHashSet(), o), o => fillSet(new ObservableSet(new ObjectHashSet()), o),
					],
					[func2, func, func4],
					[func2, func, object],
					[func2, func3, func4, object],
					[func2, func3, object],
				)
			})

			it('ObjectSet', function() {
				testMergeSets(
					[
						o => fillSet(new ObjectSet(), o), o => fillSet(new ObservableSet(new ObjectSet()), o),
						o => fillSet(new SortedList({autoSort: true, notAddIfExists: true}) as any, o),
					],
					[
						o => fillSet(new Set(), o), o => fillSet(new ObservableSet(new Set()), o),
						o => fillSet(new ObjectSet(), o), o => fillSet(new ObservableSet(new ObjectSet()), o),
						o => fillSet(new SortedList({autoSort: true, notAddIfExists: true}) as any, o),
						o => fillObjectKeys({}, o),
					],
					['0', '2', '3'],
					['0', '2', '4'],
					['0', '1', '3', '4'],
					['0', '1', '4'],
				)
			})
		})
	})

	describe('combinations', function() {
		const options = {
			preferCloneOlderParam: [null, false, true],
			preferCloneNewerParam: [null, false, true],
			preferCloneMeta: [null, false, true],
			valueType: [null],
			valueFactory: [null],
			setFunc: [false, true],
			exclude: o => {
				// if (o.older.constructor === Object && o.newer.constructor === Object) {
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

				if (isObject(o.base)
					&& isObject(o.older)
					&& isObject(o.newer)
				) {
					return true
				}

				if (o.preferCloneMeta != null
					&& (isObject(o.older)
						|| isObject(o.newer))
				) {
					return true
				}

				if (isObject(o.base) && !Object.isFrozen(o.base) && !isRefer(o.base)) {
					o.base = deepClone(o.base)
				}
				if (isObject(o.older) && !Object.isFrozen(o.older) && !isRefer(o.older)) {
					o.older = deepClone(o.older)
				}

				return false
			},
			expected: {
				error: null,
				returnValue: o => mustBeSet(o) || mustBeFilled(o),
				setValue: o => {
					const circularDeepStrictEqualExt2 = circularDeepStrictEqualExt

					if (!mustBeSet(o)) {
						return NONE
					}

					if (isObject(o.base)) {
						if (isObject(o.newer)) {
							if (circularDeepStrictEqualExt2(o.base, o.newer)) {
								if (isObject(o.older)) {
									return o.preferCloneBase
										? deepClone(o.older)
										: NONE
								} else {
									return OLDER
								}
							} else {
								return o.preferCloneBase
									? deepClone(o.newer)
									: NONE
							}
						}
					} else if (
						isObject(o.older)
						&& isObject(o.newer)
					) {
						if (circularDeepStrictEqualExt2(o.older, o.newer)) {
							return !o.preferCloneNewer
								? NEWER
								: (o.preferCloneOlder ? deepClone(o.newer) : OLDER)
						} else {
							return o.preferCloneOlder
								? deepClone(o.newer)
								: OLDER
						}
					}

					if (isObject(o.base)
						&& isObject(o.older)
						&& isObject(o.newer)
					) {
						return o.preferCloneBase
							? deepClone(circularDeepStrictEqualExt2(o.base, o.newer)
								? o.older
								: o.newer)
							: NONE
					}

					if (o.base instanceof Class
						&& (o.older instanceof Class || isObject(o.older))
						&& (o.newer instanceof Class || isObject(o.newer))
					) {
						return NONE
					}

					if (o.base instanceof Class
						&& !(o.older instanceof Class || isObject(o.older))
						&& (o.newer instanceof Class || isObject(o.newer))
						&& !circularDeepStrictEqualExt2(o.base, o.newer)
						&& !circularDeepStrictEqualExt2(o.base.value, o.newer)
					) {
						return NONE
					}

					if (isObject(o.base) && !Object.isFrozen(o.base)
						&& !(isObject(o.older))
						&& (isObject(o.newer))
						&& !circularDeepStrictEqualExt2(o.base, o.newer)
					) {
						return NONE
					}

					if (!(o.base instanceof Class)
						&& o.older instanceof Class
						&& (o.newer instanceof Class || isObject(o.newer))
					) {
						return OLDER
					}

					if (!circularDeepStrictEqualExt2(o.base, o.newer)
						&& o.older !== o.newer
						&& circularDeepStrictEqualExt2(o.older, o.newer)
						&& o.older instanceof Date && o.newer instanceof Date
						&& o.preferCloneNewer && !o.preferCloneOlder
					) {
						return OLDER
					}

					if ((o.older instanceof Class || isObject(o.older))
						&& isObject(o.newer)
						&& (o.preferCloneOlder && !circularDeepStrictEqualExt2(o.older, o.newer)
							|| o.preferCloneOlder && o.preferCloneNewer)
						|| o.newer === o.older && (o.preferCloneOlder || o.preferCloneNewer)
					) {
						return deepClone(o.newer)
					}

					if (isObject(o.older) && !Object.isFrozen(o.older)
						&& isObject(o.newer)
					) {
						return OLDER
					}

					return !(circularDeepStrictEqualExt2(o.base, o.newer)
						|| o.base instanceof Class && circularDeepStrictEqualExt2(o.base.value, o.newer)
						&& isObject(o.newer))
					|| o.newer !== o.base
					&& isObject(o.base) && Object.isFrozen(o.base)
						? NEWER
						: OLDER
				},
				base: BASE,
				older: OLDER,
				newer: NEWER,
			},
			actions: null,
		}

		it('primitives', function() {
			const createValues = () => [
				BASE, OLDER, NEWER,
				null, void 0, 0, 1, false, true,
			]

			testMerger({
				...options,
				base: createValues(),
				older: createValues(),
				newer: createValues(),
			})
		})

		it('strings', function() {
			const createValues = () => [
				BASE, OLDER, NEWER,
				void 0, 1, '', '1', '2',
			]

			testMerger({
				...options,
				base: createValues(),
				older: createValues(),
				newer: createValues(),
			})
		})

		it('Strings', function() {
			const createValues = () => [
				BASE, OLDER, NEWER,
				void 0, 1, new String(''), new String('1'), new String('2'),
			]

			testMerger({
				...options,
				base: createValues(),
				older: createValues(),
				newer: createValues(),
			})
		})

		it('date', function() {
			const createValues = () => [
				BASE, OLDER, NEWER,
				void 0, '', {}, new Date(1), new Date(2), new Date(3),
			]

			testMerger({
				...options,
				base: createValues(),
				older: createValues(),
				newer: createValues(),
			})
		})

		it('objects', function() {
			const createValues = () => [
				BASE, OLDER, NEWER,
				null, {}, new Date(1),
				/* new Class(new Date(1)), new Class({ a: {a: 1, b: 2}, b: 3 }), new Class(Object.freeze({ x: {y: 1} })), */
				{a: {a: 1, b: 2}, b: 3}, {a: {b: 4, c: 5}, c: 6}, {a: {a: 7, b: 8}, d: 9}, Object.freeze({x: {y: 1}}),
			]

			testMerger({
				...options,
				base: createValues(),
				older: createValues(),
				newer: createValues(),
			})
		})

		xit('full', function() {
			const createValues = () => [
				BASE, OLDER, NEWER,
				null, void 0, 0, 1, false, true, '', '1',
				/* new Class(new Date(1)), new Class({ a: {a: 1, b: 2}, b: 3 }), new Class(Object.freeze({ x: {y: 1} })), */
				{}, {a: {a: 1, b: 2}, b: 3}, {a: {b: 4, c: 5}, c: 6}, {a: {a: 7, b: 8}, d: 9}, Object.freeze({x: {y: 1}}),
				new Date(1), new Date(2),
			]

			testMerger({
				...options,
				base: createValues(),
				older: createValues(),
				newer: createValues(),
			})
		})

		xit('complex objects', function() {
			const complexObjectOptions: IComplexObjectOptions = {
				array: false,
				circular: true,
			}

			const createValues = () => [
				// BASE, OLDER, NEWER,
				createComplexObject(complexObjectOptions),
			]

			testMerger({
				base: createValues(),
				older: createValues(),
				newer: createValues(),
				preferCloneOlderParam: [null],
				preferCloneNewerParam: [null],
				preferCloneMeta: [null],
				options: [null, {}],
				valueType: [null],
				valueFactory: [null],
				setFunc: [true],
				expected: {
					error: null,
					returnValue: true,
					setValue: NONE,
					base: BASE,
					older: OLDER,
					newer: NEWER,
				},
				actions: null,
			})

			// testMerger({
			// 	...options,
			// 	base: createValues(),
			// 	older: createValues(),
			// 	newer: createValues(),
			// })
		})
	})
})
