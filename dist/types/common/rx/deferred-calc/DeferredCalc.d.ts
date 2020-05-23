import { ITiming } from './timing';
export interface IDeferredCalcOptions {
    throttleTime?: number;
    maxThrottleTime?: number;
    delayBeforeCalc?: number;
    minTimeBetweenCalc?: number;
    autoInvalidateInterval?: number;
    timing?: ITiming;
}
export declare class DeferredCalc {
    private readonly _shouldInvalidate;
    private readonly _canBeCalcCallback;
    private readonly _calcFunc;
    private readonly _calcCompletedCallback;
    private readonly _options;
    private readonly _timing;
    private _timerId;
    private _timeNextPulse;
    private _timeInvalidateFirst;
    private _timeInvalidateLast;
    private _canBeCalcEmitted;
    private _calcRequested;
    private _timeCalcStart;
    private _timeCalcEnd;
    constructor({ shouldInvalidate, canBeCalcCallback, calcFunc, calcCompletedCallback, options, dontImmediateInvalidate, }: {
        shouldInvalidate?: () => void;
        canBeCalcCallback?: () => void;
        calcFunc?: () => void;
        calcCompletedCallback?: (...doneArgs: any[]) => void;
        options?: IDeferredCalcOptions;
        dontImmediateInvalidate?: boolean;
    });
    get minTimeBetweenCalc(): number;
    set minTimeBetweenCalc(value: number);
    get throttleTime(): number;
    set throttleTime(value: number);
    get maxThrottleTime(): number;
    set maxThrottleTime(value: number);
    get delayBeforeCalc(): number;
    set delayBeforeCalc(value: number);
    get autoInvalidateInterval(): number;
    set autoInvalidateInterval(value: number);
    private _calc;
    done(...args: any[]): any;
    private _canBeCalc;
    private _getNextCalcTime;
    private readonly _pulseBind;
    private _pulse;
    private _invalidate;
    invalidate(): void;
    calc(): void;
    reCalc(): void;
}
