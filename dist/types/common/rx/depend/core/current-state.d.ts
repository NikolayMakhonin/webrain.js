import { ThenableIterator } from '../../../async/async';
import { TCallStateAny } from './contracts';
export declare function getCurrentState(): TCallStateAny;
export declare function setCurrentState(state: TCallStateAny): void;
export declare function getForceLazy(): boolean;
export declare function setForceLazy(value: boolean | null): void;
export declare function withMode<TValue>(noSubscribe: boolean, forceLazy: boolean | null, func: () => ThenableIterator<TValue>): ThenableIterator<TValue>;
export declare function withMode<TValue>(noSubscribe: boolean, forceLazy: boolean | null, func: () => TValue): TValue;
export declare function noSubscribe<TValue>(func: () => ThenableIterator<TValue>): ThenableIterator<TValue>;
export declare function noSubscribe<TValue>(func: () => TValue): TValue;
export declare function forceLazy<TValue>(func: () => ThenableIterator<TValue>): ThenableIterator<TValue>;
export declare function forceLazy<TValue>(func: () => TValue): TValue;