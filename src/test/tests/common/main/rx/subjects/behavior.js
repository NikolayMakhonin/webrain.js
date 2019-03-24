/* eslint-disable class-methods-use-this */
import {TestSubject} from '../src/TestSubject'
import {behavior} from '../../../../../../main/common/rx/subjects/behavior'

describe('common > main > rx > behavior', function () {
	it('behavior', function () {
		const subject = new (behavior(TestSubject))({value: '1'})

		let results = []
		const subscriber = value => {
			results.push(value)
		}

		const unsubscribe = [subject.subscribe(subscriber)]

		assert.strictEqual(typeof unsubscribe[0], 'function')
		assert.deepStrictEqual(results, ['1'])
		results = []

		assert.strictEqual(subject.emit('2'), subject)
		assert.deepStrictEqual(results, ['2'])
		results = []

		assert.strictEqual(subject.emit('3'), subject)
		assert.deepStrictEqual(results, ['3'])
		results = []

		assert.strictEqual(unsubscribe[0](), undefined)

		assert.strictEqual(subject.emit('4'), subject)
		assert.deepStrictEqual(results, [])

		assert.strictEqual(unsubscribe[0](), undefined)
		assert.strictEqual(unsubscribe[0](), undefined)

		assert.strictEqual(subject.emit('5'), subject)
		assert.deepStrictEqual(results, [])

		assert.strictEqual(typeof (unsubscribe[0] = subject.subscribe(subscriber)), 'function')
		assert.strictEqual(typeof (unsubscribe[1] = subject.subscribe(subscriber)), 'function')

		assert.strictEqual(subject.emit('6'), subject)
		assert.deepStrictEqual(results, ['5', '5', '6', '6'])
		results = []

		assert.strictEqual(unsubscribe[0](), undefined)

		assert.strictEqual(subject.emit('7'), subject)
		assert.deepStrictEqual(results, ['7'])
		results = []

		assert.strictEqual(unsubscribe[1](), undefined)

		assert.strictEqual(subject.emit('8'), subject)
		assert.deepStrictEqual(results, [])

		assert.strictEqual(unsubscribe[0](), undefined)
		assert.strictEqual(unsubscribe[1](), undefined)

		assert.strictEqual(subject.emit('9'), subject)
		assert.deepStrictEqual(results, [])
	})
})
