/* tslint:disable:no-empty no-identical-functions no-construct use-primitive-type */
import {
	isThenable,
	ThenableIterator,
	ThenableOrIteratorOrValue,
	TOnFulfilled,
	TOnRejected,
	TReject,
	TResolve,
} from '../../../../../../main/common/async/async'
import {ThenableSync} from '../../../../../../main/common/async/ThenableSync'
import {isIterator, TClass} from '../../../../../../main/common/helpers/helpers'
import {assert} from '../../../../../../main/common/test/Assert'
import {IOptionsVariant, IOptionsVariants, ITestCase, TestVariants} from '../../src/helpers/TestVariants'

export enum ValueType {
	Value,
	ThenableResolved,
	ThenableRejected,
	ThenableThrowed,
	ThenableResolve,
	ThenableReject,
	Iterator,
}

export enum ThenType {
	Then,
	ThenLast,
	// ResolveAsync,
	// ResolveValue,
}

export interface IThenableSyncOptionsVariant {
	value?: any
	createValue1?: ValueType
	thenValue1?: ValueType
	thenThrow1?: boolean
	thenType1?: ThenType

	createValue2?: ValueType
	thenValue2?: ValueType
	thenThrow2?: boolean
	thenType2?: ThenType

	// createValue3?: ValueType
	// thenValue3?: ValueType
	// thenThrow3?: boolean
	// thenType3?: ThenType
}

interface IThenableSyncExpected {
	error?: TClass<Error>|Array<TClass<Error>>
		|((variant: IThenableSyncOptionsVariant) => TClass<Error>|Array<TClass<Error>>)
	value?: any|((variant: IThenableSyncOptionsVariant) => any)
}

interface IThenableSyncOptionsVariants extends IOptionsVariants {
	value?: any[]
	createValue1?: ValueType[]
	thenValue1?: ValueType[]
	thenThrow1?: boolean[]
	thenType1?: ThenType[]

	createValue2?: ValueType[]
	thenValue2?: ValueType[]
	thenThrow2?: boolean[]
	thenType2?: ThenType[]

	// createValue3?: ValueType[]
	// thenValue3?: ValueType[]
	// thenThrow3?: boolean[]
	// thenType3?: ThenType[]
}

type IThenableSyncAction = (...args: any[]) => any

function resolveOptionValue(opts, value) {
	if (typeof value === 'function' && !(value instanceof Error)) {
		value = value(opts)
	}

	return value
}

function resolveOptions(
	optionsSource: IThenableSyncOptionsVariant & IOptionsVariant<IThenableSyncAction, IThenableSyncExpected>,
	optionsParams: IThenableSyncOptionsVariant & IOptionsVariant<IThenableSyncAction, IThenableSyncExpected>,
): IThenableSyncOptionsVariant & IOptionsVariant<IThenableSyncAction, IThenableSyncExpected> {

	const resolvedOptions: IThenableSyncOptionsVariant & IOptionsVariant<IThenableSyncAction, IThenableSyncExpected>
		= {...optionsSource} as any

	for (const key in resolvedOptions) {
		if (Object.prototype.hasOwnProperty.call(resolvedOptions, key)) {
			resolvedOptions[key] = key === 'action' || key === 'value'
				? resolvedOptions[key]
				: resolveOptionValue(optionsParams || resolvedOptions, resolvedOptions[key])
		}
	}

	resolvedOptions.expected = {}
	for (const key in optionsSource.expected) {
		if (Object.prototype.hasOwnProperty.call(optionsSource.expected, key)) {
			resolvedOptions.expected[key] =
				resolveOptionValue(optionsParams || resolvedOptions, optionsSource.expected[key])
		}
	}

	return resolvedOptions
}

export const OBJ = {}
export const THEN_LIKE = { then: onfulfill => { onfulfill('THEN_LIKE') } }
export const FUNC = () => {}
export const ITERABLE = new Set()
export const ITERATOR_GENERATOR = function *() {
	yield OBJ
	return ITERABLE
}

