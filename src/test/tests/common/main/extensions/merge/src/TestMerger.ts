/* tslint:disable:no-construct use-primitive-type */
// import clone from 'clone'
import {ITypeMetaMerger} from '../../../../../../../main/common/extensions/merge/contracts'
import {ObjectMerger, TypeMetaMergerCollection} from '../../../../../../../main/common/extensions/merge/mergers'
import {TClass} from '../../../../../../../main/common/helpers/helpers'
import {canHaveUniqueId} from '../../../../../../../main/common/lists/helpers/object-unique-id'
import {SortedList} from '../../../../../../../main/common/lists/SortedList'
import {Assert} from '../../../../../../../main/common/test/Assert'
import {DeepCloneEqual, isPrimitiveDefault} from '../../../../../../../main/common/test/DeepCloneEqual'
import {IOptionsVariant, IOptionsVariants, ITestCase, TestVariants} from '../../../src/helpers/TestVariants'

export const deepCloneEqual = new DeepCloneEqual({
	commonOptions: {
		circular: true,
		customIsPrimitive: o => {
			if (isPrimitiveDefault(o)) {
				return true
			}

			if (o.constructor === Number
				|| o.constructor === Boolean
				|| o.constructor === String && Object.isFrozen(o)
				|| !canHaveUniqueId(o)
			) {
				return true
			}

			return null
		},
	},
	cloneOptions: {
		customClone: (o, setInstance, cloneNested) => {
			if (o.constructor === SortedList) {
				const list = new SortedList({
					autoSort: (o as any).autoSort,
					notAddIfExists: (o as any).notAddIfExists,
					compare: (o as any).compare,
				})

				setInstance(list)

				for (const item of (o as unknown as SortedList<any>)) {
					list.add(cloneNested(item))
				}
				return list as any
			}

			return null
		},
	},
	equalOptions: {
		equalInnerReferences: true,
		strictEqualFunctions: true,
		customEqual: (o1, o2, equal) => {
			if (o1.constructor === SortedList) {
				// tslint:disable-next-line:no-collapsible-if
				if (o1.constructor === o2.constructor) {
					if (!equal((o1 as SortedList<any>).autoSort, o2.autoSort)) {
						return false
					}
					if (!equal((o1 as SortedList<any>).notAddIfExists, o2.notAddIfExists)) {
						return false
					}
					if (!equal((o1 as SortedList<any>).compare, o2.compare)) {
						return false
					}
				}
				// let count = 0
				// for (const item of o2) {
				// 	if (!o1.contains(item)) {
				// 		return false
				// 	}
				// 	count++
				// }
				// if (!equal(o1.size, count)) {
				// 	return false
				// }
			}

			return null
		},
	},
})

const assert = new Assert(deepCloneEqual)

export interface IMergerOptionsVariant {
	base?: any
	older?: any
	newer?: any

	preferCloneOlderParam?: boolean
	preferCloneNewerParam?: boolean
	preferCloneMeta?: boolean
	valueType?: TClass<any>
	valueFactory?: (source) => any
	setFunc?: boolean

	// Calculated:
	preferCloneBase?: boolean
	preferCloneOlder?: boolean
	preferCloneNewer?: boolean
	baseIsFrozen?: boolean
	olderIsFrozen?: boolean
	newerIsFrozen?: boolean
}

export const NONE = Object.freeze(new String('NONE'))
export const BASE = Object.freeze(new String('BASE'))
export const OLDER = Object.freeze(new String('OLDER'))
export const NEWER = Object.freeze(new String('NEWER'))

interface IMergerExpected {
	error?: (TClass<Error>|Array<TClass<Error>>)|((variant: IMergerOptionsVariant) => TClass<Error>|Array<TClass<Error>>)
	returnValue?: any|((variant: IMergerOptionsVariant) => any)
	setValue?: any|((variant: IMergerOptionsVariant) => any)
	base?: any|((variant: IMergerOptionsVariant) => any)
	older?: any|((variant: IMergerOptionsVariant) => any)
	newer?: any|((variant: IMergerOptionsVariant) => any)
}

