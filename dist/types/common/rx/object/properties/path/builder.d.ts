import { AsyncPropertyValueOf, IPathNode, TGetPropertyValueResult3, TGetValue1, TGetValue2, TPathNodes, TSetValue1, TSetValue2 } from './constracts';
declare type TPathOrArrayOrNode<TValue, TNextValue> = Path<TValue, TNextValue> | Array<IPathNode<TValue, TNextValue>> | IPathNode<TValue, TNextValue>;
export declare function pathsConcat<V1, V2, V3>(...paths: [TPathOrArrayOrNode<V1, V2>, TPathOrArrayOrNode<V2, V3>]): Path<V1, V3>;
export declare function pathsConcat<V1, V2, V3, V4>(...paths: [TPathOrArrayOrNode<V1, V2>, TPathOrArrayOrNode<V2, V3>, TPathOrArrayOrNode<V3, V4>]): Path<V1, V4>;
export declare function pathsConcat<V1, V2, V3, V4, V5>(...paths: [TPathOrArrayOrNode<V1, V2>, TPathOrArrayOrNode<V2, V3>, TPathOrArrayOrNode<V3, V4>, TPathOrArrayOrNode<V4, V5>]): Path<V1, V5>;
export declare function pathsConcat(...paths: Array<TPathOrArrayOrNode<any, any>>): Path<any, any>;
export declare class Path<TObject, TValue = TObject> {
    readonly nodes: TPathNodes<any, any>;
    readonly canGet: boolean;
    readonly canSet: boolean;
    constructor(nodes?: TPathNodes<any, any>, canGet?: boolean, canSet?: boolean);
    get(object: TObject): TGetPropertyValueResult3<TValue>;
    set(object: TObject, newValue: TValue): TGetPropertyValueResult3<void>;
    init(): Path<TObject, AsyncPropertyValueOf<TValue>>;
    fv<TNextValue>(getValue: TGetValue1<TValue, TNextValue>, setValue?: TSetValue1<TValue, TNextValue>): Path<TObject, TNextValue>;
    f<TNextValue>(getValue: TGetValue2<TValue, TNextValue>, setValue?: TSetValue2<TValue, TNextValue>): Path<TObject, TNextValue>;
    append<TNextValue>(getValue: TGetValue1<TValue, TNextValue>, setValue: TSetValue1<TValue, TNextValue>, isValueProperty: true): Path<TObject, TNextValue>;
    append<TNextValue>(getValue: TGetValue2<TValue, TNextValue>, setValue?: TSetValue2<TValue, TNextValue>, isValueProperty?: false): Path<TObject, TNextValue>;
    concat<TNextValue>(nextPath: TPathOrArrayOrNode<TValue, TNextValue>): Path<TObject, TNextValue>;
    clone(): Path<TObject, TValue>;
    static readonly concat: typeof pathsConcat;
}
export declare class PathGetSet<TObject, TValue> {
    readonly pathGet: Path<TObject, TValue>;
    readonly pathSet: Path<TObject, TValue>;
    constructor(pathGet?: Path<TObject, TValue>, pathSet?: Path<TObject, TValue>);
    get canGet(): boolean;
    get canSet(): boolean;
    get(object: TObject): TGetPropertyValueResult3<TValue>;
    set(object: TObject, newValue: TValue): TGetPropertyValueResult3<void>;
    static concat<V1, V2, V3>(path: TPathOrArrayOrNode<V1, V2>, pathGetSet: PathGetSet<V2, V3>): PathGetSet<V1, V3>;
    static readonly build: typeof pathGetSetBuild;
}
export declare type TNextPath<TObject, TValue, TNextValue> = (path: Path<TObject, TValue>) => Path<TObject, TNextValue>;
export interface INextPathGet<TObject, TValue, TNextValue> {
    get?: TNextPath<TObject, TValue, TNextValue>;
}
export interface INextPathSet<TObject, TValue, TNextValue> {
    set?: TNextPath<TObject, TValue, TNextValue>;
}
export interface INextPathGetSet<TObject, TValue, TNextValue> extends INextPathGet<TObject, TValue, TNextValue>, INextPathSet<TObject, TValue, TNextValue> {
}
export declare function pathGetSetBuild<TObject, TCommonValue = TObject, TValue = TCommonValue>(common: TNextPath<TObject, TObject, TCommonValue>, getSet?: INextPathGetSet<TObject, TCommonValue, TValue>): PathGetSet<TObject, TValue>;
export {};
