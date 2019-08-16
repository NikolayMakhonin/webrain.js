import {
	isThenable,
	resolveValue,
	ThenableOrIteratorOrValue,
	ThenableOrValue,
	TOnFulfilled, TOnRejected,
	TReject,
	TResolve,
} from './async'

export type TExecutor<TValue = any> = (
	resolve: TResolve<TValue>,
	reject: TReject,
) => void

export enum ThenableSyncStatus {
	Resolving = 'Resolving',
	Resolved = 'Resolved',
	Rejected = 'Rejected',
}

export class ThenableSync<TValue = any> {
	private _onfulfilled: Array<TOnFulfilled<TValue, any>>
	private _onrejected: Array<TOnRejected<TValue>>
	private _value: TValue
	private _error: any
	private _status: ThenableSyncStatus

	constructor(executor?: TExecutor<TValue>) {
		if (executor) {
			executor(this.resolve.bind(this), this.reject.bind(this))
		}
	}

	// region resolve

	public resolve(value?: ThenableOrIteratorOrValue<TValue>): void {
		if (this._status != null) {
			throw new Error(`Multiple call resolve/reject() is forbidden; status = ${this._status}`)
		}

		this._resolve(value)
	}

	private _resolve(value?: ThenableOrIteratorOrValue<TValue>): void {
		const {_status} = this
		if (_status != null && _status !== ThenableSyncStatus.Resolving) {
			throw new Error(`Multiple call resolve/reject() is forbidden; status = ${_status}`)
		}

		value = ThenableSync.resolve(value)

		if (isThenable(value)) {
			this._status = ThenableSyncStatus.Resolving;

			(value as ThenableSync<TValue>)
				.thenLast(this._resolve.bind(this))

			return
		}

		this._status = ThenableSyncStatus.Resolved

		this._value = value as TValue

		const {_onfulfilled} = this
		if (_onfulfilled) {
			this._onfulfilled = void 0
			this._onrejected = void 0
			for (let i = 0, len = _onfulfilled.length; i < len; i++) {
				_onfulfilled[i](value as TValue)
			}
		}
	}

	// endregion

	// region reject

	public reject(error?: ThenableOrIteratorOrValue<any>): void {
		if (this._status != null) {
			throw new Error(`Multiple call resolve/reject() is forbidden; status = ${this._status}`)
		}

		this._reject(error)
	}

	private _reject(error?: ThenableOrIteratorOrValue<any>): void {
		const {_status} = this
		if (_status != null && _status !== ThenableSyncStatus.Resolving) {
			throw new Error(`Multiple call resolve/reject() is forbidden; status = ${_status}`)
		}

		error = ThenableSync.resolve(error)

		if (isThenable(error)) {
			this._status = ThenableSyncStatus.Resolving;

			(error as ThenableSync<any>)
				.thenLast(this._reject.bind(this))

			return
		}

		this._status = ThenableSyncStatus.Rejected

		this._error = error as any

		const {_onrejected} = this
		if (_onrejected) {
			this._onfulfilled = void 0
			this._onrejected = void 0
			for (let i = 0, len = _onrejected.length; i < len; i++) {
				_onrejected[i](error as any)
			}
		}
	}

	// endregion

	// region then

	private _then<TResult1 = TValue, TResult2 = never>(
		onfulfilled: TOnFulfilled<TValue, TResult1>,
		onrejected: TOnRejected<TResult2>,
		lastExpression: boolean,
	): ThenableOrValue<TResult1> {
		switch (this._status) {
			case ThenableSyncStatus.Resolved: {
				const {_value} = this
				if (!onfulfilled) {
					return lastExpression
						? _value as any
						: this
				}

				const result = ThenableSync.resolve(onfulfilled(_value))

				return lastExpression || isThenable(result)
					? result
					: ThenableSync.createResolved(result as TResult1)
			}
			case ThenableSyncStatus.Rejected: {
				const {_error} = this
				if (!onrejected) {
					if (lastExpression) {
						throw _error
					}
					return this as any
				}

				const result = ThenableSync.resolve(onrejected(_error))

				if (lastExpression || isThenable(result)) {
					throw result
				}

				return ThenableSync.createRejected(result)
			}
			default: {
				if (!onfulfilled && !onrejected) {
					return this as any
				}

				const result = new ThenableSync<TResult1>()

				let {_onfulfilled} = this
				if (!_onfulfilled) {
					this._onfulfilled = _onfulfilled = []
				}

				_onfulfilled.push(onfulfilled
					? (value): any => { result.resolve(onfulfilled(value)) }
					: (value): any => { result.resolve(value as any) })

				let {_onrejected} = this
				if (!_onrejected) {
					this._onrejected = _onrejected = []
				}

				_onrejected.push(onrejected
					? (value): any => { result.reject(onrejected(value)) }
					: (value): any => { result.reject(value) })

				return result
			}
		}
	}

