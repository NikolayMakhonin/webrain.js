import {assert} from '../../../../main/common'
import {isThenable, Thenable, ThenableOrValue} from '../../../../main/common/async/async'
import {resolveAsync} from '../../../../main/common/async/ThenableSync'
import {isIterator} from '../../../../main/common/helpers/helpers'
import {getTupleId, getTupleIdMap} from '../../../../main/common/helpers/tuple-unique-id'
import {Diff} from '../../../../main/common/helpers/typescript'
import {IChangeItem} from '../../../../main/common/rx/deep-subscribe/contracts/rule-subscribe'
import {IUnsubscribeOrVoid} from '../../../../main/common/rx/subjects/observable'
import {ISubject, Subject} from '../../../../main/common/rx/subjects/subject'

type NotThenable<T> = Diff<T, Thenable<any>>
type TDependentFuncBodyResult<T> = Iterator<NotThenable<T>> | NotThenable<T>
type TDependentFuncBody<T> = () => TDependentFuncBodyResult<T>

type TDependentFunc<T> = () => ThenableOrValue<T>
interface IDependentFunc<T> extends TDependentFunc<T> {
	name: string
	subscribe(subscribe: (changeItem: IChangeItem<any>) => IUnsubscribeOrVoid): void
	changed: ISubject<T>
}

// const acceptorSubscribe: IAcceptorSubscribe = subscribe => {
// 	const unsubscriber = subscribe((
// 		key: any,
// 		oldItem: any,
// 		newItem: any,
// 		changeType: ValueChangeType,
// 		keyType: ValueKeyType,
// 	) => {
// 		invalidate()
// 	})
//
// 	if (this.unsubscribers) {
// 		this.unsubscribers = [unsubscriber]
// 	} else {
// 		this.unsubscribers.push(unsubscriber)
// 	}
// }

// currentPushSubscribeDependency(changeItem => {
// 	o.propertyChanged.subscribe((...args) => {
// 		changeItem(...)
// 	})
//
// 	changeItem(...)
//
// 	return () => {
// 		changeItem(...)
// 	}
// })

// terms: dependent <- dependency

export type ISubscribeDependency = (onInvalidate: () => void) => IUnsubscribeOrVoid

export interface IFuncMeta {
	hasDependency(callId: number): boolean
	subscribeDependency(callId: number, subscriber: ISubscribeDependency)
	setValue(callId: number, value: any)
}

let currentMeta: IFuncMeta

function* makeDependentIterator<T>(
	callId: number,
	meta: IFuncMeta,
	iterator: Iterator<T>,
): Iterator<T> {
	currentMeta = meta

	let iteration = iterator.next()
	while (!iteration.done) {
		const value = yield iteration.value
		currentMeta = meta
		iteration = iterator.next(value)
	}

	meta.setValue(callId, iteration.value)

	return iteration.value
}

export function makeDependentFunc<
	TThis,
	TArgs extends any[],
	TResult,
	TFunc extends (this: TThis, ...args: TArgs) => TResult
>(
	func: TFunc,
	getSubscriber: (this: TThis, ...args: TArgs) => ISubscribeDependency,
	meta: IFuncMeta,
): TFunc {
	const callIdMap = getTupleIdMap(func)

	return function() {
		const parentMeta = currentMeta
		currentMeta = meta

		const callId = getTupleId.apply(
			callIdMap.getTupleIdMap(arguments.length, this),
			arguments,
		)

		if (parentMeta && !parentMeta.hasDependency(callId)) {
			parentMeta.subscribeDependency(callId, getSubscriber.apply(this, arguments))
		}

		let result
		try {
			result = func.apply(this, arguments)
			if (isIterator(result)) {
				return makeDependentIterator(callId, meta, result as Iterator<any>)
			}
			meta.setValue(callId, result)
			return result
		} finally {
			currentMeta = parentMeta
		}
	} as any
}

class DependentFunc<
	TThis,
	TArgs extends any[],
	TResult,
	TFunc extends (this: TThis, ...args: TArgs) => TResult
> {
	private readonly _func: TFunc
	constructor(func: TFunc) {
		this.id = id
	}

	public subscribers = new Map()
	public values = new Map()

	public hasDependency(callId: number): boolean {
		return this.subscribers.has(callId)
	}

	public subscribeDependency(callId: number, subscriber: (onInvalidate: () => void) => IUnsubscribeOrVoid) {
		assert.notOk(this.subscribers.has(callId))
		return this.subscribers.set(callId, subscriber)
	}

	public setValue(callId: number, value: any) {
		return this.values.set(callId, value)
	}
}
