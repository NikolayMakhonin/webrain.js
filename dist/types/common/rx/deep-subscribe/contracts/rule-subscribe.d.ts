import { IUnsubscribe, IUnsubscribeOrVoid } from '../../subjects/observable';
import { IPropertiesPath, ValueChangeType, ValueKeyType } from './common';
import { IRule, IRuleAction } from './rules';
export declare type IChangeItem<TItem> = (key: any, oldItem: TItem, newItem: TItem, changeType: ValueChangeType, keyType: ValueKeyType) => void;
export declare type ISubscribeObject<TObject, TChild> = (object: TObject, immediateSubscribe: boolean, changeItem: IChangeItem<TChild>, propertiesPath?: IPropertiesPath, rule?: IRule) => IUnsubscribeOrVoid;
export interface IRuleSubscribe<TObject = any, TChild = any> extends IRuleAction {
    readonly subscribe: ISubscribeObject<TObject, TChild>;
    unsubscribers: IUnsubscribe[];
    unsubscribersCount: number[];
}
