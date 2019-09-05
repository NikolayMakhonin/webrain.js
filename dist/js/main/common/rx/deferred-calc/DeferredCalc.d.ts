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
    constructor(canBeCalcCallback: () => void, calcFunc: (done: (value?: any) => void) => void, calcCompletedCallback: (value?: any) => void, options: IDeferredCalcOptions);
    minTimeBetweenCalc: number;
    throttleTime: number;
    maxThrottleTime: number;
    autoInvalidateInterval: number;
    private _calc;
    private _canBeCalc;
    private _getNextCalcTime;
    private _pulse;
    private _invalidate;
    invalidate(): void;
    calc(): void;
    reCalc(): void;
}
