import {ITiming, timingDefault} from "./timing";

export class DeferredCalc {
	private readonly _canBeCalcCallback: () => void
	private readonly _calcCompletedCallback: () => void
	private readonly _calcFunc: () => Promise<any>|void
	private readonly _minTimeBetweenCalc?: number
	private readonly _throttleTime?: number
	private readonly _maxThrottleTime?: number
	private readonly _autoInvalidateInterval?: number
	private readonly _timing: ITiming

	private _timerId?: number
	private _timeNextPulse?: number

	private _timeInvalidateFirst?: number
	private _timeInvalidateLast?: number
	private _timeRequestCalc?: number
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
		calcFunc: () => Promise<any>|void,
		calcCompletedCallback: () => void,
		minTimeBetweenCalc: number,
		throttleTime?: number,
		maxThrottleTime?: number,
		autoInvalidateInterval?: number,
		timing?: ITiming,
	}) {
		this._canBeCalcCallback = canBeCalcCallback
		this._calcFunc = calcFunc
		this._calcCompletedCallback = calcCompletedCallback

		this._minTimeBetweenCalc = minTimeBetweenCalc

		if (throttleTime) {
			this._throttleTime = throttleTime
		}

		if (maxThrottleTime) {
			this._maxThrottleTime = maxThrottleTime
		}

		if (autoInvalidateInterval) {
			this._autoInvalidateInterval = autoInvalidateInterval
		}

		this._timing = timing || timingDefault

		this.invalidate()
	}

	private async _calc(): Promise<void> {
		this._timeRequestCalc = null
		this._timeInvalidateFirst = null
		this._timeInvalidateLast = null
		this._timeCalcStart = this._timing.now()
		this._timeCalcEnd = null
		this.pulse()

		await this._calcFunc()

		this._timeCalcEnd = this._timing.now()
		this._calcCompletedCallback()
		this.pulse()
	}

	public pulse(): void {
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

		const autoInvalidateTime = Math.max(
			this._timeCalcStart || 0,
			this._timeInvalidateLast || 0,
			now)

		if (autoInvalidateTime <= now) {
			this._invalidate()
		} else if (autoInvalidateTime > timeNextPulse) {
			timeNextPulse = autoInvalidateTime
		}

		// endregion

		// region Can be calc

		if (!this._timeRequestCalc && this._timeInvalidateLast) {
			const {_throttleTime, _maxThrottleTime} = this
			let canBeCalcTime = this._timeInvalidateLast + (this._throttleTime || 0)
			if (this._maxThrottleTime != null) {
				canBeCalcTime = Math.min(canBeCalcTime, this._timeInvalidateFirst + (this._maxThrottleTime || 0))
			}
			if (canBeCalcTime <= now) {
				this._timeRequestCalc = now
				this._canBeCalcCallback()
			} else if (canBeCalcTime > timeNextPulse) {
				timeNextPulse = canBeCalcTime
			}
		}

		// endregion

		// region Calc

		// endregion

		// region Timer

		if (timeNextPulse > now) {
			const {_timerId: timerId} = this
			if (timerId != null) {
				_timing.clearTimeout(timerId)
			}
			this._timerId = _timing.setTimeout(this.pulse, timeNextPulse - now)
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

	public invalidate(): void {
		this._invalidate()
		this.pulse()
	}

	public calc(): void {
		this._timeRequestCalc = this._timing.now()
		this.pulse()
	}
}
