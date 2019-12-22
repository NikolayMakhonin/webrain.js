import {IPropertiesPath, ValueChangeType, ValueKeyType} from './deep-subscribe/contracts/common'
import {ISubscribedValue} from './deep-subscribe/contracts/deep-subscribe'
import {IRule} from './deep-subscribe/contracts/rules'
import {ObservableClass} from './object/ObservableClass'
import {ICalcProperty} from './object/properties/contracts'
import {IObservable} from './subjects/observable'
import {ISubject, Subject} from './subjects/subject'

export interface IConnectorChangedEvent {
	target: ObservableClass
	targetKey: string|number
	value: any
	parent: any
	key: any
	keyType: ValueKeyType
}

export interface IDependencyChangedEvent {
	target: ICalcProperty<any>
	value: any
	parent: any
	key: any
	keyType: ValueKeyType
}

export interface IInvalidatedEvent {
	target: ICalcProperty<any>
	value: any
}

export interface ICalculatedEvent {
	target: ICalcProperty<any>
	newValue: any
	oldValue: any
}

export interface IDeepSubscribeEvent {
	key: any,
	oldValue: any,
	newValue: any,
	parent: any,
	changeType: ValueChangeType,
	keyType: ValueKeyType,
	propertiesPath: IPropertiesPath,
	rule: IRule,
	oldIsLeaf: boolean,
	newIsLeaf: boolean,
	target: any,
}

export interface IDeepSubscribeLastValueEvent {
	unsubscribedValue: ISubscribedValue
	subscribedValue: ISubscribedValue
	target: any
}

export interface IErrorEvent {
	target: ICalcProperty<any>
	newValue: any
	oldValue: any
	error: any
}

export class Debugger {
	public static Instance = new Debugger()

	private constructor() { }

	// region onDependencyChanged

	private _dependencySubject: ISubject<IDependencyChangedEvent> = new Subject<IDependencyChangedEvent>()
	public get dependencyObservable(): IObservable<IDependencyChangedEvent> {
		return this._dependencySubject
	}

	public onDependencyChanged(
		target: ICalcProperty<any>,
		value: any,
		parent: any,
		key: any,
		keyType: ValueKeyType,
	) {
		if (this._dependencySubject.hasSubscribers) {
			this._dependencySubject.emit({
				target,
				value,
				parent,
				key,
				keyType,
			})
		}
	}

	// endregion

	// region onConnectorChanged

	private _connectorSubject: ISubject<IConnectorChangedEvent> = new Subject<IConnectorChangedEvent>()
	public get connectorObservable(): IObservable<IConnectorChangedEvent> {
		return this._connectorSubject
	}

	public onConnectorChanged(
		target: ObservableClass,
		targetKey: string|number,
		value: any,
		parent: any,
		key: any,
		keyType: ValueKeyType,
	) {
		if (this._connectorSubject.hasSubscribers) {
			this._connectorSubject.emit({
				target,
				targetKey,
				value,
				parent,
				key,
				keyType,
			})
		}
	}

	// endregion

	// region onInvalidated

	private _invalidatedSubject: ISubject<IInvalidatedEvent> = new Subject<IInvalidatedEvent>()
	public get invalidatedObservable(): IObservable<IInvalidatedEvent> {
		return this._invalidatedSubject
	}

	public onInvalidated(target: ICalcProperty<any>, value: any) {
		if (this._invalidatedSubject.hasSubscribers) {
			this._invalidatedSubject.emit({
				target,
				value,
			})
		}
	}

	// endregion

	// region onCalculated

	private _calculatedSubject: ISubject<ICalculatedEvent> = new Subject<ICalculatedEvent>()
	public get calculatedObservable(): IObservable<ICalculatedEvent> {
		return this._calculatedSubject
	}

	public onCalculated(target: ICalcProperty<any>, oldValue: any, newValue: any) {
		if (this._calculatedSubject.hasSubscribers) {
			this._calculatedSubject.emit({
				target,
				newValue,
				oldValue,
			})
		}
	}

	// endregion

	// region onDeepSubscribe

	private _deepSubscribeSubject: ISubject<IDeepSubscribeEvent> = new Subject<IDeepSubscribeEvent>()
	public get deepSubscribeObservable(): IObservable<IDeepSubscribeEvent> {
		return this._deepSubscribeSubject
	}

	public onDeepSubscribe(
		key: any,
		oldValue: any,
		newValue: any,
		parent: any,
		changeType: ValueChangeType,
		keyType: ValueKeyType,
		propertiesPath: IPropertiesPath,
		rule: IRule,
		oldIsLeaf: boolean,
		newIsLeaf: boolean,
		target: any,
	) {
		if (this._deepSubscribeSubject.hasSubscribers) {
			this._deepSubscribeSubject.emit({
				key,
				oldValue,
				newValue,
				parent,
				changeType,
				keyType,
				propertiesPath,
				rule,
				oldIsLeaf,
				newIsLeaf,
				target,
			})
		}
	}

	// endregion

	// region onDeepSubscribeLastValue

	private _deepSubscribeLastValueSubject: ISubject<IDeepSubscribeLastValueEvent>
		= new Subject<IDeepSubscribeLastValueEvent>()
	public get deepSubscribeLastValueHasSubscribers(): boolean {
		return this._deepSubscribeLastValueSubject.hasSubscribers
	}
	public get deepSubscribeLastValueObservable(): IObservable<IDeepSubscribeLastValueEvent> {
		return this._deepSubscribeLastValueSubject
	}

	public onDeepSubscribeLastValue(
		unsubscribedValue: ISubscribedValue,
		subscribedValue: ISubscribedValue,
		target: any,
	) {
		if (this._deepSubscribeLastValueSubject.hasSubscribers) {
			this._deepSubscribeLastValueSubject.emit({
				unsubscribedValue,
				subscribedValue,
				target,
			})
		}
	}

	// endregion

	// region onError

	private _errorSubject: ISubject<IErrorEvent> = new Subject<IErrorEvent>()
	public get errorObservable(): IObservable<IErrorEvent> {
		return this._errorSubject
	}

	public onError(target: ICalcProperty<any>, newValue: any, oldValue: any, err: any) {
		if (this._errorSubject.hasSubscribers) {
			this._errorSubject.emit({
				target,
				newValue,
				oldValue,
				error: err,
			})
		}
	}

	// endregion
}
