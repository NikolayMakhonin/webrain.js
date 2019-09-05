import { ThenableOrIteratorOrValue, ThenableOrValue } from '../../../async/async';
import { VALUE_PROPERTY_DEFAULT } from '../../../helpers/value-property';
import { IDeferredCalcOptions } from '../../deferred-calc/DeferredCalc';
import { ObservableObject } from '../ObservableObject';
import { ICalcProperty } from './contracts';
import { IPropertyOptions, Property } from './Property';
export declare type CalcPropertyFunc<TInput, TTarget, TSource> = (input: TInput, property: Property<TTarget, TSource>) => ThenableOrIteratorOrValue<void>;
export declare class CalcPropertyValue<TValue, TInput = any, TMergeSource = any> {
    get: () => CalcProperty<TValue, TInput, TMergeSource>;
    constructor(property: CalcProperty<TValue, TInput, TMergeSource>);
}
export declare class CalcProperty<TValue, TInput = any, TMergeSource = any> extends ObservableObject implements ICalcProperty<TValue> {
    private readonly _calcFunc;
    private readonly _valueProperty;
    private readonly _deferredCalc;
    private _deferredValue;
    private _hasValue;
    private readonly _initValue?;
    input: TInput;
    constructor(calcFunc: CalcPropertyFunc<TInput, TValue, TMergeSource>, calcOptions: IDeferredCalcOptions, valueOptions?: IPropertyOptions<TValue, TMergeSource>, initValue?: TValue);
    invalidate(): void;
    onInvalidated(): void;
    onCalculated(): void;
    readonly [VALUE_PROPERTY_DEFAULT]: ThenableOrValue<TValue>;
    readonly wait: ThenableOrValue<TValue>;
    readonly last: TValue;
    readonly lastOrWait: ThenableOrValue<TValue>;
    clear(): void;
}
