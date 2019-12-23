import { ThenableOrIteratorOrValue } from '../async/async';
import { ITimeLimit, ITimeLimitBase } from './TimeLimit';
export interface ITimeLimits extends ITimeLimitBase {
    getLeafTimeLimits(result?: {
        [key: string]: ITimeLimitOrLimits;
    }): ITimeLimitOrLimits[];
}
export declare type ITimeLimitOrLimits = ITimeLimits | ITimeLimit;
export declare class TimeLimits implements ITimeLimits {
    timeLimits: ITimeLimitOrLimits[];
    constructor(...timeLimits: ITimeLimitOrLimits[]);
    getWaitTime(): number;
    wait<TResult>(complete?: () => ThenableOrIteratorOrValue<TResult>): ThenableOrIteratorOrValue<TResult>;
    run<TResult>(func?: () => ThenableOrIteratorOrValue<TResult>): ThenableOrIteratorOrValue<TResult>;
    get debug(): any[];
    getLeafTimeLimits(result?: {
        [key: string]: ITimeLimitOrLimits;
    }): ITimeLimitOrLimits[];
}