interface IMergerOptionsVariants extends IOptionsVariants {
	base: any[]
	older: any[]
	newer: any[]
	preferCloneOlderParam?: boolean[]
	preferCloneNewerParam?: boolean[]
	preferCloneMeta?: boolean[]
	valueType?: Array<TClass<any>>
	valueFactory?: Array<(source) => any>
	setFunc?: boolean[]
}

export class TypeMetaMergerCollectionMock extends TypeMetaMergerCollection {
	private _resetFuncs: Array<() => void> = []
	public changeMetaFunc: (meta: ITypeMetaMerger<any, any>) => () => void
	public static default: TypeMetaMergerCollectionMock = new TypeMetaMergerCollectionMock()

	constructor() {
		super()
	}

	public getMeta(type: TClass<any>): ITypeMetaMerger<any, any> {
		const meta = super.getMeta(type)
		// assert.ok(meta, `Meta not found for type: ${typeToDebugString(type)}`)
		if (meta && this.changeMetaFunc) {
			const resetFunc = this.changeMetaFunc(meta)
			if (resetFunc) {
				this._resetFuncs.push(resetFunc)
			}
		}
		return meta
	}

	public reset() {
		for (let i = 0, len = this._resetFuncs.length; i < len; i++) {
			this._resetFuncs[i]()
		}
		this._resetFuncs = []
	}
}

const merger = new ObjectMerger(TypeMetaMergerCollectionMock.default)

type IMergerAction = (...args: any[]) => any

function isPreferClone(options, initialValue): boolean {
	switch (initialValue) {
		case BASE:
			if (options.base != null && options.base.constructor === Object && Object.isFrozen(options.base)) {
				return true
			}
			return options.preferCloneMeta == null
				? options.preferCloneOlderParam && options.base === options.older
					|| options.preferCloneNewerParam && options.base === options.newer
				: options.preferCloneMeta
		case NONE:
			return false
		case NEWER:
			if (options.newer != null && options.newer.constructor === Object && Object.isFrozen(options.newer)) {
				return true
			}
			return options.preferCloneMeta == null
				? options.preferCloneNewerParam || options.preferCloneOlderParam && options.newer === options.older
				: options.preferCloneMeta
		case OLDER:
			if (options.older != null && options.older.constructor === Object && Object.isFrozen(options.older)) {
				return true
			}
			return options.preferCloneMeta == null
				? options.preferCloneOlderParam || options.preferCloneNewerParam && options.newer === options.older
				: options.preferCloneMeta
		default:
			return true
	}
}

function resolveValue(opts, value, functions: boolean, refers: boolean) {
	if (functions && typeof value === 'function' && !(value instanceof Error)) {
		value = value(opts)
	}

	if (refers) {
		let i = 0
		while (true) {
			i++
			if (i > 10) {
				throw new Error(`Value cannot be resolved: ${value}`)
			}

			switch (value) {
				case BASE:
					value = opts.base
					continue
				case OLDER:
					value = opts.older
					continue
				case NEWER:
					value = opts.newer
					continue
			}

			break
		}
	}

	return value
}

