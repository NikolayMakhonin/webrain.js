import { ThenableIterator } from '../../../async/async';
import { TCallStateAny } from './contracts';
export declare function getCurrentState(): TCallStateAny;
export declare function setCurrentState(state: TCallStateAny): void;
export declare function noSubscribe<TValue>(func: () => ThenableIterator<TValue>): ThenableIterator<TValue>;
export declare function noSubscribe<TValue>(func: () => TValue): TValue;
