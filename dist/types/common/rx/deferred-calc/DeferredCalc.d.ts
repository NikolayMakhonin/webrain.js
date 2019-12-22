import { ITiming } from './timing';
export interface IDeferredCalcOptions {
    minTimeBetweenCalc?: number;
    throttleTime?: number;
    maxThrottleTime?: number;
    autoInvalidateInterval?: number;
    timing?: ITiming;
}
export declare class DeferredCalc {
    private readonly _canBeCalcCallback;
    private readonly _calcFunc;
    private readonly _calcCompletedCallback;
    private _minTimeBetweenCalc?;
    private _throttleTime?;
    private _maxThrottleTime?;
    private _autoInvalidateInterval?;
    private readonly _timing;
    private _timerId?;
    private _timeNextPulse?;
    private _timeInvalidateFirst?;
    private _timeInvalidateLast?;
    private _canBeCalcEmitted?;
    private _calcRequested?;
    private _timeCalcStart?;
    private _timeCalcEnd?;
    constructor(canBeCalcCallback: () => void, calcFunc: (done: (...args: any[]) => void) => void, calcCompletedCallback: (...doneArgs: any[]) => void, options: IDeferredCalcOptions);
    get minTimeBetweenCalc(): number;
    set minTimeBetweenCalc(value: number);
    get throttleTime(): number;
    set throttleTime(value: number);
    get maxThrottleTime(): number;
    set maxThrottleTime(value: number);
    get autoInvalidateInterval(): number;
    set autoInvalidateInterval(value: number);
    private _calc;
    private _canBeCalc;
    private _getNextCalcTime;
    private _pulse;
    private _invalidate;
    invalidate(): void;
    calc(): void;
    reCalc(): void;
}
