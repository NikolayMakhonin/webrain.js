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
import {Assert} from '../../../../../../../main/common/test/Assert'
import {DeepCloneEqual} from '../../../../../../../main/common/test/DeepCloneEqual'
import {delay} from "../../../../../../../main/common/helpers/helpers";

const assert = new Assert(new DeepCloneEqual({
	commonOptions: {

	},
	equalOptions: {
		equalInnerReferences: true,
		equalMapSetOrder: true,
	},
}))

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
	promiseSync: { then(value: any): any }
	promiseAsync: { then(value: any): any }
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
		promiseSync: { then: resolve => resolve(observableObject) },
		promiseAsync: { then: resolve => setTimeout(() => resolve(observableObject), 0) }	,
	})

	const observableObjectBuilder = new ObservableObjectBuilder(observableObject)

	Object.keys(object).forEach(key => {
		if (key !== 'value') {
			list.add(object[key])
			set.add(object[key])
			map.set(key, object[key])

			observableList.add(object[key])
			observableSet.add(object[key])
			observableMap.set(key, object[key])
		}

		observableObjectBuilder.writable(key, null, object[key])
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
	private readonly _doNotSubscribeNonObjectValues: boolean
	private readonly _useIncorrectUnsubscribe: boolean
	private readonly _ruleBuilders: Array<(ruleBuilder: RuleBuilder<TObject>) => RuleBuilder<TValue>>

	constructor(
		{
			object,
			immediate,
			ignoreSubscribeCount,
			performanceTest,
			doNotSubscribeNonObjectValues,
			useIncorrectUnsubscribe,
		}:
			{
				object: TObject,
				immediate: boolean,
				ignoreSubscribeCount?: boolean,
				performanceTest?: boolean,
				doNotSubscribeNonObjectValues?: boolean,
				useIncorrectUnsubscribe?: boolean,
			},
		...ruleBuilders: Array<(ruleBuilder: RuleBuilder<TObject>) => RuleBuilder<TValue>>
	) {
		this._object = object
		this._immediate = immediate
		this._ignoreSubscribeCount = ignoreSubscribeCount
		this._performanceTest = performanceTest
		this._doNotSubscribeNonObjectValues = doNotSubscribeNonObjectValues
		this._ruleBuilders = ruleBuilders
		this._useIncorrectUnsubscribe = useIncorrectUnsubscribe
		this._unsubscribe = ruleBuilders.map(o => null)

		if (!performanceTest) {
			this._subscribed = ruleBuilders.map(o => [])
			this._unsubscribed = ruleBuilders.map(o => [])
		}
	}

	private checkSubscribes(
		subscribes: TValue[],
		expectedSubscribes: TValue[]|((object: TObject) => TValue[]),
	) {
		if (typeof expectedSubscribes === 'function') {
			expectedSubscribes = expectedSubscribes(this._object)
		}

		if (!this._ignoreSubscribeCount) {
			assert.circularDeepStrictEqual(subscribes, expectedSubscribes)
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

	private subscribePrivate(ruleBuilder, i) {
		this._unsubscribe[i] = deepSubscribe(
			this._object,
			(value: TValue) => {
				if (this._doNotSubscribeNonObjectValues && !(value instanceof Object)) {
					return
				}

				if (this._performanceTest) {
					return () => {}
				}

				this._subscribed[i].push(value)

				if (this._useIncorrectUnsubscribe) {
					return 'Test Incorrect Unsubscribe' as any
				}

				return () => {
					this._unsubscribed[i].push(value)
				}
			},
			this._immediate,
			ruleBuilder)
	}

	// region Sync

	public subscribe(
		expectedSubscribed: TValue[]|((object: TObject) => TValue[]),
		expectedUnsubscribed?: TValue[]|((object: TObject) => TValue[]),
		errorType?: new () => Error,
		errorRegExp?: RegExp,
	): this {
		if (this._performanceTest) {
			for (let i = 0; i < this._ruleBuilders.length; i++) {
				const ruleBuilder = this._ruleBuilders[i]
				this.subscribePrivate(ruleBuilder, i)
			}

			return this
		}

		for (let i = 0; i < this._ruleBuilders.length; i++) {
			const ruleBuilder = this._ruleBuilders[i]

			assert.ok(this._unsubscribe[i] == null)
			assert.deepStrictEqual(this._subscribed[i], [])
			assert.deepStrictEqual(this._unsubscribed[i], [])

			if (errorType) {
				assert.throws(() => this.subscribePrivate(ruleBuilder, i), errorType, errorRegExp)
			} else {
				this.subscribePrivate(ruleBuilder, i)
				expectedUnsubscribed = []
			}

			this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed)

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
		changeFunc: (object: TObject) => void,
		expectedUnsubscribed: TValue[]|((object: TObject) => TValue[]),
		expectedSubscribed: TValue[]|((object: TObject) => TValue[]),
		errorType?: new () => Error,
		errorRegExp?: RegExp,
	): this {
		if (this._performanceTest) {
			changeFunc(this._object)
			return this
		}

		for (let i = 0; i < this._ruleBuilders.length; i++) {
			assert.deepStrictEqual(this._subscribed[i], [])
			assert.deepStrictEqual(this._unsubscribed[i], [])
		}

		if (typeof expectedUnsubscribed === 'function') {
			expectedUnsubscribed = expectedUnsubscribed(this._object)
		}

		if (errorType) {
			assert.throws(() => changeFunc(this._object), errorType, errorRegExp)
		} else {
			changeFunc(this._object)
		}

		for (let i = 0; i < this._ruleBuilders.length; i++) {
			this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed)
			this.checkSubscribes(this._subscribed[i], expectedSubscribed)
			this._unsubscribed[i] = []
			this._subscribed[i] = []
		}

		return this
	}

	public unsubscribe(
		expectedUnsubscribed: TValue[]|((object: TObject) => TValue[]),
		errorType?: new () => Error,
		errorRegExp?: RegExp,
	): this {
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

			if (errorType) {
				assert.throws(() => this._unsubscribe[i](), errorType, errorRegExp)
				assert.deepStrictEqual(this._subscribed[i], [])
				assert.deepStrictEqual(this._unsubscribed[i], [])
			} else {
				this._unsubscribe[i]()
				this._unsubscribe[i]()
				this._unsubscribe[i]()
				this._unsubscribe[i] = null

				this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed)
				assert.deepStrictEqual(this._subscribed[i], [])
				this._unsubscribed[i] = []
			}
		}

		return this
	}

	// endregion

	// rergion Async

	public async subscribeAsync(
		expectedSubscribed: TValue[]|((object: TObject) => TValue[]),
		expectedUnsubscribed?: TValue[]|((object: TObject) => TValue[]),
		errorType?: new () => Error,
		errorRegExp?: RegExp,
	): Promise<this> {

		if (this._performanceTest) {
			for (let i = 0; i < this._ruleBuilders.length; i++) {
				const ruleBuilder = this._ruleBuilders[i]
				this.subscribePrivate(ruleBuilder, i)
			}

			return this
		}

		for (let i = 0; i < this._ruleBuilders.length; i++) {
			const ruleBuilder = this._ruleBuilders[i]

			assert.ok(this._unsubscribe[i] == null)
			assert.deepStrictEqual(this._subscribed[i], [])
			assert.deepStrictEqual(this._unsubscribed[i], [])

			if (errorType) {
				assert.throws(() => this.subscribePrivate(ruleBuilder, i), errorType, errorRegExp)
			} else {
				this.subscribePrivate(ruleBuilder, i)
				expectedUnsubscribed = []
			}

			await delay(10)

			this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed)

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

	public async changeAsync(
		changeFunc: (object: TObject) => void,
		expectedUnsubscribed: TValue[]|((object: TObject) => TValue[]),
		expectedSubscribed: TValue[]|((object: TObject) => TValue[]),
		errorType?: new () => Error,
		errorRegExp?: RegExp,
	): Promise<this> {
		if (this._performanceTest) {
			changeFunc(this._object)
			return this
		}

		for (let i = 0; i < this._ruleBuilders.length; i++) {
			assert.deepStrictEqual(this._subscribed[i], [])
			assert.deepStrictEqual(this._unsubscribed[i], [])
		}

		if (typeof expectedUnsubscribed === 'function') {
			expectedUnsubscribed = expectedUnsubscribed(this._object)
		}

		if (errorType) {
			assert.throws(() => changeFunc(this._object), errorType, errorRegExp)
		} else {
			changeFunc(this._object)
		}

		await delay(10)

		for (let i = 0; i < this._ruleBuilders.length; i++) {
			this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed)
			this.checkSubscribes(this._subscribed[i], expectedSubscribed)
			this._unsubscribed[i] = []
			this._subscribed[i] = []
		}

		return this
	}

	public async unsubscribeAsync(
		expectedUnsubscribed: TValue[]|((object: TObject) => TValue[]),
		errorType?: new () => Error,
		errorRegExp?: RegExp,
	): Promise<this> {
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

			if (errorType) {
				assert.throws(() => this._unsubscribe[i](), errorType, errorRegExp)
				assert.deepStrictEqual(this._subscribed[i], [])
				assert.deepStrictEqual(this._unsubscribed[i], [])
			} else {
				this._unsubscribe[i]()
				this._unsubscribe[i]()
				this._unsubscribe[i]()
				this._unsubscribe[i] = null

				await delay(10)

				this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed)
				assert.deepStrictEqual(this._subscribed[i], [])
				this._unsubscribed[i] = []
			}
		}

		return this
	}

	// endregion
}

function repeat<TValue>(value: TValue, count): TValue[] {
	const array = []
	for (let i = 0; i < count; i++) {
		array.push(value)
	}
	return array
}
