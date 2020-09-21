import { ThenableIterator, ThenableOrIteratorOrValue } from '../async/async';
export declare type TConsoleType = 'debug' | 'info' | 'trace' | 'log' | 'warn' | 'error';
export declare function interceptConsole(handler: (this: {
    type: TConsoleType;
    console: typeof console;
}, ...args: any[]) => boolean | void): () => void;
export declare function throwOnConsoleError<TContext, TValue>(_this: TContext, throwPredicate: (this: TConsoleType, ...args: any[]) => boolean, func: (this: TContext) => ThenableOrIteratorOrValue<TValue>): ThenableIterator<TValue>;
