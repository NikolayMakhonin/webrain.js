import { HasSubscribersSubject } from '../subjects/hasSubscribers';
import { IUnsubscribe } from '../subjects/observable';
import { EventOrPropertyName, IPropertyChangedEvent, IPropertyChangedObject, IPropertyChangedSubject } from './IPropertyChanged';
export declare class PropertyChangedSubject extends HasSubscribersSubject<IPropertyChangedEvent> implements IPropertyChangedSubject {
    private readonly _object;
    constructor(object: any);
    onPropertyChanged(...eventsOrPropertyNames: EventOrPropertyName[]): this;
}
export declare class PropertyChangedObject implements IPropertyChangedObject {
    /** @internal */
    readonly __meta: {
        unsubscribers: {
            [key: string]: IUnsubscribe;
            [key: number]: IUnsubscribe;
        };
        propertyChanged?: IPropertyChangedSubject;
        propertyChangedDisabled?: boolean;
    };
    constructor();
    /** @internal */
    _setUnsubscriber(propertyName: string | number, unsubscribe: IUnsubscribe): void;
    get propertyChanged(): IPropertyChangedSubject;
    get propertyChangedIfCanEmit(): IPropertyChangedSubject;
}
