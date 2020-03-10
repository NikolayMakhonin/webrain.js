import {ObjectPool} from '../../../../../main/common/lists/ObjectPool'
import {PairingHeap, PairingNode} from '../../../../../main/common/lists/PairingHeap'
import {assert} from '../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../main/common/test/Mocha'

declare const after: any

const objectPool = new ObjectPool<PairingNode<any>>(1000000)

function getMinIndex<TItem>(arr: Array<PairingNode<TItem>>): number {
	let min
	let minIndex
	for (let i = 0, len = arr.length; i < len; i++) {
		const item = arr[i]
		if (i === 0 || item.item < min) {
			min = item.item
			minIndex = i
		}
	}
	return minIndex
}

class PairingHeapTester<TItem> {
	private readonly _checkItems: Array<PairingNode<TItem>>
	private readonly _heap: PairingHeap<TItem>

	constructor() {
		this._heap = new PairingHeap({objectPool})
		this._checkItems = []
		this.check()
	}

	public check() {
		const {_heap, _checkItems} = this

		// check size
		assert.strictEqual(_heap.size, _checkItems.length)
	}

	public add(item: TItem) {
		const node = this._heap.add(item)
		assert.strictEqual(node.item, item)
		this._checkItems.push(node)
		this.check()
		return node
	}

	public delete(node: PairingNode<TItem>) {
		const index = this._checkItems.indexOf(node)
		const checkItem = node.item
		if (index >= 0) {
			assert.ok(index < this._checkItems.length)
			assert.strictEqual(this._checkItems[index], node)
			this._checkItems.splice(index, 1)
		}
		
		this._heap.delete(node)

		if (node == null) {
			assert.strictEqual(index, -1)
		} else {
			assert.ok(index >= 0)
		}

		this.check()
	}

	public deleteMin() {
		const index = getMinIndex(this._checkItems)
		const checkItem = index >= 0
			? this._checkItems[index].item
			: null
			
		const item = this._heap.deleteMin()
		assert.strictEqual(item, checkItem)
		
		if (item == null) {
			assert.strictEqual(this._checkItems.length, 0)
		} else {
			assert.ok(index < this._checkItems.length)
			this._checkItems.splice(index, 1)
		}

		this.check()

		return item
	}
}

describe('common > main > PairingHeap', function() {
	this.timeout(6000000)

	let totalTests = 0

	after(function() {
		console.log('Total PairingHeap tests >= ' + totalTests)
	})

	function testVariant(
		heap: PairingHeapTester<number>,
		addItems: number[],
		deleteIndexes: number[],
	) {
		try {
			const deleteNodes = []
			for (let i = 0, len = addItems.length; i < len; i++) {
				deleteNodes.push(heap.add(addItems[i]))
			}
			for (let i = 0, len = deleteNodes.length; i < len; i++) {
				heap.delete(deleteNodes[i])
			}
			for (let i = 0, len = addItems.length; i < len; i++) {
				deleteNodes.push(heap.add(addItems[i]))
			}
			for (let i = 0, len = addItems.length; i < len; i++) {
				assert.strictEqual(heap.deleteMin(), i)
			}
			// heap.deleteMin()
		} catch (ex) {
			console.log(`testsCount: ${totalTests}`)
			console.log(`addItems: ${addItems.join(',')}`)
			console.log(`deleteItems: ${deleteIndexes.join(',')}`)
			throw ex
		}
		totalTests++
	}

	it('add / delete', function() {
		const heap = new PairingHeapTester<number>()

		testVariant(
			heap,
			[0, 3, 1, 5, 4, 6, 2],
			[1, 5, 2, 4, 3, 0, 6],
		)
	})

	it('add / delete random', function() {
		const heap = new PairingHeapTester<number>()
		const variants = [0, 1, 2, 3, 4, 5, 6]
		for (let i = 0; i < 10000; i++) {
			const addItems = variants.slice().sort(() => Math.random() > 0.5 ? 1 : -1)
			const deleteIndexes = variants.slice().sort(() => Math.random() > 0.5 ? 1 : -1)
			testVariant(
				heap,
				addItems,
				deleteIndexes,
			)
		}
	})
})
