import { ThenableOrIteratorOrValue } from '../../../async/async';
import { TNextPath } from '../../object/properties/path/builder';
import { IBinder, IDestBuilder, ISource, ISourceBuilder, TDest, TDestFunc } from './contracts';
export declare class SourcePath<TValue> implements ISource<TValue> {
    private readonly _getValue;
    constructor(getValue: () => ThenableOrIteratorOrValue<TValue>);
    getOneWayBinder(dest: TDest<TValue>): IBinder;
}
export declare class SourcePathBuilder<TObject, TValue> implements ISourceBuilder<TObject, TValue> {
    private readonly _path;
    constructor(pathBuilder: TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>);
    get(object: TObject): ISource<TValue>;
}
export declare class DestPathBuilder<TObject, TValue> implements IDestBuilder<TObject, TValue> {
    private readonly _path;
    constructor(pathBuilder: TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>);
    get(object: TObject): TDestFunc<TValue>;
}
