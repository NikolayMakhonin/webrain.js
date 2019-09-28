import { ObservableClass } from '../ObservableClass';
export declare class Connector<TSource> extends ObservableClass {
    connectorSource: TSource;
    constructor(connectorSource: TSource);
}
