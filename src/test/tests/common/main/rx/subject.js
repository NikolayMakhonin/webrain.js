import {
	Observable,
	SubjectBase,
	BehaviorSubject,
	Subject
} from '../../../../../main/common/rx/subject'

describe('common > main > rx > subject', function () {
	it('Observable.call', function () {
		const observable = new Observable()
		let arg
		const result = observable.call(o => {
			arg = o
			return 'result'
		})

		assert.strictEqual(arg, observable)
		assert.strictEqual(result, 'result')
	})

	it('SubjectBase', function () {
		const subject = new SubjectBase()
		assert.strictEqual(subject.emit('1'), subject)

		let results = []
		const subscriber = value => {
			results.push(value)
		}

		assert.strictEqual(subject.unsubscribe(subscriber), subject)

		const unsubscribe = subject.subscribe(subscriber)

		assert.strictEqual(typeof unsubscribe, 'function')
		assert.deepStrictEqual(results, [])

		assert.strictEqual(subject.emit('2'), subject)
		assert.deepStrictEqual(results, ['2'])
		results = []

		assert.strictEqual(subject.emit('3'), subject)
		assert.deepStrictEqual(results, ['3'])
		results = []

		assert.strictEqual(unsubscribe(), undefined)

		assert.strictEqual(subject.emit('4'), subject)
		assert.deepStrictEqual(results, [])

		assert.strictEqual(unsubscribe(), undefined)
		assert.strictEqual(unsubscribe(), undefined)

		assert.strictEqual(subject.emit('5'), subject)
		assert.deepStrictEqual(results, [])

		assert.strictEqual(typeof subject.subscribe(subscriber), 'function')
		assert.strictEqual(typeof subject.subscribe(subscriber), 'function')

		assert.strictEqual(subject.emit('6'), subject)
		assert.deepStrictEqual(results, ['6', '6'])
		results = []

		assert.strictEqual(subject.unsubscribe(subscriber), subject)

		assert.strictEqual(subject.emit('7'), subject)
		assert.deepStrictEqual(results, ['7'])
		results = []

		assert.strictEqual(subject.unsubscribe(subscriber), subject)

		assert.strictEqual(subject.emit('8'), subject)
		assert.deepStrictEqual(results, [])

		assert.strictEqual(subject.unsubscribe(subscriber), subject)
		assert.strictEqual(subject.unsubscribe(subscriber), subject)

		assert.strictEqual(subject.emit('9'), subject)
		assert.deepStrictEqual(results, [])
	})

	it('Subject', function () {
		const subject = new Subject()

		let hasObservers = []
		const hasObserversSubscriber = value => {
			hasObservers.push(value)
		}

		const hasObserversUnsubscribe = subject.hasObserversObservable.subscribe(hasObserversSubscriber)
		assert.strictEqual(typeof hasObserversUnsubscribe, 'function')
		assert.deepStrictEqual(hasObservers, [false])
		hasObservers = []

		assert.strictEqual(subject.hasObservers, false)
		assert.strictEqual(subject.emit('1'), subject)

		let results = []
		const subscriber = value => {
			results.push(value)
		}

		const unsubscribe = subject.subscribe(subscriber)
		assert.deepStrictEqual(hasObservers, [true])
		hasObservers = []

		assert.strictEqual(hasObserversUnsubscribe(), undefined)
		assert.deepStrictEqual(hasObservers, [])
		hasObservers = []

		assert.strictEqual(typeof unsubscribe, 'function')
		assert.deepStrictEqual(results, [])

		assert.strictEqual(subject.emit('2'), subject)
		assert.deepStrictEqual(results, ['2'])
		results = []

		assert.strictEqual(typeof subject.hasObserversObservable.subscribe(hasObserversSubscriber), 'function')
		assert.deepStrictEqual(hasObservers, [true])
		hasObservers = []

		assert.strictEqual(subject.emit('3'), subject)
		assert.deepStrictEqual(results, ['3'])
		results = []

		assert.deepStrictEqual(hasObservers, [])
		hasObservers = []

		assert.strictEqual(unsubscribe(), undefined)

		assert.deepStrictEqual(hasObservers, [false])
		hasObservers = []

		assert.strictEqual(subject.emit('4'), subject)
		assert.deepStrictEqual(results, [])

		assert.strictEqual(unsubscribe(), undefined)
		assert.strictEqual(unsubscribe(), undefined)

		assert.strictEqual(subject.emit('5'), subject)
		assert.deepStrictEqual(results, [])

		assert.deepStrictEqual(hasObservers, [])

		assert.strictEqual(typeof subject.subscribe(subscriber), 'function')

		assert.deepStrictEqual(hasObservers, [true])
		hasObservers = []

		assert.strictEqual(typeof subject.subscribe(subscriber), 'function')

		assert.deepStrictEqual(hasObservers, [])
		assert.strictEqual(subject.hasObserversObservable.unsubscribe(hasObserversSubscriber), subject.hasObserversObservable)
		assert.deepStrictEqual(hasObservers, [])
		hasObservers = []

		assert.strictEqual(subject.emit('6'), subject)
		assert.deepStrictEqual(results, ['6', '6'])
		results = []

		assert.strictEqual(subject.unsubscribe(subscriber), subject)

		assert.strictEqual(subject.emit('7'), subject)
		assert.deepStrictEqual(results, ['7'])
		results = []

		assert.strictEqual(subject.unsubscribe(subscriber), subject)

		assert.strictEqual(subject.emit('8'), subject)
		assert.deepStrictEqual(results, [])

		assert.strictEqual(subject.unsubscribe(subscriber), subject)
		assert.strictEqual(subject.unsubscribe(subscriber), subject)

		assert.strictEqual(subject.emit('9'), subject)
		assert.deepStrictEqual(results, [])
	})

	it('BehaviorSubject', function () {
		const subject = new BehaviorSubject('1')

		let hasObservers = []
		const hasObserversSubscriber = value => {
			hasObservers.push(value)
		}

		const hasObserversUnsubscribe = subject.hasObserversObservable.subscribe(hasObserversSubscriber)
		assert.strictEqual(typeof hasObserversUnsubscribe, 'function')
		assert.deepStrictEqual(hasObservers, [false])
		hasObservers = []

		assert.strictEqual(subject.hasObservers, false)

		let results = []
		const subscriber = value => {
			results.push(value)
		}

		const unsubscribe = subject.subscribe(subscriber)
		assert.deepStrictEqual(hasObservers, [true])
		hasObservers = []

		assert.strictEqual(hasObserversUnsubscribe(), undefined)
		assert.deepStrictEqual(hasObservers, [])
		hasObservers = []

		assert.strictEqual(typeof unsubscribe, 'function')
		assert.deepStrictEqual(results, ['1'])
		results = []

		assert.strictEqual(subject.emit('2'), subject)
		assert.deepStrictEqual(results, ['2'])
		results = []

		assert.strictEqual(typeof subject.hasObserversObservable.subscribe(hasObserversSubscriber), 'function')
		assert.deepStrictEqual(hasObservers, [true])
		hasObservers = []

		assert.strictEqual(subject.emit('3'), subject)
		assert.deepStrictEqual(results, ['3'])
		results = []

		assert.deepStrictEqual(hasObservers, [])
		hasObservers = []

		assert.strictEqual(unsubscribe(), undefined)

		assert.deepStrictEqual(hasObservers, [false])
		hasObservers = []

		assert.strictEqual(subject.emit('4'), subject)
		assert.deepStrictEqual(results, [])

		assert.strictEqual(unsubscribe(), undefined)
		assert.strictEqual(unsubscribe(), undefined)

		assert.strictEqual(subject.emit('5'), subject)
		assert.deepStrictEqual(results, [])

		assert.deepStrictEqual(hasObservers, [])

		assert.strictEqual(typeof subject.subscribe(subscriber), 'function')
		assert.deepStrictEqual(results, ['5'])
		results = []

		assert.deepStrictEqual(hasObservers, [true])
		hasObservers = []

		assert.strictEqual(typeof subject.subscribe(subscriber), 'function')
		assert.deepStrictEqual(results, ['5'])
		results = []

		assert.deepStrictEqual(hasObservers, [])
		assert.strictEqual(subject.hasObserversObservable.unsubscribe(hasObserversSubscriber), subject.hasObserversObservable)
		assert.deepStrictEqual(hasObservers, [])
		hasObservers = []

		assert.strictEqual(subject.emit('6'), subject)
		assert.deepStrictEqual(results, ['6', '6'])
		results = []

		assert.strictEqual(subject.unsubscribe(subscriber), subject)

		assert.strictEqual(subject.emit('7'), subject)
		assert.deepStrictEqual(results, ['7'])
		results = []

		assert.strictEqual(subject.unsubscribe(subscriber), subject)

		assert.strictEqual(subject.emit('8'), subject)
		assert.deepStrictEqual(results, [])

		assert.strictEqual(subject.unsubscribe(subscriber), subject)
		assert.strictEqual(subject.unsubscribe(subscriber), subject)

		assert.strictEqual(subject.emit('9'), subject)
		assert.deepStrictEqual(results, [])
	})
})
