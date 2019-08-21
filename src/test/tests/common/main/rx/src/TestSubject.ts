import {Observable} from '../../../../../../main/common/rx/subjects/observable'

function deleteFromArray(array, item) {
	const index = array.indexOf(item)
	if (index > -1) {
		array.splice(index, 1)
	}
}

export class TestSubject<T> extends Observable<T> {
	private _testSubscribers = []

	get hasSubscribers() {
		return !!this._testSubscribers.length
	}

	// eslint-disable-next-line no-shadow
	public subscribe(subscriber) {
		this._testSubscribers.push(subscriber)
		return () => {
			deleteFromArray(this._testSubscribers, subscriber)
		}
	}

	public emit(value) {
		// eslint-disable-next-line no-shadow
		for (const subscriber of this._testSubscribers) {
			subscriber(value)
		}

		return this
	}
}
