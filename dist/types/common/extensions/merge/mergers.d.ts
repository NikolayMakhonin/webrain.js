import { TClass } from '../../helpers/helpers';
import { TypeMetaCollection } from '../TypeMeta';
import { IMergeable, IMergerVisitor, IMergeValue, IMergeVisitorOptions, IObjectMerger, ITypeMetaMerger, ITypeMetaMergerCollection, TMergeableClass } from './contracts';
declare enum ObjectStatus {
    Cloned = 1,
    Merged = 2
}
export declare class MergerVisitor implements IMergerVisitor {
    readonly getMeta: (type: TClass<any>) => ITypeMetaMerger<any, any>;
    statuses: ObjectStatus[];
    constructor(getMeta: (type: TClass<any>) => ITypeMetaMerger<any, any>);
    getStatus(object: any): ObjectStatus;
    setStatus(object: any, status: ObjectStatus): any;
    getNextMerge(preferCloneOlder: boolean, preferCloneNewer: boolean, refsBase: any[], refsOlder: any[], refsNewer: any[], options: IMergeVisitorOptions<any, any>): IMergeValue;
    merge<TTarget = any, TSource = any>(base: TTarget, older: TTarget | TSource, newer: TTarget | TSource, set?: (value: TTarget) => void, preferCloneOlder?: boolean, preferCloneNewer?: boolean, options?: IMergeVisitorOptions<TTarget, TSource>, refsBase?: any[], refsOlder?: any[], refsNewer?: any[]): boolean;
}
export declare class TypeMetaMergerCollection extends TypeMetaCollection<ITypeMetaMerger<any, any>> implements ITypeMetaMergerCollection {
    customMeta: (type: any) => ITypeMetaMerger<any, any>;
    constructor({ proto, customMeta, }?: {
        proto?: ITypeMetaMergerCollection;
        customMeta?: (type: any) => ITypeMetaMerger<any, any>;
    });
    getMeta(type: TClass<any>): ITypeMetaMerger<any, any>;
    static default: TypeMetaMergerCollection;
    private static makeTypeMetaMerger;
    putMergeableType<TTarget extends IMergeable<TTarget, TSource>, TSource = any>(type: TMergeableClass<TTarget, TSource>, meta?: ITypeMetaMerger<TTarget, TSource>): ITypeMetaMerger<TTarget, TSource>;
}
export declare function registerMergeable<TTarget extends IMergeable<TTarget, TSource>, TSource = any>(type: TMergeableClass<TTarget, TSource>, meta?: ITypeMetaMerger<TTarget, TSource>): void;
export declare function registerMerger<TTarget = any, TSource = any>(type: TClass<TTarget>, meta: ITypeMetaMerger<TTarget, TSource>): void;
export declare function registerMergerPrimitive<TTarget = any, TSource = any>(type: TClass<TTarget>, meta?: ITypeMetaMerger<TTarget, TSource>): void;
export declare class ObjectMerger implements IObjectMerger {
    typeMeta: ITypeMetaMergerCollection;
    constructor(typeMeta?: ITypeMetaMergerCollection);
    static default: ObjectMerger;
    static observableOnly: ObjectMerger;
    merge<TTarget = any, TSource = any>(base: TTarget, older: TTarget | TSource, newer: TTarget | TSource, set?: (value: TTarget) => void, preferCloneOlder?: boolean, preferCloneNewer?: boolean, options?: IMergeVisitorOptions<TTarget, TSource>): boolean;
}
export {};
