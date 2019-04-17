import {ITiming} from '../../../../../../../main/common/rx/deferred-calc/timing'

interface IHandler {
	id: number,
	time: number,
	handler: () => void,
}

function compareHandlers(o1: IHandler, o2: IHandler): number {
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
}

export class TestTiming implements ITiming {
	private _handlers: IHandler[] = []
	private _now: number = 1
	private _nextId: number = 0

	public addTime(time: number) {
		this.setTime(this._now + time)
	}

	public setTime(time: number) {
		if (time <= 0) {
			throw new Error(`time (${time} should be > 0)`)
		}
		const {_handlers, _now: now} = this

		while (true) {
			let minHandler: IHandler
			for (const id in _handlers) {
				if (Object.prototype.hasOwnProperty.call(_handlers, id)) {
					const handler = _handlers[id]
					if (handler.time <= time && (!minHandler || compareHandlers(handler, minHandler) < 0)) {
						minHandler = handler
					}
				}
			}

			if (!minHandler) {
				break
			}

			delete _handlers[minHandler.id]
			this._now = minHandler.time
			minHandler.handler()
		}

		this._now = time
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
