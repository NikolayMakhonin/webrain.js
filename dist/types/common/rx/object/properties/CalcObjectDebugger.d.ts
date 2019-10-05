import { ValueKeyType } from '../../deep-subscribe/contracts/common';
import { IObservable } from '../../subjects/observable';
import { ObservableClass } from '../ObservableClass';
import { ICalcProperty } from './contracts';
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
export interface IErrorEvent {
    target: ICalcProperty<any>;
    newValue: any;
    oldValue: any;
    error: any;
}
export declare class CalcObjectDebugger {
    static Instance: CalcObjectDebugger;
    private constructor();
    private _dependencySubject;
    readonly dependencyObservable: IObservable<IDependencyChangedEvent>;
    onDependencyChanged(target: ICalcProperty<any>, value: any, parent: any, key: any, keyType: ValueKeyType): void;
    private _connectorSubject;
    readonly connectorObservable: IObservable<IConnectorChangedEvent>;
    onConnectorChanged(target: ObservableClass, targetKey: string | number, value: any, parent: any, key: any, keyType: ValueKeyType): void;
    private _invalidatedSubject;
    readonly invalidatedObservable: IObservable<IInvalidatedEvent>;
    onInvalidated(target: ICalcProperty<any>, value: any): void;
    private _calculatedSubject;
    readonly calculatedObservable: IObservable<ICalculatedEvent>;
    onCalculated(target: ICalcProperty<any>, oldValue: any, newValue: any): void;
    private _errorSubject;
    readonly errorObservable: IObservable<IErrorEvent>;
    onError(target: ICalcProperty<any>, newValue: any, oldValue: any, err: any): void;
}
