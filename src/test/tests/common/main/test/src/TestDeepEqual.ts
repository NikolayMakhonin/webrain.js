import {TClass} from '../../../../../../main/common/helpers/helpers'
import {assert} from '../../../../../../main/common/test/Assert'
import {DeepCloneEqual} from '../../../../../../main/common/test/DeepCloneEqual'
import {
	IOptionsVariant,
	IOptionsVariants,
	ITestCase,
	TestVariants,
} from '../../src/helpers/TestVariants'

export const deepCloneEqual = new DeepCloneEqual()

export interface IDeepEqualOptionsVariant {
	value1: any,
	value2: any,
	circular?: boolean,
	noCrossReferences?: boolean,
	equalTypes?: boolean
	equalInnerReferences?: boolean
	equalMapSetOrder?: boolean
	strictEqualFunctions?: boolean
}

interface IDeepEqualExpected {
	error?: (TClass<Error>|Array<TClass<Error>>)
		|((variant: IDeepEqualOptionsVariant) => TClass<Error>|Array<TClass<Error>>)
	result?: boolean|((variant: IDeepEqualOptionsVariant) => boolean)
}

interface IDeepEqualOptionsVariants extends IOptionsVariants {
	value1?: any[],
	value2?: any[],
	circular?: boolean[],
	noCrossReferences?: boolean[],
	equalTypes?: boolean[]
	equalInnerReferences?: boolean[]
	equalMapSetOrder?: boolean[]
	strictEqualFunctions?: boolean[]
}

type IDeepEqualAction = (...args: any[]) => any

function resolveValue(opts, value) {
	if (typeof value === 'function' && !(value instanceof Error)) {
		value = value(opts)
	}

	return value
}

function resolveOptions(
	optionsSource: IDeepEqualOptionsVariant & IOptionsVariant<IDeepEqualAction, IDeepEqualExpected>,
	optionsParams: IDeepEqualOptionsVariant & IOptionsVariant<IDeepEqualAction, IDeepEqualExpected>,
): IDeepEqualOptionsVariant & IOptionsVariant<IDeepEqualAction, IDeepEqualExpected> {

	const resolvedOptions: IDeepEqualOptionsVariant & IOptionsVariant<IDeepEqualAction, IDeepEqualExpected>
		= {...optionsSource} as any

	for (const key in resolvedOptions) {
		if (Object.prototype.hasOwnProperty.call(resolvedOptions, key)) {
			resolvedOptions[key] = key === 'action'
				? resolvedOptions[key]
				: resolveValue(optionsParams || resolvedOptions, resolvedOptions[key])
		}
	}

	resolvedOptions.expected = {}
	for (const key in optionsSource.expected) {
		if (Object.prototype.hasOwnProperty.call(optionsSource.expected, key)) {
			resolvedOptions.expected[key] =
				resolveValue(optionsParams || resolvedOptions, optionsSource.expected[key])
		}
	}

	return resolvedOptions
}

export class TestDeepEqual extends TestVariants<
	IDeepEqualAction,
	IDeepEqualExpected,
	IDeepEqualOptionsVariant,
	IDeepEqualOptionsVariants
> {
	private constructor() {
		super()
	}

	protected baseOptionsVariants: IDeepEqualOptionsVariants = {
		circular: [false, true],
		noCrossReferences: [false, true],
		equalTypes: [false, true],
		equalInnerReferences: [false, true],
		equalMapSetOrder: [false, true],
		strictEqualFunctions: [false, true],
	}

	public static totalTests: number = 0

	protected testVariant(
		inputOptions: IDeepEqualOptionsVariant & IOptionsVariant<IDeepEqualAction, IDeepEqualExpected>,
	) {
		let error
		for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
			try {
				const options = inputOptions = resolveOptions(inputOptions, null)

				const action = () => {
					const result = deepCloneEqual.equal(options.value1, options.value2, {
						circular: options.circular,
						equalTypes: options.equalTypes,
						noCrossReferences: options.noCrossReferences,
						equalInnerReferences: options.equalInnerReferences,
						equalMapSetOrder: options.equalMapSetOrder,
						strictEqualFunctions: options.strictEqualFunctions,
					})

					assert.strictEqual(result, options.expected.result)
				}

				if (options.expected.error) {
					assert.throws(action, options.expected.error as TClass<Error>|Array<TClass<Error>>)
				} else {
					action()
				}

				break
			} catch (ex) {
				if (!debugIteration) {
					console.log(`Test number: ${TestDeepEqual.totalTests}\r\nError in: ${
						inputOptions.description
						}\n`, inputOptions,
						// ${
						// JSON.stringify(initialOptions, null, 4)
						// }
						`\n${inputOptions.action.toString()}\n${ex.stack}`)
					error = ex
				}
			} finally {
				TestDeepEqual.totalTests++
			}
		}

		if (error) {
			throw error
		}
	}

	private static readonly _instance: TestDeepEqual = new TestDeepEqual()

	public static test(
		testCases: ITestCase<
			IDeepEqualAction,
			IDeepEqualExpected,
			IDeepEqualOptionsVariant
		> & IDeepEqualOptionsVariants,
	) {
		if (!testCases.actions) {
			// tslint:disable-next-line:no-empty
			testCases.actions = [() => {}]
		}
		TestDeepEqual._instance.test(testCases)
	}
}
