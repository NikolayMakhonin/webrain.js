/**
 * Holds an inserted element, as well as pointers to maintain tree
 * structure.  Acts as a handle to clients for the purpose of
 * mutability.  Each node is contained in a doubly linked list of
 * siblings and has a pointer to it's first child.  If a node is the
 * first of its siblings, then its prev pointer points to their
 * collective parent.  The last child is marked by a null next pointer.
 */
import {IObjectPool} from './contracts/IObjectPool'

export interface PairingNode<TItem, TKey> {
	// ! First child of this node
	child: PairingNode<TItem, TKey>
	// ! Next node in the list of this node's siblings
	next: PairingNode<TItem, TKey>
	// ! Previous node in the list of this node's siblings
	prev: PairingNode<TItem, TKey>

	// ! Pointer to a piece of client data
	item: TItem
	// ! Key for the item
	key: TKey
}

export type ILessThanFunc<TKey> = (o1: TKey, o2: TKey) => boolean

function lessThanDefault(o1, o2) {
	return o1 < o2 ? true : false
}

/**
 * A mutable, meldable, two-pass Pairing heap.  Maintains a single multiary tree
 * with no structural constraints other than the standard heap invariant.
 * Handles most operations through cutting and pairwise merging.  Primarily uses
 * iteration for merging rather than the standard recursion methods (due to
 * concerns for stackframe overhead).
 */
export class PairingHeap<TItem, TKey> {
	// ! Memory map to use for node allocation
	private _objectPool: IObjectPool<PairingNode<TItem, TKey>>
	// ! The number of items held in the queue
	private _size: number = 0
	// ! Pointer to the minimum node in the queue
	private _root: PairingNode<TItem, TKey> = null
	private _lessThanFunc: ILessThanFunc<TKey>

	constructor({
		objectPool,
		lessThanFunc,
	}: {
		objectPool?: IObjectPool<PairingNode<TItem, TKey>>,
		lessThanFunc?: ILessThanFunc<TKey>,
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
	 * Takes an item-key pair to insert it into the queue and creates a new
	 * corresponding node.  Merges the new node with the root of the queue.
	 *
	 * @param item  Item to insert
	 * @param key   Key to use for node priority
	 * @return      Pointer to corresponding node
	 */
	public add( item: TItem, key: TKey ): PairingNode<TItem, TKey> {
		let node: PairingNode<TItem, TKey> = this._objectPool != null
			? this._objectPool.get()
			: null

		if (node == null) {
			node = {
				key,
				child: null,
				next: null,
				prev: null,
				item,
			}
		} else {
			node.key = key
			node.item = item
		}

		this._size = (this._size + 1) | 0

		this._root = this.merge( this._root, node )

		return node
	}

	/**
	 * Returns the minimum item from the queue without modifying any data.
	 *
	 * @return      Node with minimum key
	 */
	public getMin(): PairingNode<TItem, TKey> {
		if ( this.isEmpty ) {
			return null
		}
		return this._root
	}

	/**
	 * Deletes the minimum item from the queue and returns it, restructuring
	 * the queue along the way to maintain the heap property.  Relies on the
	 * @ref <pq_delete> method to delete the root of the tree.
	 *
	 * @return      Minimum key, corresponding to item deleted
	 */
	public deleteMin(): TItem {
		const result = this._root == null
			? void 0
			: this._root.item

		this.delete(this._root)

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
	 * @return      Key of item deleted
	 */
	public delete( node: PairingNode<TItem, TKey> ): void {
		const key: TKey = node.key

		if ( node === this._root ) {
			this._root = this.collapse( node.child )
		} else
		{
			if ( node.prev.child === node ) {
				node.prev.child = node.next
			} else {
				node.prev.next = node.next
			}

			if ( node.next != null ) {
				node.next.prev = node.prev
			}

			this._root = this.merge( this._root, this.collapse( node.child ) )
		}

		node.key = void 0
		node.item = void 0
		node.child = null
		node.prev = null
		node.next = null
		this._objectPool.release(node)

		this._size = (this._size - 1) | 0
	}

	/**
	 * If the item in the queue is modified in such a way to decrease the
	 * key, then this function will update the queue to preserve queue
	 * properties given a pointer to the corresponding node.  Cuts the node
	 * from its list of siblings and merges it with the root.
	 *
	 * @param node      Node to change
	 * @param new_key   New key to use for the given node
	 */
	public decreaseKey( node: PairingNode<TItem, TKey>, new_key: TKey ): void {
		node.key = new_key
		if ( node === this._root ) {
			return
		}

		if ( node.prev.child === node ) {
			node.prev.child = node.next
		} else {
			node.prev.next = node.next
		}

		if ( node.next != null ) {
			node.next.prev = node.prev
		}

		this._root = this.merge( this._root, node )
	}

	/**
	 * Determines whether the queue is empty, or if it holds some items.
	 *
	 * @return      True if queue holds nothing, false otherwise
	 */
	public get isEmpty(): boolean {
		return ( this._size === 0 )
	}

	/**
	 * Merges two nodes together, making the item of greater key the child
	 * of the other.
	 *
	 * @param a     First node
	 * @param b     Second node
	 * @return      Resulting tree root
	 */
	public merge(
		a: PairingNode<TItem, TKey>,
		b: PairingNode<TItem, TKey>,
	): PairingNode<TItem, TKey> {
		let parent: PairingNode<TItem, TKey>
		let child: PairingNode<TItem, TKey>

		if ( a == null ) {
			return b
		} else if ( b == null ) {
			return a
		} else if ( a === b ) {
			return a
		}

		if ( this._lessThanFunc(b.key, a.key) )
		{
			parent = b
			child = a
		} else
		{
			parent = a
			child = b
		}

		child.next = parent.child
		if ( parent.child != null ) {
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
	public collapse(
		node: PairingNode<TItem, TKey>,
	): PairingNode<TItem, TKey> {
		let tail: PairingNode<TItem, TKey>
		let a: PairingNode<TItem, TKey>
		let b: PairingNode<TItem, TKey>
		let next: PairingNode<TItem, TKey>
		let result: PairingNode<TItem, TKey>

		if ( node == null ) {
			return null
		}

		next = node
		tail = null
		while ( next != null )
		{
			a = next
			b = a.next
			if ( b != null )
			{
				next = b.next
				result = this.merge( a, b )
				// tack the result onto the end of the temporary list
				result.prev = tail
				tail = result
			} else
			{
				a.prev = tail
				tail = a
				break
			}
		}

		result = null
		while ( tail != null )
		{
			// trace back through to merge the list
			next = tail.prev
			result = this.merge( result, tail )
			tail = next
		}

		return result
	}
}