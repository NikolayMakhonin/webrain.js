import {BinaryTree, TCompareFunc} from '../../../../../main/common/lists/BinaryTree'
import {assert} from '../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../main/common/test/Mocha'
import {forEachPermutation} from '../../../../../main/common/test/permutations'
import {TestMap} from './src/helpers/TestMap'

declare const after

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
			assert.strictEqual(_binaryTree.getByIndex(i), _checkItems[i])
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
	this.timeout(600000)

	let totalMapTests = 0

	after(function() {
		console.log('Total BinaryTree tests >= ' + TestMap.totalMapTests)
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
			console.log(`testsCount: ${totalMapTests}`)
			console.log(`addItems: ${addItems.join(',')}`)
			console.log(`deleteItems: ${deleteItems.join(',')}`)
			throw ex
		}
		totalMapTests++
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

	it('add / delete combinations', function() {
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
