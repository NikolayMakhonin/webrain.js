import { IPropertyChangedObject } from '../../rx/object/IPropertyChanged';
import { IHasSubscribersSubject } from '../../rx/subjects/hasSubscribers';
export declare enum ListChangedType {
    /**
     * Removed @items from @index and shift [shiftIndex .. size) -> index
     */
    Removed = 0,
    /**
     * Shift [index .. size) -> shiftIndex and added @items to @index
     * is set properties: newIndex, newItems
     */
    Added = 1,
    /**
     * is set properties: index == newIndex, oldItems[1], newItems[1]
     */
    Set = 2,
    /**
     * properties is not set
     */
    Resorted = 3,
    /**
     * Moved @moveSize items from index to @moveIndex
     */
    Moved = 4
}
export interface IListChangedEvent<T> {
    readonly type: ListChangedType;
    readonly index?: number;
    readonly shiftIndex?: number;
    readonly oldItems?: T[];
    readonly newItems?: T[];
    readonly moveIndex?: number;
    readonly moveSize?: number;
}
export interface IListChanged<T> {
    readonly listChanged: IHasSubscribersSubject<IListChangedEvent<T>>;
}
export interface IListChangedObject<T> extends IListChanged<T>, IPropertyChangedObject {
    readonly listChanged: IHasSubscribersSubject<IListChangedEvent<T>>;
    onListChanged(event: IListChangedEvent<T>): this;
}
