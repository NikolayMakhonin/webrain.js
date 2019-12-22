import { ThenableOrValue } from '../../../async/async';
import { CalcStat } from '../../../helpers/CalcStat';
import { VALUE_PROPERTY_DEFAULT } from '../../../helpers/value-property';
import { IDeferredCalcOptions } from '../../deferred-calc/DeferredCalc';
import { ObservableClass } from '../ObservableClass';
import { CalcPropertyFunc, ICalcProperty, ICalcPropertyState } from './contracts';
export declare class CalcPropertyValue<TValue, TInput = any> {
    get: () => CalcProperty<TValue, TInput>;
    constructor(property: CalcProperty<TValue, TInput>);
}
export declare class CalcPropertyState<TValue, TInput = any> extends ObservableClass implements ICalcPropertyState<TValue, TInput> {
    readonly calcOptions: IDeferredCalcOptions;
    name: string;
    constructor(calcOptions: IDeferredCalcOptions, initValue: TValue);
    value: TValue;
    input: TInput;
}
export declare class CalcProperty<TValue, TInput = any> extends ObservableClass implements ICalcProperty<TValue, TInput> {
    private readonly _calcFunc;
    private readonly _deferredCalc;
    private _deferredValue;
    private _hasValue;
    private _error;
    private readonly _initValue?;
    readonly timeSyncStat: CalcStat;
    readonly timeAsyncStat: CalcStat;
    readonly timeDebuggerStat: CalcStat;
    readonly timeEmitEventsStat: CalcStat;
    readonly timeTotalStat: CalcStat;
    readonly state: ICalcPropertyState<TValue, TInput>;
    constructor({ calcFunc, name, calcOptions, initValue, }: {
        calcFunc: CalcPropertyFunc<TValue, TInput>;
        name?: string;
        calcOptions: IDeferredCalcOptions;
        initValue?: TValue;
    });
    private setDeferredValue;
    private onValueChanged;
    invalidate(): void;
    onInvalidated(): void;
    get [VALUE_PROPERTY_DEFAULT](): ThenableOrValue<TValue>;
    get wait(): ThenableOrValue<TValue>;
    get last(): TValue;
    /** @deprecated not needed and not implemented. Use 'last' instead. */
    get lastOrWait(): ThenableOrValue<TValue>;
    clear(): void;
}
