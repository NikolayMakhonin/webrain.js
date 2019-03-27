import {SortedList} from '../../../../../main/common/lists/SortedList'

describe('common > main > lists > SortedList', function () {
	it('constructor', function () {
		let list = new SortedList()
		assert.deepStrictEqual(Object.keys(list), ['_list'])
		assert.deepStrictEqual(list._list, [])
	})
})
