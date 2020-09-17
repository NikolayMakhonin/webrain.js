export declare const webrainOptions: {
    equalsFunc<TValue>(oldValue: TValue, newValue: TValue): boolean;
    debugInfo: boolean;
    callState: {
        garbageCollect: {
            minLifeTime: number;
            bulkSize: number;
            interval: number;
            disabled: boolean;
        };
        logCaughtErrors: boolean;
    };
    timeouts: {
        dependWait: number;
    };
};
export declare function webrainEquals(o1: any, o2: any): any;
