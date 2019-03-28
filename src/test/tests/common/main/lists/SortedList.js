import {SortedList} from '../../../../../main/common/lists/SortedList'

describe('common > main > lists > SortedList', function () {
	it('constructor', function () {
		let list = new SortedList()
		assert.strictEqual(Object.keys(list).length, 3, JSON.stringify(list))

		list = new SortedList({autoSort: true})
		assert.strictEqual(Object.keys(list).length, 4, JSON.stringify(list))
		assert.strictEqual(list.autoSort, true)

		const compare = () => {}
		list = new SortedList({compare})
		assert.strictEqual(Object.keys(list).length, 4, JSON.stringify(list))
		assert.strictEqual(list.compare, compare)

		list = new SortedList({notAddIfExists: true})
		assert.strictEqual(Object.keys(list).length, 4, JSON.stringify(list))
		assert.strictEqual(list.notAddIfExists, true)
	})
})
