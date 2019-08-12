import {ITiming, timingDefault} from './timing'

export class DeferredCalc {
	private readonly _canBeCalcCallback: () => void
	private readonly _calcCompletedCallback: () => void
	private readonly _calcFunc: (done: () => void) => void

	private _minTimeBetweenCalc?: number
	private _throttleTime?: number
	private _maxThrottleTime?: number
	private _autoInvalidateInterval?: number

	private readonly _timing: ITiming

	private _timerId?: number
	private _timeNextPulse?: number

	private _timeInvalidateFirst?: number
	private _timeInvalidateLast?: number
	private _canBeCalcEmitted?: boolean
	private _calcRequested?: boolean
	private _timeCalcStart?: number
	private _timeCalcEnd?: number

	constructor({
		canBeCalcCallback,
		calcFunc,
		calcCompletedCallback,
		minTimeBetweenCalc,
		throttleTime,
		maxThrottleTime,
		autoInvalidateInterval,
		timing,
	}: {
		canBeCalcCallback: () => void,
		calcFunc: (done: () => void) => void,
		calcCompletedCallback: () => void,
		minTimeBetweenCalc?: number,
		throttleTime?: number,
		maxThrottleTime?: number,
		autoInvalidateInterval?: number,
		timing?: ITiming,
	}) {
		this._canBeCalcCallback = canBeCalcCallback
		this._calcFunc = calcFunc
		this._calcCompletedCallback = calcCompletedCallback

		if (minTimeBetweenCalc) {
			this._minTimeBetweenCalc = minTimeBetweenCalc
		}

		if (throttleTime) {
			this._throttleTime = throttleTime
		}

		if (maxThrottleTime != null) {
			this._maxThrottleTime = maxThrottleTime
		}

		if (autoInvalidateInterval != null) {
			this._autoInvalidateInterval = autoInvalidateInterval
		}

		this._timing = timing || timingDefault

		this.invalidate()
	}

	// region Properties

	// region minTimeBetweenCalc

	public get minTimeBetweenCalc(): number {
		return this._minTimeBetweenCalc
	}
	public set minTimeBetweenCalc(value: number) {
		if (this._minTimeBetweenCalc === value) {
			return
		}
		this._minTimeBetweenCalc = value
		this._pulse()
	}

	// endregion

	// region throttleTime

	public get throttleTime(): number {
		return this._throttleTime
	}
	public set throttleTime(value: number) {
		if (this._throttleTime === value) {
			return
		}
		this._throttleTime = value
		this._pulse()
	}

	// endregion

	// region maxThrottleTime

	public get maxThrottleTime(): number {
		return this._maxThrottleTime
	}
	public set maxThrottleTime(value: number) {
		if (this._maxThrottleTime === value) {
			return
		}
		this._maxThrottleTime = value
		this._pulse()
	}

	// endregion

	// region autoInvalidateInterval

	public get autoInvalidateInterval(): number {
		return this._autoInvalidateInterval
	}
	public set autoInvalidateInterval(value: number) {
		if (this._autoInvalidateInterval === value) {
			return
		}
		this._autoInvalidateInterval = value
		this._pulse()
	}

	// endregion

	// endregion

	// region Private methods

	private _calc(): void {
		this._timeInvalidateFirst = null
		this._timeInvalidateLast = null
		this._canBeCalcEmitted = false
		this._calcRequested = false
		this._timeCalcStart = this._timing.now()
		this._timeCalcEnd = null
		this._pulse()

		this._calcFunc.call(this, () => {
			this._timeCalcEnd = this._timing.now()
			this._calcCompletedCallback.call(this)
			this._pulse()
		})
	}

	private _canBeCalc() {
		this._canBeCalcEmitted = true
		this._canBeCalcCallback.call(this)
	}

	private _pulse(): void {
		// region Timer

		const {_timing} = this
		const now = _timing.now()

		let {_timeNextPulse: timeNextPulse} = this
		if (timeNextPulse == null) {
			timeNextPulse = now
		} else if (timeNextPulse <= now) {
			this._timerId = null
		}

		// endregion

		// region Auto invalidate

		const {_autoInvalidateInterval} = this
		if (_autoInvalidateInterval != null) {
			const autoInvalidateTime = Math.max(
				(this._timeCalcStart || 0) + _autoInvalidateInterval,
				(this._timeInvalidateLast || 0) + _autoInvalidateInterval,
				now)

			if (autoInvalidateTime <= now) {
				this._invalidate()
			} else if (autoInvalidateTime > timeNextPulse) {
				timeNextPulse = autoInvalidateTime
			}
		}

		// endregion

		// region Can be calc

		if (!this._canBeCalcEmitted
			&& !this._calcRequested
			&& this._timeInvalidateLast
			&& (this._timeCalcEnd || !this._timeCalcStart)
		) {
			const {_throttleTime, _maxThrottleTime} = this
			let canBeCalcTime = this._timeInvalidateLast + (_throttleTime || 0)
			if (_maxThrottleTime != null) {
				canBeCalcTime = Math.min(canBeCalcTime, this._timeInvalidateFirst + (_maxThrottleTime || 0))
			}
			if (this._timeCalcEnd) {
				canBeCalcTime = Math.max(canBeCalcTime, this._timeCalcEnd + this._minTimeBetweenCalc || 0)
			}
			if (canBeCalcTime <= now) {
				this._canBeCalc()
				this._pulse()
				return
			} else if (canBeCalcTime > timeNextPulse) {
				timeNextPulse = canBeCalcTime
			}
		}

		// endregion

		// region Calc

		if (this._calcRequested && (this._timeCalcEnd || !this._timeCalcStart)) {
			const {_throttleTime, _maxThrottleTime} = this
			let calcTime = this._timeInvalidateLast + (_throttleTime || 0)
			if (_maxThrottleTime != null) {
				calcTime = Math.min(calcTime, this._timeInvalidateFirst + (_maxThrottleTime || 0))
			}
			if (this._timeCalcEnd) {
				calcTime = Math.max(calcTime, this._timeCalcEnd + this._minTimeBetweenCalc || 0)
			}
			if (calcTime <= now) {
				this._calc()
				return
			} else if (calcTime > timeNextPulse) {
				timeNextPulse = calcTime
			}
		}

		// endregion

		// region Timer

		if (timeNextPulse > now && timeNextPulse !== this._timeNextPulse) {
			const {_timerId: timerId} = this
			if (timerId != null) {
				_timing.clearTimeout(timerId)
			}
			this._timeNextPulse = timeNextPulse
			this._timerId = _timing.setTimeout(() => { this._pulse() }, timeNextPulse - now)
		}

		// endregion
	}

	private _invalidate(): void {
		const now = this._timing.now()
		if (this._timeInvalidateFirst == null) {
			this._timeInvalidateFirst = now
		}
		this._timeInvalidateLast = now
	}

	// endregion

	// region Public methods

	public invalidate(): void {
		this._invalidate()
		this._pulse()
	}

	public calc(): void {
		this._calcRequested = true
		this._pulse()
	}

	// endregion
}
