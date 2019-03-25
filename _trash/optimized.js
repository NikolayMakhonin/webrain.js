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

export function optimized(base) {
	return class OptimizedSubject extends base {
		emitImmediate(value) {
			return super.emit(value)
		}

		emit(value) {
			const {getKeyFunc} = this
			const key = getKeyFunc ? getKeyFunc(value) : value
			if (key == null) {
				return
			}

			let item
			let {queuedKeys} = this
			if (!queuedKeys) {
				this.queuedKeys = queuedKeys = {[key]: item = {value}}
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
