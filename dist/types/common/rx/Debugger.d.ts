import { IPropertiesPath, ValueChangeType, ValueKeyType } from './deep-subscribe/contracts/common';
import { ISubscribedValue } from './deep-subscribe/contracts/deep-subscribe';
import { IRule } from './deep-subscribe/contracts/rules';
import { ObservableClass } from './object/ObservableClass';
import { ICalcProperty } from './object/properties/contracts';
import { IObservable } from './subjects/observable';
export interface IConnectorChangedEvent {
    target: ObservableClass;
    targetKey: string | number;
    value: any;
    parent: any;
    key: any;
    keyType: ValueKeyType;
}
export interface IDependencyChangedEvent {
    target: ICalcProperty<any>;
    value: any;
    parent: any;
    key: any;
    keyType: ValueKeyType;
}
export interface IInvalidatedEvent {
    target: ICalcProperty<any>;
    value: any;
}
export interface ICalculatedEvent {
    target: ICalcProperty<any>;
    newValue: any;
    oldValue: any;
}
export interface IDeepSubscribeEvent {
    key: any;
    oldValue: any;
    newValue: any;
    parent: any;
    changeType: ValueChangeType;
    keyType: ValueKeyType;
    propertiesPath: IPropertiesPath;
    rule: IRule;
    oldIsLeaf: boolean;
    newIsLeaf: boolean;
    target: any;
}
export interface IDeepSubscribeLastValueEvent {
    unsubscribedValue: ISubscribedValue;
    subscribedValue: ISubscribedValue;
    target: any;
}
export interface IErrorEvent {
    target: ICalcProperty<any>;
    newValue: any;
    oldValue: any;
    error: any;
}
export declare class Debugger {
    static Instance: Debugger;
    private constructor();
    private _dependencySubject;
    get dependencyObservable(): IObservable<IDependencyChangedEvent>;
    onDependencyChanged(target: ICalcProperty<any>, value: any, parent: any, key: any, keyType: ValueKeyType): void;
    private _connectorSubject;
    get connectorObservable(): IObservable<IConnectorChangedEvent>;
    onConnectorChanged(target: ObservableClass, targetKey: string | number, value: any, parent: any, key: any, keyType: ValueKeyType): void;
    private _invalidatedSubject;
    get invalidatedObservable(): IObservable<IInvalidatedEvent>;
    onInvalidated(target: ICalcProperty<any>, value: any): void;
    private _calculatedSubject;
    get calculatedObservable(): IObservable<ICalculatedEvent>;
    onCalculated(target: ICalcProperty<any>, oldValue: any, newValue: any): void;
    private _deepSubscribeSubject;
    get deepSubscribeObservable(): IObservable<IDeepSubscribeEvent>;
    onDeepSubscribe(key: any, oldValue: any, newValue: any, parent: any, changeType: ValueChangeType, keyType: ValueKeyType, propertiesPath: IPropertiesPath, rule: IRule, oldIsLeaf: boolean, newIsLeaf: boolean, target: any): void;
    private _deepSubscribeLastValueSubject;
    get deepSubscribeLastValueHasSubscribers(): boolean;
    get deepSubscribeLastValueObservable(): IObservable<IDeepSubscribeLastValueEvent>;
    onDeepSubscribeLastValue(unsubscribedValue: ISubscribedValue, subscribedValue: ISubscribedValue, target: any): void;
    private _errorSubject;
    get errorObservable(): IObservable<IErrorEvent>;
    onError(target: ICalcProperty<any>, newValue: any, oldValue: any, err: any): void;
}
