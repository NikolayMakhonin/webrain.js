import { TClass } from '../../../helpers/typescript';
import { ObservableClass } from '../ObservableClass';
import { IReadableFieldOptions, ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { Connector } from './Connector';
import { ValueKeys } from './contracts';
import { INextPathGetSet, Path, TNextPath } from './path/builder';
export interface IConnectFieldOptions<TObject, TValue> extends IReadableFieldOptions<TObject, TValue> {
    isDepend?: boolean;
    isLazy?: boolean;
    isWait?: boolean;
    waitCondition?: (value: TValue) => boolean;
    waitTimeout?: number;
}
export declare class ConnectorBuilder<TObject extends Connector<TSource> | ObservableClass, TSource = TObject, TValueKeys extends string | number = ValueKeys> extends ObservableObjectBuilder<TObject> {
    readonly sourcePath?: Path<TObject, TSource>;
    constructor(object?: TObject, sourcePath?: Path<TObject, TSource>);
    connectSimple<Name extends string | number = Extract<keyof TObject, string | number>, TValue = Name extends keyof TObject ? TObject[Name] : TSource>(name: Name, common: TNextPath<TSource, TSource, TValue>, getSet?: null | undefined, options?: IReadableFieldOptions<TSource, TValue>): this & {
        object: {
            [newProp in Name]: TValue;
        };
    };
    connectSimple<Name extends string | number = Extract<keyof TObject, string | number>, TCommonValue = TSource, TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue>(name: Name, common: TNextPath<TSource, TSource, TCommonValue>, getSet: INextPathGetSet<TSource, TCommonValue, TValue>, options?: IReadableFieldOptions<TSource, TValue>): this & {
        object: {
            [newProp in Name]: TValue;
        };
    };
    connect<Name extends string | number = Extract<keyof TObject, string | number>, TValue = Name extends keyof TObject ? TObject[Name] : TSource>(name: Name, common: TNextPath<TSource, TSource, TValue>, getSet?: null | undefined, options?: IConnectFieldOptions<TSource, TValue>): this & {
        object: {
            [newProp in Name]: TValue;
        };
    };
    connect<Name extends string | number = Extract<keyof TObject, string | number>, TCommonValue = TSource, TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue>(name: Name, common: TNextPath<TSource, TSource, TCommonValue>, getSet: INextPathGetSet<TSource, TCommonValue, TValue>, options?: IConnectFieldOptions<TSource, TValue>): this & {
        object: {
            [newProp in Name]: TValue;
        };
    };
    connectLazy<Name extends string | number = Extract<keyof TObject, string | number>, TValue = Name extends keyof TObject ? TObject[Name] : TSource>(name: Name, common: TNextPath<TSource, TSource, TValue>, getSet?: null | undefined, options?: IConnectFieldOptions<TSource, TValue>): this & {
        object: {
            [newProp in Name]: TValue;
        };
    };
    connectLazy<Name extends string | number = Extract<keyof TObject, string | number>, TCommonValue = TSource, TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue>(name: Name, common: TNextPath<TSource, TSource, TCommonValue>, getSet: INextPathGetSet<TSource, TCommonValue, TValue>, options?: IConnectFieldOptions<TSource, TValue>): this & {
        object: {
            [newProp in Name]: TValue;
        };
    };
    connectWait<Name extends string | number = Extract<keyof TObject, string | number>, TValue = Name extends keyof TObject ? TObject[Name] : TSource>(name: Name, common: TNextPath<TSource, TSource, TValue>, getSet?: null | undefined, options?: IConnectFieldOptions<TSource, TValue>): this & {
        object: {
            [newProp in Name]: TValue;
        };
    };
    connectWait<Name extends string | number = Extract<keyof TObject, string | number>, TCommonValue = TSource, TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue>(name: Name, common: TNextPath<TSource, TSource, TCommonValue>, getSet: INextPathGetSet<TSource, TCommonValue, TValue>, options?: IConnectFieldOptions<TSource, TValue>): this & {
        object: {
            [newProp in Name]: TValue;
        };
    };
    connectWaitLazy<Name extends string | number = Extract<keyof TObject, string | number>, TValue = Name extends keyof TObject ? TObject[Name] : TSource>(name: Name, common: TNextPath<TSource, TSource, TValue>, getSet?: null | undefined, options?: IConnectFieldOptions<TSource, TValue>): this & {
        object: {
            [newProp in Name]: TValue;
        };
    };
    connectWaitLazy<Name extends string | number = Extract<keyof TObject, string | number>, TCommonValue = TSource, TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue>(name: Name, common: TNextPath<TSource, TSource, TCommonValue>, getSet: INextPathGetSet<TSource, TCommonValue, TValue>, options?: IConnectFieldOptions<TSource, TValue>): this & {
        object: {
            [newProp in Name]: TValue;
        };
    };
    private _connect;
}
export declare function dependConnectorClass<TSource, TConnectorClass extends TBaseClass, TBaseClass extends Connector<TSource> = Connector<TSource>>(build: (connectorBuilder: ConnectorBuilder<TBaseClass, TSource>) => {
    object: TConnectorClass;
}, baseClass?: TClass<[TSource, string?], TBaseClass>): TClass<[TSource, string?], TConnectorClass>;
export declare function connectorFactory<TSource extends ObservableClass, TConnectorClass extends TBaseClass, TBaseClass extends Connector<TSource> = Connector<TSource>>({ name, build, baseClass, }: {
    name?: string;
    build: (connectorBuilder: ConnectorBuilder<TBaseClass, TSource>) => {
        object: TConnectorClass;
    };
    baseClass?: new (source: TSource, name?: string) => TBaseClass;
}): (source: TSource, name?: string) => TConnectorClass;
