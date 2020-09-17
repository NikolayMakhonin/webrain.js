import { ICallState } from '../../../depend/core/contracts';
import { ISubscriber, IUnsubscribe } from '../../../subjects/observable';
import { IRuleBuilder } from './builder/contracts/IRuleBuilder';
import { IRule } from './builder/contracts/rules';
export declare type TSubscribeFunc<TObject, TValue> = (object?: TObject | undefined | null, subscriber?: ISubscriber<ICallState<TObject, [IRule], TValue>>) => IUnsubscribe;
export declare function deepSubscriber<TObject, TValue>({ object, rule, build, subscriber, emitLastValue, }: {
    object?: TObject;
    rule?: IRule;
    build?: (builder: IRuleBuilder<TObject>) => IRuleBuilder<TValue>;
    subscriber?: ISubscriber<ICallState<TObject, [IRule], TValue>>;
    emitLastValue?: boolean;
}): TSubscribeFunc<TObject, TValue>;
