// visualizations: https://www.cs.usfca.edu/~galles/visualization/Algorithms.html
// AVL algorithm: https://habr.com/ru/post/150732/

import {IObjectPool} from './contracts/IObjectPool'

export interface IBinaryTreeNode<TItem> {
	data: TItem
	parent: IBinaryTreeNode<TItem>
	left: IBinaryTreeNode<TItem>
	right: IBinaryTreeNode<TItem>
	count: number
	height: number
}

export type TCompareFunc<T> = (o1: T, o2: T) => -1|0|1

function compareDefault(o1, o2) {
	if (o1 === o2 || o1 !== o1 && o2 !== o2) {
		return 0
	}
	return o1 > o2 ? 1 : -1
}

function getBalanceFactor<TItem>(node: IBinaryTreeNode<TItem>) {
	return (node.right == null ? 0 : node.right.height) - (node.left == null ? 0 : node.left.height)
}

function fixMetrics<TItem>(node: IBinaryTreeNode<TItem>) {
	const heightLeft = node.left == null ? 0 : node.left.height
	const heightRight = node.right == null ? 0 : node.right.height
	node.height = (heightLeft > heightRight ? heightLeft : heightRight) + 1

	const countLeft = node.left == null ? 0 : node.left.count
	const countRight = node.right == null ? 0 : node.right.count
	node.count = countLeft + countRight + 1
}

function rotateRight<TItem>(node: IBinaryTreeNode<TItem>) {
	const left = node.left
	node.left = left.right
	left.right = node

	if (node.left != null) {
		node.left.parent = node
	}
	left.right.parent = left

	fixMetrics(node)
	fixMetrics(left)
	return left
}

function rotateLeft<TItem>(node: IBinaryTreeNode<TItem>) {
	const right = node.right
	node.right = right.left
	right.left = node

	if (node.right != null) {
		node.right.parent = node
	}
	right.left.parent = right

	fixMetrics(node)
	fixMetrics(right)
	return right
}

function balance<TItem>(node: IBinaryTreeNode<TItem>) {
	fixMetrics(node)

	if (getBalanceFactor(node) === 2) {
		if (getBalanceFactor(node.right) < 0) {
			node.right = rotateRight(node.right)
			node.right.parent = node
		}
		return rotateLeft(node)
	}

	if (getBalanceFactor(node) === -2) {
		if (getBalanceFactor(node.left) > 0) {
			node.left = rotateLeft(node.left)
			node.left.parent = node
		}
		return rotateRight(node)
	}

	return node
}

function getLastLeft<TItem>(node: IBinaryTreeNode<TItem>) {
	let left = node
	while (left.left != null) {
		left = left.left
	}
	return left
}

// function removeLastLeft<TItem>(node: IBinaryTreeNode<TItem>) {
// 	if (node.left == null) {
// 		return node.right
// 	}
// 	node.left = removeLastLeft(node.left)
// 	return balance(node)
// }

const removeLastStack = []
function removeLastLeft<TItem>(node: IBinaryTreeNode<TItem>) {
	let stackLength = 0
	let result
	while (node.left != null) {
		removeLastStack[stackLength++] = node
		node = node.left
	}

	result = node.right
	while (stackLength > 0) {
		stackLength--
		node = removeLastStack[stackLength]
		removeLastStack[stackLength] = null
		node.left = result
		if (result != null) {
			result.parent = node
		}
		result = balance(node)
	}

	return result
}

let foundIndex = -1
// let deletedIndex = -1
let foundNode = null
const stackObj = []
const stackInt = []

export class BinaryTree<TItem> {
	public readonly compare: TCompareFunc<TItem>
	private readonly _objectPool: IObjectPool<IBinaryTreeNode<TItem>>

	constructor({
		compare,
		objectPool,
	}: {
		compare?: TCompareFunc<TItem>,
		objectPool?: IObjectPool<IBinaryTreeNode<TItem>>,
	} = {}) {
		this.compare = compare || compareDefault
		this._objectPool = objectPool
	}

	private _root: IBinaryTreeNode<TItem> = null

	public get size(): number {
		return this._root == null ? 0 : this._root.count
	}

	public get firstNode(): IBinaryTreeNode<TItem> {
		let node = this._root
		let prev: IBinaryTreeNode<TItem>
		while (node != null) {
			prev = node
			node = node.left
		}
		return prev
	}

	public get lastNode(): IBinaryTreeNode<TItem> {
		let node = this._root
		let prev: IBinaryTreeNode<TItem>
		while (node != null) {
			prev = node
			node = node.right
		}
		return prev
	}

	public get first(): TItem {
		const node = this.firstNode
		return node == null ? void 0 : node.data
	}

	public get last(): TItem {
		const node = this.lastNode
		return node == null ? void 0 : node.data
	}

	public createNode(data: TItem): IBinaryTreeNode<TItem> {
		const node = this._objectPool != null
			? this._objectPool.get()
			: null

		if (node != null) {
			node.data = data
			node.parent = null
			node.left = null
			node.right = null
			node.count = 1
			node.height = 1
			return node
		}

		return {
			data,
			parent: null,
			left: null,
			right: null,
			count: 1,
			height: 1,
		}
	}

