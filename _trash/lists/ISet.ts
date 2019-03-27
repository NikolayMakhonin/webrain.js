import {ICollection} from "./ICollection";

export interface ISet<T> extends ICollection<T> {
    get(index: number): T;
    set(index: number, value: T): T;
    insert(index: number, item: T): boolean;
    removeAt(index: number): T;
    indexOf(item: T): number;
    toArray<T2 extends T>(): T2[];
}
