import { IUnsubscribeOrVoid } from '../subjects/observable';
import { IChangeValue, ILastValue, IPropertiesPath, IValueSubscriber, ValueChangeType, ValueKeyType } from './contracts/common';
import { IRule } from './contracts/rules';
export declare class ObjectSubscriber<TObject> implements IValueSubscriber<TObject> {
    readonly debugTarget: any;
    private readonly _changeValue;
    private readonly _lastValue;
    private _unsubscribers;
    private _unsubscribersCount;
    private _subscribedValues;
    constructor(changeValue?: IChangeValue<TObject>, lastValue?: ILastValue<TObject>, debugTarget?: any);
    private insertSubscribed;
    private removeSubscribed;
    change(key: any, oldValue: TObject, newValue: TObject, parent: any, changeType: ValueChangeType, keyType: ValueKeyType, propertiesPath: IPropertiesPath, rule: IRule): IUnsubscribeOrVoid;
}
