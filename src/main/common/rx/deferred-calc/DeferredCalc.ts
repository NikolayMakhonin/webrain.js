import {ITiming, timingDefault} from './timing'

export interface IDeferredCalcOptions {
	throttleTime?: number,
	maxThrottleTime?: number,
	delayBeforeCalc?: number,
	minTimeBetweenCalc?: number,
	autoInvalidateInterval?: number,
	timing?: ITiming,
}

export class DeferredCalc {
	private readonly _canBeCalcCallback: () => void
	private readonly _calcFunc: () => void
	private readonly _calcCompletedCallback: (...doneArgs: any[]) => void
	private readonly _options: IDeferredCalcOptions
	private readonly _timing: ITiming

	private _timerId: number = -1
	private _timeNextPulse: number = -1

	private _timeInvalidateFirst: number = -1
	private _timeInvalidateLast: number = 0
	private _canBeCalcEmitted: boolean = false
	private _calcRequested: boolean = false
	private _timeCalcStart: number = 0
	private _timeCalcEnd: number = 0

	constructor(
		canBeCalcCallback: () => void,
		calcFunc: () => void,
		calcCompletedCallback: (...doneArgs: any[]) => void,
		options: IDeferredCalcOptions,
		dontInvalidate?: boolean,
	) {
		this._canBeCalcCallback = canBeCalcCallback
		this._calcFunc = calcFunc
		this._calcCompletedCallback = calcCompletedCallback
		this._options = options || {}
		this._timing = this._options.timing || timingDefault
		this._pulseBind = () => { this._pulse() }

		if (!dontInvalidate) {
			this.invalidate()
		}
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

	// region delayBeforeCalc

	public get delayBeforeCalc(): number {
		return this._options.delayBeforeCalc
	}
	public set delayBeforeCalc(value: number) {
		if (this._options.delayBeforeCalc === value) {
			return
		}
		this._options.delayBeforeCalc = value
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
		this._timeInvalidateFirst = -1
		this._timeInvalidateLast = 0
		this._canBeCalcEmitted = false
		this._calcRequested = false
		this._timeCalcStart = this._timing.now()
		this._timeCalcEnd = 0
		this._pulse()

		this._calcFunc()
	}

	public done(...args: any[])
	public done(v1, v2, v3, v4, v5) {
		this._timeCalcEnd = this._timing.now()
		if (this._calcCompletedCallback != null) {
			this._calcCompletedCallback(v1, v2, v3, v4, v5)
		}
		this._pulse()
	}

	private _canBeCalc() {
		this._canBeCalcEmitted = true
		this._canBeCalcCallback()
	}

	private _getNextCalcTime() {
		const {throttleTime, maxThrottleTime, delayBeforeCalc, minTimeBetweenCalc} = this._options
		let nextCalcTime = this._timeInvalidateLast + (throttleTime || 0)
		if (maxThrottleTime != null) {
			nextCalcTime = Math.min(nextCalcTime, this._timeInvalidateFirst + (maxThrottleTime || 0))
		}
		if (delayBeforeCalc != null) {
			nextCalcTime = Math.max(nextCalcTime, this._timeInvalidateFirst + (delayBeforeCalc || 0))
		}
		if (this._timeCalcEnd !== 0) {
			nextCalcTime = Math.max(nextCalcTime, this._timeCalcEnd + (minTimeBetweenCalc || 0))
		}
		return nextCalcTime
	}

	private readonly _pulseBind: () => void
	private _pulse(): void {
		// region Timer

		const {_timing} = this
		const now = _timing.now()

		let {_timeNextPulse: timeNextPulse} = this
		if (timeNextPulse < 0) {
			timeNextPulse = now
		} else if (timeNextPulse <= now) {
			this._timerId = -1
		}

		// endregion

		// region Auto invalidate

		const {autoInvalidateInterval} = this._options
		if (autoInvalidateInterval != null) {
			const autoInvalidateTime = Math.max(
				this._timeCalcStart + autoInvalidateInterval,
				this._timeInvalidateLast + autoInvalidateInterval,
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
			&& this._timeInvalidateLast !== 0
			&& (this._timeCalcEnd !== 0 || this._timeCalcStart === 0)
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

		if (this._calcRequested && (this._timeCalcEnd !== 0 || this._timeCalcStart === 0)) {
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
			if (timerId >= 0) {
				_timing.clearTimeout(timerId)
			}
			this._timeNextPulse = timeNextPulse
			this._timerId = _timing.setTimeout(this._pulseBind, timeNextPulse - now + 1) // ( + 1) is  fix hung
		}

		// endregion
	}

	private _invalidate(): void {
		const now = this._timing.now()
		if (this._timeInvalidateFirst < 0) {
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
