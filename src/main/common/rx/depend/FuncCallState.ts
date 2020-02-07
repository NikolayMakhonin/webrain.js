import {Thenable} from '../../async/async'
import {IUnsubscribe} from '../subjects/observable'
import {FuncCallStatus, IFuncCallState, ILinkItem, ISubscriber, TCall} from './contracts'
import {ObjectPool} from './ObjectPool'

interface ISubscriberLink<TThis, TArgs extends any[], TValue>
	extends ILinkItem<ISubscriber<TThis, TArgs, TValue>>
{
	state: FuncCallState<TThis, TArgs, TValue>
}

class SubscriberLinkPool extends ObjectPool<ISubscriberLink<any, any, any>> {
	public getOrCreate<TThis, TArgs extends any[], TValue>(
		state: FuncCallState<TThis, TArgs, TValue>,
		subscriber: ISubscriber<TThis, TArgs, TValue>,
		prev: ISubscriberLink<TThis, TArgs, TValue>,
		next: ISubscriberLink<TThis, TArgs, TValue>,
	): ISubscriberLink<TThis, TArgs, TValue> {
		let item = this.get()
		if (!item) {
			item = {
				state,
				value: subscriber,
				prev,
				next,
				delete: null,
			}
		} else {
			item.state = state
			item.value = subscriber
			item.prev = prev
			item.next = next
		}

		if (state && !item.delete) {
			item.delete = this.createDeleteFunc(item)
		}

		return item
	}

	private createDeleteFunc<TThis, TArgs extends any[], TValue>(
		item: ISubscriberLink<TThis, TArgs, TValue>,
	) {
		return () => {
			// tslint:disable-next-line:no-shadowed-variable
			const {prev, next, state} = item
			if (!state) {
				return
			}
			if (prev) {
				if (next) {
					prev.next = next
					next.prev = prev
				} else {
					(state as any)._subscribersLast = prev
					prev.next = null
				}
			} else {
				if (next) {
					(state as any)._subscribersFirst = next
					next.prev = null
				} else {
					(state as any)._subscribersFirst = null;
					(state as any)._subscribersLast = null
				}
			}
			item.state = null
			item.value = null
			item.prev = null
			item.next = null
			this.release(item)
		}
	}
}

export const subscriberLinkPool = new SubscriberLinkPool(1000000)

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

let nextCallId = 1

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

	private _subscribersFirst: ISubscriberLink<TThis, TArgs, TValue>
	private _subscribersLast: ISubscriberLink<TThis, TArgs, TValue>

	public subscribe(subscriber: ISubscriber<TThis, TArgs, TValue>, immediate: boolean = true): IUnsubscribe {
		const {_subscribersLast} = this
		const subscriberLink = subscriberLinkPool.getOrCreate(this, subscriber, _subscribersLast, null)

		if (_subscribersLast) {
			_subscribersLast.next = subscriberLink
		} else {
			this._subscribersFirst = subscriberLink
		}
		this._subscribersLast = subscriberLink

		if (immediate) {
			this.call(this, subscriber)
		}

		return subscriberLink.delete
	}

	private _emit() {
		let clonesFirst
		let clonesLast
		for (let link = this._subscribersFirst; link; link = link.next) {
			const cloneLink = subscriberLinkPool.getOrCreate(
				null,
				link.value,
				null,
				link.next,
			)
			if (clonesLast) {
				clonesLast.next = cloneLink
			} else {
				clonesFirst = cloneLink
			}
			clonesLast = cloneLink
		}

		for (let link = clonesFirst; link;) {
			link.value.apply(this, arguments)
			link.value = null
			const next = link.next
			link.next = null
			subscriberLinkPool.release(link)
			link = next
		}
	}

	private emit() {
		if (this._subscribersFirst) {
			this.call(this, this._emit)
		}
	}

	// endregion

	// region subscribe dependencies

	// for prevent multiple subscribe equal dependencies
	public callId: number
	public incrementCallId(): void {
		this.callId = nextCallId++
	}

	private _unsubscribers: IUnsubscribe[]
	private _unsubscribersLength: number

	public subscribeDependency(dependency: IFuncCallState<any, any, any>): void {
		if (dependency.callId > this.callId) {
			return
		}

		let {_invalidate} = this
		if (!_invalidate) {
			const self = this
			this._invalidate = _invalidate = function() {
				const {status} = this
				if (status === FuncCallStatus.Invalidating || status === FuncCallStatus.Invalidated) {
					self.update(status)
				}
			}
		}
		const unsubscribe = dependency.subscribe(_invalidate, false)

		const {_unsubscribers} = this
		if (!_unsubscribers) {
			this._unsubscribers = [unsubscribe]
			this._unsubscribersLength = 1
		} else {
			_unsubscribers[this._unsubscribersLength++] = unsubscribe
		}
	}

	public unsubscribeDependencies(): void {
		const {_unsubscribers} = this
		if (_unsubscribers) {
			const len = this._unsubscribersLength
			for (let i = 0; i < len; i++) {
				_unsubscribers[i]()
				_unsubscribers[i] = null
			}
			this._unsubscribersLength = 0
			if (len > 256) {
				_unsubscribers.length = 256
			}
		}
	}

	// endregion

	// region invalidate / update

	private _invalidate: () => void
	public invalidate(): void {
		this.update(FuncCallStatus.Invalidating)
		this.update(FuncCallStatus.Invalidated)
	}

	public update(status: FuncCallStatus, valueAsyncOrValueOrError?: Iterator<TValue> | any | TValue): void {
		switch (status) {
			case FuncCallStatus.Invalidating:
				if (this.status == null || this.status === FuncCallStatus.Invalidated) {
					return
				}
				// tslint:disable-next-line:no-nested-switch
				if (this.status !== FuncCallStatus.Invalidating
					&& this.status !== FuncCallStatus.Calculated
					&& this.status !== FuncCallStatus.Error
				) {
					throw new Error(`Set status ${status} called when current status is ${this.status}`)
				}
				this.unsubscribeDependencies()
				break
			case FuncCallStatus.Invalidated:
				if (this.status == null || this.status !== FuncCallStatus.Invalidating) {
					return
				}
				break
			case FuncCallStatus.Calculating:
				if (this.status != null
					&& this.status !== FuncCallStatus.Invalidating
					&& this.status !== FuncCallStatus.Invalidated
				) {
					throw new Error(`Set status ${status} called when current status is ${this.status}`)
				}
				break
			case FuncCallStatus.CalculatingAsync:
				if (this.status !== FuncCallStatus.Calculating) {
					throw new Error(`Set status ${status} called when current status is ${this.status}`)
				}
				this.valueAsync = valueAsyncOrValueOrError
				break
			case FuncCallStatus.Calculated:
				if (this.status !== FuncCallStatus.Calculating && this.status !== FuncCallStatus.CalculatingAsync) {
					throw new Error(`Set status ${status} called when current status is ${this.status}`)
				}
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
				if (this.status !== FuncCallStatus.Calculating && this.status !== FuncCallStatus.CalculatingAsync) {
					throw new Error(`Set status ${status} called when current status is ${this.status}`)
				}
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

		this.status = status

		this.emit()
	}

	// endregion
}
