import { ObservableObject } from '../ObservableObject';
export declare class Connector<TSource> extends ObservableObject {
    connectorSource: TSource;
    constructor(connectorSource: TSource);
}
