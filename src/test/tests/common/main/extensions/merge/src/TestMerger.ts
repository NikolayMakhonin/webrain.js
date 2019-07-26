// @ts-ignore
// noinspection ES6UnusedImports
import deepClone from 'fast-copy'
/* tslint:disable:no-construct use-primitive-type */
import {ITypeMetaMerger} from '../../../../../../../main/common/extensions/merge/contracts'
import {ObjectMerger, TypeMetaMergerCollection} from '../../../../../../../main/common/extensions/merge/mergers'
import {TClass} from '../../../../../../../main/common/extensions/TypeMeta'
import {IOptionsVariant, IOptionsVariants, ITestCase, TestVariants} from '../../../helpers/TestVariants'

declare const assert
declare function deepClone<T extends any>(o: T): T

// export enum EqualsType {
// 	Not,
// 	Deep,
// 	Strict,
// }

export interface IMergerOptionsVariant {
	base?: any
	older?: any
	newer?: any
	// canMerger?: Map<any, any[]>
	// baseEqualsOlder?: EqualsType
	// baseEqualsNewer?: EqualsType
	// olderEqualsNewer?: EqualsType
	// baseCanMergerOlder?: boolean
	// baseCanMergerNewer?: boolean
	// olderCanMergerNewer?: boolean
	preferCloneOlderParam?: boolean
	preferCloneNewerParam?: boolean
	preferCloneMeta?: boolean
	valueType?: TClass<any>
	valueFactory?: (source) => any
	setFunc?: boolean

	// Calculated:
	preferCloneOlder?: boolean
	preferCloneNewer?: boolean
}

export const NONE = new String('NONE')
export const BASE = new String('BASE')
export const OLDER = new String('OLDER')
export const NEWER = new String('NEWER')

interface IMergerExpected {
	error?: (new () => Error)|((variant: IMergerOptionsVariant) => new () => Error)
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
		// assert.ok(meta, `Meta not found for type: ${type}`)
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

	for (const key in optionsSource) {
		if (Object.prototype.hasOwnProperty.call(optionsSource, key)) {
			let value = optionsSource[key]
			switch (key) {
				case 'base':
				case 'older':
					value = clone && !Object.isFrozen(value) && !isRefer(value)
						? deepClone(value)
						: value
					break
			}

			resolvedOptions[key] = key === 'action'
				? value
				: resolveValue(optionsParams || resolvedOptions, value, false, refers)
		}
	}

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
			let initialOptions = inputOptions
			const inputOptionsClone = deepClone(inputOptions)
			try {
				let options = resolveOptions(initialOptions, null, false, true, true)
				options = resolveOptions(options, options, true, true, false)
				initialOptions = resolveOptions(initialOptions, options, true, false, true)

				if (options.preferCloneMeta == null) {
					TypeMetaMergerCollectionMock.default.changeMetaFunc = null
				} else {
					TypeMetaMergerCollectionMock.default.changeMetaFunc = meta => {
						if (!(meta as any).isMocked) {
							const preferClone = meta.preferClone
							if (preferClone !== false && typeof preferClone !== 'function') {
								(meta as any).isMocked = true
								meta.preferClone = options.preferCloneMeta
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
					? deepClone(options.base)
					: options.base
				const initialOlder = isPreferClone(initialOptions, initialOptions.expected.older)
					? deepClone(options.older)
					: options.older
				const initialNewer = isPreferClone(initialOptions, initialOptions.expected.newer)
					? deepClone(options.newer)
					: options.newer

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
						options.valueType,
						options.valueFactory,
					)
				}

				if (options.expected.error) {
					assert.throws(action, options.expected.error)
				} else {
					action()

					const assertValue = (actual, expected, strict) => {
						if (strict) {
							assert.strictEqual(actual, expected)
						} else {
							if (actual !== NONE && actual != null && typeof actual === 'object' || typeof actual === 'function') {
								assert.notStrictEqual(actual, expected)
								assert.notStrictEqual(actual, options.base)
								assert.notStrictEqual(actual, options.older)
								assert.notStrictEqual(actual, options.newer)
							}
							assert.deepStrictEqual(actual, expected)
						}
					}

					assertValue(setValue,
						options.expected.setValue,
						isPreferClone(initialOptions, initialOptions.expected.setValue) !== true,
					)

					assert.strictEqual(returnValue, options.expected.returnValue)

					assert.strictEqual(setCount,
						options.expected.setValue !== NONE ? 1 : 0)

					assert.deepStrictEqual(options.base, initialBase)
					assert.deepStrictEqual(options.older, initialOlder)
					assert.deepStrictEqual(options.newer, initialNewer)

					assertValue(options.base, options.expected.base, isRefer(initialOptions.expected.base))
					assertValue(options.older, options.expected.older, isRefer(initialOptions.expected.older))
					assertValue(options.newer, options.expected.newer, isRefer(initialOptions.expected.newer))
				}

				assert.deepStrictEqual(inputOptions, inputOptionsClone)

				break
			} catch (ex) {
				if (!debugIteration) {
					console.log(`Error in: ${
						initialOptions.description
						}\n${
						JSON.stringify(initialOptions, null, 4)
						}\n${initialOptions.action.toString()}\n${ex.stack}`)
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