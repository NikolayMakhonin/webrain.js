export interface IBinaryTreeNode<TItem> {
	data: TItem
	left: IBinaryTreeNode<TItem>
	right: IBinaryTreeNode<TItem>
	count: number
}

export type TCompareFunc<T> = (o1: T, o2: T) => -1|0|1

const branch = []

function compareDefault(o1, o2) {
	if (o1 === o2) {
		return 0
	}
	return o1 > o2 ? 1 : -1
}

export class BinaryTree<TItem> {
	public readonly compare: TCompareFunc<TItem>

	constructor(compare?: TCompareFunc<TItem>) {
		this.compare = compare || compareDefault
	}

	private _root: IBinaryTreeNode<TItem> = null
	private _first: IBinaryTreeNode<TItem> = null
	private _last: IBinaryTreeNode<TItem> = null

	public get size(): number {
		return this._root == null ? 0 : this._root.count
	}

	public get first(): TItem {
		return this._first == null ? void 0 : this._first.data
	}

	public get last(): TItem {
		return this._last == null ? void 0 : this._last.data
	}

	public add(item: TItem): number {
		// this._size++

		const node: IBinaryTreeNode<TItem> = {
			data: item,
			left: null,
			right: null,
			count: 1,
		}

		let parent: IBinaryTreeNode<TItem> = this._root
		if (parent == null) {
			this._root = node
			this._last = node
			this._first = node
			return 0
		} else {
			const {compare} = this

			let index = parent.count

			while (true) {
				parent.count++

				let compareResult = compare(item, parent.data)

				// For even placement of equal elements in nodes
				if (compareResult === 0) {
					if (parent === this._first
						|| parent !== this._last
						&& parent.left != null
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
						if (parent === this._first) {
							this._first = node
						}
						return index
					}
					parent = parent.left
				} else {
					if (parent.right == null) {
						parent.right = node
						if (parent === this._last) {
							this._last = node
						}
						return index
					}
					parent = parent.right
				}
			}
		}
	}

	public delete(item: TItem): number {
		let parent: IBinaryTreeNode<TItem> = this._root
		if (parent == null) {
			return null
		}

		const {compare} = this
		let branchLength = 0
		let prev
		let prevSide = 0
		let index = parent.count
		while (parent != null) {
			const compareResult = compare(item, parent.data)

			if (compareResult === 0) {
				// found
				// this._size--

				index--
				if (parent.right) {
					index -= parent.right.count
				}

				let replaceNode
				if (parent.left == null) {
					replaceNode = parent.right
				} else if (parent.right == null) {
					replaceNode = parent.left
				} else {
					if (parent.left.count > parent.right.count) {
						replaceNode = parent.right
						let prevReplaceNode
						while (replaceNode.left != null) {
							replaceNode.count--
							prevReplaceNode = replaceNode
							replaceNode = replaceNode.left
						}
						if (prevReplaceNode != null) {
							prevReplaceNode.left = replaceNode.right
						}
					} else {
						replaceNode = parent.left
						let prevReplaceNode
						while (replaceNode.right != null) {
							replaceNode.count--
							prevReplaceNode = replaceNode
							replaceNode = replaceNode.right
						}
						if (prevReplaceNode != null) {
							prevReplaceNode.right = replaceNode.left
						}
					}

					replaceNode.left = parent.left
					replaceNode.right = parent.right
					replaceNode.count = parent.count - 1
				}

				if (prevSide < 0) {
					prev.left = replaceNode
				} else if (prevSide > 0) {
					prev.right = replaceNode
				} else {
					this._root = replaceNode
				}

				for (let i = 0; i < branchLength; i++) {
					branch[i].count--
					branch[i] = null
				}

				return index
			}

			branch[branchLength++] = parent
			prev = parent
			prevSide = compareResult

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

		for (let i = 0; i < branchLength; i++) {
			branch[i] = null
		}

		return null
	}

	public has(item: TItem): boolean {
		return this.getNodeByItem(item) != null
	}

	public getNodeByItem(item: TItem): IBinaryTreeNode<TItem> {
		let parent: IBinaryTreeNode<TItem> = this._root
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
			const leftCount = parent.left.count
			if (index < leftCount) {
				parent = parent.left
			} else if (index > leftCount) {
				index -= leftCount
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
		}

		callbackfn.call(thisArg, parent, index, this)

		if (parent.right != null) {
			this._forEachNodes(parent.right, index + parent.left.count + 1, callbackfn)
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
}