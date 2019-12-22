import { RuleBuilder } from '../../deep-subscribe/RuleBuilder';
import { ObservableClass } from '../ObservableClass';
import { IWritableFieldOptions, ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { Connector } from './Connector';
import { ValueKeys } from './contracts';
export declare class ConnectorBuilder<TObject extends Connector<TSource> | ObservableClass, TSource = TObject, TValueKeys extends string | number = ValueKeys> extends ObservableObjectBuilder<TObject> {
    constructor(object?: TObject);
    connect<Name extends string | number = Extract<keyof TObject, string | number>, TValue = Name extends keyof TObject ? TObject[Name] : any>(name: Name, buildRule: (builder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>, options?: IWritableFieldOptions<TObject, TValue>, initValue?: TValue): this & {
        object: {
            readonly [newProp in Name]: TValue;
        };
    };
    connectWritable<Name extends string | number = Extract<keyof TObject, string | number>, TValue = Name extends keyof TObject ? TObject[Name] : any>(name: Name, buildRule: (builder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>, options?: IWritableFieldOptions<TObject, TValue>, initValue?: TValue): this & {
        object: {
            [newProp in Name]: TValue;
        };
    };
    private _connect;
}
export declare function connectorClass<TSource extends ObservableClass, TConnector extends Connector<TSource>>({ buildRule, baseClass, }: {
    buildRule: (connectorBuilder: ConnectorBuilder<Connector<TSource>, TSource>) => {
        object: TConnector;
    };
    baseClass?: new (source: TSource) => Connector<TSource>;
}): new (source: TSource, name?: string) => TConnector;
export declare function connectorFactory<TSource extends ObservableClass, TConnector extends Connector<TSource>>({ name, buildRule, baseClass, }: {
    name?: string;
    buildRule: (connectorBuilder: ConnectorBuilder<Connector<TSource>, TSource>) => {
        object: TConnector;
    };
    baseClass?: new (source: TSource, name?: string) => Connector<TSource>;
}): (source: TSource, name?: string) => TConnector;
