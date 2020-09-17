/**
 * Holds an inserted element, as well as pointers to maintain tree
 * structure.  Acts as a handle to clients for the purpose of
 * mutability.  Each node is contained in a doubly linked list of
 * siblings and has a pointer to it's first child.  If a node is the
 * first of its siblings, then its prev pointer points to their
 * collective parent.  The last child is marked by a null next pointer.
 */
import { IObjectPool } from './contracts/IObjectPool';
export interface PairingNode<TItem> {
    item: TItem;
    child: PairingNode<TItem>;
    next: PairingNode<TItem>;
    prev: PairingNode<TItem>;
}
export declare type TLessThanFunc<TItem> = (o1: TItem, o2: TItem) => boolean;
/**
 * A mutable, meldable, two-pass Pairing heap.  Maintains a single multiary tree
 * with no structural constraints other than the standard heap invariant.
 * Handles most operations through cutting and pairwise merging.  Primarily uses
 * iteration for merging rather than the standard recursion methods (due to
 * concerns for stackframe overhead).
 */
export declare class PairingHeap<TItem> {
    private readonly _objectPool;
    private readonly _lessThanFunc;
    private _size;
    private _root;
    constructor({ objectPool, lessThanFunc, }: {
        objectPool?: IObjectPool<PairingNode<TItem>>;
        lessThanFunc?: TLessThanFunc<TItem>;
    });
    /**
     * Deletes all nodes, leaving the queue empty.
     */
    clear(): void;
    /**
     * Returns the current size of the queue.
     *
     * @return      Size of queue
     */
    get size(): number;
    /**
     * Takes an item to insert it into the queue and creates a new
     * corresponding node.  Merges the new node with the root of the queue.
     *
     * @param item  Item to insert
     * @return      Pointer to corresponding node
     */
    add(item: TItem): PairingNode<TItem>;
    /**
     * Returns the minimum item from the queue without modifying any data.
     *
     * @return      Minimum item
     */
    getMin(): TItem;
    /**
     * Deletes the minimum item from the queue and returns it, restructuring
     * the queue along the way to maintain the heap property.  Relies on the
     * @ref <pq_delete> method to delete the root of the tree.
     *
     * @return      Minimum item, corresponding to item deleted
     */
    deleteMin(): TItem;
    /**
     * Deletes an arbitrary item from the queue and modifies queue structure
     * to preserve the heap invariant.  Requires that the location of the
     * item's corresponding node is known.  Removes the node from its list
     * of siblings, then merges all its children into a new tree and
     * subsequently merges that tree with the root.
     *
     * @param node  Pointer to node corresponding to the item to delete
     */
    delete(node: PairingNode<TItem>): void;
    /**
     * If the item in the queue is modified in such a way to decrease the
     * item, then this function will update the queue to preserve queue
     * properties given a pointer to the corresponding node.  Cuts the node
     * from its list of siblings and merges it with the root.
     *
     * @param node      Node to change
     */
    decreaseKey(node: PairingNode<TItem>): void;
    /**
     * Determines whether the queue is empty, or if it holds some items.
     *
     * @return      True if queue holds nothing, false otherwise
     */
    get isEmpty(): boolean;
    readonly merge: typeof merge;
    readonly collapse: typeof collapse;
}
/**
 * Merges two nodes together, making the greater item the child
 * of the other.
 *
 * @param a     First node
 * @param b     Second node
 * @return      Resulting tree root
 */
export declare function merge<TItem>(a: PairingNode<TItem>, b: PairingNode<TItem>, lessThanFunc: TLessThanFunc<TItem>): PairingNode<TItem>;
/**
 * Performs an iterative pairwise merging of a list of nodes until a
 * single tree remains.  Implements the two-pass method without using
 * explicit recursion (to prevent stack overflow with large lists).
 * Performs the first pass in place while maintaining only the minimal list
 * structure needed to iterate back through during the second pass.
 *
 * @param node  Head of the list to collapse
 * @return      Root of the collapsed tree
 */
export declare function collapse<TItem>(node: PairingNode<TItem>, lessThanFunc: TLessThanFunc<TItem>): PairingNode<TItem>;
