import { IDeferredCalcOptions } from '../../deferred-calc/DeferredCalc';
import { CalcProperty } from './CalcProperty';
import { CalcPropertyDependenciesBuilder } from './CalcPropertyDependenciesBuilder';
import { CalcPropertyFunc } from './contracts';
export declare function calcPropertyFactory<TValue, TInput, TTarget extends CalcProperty<TValue, TInput> = CalcProperty<TValue, TInput>>({ dependencies: buildDependencies, calcFunc, name, calcOptions, initValue, }: {
    dependencies: null | ((dependenciesBuilder: CalcPropertyDependenciesBuilder<CalcProperty<TValue, TInput>, TInput>) => void);
    calcFunc: CalcPropertyFunc<TValue, TInput>;
    name?: string;
    calcOptions?: IDeferredCalcOptions;
    initValue?: TValue;
}): () => CalcProperty<TValue, TInput>;
