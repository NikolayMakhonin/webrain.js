import {Observable} from '../src/main/common/rx/subject'

const MAX_EXECUTION_TIME = 100 // ms

let queue

function processQueue() {
	const startTime = Date.now()
	while (queue.length) {
		const item = queue.shift()

		item.instance.emitImmediate(item.item.value)

		if (queue.length && (Date.now() - startTime > MAX_EXECUTION_TIME)) {
			setTimeout(processQueue, 0)
		}
	}
}

function enqueue(item) {
	if (!queue) {
		queue = [item]
	} else {
		queue[queue.length] = item
	}

	if (queue.length !== 1) {
		// it means that queue is already in process
		return
	}

	processQueue()
}

export class OptimizedObservable extends Observable {
	constructor(baseObservable, getKeyFunc) {
		super()

		if (!getKeyFunc) {
			getKeyFunc = o => o
		}

		this.emitImmediate = emitImmediate
		function emitImmediate(value) {
			baseObservable.emit(value)
		}

		let queuedKeys

		this.emit = emit
		function emit(value) {
			const key = getKeyFunc(value)
			if (key == null) {
				return
			}

			let item
			if (!queuedKeys) {
				queuedKeys = {[key]: item = {value}}
			} else if (queuedKeys[key]) {
				queuedKeys[key].value = value
				return
			} else {
				queuedKeys[key] = item = {value}
			}

			enqueue({
				instance: this,
				key,
				item
			})
		}
	}
}
