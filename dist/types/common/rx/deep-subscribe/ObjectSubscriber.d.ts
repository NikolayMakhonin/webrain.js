import { IUnsubscribe } from '../subjects/observable';
import { ILastValue, ISubscribeValue, IUnsubscribeValue, IValueSubscriber } from './contracts/common';
export declare class ObjectSubscriber<TObject> implements IValueSubscriber<TObject> {
    private readonly _subscribe;
    private readonly _unsubscribe;
    private readonly _lastValue;
    private _unsubscribers;
    private _unsubscribersCount;
    private _subscribedValues;
    constructor(subscribe?: ISubscribeValue<TObject>, unsubscribe?: IUnsubscribeValue<TObject>, lastValue?: ILastValue<TObject>);
    private insertSubscribed;
    private removeSubscribed;
    subscribe(value: TObject, parent: any, propertyName: string, propertiesPath: () => string, ruleDescription: string): IUnsubscribe;
    unsubscribe(value: TObject, parent: any, propertyName: string): void;
}
