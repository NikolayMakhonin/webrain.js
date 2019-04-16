import {ITiming} from '../../../../../../../main/common/rx/deferred-calc/timing'

interface IHandler {
	id: number,
	time: number,
	handler: () => void,
}

export class TestTiming implements ITiming {
	private _handlers: IHandler[] = []
	private _now: number = 0
	private _nextId: number = 0

	public addTime(time: number) {
		this.setTime(this._now + time)
	}

	public setTime(time: number) {
		const {_handlers} = this
		this._now = time
		Object.keys(_handlers)
			.map(key => _handlers[key] as IHandler)
			.filter(o => o.time <= time)
			.sort((o1, o2) => {
				if (o1.time > o2.time) {
					return 1
				}
				if (o1.time < o2.time) {
					return -1
				}
				if (o1.id > o2.id) {
					return 1
				}
				if (o1.id < o2.id) {
					return -1
				}

				throw new Error('Duplicate timing handlers')
			})
			.forEach(handler => {
				delete _handlers[handler.id]
				handler.handler()
			})
	}

	public now(): number {
		return this._now
	}

	public setTimeout(handler: () => void, timeout: number): number {
		const id = this._nextId++
		this._handlers[id] = {
			id,
			time: this._now + timeout,
			handler,
		}
		return id
	}

	public clearTimeout(handle: number) {
		delete this._handlers[handle]
	}
}
