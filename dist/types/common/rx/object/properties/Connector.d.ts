import { ObservableClass } from '../ObservableClass';
export declare class ConnectorState<TSource> extends ObservableClass {
    source: TSource;
    name: string;
}
export declare class Connector<TSource> extends ObservableClass {
    readonly connectorState: ConnectorState<TSource>;
    constructor(source: TSource, name?: string);
}
