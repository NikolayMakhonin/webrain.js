import { IBinder, IDestBuilder, ISource, ISourceBuilder, ISourceDest, ISourceDestBuilder, TDest } from './contracts';
export declare class SourceDest<TValue> implements ISourceDest<TValue> {
    private readonly _source;
    private readonly _dest;
    constructor(source: ISource<TValue>, dest: TDest<TValue>);
    getOneWayBinder(dest: TDest<TValue>): IBinder;
    getTwoWayBinder(sourceDest: ISourceDest<TValue>): IBinder;
    set(value: TValue): void;
}
export declare class SourceDestBuilder<TObject, TValue> implements ISourceDestBuilder<TObject, TValue> {
    private readonly _sourceBuilder;
    private readonly _destBuilder;
    constructor(sourceBuilder: ISourceBuilder<TObject, TValue>, destBuilder: IDestBuilder<TObject, TValue>);
    get(object: TObject): ISourceDest<TValue>;
}
