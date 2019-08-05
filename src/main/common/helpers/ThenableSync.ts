export type TResolve<TValue> = (value?: TValue | ThenableSync<TValue>) => void
export type TOnFulfilled<TValue, TResult> = (value: TValue) => TResult|ThenableSync<TResult>

export class ThenableSync<TValue> {
	private _onfulfilled: Array<TOnFulfilled<TValue, any>>
	private _value: TValue | ThenableSync<TValue>
	public resolve: TResolve<TValue>

	constructor(executor?: (resolve: TResolve<TValue>) => TValue|ThenableSync<TValue>) {
		const resolve = value => {
			delete this.resolve

			if (value instanceof ThenableSync) {
				return (value as ThenableSync<TValue>).then(resolve)
			}

			this._value = value

			const {_onfulfilled} = this
			if (_onfulfilled) {
				delete this._onfulfilled
				for (let i = 0, len = _onfulfilled.length; i < len; i++) {
					_onfulfilled[i](value)
				}
			}
		}

		this.resolve = resolve

		executor(resolve)
	}

	public then<TResult>(
		onfulfilled: TOnFulfilled<TValue, TResult>,
	): TResult|ThenableSync<TResult> {
		if (onfulfilled) {
			if (Object.prototype.hasOwnProperty.call(this, '_value')) {
				const {_value} = this
				if (_value instanceof ThenableSync) {
					return (_value as ThenableSync<TValue>).then(onfulfilled)
				} else {
					return onfulfilled(_value)
				}
			} else {
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
	}

	public static isThenableSync(value: any): boolean {
		return value instanceof ThenableSync
	}

	public static resolveIterator<TValue, TResult = TValue>(
		value: TValue|ThenableSync<TValue>|Iterator<TValue|ThenableSync<any>>,
		onfulfilled?: TOnFulfilled<TValue, TResult>,
	): TResult|ThenableSync<TResult> {
		if (!ThenableSync.isThenableSync(value) && Symbol.iterator in value) {
			const resolveIterator = (
				iteration: IteratorResult<TValue|ThenableSync<TValue>|Iterator<TValue|ThenableSync<any>>>,
			): TValue|ThenableSync<TValue> => {
				if (iteration.done) {
					return iteration.value as TValue
				} else {
					return ThenableSync.resolve(iteration.value as TValue|ThenableSync<TValue>, o => {
						return resolveIterator((value as Iterator<TValue | ThenableSync<any>>).next(o))
					})
				}
			}

			value = resolveIterator((value as Iterator<TValue | ThenableSync<any>>).next())
		}

		return ThenableSync.resolve(value as any, onfulfilled)
	}

	public static resolve<TValue, TResult = TValue>(
		value: TValue|ThenableSync<TValue>,
		onfulfilled?: TOnFulfilled<TValue, TResult>,
	): TResult|ThenableSync<TResult> {
		if (onfulfilled) {
			if (ThenableSync.isThenableSync(value)) {
				value = (value as ThenableSync<TValue>)
					.then(onfulfilled) as any
			} else {
				value = onfulfilled(value as TValue) as any
			}
		}

		return value as any
	}
}
