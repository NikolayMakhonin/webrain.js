/* tslint:disable:no-identical-functions no-shadowed-variable */
import {AsyncValueOf} from '../../../../../../../main/common/async/async'
import {webrainOptions} from '../../../../../../../main/common/helpers/webrainOptions'
import {Random} from '../../../../../../../main/common/random/Random'
import {
	IDestBuilder,
	ISourceBuilder,
	ISourceDestBuilder,
	IUnbind,
} from '../../../../../../../main/common/rx/depend/bindings/contracts'
import {
	sourceDestBuilder,
} from '../../../../../../../main/common/rx/depend/bindings/SourceDestBuilder'
import {
	destPathBuilder,
	sourceDestPathBuilder,
	sourcePathBuilder,
} from '../../../../../../../main/common/rx/depend/bindings/SourceDestPathBuilder'
import {ObservableClass} from '../../../../../../../main/common/rx/object/ObservableClass'
import {ObservableObjectBuilder} from '../../../../../../../main/common/rx/object/ObservableObjectBuilder'
import {pathGetSetBuild} from '../../../../../../../main/common/rx/object/properties/path/builder'
import {assert} from '../../../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../../../main/common/test/Mocha'
import {
	ISearchBestErrorMetrics,
	randomTestBuilder,
	searchBestErrorBuilder,
	testIterationBuilder,
	testIteratorBuilder,
} from '../../../../../../../main/common/test/randomTest'
import {delay} from '../../../../../../../main/common/time/helpers'

declare const beforeEach: any

