import { PropertyChangedObject } from '../../rx/object/PropertyChangedObject';
import { IHasSubscribersSubject } from '../../rx/subjects/hasSubscribers';
import { ISetChangedEvent, ISetChangedObject } from '../contracts/ISetChanged';
export declare class SetChangedObject<T> extends PropertyChangedObject implements ISetChangedObject<T> {
    protected _setChanged?: IHasSubscribersSubject<ISetChangedEvent<T>>;
    readonly setChanged: IHasSubscribersSubject<ISetChangedEvent<T>>;
    onSetChanged(event: ISetChangedEvent<T>): this;
    protected readonly _setChangedIfCanEmit: IHasSubscribersSubject<ISetChangedEvent<T>>;
}
