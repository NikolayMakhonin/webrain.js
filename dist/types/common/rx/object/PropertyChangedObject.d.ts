import { HasSubscribersSubject } from '../subjects/hasSubscribers';
import { EventOrPropertyName, IPropertyChangedEvent, IPropertyChangedObject, IPropertyChangedSubject } from './IPropertyChanged';
export declare class PropertyChangedSubject extends HasSubscribersSubject<IPropertyChangedEvent> implements IPropertyChangedSubject {
    private readonly _object;
    constructor(object: any);
    onPropertyChanged(...eventsOrPropertyNames: EventOrPropertyName[]): this;
}
export declare class PropertyChangedObject implements IPropertyChangedObject {
    constructor();
    get propertyChanged(): IPropertyChangedSubject;
    get propertyChangedIfCanEmit(): IPropertyChangedSubject;
}
