/* tslint:disable:no-empty no-identical-functions no-construct use-primitive-type */
import {TOnFulfilled, TOnRejected} from '../../../../../../main/common/async/async'
import {ThenableSync} from '../../../../../../main/common/async/ThenableSync'
import {TClass} from '../../../../../../main/common/helpers/helpers'
import {assert} from '../../../../../../main/common/test/Assert'
import {IOptionsVariant, IOptionsVariants, ITestCase, TestVariants} from '../../src/helpers/TestVariants'

export interface IThenableSyncOptionsVariant {
	value?: any
	valueAsThenableSync?: boolean
	valueIsResolved?: boolean
	createWithExecutor?: boolean
	createWithIterator?: number
	resolveImmediate?: boolean
	getValueWithResolve?: number
	getValueWithThen?: number
	useReject?: boolean
}

interface IThenableSyncExpected {
	error?: TClass<Error>|Array<TClass<Error>>
		|((variant: IThenableSyncOptionsVariant) => TClass<Error>|Array<TClass<Error>>)
	value?: any|((variant: IThenableSyncOptionsVariant) => any)
}

interface IThenableSyncOptionsVariants extends IOptionsVariants {
	value?: any[]
	valueAsThenableSync?: boolean[]
	valueIsResolved?: boolean[]
	createWithExecutor?: boolean[]
	createWithIterator?: number[]
	resolveImmediate?: boolean[]
	getValueWithResolve?: number[]
	getValueWithThen?: number[]
	useReject?: boolean[]
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
			resolvedOptions[key] = key === 'action'
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

function createWithExecutor<T>() {
	let resultResolve = null
	let resultReject = null
	const thenable = new ThenableSync((resolve, reject) => {
		resultResolve = resolve
		resultReject = reject
	})
	assert.ok(resultResolve)
	assert.ok(resultReject)
	return [thenable, resultResolve, resultReject]
}

export const OBJ = {}
export const THEN_LIKE = { then: onfulfill => { onfulfill('THEN_LIKE') } }
export const FUNC = () => {}
export const ITERABLE = new Set()
export const ITERATOR_GENERATOR = function *() {
	yield OBJ
	return ITERABLE
}

function createWithIterator<T, TResult1 = T, TResult2 = never>(
	value: T | ThenableSync<T>,
	onfulfilled?: TOnFulfilled<T, TResult1>,
	onrejected?: TOnRejected<TResult2>,
) {
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

	return ThenableSync.resolve<T, TResult1, TResult2>(iterator, onfulfilled, onrejected)
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
		value: [void 0, null, false, 0, '', OBJ, FUNC, ITERABLE, ITERATOR_GENERATOR],
		valueAsThenableSync: [false, true],
		valueIsResolved: [false, true],
		createWithExecutor: [false, true],
		createWithIterator: [0, 1, 3],
		resolveImmediate: [true, false],
		getValueWithResolve: [0, 1, 3],
		getValueWithThen: [0, 1, 3],
		useReject: [false],
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
					let value = options.value
					if (value === ITERATOR_GENERATOR) {
						value = ITERATOR_GENERATOR()
					}

					const resolveImmediate = options.resolveImmediate
						&& (!options.valueAsThenableSync || options.valueIsResolved)

					assert.notStrictEqual(value && value.constructor, ThenableSync)
					assert.strictEqual(ThenableSync.isThenable(value), false)

					let thenable
					let resolve
					let reject
					if (options.createWithExecutor) {
						const result = createWithExecutor()
						thenable = result[0]
						resolve = result[1]
						reject = result[2]
					} else {
						thenable = new ThenableSync()
						resolve = thenable.resolve.bind(thenable)
						reject = thenable.reject.bind(thenable)
					}

					assert.strictEqual(thenable && thenable.constructor, ThenableSync)
					assert.strictEqual(ThenableSync.isThenable(thenable), true)

					if (options.valueAsThenableSync) {
						value = new ThenableSync()
						assert.strictEqual(ThenableSync.isThenable(value), true)
						if (options.valueIsResolved) {
							if (options.useReject) {
								value.reject(options.value)
							} else {
								value.resolve(options.value)
							}
						}
					}

					if (options.resolveImmediate) {
						if (options.useReject) {
							reject(value)
						} else {
							resolve(value)
						}
					}

					const resolveValue = <T>(func: () => T): T => {
						if (options.useReject) {
							try {
								return func()
							} catch (err) {
								return err
							}
						} else {
							return func()
						}
					}

					// if (options.createWithResolver) {
					// 	const oldValue = value
					// 	value = ThenableSync.resolve(value)
					// 	assert.strictEqual(value,
					// 		options.valueAsThenableSync && options.valueIsResolved
					// 			? options.value
					// 			: oldValue)
					// 	thenable = ThenableSync.resolve(thenable)
					// }

					// if (options.createWithIterator) {
					// 	if (!value || !(isIterable(value)))
					// 	{
					// 		const oldValue = value
					// 		value = ThenableSync.resolve(value)
					// 		assert.strictEqual(value,
					// 			options.valueAsThenableSync && options.valueIsResolved
					// 				? options.value
					// 				: oldValue)
					// 	}
					//
					// 	if (!thenable || !(isIterable(thenable))) {
					// 		thenable = ThenableSync.resolve(thenable)
					// 	}
					// }

					let countQueued = 0
					let countFulfilled = 0
					const fulfillResult = new String('Fulfill Result')

					const testThen = (then: (resolve, reject) => any, isThenResult = false) => {
						countQueued++
						let fulfilled = 0
						const onResult = o => {
							assert.ok(fulfilled <= 0)
							fulfilled++
							assert.strictEqual(o, options.expected.value)
							countFulfilled++
							return fulfillResult
						}

						if (options.useReject) {
							checkResult(resolveValue(() => then(null, null)), options.expected.value, isThenResult)
							checkResult(resolveValue(() => then(onResult, null)), options.expected.value, isThenResult)
							checkResult(resolveValue(() => then(null, onResult)), fulfillResult, isThenResult)
						} else {
							checkResult(resolveValue(() => then(null, null)), options.expected.value, isThenResult)
							checkResult(resolveValue(() => then(null, onResult)), options.expected.value, isThenResult)
							checkResult(resolveValue(() => then(onResult, null)), fulfillResult, isThenResult)
						}

						countQueued++
						fulfilled--
						checkResult(resolveValue(() => then(onResult, null)), fulfillResult, isThenResult)
					}

					const checkResult = (result, expected, isThenResult = false) => {
						if (!isThenResult && resolveImmediate) {
							assert.strictEqual(result, expected)
						} else {
							assert.strictEqual(result && result.constructor, ThenableSync)
							countQueued++
							let fulfilled
							const onResult = o => {
								assert.notOk(fulfilled)
								fulfilled = true
								assert.strictEqual(o, expected)
								countFulfilled++
								return expected
							}

							const thenResult = resolveValue(() => result.thenLast(onResult, onResult))
							if (resolveImmediate) {
								assert.strictEqual(thenResult, expected)
							} else {
								assert.notStrictEqual(thenResult, result)
								assert.strictEqual(thenResult.constructor, ThenableSync)
								assert.strictEqual(ThenableSync.isThenable(thenResult), true)
							}
						}
					}

					for (let i = 0; i < options.createWithIterator; i++) {
						if (options.getValueWithResolve) {
							testThen((r, e) => createWithIterator(thenable, r, e))
						}

						thenable = resolveValue(() => createWithIterator(thenable))
					}

					if (resolveImmediate && options.createWithIterator) {
						assert.strictEqual(thenable, options.expected.value)
					} else {
						assert.strictEqual(thenable && thenable.constructor, ThenableSync)
						assert.strictEqual(ThenableSync.isThenable(thenable), true)

						for (let i = 0; i < options.getValueWithThen; i++) {
							testThen((r, e) => {
								const thenResult = thenable.then(r, e)
								if (!options.useReject && r || options.useReject && e) {
									assert.notStrictEqual(thenResult, thenable)
								}
								assert.strictEqual(thenResult.constructor, ThenableSync)
								assert.strictEqual(ThenableSync.isThenable(thenResult), true)
								return thenResult
							}, true)
						}
					}

					for (let i = 0; i < options.getValueWithResolve; i++) {
						testThen((r, e) => ThenableSync.resolve(thenable, r, e))
					}

					if (!options.resolveImmediate) {
						assert.strictEqual(countFulfilled, 0)
						resolve(value)
					}

					if (options.valueAsThenableSync && !options.valueIsResolved) {
						assert.strictEqual(countFulfilled, 0)
						value.resolve(options.value)
					}

					assert.strictEqual(countFulfilled, countQueued)

					assert.throws(() => resolve(value), Error)
					assert.throws(() => resolve(value), Error)

					assert.strictEqual(countFulfilled, countQueued)
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
						`\n${inputOptions.action.toString()}\n${ex.stack}`)
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
