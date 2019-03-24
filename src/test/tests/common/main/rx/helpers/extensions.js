import '../../../../../../main/common/rx/extensions/observable'
import {Observable} from '../../../../../../main/common/rx/subject'

describe('common > main > rx > helpers > extensions', function () {
	function deleteFromArray(array, item) {
		const index = array.indexOf(item)
		if (index > -1) {
			array.splice(index, 1)
		}
	}

	it('unsubscribeValue', function () {
		const subscribers = []
		const subject = new Observable({
			subscribe(subscriber) {
				subscribers.push(subscriber)
				return () => {
					deleteFromArray(subscribers, subscriber)
				}
			}
		})

		function emit(value) {
			for (const subscriber of subscribers) {
				subscriber(value)
			}
		}

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

		emit('1')
		assert.deepStrictEqual(results, [])

		unsubscribe[0]()
		unsubscribe[0]()
		assert.deepStrictEqual(results, [])

		emit('2')
		assert.deepStrictEqual(results, [])

		unsubscribe[0] = observable.subscribe(testSubscriber)
		unsubscribe[1] = observable.subscribe(testSubscriber)
		unsubscribe[2] = observable.subscribe(testSubscriber)
		assert.deepStrictEqual(results, [])

		emit('3')
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
