import {getOrCreateCallState} from '../../../../rx/depend/core/CallState'
import {depend} from '../../../../rx/depend/core/depend'
import {ICallState} from '../../../depend/core/contracts'
import {ISubscriber} from '../../../subjects/observable'
import {Path, TNextPath} from './builder'

const forEachPath = depend(function<TObject, TValue>(this: TObject, path: Path<TObject, TValue>) {
	path.get(this)
})

export class DeepSubscriber<TObject, TValue> {
	private readonly _path: Path<TObject, TValue>
	constructor(path: Path<TObject, TValue>) {
		this._path = path
	}

	public subscribe(object: TObject, subscriber: ISubscriber<ICallState<TObject, [Path<TObject, TValue>], TValue>>) {
		const state: ICallState<TObject, [Path<TObject, TValue>], TValue>
			= getOrCreateCallState(forEachPath).call(object, this._path)
		return state.subscribe(subscriber)
	}
}

export function dependDeepSubscribe<TObject, TValue>({
	object,
	build,
	subscriber,
}: {
	object: TObject,
	build: TNextPath<TObject, TObject, TValue>,
	subscriber: ISubscriber<ICallState<TObject, [Path<TObject, TValue>], TValue>>,
}) {
	const path = build(new Path()).init()
	return new DeepSubscriber(path)
		.subscribe(object, subscriber as any)
}