describe('common > main > rx > depend > bindings > stress', function() {
	this.timeout(24 * 60 * 60 * 1000)

	beforeEach(function() {
		webrainOptions.callState.garbageCollect.disabled = true
		webrainOptions.callState.garbageCollect.bulkSize = 100
		webrainOptions.callState.garbageCollect.interval = 1000
		webrainOptions.callState.garbageCollect.minLifeTime = 100
	})

	// region helpers

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
		public readonly unbinds: IUnbind[] = []
		public constructor(objects: TObj[]) {
			this.objects = objects
		}

		public abstract setValue(objectNumber: number, propName: string, value: number)
		public abstract bindOneWay(
			rnd: Random,
			objectNumberFrom: number, propNameFrom: string,
			objectNumberTo: number, propNameTo: string,
		): void
		public abstract bindTwoWay(
			rnd: Random,
			objectNumber1: number, propName1: string,
			objectNumber2: number, propName2: string,
		): void
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
				b => b.f(o => o[propName], (o, v) => {
					o[propName] = v
				}),
			),
			sourceDestPathBuilder<TObject>()(
				pathGetSetBuild(b => b.f(o => o[propName], (o, v) => {
					o[propName] = v
				})),
			),
			sourceDestPathBuilder<TObject>()(
				pathGetSetBuild(b => b.f(o => o[propName], (o, v) => {
					o[propName] = v
				})).pathGet,
				pathGetSetBuild(b => b.f(o => o[propName], (o, v) => {
					o[propName] = v
				})).pathSet,
			),
			sourceDestPathBuilder<TObject>()(
				b => b.f(o => o), {
					get: b => b.f(o => o[propName]),
					set: b => b.f(null, (o, v: number) => {
						o[propName] = v
					}),
				},
			),
			sourceDestPathBuilder<TObject, number>(
				b => b.f(o => o[propName], (o, v) => {
					o[propName] = v
				}),
			),
			sourceDestPathBuilder<TObject, number>(
				pathGetSetBuild(b => b.f(o => o[propName], (o, v) => {
					o[propName] = v
				})),
			),
			sourceDestPathBuilder<TObject, number>(
				pathGetSetBuild(b => b.f(o => o[propName])).pathGet,
				pathGetSetBuild(b => b.f(null, (o, v: number) => {
					o[propName] = v
				})).pathSet,
			),
			sourceDestPathBuilder<TObject, TObject, number>(
				b => b.f(o => o),
				{
					get: b => b.f(o => o[propName]),
					set: b => b.f(null, (o, v) => {
						o[propName] = v
					}),
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
			destPathBuilder<TObject>()(b => b.f(null, (o, v) => {
				o[propName] = v
			})),
			destPathBuilder<TObject>()(
				pathGetSetBuild(b => b.f(null, (o, v) => {
					o[propName] = v
				})).pathSet,
			),
			destPathBuilder<TObject, number>(b => b.f(null, (o, v) => {
				o[propName] = v
			})),
			destPathBuilder<TObject, number>(
				pathGetSetBuild(b => b.f(null, (o, v: number) => {
					o[propName] = v
				})).pathSet,
			),
		]
}

	interface ISourcesDests {
		sources: {
			[key in string]: ISourceBuilder<TObject, number>
		},
		dests: {
			[key in string]: IDestBuilder<TObject, number>
		},
		sourceDests: {
			[key in string]: ISourceDestBuilder<TObject, number>
		},
	}

	function generateSourceDests(rnd: Random): ISourcesDests {
		const result: ISourcesDests = {
			sources: {},
			dests: {},
			sourceDests: {},
		}

		for (let i = 0; i < propNames.length; i++) {
			const propName = propNames[i]
			result.sources[propName] = rnd.nextArrayItem(sources[propName])
			result.dests[propName] = rnd.nextArrayItem(dests[propName])
			result.sourceDests[propName] = sourceDestBuilder(
				result.sources[propName],
				result.dests[propName],
			)
		}

		return result
	}

	class Objects extends ObjectsBase<ObjectClass> {
		private _sourcesDests: ISourcesDests

		constructor(objects: ObjectClass[], sourcesDests: ISourcesDests) {
			super(objects)
			this._sourcesDests = sourcesDests
		}

		public setValue(
			objectNumber: number,
			propName: string,
			value: number,
		) {
			this.objects[objectNumber][propName] = value
		}

		public bindOneWay(
			rnd: Random,
			objectNumberFrom: number, propNameFrom: string,
			objectNumberTo: number, propNameTo: string,
		): void {
			const sourceBuilder = this._sourcesDests.sources[propNameFrom]
			const destBuilder = this._sourcesDests.dests[propNameTo]

			const sourceObject = this.objects[objectNumberFrom]
			const destObject = this.objects[objectNumberTo]

			const source = sourceBuilder.getSource(sourceObject)
			const dest = destBuilder.getDest(destObject)

			const binder = source.getOneWayBinder(dest)

			this.unbinds.push(binder.bind())
		}

		public bindTwoWay(
			rnd: Random,
			objectNumber1: number, propName1: string,
			objectNumber2: number, propName2: string,
		): void {
			const builder1 = this._sourcesDests.sourceDests[propName1]
			const builder2 = this._sourcesDests.sourceDests[propName2]

			const object1 = this.objects[objectNumber1]
			const object2 = this.objects[objectNumber2]

			const sourceDest1 = builder1.getSourceDest(object1)
			const sourceDest2 = builder2.getSourceDest(object2)

			const binder = sourceDest1.getTwoWayBinder(sourceDest2)

			this.unbinds.push(binder.bind())
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
					if (to.count > 0) {
						this.setValue(to.objectNumber, to.propName, value)
					}
				}
			}
		}

		public countBindings: number = 0

		private _bindings: {
			[key in string]: {
				[key in string]: {
					objectNumber: number,
					propName: string,
					count: number,
				}
			}
		} = {}

		private _bindOneWay(
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
			this.countBindings++

			if (to.count === 1) {
				const value = this.objects[objectNumberFrom][propNameFrom]
				this.setValue(to.objectNumber, to.propName, value)
			}

			let unBinded
			return () => {
				if (unBinded) {
					return
				}
				unBinded = true

				assert.ok(to.count >= 0)
				to.count--
				this.countBindings--
			}
		}

		public bindOneWay(
			rnd: Random,
			objectNumberFrom: number, propNameFrom: string,
			objectNumberTo: number, propNameTo: string,
		): void {
			this.unbinds.push(this._bindOneWay(
				rnd, objectNumberFrom, propNameFrom, objectNumberTo, propNameTo,
			))
		}

		public bindTwoWay(
			rnd: Random,
			objectNumber1: number, propName1: string,
			objectNumber2: number, propName2: string,
		): void {
			const unbind1 = this._bindOneWay(rnd, objectNumber1, propName1, objectNumber2, propName2)
			const unbind2 = this._bindOneWay(rnd, objectNumber2, propName2, objectNumber1, propName1)

			this.unbinds.push(() => {
				unbind1()
				unbind2()
			})
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
		actual = simplifyObjects(actual)
		expected = simplifyObjects(expected)
		assert.deepStrictEqual(actual, expected)
	}

	function equalObject(actual: TObject, expected: TObject) {
		for (let i = 0, len = propNames.length; i < len; i++) {
			const propName = propNames[i]
			if (actual[propName] !== expected[propName]) {
				return false
			}
		}
		return true
	}

	function equalObjects(actual: TObject[], expected: TObject[]) {
		const len = actual.length
		if (len !== expected.length) {
			return false
		}
		for (let i = 0; i < len; i++) {
			if (!equalObject(actual[i], expected[i])) {
				return false
			}
		}
		return true
	}

	// endregion

	// region metrics

	function createMetrics(testRunnerMetrics: ISearchBestErrorMetrics) {
		return {
			countObjects: 0,
			iterations: 0,
			countUnBinds: 0,
			countBinds: 0,
			countSetsLast: 0,
			countChecksLast: 0,
			countSets: 0,
			countChecks: 0,
		}
	}
	type IMetrics = AsyncValueOf<ReturnType<typeof createMetrics>>

	function compareMetrics(metrics: IMetrics, metricsMin: IMetrics): number {
		if (metrics.countObjects !== metricsMin.countObjects) {
			return metrics.countObjects < metricsMin.countObjects ? -1 : 1
		}
		if (metrics.iterations !== metricsMin.iterations) {
			return metrics.iterations < metricsMin.iterations ? -1 : 1
		}
		if (metrics.countUnBinds !== metricsMin.countUnBinds) {
			return metrics.countUnBinds < metricsMin.countUnBinds ? -1 : 1
		}
		if (metrics.countBinds !== metricsMin.countBinds) {
			return metrics.countBinds < metricsMin.countBinds ? -1 : 1
		}
		if (metrics.countSetsLast !== metricsMin.countSetsLast) {
			return metrics.countSetsLast < metricsMin.countSetsLast ? -1 : 1
		}
		if (metrics.countChecksLast !== metricsMin.countChecksLast) {
			return metrics.countChecksLast < metricsMin.countChecksLast ? -1 : 1
		}
		if (metrics.countSets !== metricsMin.countSets) {
			return metrics.countSets < metricsMin.countSets ? -1 : 1
		}
		if (metrics.countChecks !== metricsMin.countChecks) {
			return metrics.countChecks < metricsMin.countChecks ? -1 : 1
		}
		return 0
	}

	// endregion

	// region options

	function optionsPatternBuilder(metrics: IMetrics, metricsMin: IMetrics) {
		return {
			countObjects: [1, 1],
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
			objects: new Objects(objects, generateSourceDests(rnd)),
			checkObjects: new CheckObjects(checkObjects),
			unbinds: [] as IUnbind[],
			options,
		}
	}
	type IState = AsyncValueOf<ReturnType<typeof createState>>

	// endregion

	// region action

	async function action(rnd: Random, state: IState) {
		state.options.metrics.iterations++

		const objectNumber = rnd.nextInt(state.objects.objects.length)
		const propName = rnd.nextArrayItem(propNames)
		let shouldWait = false

		if (rnd.nextBoolean(0.8)) {
			shouldWait = true
			const value = rnd.nextInt(state.options.countValues)
			state.options.metrics.countSets++
			state.options.metrics.countSetsLast++
			state.options.metrics.countChecksLast = 0
			state.objects.setValue(objectNumber, propName, value)
			state.checkObjects.setValue(objectNumber, propName, value)
		} else if (rnd.nextBoolean()) {
			shouldWait = true
			const objectNumberTo = rnd.nextInt(state.objects.objects.length)
			const propNameTo = rnd.nextArrayItem(propNames)
			state.options.metrics.countSetsLast = 0
			state.options.metrics.countChecksLast = 0
			if (rnd.nextBoolean()) {
				state.options.metrics.countBinds++
				state.objects.bindOneWay(rnd,
					objectNumber, propName,
					objectNumberTo, propNameTo,
				)
				state.checkObjects.bindOneWay(rnd,
					objectNumber, propName,
					objectNumberTo, propNameTo,
				)
			} else {
				state.options.metrics.countBinds += 2
				state.objects.bindTwoWay(rnd,
					objectNumber, propName,
					objectNumberTo, propNameTo,
				)
				state.checkObjects.bindTwoWay(rnd,
					objectNumber, propName,
					objectNumberTo, propNameTo,
				)
			}
		} else {
			const len = state.checkObjects.unbinds.length
			if (len > 0) {
				state.options.metrics.countUnBinds++
				const seed = rnd.nextSeed()
				const unbind = new Random(seed).pullArrayItem(state.objects.unbinds)
				const checkUnbind = new Random(seed).pullArrayItem(state.checkObjects.unbinds)
				unbind()
				checkUnbind()
			}
		}

		assert.strictEqual(state.objects.unbinds.length, state.checkObjects.unbinds.length)

		// if (shouldWait) {
		for (let i = 0, len = 1 + (state.checkObjects as any).countBindings * 3; i < len; i++) {
			await delay(1)
			// if (equalObjects(state.objects.objects, state.checkObjects.objects)) {
			// 	return
			// }
		}
		// }

		assertObjects(state.objects.objects, state.checkObjects.objects)
	}

	// endregion

	// region testIteration

	const testIteration = testIterationBuilder({
		// waitAsyncAll: {
		// 	weight: 0.05,
		// 	async after(rnd, state) {
		// 		for (let i = 0; i < 50; i++) {
		// 			await delay(1)
		// 		}
		// 		// await delay(1000)
		// 		state.options.metrics.countChecks++
		// 		state.options.metrics.countChecksLast++
		// 		assertObjects(state.objects.objects, state.checkObjects.objects)
		// 	},
		// },
		// waitAsyncRandom: {
		// 	weight: 0.2,
		// },
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
			before(rnd, state) {
				state.options.metrics.countObjects = state.objects.objects.length
			},
			stopPredicate(iterationNumber, timeStart, state) {
				const metrics = state.options.metrics
				const metricsMin = state.options.metricsMin

				if (metrics.iterations > metricsMin.iterations) {
					return true
				}

				if (metrics.countBinds > metricsMin.countBinds) {
					return true
				}

				if (metrics.countBinds === metricsMin.countBinds) {
					if (metrics.countSetsLast > metricsMin.countSetsLast) {
						return true
					}

					if (metrics.countSetsLast === metricsMin.countSetsLast) {
						if (metrics.countChecksLast > metricsMin.countChecksLast) {
							return true
						}

						if (metrics.countChecksLast === metricsMin.countChecksLast) {
							return true
						}
					}
				}

				return iterationNumber >= 100
			},
			testIteration,
			consoleThrowPredicate() {
				return this === 'error' || this === 'warn'
			},
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

	xit('base', async function() {
		await randomTest({
			stopPredicate: testRunnerMetrics => {
				return false
				// return testRunnerMetrics.iterationNumber >= 50
			},
			// customSeed: 483882272,
			// metricsMin: {"countObjects":1,"iterations":11,"countUnBinds":1,"countBinds":5,"countSetsLast":0,"countChecksLast":0,"countSets":7,"countChecks":0},
			// customSeed: 1036614010,
			// metricsMin: {"countObjects":1,"iterations":10,"countUnBinds":1,"countBinds":4,"countSetsLast":0,"countChecksLast":0,"countSets":7,"countChecks":0},
			// customSeed: 185088415,
			// metricsMin: {"countObjects":1,"iterations":9,"countUnBinds":1,"countBinds":3,"countSetsLast":0,"countChecksLast":0,"countSets":6,"countChecks":0},
			searchBestError: true,
		})

		// process.exit(1)
	})
})
