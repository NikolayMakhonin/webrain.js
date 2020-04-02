/**
 * Holds an inserted element, as well as pointers to maintain tree
 * structure.  Acts as a handle to clients for the purpose of
 * mutability.  Each node is contained in a doubly linked list of
 * siblings and has a pointer to it's first child.  If a node is the
 * first of its siblings, then its prev pointer points to their
 * collective parent.  The last child is marked by a null next pointer.
 */
import {IObjectPool} from './contracts/IObjectPool'

export interface PairingNode<TItem> {
	// ! Pointer to a piece of client data
	item: TItem

	// ! First child of this node
	child: PairingNode<TItem>
	// ! Next node in the list of this node's siblings
	next: PairingNode<TItem>
	// ! Previous node in the list of this node's siblings
	prev: PairingNode<TItem>
}

export type TLessThanFunc<TItem> = (o1: TItem, o2: TItem) => boolean

function lessThanDefault(o1, o2) {
	return o1 < o2
}

/**
 * A mutable, meldable, two-pass Pairing heap.  Maintains a single multiary tree
 * with no structural constraints other than the standard heap invariant.
 * Handles most operations through cutting and pairwise merging.  Primarily uses
 * iteration for merging rather than the standard recursion methods (due to
 * concerns for stackframe overhead).
 */
export class PairingHeap<TItem> {
	// ! Memory map to use for node allocation
	private readonly _objectPool: IObjectPool<PairingNode<TItem>>
	private readonly _lessThanFunc: TLessThanFunc<TItem>
	// ! The number of items held in the queue
	private _size: number = 0
	// ! Pointer to the minimum node in the queue
	private _root: PairingNode<TItem> = null

	constructor({
		objectPool,
		lessThanFunc,
	}: {
		objectPool?: IObjectPool<PairingNode<TItem>>,
		lessThanFunc?: TLessThanFunc<TItem>,
	}) {
		this._objectPool = objectPool
		this._lessThanFunc = lessThanFunc || lessThanDefault
	}

	/**
	 * Deletes all nodes, leaving the queue empty.
	 */
	public clear(): void {
		// without put back to the pool
		this._root = null
		this._size = 0
	}

	/**
	 * Returns the current size of the queue.
	 *
	 * @return      Size of queue
	 */
	public get size(): number {
		return this._size
	}

	/**
	 * Takes an item to insert it into the queue and creates a new
	 * corresponding node.  Merges the new node with the root of the queue.
	 *
	 * @param item  Item to insert
	 * @return      Pointer to corresponding node
	 */
	public add(item: TItem): PairingNode<TItem> {
		let node: PairingNode<TItem> = this._objectPool != null
			? this._objectPool.get()
			: null

		if (node == null) {
			node = {
				child: null,
				next: null,
				prev: null,
				item,
			}
		} else {
			node.item = item
		}

		this._size++

		this._root = merge(this._root, node, this._lessThanFunc)

		return node
	}

	/**
	 * Returns the minimum item from the queue without modifying any data.
	 *
	 * @return      Minimum item
	 */
	public getMin(): TItem {
		const {_root} = this
		return _root == null
			? void 0
			: _root.item
	}

	/**
	 * Deletes the minimum item from the queue and returns it, restructuring
	 * the queue along the way to maintain the heap property.  Relies on the
	 * @ref <pq_delete> method to delete the root of the tree.
	 *
	 * @return      Minimum item, corresponding to item deleted
	 */
	public deleteMin(): TItem {
		const {_root} = this
		const result = _root == null
			? void 0
			: _root.item

		this.delete(_root)

		return result
	}

	/**
	 * Deletes an arbitrary item from the queue and modifies queue structure
	 * to preserve the heap invariant.  Requires that the location of the
	 * item's corresponding node is known.  Removes the node from its list
	 * of siblings, then merges all its children into a new tree and
	 * subsequently merges that tree with the root.
	 *
	 * @param node  Pointer to node corresponding to the item to delete
	 */
	public delete(node: PairingNode<TItem>): void {
		if (node === this._root) {
			this._root = collapse(node.child, this._lessThanFunc)
		} else {
			if (node.prev.child === node) {
				node.prev.child = node.next
			} else {
				node.prev.next = node.next
			}

			if (node.next != null) {
				node.next.prev = node.prev
			}

			this._root = merge(this._root, collapse(node.child, this._lessThanFunc), this._lessThanFunc)
		}

		node.child = null
		node.prev = null
		node.next = null
		node.item = void 0
		this._objectPool.release(node)

		this._size--
	}

	/**
	 * If the item in the queue is modified in such a way to decrease the
	 * item, then this function will update the queue to preserve queue
	 * properties given a pointer to the corresponding node.  Cuts the node
	 * from its list of siblings and merges it with the root.
	 *
	 * @param node      Node to change
	 */
	public decreaseKey(node: PairingNode<TItem>): void {
		if (node === this._root) {
			return
		}

		if (node.prev.child === node) {
			node.prev.child = node.next
		} else {
			node.prev.next = node.next
		}

		if (node.next != null) {
			node.next.prev = node.prev
		}

		this._root = merge(this._root, node, this._lessThanFunc)
	}

	/**
	 * Determines whether the queue is empty, or if it holds some items.
	 *
	 * @return      True if queue holds nothing, false otherwise
	 */
	public get isEmpty(): boolean {
		return this._root == null
	}

	public readonly merge = merge
	public readonly collapse = collapse
}

/**
 * Merges two nodes together, making the greater item the child
 * of the other.
 *
 * @param a     First node
 * @param b     Second node
 * @return      Resulting tree root
 */
export function merge<TItem>(
	a: PairingNode<TItem>,
	b: PairingNode<TItem>,
	lessThanFunc: TLessThanFunc<TItem>,
): PairingNode<TItem> {
	let parent: PairingNode<TItem>
	let child: PairingNode<TItem>

	if (a == null) {
		return b
	} else if (b == null) {
		return a
	} else if (a === b) {
		return a
	}

	if (lessThanFunc(b.item, a.item)) {
		parent = b
		child = a
	} else {
		parent = a
		child = b
	}

	child.next = parent.child
	if (parent.child != null) {
		parent.child.prev = child
	}
	child.prev = parent
	parent.child = child

	parent.next = null
	parent.prev = null

	return parent
}

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
export function collapse<TItem>(
	node: PairingNode<TItem>,
	lessThanFunc: TLessThanFunc<TItem>,
): PairingNode<TItem> {
	let tail: PairingNode<TItem>
	let a: PairingNode<TItem>
	let b: PairingNode<TItem>
	let next: PairingNode<TItem>
	let result: PairingNode<TItem>

	if (node == null) {
		return null
	}

	next = node
	tail = null
	while (next != null) {
		a = next
		b = a.next
		if (b != null) {
			next = b.next
			result = merge(a, b, lessThanFunc)
			// tack the result onto the end of the temporary list
			result.prev = tail
			tail = result
		} else {
			a.prev = tail
			tail = a
			break
		}
	}

	result = null
	while (tail != null) {
		// trace back through to merge the list
		next = tail.prev
		result = merge(result, tail, lessThanFunc)
		tail = next
	}

	return result
}
