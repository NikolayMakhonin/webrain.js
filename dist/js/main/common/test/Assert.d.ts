import { TClass } from '../helpers/helpers';
import { DeepCloneEqual, IDeepEqualOptions } from './DeepCloneEqual';
export declare const AssertionError: any;
export declare class Assert {
    deepCloneEqual: DeepCloneEqual;
    constructor(deepCloneEqual?: DeepCloneEqual);
    fail(message?: string): void;
    ok(value: any, message?: string): void;
    notOk(value: any, message?: string): void;
    strictEqual(actual: any, expected: any, message?: string): void;
    notStrictEqual(actual: any, expected: any, message?: string): void;
    deepStrictEqual(actual: any, expected: any, message?: string, options?: IDeepEqualOptions): void;
    circularDeepStrictEqual(actual: any, expected: any, message?: string, options?: IDeepEqualOptions): void;
    equal(actual: any, expected: any, message?: string): void;
    notEqual(actual: any, expected: any, message?: string): void;
    equalCustom(actual: any, expected: any, check: any, message?: string): void;
    throws(fn: () => void, errType?: TClass<any> | Array<TClass<any>>, regExp?: RegExp, message?: string): void;
    throwAssertionError(actual: any, expected: any, message?: string): void;
}
export declare const assert: Assert;
