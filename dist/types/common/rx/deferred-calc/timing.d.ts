export interface ITiming {
    now(): number;
    setTimeout(handler: () => void, timeout: number): number;
    clearTimeout(handle: number): any;
}
export declare const timingDefault: ITiming;
