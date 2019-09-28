import { IUnsubscribeOrVoid } from '../subjects/observable';
import { IChangeValue, ILastValue, IValueSubscriber, ValueChangeType, ValueKeyType } from './contracts/common';
export declare class ObjectSubscriber<TObject> implements IValueSubscriber<TObject> {
    private readonly _changeValue;
    private readonly _lastValue;
    private _unsubscribers;
    private _unsubscribersCount;
    private _subscribedValues;
    constructor(changeValue?: IChangeValue<TObject>, lastValue?: ILastValue<TObject>);
    private insertSubscribed;
    private removeSubscribed;
    change(key: any, oldValue: TObject, newValue: TObject, parent: any, changeType: ValueChangeType, keyType: ValueKeyType, propertiesPath: () => string, ruleDescription: string): IUnsubscribeOrVoid;
}
