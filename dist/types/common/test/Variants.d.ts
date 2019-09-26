export declare type ArrayTreeOrValue<T> = IArrayTree<T> | T;
export interface IArrayTree<T> extends Array<ArrayTreeOrValue<T>> {
}
export declare class TreeToSequenceVariants<T> {
    private tree;
    private startIndex;
    private variant;
    constructor(tree: IArrayTree<T>, startIndex?: number, variant?: Iterable<T>);
    [Symbol.iterator](): Generator<Iterable<T>, void, undefined>;
}
export declare function treeToSequenceVariants<T>(tree: IArrayTree<T>, startIndex?: number, variant?: Iterable<T>): Iterable<Iterable<T>>;
export declare function iterablesToArrays<T>(iterables: Iterable<Iterable<T>>): T[][];
