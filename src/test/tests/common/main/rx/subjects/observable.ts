import {ISubscriber, IUnsubscribe, Observable} from '../../../../../../main/common/rx/subjects/observable'

declare const assert: any

describe('common > main > rx > subjects > observable', function() {
	it('Observable', function() {
		class CustomObservable<T = any> extends Observable<T> {
			public subscribe(subscriber: ISubscriber<T>): IUnsubscribe {
				throw new Error('Not implemented')
			}
		}

		const observable = new CustomObservable()
		let arg
		const result = observable.call(o => {
			arg = o
			return 'result'
		})

		assert.strictEqual(arg, observable)
		assert.strictEqual(result, 'result')
	})
})
