import { Thenable } from '../async/async';
export declare const performanceNow: () => number;
export declare function delay(timeMilliseconds: any): Thenable;
/** Precision - 1 second */
export declare function fastNow(): number;
