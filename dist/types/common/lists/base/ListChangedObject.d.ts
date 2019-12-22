import { PropertyChangedObject } from '../../rx/object/PropertyChangedObject';
import { IHasSubscribersSubject } from '../../rx/subjects/hasSubscribers';
import { IListChangedEvent } from '../contracts/IListChanged';
export declare class ListChangedObject<T> extends PropertyChangedObject {
    protected _listChanged?: IHasSubscribersSubject<IListChangedEvent<T>>;
    get listChanged(): IHasSubscribersSubject<IListChangedEvent<T>>;
    onListChanged(event: IListChangedEvent<T>): this;
    protected get _listChangedIfCanEmit(): IHasSubscribersSubject<IListChangedEvent<T>>;
}
