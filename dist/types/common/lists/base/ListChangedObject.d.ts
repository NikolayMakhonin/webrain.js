import { PropertyChangedObject } from '../../rx/object/PropertyChangedObject';
import { IHasSubscribersSubject } from '../../rx/subjects/hasSubscribers';
import { IListChangedEvent } from '../contracts/IListChanged';
export declare class ListChangedObject<T> extends PropertyChangedObject {
    protected _listChanged?: IHasSubscribersSubject<IListChangedEvent<T>>;
    readonly listChanged: IHasSubscribersSubject<IListChangedEvent<T>>;
    onListChanged(event: IListChangedEvent<T>): this;
    protected readonly _listChangedIfCanEmit: IHasSubscribersSubject<IListChangedEvent<T>>;
}
