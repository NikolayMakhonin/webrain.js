import { IHasSubscribersSubject } from '../subjects/hasSubscribers';
export interface IPropertyChangedEvent {
    name?: string | number;
    oldValue?: any;
    newValue?: any;
}
export declare class PropertyChangedEvent<TValue> implements IPropertyChangedEvent {
    name: string;
    oldValue: TValue;
    private readonly _getNewValue;
    constructor(name: any, oldValue: TValue, getNewValue: () => TValue);
    get newValue(): TValue;
}
export declare type EventOrPropertyName = string | number | IPropertyChangedEvent;
export interface IPropertyChangedSubject extends IHasSubscribersSubject<IPropertyChangedEvent> {
    onPropertyChanged(...eventsOrPropertyNames: EventOrPropertyName[]): this;
}
export interface IPropertyChanged {
    readonly propertyChanged: IPropertyChangedSubject;
    readonly propertyChangedIfCanEmit: IPropertyChangedSubject;
}
export interface IPropertyChangedObject extends IPropertyChanged {
}
