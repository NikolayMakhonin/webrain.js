import { PropertyChangedObject } from '../../rx/object/PropertyChangedObject';
import { IHasSubscribersSubject } from '../../rx/subjects/hasSubscribers';
import { IMapChangedEvent, IMapChangedObject } from '../contracts/IMapChanged';
export declare class MapChangedObject<K, V> extends PropertyChangedObject implements IMapChangedObject<K, V> {
    protected _mapChanged?: IHasSubscribersSubject<IMapChangedEvent<K, V>>;
    readonly mapChanged: IHasSubscribersSubject<IMapChangedEvent<K, V>>;
    onMapChanged(event: IMapChangedEvent<K, V>): this;
    protected readonly _mapChangedIfCanEmit: IHasSubscribersSubject<IMapChangedEvent<K, V>>;
}
