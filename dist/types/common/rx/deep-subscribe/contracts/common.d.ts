import { IUnsubscribe } from '../../subjects/observable';
export declare type ISubscribeValue<TValue> = (value: TValue, parent: any, propertyName: string) => IUnsubscribe;
