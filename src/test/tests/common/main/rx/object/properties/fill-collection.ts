import {
	MergeCollection,
} from '../../../../../../../main/common/rx/object/properties/fill-collection'

declare const assert

describe('common > main > rx > object > properties > fill-collection > fillIterable', function() {
	class Class {
		public id: string
		public value: string[]
		public fillEnabled: boolean

		constructor(id: string, value: string[], fillEnabled: boolean) {
			this.id = id
			this.value = value
			this.fillEnabled = fillEnabled
		}

		public fill(other: Class): boolean {
			if (!this.fillEnabled || other.id !== this.id) {
				return false
			}

			this.value = [...this.value, ...other.value]

			return true // (this.id as unknown as number|0) % 2 === 0 ? null : true
		}
	}

	it('fillIterable', function() {
		const makeTarget = () => [
			new Class('1', ['v1'], true),
			new Class('2', ['v2'], true),
			new Class('3', ['v3'], true),
			new Class('5', ['v5'], true),
			new Class('5', ['v5a'], true),
			new Class('11', ['v11'], false),
			new Class('12', ['v12'], false),
			new Class('13', ['v13'], false),
			new Class('14', ['v14'], false),
		]

		// tslint:disable-next-line:no-shadowed-variable
		const makeSource = (target: Class[]) => [
			target[0],
			new Class('2', ['v2a'], true),
			new Class('2', ['v2b'], true),
			new Class('7', ['v7'], false),
			new Class('7', ['v7a'], true),
			new Class('11', ['v11a'], true),
			new Class('12', ['v12a'], true),
			new Class('13', ['v13a'], true),
			new Class('14', ['v14a'], true),
		]

		const target = makeTarget()
		const source = makeSource(target)

		const mergeCollection = new MergeCollection<Class, Class, Class[]>(
			{
				getKey: o => o.id,
				merge: (base, older, newer, set) => base !== older && (base && base.fill(older) || (set(older), true)),
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

					if (((id as unknown as number|0) % 2) === 0) {
						return false
					}

					collection[index] = item

					return (this.id as unknown as number|0) % 2 === 0 ? null : true
				},
			},
		)

		let sourceMap
		assert.strictEqual(mergeCollection.merge(source, null, null, null, o => sourceMap = o), true)
		assert.ok(sourceMap)

		assert.deepStrictEqual(source, [
			new Class('1', ['v1'], true),
			new Class('2', ['v2a', 'v2b'], true),
			new Class('7', ['v7a'], true),
			new Class('11', ['v11a'], true),
			new Class('12', ['v12a'], true),
			new Class('13', ['v13a'], true),
			new Class('14', ['v14a'], true),
		])

		assert.strictEqual(mergeCollection.merge(target, sourceMap), true)

		assert.deepStrictEqual(source, [
			new Class('1', ['v1'], true),
			new Class('2', ['v2a', 'v2b'], true),
			new Class('7', ['v7a'], true),
			new Class('11', ['v11a'], true),
			new Class('12', ['v12a'], true),
			new Class('13', ['v13a'], true),
			new Class('14', ['v14a'], true),
		])

		assert.deepStrictEqual(target, [
			new Class('1', ['v1'], true),
			new Class('2', ['v2', 'v2a', 'v2b'], true),
			new Class('11', ['v11a'], true),
			new Class('13', ['v13a'], true),
			new Class('14', ['v14a'], true),
			new Class('12', ['v12a'], true),
			new Class('7', ['v7a'], true),
		])
	})
})