function createIterator<T>(value: ThenableOrIteratorOrValue<T>): ThenableIterator<T> {
	const iteratorInner = function *() {
		assert.strictEqual(yield void 0, void 0)
		assert.strictEqual(yield null, null)
		assert.strictEqual(yield false, false)
		assert.strictEqual(yield 0, 0)
		assert.strictEqual(yield '', '')
		assert.strictEqual(yield OBJ, OBJ)
		assert.strictEqual(yield FUNC, FUNC)
		// assert.strictEqual(yield THEN_LIKE, 'THEN_LIKE')
		assert.strictEqual(yield ITERABLE, ITERABLE)
		assert.strictEqual(yield ITERATOR_GENERATOR(), ITERABLE)
		return value
	}

	const iterator = (function *() {
		assert.strictEqual(yield new ThenableSync(resolve => resolve(void 0)), void 0)
		assert.strictEqual(yield new ThenableSync(resolve => resolve(null)), null)
		assert.strictEqual(yield new ThenableSync(resolve => resolve(false)), false)
		assert.strictEqual(yield new ThenableSync(resolve => resolve(0)), 0)
		assert.strictEqual(yield new ThenableSync(resolve => resolve('')), '')
		assert.strictEqual(yield new ThenableSync(resolve => resolve(OBJ)), OBJ)
		assert.strictEqual(yield new ThenableSync(resolve => resolve(FUNC)), FUNC)
		// assert.strictEqual(yield new ThenableSync(resolve => resolve(THEN_LIKE)), 'THEN_LIKE')
		assert.strictEqual(yield new ThenableSync(resolve => resolve(ITERABLE)), ITERABLE)
		assert.strictEqual(yield new ThenableSync(resolve => resolve(ITERATOR_GENERATOR())), ITERABLE)

		const result = yield iteratorInner()

		return result
	})()

	return iterator
}

function createThenable<TValue>(useExecutor: boolean): [ThenableSync<TValue>, TResolve<TValue>, TReject] {
	if (useExecutor) {
		let resultResolve = null
		let resultReject = null
		const thenable = new ThenableSync((resolve, reject) => {
			resultResolve = resolve
			resultReject = reject
		})
		assert.ok(resultResolve)
		assert.ok(resultReject)
		return [thenable, resultResolve, resultReject]
	} else {
		const thenable = new ThenableSync()
		return [thenable, thenable.resolve.bind(thenable), thenable.reject.bind(thenable)]
	}
}

interface IValueInfo {
	origValue: any
	value?: any
	immediate: boolean
	useReject: boolean
}

function createValue(
	value,
	getValueType: (index) => ValueType,
	addResolve: (resolve: () => void) => void,
	valueInfo?: IValueInfo,
): IValueInfo {
	if (!valueInfo) {
		valueInfo = {
			origValue: value,
			immediate: true,
			useReject: false,
		}
	}

	for (let i = 0; i < 2; i++) {
		switch (getValueType(i)) {
			case ValueType.Value:
				break
			case ValueType.ThenableResolved: {
				const [thenable, resolve, reject] = createThenable(i % 2 === 0)
				resolve(value)
				value = thenable
				break
			}
			case ValueType.ThenableRejected: {
				const [thenable, resolve, reject] = createThenable(i % 2 === 0)
				reject(value)
				value = thenable
				valueInfo.useReject = true
				break
			}
			case ValueType.ThenableThrowed: {
				const thenable = new ThenableSync(() => {
					throw value
				})
				value = thenable
				valueInfo.useReject = true
				break
			}
			case ValueType.ThenableResolve: {
				const [thenable, resolve, reject] = createThenable(i % 2 === 0)
				const val = value
				addResolve(() => resolve(val))
				value = thenable
				valueInfo.immediate = false
				break
			}
			case ValueType.ThenableReject: {
				const [thenable, resolve, reject] = createThenable(i % 2 === 0)
				const val = value
				addResolve(() => reject(val))
				value = thenable
				valueInfo.useReject = true
				valueInfo.immediate = false
				break
			}
			case ValueType.Iterator: {
				value = createIterator(value)
				break
			}
		}
	}

	valueInfo.value = value

	return valueInfo
}

function createThen(
	valueInfo: IValueInfo,
	getValueType: (index) => ValueType,
	addResolve: (resolve: () => void) => void,
	getThenType: (index) => ThenType,
	getThenThrow: (index) => boolean,
): void {
	const createThenValue = (val, willUseThrow) => {
		if (willUseThrow) {
			valueInfo.useReject = true
		}
		return createValue(val, getValueType, addResolve, valueInfo).value
	}

	let thenable = valueInfo.value

	for (let i = 0; i < 2; i++) {
		// if (getThenThrow(i)) {
		// 	onResult = (value) => throw createValue(value)
		// } else {
		// 	onResult = (value) => createValue(value)
		// }

		switch (getThenType(i)) {
			case ThenType.Then:
				if (isThenable(thenable)) {
					if (getThenThrow(i)) {
						if (valueInfo.useReject) {
							thenable = thenable.then(null, o => { throw createThenValue(o, true) })
						} else {
							thenable = thenable.then(o => { throw createThenValue(o, true) }, null)
						}
					} else {
						if (valueInfo.useReject) {
							thenable = thenable.then(null, o => createThenValue(o, false))
						} else {
							thenable = thenable.then(o => createThenValue(o, false), null)
						}
					}
				}
				break
			case ThenType.ThenLast:
				try {
					if (isThenable(thenable)) {
						if (getThenThrow(i)) {
							if (valueInfo.useReject) {
								thenable = thenable.thenLast(null, o => {
									throw createThenValue(o, true)
								})
							} else {
								thenable = thenable.thenLast(o => {
									throw createThenValue(o, true)
								}, null)
							}
						} else {
							if (valueInfo.useReject) {
								thenable = thenable.thenLast(null, o => createThenValue(o, false))
							} else {
								thenable = thenable.thenLast(o => createThenValue(o, false), null)
							}
						}
					}
				} catch (err) {
					if (err instanceof Error) {
						throw err
					}
					assert.strictEqual(valueInfo.immediate, true)
					assert.strictEqual(valueInfo.useReject, true)
					assert.strictEqual(isThenable(err), false)
					assert.strictEqual(isIterator(err), false)
					valueInfo.useReject = false
					thenable = err
				}
				break
			// case ThenType.ResolveAsync:
			// 	break
			// case ThenType.ResolveValue:
			// 	break
		}
	}

	valueInfo.value = thenable
}

