export declare type IUnbind = () => void;
export interface IBinder {
    bind(): IUnbind;
}
export interface ISource<TValue> {
    getOneWayBinder(dest: TDest<TValue>): IBinder;
}
export declare type TDestFunc<TValue> = (value: TValue) => void;
export declare type TDest<TValue> = IDest<TValue> | TDestFunc<TValue>;
export interface IDest<TValue> {
    set(value: TValue): void;
}
export interface ISourceDest<TValue> {
    readonly source: ISource<TValue>;
    readonly dest: IDest<TValue> | TDestFunc<TValue>;
    getTwoWayBinder(sourceDest: ISourceDest<TValue>): IBinder;
}
export interface ISourceBuilder<TObject, TValue> {
    getSource(object: TObject): ISource<TValue>;
}
export interface IDestBuilder<TObject, TValue> {
    getDest(object: TObject): IDest<TValue> | TDestFunc<TValue>;
}
export interface ISourceDestBuilder<TObject, TValue> extends ISourceBuilder<TObject, TValue>, IDestBuilder<TObject, TValue> {
    getSourceDest(object: TObject): ISourceDest<TValue>;
}
