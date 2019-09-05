import { ICompare } from '../contracts/ICompare';
export declare function defaultCompare(o1: any, o2: any): 1 | 0 | -1;
/**
 * @param array sorted array with compare func
 * @param item search item
 * @param start (optional) start index
 * @param end (optional) exclusive end index
 * @param compare (optional) custom compare func
 * @param bound (optional) (-1) first index; (1) last index; (0) doesn't matter
 */
export declare function binarySearch<T>(array: T[], item: T, start?: number, end?: number, compare?: ICompare<T>, bound?: number): number;
export declare function move<T>(array: T[], start: number, end: number, moveIndex: number): boolean;
