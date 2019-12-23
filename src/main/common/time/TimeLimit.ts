import {ThenableOrIterator, ThenableOrIteratorOrValue} from '../async/async'
import {resolveAsyncAny, ThenableSync} from '../async/ThenableSync'
import {delay, performanceNow} from './helpers'

let nextId = 0

export interface ITimeLimitBase {
	getWaitTime(): number

	wait<TResult>(complete?: () => ThenableOrIteratorOrValue<TResult>): ThenableOrIteratorOrValue<TResult>

	run<TResult>(func?: () => ThenableOrIteratorOrValue<TResult>): ThenableOrIteratorOrValue<TResult>
}

export interface ITimeLimit extends ITimeLimitBase {
	id: number
}

export class TimeLimit implements ITimeLimit {
	public count: number
	public time: number
	public readonly id: number
	
	private _history: number[] = []
	private _queue: Array<() => void> = []
	private _countActive: number = 0
	private _startTime: number

	constructor(count: number, time: number) {
		this.count = count
		this.time = time
		this.id = nextId++
	}

	public getWaitTime(): number {
		const now = performanceNow()
		const time = this.time

		while (this._history.length) {
			if (now - this._history[0] <= time) {
				break
			}
			this._history.shift()
		}

		if (this._history.length + this._countActive < this.count) {
			return 0
		}

		return this._history.length
			? now - this._history[0]
			: null
	}

	public wait<TResult>(
		complete?: () => ThenableOrIteratorOrValue<TResult>,
	): ThenableOrIteratorOrValue<TResult> {
		if (this._startTime == null) {
			this._startTime = performanceNow()
		}

		const waitTime = this.getWaitTime()
		if (waitTime === 0) {
			const result = complete ? complete() : null
			this.runQueue()
			return result
		}

		const waiters: Array<ThenableOrIterator<any>> = []
		let queueAction: () => void

		if (this._countActive) {
			waiters.push(new ThenableSync(resolve => (queueAction = resolve)))
			this._queue.push(queueAction)
		}

		if (waitTime) {
			waiters.push(delay(waitTime))
			// console.log(`WAIT: ${waitTime}ms; ${new Date(new Date().getTime() + waitTime)}`)
		}
		// else {
		// 	await delay(0)
		// }

		return resolveAsyncAny(waiters)
			.then(() => {
				const queueIndex = this._queue.indexOf(queueAction)
				if (queueIndex >= 0) {
					this._queue.splice(queueIndex, 1)
				}
				// if (waiters) {
				// 	new Date().getTime()
				// }

				return this.wait(complete)
			})
	}

	public runQueue() {
		let len = this.count - this._countActive
		if (len > 0) {
			const resolve = this._queue.splice(0, len)
			len = resolve.length
			for (let i = 0; i < len; i++) {
				resolve[i]()
			}
		}

		// console.log(countActive + '\t' + len + '\t' + queue.length)
	}

	public run<TResult>(
		func?: () => ThenableOrIteratorOrValue<TResult>,
	): ThenableOrIteratorOrValue<TResult> {
		return this.wait(() => {
			// console.log(countActive)

			this._countActive++

			let result
			try {
				result = func && func()
			} finally {
				const final = () => {
					this._history.push(performanceNow())
					this._countActive--

					this.runQueue()

					return
				}

				if (result instanceof Promise) {
					result = result
						.catch(err => {
							final()
							throw err
						})
						.then(o => {
							final()
							return o
						})
				} else {
					final()
				}
			}

			return result
		})
	}

	public get debug() {
		if (this._startTime == null) {
			this._startTime = performanceNow()
		}

		return {
			now: performanceNow() - this._startTime,
			count: this.count,
			time: this.time,
			history: this._history.map(o => o - this._startTime),
			queue: this._queue.length,
			countActive: this._countActive,
		}
	}
}
