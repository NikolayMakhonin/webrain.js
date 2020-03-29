import {ITiming, timingDefault} from './timing'

export interface IDeferredCalcOptions {
	throttleTime?: number,
	maxThrottleTime?: number,
	minTimeBetweenCalc?: number,
	autoInvalidateInterval?: number,
	timing?: ITiming,
}

export class DeferredCalc {
	private readonly _canBeCalcCallback: () => void
	private readonly _calcFunc: (done: (value: any) => void) => void
	private readonly _calcCompletedCallback: (value: any) => void

	private readonly _options: IDeferredCalcOptions

	private readonly _timing: ITiming

	private _timerId?: number
	private _timeNextPulse?: number

	private _timeInvalidateFirst?: number
	private _timeInvalidateLast?: number
	private _canBeCalcEmitted?: boolean
	private _calcRequested?: boolean
	private _timeCalcStart?: number
	private _timeCalcEnd?: number

	constructor(
		canBeCalcCallback: () => void,
		calcFunc: (done: (...args: any[]) => void) => void,
		calcCompletedCallback: (...doneArgs: any[]) => void,
		options: IDeferredCalcOptions,
	) {
		this._canBeCalcCallback = canBeCalcCallback
		this._calcFunc = calcFunc
		this._calcCompletedCallback = calcCompletedCallback
		this._options = options || {}
		this._timing = this._options.timing || timingDefault

		this.invalidate()
	}

	// region Properties

	// region minTimeBetweenCalc

	public get minTimeBetweenCalc(): number {
		return this._options.minTimeBetweenCalc
	}
	public set minTimeBetweenCalc(value: number) {
		if (this._options.minTimeBetweenCalc === value) {
			return
		}
		this._options.minTimeBetweenCalc = value
		this._pulse()
	}

	// endregion

	// region throttleTime

	public get throttleTime(): number {
		return this._options.throttleTime
	}
	public set throttleTime(value: number) {
		if (this._options.throttleTime === value) {
			return
		}
		this._options.throttleTime = value
		this._pulse()
	}

	// endregion

	// region maxThrottleTime

	public get maxThrottleTime(): number {
		return this._options.maxThrottleTime
	}
	public set maxThrottleTime(value: number) {
		if (this._options.maxThrottleTime === value) {
			return
		}
		this._options.maxThrottleTime = value
		this._pulse()
	}

	// endregion

	// region autoInvalidateInterval

	public get autoInvalidateInterval(): number {
		return this._options.autoInvalidateInterval
	}
	public set autoInvalidateInterval(value: number) {
		if (this._options.autoInvalidateInterval === value) {
			return
		}
		this._options.autoInvalidateInterval = value
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

		this._calcFunc.call(this, (...args: any[]) => {
			this._timeCalcEnd = this._timing.now()
			this._calcCompletedCallback.apply(this, args)
			this._pulse()
		})
	}

	private _canBeCalc() {
		this._canBeCalcEmitted = true
		this._canBeCalcCallback.call(this)
	}

	private _getNextCalcTime() {
		const {throttleTime, maxThrottleTime, minTimeBetweenCalc} = this._options
		let nextCalcTime = this._timeInvalidateLast + (throttleTime || 0)
		if (maxThrottleTime != null) {
			nextCalcTime = Math.min(nextCalcTime, this._timeInvalidateFirst + (maxThrottleTime || 0))
		}
		if (this._timeCalcEnd) {
			nextCalcTime = Math.max(nextCalcTime, this._timeCalcEnd + (minTimeBetweenCalc || 0))
		}
		return nextCalcTime
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

		const {autoInvalidateInterval} = this._options
		if (autoInvalidateInterval != null) {
			const autoInvalidateTime = Math.max(
				(this._timeCalcStart || 0) + autoInvalidateInterval,
				(this._timeInvalidateLast || 0) + autoInvalidateInterval,
				now)

			if (autoInvalidateTime <= now) {
				this._invalidate()
			} else if (timeNextPulse <= now || autoInvalidateTime < timeNextPulse) {
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
			const canBeCalcTime = this._getNextCalcTime()
			if (canBeCalcTime <= now) {
				this._canBeCalc()
				this._pulse()
				return
			} else if (timeNextPulse <= now || canBeCalcTime < timeNextPulse) {
				timeNextPulse = canBeCalcTime
			}
		}

		// endregion

		// region Calc

		if (this._calcRequested && (this._timeCalcEnd || !this._timeCalcStart)) {
			const calcTime = this._getNextCalcTime()
			if (calcTime <= now) {
				this._calc()
				return
			} else if (timeNextPulse <= now || calcTime < timeNextPulse) {
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
		if (!this._calcRequested && this._canBeCalcEmitted) {
			this._calcRequested = true
			this._pulse()
		}
	}

	public reCalc(): void {
		this._calcRequested = true
		this._pulse()
	}

	// endregion
}