function resolveOptions(
	optionsSource: IMergerOptionsVariant & IOptionsVariant<IMergerAction, IMergerExpected>,
	optionsParams: IMergerOptionsVariant & IOptionsVariant<IMergerAction, IMergerExpected>,
	functions: boolean,
	refers: boolean,
	clone: boolean,
): IMergerOptionsVariant & IOptionsVariant<IMergerAction, IMergerExpected> {

	const resolvedOptions: IMergerOptionsVariant & IOptionsVariant<IMergerAction, IMergerExpected>
		= {...optionsSource} as any

	if (clone) {
		if (!Object.isFrozen(resolvedOptions.base) && !isRefer(resolvedOptions.base)) {
			resolvedOptions.base = deepCloneEqual.clone(resolvedOptions.base)
		}
		if (!Object.isFrozen(resolvedOptions.older) && !isRefer(resolvedOptions.older)) {
			resolvedOptions.older = deepCloneEqual.clone(resolvedOptions.older)
		}
		if (!Object.isFrozen(resolvedOptions.newer) && !isRefer(resolvedOptions.newer)) {
			resolvedOptions.newer = deepCloneEqual.clone(resolvedOptions.newer)
		}
	}

	for (const key in resolvedOptions) {
		if (Object.prototype.hasOwnProperty.call(resolvedOptions, key)) {
			resolvedOptions[key] = key === 'action'
				? resolvedOptions[key]
				: resolveValue(optionsParams || resolvedOptions, resolvedOptions[key], false, refers)
		}
	}

	resolvedOptions.preferCloneBase = isPreferClone(optionsParams || resolvedOptions, BASE)
	resolvedOptions.preferCloneOlder = isPreferClone(optionsParams || resolvedOptions, OLDER)
	resolvedOptions.preferCloneNewer = isPreferClone(optionsParams || resolvedOptions, NEWER)

	resolvedOptions.expected = {}
	for (const key in optionsSource.expected) {
		if (Object.prototype.hasOwnProperty.call(optionsSource.expected, key)) {
			resolvedOptions.expected[key] =
				resolveValue(optionsParams || resolvedOptions, optionsSource.expected[key], functions, refers)
		}
	}

	return resolvedOptions
}

export function isRefer(value) {
	return value === BASE || value === OLDER || value === NEWER
}

export class TestMerger extends TestVariants<
	IMergerAction,
	IMergerExpected,
	IMergerOptionsVariant,
	IMergerOptionsVariants
