import { IUnsubscribe } from '../../subjects/observable';
import { IRuleAction } from './rules';
export declare type ISubscribeObject<TObject, TChild> = (object: TObject, immediateSubscribe: boolean, subscribeItem: (item: TChild, debugPropertyName: string) => void, unsubscribeItem: (item: TChild, debugPropertyName: string) => void) => IUnsubscribe;
export interface IRuleSubscribe<TObject = any, TChild = any> extends IRuleAction {
    readonly subscribe: ISubscribeObject<TObject, TChild>;
    unsubscribers: IUnsubscribe[];
}
