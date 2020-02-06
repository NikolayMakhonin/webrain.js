import {Thenable} from '../../async/async'
import {IUnsubscribe} from '../subjects/observable'
import {Func, FuncCallStatus, IFuncCallState, ILinkItem, ISubscriber, TCall} from './contracts'

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
		call: TCall<TArgs>,
	) {
		this._this = _this
		this.call = call
	}

	// endregion

	// region properties

	public readonly _this: TThis
	public readonly call: TCall<TArgs>

	public status: FuncCallStatus
	public hasValue: boolean
	public hasError: boolean

	public valueAsync: Thenable<TValue>
	public value: TValue
	public error: any

	// endregion

	// region Debug

	/** for detect recursive async loop */
	public parentCallState: IFuncCallState<any, any, any>

	// endregion

	// region subscribe / emit

	private _subscribersFirst: ILinkItem<ISubscriber<TThis, TArgs, TValue>>
	private _subscribersLast: ILinkItem<ISubscriber<TThis, TArgs, TValue>>

	public subscribe(subscriber: ISubscriber<TThis, TArgs, TValue>): IUnsubscribe {
		const {_subscribersLast} = this
		const subscriberLink: ILinkItem<ISubscriber<TThis, TArgs, TValue>> = {
			value: subscriber,
			prev: _subscribersLast,
			next: null,
		}

		if (_subscribersLast) {
			_subscribersLast.next = subscriberLink
		} else {
			this._subscribersFirst = subscriberLink
		}
		this._subscribersLast = subscriberLink

		this.call(this, subscriber)

		return () => {
			const {prev} = subscriberLink
			if (prev) {
				prev.next = subscriberLink.next
			} else {
				this._subscribersFirst = subscriberLink.next
			}
		}
	}

	private _emit() {
		for (let link = this._subscribersFirst; link; link = link.next) {
			link.value.apply(this, arguments)
		}
	}

	private emit() {
		if (this._subscribersFirst) {
			this.call(this, this._emit)
		}
	}

	// endregion

	// region subscribe dependencies

	private _dependencies: Set<IFuncCallState<any, any, any>>
	private _unsubscribers: IUnsubscribe[]

	public subscribeDependency(dependency: IFuncCallState<any, any, any>): void {
		let {_dependencies} = this
		if (_dependencies && _dependencies.has(dependency)) {
			return
		}

		let {_invalidate} = this
		if (!_invalidate) {
			this._invalidate = _invalidate = () => this.invalidate
		}
		const unsubscribe = dependency.subscribe(_invalidate)

		if (!_dependencies) {
			this._unsubscribers = [unsubscribe]
			this._dependencies = _dependencies = new Set()
			_dependencies.add(dependency)
		} else {
			this._unsubscribers.push(unsubscribe)
			_dependencies.add(dependency)
		}
	}

	public unsubscribeDependencies(): void {
		const {_unsubscribers} = this
		if (_unsubscribers) {
			for (let i = 0, len = _unsubscribers.length; i < len; i++) {
				_unsubscribers[i]()
			}
			this._dependencies.clear()
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
				this.parentCallState = void 0
				this.error = void 0
				this.value = valueAsyncOrValueOrError
				this.hasError = false
				this.hasValue = true
				break
			case FuncCallStatus.Error:
				if (typeof this.valueAsync !== 'undefined') {
					this.valueAsync = void 0
				}
				this.parentCallState = void 0
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
