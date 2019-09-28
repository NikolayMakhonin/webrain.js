import { RuleBuilder } from '../../deep-subscribe/RuleBuilder';
import { ObservableClass } from '../ObservableClass';
import { IWritableFieldOptions, ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { Connector } from './Connector';
import { ValueKeys } from './contracts';
export declare class ConnectorBuilder<TObject extends ObservableClass, TSource = TObject, TValueKeys extends string | number = ValueKeys> extends ObservableObjectBuilder<TObject> {
    buildSourceRule: (builder: RuleBuilder<TObject, TValueKeys>) => RuleBuilder<TSource, TValueKeys>;
    constructor(object?: TObject, buildSourceRule?: (builder: RuleBuilder<TObject, TValueKeys>) => RuleBuilder<TSource, TValueKeys>);
    connect<TValue, Name extends string | number>(name: Name, buildRule: (builder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>, options?: IWritableFieldOptions, initValue?: TValue): this & {
        object: {
            readonly [newProp in Name]: TValue;
        };
    };
    connectWritable<TValue, Name extends string | number>(name: Name, buildRule: (builder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>, options?: IWritableFieldOptions, initValue?: TValue): this & {
        object: {
            readonly [newProp in Name]: TValue;
        };
    };
    private _connect;
}
export declare function connectorClass<TSource extends ObservableClass, TConnector extends ObservableClass>(build: (connectorBuilder: ConnectorBuilder<ObservableClass, TSource>) => {
    object: TConnector;
}, baseClass?: new (source: TSource) => Connector<TSource>): new (source: TSource) => TConnector;
export declare function connectorFactory<TSource extends ObservableClass, TConnector extends Connector<TSource>>(build: (connectorBuilder: ConnectorBuilder<Connector<TSource>, TSource>) => {
    object: TConnector;
}, baseClass?: new (source: TSource) => Connector<TSource>): (source: TSource) => TConnector;
