import { ThenableIterator, ThenableOrIteratorOrValue, ThenableOrValue } from '../async/async';
import { Random } from '../random/Random';
import { TConsoleType } from './interceptConsole';
export declare type TTestIteration<TState> = (rnd: Random, state: TState) => ThenableOrIteratorOrValue<any>;
export declare type TAction<TState> = (rnd: Random, state: TState) => ThenableOrIteratorOrValue<any>;
interface IBeforeAfter<TState> {
    before?: TAction<TState>;
    after?: TAction<TState>;
}
interface IIterationAction<TState> extends IBeforeAfter<TState> {
    /** Probability weight */
    weight: number;
}
export declare function iterationBuilder<TState>({ before, action, waitAsyncRandom, waitAsyncAll, after, }: IBeforeAfter<TState> & {
    action: IIterationAction<TState> & {
        func: TAction<TState>;
    };
    waitAsyncRandom?: IIterationAction<TState>;
    waitAsyncAll?: IIterationAction<TState>;
}): TTestIteration<TState>;
export declare type TTestIterator<TOptions> = (rnd: Random, options: TOptions) => ThenableOrIteratorOrValue<any>;
export declare function iteratorBuilder<TOptions, TState>(createState: (rnd: Random, options: TOptions) => ThenableOrIteratorOrValue<TState>, { before, stopPredicate, iteration, after, }: IBeforeAfter<TState> & {
    stopPredicate: (iterationNumber: number, timeStart: number, state: TState) => ThenableOrIteratorOrValue<boolean>;
    iteration: TTestIteration<TState>;
}): TTestIterator<TOptions>;
export interface IOptionsPatternBase {
    seed?: number;
}
export declare type TOptionsGenerator<TOptionsPattern, TOptions> = (rnd: Random, pattern: TOptionsPattern) => ThenableOrIteratorOrValue<TOptions>;
export declare function test<TOptionsPattern extends IOptionsPatternBase, TOptions>(optionsPattern: TOptionsPattern, optionsGenerator: TOptionsGenerator<TOptionsPattern, TOptions>, testIterator: TTestIterator<TOptions>): ThenableIterator<any>;
export declare type TTestRunnerStopPredicate = (iterationNumber: number, timeElapsed: number) => ThenableOrIteratorOrValue<boolean>;
export interface ISearchBestErrorParams<TMetrics> {
    customSeed?: number;
    metricsMin?: TMetrics;
    stopPredicate: (iterationNumber: number, timeElapsed: number) => ThenableOrIteratorOrValue<boolean>;
}
export declare type TSearchBestError<TMetrics> = <TContext>(_this: TContext, { customSeed, metricsMin, stopPredicate, createMetrics, compareMetrics, func, }: ISearchBestErrorParams<TMetrics> & {
    createMetrics: () => ThenableOrIteratorOrValue<TMetrics>;
    compareMetrics: (metrics1: any, metrics2: any) => boolean;
    func: (this: TContext, seed: number, metrics: TMetrics, metricsMin: TMetrics) => ThenableOrIteratorOrValue<any>;
}) => ThenableOrIteratorOrValue<any>;
export declare function searchBestErrorBuilder<TMetrics>({ onFound, consoleOnlyBestErrors, }: {
    onFound?: (reportMin: string) => ThenableOrIteratorOrValue<any>;
    consoleOnlyBestErrors?: boolean;
}): TSearchBestError<TMetrics>;
export declare type TOptionsPatternBuilder<TMetrics, TOptionsPattern> = (metrics: TMetrics, metricsMin: TMetrics) => ThenableOrIteratorOrValue<TOptionsPattern>;
export interface ITestOptions<TMetrics> {
    metrics: TMetrics;
    metricsMin: TMetrics;
}
export declare class RandomTest<TMetrics, TOptionsPattern extends IOptionsPatternBase & ITestOptions<TMetrics>, TOptions extends ITestOptions<TMetrics>> {
    private readonly _optionsPatternBuilder;
    private readonly _optionsGenerator;
    private readonly _testIterator;
    private readonly _searchBestError;
    private readonly _consoleThrowPredicate;
    private readonly _createMetrics;
    private readonly _compareMetrics;
    constructor(createMetrics: () => ThenableOrIteratorOrValue<TMetrics>, optionsPatternBuilder: TOptionsPatternBuilder<TMetrics, TOptionsPattern>, optionsGenerator: TOptionsGenerator<TOptionsPattern, TOptions>, { compareMetrics, consoleThrowPredicate, searchBestError, testIterator, }: {
        compareMetrics?: (metrics: TMetrics, metricsMin: TMetrics) => boolean;
        consoleThrowPredicate?: (this: TConsoleType, ...args: any[]) => boolean;
        searchBestError?: TSearchBestError<TMetrics>;
        testIterator: TTestIterator<TOptions>;
    });
    run({ stopPredicate, searchBestError, customSeed, metricsMin, }: ISearchBestErrorParams<TMetrics> & {
        searchBestError?: boolean;
    }): ThenableOrValue<any>;
}
export {};
