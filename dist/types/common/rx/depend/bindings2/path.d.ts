import { INextPathGetSet, Path, PathGetSet, TNextPath } from '../../object/properties/path/builder';
import { IGetSetValue, TGetValue, TSetValue } from './contracts';
declare type TCreatePathGetValue<TObject> = <TValue>(pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, TValue>) => TGetValue<TObject, TValue>;
export declare function createPathGetValue<TObject>(): TCreatePathGetValue<TObject>;
export declare function createPathGetValue<TObject, TValue>(pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, TValue>): TGetValue<TObject, TValue>;
declare type TCreatePathSetValue<TObject> = <TValue>(pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, TValue>) => TSetValue<TObject, TValue>;
export declare function createPathSetValue<TObject>(): TCreatePathSetValue<TObject>;
export declare function createPathSetValue<TObject, TValue>(pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, TValue>): TSetValue<TObject, TValue>;
interface TCreatePathGetSetValue<TObject> {
    <TValue>(pathGetSet: PathGetSet<TObject, TValue>): IGetSetValue<TObject, TValue>;
    <TValue>(pathGet: Path<TObject, TValue>, pathSet: Path<TObject, TValue>): IGetSetValue<TObject, TValue>;
    <TCommonValue = TObject, TValue = TCommonValue>(common: TNextPath<TObject, TObject, TCommonValue>, getSet?: INextPathGetSet<TObject, TCommonValue, TValue>): IGetSetValue<TObject, TValue>;
}
export declare function createPathGetSetValue<TObject>(): TCreatePathGetSetValue<TObject>;
export declare function createPathGetSetValue<TObject, TValue>(pathGetSet: PathGetSet<TObject, TValue>): IGetSetValue<TObject, TValue>;
export declare function createPathGetSetValue<TObject, TValue>(pathGet: Path<TObject, TValue>, pathSet: Path<TObject, TValue>): IGetSetValue<TObject, TValue>;
export declare function createPathGetSetValue<TObject, TCommonValue = TObject, TValue = TCommonValue>(common: TNextPath<TObject, TObject, TCommonValue>, getSet?: INextPathGetSet<TObject, TCommonValue, TValue>): IGetSetValue<TObject, TValue>;
export {};
