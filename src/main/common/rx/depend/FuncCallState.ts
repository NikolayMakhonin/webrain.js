import {Thenable} from '../../async/async'
import {IUnsubscribe} from '../subjects/observable'
import {Func, FuncCallStatus, IFuncCallState, ISubscriber, TCall} from './contracts'

export function createCall<
	TThis,
	TArgs extends any[],
	TValue,
>(this: TThis, ...args: TArgs): TCall<TArgs>
export function createCall<
	TThis,
	TArgs extends any[],
	TValue,
>(this: TThis): TCall<TArgs>
{
	const args = arguments
	return (_this, func) => func.apply(_this, args)
}

export class FuncCallState<
	TThis,
	TArgs extends any[],
	TValue,
> implements IFuncCallState<TThis, TArgs, TValue>
{
	// region constructor

	constructor(
		_this: TThis,
		func: Func<TThis, TArgs, TValue>,
		call: TCall<TArgs>,
	) {
		this._this = _this
		this.func = func
		this.call = call
	}

	// endregion

	// region properties

	public readonly _this: TThis
	public readonly func: Func<TThis, TArgs, TValue>
	public readonly call: TCall<TArgs>

	public status: FuncCallStatus
	public hasValue: boolean
	public hasError: boolean

	public valueAsync: Thenable<TValue>
	public value: TValue
	public error: any

	public parentStateAsync: IFuncCallState<any, any, any>

	// endregion

	// region subscribe / emit

	private _subscribers: Set<ISubscriber<TThis, TArgs, TValue>>

	public subscribe(handler: ISubscriber<TThis, TArgs, TValue>): IUnsubscribe {
		let {_subscribers} = this
		if (!_subscribers) {
			this._subscribers = _subscribers = new Set()
		}

		_subscribers.add(handler)
		this.call(this, handler)
		return () => {
			_subscribers.delete(handler)
		}
	}

	private emit() {
		if (this._subscribers) {
			const iterator = this._subscribers[Symbol.iterator]()
			let iteration = iterator.next()
			if (!iteration.done) {
				this.call(this, function() {
					while (!iteration.done) {
						iteration.value.apply(this, arguments)
						iteration = iterator.next()
					}
				})
			}
		}
	}

	// endregion

	// region subscribe dependencies

	private _unsubscribers: IUnsubscribe[]

	public subscribeDependency(dependency: IFuncCallState<any, any, any>): void {
		const {_invalidate} = this
		if (!_invalidate) {
			this._invalidate = () => this.invalidate
		}
		const unsubscribe = dependency.subscribe(_invalidate)

		let {_unsubscribers} = this
		if (!_unsubscribers) {
			this._unsubscribers = _unsubscribers = [unsubscribe]
		} else {
			_unsubscribers.push(unsubscribe)
		}
	}

	public unsubscribeDependencies(): void {
		const {_unsubscribers} = this
		if (_unsubscribers) {
			for (let i = 0, len = _unsubscribers.length; i < len; i++) {
				_unsubscribers[i]()
			}
			_unsubscribers.length = 0
		}
	}

	// endregion

	// region invalidate / update

	private _invalidate: () => void
	public invalidate(): void {
		switch (this.status) {
			case FuncCallStatus.Invalidating:
			case FuncCallStatus.Calculating:
			case FuncCallStatus.CalculatingAsync:
				throw new Error(`invalidate() called when status is ${this.status}`)
		}

		this.update(FuncCallStatus.Invalidating)
		this.update(FuncCallStatus.Invalidated)
	}

	public update(status: FuncCallStatus, valueAsyncOrValueOrError?: Iterator<TValue> | any | TValue): void {
		this.status = status
		switch (status) {
			case FuncCallStatus.Invalidating:
				this.unsubscribeDependencies()
				break
			case FuncCallStatus.Invalidated:
			case FuncCallStatus.Calculating:
				break
			case FuncCallStatus.CalculatingAsync:
				this.valueAsync = valueAsyncOrValueOrError
				break
			case FuncCallStatus.Calculated:
				if (typeof this.valueAsync !== 'undefined') {
					this.valueAsync = void 0
				}
				this.error = void 0
				this.value = valueAsyncOrValueOrError
				this.hasError = false
				this.hasValue = true
				break
			case FuncCallStatus.Error:
				if (typeof this.valueAsync !== 'undefined') {
					this.valueAsync = void 0
				}
				this.error = valueAsyncOrValueOrError
				this.hasError = true
				break
			default:
				throw new Error('Unknown FuncCallStatus: ' + status)
		}

		this.emit()
	}

	// endregion
}

// new FuncCallState(
// 	this,
// 	func,
// 	createCall.apply(_this, arguments),
// )