	public then<TResult1 = TValue, TResult2 = never>(
		onfulfilled?: TOnFulfilled<TValue, TResult1>,
		onrejected?: TOnRejected<TResult2>,
	): ThenableSync<TResult1> {
		return this._then(onfulfilled, onrejected, false) as ThenableSync<TResult1>
	}

	public thenLast<TResult1 = TValue, TResult2 = never>(
		onfulfilled?: TOnFulfilled<TValue, TResult1>,
		onrejected?: TOnRejected<TResult2>,
	): ThenableOrValue<TResult1> {
		return this._then(onfulfilled, onrejected, true)
	}

	// endregion

	// region helpers

	public static createResolved<TValue = any>(value: TValue): ThenableSync<TValue> {
		const thenable = new ThenableSync<TValue>()
		thenable._status = ThenableSyncStatus.Resolved
		thenable._value = value
		return thenable
	}

	public static createRejected<TValue = any>(error: any): ThenableSync<TValue> {
		const thenable = new ThenableSync<TValue>()
		thenable._status = ThenableSyncStatus.Rejected
		thenable._error = error
		return thenable
	}

	public static isThenable: (value: any) => boolean = isThenable

	public static resolve<TValue = any, TResult1 = TValue, TResult2 = never>(
		value: ThenableOrIteratorOrValue<TValue>,
		onfulfilled?: TOnFulfilled<TValue, TResult1>,
		onrejected?: TOnRejected<TResult2>,
	): ThenableOrValue<TResult1> {
		return resolveAsync(value, onfulfilled, onrejected)
		// if (ThenableSync.isThenableSync(value)) {
		// 	value = (value as ThenableSync<TValue>)
		// 		.thenLast(onfulfilled) as any
		//
		// 	return value as any
		// }
		//
		// if (isIterator(value)) {
		// 	const iterator = value as ThenableSyncIterator<TValue>
		// 	const resolveIterator = (
		// 		iteration: IteratorResult<ThenableSyncOrIteratorOrValue<TValue>>,
		// 	): ThenableSyncOrValue<TValue> => {
		// 		if (iteration.done) {
		// 			return iteration.value as TValue
		// 		} else {
		// 			return ThenableSync.resolve(iteration.value, o => {
		// 				return resolveIterator(iterator.next(o))
		// 			})
		// 		}
		// 	}
		//
		// 	value = resolveIterator((value as ThenableSyncIterator<TValue>).next())
		//
		// 	return this.resolve(value, onfulfilled)
		// }
		//
		// if (onfulfilled) {
		// 	value = onfulfilled(value as TValue) as any
		// 	return this.resolve(value)
		// }
		//
		// return value as any
	}
	
	// endregion
}

export function resolveAsync<TValue = any, TResult1 = TValue, TResult2 = never>(
	input: ThenableOrIteratorOrValue<TValue>,
	onfulfilled?: TOnFulfilled<TValue, TResult1>,
	onrejected?: TOnRejected<TResult2>,
): ThenableOrValue<TResult1> {
	let resolve: TResolve<TResult1>
	let reject: TReject = err => {
		throw err
	}

	let result: ThenableOrValue<TResult1>

	if (resolveValue(
		input,
		o => { result = onfulfilled ? resolveAsync(onfulfilled(o)) : o as any },
		o => { resolve(onfulfilled ? resolveAsync(onfulfilled(o)) : o as any) },
		o => { reject(resolveAsync(onrejected ? onrejected(o) : o)) },
	)) {
		result = new ThenableSync((r, e) => {
			resolve = r
			reject = e
		})
	}

	return result
}
