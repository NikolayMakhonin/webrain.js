import {isIterable} from './helpers'

export interface ThenableSyncIterator<TValue>
	extends Iterator<TValue|any|ThenableSync<any|TValue>|ThenableSyncIterator<TValue>>
{}

export type ThenableSyncOrValue<TValue> = TValue|ThenableSync<TValue>
export type ThenableSyncOrIteratorOrValue<TValue> = ThenableSyncOrValue<TValue>|ThenableSyncIterator<TValue>
export type TResolve<TValue = any>
	= (value?: ThenableSyncOrIteratorOrValue<TValue>) => ThenableSyncOrValue<TValue>
export type TExecutor<TValue = any> = (resolve: TResolve<TValue>) => void
export type TOnFulfilled<TValue = any, TResult = any>
	= (value: TValue) => ThenableSyncOrIteratorOrValue<TResult>

export enum ThenableSyncStatus {
	Resolving = 'Resolving',
	Resolved = 'Resolved',
}

export class ThenableSync<TValue = any> {
	private _onfulfilled: Array<TOnFulfilled<TValue, any>>
	private _value: TValue
	private _status: ThenableSyncStatus

	constructor(executor?: TExecutor<TValue>) {
		if (executor) {
			executor(this.resolve.bind(this))
		}
	}

	public resolve(value?: ThenableSyncOrIteratorOrValue<TValue>): ThenableSyncOrValue<TValue> {
		if (this._status != null) {
			throw new Error(`Multiple call resolve() is forbidden; status = ${this._status}`)
		}

		return this._resolve(value)
	}

	private _resolve(value?: ThenableSyncOrIteratorOrValue<TValue>): ThenableSyncOrValue<TValue> {
		const {_status} = this
		if (_status != null && _status !== ThenableSyncStatus.Resolving) {
			throw new Error(`Multiple call resolve() is forbidden; status = ${_status}`)
		}

		value = ThenableSync.resolve(value)

		if (ThenableSync.isThenableSync(value)) {
			this._status = ThenableSyncStatus.Resolving

			return (value as ThenableSync<TValue>)
				.thenLast(this._resolve.bind(this))
		}

		this._status = ThenableSyncStatus.Resolved

		this._value = value as TValue

		const {_onfulfilled} = this
		if (_onfulfilled) {
			this._onfulfilled = void 0
			for (let i = 0, len = _onfulfilled.length; i < len; i++) {
				_onfulfilled[i](value as TValue)
			}
		}

		return value
	}

	private _then<TResult = any>(
		onfulfilled: TOnFulfilled<TValue, TResult>,
		lastExpression: boolean,
	): ThenableSyncOrValue<TResult> {
		if (Object.prototype.hasOwnProperty.call(this, '_value')) {
			const {_value} = this
			if (!onfulfilled) {
				return _value as any
			}

			const result = ThenableSync.resolve(onfulfilled(_value as TValue))

			return lastExpression || ThenableSync.isThenableSync(result)
				? result
				: ThenableSync.createResolved(result as TResult)
		} else {
			if (!onfulfilled) {
				return this as any
			}

			let {_onfulfilled} = this
			if (!_onfulfilled) {
				this._onfulfilled = _onfulfilled = []
			}

			const result = new ThenableSync<TResult>()

			_onfulfilled.push(value => {
				result.resolve(onfulfilled(value))
			})

			return result
		}
	}

	public then<TResult = any>(
		onfulfilled?: TOnFulfilled<TValue, TResult>,
	): ThenableSync<TResult> {
		return this._then(onfulfilled, false) as ThenableSync<TResult>
	}

	public thenLast<TResult = any>(
		onfulfilled?: TOnFulfilled<TValue, TResult>,
	): ThenableSyncOrValue<TResult> {
		return this._then(onfulfilled, true)
	}

	public static createResolved<TValue = any>(value: TValue): ThenableSync<TValue> {
		const thenable = new ThenableSync<TValue>()
		thenable._status = ThenableSyncStatus.Resolved
		thenable._value = value
		return thenable
	}

	public static isThenableSync(value: any): boolean {
		return value instanceof ThenableSync
	}

	public static resolve<TValue = any, TResult = TValue>(
		value: ThenableSyncOrIteratorOrValue<TValue>,
		onfulfilled?: TOnFulfilled<TValue, TResult>,
	): ThenableSyncOrValue<TValue> {
		if (ThenableSync.isThenableSync(value)) {
			value = (value as ThenableSync<TValue>)
				.thenLast(onfulfilled) as any

			return value as any
		}

		if (value && isIterable(value)
			&& typeof (value as any).next === 'function'
		) {
			const iterator = value as ThenableSyncIterator<TValue>
			const resolveIterator = (
				iteration: IteratorResult<ThenableSyncOrIteratorOrValue<TValue>>,
			): ThenableSyncOrValue<TValue> => {
				if (iteration.done) {
					return iteration.value as TValue
				} else {
					return ThenableSync.resolve(iteration.value, o => {
						return resolveIterator(iterator.next(o))
					})
				}
			}

			value = resolveIterator((value as ThenableSyncIterator<TValue>).next())

			return this.resolve(value, onfulfilled)
		}

		if (onfulfilled) {
			value = onfulfilled(value as TValue) as any
			return this.resolve(value)
		}

		return value as any
	}
}