	public releaseNode(node: IBinaryTreeNode<TItem>) {
		if (this._objectPool) {
			node.data = void 0
			node.left = null
			node.right = null
			this._objectPool.release(node)
		}
	}

	public _add(parent: IBinaryTreeNode<TItem>, node: IBinaryTreeNode<TItem>) {
		if (!parent) {
			return node
		}

		if (this.compare(node.data, parent.data) < 0) {
			foundIndex--
			if (parent.right != null) {
				foundIndex -= parent.right.count
			}
			parent.left = this._add(parent.left, node)
		} else {
			parent.right = this._add(parent.right, node)
		}

		if (parent.left != null) {
			parent.left.parent = parent
		}

		return balance(parent)
	}

	public _add_non_recursive(parent: IBinaryTreeNode<TItem>, node: IBinaryTreeNode<TItem>) {
		// const {compare} = this
		let stackLength = 0
		let result

		for (; parent != null;) {
			const compareResult = this.compare(node.data, parent.data)

			stackObj[stackLength] = parent
			if (compareResult < 0) {
				stackInt[stackLength] = 1
				parent = parent.left
			} else {
				stackInt[stackLength] = 0
				parent = parent.right
			}
			stackLength++
		}

		result = node
		for (; stackLength > 0;) {
			stackLength--
			parent = stackObj[stackLength]
			if (stackInt[stackLength] === 1) {
				parent.left = result
			} else {
				parent.right = result
			}

			if (parent.left != null) {
				parent.left.parent = parent
			}

			result = balance(parent)
		}

		return result
	}

	public _delete(node, item) {
		if (!node) {
			return null
		}

		const compareResult = this.compare(item, node.data)
		if (compareResult < 0) {
			foundIndex--
			if (node.right != null) {
				foundIndex -= node.right.count
			}
			node.left = this._delete(node.left, item)
			if (node.left != null) {
				node.left.parent = node
			}
		} else if (compareResult > 0) {
			node.right = this._delete(node.right, item)
			if (node.right != null) {
				node.right.parent = node
			}
		} else { // item == node.data
			foundIndex--
			if (node.right != null) {
				foundIndex -= node.right.count
			}

			const left = node.left
			const right = node.right

			foundNode = node

			if (!right) {
				return left
			}

			let lastLeft = right
			while (lastLeft.left != null) {
				lastLeft = lastLeft.left
			}
			// lastLeft.left =

			lastLeft.right = removeLastLeft(right)
			lastLeft.left = left
			if (lastLeft.right != null) {
				lastLeft.right.parent = lastLeft
			}
			if (lastLeft.left != null) {
				lastLeft.left.parent = lastLeft
			}
			return balance(lastLeft)
		}

		return balance(node)
	}

	public add(item: TItem): number {
		foundIndex = this._root == null ? 0 : this._root.count
		this._root = this._add(this._root, this.createNode(item))
		return foundIndex
	}

	public __add(item: TItem): number {
		// this._size++

		const node = this.createNode(item)

		let parent = this._root
		if (parent == null) {
			this._root = node
			return 0
		} else {
			const {compare} = this

			let index = parent.count

			while (true) {
				parent.count++

				let compareResult = compare(item, parent.data)

				// For even placement of equal elements in nodes
				if (compareResult === 0) {
					if (parent.left != null
						&& (parent.right == null || parent.left.count > parent.right.count)
					) {
						compareResult = 1
					} else {
						compareResult = -1
					}
				}

				if (compareResult < 0) {
					index--
					if (parent.right != null) {
						index -= parent.right.count
					}

					if (parent.left == null) {
						parent.left = node
						return index
					}
					parent = parent.left
				} else {
					if (parent.right == null) {
						parent.right = node
						return index
					}
					parent = parent.right
				}
			}
		}
	}

	public delete(item: TItem): number {
		foundIndex = this._root == null ? 0 : this._root.count
		foundNode = null
		this._root = this._delete(this._root, item)
		if (foundNode != null) {
			this.releaseNode(foundNode)
		}
		return foundIndex
	}

