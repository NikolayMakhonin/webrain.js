import {IHasSubscribersSubject} from '../../rx/subjects/hasSubscribers'

export interface IPropertyChangedEvent {
	name?: string | number,
	oldValue?: any,
	newValue?: any,
}

export type EventOrPropertyName = string | number | IPropertyChangedEvent
export type EventsOrPropertyNames = EventOrPropertyName | Array<EventOrPropertyName | any>

export interface IPropertyChanged {
	readonly propertyChanged: IHasSubscribersSubject<IPropertyChangedEvent>
}

export interface IPropertyChangedObject extends IPropertyChanged {
	readonly propertyChanged: IHasSubscribersSubject<IPropertyChangedEvent>
	onPropertyChanged(eventsOrPropertyNames: EventsOrPropertyNames): this
}
