import { ValueKeyType } from './common';
import { IRuleAction } from './rules';
export declare type IChangeItem<TObject, TItem> = (item: TItem, object: TObject, key: any, keyType: ValueKeyType) => void;
export declare type ISubscribeObject<TObject, TChild> = (object: TObject, changeItem: IChangeItem<TObject, TChild>) => any;
export interface IRuleSubscribe<TObject = any, TChild = any> extends IRuleAction {
    readonly subscribe: ISubscribeObject<TObject, TChild>;
}
