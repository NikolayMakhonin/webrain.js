import { ThenableIterator, ThenableOrIteratorOrValue, ThenableOrValue } from '../async/async';
import { Random } from '../random/Random';
import { TConsoleType } from './interceptConsole';
export declare type TTestIteration<TState> = (rnd: Random, state: TState) => ThenableOrIteratorOrValue<any>;
export declare type TTestAction<TState> = (rnd: Random, state: TState) => ThenableOrIteratorOrValue<any>;
interface IBeforeAfter<TState> {
    before?: TTestAction<TState>;
    after?: TTestAction<TState>;
}
interface ITestIterationAction<TState> extends IBeforeAfter<TState> {
    /** Probability weight */
    weight: number;
}
export declare function testIterationBuilder<TState>({ before, action, waitAsyncRandom, waitAsyncAll, after, }: IBeforeAfter<TState> & {
    action: ITestIterationAction<TState> & {
        func: TTestAction<TState>;
    };
    waitAsyncRandom?: ITestIterationAction<TState>;
    waitAsyncAll?: ITestIterationAction<TState>;
}): TTestIteration<TState>;
export declare type TTestIterator<TOptions> = (rnd: Random, options: TOptions) => ThenableOrIteratorOrValue<any>;
export declare type TCreateState<TOptions, TState> = (rnd: Random, options: TOptions) => ThenableOrIteratorOrValue<TState>;
export declare function testIteratorBuilder<TOptions, TState>(createState: TCreateState<TOptions, TState>, { before, stopPredicate, testIteration, after, consoleThrowPredicate, }: IBeforeAfter<TState> & {
    stopPredicate: (iterationNumber: number, timeStart: number, state: TState) => ThenableOrIteratorOrValue<boolean>;
    testIteration: TTestIteration<TState>;
    consoleThrowPredicate?: (this: TConsoleType, ...args: any[]) => boolean;
}): TTestIterator<TOptions>;
export declare type TTestOptionsGenerator<TOptionsPattern, TOptions> = (rnd: Random, pattern: TOptionsPattern) => ThenableOrIteratorOrValue<TOptions>;
export declare function test<TOptionsPattern, TOptions>(seed: number | null, optionsPattern: TOptionsPattern, optionsGenerator: TTestOptionsGenerator<TOptionsPattern, TOptions>, testIterator: TTestIterator<TOptions>): ThenableIterator<any>;
export interface ITestRunnerMetrics {
    iterationNumber: number;
    timeFromStart: number;
}
export declare type TTestRunnerStopPredicate<TTestRunnerMetrics extends ITestRunnerMetrics = ITestRunnerMetrics> = (testRunnerMetrics: TTestRunnerMetrics) => ThenableOrIteratorOrValue<boolean>;
export interface ISearchBestErrorMetrics extends ITestRunnerMetrics {
    iterationsFromLastError?: number;
    timeFromLastError?: number;
    iterationsFromMinError?: number;
    timeFromMinError?: number;
    iterationsFromEqualError?: number;
    timeFromEqualError?: number;
}
export interface ISearchBestErrorParams<TMetrics> {
    customSeed?: number;
    metricsMin?: TMetrics;
    stopPredicate: (searchBestErrorMetrics: ISearchBestErrorMetrics) => ThenableOrIteratorOrValue<boolean>;
}
export declare type TCreateMetrics<TMetrics> = (metrics: ISearchBestErrorMetrics) => ThenableOrIteratorOrValue<TMetrics>;
export declare type TCompareMetrics<TMetrics> = (metrics1: TMetrics, metrics2: TMetrics) => number;
export declare type TSearchBestError<TMetrics> = <TContext>(_this: TContext, { customSeed, metricsMin, stopPredicate, createMetrics, compareMetrics, func, }: ISearchBestErrorParams<TMetrics> & {
    createMetrics: TCreateMetrics<TMetrics>;
    compareMetrics: TCompareMetrics<TMetrics>;
    func: (this: TContext, seed: number, metrics: TMetrics, metricsMin: TMetrics) => ThenableOrIteratorOrValue<any>;
}) => ThenableOrIteratorOrValue<any>;
export declare function searchBestErrorBuilder<TMetrics>({ onFound, consoleOnlyBestErrors, }: {
    onFound?: (reportMin: string) => ThenableOrIteratorOrValue<any>;
    consoleOnlyBestErrors?: boolean;
}): TSearchBestError<TMetrics>;
export declare type TTestOptionsPatternBuilder<TMetrics, TOptionsPattern> = (metrics: TMetrics, metricsMin: TMetrics) => ThenableOrIteratorOrValue<TOptionsPattern>;
export interface ITestOptionsBase<TMetrics> {
    metrics: TMetrics;
    metricsMin: TMetrics;
}
export declare type TRandomTest<TMetrics> = ({ stopPredicate, searchBestError, customSeed, metricsMin, }: ISearchBestErrorParams<TMetrics> & {
    searchBestError?: boolean;
}) => ThenableOrValue<any>;
export declare function randomTestBuilder<TMetrics, TOptionsPattern extends ITestOptionsBase<TMetrics>, TOptions extends ITestOptionsBase<TMetrics>>(createMetrics: (metrics: ISearchBestErrorMetrics) => ThenableOrIteratorOrValue<TMetrics>, optionsPatternBuilder: TTestOptionsPatternBuilder<TMetrics, TOptionsPattern>, optionsGenerator: TTestOptionsGenerator<TOptionsPattern, TOptions>, { compareMetrics, searchBestError: _searchBestError, testIterator, }: {
    compareMetrics?: (metrics: TMetrics, metricsMin: TMetrics) => number;
    searchBestError?: TSearchBestError<TMetrics>;
    testIterator: TTestIterator<TOptions>;
}): TRandomTest<TMetrics>;
export {};
