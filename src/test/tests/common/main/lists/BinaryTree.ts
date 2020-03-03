import {BinaryTree, TCompareFunc} from '../../../../../main/common/lists/BinaryTree'
import {assert} from '../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../main/common/test/Mocha'

class BinaryTreeTester<TItem> {
	private readonly _checkItems: TItem[]
	private readonly _binaryTree: BinaryTree<TItem>

	constructor(compare?: TCompareFunc<TItem>) {
		this._binaryTree = new BinaryTree()
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
		}

		// check items
		for (let i = 0; i < _checkItems.length; i++) {
			assert.strictEqual(_binaryTree.has(_checkItems[i]), true)
		}

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
		assert.ok(index >= 0)
		assert.ok(index <= this._checkItems.length)
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
	function checkDeletedItems(binaryTree: BinaryTree<number>, ...deletedItems: number[]) {
		for (let i = 0; i < deletedItems.length; i++) {
			assert.strictEqual(binaryTree.has(deletedItems[i]), false)
		}
	}

	function checkBinaryTree(binaryTree: BinaryTree<number>, ...items: number[]) {
		assert.strictEqual(binaryTree.size, items.length)
		for (let i = 0; i < items.length; i++) {
			assert.strictEqual(binaryTree.has(items[i]), true)
		}
		if (items.length > 0) {
			assert.strictEqual(binaryTree.first, items[0])
			assert.strictEqual(binaryTree.last, items[items.length - 1])
		} else {
			assert.strictEqual(binaryTree.first, null)
			assert.strictEqual(binaryTree.last, null)
		}
	}

	function create() {

	}

	it('add / delete', function() {
		const binaryTree = new BinaryTreeTester<number>()
		binaryTree.add(3)
		binaryTree.add(5)
		binaryTree.add(1)
		binaryTree.add(4)
		binaryTree.add(2)
		binaryTree.add(0)
		binaryTree.add(6)

		binaryTree.delete(4)
		binaryTree.delete(5)
		binaryTree.delete(3)
		binaryTree.delete(1)
		binaryTree.delete(6)
		binaryTree.delete(2)
		binaryTree.delete(0)
	})
})