export class TestThenableSync extends TestVariants<
	IThenableSyncAction,
	IThenableSyncExpected,
	IThenableSyncOptionsVariant,
	IThenableSyncOptionsVariants
> {
	private constructor() {
		super()
	}

	protected baseOptionsVariants: IThenableSyncOptionsVariants = {
		value: ['v', void 0, ITERABLE, ITERATOR_GENERATOR],
		createValue1: Object.values(ValueType).filter(x => typeof x === 'number'),
		thenValue1: Object.values(ValueType).filter(x => typeof x === 'number'),
		thenThrow1: [false, true],
		thenType1: Object.values(ThenType).filter(x => typeof x === 'number'),

		createValue2: Object.values(ValueType).filter(x => typeof x === 'number'),
		thenValue2: Object.values(ValueType).filter(x => typeof x === 'number'),
		thenThrow2: [false, true],
		thenType2: Object.values(ThenType).filter(x => typeof x === 'number'),

		// createValue3: Object.values(ValueType).filter(x => typeof x === 'number'),
		// thenValue3: Object.values(ValueType).filter(x => typeof x === 'number'),
		// thenThrow3: [false, true],
		// thenType3: Object.values(ThenType).filter(x => typeof x === 'number'),
	}

	public static totalTests: number = 0

	protected testVariant(
		inputOptions: IThenableSyncOptionsVariant & IOptionsVariant<IThenableSyncAction, IThenableSyncExpected>,
	) {
		let error
		for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
			try {
				const options = resolveOptions(inputOptions, null)

				const action = () => {
					const resolveList = []

					const valueInfo = createValue(
						options.value,
						index => options['createValue' + index] as ValueType,
						resolve => resolveList.push(resolve),
					)

					createThen(
						valueInfo,
						index => options['thenValue' + index] as ValueType,
						resolve => resolveList.push(resolve),
						index => options['thenType' + index] as ThenType,
						index => options['thenThrow' + index] as boolean,
					)

					// region Check

					let queueSize = 0
					const onResult = o => {
						assert.ok(queueSize > 0)
						queueSize--
						assert.strictEqual(o, valueInfo.origValue)
					}

					if (valueInfo.useReject) {
						queueSize++
						ThenableSync.resolve(valueInfo.value, null, onResult)
					} else {
						queueSize++
						ThenableSync.resolve(valueInfo.value, onResult, null)
					}

					if (valueInfo.immediate) {
						assert.strictEqual(queueSize, 0)
					}

					// endregion
				}

				if (options.expected.error) {
					assert.throws(action, options.expected.error as TClass<Error>|Array<TClass<Error>>)
				} else {
					action()
				}

				break
			} catch (ex) {
				if (!debugIteration) {
					console.log(`Test number: ${TestThenableSync.totalTests}\r\nError in: ${
						inputOptions.description
						}\n`, inputOptions,
						// ${
						// JSON.stringify(initialOptions, null, 4)
						// }
						`\n${inputOptions.action.toString()}\n${ex && ex.stack}`)
					error = ex
				}
			} finally {
				TestThenableSync.totalTests++
			}
		}

		if (error) {
			throw error
		}
	}

	private static readonly _instance: TestThenableSync = new TestThenableSync()

	public static test(
		testCases: ITestCase<
			IThenableSyncAction,
			IThenableSyncExpected,
			IThenableSyncOptionsVariant
		> & IThenableSyncOptionsVariants,
	) {
		if (!testCases.actions) {
			// tslint:disable-next-line:no-empty
			testCases.actions = [() => {}]
		}
		TestThenableSync._instance.test(testCases)
	}
}
