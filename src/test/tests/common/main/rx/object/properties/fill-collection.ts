import {
	FillCollection,
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

			return (this.id as unknown as number|0) % 2 === 0 ? null : true
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

		const fillCollection = FillCollection
			.fillFrom(
				source,
				{
					getKey: o => o.id,
					fill: (o1, o2) => o1.fill(o2),
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

		assert.ok(fillCollection)

		assert.deepStrictEqual(source, [
			new Class('1', ['v1'], true),
			new Class('2', ['v2a', 'v2b'], true),
			new Class('7', ['v7a'], true),
			new Class('11', ['v11a'], true),
			new Class('12', ['v12a'], true),
			new Class('13', ['v13a'], true),
			new Class('14', ['v14a'], true),
		])

		assert.strictEqual(fillCollection.fillTo(target), fillCollection)

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
