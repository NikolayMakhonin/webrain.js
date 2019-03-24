import '../../../../../../main/common/rx/extensions/unsubscribeValue'
import {TestSubject} from '../src/TestSubject'

describe('common > main > rx > helpers > extensions', function () {
	it('unsubscribeValue', function () {
		const subject = new TestSubject()

		const observable = subject.unsubscribeValue('unsubscribeValue')

		let results = []
		const testSubscriber = value => {
			results.push(value)
		}

		const unsubscribe = []

		unsubscribe[0] = observable.subscribe(testSubscriber)
		assert.deepStrictEqual(results, [])

		unsubscribe[0]()
		assert.deepStrictEqual(results, ['unsubscribeValue'])
		results = []

		subject.emit('1')
		assert.deepStrictEqual(results, [])

		unsubscribe[0]()
		unsubscribe[0]()
		assert.deepStrictEqual(results, [])

		subject.emit('2')
		assert.deepStrictEqual(results, [])

		unsubscribe[0] = observable.subscribe(testSubscriber)
		unsubscribe[1] = observable.subscribe(testSubscriber)
		unsubscribe[2] = observable.subscribe(testSubscriber)
		assert.deepStrictEqual(results, [])

		subject.emit('3')
		assert.deepStrictEqual(results, ['3', '3', '3'])
		results = []

		unsubscribe[0]()
		assert.deepStrictEqual(results, ['unsubscribeValue'])
		results = []

		unsubscribe[1]()
		assert.deepStrictEqual(results, ['unsubscribeValue'])
		results = []

		unsubscribe[2]()
		assert.deepStrictEqual(results, ['unsubscribeValue'])
		results = []

		unsubscribe[0]()
		unsubscribe[1]()
		unsubscribe[2]()
		assert.deepStrictEqual(results, [])
	})
})
