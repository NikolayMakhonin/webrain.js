export declare class CalcStat {
    count: number;
    sum: number;
    sumSqr: number;
    add(value: number): void;
    get average(): number;
    get dispersion(): number;
    get standardDeviation(): number;
    get range(): number;
    toString(): string;
}
