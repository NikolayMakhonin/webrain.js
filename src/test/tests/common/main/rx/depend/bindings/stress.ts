/* tslint:disable:no-identical-functions no-shadowed-variable */
import {AsyncValueOf} from '../../../../../../../main/common/async/async'
import {webrainOptions} from '../../../../../../../main/common/helpers/webrainOptions'
import {Random} from '../../../../../../../main/common/random/Random'
import {
	IDestBuilder,
	ISourceBuilder,
	ISourceDestBuilder,
	IUnbind
} from '../../../../../../../main/common/rx/depend/bindings/contracts'
import {
	DestPathBuilder,
	SourcePathBuilder,
} from '../../../../../../../main/common/rx/depend/bindings/SourceDestPathBuilder'
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
import {
	destPathBuilder,
	sourceDestBuilder,
	sourceDestPathBuilder,
	sourcePathBuilder
} from "../../../../../../../main/common/rx/depend/bindings/builders";
import {pathGetSetBuild} from "../../../../../../../main/common/rx/object/properties/path/builder";

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

	type TObject = IObject | {
		[key in string]?: number
	}
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

	function fillObject(rnd: Random, obj: TObject) {
		obj.prop1 = rnd.nextInt(1000)
		obj.prop2 = rnd.nextInt(1000)
		obj.prop3 = rnd.nextInt(1000)
		return obj
	}

	function generateObject(rnd: Random) {
		return fillObject(rnd, new ObjectClass() as any)
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

	abstract class ObjectsBase<TObj extends TObject> {
		public readonly objects: TObj[]
		public constructor(objects: TObj[]) {
			this.objects = objects
		}

		public abstract setValue(objectNumber: number, propName: string, value: number)
		public abstract bindOneWay(
			rnd: Random,
			objectNumberFrom: number, propNameFrom: string,
			objectNumberTo: number, propNameTo: string,
		): IUnbind
		public abstract bindTwoWay(
			rnd: Random,
			objectNumber1: number, propName1: string,
			objectNumber2: number, propName2: string,
		): IUnbind
	}

	const sources: {
		[key in string]: Array<ISourceBuilder<TObject, number>>
	} = {}
	const dests: {
		[key in string]: Array<IDestBuilder<TObject, number>>
	} = {}
	const sourceDests: {
		[key in string]: Array<ISourceDestBuilder<TObject, number>>
	} = {}

	for (let i = 0; i < propNames.length; i++) {
		const propName = propNames[i]

		sourceDests[propName] = [
			sourceDestPathBuilder<TObject>()(
				b => b.f(o => o[propName], (o, v) => { o[propName] = v }),
			),
			sourceDestPathBuilder<TObject>()(
				pathGetSetBuild(b => b.f(o => o[propName], (o, v) => { o[propName] = v })),
			),
			sourceDestPathBuilder<TObject>()(
				pathGetSetBuild(b => b.f(o => o[propName], (o, v) => { o[propName] = v })).pathGet,
				pathGetSetBuild(b => b.f(o => o[propName], (o, v) => { o[propName] = v })).pathSet,
			),
			sourceDestPathBuilder<TObject>()(
				b => b.f(o => o), {
					get: b => b.f(o => o[propName]),
					set: b => b.f(null, (o, v: number) => { o[propName] = v }),
				},
			),
			sourceDestPathBuilder<TObject, number>(
				b => b.f(o => o[propName], (o, v) => { o[propName] = v }),
			),
			sourceDestPathBuilder<TObject, number>(
				pathGetSetBuild(b => b.f(o => o[propName], (o, v) => { o[propName] = v })),
			),
			sourceDestPathBuilder<TObject, number>(
				pathGetSetBuild(b => b.f(o => o[propName])).pathGet,
				pathGetSetBuild(b => b.f(null, (o, v: number) => { o[propName] = v })).pathSet,
			),
			sourceDestPathBuilder<TObject, TObject, number>(
				b => b.f(o => o),
				{
					get: b => b.f(o => o[propName]),
					set: b => b.f(null, (o, v) => { o[propName] = v }),
				},
			),
		]

		sources[propName] = [
			...sourceDests[propName],
			sourcePathBuilder<TObject>()(b => b.f(o => o[propName])),
			sourcePathBuilder<TObject>()(
				pathGetSetBuild(b => b.f(o => o[propName])).pathGet,
			),
			sourcePathBuilder<TObject, number>(b => b.f(o => o[propName])),
			sourcePathBuilder<TObject, number>(
				pathGetSetBuild(b => b.f(o => o[propName])).pathGet,
			),
		]

		dests[propName] = [
			...sourceDests[propName],
			destPathBuilder<TObject>()(b => b.f(null, (o, v) => { o[propName] = v })),
			destPathBuilder<TObject>()(
				pathGetSetBuild(b => b.f(null, (o, v) => { o[propName] = v })).pathSet,
			),
			destPathBuilder<TObject, number>(b => b.f(null, (o, v) => { o[propName] = v })),
			destPathBuilder<TObject, number>(
				pathGetSetBuild(b => b.f(null, (o, v: number) => { o[propName] = v })).pathSet,
			),
		]
	}

	class Objects extends ObjectsBase<ObjectClass> {
		public setValue(objectNumber: number, propName: string, value: number) {
			this.objects[objectNumber][propName] = value
		}

		public bindOneWay(
			rnd: Random,
			objectNumberFrom: number, propNameFrom: string,
			objectNumberTo: number, propNameTo: string,
		): IUnbind {
			const sourceBuilder = rnd.nextArrayItem(sources[propNameFrom])
			const destBuilder = rnd.nextArrayItem(dests[propNameTo])

			const sourceObject = this.objects[objectNumberFrom]
			const destObject = this.objects[objectNumberTo]

			const source = sourceBuilder.get(sourceObject)
			const dest = destBuilder.get(destObject)

			const binder = source.getOneWayBinder(dest)

			return binder.bind()
		}

		public bindTwoWay(
			rnd: Random,
			objectNumber1: number, propName1: string,
			objectNumber2: number, propName2: string,
		): IUnbind {
			const builder1 = rnd.nextArrayItem(sourceDests[propName1])
			const builder2 = rnd.nextArrayItem(sourceDests[propName2])

			const object1 = this.objects[objectNumber1]
			const object2 = this.objects[objectNumber2]

			const sourceDest1 = builder1.get(object1)
			const sourceDest2 = builder2.get(object2)

			const binder = rnd.nextBoolean()
				? sourceDest1.getTwoWayBinder(sourceDest2)
				: sourceDest2.getTwoWayBinder(sourceDest1)

			return binder.bind()
		}
	}

	class CheckObjects extends ObjectsBase<TObject> {
		public setValue(objectNumber: number, propName: string, value: number) {
			if (this.objects[objectNumber][propName] !== value) {
				this.objects[objectNumber][propName] = value
				this.onChange(objectNumber, propName)
			}
		}

		private onChange(objectNumber: number, propName: string) {
			const keyFrom = objectNumber + '_' + propName

			const from = this._bindings[keyFrom]
			if (!from) {
				return
			}

			const value = this.objects[objectNumber][propName]

			for (const keyTo in from) {
				if (Object.prototype.hasOwnProperty.call(from, keyTo)) {
					const to = from[keyTo]
					this.setValue(to.objectNumber, to.propName, value)
				}
			}
		}

		private _bindings: {
			[key in string]: {
				[key in string]: {
					objectNumber: number,
					propName: string,
					count: number,
				}
			}
		} = {}

		public bindOneWay(
			rnd: Random,
			objectNumberFrom: number, propNameFrom: string,
			objectNumberTo: number, propNameTo: string,
		): IUnbind {
			const keyFrom = objectNumberFrom + '_' + propNameFrom
			const keyTo = objectNumberTo + '_' + propNameTo

			let from = this._bindings[keyFrom]
			if (!from) {
				this._bindings[keyFrom] = from = {}
			}

			let to = from[keyTo]
			if (!to) {
				from[keyTo] = to = {
					objectNumber: objectNumberTo,
					propName: propNameTo,
					count: 0,
				}
			}

			to.count++

			let unBinded
			return () => {
				if (unBinded) {
					return
				}
				unBinded = true

				assert.ok(to.count >= 0)
				to.count++
			}
		}

		public bindTwoWay(
			rnd: Random,
			objectNumber1: number, propName1: string,
			objectNumber2: number, propName2: string,
		): IUnbind {
			const unbind1 = this.bindOneWay(rnd, objectNumber1, propName1, objectNumber2, propName2)
			const unbind2 = this.bindOneWay(rnd, objectNumber2, propName2, objectNumber1, propName1)

			return () => {
				unbind1()
				unbind2()
			}
		}
	}

	function simplifyObject(obj: TObject) {
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

	function simplifyObjects(items: TObject[]) {
		return items.map(simplifyObject)
	}

	function assertObjects(actual: TObject[], expected: TObject[]) {
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
	}

	// endregion

	// region testIteration

	const testIteration = testIterationBuilder({
		waitAsyncAll: {
			weight: 0.05,
			after(rnd, state) {
				assertObjects(state.objects.objects, state.checkObjects.objects)
			},
		},
		waitAsyncRandom: {
			weight: 0.2,
		},
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
				return testRunnerMetrics.iterationNumber >= 50000
			},
			customSeed: null,
			metricsMin: null,
			searchBestError: false,
		})
	})
})
