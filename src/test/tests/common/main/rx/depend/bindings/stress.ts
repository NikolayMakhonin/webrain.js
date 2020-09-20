/* tslint:disable:no-identical-functions no-shadowed-variable */
import {AsyncValueOf} from '../../../../../../../main/common/async/async'
import {webrainOptions} from '../../../../../../../main/common/helpers/webrainOptions'
import {Random} from '../../../../../../../main/common/random/Random'
import {IUnbind} from '../../../../../../../main/common/rx/depend/bindings/contracts'
import {ObservableClass} from '../../../../../../../main/common/rx/object/ObservableClass'
import {ObservableObjectBuilder} from '../../../../../../../main/common/rx/object/ObservableObjectBuilder'
import {assert} from '../../../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../../../main/common/test/Mocha'
import {
	ISearchBestErrorMetrics,
	randomTestBuilder,
	searchBestErrorBuilder,
	testIterationBuilder,
	testIteratorBuilder,
} from '../../../../../../../main/common/test/randomTest'

declare const beforeEach: any

describe('common > main > rx > depend > bindings > stress', function() {
	this.timeout(24 * 60 * 60 * 1000)

	beforeEach(function() {
		webrainOptions.callState.garbageCollect.disabled = false
		webrainOptions.callState.garbageCollect.bulkSize = 100
		webrainOptions.callState.garbageCollect.interval = 1000
		webrainOptions.callState.garbageCollect.minLifeTime = 500
	})

	const propNames = ['prop1', 'prop2', 'prop3']

	interface IObject {
		prop1?: number
		prop2?: number
		prop3?: number
	}

	class ObjectClass
		extends ObservableClass
		implements IObject
	{
		public prop1: number
		public prop2: number
		public prop3: number
	}

	new ObservableObjectBuilder(ObjectClass.prototype)
		.writable('prop1')
		.writable('prop2')
		.writable('prop3')

	function fillObject(rnd: Random, obj: IObject) {
		obj.prop1 = rnd.nextInt(1000)
		obj.prop2 = rnd.nextInt(1000)
		obj.prop3 = rnd.nextInt(1000)
		return obj
	}

	function generateObject(rnd: Random) {
		return fillObject(rnd, new ObjectClass())
	}

	function generateCheckObject(rnd: Random) {
		return fillObject(rnd, { })
	}

	function generateItems<TItem>(rnd: Random, count: number, generateItem: (rnd: Random) => TItem) {
		const items = []
		for (let i = 0; i < count; i++) {
			items.push(generateItem(rnd))
		}
		return items
	}

	function generateNumber(rnd: Random, pattern: number | number[]) {
		return Array.isArray(pattern)
			? rnd.nextInt(pattern[0], pattern[1] + 1)
			: pattern
	}

	abstract class ObjectsBase<TObject extends IObject> {
		public readonly objects: TObject[]
		public constructor(objects: TObject[]) {
			this.objects = objects
		}

		public abstract setValue(objectNumber: number, propName: string, value: number)
	}

	class Objects extends ObjectsBase<ObjectClass> {
		public setValue(objectNumber: number, propName: string, value: number) {
			this.objects[objectNumber][propName] = value
		}
	}

	class CheckObjects extends ObjectsBase<IObject> {
		public setValue(objectNumber: number, propName: string, value: number) {
			if (this.objects[objectNumber][propName] !== value) {
				this.objects[objectNumber][propName] = value
				this.onChange(objectNumber, propName, value)
			}
		}

		private onChange(objectNumber: number, propName: string, value: number) {
			// TODO
		}

		private _bindings: {
			[key in string]: number
		}

		public bindOneWay(
			objectNumberFrom: number, propNameFrom: string,
			objectNumberTo: number, propNameTo: string,
		): IUnbind {
			const key = objectNumberFrom + '_' + propNameFrom + ' > '
				+ objectNumberTo + '_' + propNameTo

			this._bindings[key] = (this._bindings[key] || 0) + 1

			let unBinded
			return () => {
				if (unBinded) {
					return
				}
				unBinded = true

				assert.ok(this._bindings[key] >= 1)
				this._bindings[key]--
			}
		}

		public bindTwoWay(
			objectNumber1: number, propName1: string,
			objectNumber2: number, propName2: string,
		): IUnbind {
			const unbind1 = this.bindOneWay(objectNumber1, propName1, objectNumber2, propName2)
			const unbind2 = this.bindOneWay(objectNumber2, propName2, objectNumber1, propName1)

			return () => {
				unbind1()
				unbind2()
			}
		}
	}

	function simplifyObject(obj: IObject) {
		if (obj.constructor === Object) {
			return obj
		}
		const simplify = {}
		for (let i = 0; i < propNames.length; i++) {
			const propName = propNames[i]
			simplify[propName] = obj[propName]
		}
		return simplify
	}

	function simplifyObjects(items: IObject[]) {
		return items.map(simplifyObject)
	}

	function assertObjects(actual: IObject[], expected: IObject[]) {
		assert.deepStrictEqual(simplifyObjects(actual), simplifyObjects(expected))
	}

	// region metrics

	function createMetrics(testRunnerMetrics: ISearchBestErrorMetrics) {
		return {
			metric: 0,
		}
	}
	type IMetrics = AsyncValueOf<ReturnType<typeof createMetrics>>

	function compareMetrics(metrics: IMetrics, metricsMin: IMetrics): number {
		if (metrics.metric !== metricsMin.metric) {
			return metrics.metric < metricsMin.metric ? -1 : 0
		}
		return 0
	}

	// endregion

	// region options

	function optionsPatternBuilder(metrics: IMetrics, metricsMin: IMetrics) {
		return {
			countObjects: [1, 2],
			countValues: [1, 5],
			metrics,
			metricsMin,
		}
	}
	type IOptionsPattern = AsyncValueOf<ReturnType<typeof optionsPatternBuilder>>

	function optionsGenerator(rnd: Random, options: IOptionsPattern) {
		return {
			countObjects: generateNumber(rnd, options.countObjects),
			countValues: generateNumber(rnd, options.countValues),
			metrics: options.metrics,
			metricsMin: options.metricsMin,
		}
	}
	type IOptions = AsyncValueOf<ReturnType<typeof optionsGenerator>>

	// endregion

	// region state

	function createState(rnd: Random, options: IOptions) {
		const seed = rnd.nextSeed()
		const objects = generateItems(new Random(seed), options.countObjects, generateObject)
		const checkObjects = generateItems(new Random(seed), options.countObjects, generateCheckObject)
		assertObjects(objects, checkObjects)

		return {
			objects: new Objects(objects),
			checkObjects: new CheckObjects(checkObjects),
			options,
		}
	}
	type IState = AsyncValueOf<ReturnType<typeof createState>>

	// endregion

	// region action

	function action(rnd: Random, state: IState) {
		const objectNumber = rnd.nextInt(state.objects.objects.length)
		const propName = rnd.nextArrayItem(propNames)
		const value = rnd.nextInt(state.options.countValues)

		state.objects.setValue(objectNumber, propName, value)
		state.checkObjects.setValue(objectNumber, propName, value)

		assertObjects(state.objects.objects, state.checkObjects.objects)
	}

	// endregion

	// region testIteration

	const testIteration = testIterationBuilder({
		action: {
			weight: 1,
			func: action,
		},
	})

	// endregion

	// region testIterator

	const testIterator = testIteratorBuilder(
		createState,
		{
			stopPredicate(iterationNumber, timeStart, state) {
				return iterationNumber >= 100
			},
			testIteration,
		},
	)

	// endregion

	// region randomTest

	const randomTest = randomTestBuilder(
		createMetrics,
		optionsPatternBuilder,
		optionsGenerator,
		{
			compareMetrics,
			consoleThrowPredicate() {
				return this === 'error' || this === 'warn'
			},
			// searchBestError: searchBestErrorBuilderNode({
			// 	reportFilePath: './tmp/test-cases/depend/bindings/base.txt',
			// 	consoleOnlyBestErrors: true,
			// }),
			searchBestError: searchBestErrorBuilder({
				consoleOnlyBestErrors: true,
			}),
			testIterator,
		},
	)

	// endregion

	it('base', async function() {
		await randomTest({
			stopPredicate: testRunnerMetrics => {
				return testRunnerMetrics.iterationNumber >= 50
			},
			customSeed: null,
			metricsMin: null,
			searchBestError: false,
		})
	})
})
