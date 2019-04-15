/* tslint:disable:no-empty */
import {IListChanged} from '../../../../../../../main/common/lists/contracts/IListChanged'
import {IMapChanged} from '../../../../../../../main/common/lists/contracts/IMapChanged'
import {ISetChanged} from '../../../../../../../main/common/lists/contracts/ISetChanged'
import {ObservableMap} from '../../../../../../../main/common/lists/ObservableMap'
import {ObservableSet} from '../../../../../../../main/common/lists/ObservableSet'
import {SortedList} from '../../../../../../../main/common/lists/SortedList'
import {deepSubscribe} from '../../../../../../../main/common/rx/deep-subscribe/deep-subscribe'
import {RuleBuilder} from '../../../../../../../main/common/rx/deep-subscribe/RuleBuilder'
import {ObservableObject} from '../../../../../../../main/common/rx/object/ObservableObject'
import {ObservableObjectBuilder} from '../../../../../../../main/common/rx/object/ObservableObjectBuilder'
import {IUnsubscribe} from '../../../../../../../main/common/rx/subjects/subject'

type IAny = IObject | IList | ISet | IMap

interface IObject {
	observableObject: IObservableObject
	observableList: IObservableList
	observableSet: IObservableSet
	observableMap: IObservableMap
	object: IObject
	list: IList
	set: ISet
	map: IMap
	value: any
}

interface IList extends SortedList<IAny> {
}

interface ISet extends Set<IAny> {
}

interface IMap extends Map<string, IAny> {
}

interface IObservableObject extends IObject, ObservableObject {
}

interface IObservableList extends IList, IListChanged<IAny> {
}

interface IObservableSet extends ISet, ISetChanged<IAny> {
}

interface IObservableMap extends IMap, IMapChanged<string, IAny> {
}

declare const assert

export function createObject() {
	const object: IObject = {} as any
	const list: IList = new SortedList() as any
	// @ts-ignore
	Object.defineProperty(list, 'listChanged', {
		configurable: true,
		writable: true,
		value: null,
	})
	const set: ISet = new Set() as any
	const map: IMap = new Map() as any

	const observableObject: IObservableObject = new ObservableObject() as any
	const observableList: IObservableList = new SortedList() as any
	const observableSet: IObservableSet = new ObservableSet() as any
	const observableMap: IObservableMap = new ObservableMap() as any

	Object.assign(object, {
		observableObject,
		observableList,
		observableSet,
		observableMap,
		object,
		list,
		set,
		map,
		value: null,
	})

	const observableObjectBuilder = new ObservableObjectBuilder(observableObject)

	Object.keys(object).forEach(key => {
		list.add(object[key])
		set.add(object[key])
		map.set(key, object[key])

		observableObjectBuilder.writable(key, null, object[key])
		observableList.add(object[key])
		observableSet.add(object[key])
		observableMap.set(key, object[key])
	})

	return object
}

function checkArray<T>(actual: T[], expected: T[]) {
	const log = JSON.stringify({actual, expected}, null, 4)
	if (actual == null) {
		assert.strictEqual(expected, null, log)
		return
	}
	assert.strictEqual(actual.length, expected.length, log)
	for (let i = 0, len = actual.length; i < len; i++) {
		assert.strictEqual(actual[i], expected[i], log)
	}
}

function firstOrEmpty(array) {
	if (array.length === 0) {
		return 0
	}
	return [array[0]]
}

export class Tester<TObject, TValue> {
	private readonly _subscribed: TValue[][]
	private readonly _unsubscribed: TValue[][]
	private readonly _unsubscribe: IUnsubscribe[]
	private readonly _object: TObject
	private readonly _immediate: boolean
	private readonly _ignoreSubscribeCount: boolean
	private readonly _performanceTest: boolean
	private readonly _ruleBuilders: Array<(ruleBuilder: RuleBuilder<TObject>) => RuleBuilder<TValue>>

