export declare class CalcStatReport {
    averageValue: number[];
    standardDeviation: number[];
    count: number;
    constructor(data: {
        averageValue: number[];
        standardDeviation: number[];
        count: number;
    });
    clone(): CalcStatReport;
    subtract(other: CalcStatReport): CalcStatReport;
    toString(): string;
}
export declare enum CalcType {
    Stat = 0,
    Min = 1
}
export declare function calcMin(countTests: number, testFunc: (...args: any[]) => Array<number | BigInt> | null, ...args: any[]): CalcStatReport;
export declare function calcStat(countTests: number, testFunc: (...args: any[]) => Array<number | BigInt> | null, ...args: any[]): CalcStatReport;
export declare function calc(calcType: CalcType, countTests: number, testFunc: (...args: any[]) => Array<number | BigInt> | null, ...args: any[]): CalcStatReport;
export declare function calcMemAllocate(calcType: CalcType, countTests: number, testFunc: (...args: any[]) => void, ...testFuncArgs: any[]): void;
