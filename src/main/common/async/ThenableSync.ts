import {
	isThenable,
	ResolveResult,
	resolveValue,
	ThenableOrIteratorOrValue,
	ThenableOrValue,
	TOnFulfilled,
	TOnRejected,
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

export function createResolved<TValue = any>(value: ThenableOrIteratorOrValue<TValue>): ThenableSync<TValue> {
	const thenable = new ThenableSync<TValue>()
	thenable.resolve(value)
	return thenable
}

export function createRejected<TValue = any>(error: ThenableOrIteratorOrValue<any>): ThenableSync<TValue> {
	const thenable = new ThenableSync<TValue>()
	thenable.reject(error)
	return thenable
}

export class ThenableSync<TValue = any> {
	private _onfulfilled: Array<TOnFulfilled<TValue, any>>
	private _onrejected: Array<TOnRejected<TValue>>
	private _value: TValue
	private _error: any
	private _status: ThenableSyncStatus

	constructor(executor?: TExecutor<TValue>) {
		if (executor) {
			try {
				executor(this.resolve.bind(this), this.reject.bind(this))
			} catch (err) {
				this.reject(err)
			}
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

		switch (resolveValue(
			value,
			o => { value = o },
			o => { this._resolve(o) },
			o => { this._reject(o) },
		)) {
			case ResolveResult.Deferred:
				this._status = ThenableSyncStatus.Resolving
				return
			case ResolveResult.ImmediateRejected:
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

		switch (resolveValue(
			error,
			o => { error = o },
			o => { this._reject(o) },
			o => { this._reject(o) },
		)) {
			case ResolveResult.Deferred:
				this._status = ThenableSyncStatus.Resolving
				return
			case ResolveResult.ImmediateRejected:
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
		const reject = error => {
			if (!onrejected) {
				if (lastExpression) {
					throw error
				}
				return ThenableSync.createRejected(error)
			}

			let isError
			error = (() => {
				try {
					return onrejected(error)
				} catch (err) {
					isError = true
					return err
				}
			})()

			const result = resolveAsync(error, null, null, !lastExpression)

			if (isThenable(result)) {
				return isError
					? result.then(o => createRejected(o))
					: result
			}

			if (lastExpression) {
				if (!isError) {
					return result
				}
				throw result
			}

			return isError
				? createRejected(result)
				: createResolved(result)
		}

		switch (this._status) {
			case ThenableSyncStatus.Resolved: {
				let {_value} = this
				if (!onfulfilled) {
					return lastExpression
						? _value as any
						: this
				}

				let isError
				_value = (() => {
					try {
						return onfulfilled(_value)
					} catch (err) {
						isError = true
						return err
					}
				})()

				if (isError) {
					const result = resolveAsync(_value as any, null, null, !lastExpression)
					if (isThenable(result)) {
						return result.then(o => reject(o), onrejected)
					}
					return reject(result)
				} else {
					const result = resolveAsync(_value as any, null, onrejected, !lastExpression)
					return lastExpression || isThenable(result)
						? result
						: createResolved(result as TResult1)
				}
			}
			case ThenableSyncStatus.Rejected:
				if (!onrejected && !lastExpression) {
					return this as any
				}
				return reject(this._error)
			default: {
				if (!onfulfilled && !onrejected) {
					return this as any
				}

				const result = new ThenableSync<TResult1>()

				let {_onrejected} = this
				if (!_onrejected) {
					this._onrejected = _onrejected = []
				}

				const rejected = onrejected
					? (value): any => {
						let isError
						value = (() => {
							try {
								return onrejected(value)
							} catch (err) {
								isError = true
								return err
							}
						})()
						if (isError) {
							result.reject(value)
						} else {
							result.resolve(value as any)
						}
					}
					: (value): any => { result.reject(value) }

				_onrejected.push(rejected)

				let {_onfulfilled} = this
				if (!_onfulfilled) {
					this._onfulfilled = _onfulfilled = []
				}

				_onfulfilled.push(onfulfilled
					? (value: any): any => {
						let isError
						value = (() => {
							try {
								return onfulfilled(value)
							} catch (err) {
								isError = true
								return err
							}
						})()
						if (isError) {
							resolveValue(value, rejected, rejected, rejected)
						} else {
							result.resolve(value as any)
						}
					}
					: (value): any => { result.resolve(value as any) })

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

	// region static helpers

	public static createResolved = createResolved

	public static createRejected = createRejected

	public static isThenable = isThenable

	public static resolve = resolveAsync
	
	// endregion
}

export function resolveAsync<TValue = any, TResult1 = TValue, TResult2 = never>(
	input: ThenableOrIteratorOrValue<TValue>,
	onfulfilled?: TOnFulfilled<TValue, TResult1>,
	onrejected?: TOnRejected<TResult2>,
	dontThrowOnImmediateReject?: boolean,
): ThenableOrValue<TResult1> {
	let error
	let resolve: TResolve<TResult1>
	let reject: TReject = err => { error = err }

	let result: ThenableOrValue<TResult1>

	const onreject = o => {
		if (onrejected) {
			if (resolve) {
				resolveValue(onrejected(o), resolve as any, resolve as any, reject)
			} else {
				resolveValue(onrejected(o), val => { result = val as any }, resolve as any, reject)
			}
		} else {
			reject(o as any)
		}
	}

	switch (resolveValue(
		input,
		o => {
			if (onfulfilled) {
				if (resolveValue<TResult1>(
					onfulfilled(o),
					val => { result = val },
					resolve,
					onreject,
				) === ResolveResult.Deferred) {
					result = new ThenableSync((r, e) => {
						resolve = r
						reject = e
					})
				}
			} else {
				result = o as any
			}
		},
		o => {
			if (onfulfilled) {
				resolveValue(onfulfilled(o), resolve, resolve, onreject)
			} else {
				resolve(o as any)
			}
		},
		onreject,
	)) {
		case ResolveResult.Deferred:
			return new ThenableSync((r, e) => {
				resolve = r
				reject = e
			})
		case ResolveResult.ImmediateRejected:
			if (dontThrowOnImmediateReject) {
				return createRejected(error)
			}
			throw error
	}

	return result
}