> {
	private constructor() {
		super()
	}

	public static totalTests: number = 0

	protected baseOptionsVariants: IMergerOptionsVariants = {
		base: [],
		older: [],
		newer: [],
		preferCloneOlderParam: [null, false, true],
		preferCloneNewerParam: [null, false, true],
		preferCloneMeta: [null, false, true],
		valueType: [null],
		valueFactory: [null],
		setFunc: [false, true],
	}

	protected testVariant(
		inputOptions: IMergerOptionsVariant & IOptionsVariant<IMergerAction, IMergerExpected>,
	) {
		let error
		for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
			// if (TestMerger.totalTests >= 457) {
			// 	new Date().getTime()
			// }
			let initialOptions = inputOptions
			const inputOptionsClone = deepCloneEqual.clone(inputOptions)
			try {
				const options = resolveOptions(initialOptions, null, true, true, true)
				// options = resolveOptions(options, options, true, true, false)
				initialOptions = resolveOptions(initialOptions, options, true, false, true)
				initialOptions.baseIsFrozen = Object.isFrozen(options.base)
				initialOptions.olderIsFrozen = Object.isFrozen(options.older)
				initialOptions.newerIsFrozen = Object.isFrozen(options.newer)

				if (options.preferCloneMeta == null) {
					TypeMetaMergerCollectionMock.default.changeMetaFunc = null
				} else {
					TypeMetaMergerCollectionMock.default.changeMetaFunc = meta => {
						if (!(meta as any).isMocked) {
							const preferClone = meta.preferClone
							if (preferClone !== false) {
								(meta as any).isMocked = true

								if (typeof preferClone !== 'function') {
									meta.preferClone = options.preferCloneMeta
								} else {
									meta.preferClone = target => {
										const calcPreferClone = (preferClone as any)(target)
										if (calcPreferClone === false) {
											return calcPreferClone
										}
										return options.preferCloneMeta
									}
								}

								return () => {
									meta.preferClone = preferClone
									delete (meta as any).isMocked
								}
							}
						}
						return null
					}
				}

				let setValue = NONE
				let setCount = 0
				let returnValue: any = NONE

				const initialBase = isPreferClone(initialOptions, initialOptions.expected.base)
					? deepCloneEqual.clone(options.expected.base)
					: options.expected.base
				const initialOlder = isPreferClone(initialOptions, initialOptions.expected.older)
					&& !(options.older === options.base && !isPreferClone(initialOptions, initialOptions.expected.base))
					? deepCloneEqual.clone(options.expected.older)
					: options.expected.older
				const initialNewer = isPreferClone(initialOptions, initialOptions.expected.newer)
					&& !(options.newer === options.base && !isPreferClone(initialOptions, initialOptions.expected.base))
					? deepCloneEqual.clone(options.expected.newer)
					: options.expected.newer

				const action = () => {
					returnValue = merger.merge(
						options.base,
						options.older,
						options.newer,
						options.setFunc && (o => {
							setValue = o
							setCount++
						}),
						options.preferCloneOlderParam,
						options.preferCloneNewerParam,
						options.valueType || options.valueFactory
							? {
								valueType: options.valueType,
								valueFactory: options.valueFactory,
							}
							: void 0,
					)
				}

				if (options.expected.error) {
					assert.throws(action, options.expected.error as TClass<Error>|Array<TClass<Error>>)
				} else {
					action()

					const assertValue = (actual, expected, strict) => {
						if (expected && expected !== NONE && expected.constructor === String) {
							expected = expected.valueOf()
						}

						if (actual && actual !== NONE && actual.constructor === String) {
							actual = actual.valueOf()
						}

						if (strict) {
							assert.strictEqual(actual, expected)
						} else {
							if (actual !== NONE && actual != null && typeof actual === 'object'
								&& actual.constructor !== String
								&& actual.constructor !== Number
								&& actual.constructor !== Boolean
								&& canHaveUniqueId(actual)
								|| typeof actual === 'function') {
								assert.notStrictEqual(actual, expected)
								assert.notStrictEqual(actual, options.base)
								assert.notStrictEqual(actual, options.older)
								assert.notStrictEqual(actual, options.newer)
							}
							deepCloneEqual.equal(actual, expected, {
								noCrossReferences: true,
							})
						}
					}

					assertValue(setValue,
						options.expected.setValue,
						isPreferClone(initialOptions, initialOptions.expected.setValue) !== true,
					)

					assert.strictEqual(returnValue, options.expected.returnValue)

					assert.strictEqual(setCount,
						options.expected.setValue !== NONE ? 1 : 0)

					deepCloneEqual.equal(options.base, initialBase)
					deepCloneEqual.equal(options.older, initialOlder)
					deepCloneEqual.equal(options.newer, initialNewer)

					// assertValue(options.base, options.expected.base, isRefer(initialOptions.expected.base))
					// assertValue(options.older, options.expected.older, isRefer(initialOptions.expected.older))
					// assertValue(options.newer, options.expected.newer, isRefer(initialOptions.expected.newer))
				}

				assert.circularDeepStrictEqual(inputOptions, inputOptionsClone)

				break
			} catch (ex) {
				if (!debugIteration) {
					console.log(`Test number: ${TestMerger.totalTests}\r\nError in: ${
						initialOptions.description
						}\n`, initialOptions,
						// ${
						// JSON.stringify(initialOptions, null, 4)
						// }
						`\n${initialOptions.action.toString()}\n${ex.stack}`)
					error = ex
				}
			} finally {
				TypeMetaMergerCollectionMock.default.reset()
				TestMerger.totalTests++
			}
		}

		if (error) {
			throw error
		}
	}

	private static readonly _instance: TestMerger = new TestMerger()

	public static test(
		testCases: ITestCase<IMergerAction, IMergerExpected, IMergerOptionsVariant> & IMergerOptionsVariants,
	) {
		if (!testCases.actions) {
			// tslint:disable-next-line:no-empty
			testCases.actions = [() => {}]
		}
		TestMerger._instance.test(testCases)
	}
}
