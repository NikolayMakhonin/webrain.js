/* tslint:disable:no-construct use-primitive-type */
import {ITypeMetaMerger} from '../../../../../../../main/common/extensions/merge/contracts'
import {ObjectMerger, TypeMetaMergerCollection} from '../../../../../../../main/common/extensions/merge/mergers'
import {TClass} from '../../../../../../../main/common/extensions/TypeMeta'
import {IOptionsVariant, IOptionsVariants, ITestCase, TestVariants} from '../../../helpers/TestVariants'

declare const assert

// export enum EqualsType {
// 	Not,
// 	Deep,
// 	Strict,
// }

interface IMergerOptionsVariant {
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
		if (this.changeMetaFunc) {
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

function resolveValue(opts, value, functions: boolean, refers: boolean) {
	if (functions && typeof value === 'function' && !(value instanceof Error)) {
		value = value(opts)
	}

	if (refers) {
		switch (value) {
			case BASE:
				return opts.base
			case OLDER:
				return opts.older
			case NEWER:
				return opts.newer
			default:
				return value
		}
	}

	return value
}

function resolveOptions(
	options: IMergerOptionsVariant & IOptionsVariant<IMergerAction, IMergerExpected>,
	functions: boolean,
	refers: boolean,
): IMergerOptionsVariant & IOptionsVariant<IMergerAction, IMergerExpected> {

	const resolvedOptions: IMergerOptionsVariant & IOptionsVariant<IMergerAction, IMergerExpected>
		= {} as any

	for (const key in options) {
		if (Object.prototype.hasOwnProperty.call(options, key)) {
			resolvedOptions[key] = key === 'action'
				? options[key]
				: resolveValue(options, options[key], false, refers)
		}
	}

	resolvedOptions.expected = {}
	for (const key in options.expected) {
		if (Object.prototype.hasOwnProperty.call(options.expected, key)) {
			resolvedOptions.expected[key] = resolveValue(resolvedOptions, options.expected[key], functions, refers)
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
		inputOptions = resolveOptions(inputOptions, true, false)
		const options = resolveOptions(inputOptions, false, true)

		let error
		for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
			try {
				if (options.preferCloneMeta == null) {
					TypeMetaMergerCollectionMock.default.changeMetaFunc = null
				} else {
					TypeMetaMergerCollectionMock.default.changeMetaFunc = meta => {
						const preferClone = meta.preferClone
						meta.preferClone = options.preferCloneMeta
						return () => meta.preferClone = preferClone
					}
				}

				const isPreferClone = initialValue => {
					switch (initialValue) {
						case BASE:
							return false
						case NEWER:
							return options.preferCloneNewerParam == null
								? options.preferCloneMeta
								: options.preferCloneNewerParam
						case OLDER:
							return options.preferCloneOlderParam == null
								? options.preferCloneMeta
								: options.preferCloneOlderParam
						default:
							return false
					}
				}

				let setValue = NONE
				let setCount = 0
				let returnValue: any = NONE

				const action = () => returnValue = merger.merge(
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

				if (options.expected.error) {
					assert.throws(action, options.expected.error)
				} else {
					action()

					assert.strictEqual(returnValue, options.expected.returnValue)

					const assertValue = (actual, expected, initial) => {
						if (isPreferClone(initial) !== true) {
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
						options.setFunc ? options.expected.setValue : NONE,
						options.setFunc ? inputOptions.expected.setValue : NONE,
					)
					assert.strictEqual(setCount,
						options.setFunc && options.expected.setValue !== NONE ? 1 : 0)

					assertValue(options.base, options.expected.base, inputOptions.expected.base)
					assertValue(options.older, options.expected.older, inputOptions.expected.older)
					assertValue(options.newer, options.expected.newer, inputOptions.expected.newer)
				}

				break
			} catch (ex) {
				if (!debugIteration) {
					console.log(`Error in: ${
						inputOptions.description
						}\n${
						JSON.stringify(inputOptions, null, 4)
						}\n${inputOptions.action.toString()}\n${ex.stack}`)
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
