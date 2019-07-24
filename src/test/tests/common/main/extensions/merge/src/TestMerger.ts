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

export const NONE = { NONE: 0 }
export const BASE = { BASE: 0 }
export const OLDER = { OLDER: 0 }
export const NEWER = { NEWER: 0 }

interface IMergerExpected {
	error?: new () => Error
	returnValue?: any
	setValue?: any
	base?: any
	older?: any
	newer?: any
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
		preferCloneOlderParam: [false, true],
		preferCloneNewerParam: [false, true],
		preferCloneMeta: [false, true],
		valueType: [null],
		valueFactory: [null],
		setFunc: [false, true],
	}

	protected testVariant(
		options: IMergerOptionsVariant & IOptionsVariant<IMergerAction, IMergerExpected>,
	) {
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

				let setValue = NONE
				let setCount = 0

				const returnValue = merger.merge(
					options.base,
					options.older,
					options.newer,
					options.setFunc && (o => {
						setValue = o
						setCount++
					}),
					options.valueType,
					options.valueFactory,
					options.preferCloneOlderParam,
					options.preferCloneNewerParam,
				)

				assert.strictEqual(returnValue, options.expected.returnValue)

				const assertValue = (actual, expected) => {
					switch (expected) {
						case NONE:
							assert.strictEqual(actual, NONE)
							break
						case BASE:
							assert.strictEqual(actual, options.base)
							break
						case OLDER:
							assert.strictEqual(actual, options.older)
							break
						case NEWER:
							assert.strictEqual(actual, options.newer)
							break
						default:
							if (typeof actual === 'object' || typeof actual === 'function') {
								assert.notStrictEqual(actual, options.base)
								assert.notStrictEqual(actual, options.older)
								assert.notStrictEqual(actual, options.newer)
							}
							assert.deepStrictEqual(actual, expected)
							break
					}
				}

				assertValue(setValue, options.setFunc ? options.expected.setValue : NONE)
				assert.strictEqual(setCount, options.setFunc && options.expected.setValue !== NONE ? 1 : 0)

				assertValue(options.base, options.expected.base)
				assertValue(options.older, options.expected.older)
				assertValue(options.newer, options.expected.newer)

				break
			} catch (ex) {
				if (!debugIteration) {
					console.log(`Error in: ${
						options.description
						}\n${
						JSON.stringify(options, null, 4)
						}\n${options.action.toString()}\n${ex.stack}`)
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
