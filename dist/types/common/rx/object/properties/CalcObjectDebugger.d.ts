import { IObservable } from '../../subjects/observable';
import { ObservableObject } from '../ObservableObject';
import { ICalcProperty } from './contracts';
export interface IConnectorChangedEvent {
    target: ObservableObject;
    value: any;
    parent: any;
    propertyName: string;
}
export interface IDependencyChangedEvent {
    target: ICalcProperty<any>;
    value: any;
    parent: any;
    propertyName: string;
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
    err: any;
}
export declare class CalcObjectDebugger {
    static Instance: CalcObjectDebugger;
    private constructor();
    private _dependencySubject;
    readonly dependencyObservable: IObservable<IDependencyChangedEvent>;
    onDependencyChanged(target: ICalcProperty<any>, value: any, parent: any, propertyName: string): void;
    private _connectorSubject;
    readonly connectorObservable: IObservable<IConnectorChangedEvent>;
    onConnectorChanged(target: ObservableObject, value: any, parent: any, propertyName: string): void;
    private _invalidatedSubject;
    readonly invalidatedObservable: IObservable<IInvalidatedEvent>;
    onInvalidated(target: ICalcProperty<any>, value: any): void;
    private _calculatedSubject;
    readonly calculatedObservable: IObservable<ICalculatedEvent>;
    onCalculated(target: ICalcProperty<any>, newValue: any, oldValue: any): void;
    private _errorSubject;
    readonly errorObservable: IObservable<IErrorEvent>;
    onError(target: ICalcProperty<any>, newValue: any, oldValue: any, err: any): void;
}
