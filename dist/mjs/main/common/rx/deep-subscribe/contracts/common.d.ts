import { IUnsubscribe } from '../../subjects/subject';
export declare type ISubscribeValue<TValue> = (value: TValue, parent: any, propertyName: string) => IUnsubscribe;
