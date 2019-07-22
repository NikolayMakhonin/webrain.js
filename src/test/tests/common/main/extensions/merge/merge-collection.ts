/* tslint:disable:no-shadowed-variable */
import { deepEqual as deepStrictEqual } from 'fast-equals'
import {IMergeable, IMergeValue} from '../../../../../../main/common/extensions/merge/contracts'
import {
	CollectionMap,
	MergeCollection,
} from '../../../../../../main/common/extensions/merge/merge-collection'
import {ObjectMerger, registerMergeable} from '../../../../../../main/common/extensions/merge/mergers';

declare function deepStrictEqual(a, b): boolean
declare const assert

describe('common > main > rx > object > properties > merge-collection', function() {
	class Class implements IMergeable<Class, Class> {
		public id: string
		public value: string
		public mergeEnabled: boolean

		constructor(id: string, value: string, mergeEnabled: boolean) {
			this.id = id
			this.value = value
			this.mergeEnabled = mergeEnabled
		}

		// public fill(other: Class): boolean {
		// 	if (!this.mergeEnabled || other.id !== this.id) {
		// 		return false
		// 	}
		//
		// 	this.value = this.value + ', ' + other.value
		//
		// 	return true // (this.id as unknown as number|0) % 2 === 0 ? null : true
		// }

		public merge(
			merge: IMergeValue,
			older: Class,
			newer?: Class,
			set?: (value: Class) => void,
		): boolean {
			if (newer.id !== this.id) {
				set(newer)
				return true
			}

			if (!this.mergeEnabled || older.id !== this.id) {
				set(older)
				return true
			}

			let changed = false
			changed = merge(
				this.value,
				older.value,
				newer.value,
				o => this.value = o,
			) || changed

			return changed
		}
	}

	const objectMerger = new ObjectMerger()
	objectMerger.typeMeta.putMergeableType(Class)
	objectMerger.typeMeta.putType<string, string>(String as any, {
		merger: {
			merge(
				merge: IMergeValue,
				base: string,
				older: string,
				newer?: string,
				set?: (value: string) => void,
			): boolean {
				if (base === newer) {
					newer = older
				}
				if (base === newer) {
					return false
				}

				set(base + ', ' + newer)

				return true
			},
		},
	})

	it('merge simple', function() {
		const None = {}
		let base, older, newer, setItem

		base = new Class('1', 'v1', true)
		older = new Class('1', 'v2', true)
		newer = new Class('1', 'v3', true)
		setItem = None
		assert.strictEqual(objectMerger.merge(base, older, newer, null, o => setItem = o), true)
		assert.deepStrictEqual(base, new Class('1', 'v1, v3', true))
		assert.deepStrictEqual(older, new Class('1', 'v2', true))
		assert.deepStrictEqual(newer, new Class('1', 'v3', true))
		assert.strictEqual(setItem, None)

		base = new Class('1', 'v1', true)
		older = new Class('2', 'v1', true)
		newer = new Class('1', 'v1', true)
		setItem = None
		assert.strictEqual(objectMerger.merge(base, older, newer, null, o => setItem = o), true)
		assert.deepStrictEqual(base, new Class('1', 'v1', true))
		assert.deepStrictEqual(older, new Class('2', 'v1', true))
		assert.deepStrictEqual(newer, new Class('1', 'v1', true))
		assert.strictEqual(setItem, new Class('2', 'v1', true))
	})

	it('fillIterable', function() {
		const makeTarget = () => [
			new Class('1', 'v1', true),
			new Class('2', 'v2', true),
			new Class('3', 'v3', true),
			new Class('5', 'v5', true),
			new Class('5', 'v5a', true),
			new Class('11', 'v11', false),
			new Class('12', 'v12', false),
			new Class('13', 'v13', false),
			new Class('14', 'v14', false),
		]

		const makeOlder = (target: Class[]) => [
			target[0],
			new Class('2', 'v2a', true),
			new Class('2', 'v2b', true),
			new Class('7', 'v7', false),
			new Class('7', 'v7a', true),
			new Class('11', 'v11a', true),
			new Class('12', 'v12a', true),
			new Class('13', 'v13a', true),
			new Class('14', 'v14a', true),
		]

		const makeNewer = (target: Class[]) => [
			target[0],
			new Class('2', 'v2a', true),
			new Class('2', 'v2b', true),
			new Class('7', 'v7', false),
			new Class('7', 'v7a', true),
			new Class('11', 'v11a', true),
			new Class('12', 'v12a', true),
			new Class('13', 'v13a', true),
			new Class('14', 'v14a', true),
		]

		const mergeCollection = new MergeCollection<Class, Class, Class[]>(
			{
				getKey: o => o.id,
				merge: (base, older, newer, set) => objectMerger.merge(base, older, newer, null, set),
				add: (collection, id, item) => {
					assert.strictEqual(item.id, id)
					collection.push(item)
				},
				remove: (collection, id, index) => {
					assert.strictEqual(collection[index].id, id)
					collection.splice(index, 1)
				},
				set: (collection, id: string, item) => {
					assert.strictEqual(item.id, id)

					let index = null
					for (let i = 0; i < collection.length; i++) {
						if (collection[i].id === id) {
							index = i
							break
						}
					}

					assert.strictEqual(collection[index].id, id)
					assert.notStrictEqual(collection[index], item)

					if (((id as unknown as number | 0) % 2) === 0) {
						return false
					}

					collection[index] = item

					return (this.id as unknown as number | 0) % 2 === 0 ? null : true
				},
			},
		)

		function makeMap(collection: Class[]): CollectionMap<Class> {
			if (!collection) {
				return null
			}

			let map
			const prevLength = collection.length
			assert.strictEqual(
				mergeCollection.merge(collection, null, null, null, o => map = o),
				collection.length !== prevLength,
			)
			assert.ok(map)
			return map
		}

		function testFill(makeNewer: (target, older) => Class[]) {
			const target = makeTarget()
			const older = makeOlder(target)
			const newer = makeNewer(target, older)
			if (newer) {
				assert.ok(deepStrictEqual(newer, older) || deepStrictEqual(newer, target))
			}
			const olderMap = makeMap(older)
			const newerMap = makeMap(newer)

			assert.deepStrictEqual(older, [
				new Class('1', 'v1', true),
				new Class('2', 'v2a, v2b', true),
				new Class('7', 'v7a', true),
				new Class('11', 'v11a', true),
				new Class('12', 'v12a', true),
				new Class('13', 'v13a', true),
				new Class('14', 'v14a', true),
			])

			assert.strictEqual(mergeCollection.merge(target, olderMap, newerMap), true)

			assert.deepStrictEqual(older, [
				new Class('1', 'v1', true),
				new Class('2', 'v2a, v2b', true),
				new Class('7', 'v7a', true),
				new Class('11', 'v11a', true),
				new Class('12', 'v12a', true),
				new Class('13', 'v13a', true),
				new Class('14', 'v14a', true),
			])

			assert.deepStrictEqual(target, [
				new Class('1', 'v1', true),
				new Class('2', 'v2, v2a, v2b', true),
				new Class('11', 'v11a', true),
				new Class('13', 'v13a', true),
				new Class('14', 'v14a', true),
				new Class('12', 'v12a', true),
				new Class('7', 'v7a', true),
			])
		}

		testFill((target, older) => {
			return null
		})

		testFill((target, older) => {
			return makeOlder(makeTarget())
		})

		testFill((target, older) => {
			return makeOlder(target)
		})

		testFill((target, older) => {
			return older
		})

		testFill((target, older) => {
			return makeTarget()
		})

		testFill((target, older) => {
			return target
		})
	})

	// it('mergeIterable', function() {
	// 	const makeTarget = () => [
	// 		new Class('1', 'v1', true),
	// 		new Class('2', 'v2', true),
	// 		new Class('3', 'v3', true),
	// 		new Class('5', 'v5', true),
	// 		new Class('5', 'v5a', true),
	// 		new Class('11', 'v11', false),
	// 		new Class('12', 'v12', false),
	// 		new Class('13', 'v13', false),
	// 		new Class('14', 'v14', false),
	// 	]
	//
	// 	// tslint:disable-next-line:no-shadowed-variable
	// 	const makeOlder = (target: Class[]) => [
	// 		target[0],
	// 		new Class('2', 'v2a', true),
	// 		new Class('2', 'v2b', true),
	// 		new Class('7', 'v7', false),
	// 		new Class('7', 'v7a', true),
	// 		new Class('11', 'v11a', true),
	// 		new Class('12', 'v12a', true),
	// 		new Class('13', 'v13a', true),
	// 		new Class('14', 'v14a', true),
	// 	]
	//
	// 	const target = makeTarget()
	// 	const source = makeSource(target)
	//
	// 	const mergeCollection = new MergeCollection<Class, Class, Class[]>(
	// 		{
	// 			getKey: o => o.id,
	// 			merge: (base, older, newer, set) => objectMerger.merge(base, older, newer, null, set),
	// 			add: (collection, id, item) => {
	// 				assert.strictEqual(item.id, id)
	// 				collection.push(item)
	// 			},
	// 			remove: (collection, id, index) => {
	// 				assert.strictEqual(collection[index].id, id)
	// 				collection.splice(index, 1)
	// 			},
	// 			set: (collection, id: string, item) => {
	// 				assert.strictEqual(item.id, id)
	//
	// 				let index = null
	// 				for (let i = 0; i < collection.length; i++) {
	// 					if (collection[i].id === id) {
	// 						index = i
	// 						break
	// 					}
	// 				}
	//
	// 				assert.strictEqual(collection[index].id, id)
	// 				assert.notStrictEqual(collection[index], item)
	//
	// 				if (((id as unknown as number | 0) % 2) === 0) {
	// 					return false
	// 				}
	//
	// 				collection[index] = item
	//
	// 				return (this.id as unknown as number | 0) % 2 === 0 ? null : true
	// 			},
	// 		},
	// 	)
	//
	// 	let sourceMap
	// 	assert.strictEqual(mergeCollection.merge(source, null, null, null, o => sourceMap = o), true)
	// 	assert.ok(sourceMap)
	//
	// 	assert.deepStrictEqual(source, [
	// 		new Class('1', 'v1', true),
	// 		new Class('2', 'v2a, v2b', true),
	// 		new Class('7', 'v7a', true),
	// 		new Class('11', 'v11a', true),
	// 		new Class('12', 'v12a', true),
	// 		new Class('13', 'v13a', true),
	// 		new Class('14', 'v14a', true),
	// 	])
	//
	// 	assert.strictEqual(mergeCollection.merge(target, sourceMap), true)
	//
	// 	assert.deepStrictEqual(source, [
	// 		new Class('1', 'v1', true),
	// 		new Class('2', 'v2a, v2b', true),
	// 		new Class('7', 'v7a', true),
	// 		new Class('11', 'v11a', true),
	// 		new Class('12', 'v12a', true),
	// 		new Class('13', 'v13a', true),
	// 		new Class('14', 'v14a', true),
	// 	])
	//
	// 	assert.deepStrictEqual(target, [
	// 		new Class('1', 'v1', true),
	// 		new Class('2', 'v2, v2a, v2b', true),
	// 		new Class('11', 'v11a', true),
	// 		new Class('13', 'v13a', true),
	// 		new Class('14', 'v14a', true),
	// 		new Class('12', 'v12a', true),
	// 		new Class('7', 'v7a', true),
	// 	])
	// })
})
