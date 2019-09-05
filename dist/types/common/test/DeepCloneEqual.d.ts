export interface IDeepCloneEqualOptions {
    circular?: boolean;
    customIsPrimitive?: (o: any) => boolean;
}
export interface IDeepCloneOptions extends IDeepCloneEqualOptions {
    customClone?: (value: any, setInstance: (instance: any) => void, cloneNested: (nested: any) => any) => any;
}
export interface IDeepEqualOptions extends IDeepCloneEqualOptions {
    noCrossReferences?: boolean;
    equalTypes?: boolean;
    equalInnerReferences?: boolean;
    equalMapSetOrder?: boolean;
    strictEqualFunctions?: boolean;
    customEqual?: (o1: any, o2: any, equal: (o1: any, o2: any) => boolean) => boolean | null;
}
export declare function isPrimitiveDefault(value: any): boolean;
export declare class DeepCloneEqual {
    commonOptions?: IDeepCloneEqualOptions;
    cloneOptions?: IDeepCloneOptions;
    equalOptions?: IDeepEqualOptions;
    constructor({ commonOptions, cloneOptions, equalOptions, }?: {
        commonOptions?: IDeepCloneEqualOptions;
        cloneOptions?: IDeepCloneOptions;
        equalOptions?: IDeepEqualOptions;
    });
    isPrimitive(value: any): boolean;
    clone<T extends any>(value: T, options?: IDeepCloneOptions, cache?: any[]): T;
    equal(obj1: any, obj2: any, options?: IDeepEqualOptions): boolean;
}
