import { Func } from '../../helpers/typescript';
import { IUnsubscribe } from '../subjects/observable';
import { TInnerValue } from './core/contracts';
export declare function dependWait<TThisOuter, TArgs extends any[], TResultInner>(func: Func<TThisOuter, TArgs, TResultInner>, condition?: (value: TInnerValue<TResultInner>) => boolean, timeout?: number, isLazy?: boolean): Func<unknown, any[], any>;
export declare function autoCalc<TThisOuter, TArgs extends any[], TResultInner>(func: Func<TThisOuter, TArgs, TResultInner>, dontLogErrors?: boolean): Func<TThisOuter, TArgs, IUnsubscribe>;
export declare function autoCalcConnect<TObject, TConnector>(object: TObject, connectorFactory: (source: TObject, name?: string) => TConnector, func: Func<TConnector, [], any>, dontLogErrors?: boolean): Func<never, [], IUnsubscribe>;
export declare function dependWrapThis<TThis, TWrapThis, TArgs extends any[], TResult>(wrapThis: (_this: TThis) => TWrapThis, func: Func<TWrapThis, TArgs, TResult>): (_this: TThis) => Func<never, TArgs, TResult>;
