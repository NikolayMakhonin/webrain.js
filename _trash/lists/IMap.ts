import {ISet} from "./ISet";

export interface IMap<TKey, TValue> {
    containsKey(key: TKey): boolean;
    pull(key: TKey): TValue;
    put(key: TKey, value: TValue, notPutIfExists?: boolean): boolean;
    removeKey(key: TKey): boolean;
    keys(): ISet<TKey>;
    values(): ISet<TValue>;
    size(): number;
    clear();
}
