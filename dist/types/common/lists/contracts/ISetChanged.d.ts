import { IPropertyChangedObject } from '../../rx/object/IPropertyChanged';
import { IHasSubscribersSubject } from '../../rx/subjects/hasSubscribers';
export declare enum SetChangedType {
    /**
     * is set properties: oldItem
     */
    Removed = 0,
    /**
     * is set properties: newItem
     */
    Added = 1
}
export interface ISetChangedEvent<T> {
    readonly type: SetChangedType;
    readonly oldItems?: T[];
    readonly newItems?: T[];
}
export interface ISetChanged<T> {
    readonly setChanged: IHasSubscribersSubject<ISetChangedEvent<T>>;
}
export interface ISetChangedObject<T> extends ISetChanged<T>, IPropertyChangedObject {
    readonly setChanged: IHasSubscribersSubject<ISetChangedEvent<T>>;
    onSetChanged(event: ISetChangedEvent<T>): this;
}
export interface IObservableSet<T> extends ISetChanged<T>, Set<T> {
}
