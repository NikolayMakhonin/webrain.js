import { ThenableOrIteratorOrValue } from '../../../async/async';
import { INextPathGetSet, Path, PathGetSet, TNextPath } from '../../object/properties/path/builder';
import { IBinder, IDestBuilder, ISource, ISourceBuilder, ISourceDestBuilder, TDest } from './contracts';
declare class SourcePath<TValue> implements ISource<TValue> {
    private readonly _getValue;
    constructor(getValue: () => ThenableOrIteratorOrValue<TValue>);
    getOneWayBinder(dest: TDest<TValue>): IBinder;
}
export declare const sourcePath: <TValue>(this: unknown, getValue: () => ThenableOrIteratorOrValue<TValue>) => SourcePath<TValue>;
declare type TSourcePathBuilder<TObject> = <TValue>(pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>) => ISourceBuilder<TObject, TValue>;
export declare function sourcePathBuilder<TObject>(): TSourcePathBuilder<TObject>;
export declare function sourcePathBuilder<TObject, TValue>(pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>): ISourceBuilder<TObject, TValue>;
declare type TDestPathBuilder<TObject> = <TValue>(pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>) => IDestBuilder<TObject, TValue>;
export declare function destPathBuilder<TObject>(): TDestPathBuilder<TObject>;
export declare function destPathBuilder<TObject, TValue>(pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>): IDestBuilder<TObject, TValue>;
interface TSourceDestPathBuilder<TObject> {
    <TValue>(pathGetSet: PathGetSet<TObject, TValue>): ISourceDestBuilder<TObject, TValue>;
    <TValue>(pathGet: Path<TObject, TValue>, pathSet: Path<TObject, TValue>): ISourceDestBuilder<TObject, TValue>;
    <TCommonValue = TObject, TValue = TCommonValue>(common: TNextPath<TObject, TObject, TCommonValue>, getSet?: INextPathGetSet<TObject, TCommonValue, TValue>): ISourceDestBuilder<TObject, TValue>;
}
export declare function sourceDestPathBuilder<TObject>(): TSourceDestPathBuilder<TObject>;
export declare function sourceDestPathBuilder<TObject, TValue>(pathGetSet: PathGetSet<TObject, TValue>): ISourceDestBuilder<TObject, TValue>;
export declare function sourceDestPathBuilder<TObject, TValue>(pathGet: Path<TObject, TValue>, pathSet: Path<TObject, TValue>): ISourceDestBuilder<TObject, TValue>;
export declare function sourceDestPathBuilder<TObject, TCommonValue = TObject, TValue = TCommonValue>(common: TNextPath<TObject, TObject, TCommonValue>, getSet?: INextPathGetSet<TObject, TCommonValue, TValue>): ISourceDestBuilder<TObject, TValue>;
export {};
