import {IUnbind} from './contracts'

export class Binder {
	private readonly _bind: () => IUnbind
	constructor(bind: () => IUnbind) {
		this._bind = bind
	}

	private _bindsCount: number = 0
	private __unbind: IUnbind
	private _unbind() {
		this._bindsCount--
		if (this._bindsCount > 0) {
			return
		}
		if (this._bindsCount < 0) {
			throw new Error('Unexpected behavior: this._bindsCount < 0')
		}
		this.__unbind()
		this.__unbind = null
	}

	public bind(): IUnbind {
		if (this.__unbind == null) {
			if (this._bindsCount !== 0) {
				throw new Error('Unexpected behavior: this._bindsCount !== 0')
			}
			this.__unbind = this._bind()
		} else if (this._bindsCount <= 0) {
			throw new Error('Unexpected behavior: this._bindsCount <= 0')
		}

		this._bindsCount++
		let wasUnbind = false
		return () => {
			if (wasUnbind) {
				return
			}
			wasUnbind = true

			this._unbind()
		}
	}
}
