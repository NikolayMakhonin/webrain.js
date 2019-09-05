export declare function fillCollection<TCollection, T = any>(collection: TCollection, arrayOrIterable: T[] | Iterable<T>, add: (collection: TCollection, item: T) => void): TCollection;
export declare function fillSet<TSet extends Set<T>, T = any>(set: TSet, arrayOrIterable: T[] | Iterable<T>): TSet;
export declare function fillMap<TMap extends Map<K, V>, K = any, V = any>(map: TMap, arrayOrIterable: Array<[K, V]> | Iterable<[K, V]>): TMap;
export declare function fillObject<V = any>(object: object, arrayOrIterable: Array<[string, V]> | Iterable<[string, V]>): object;
export declare function fillObjectKeys(object: object, arrayOrIterable: string[] | Iterable<string>): object;
