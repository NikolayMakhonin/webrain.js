import {IUnsubscribe} from '../../subjects/observable'

export type ISubscribeValue<TValue> = (value: TValue, parent: any, propertyName: string) => IUnsubscribe
