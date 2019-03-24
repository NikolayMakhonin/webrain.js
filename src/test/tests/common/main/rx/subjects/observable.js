import {Observable} from '../../../../../../main/common/rx/subjects/observable'

describe('common > main > rx > observable', function () {
	it('Observable', function () {
		const observable = new Observable()
		let arg
		const result = observable.call(o => {
			arg = o
			return 'result'
		})

		assert.strictEqual(arg, observable)
		assert.strictEqual(result, 'result')
	})
})
