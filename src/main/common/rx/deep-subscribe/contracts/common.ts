import {IUnsubscribe} from '../../subjects/subject'

export type ISubscribeValue<TValue> = (value: TValue, parent: any, propertyName: string) => IUnsubscribe