	constructor(
		{
			object,
			immediate,
			ignoreSubscribeCount,
			performanceTest,
		}:
			{
				object: TObject,
				immediate: boolean,
				ignoreSubscribeCount?: boolean,
				performanceTest?: boolean,
			},
		...ruleBuilders: Array<(ruleBuilder: RuleBuilder<TObject>) => RuleBuilder<TValue>>
	) {
		this._object = object
		this._immediate = immediate
		this._ignoreSubscribeCount = ignoreSubscribeCount
		this._performanceTest = performanceTest
		this._ruleBuilders = ruleBuilders
		this._unsubscribe = ruleBuilders.map(o => null)

		if (!performanceTest) {
			this._subscribed = ruleBuilders.map(o => [])
			this._unsubscribed = ruleBuilders.map(o => [])
		}
	}

	private checkSubscribes(subscribes: TValue[], expectedSubscribes: TValue[]) {
		if (!this._ignoreSubscribeCount) {
			assert.deepStrictEqual(subscribes, expectedSubscribes)
			return
		}

		if (!expectedSubscribes.length) {
			assert.strictEqual(subscribes.length, 0)
			return
		}

		for (let i = 0; i < subscribes.length; i++) {
			assert.equal(subscribes[i], expectedSubscribes[0])
		}
	}

	public subscribe(expectedSubscribed: TValue[]): this {
		const subscribe = (ruleBuilder, i) => {
			this._unsubscribe[i] = deepSubscribe(
				this._object,
				(value: TValue) => {
					if (!(value instanceof Object)) {
						return
					}

					if (this._performanceTest) {
						return () => {}
					}

					this._subscribed[i].push(value)

					return () => {
						this._unsubscribed[i].push(value)
					}
				},
				this._immediate,
				ruleBuilder)
		}

		if (this._performanceTest) {
			for (let i = 0; i < this._ruleBuilders.length; i++) {
				const ruleBuilder = this._ruleBuilders[i]
				subscribe(ruleBuilder, i)
			}

			return this
		}

		for (let i = 0; i < this._ruleBuilders.length; i++) {
			const ruleBuilder = this._ruleBuilders[i]

			assert.ok(this._unsubscribe[i] == null)
			assert.deepStrictEqual(this._subscribed[i], [])
			assert.deepStrictEqual(this._unsubscribed[i], [])

			subscribe(ruleBuilder, i)

			assert.deepStrictEqual(this._unsubscribed[i], [])

			if (!expectedSubscribed) {
				assert.strictEqual(this._unsubscribe[i], null)
				assert.deepStrictEqual(this._subscribed[i], [])
			} else {
				this.checkSubscribes(this._subscribed[i], expectedSubscribed)
				this._subscribed[i] = []
			}
		}

		return this
	}

	public change(
		changeFunc: (object: TObject) => TValue[][],
	): this {
		if (this._performanceTest) {
			changeFunc(this._object)
			return this
		}

		for (let i = 0; i < this._ruleBuilders.length; i++) {
			assert.deepStrictEqual(this._subscribed[i], [])
			assert.deepStrictEqual(this._unsubscribed[i], [])
		}

		const [
			expectedUnsubscribed,
			expectedSubscribed,
		] = changeFunc(this._object)

		for (let i = 0; i < this._ruleBuilders.length; i++) {
			this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed)
			this.checkSubscribes(this._subscribed[i], expectedSubscribed)
			this._unsubscribed[i] = []
			this._subscribed[i] = []
		}

		return this
	}

	public unsubscribe(expectedUnsubscribed: TValue[]): this {
		if (this._performanceTest) {
			for (let i = 0; i < this._ruleBuilders.length; i++) {
				this._unsubscribe[i]()
			}

			return this
		}

		for (let i = 0; i < this._ruleBuilders.length; i++) {
			assert.ok(this._unsubscribe[i])
			assert.deepStrictEqual(this._subscribed[i], [])
			assert.deepStrictEqual(this._unsubscribed[i], [])

			this._unsubscribe[i]()

			this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed)
			assert.deepStrictEqual(this._subscribed[i], [])
		}

		return this
	}
}

function repeat<TValue>(value: TValue, count): TValue[] {
	const array = []
	for (let i = 0; i < count; i++) {
		array.push(value)
	}
	return array
}