	// public __delete(item: TItem): number {
	// 	let parent = this._root
	// 	if (parent == null) {
	// 		return null
	// 	}
	//
	// 	const {compare} = this
	// 	let branchLength = 0
	// 	let prev
	// 	let prevSide = 0
	// 	let index = parent.count
	// 	while (parent != null) {
	// 		const compareResult = compare(item, parent.data)
	//
	// 		if (compareResult === 0) {
	// 			// found
	// 			// this._size--
	//
	// 			index--
	// 			if (parent.right) {
	// 				index -= parent.right.count
	// 			}
	//
	// 			let replaceNode
	// 			if (parent.left == null) {
	// 				replaceNode = parent.right
	// 			} else if (parent.right == null) {
	// 				replaceNode = parent.left
	// 			} else {
	// 				if (parent.left.count > parent.right.count) {
	// 					replaceNode = parent.left
	// 					let prevReplaceNode
	// 					while (replaceNode.right != null) {
	// 						replaceNode.count--
	// 						prevReplaceNode = replaceNode
	// 						replaceNode = replaceNode.right
	// 					}
	// 					if (prevReplaceNode != null) {
	// 						prevReplaceNode.right = replaceNode.left
	// 					} else {
	// 						parent.left = replaceNode.left
	// 					}
	// 				} else {
	// 					replaceNode = parent.right
	// 					let prevReplaceNode
	// 					while (replaceNode.left != null) {
	// 						replaceNode.count--
	// 						prevReplaceNode = replaceNode
	// 						replaceNode = replaceNode.left
	// 					}
	// 					if (prevReplaceNode != null) {
	// 						prevReplaceNode.left = replaceNode.right
	// 					} else {
	// 						parent.right = replaceNode.right
	// 					}
	// 				}
	//
	// 				replaceNode.left = parent.left
	// 				replaceNode.right = parent.right
	// 				replaceNode.count = parent.count - 1
	// 			}
	//
	// 			if (prevSide < 0) {
	// 				prev.left = replaceNode
	// 			} else if (prevSide > 0) {
	// 				prev.right = replaceNode
	// 			} else {
	// 				this._root = replaceNode
	// 			}
	//
	// 			for (let i = 0; i < branchLength; i++) {
	// 				branch[i].count--
	// 				branch[i] = null
	// 			}
	//
	// 			this.releaseNode(parent)
	//
	// 			return index
	// 		}
	//
	// 		branch[branchLength++] = parent
	// 		prev = parent
	// 		prevSide = compareResult
	//
	// 		if (compareResult < 0) {
	// 			index--
	// 			if (parent.right) {
	// 				index -= parent.right.count
	// 			}
	// 			parent = parent.left
	// 		} else  {
	// 			parent = parent.right
	// 		}
	// 	}
	//
	// 	for (let i = 0; i < branchLength; i++) {
	// 		branch[i] = null
	// 	}
	//
	// 	return null
	// }

	public has(item: TItem): boolean {
		return this.getNodeByItem(item) != null
	}

	public getIndex(item: TItem): number {
		let parent = this._root
		if (parent == null) {
			return -1
		}

		const {compare} = this

		let index = parent.count

		while (parent != null) {
			const compareResult = compare(item, parent.data)

			if (compareResult === 0) {
				index--
				if (parent.right) {
					index -= parent.right.count
				}
				return index
			}

			if (compareResult < 0) {
				index--
				if (parent.right) {
					index -= parent.right.count
				}
				parent = parent.left
			} else  {
				parent = parent.right
			}
		}

		return null
	}

	public getNodeByItem(item: TItem): IBinaryTreeNode<TItem> {
		let parent = this._root
		const {compare} = this
		while (parent != null) {
			const compareResult = compare(item, parent.data)

			if (compareResult === 0) {
				return parent
			}

			if (compareResult < 0) {
				parent = parent.left
			} else  {
				parent = parent.right
			}
		}

		return null
	}

	public getNodeByIndex(index: number): IBinaryTreeNode<TItem> {
		if (index < 0) {
			return null
		}

		let parent: IBinaryTreeNode<TItem> = this._root
		while (parent != null) {
			if (index >= parent.count) {
				return null
			}
			const leftCount = parent.left == null ? 0 : parent.left.count
			if (index < leftCount) {
				parent = parent.left
			} else if (index > leftCount) {
				index = index - leftCount - 1
				parent = parent.right
			} else {
				return parent
			}
		}

		return null
	}

	public getByIndex(index: number): TItem {
		const node = this.getNodeByIndex(index)
		return node == null ? void 0 : node.data
	}

	private _forEachNodes(
		parent: IBinaryTreeNode<TItem>,
		index: number,
		callbackfn: (value: IBinaryTreeNode<TItem>, index: number, binaryTree: BinaryTree<TItem>) => void,
		thisArg?: any,
	): void {
		if (parent.left != null) {
			this._forEachNodes(parent.left, index, callbackfn)
			index += parent.left.count
		}

		callbackfn.call(thisArg, parent, index, this)

		if (parent.right != null) {
			this._forEachNodes(
				parent.right,
				index + 1,
				callbackfn,
			)
		}
	}

	public forEachNodes(
		callbackfn: (value: IBinaryTreeNode<TItem>, index: number, binaryTree: BinaryTree<TItem>) => void,
		thisArg?: any,
	): void {
		const {_root} = this
		if (_root != null) {
			this._forEachNodes(_root, 0, callbackfn, thisArg)
		}
	}

	public forEach(
		callbackfn: (value: TItem, index: number, binaryTree: BinaryTree<TItem>) => void,
		thisArg?: any,
	): void {
		this.forEachNodes((value, index, binaryTree) => {
			callbackfn(value.data, index, binaryTree)
		}, thisArg)
	}

	// public clear() {
	// 	this._root = null
	// }
}
