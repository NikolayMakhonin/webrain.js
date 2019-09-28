import { IUnsubscribe, IUnsubscribeOrVoid } from '../../subjects/observable';
import { ValueChangeType, ValueKeyType } from './common';
import { IRuleAction } from './rules';
export declare type IChangeItem<TItem> = (key: any, oldItem: TItem, newItem: TItem, changeType: ValueChangeType, keyType: ValueKeyType) => void;
export declare type ISubscribeObject<TObject, TChild> = (object: TObject, immediateSubscribe: boolean, changeItem: IChangeItem<TChild>) => IUnsubscribeOrVoid;
export interface IRuleSubscribe<TObject = any, TChild = any> extends IRuleAction {
    readonly subscribe: ISubscribeObject<TObject, TChild>;
    unsubscribers: IUnsubscribe[];
    unsubscribersCount: number[];
}
