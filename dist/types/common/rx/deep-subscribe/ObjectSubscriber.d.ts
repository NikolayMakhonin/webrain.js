import { IUnsubscribeOrVoid } from '../subjects/observable';
import { ChangeValue, ILastValue, ISubscribeValue, IUnsubscribeValue, IValueSubscriber, ValueChangeType, ValueKeyType } from './contracts/common';
export declare class ObjectSubscriber<TObject> implements IValueSubscriber<TObject> {
    private readonly _change;
    private readonly _subscribe;
    private readonly _unsubscribe;
    private readonly _lastValue;
    private _unsubscribers;
    private _unsubscribersCount;
    private _subscribedValues;
    constructor(subscribe?: ISubscribeValue<TObject>, unsubscribe?: IUnsubscribeValue<TObject>, lastValue?: ILastValue<TObject>, change?: ChangeValue<TObject>);
    private insertSubscribed;
    private removeSubscribed;
    change(key: any, oldItem: TObject, newItem: TObject, parent: any, changeType: ValueChangeType, keyType: ValueKeyType, propertiesPath: () => string, ruleDescription: string): IUnsubscribeOrVoid;
    private subscribe;
    private unsubscribe;
}
