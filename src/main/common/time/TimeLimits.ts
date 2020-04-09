import {isAsync, Thenable, ThenableOrIterator, ThenableOrIteratorOrValue} from '../async/async'
import {resolveAsyncAll, resolveAsyncAny} from '../async/ThenableSync'
import {ITimeLimit, ITimeLimitBase} from './TimeLimit'

function createSingleCallFunc<T>(func: () => T): () => T {
	if (!func) {
		return null
	}

	let result: T
	return () => {
		if (!func) {
			return result
		}
		result = func()
		func = null
		return result
	}
}

export interface ITimeLimits extends ITimeLimitBase {
	getLeafTimeLimits(result?: {
		[key: string]: ITimeLimitOrLimits,
	}): ITimeLimitOrLimits[]
}

export type ITimeLimitOrLimits = ITimeLimits | ITimeLimit

export class TimeLimits implements ITimeLimits {
	public timeLimits: ITimeLimitOrLimits[]
	constructor(...timeLimits: ITimeLimitOrLimits[]) {
		this.timeLimits = timeLimits
	}

	public getWaitTime(): number {
		const timeLimits = this.timeLimits
		const len = timeLimits.length

		let maxTime = 0
		for (let i = 0; i < len; i++) {
			const waitTime = timeLimits[i].getWaitTime()
			if (waitTime == null) {
				return null
			}
			if (waitTime > maxTime) {
				maxTime = waitTime
			}
		}

		return maxTime
	}

	public wait<TResult>(
		complete?: () => ThenableOrIteratorOrValue<TResult>,
	): ThenableOrIteratorOrValue<TResult> {
		const waitTime = this.getWaitTime()
		if (waitTime === 0) {
			return complete ? complete() : null
		}

		const timeLimits = this.getLeafTimeLimits()
		const len = timeLimits.length
		const waiters = new Array(len)

		for (let i = 0; i < len; i++) {
			waiters[i] = timeLimits[i].wait()
		}

		return resolveAsyncAll<any, TResult>(waiters, () => this.wait(complete))
	}

	public run<TResult>(func?: () => ThenableOrIteratorOrValue<TResult>): ThenableOrIteratorOrValue<TResult> {
		return this.wait(() => {
			const timeLimits = this.getLeafTimeLimits()
			const len = timeLimits.length

			if (len === 0) {
				return func && func()
			}

			const singleCallFunc = createSingleCallFunc(func)

			let results: Array<Thenable<TResult>> | TResult
			let resultsIsAsync = true

			for (let i = 0; i < len; i++) {
				const result = timeLimits[i].run(singleCallFunc)
				if (resultsIsAsync) {
					if (isAsync(result)) {
						if (!results) {
							results = []
						}
						results[i] = result
					} else {
						results = result as TResult
						resultsIsAsync = false
					}
				}
			}

			return resultsIsAsync
				? resolveAsyncAny(results as Array<ThenableOrIterator<TResult>>)
				: results as TResult
		})
	}

	public get debug() {
		return this.timeLimits.map(o => (o as any).debug)
	}

	public getLeafTimeLimits(result: {
		[key: string]: ITimeLimitOrLimits,
	} = {}): ITimeLimitOrLimits[] {
		const timeLimits = this.timeLimits

		const len = timeLimits.length
		for (let i = 0; i < len; i++) {
			const timeLimit = timeLimits[i]
			if ((timeLimit as ITimeLimits).getLeafTimeLimits) {
				(timeLimit as ITimeLimits).getLeafTimeLimits(result)
			} else {
				result[(timeLimit as ITimeLimit).id] = timeLimit
			}
		}

		return Object.values(result)
	}
}
