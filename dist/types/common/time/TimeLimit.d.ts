import { ThenableOrIteratorOrValue } from '../async/async';
export interface ITimeLimitBase {
    getWaitTime(): number;
    wait<TResult>(complete?: () => ThenableOrIteratorOrValue<TResult>): ThenableOrIteratorOrValue<TResult>;
    run<TResult>(func?: () => ThenableOrIteratorOrValue<TResult>): ThenableOrIteratorOrValue<TResult>;
}
export interface ITimeLimit extends ITimeLimitBase {
    id: number;
}
export declare class TimeLimit implements ITimeLimit {
    count: number;
    time: number;
    readonly id: number;
    private _history;
    private _queue;
    private _countActive;
    private _startTime;
    constructor(count: number, time: number);
    getWaitTime(): number;
    wait<TResult>(complete?: () => ThenableOrIteratorOrValue<TResult>): ThenableOrIteratorOrValue<TResult>;
    runQueue(): void;
    run<TResult>(func?: () => ThenableOrIteratorOrValue<TResult>): ThenableOrIteratorOrValue<TResult>;
    get debug(): {
        now: number;
        count: number;
        time: number;
        history: number[];
        queue: number;
        countActive: number;
    };
}
