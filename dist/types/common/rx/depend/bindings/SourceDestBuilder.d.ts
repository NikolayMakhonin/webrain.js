import { IBinder, IDest, IDestBuilder, ISource, ISourceBuilder, ISourceDest, ISourceDestBuilder, TDest, TDestFunc } from './contracts';
declare class SourceDest<TValue> implements ISourceDest<TValue> {
    readonly source: ISource<TValue>;
    readonly dest: IDest<TValue> | TDestFunc<TValue>;
    constructor(source: ISource<TValue>, dest: TDest<TValue>);
    getOneWayBinder(dest: TDest<TValue>): IBinder;
    getTwoWayBinder(sourceDest: ISourceDest<TValue>): IBinder;
}
export declare const sourceDest: <TValue>(this: unknown, source: ISource<TValue>, dest: TDest<TValue>) => SourceDest<TValue>;
declare type TSourceDestBuilder<TObject> = <TValue>(sourceBuilder: ISourceBuilder<TObject, TValue>, destBuilder: IDestBuilder<TObject, TValue>) => ISourceDestBuilder<TObject, TValue>;
export declare function sourceDestBuilder<TObject>(): TSourceDestBuilder<TObject>;
export declare function sourceDestBuilder<TObject, TValue>(sourceBuilder: ISourceBuilder<TObject, TValue>, destBuilder: IDestBuilder<TObject, TValue>): ISourceDestBuilder<TObject, TValue>;
export {};
