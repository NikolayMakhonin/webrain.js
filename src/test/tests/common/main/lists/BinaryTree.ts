import {BinaryTree, IBinaryTreeNode, TCompareFunc} from '../../../../../main/common/lists/BinaryTree'
import {ObjectPool} from '../../../../../main/common/lists/ObjectPool'
import {assert} from '../../../../../main/common/test/Assert'
import {describe, it, xit} from '../../../../../main/common/test/Mocha'
import {forEachPermutation, getFactorial} from '../../../../../main/common/test/permutations'

declare const after

const binaryTreeObjectBool = new ObjectPool<IBinaryTreeNode<any>>(1000000)

function checkHeight<TItem>(node: IBinaryTreeNode<TItem>): number {
	if (node == null) {
		return 0
	}
	const heightLeft = checkHeight(node.left)
	const heightRight = checkHeight(node.right)
	const height = Math.max(heightLeft, heightRight) + 1
	assert.strictEqual(node.height, height)
	assert.ok(Math.abs(heightRight - heightLeft) <= 1)
	return height
}

class BinaryTreeTester<TItem> {
	private readonly _checkItems: TItem[]
	private readonly _binaryTree: BinaryTree<TItem>

	constructor(compare?: TCompareFunc<TItem>) {
		this._binaryTree = new BinaryTree({
			objectPool: binaryTreeObjectBool,
		})
		this._checkItems = []
		this.check()
	}

	public check(...deletedItems: TItem[]) {
		const {_binaryTree, _checkItems} = this

		// check size
		assert.strictEqual(_binaryTree.size, _checkItems.length)

		// check sort of _checkItems
		for (let i = 1, len = _checkItems.length; i < len; i++) {
			assert.ok(this._binaryTree.compare(_checkItems[i - 1], _checkItems[i]) <= 0)
		}

		// check deleted
		for (let i = 0; i < deletedItems.length; i++) {
			assert.strictEqual(_binaryTree.has(deletedItems[i]), false)
			assert.strictEqual(_binaryTree.getIndex(deletedItems[i]), -1)
		}

		// check height
		checkHeight((_binaryTree as any)._root)

		// check items
		for (let i = 0; i < _checkItems.length; i++) {
			assert.strictEqual(_binaryTree.has(_checkItems[i]), true)
			assert.strictEqual(_binaryTree.getByIndex(i), _checkItems[i])
			assert.strictEqual(_binaryTree.getIndex(_checkItems[i]), i)
		}

		let checkIndex = 0
		_binaryTree.forEach((value, index, obj) => {
			assert.strictEqual(obj, _binaryTree)
			assert.strictEqual(index, checkIndex++)
			assert.strictEqual(value, _checkItems[index])
		})

		checkIndex = 0
		_binaryTree.forEachNodes((node, index, obj) => {
			assert.strictEqual(obj, _binaryTree)
			assert.strictEqual(index, checkIndex++)
			assert.strictEqual(node.data, _checkItems[index])

			const leftCount = node.left == null ? 0 : node.left.count
			const rightCount = node.right == null ? 0 : node.right.count
			assert.strictEqual(node.count, leftCount + rightCount + 1)

			const leftHeight = node.left == null ? 0 : node.left.height
			const rightHeight = node.right == null ? 0 : node.right.height
			assert.strictEqual(node.height, Math.max(leftHeight, rightHeight) + 1)
		})

		// check additional properties
		if (_checkItems.length > 0) {
			assert.strictEqual(_binaryTree.first, _checkItems[0])
			assert.strictEqual(_binaryTree.last, _checkItems[_checkItems.length - 1])
		} else {
			assert.strictEqual(_binaryTree.first, void 0)
			assert.strictEqual(_binaryTree.last, void 0)
		}
	}

	public add(item: TItem) {
		const index = this._binaryTree.add(item)
		assert.ok(index >= 0, `${index}`)
		assert.ok(index <= this._checkItems.length, `${index}`)
		this._checkItems.splice(index, 0, item)
		this.check()
	}

	public delete(item: TItem) {
		const index = this._binaryTree.delete(item)
		if (index == null) {
			assert.strictEqual(this._checkItems.indexOf(item), -1)
		} else {
			assert.ok(index >= 0)
			assert.ok(index < this._checkItems.length)
			assert.strictEqual(this._checkItems[index], item)
		}

		this._checkItems.splice(index, 1)
		this.check()
	}
}

describe('common > main > lists > BinaryTree', function() {
	this.timeout(6000000)

	let totalTests = 0

	after(function() {
		console.log('Total BinaryTree tests >= ' + totalTests)
	})

	function testVariant<TItem>(
		binaryTree: BinaryTreeTester<TItem>,
		addItems: TItem[],
		deleteItems: TItem[],
	) {
		try {
			for (let i = 0, len = addItems.length; i < len; i++) {
				binaryTree.add(addItems[i])
			}
			for (let i = 0, len = deleteItems.length; i < len; i++) {
				binaryTree.delete(deleteItems[i])
			}
		} catch (ex) {
			console.log(`testsCount: ${totalTests}`)
			console.log(`addItems: ${addItems.join(',')}`)
			console.log(`deleteItems: ${deleteItems.join(',')}`)
			throw ex
		}
		totalTests++
		if (totalTests % 100000 === 0) {
			const maxTests = getFactorial(addItems.length) * getFactorial(addItems.length)
			if (totalTests < maxTests) {
				console.log(`progress: ${totalTests} / ${maxTests} = ${Math.round(totalTests / maxTests * 100)}%`)
			}
		}
	}

	it('add / delete', function() {
		const binaryTree = new BinaryTreeTester<number>()

		testVariant(
			binaryTree,
			[3, 5, 1, 4, 2, 0, 6],
			[4, 5, 3, 1, 6, 2, 0],
		)

		testVariant(
			binaryTree,
			[0, 1, 4, 3, 2, 5, 6],
			[0, 1, 4, 2, 3, 5, 6],
		)
	})

	it('add / delete random', function() {
		const binaryTree = new BinaryTreeTester<number>()
		const variants = [0, 1, 2, 3, 4, 5, 6]
		for (let i = 0; i < 10000; i++) {
			const addItems = variants.slice().sort(() => Math.random() > 0.5 ? 1 : -1)
			const deleteItems = variants.slice().sort(() => Math.random() > 0.5 ? 1 : -1)
			testVariant(
				binaryTree,
				addItems,
				deleteItems,
			)
		}
	})

	xit('add / delete combinations', function() {
		const binaryTree = new BinaryTreeTester<number>()
		const variants = [0, 1, 2, 3, 4, 5, 6]
		forEachPermutation(variants, addItems => {
			forEachPermutation(variants, deleteItems => {
				testVariant(
					binaryTree,
					addItems,
					deleteItems,
				)
			})
		})
	})
})
