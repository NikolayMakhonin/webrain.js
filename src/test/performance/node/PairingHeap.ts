// @ts-ignore
import {calcPerformance} from 'rdtsc'
import {assert} from 'webrain/dist/js/main/common/test/Assert'
import {CalcType} from 'webrain/dist/js/main/common/test/calc'
import {calcMemAllocate} from 'webrain/dist/js/main/common/test/calc-mem-allocate'
import {describe, it} from 'webrain/dist/js/main/common/test/Mocha'
import {ObjectPool} from '../../../main/common/lists/ObjectPool'
import {PairingHeap, PairingNode} from '../../../main/common/lists/PairingHeap'

describe('PairingHeap perf', function() {
	const objectPool = new ObjectPool<PairingNode<any, any>>(1000000)

	it('add / delete', function() {
		this.timeout(300000)

		const binaryTree = new PairingHeap<{id: number}, {id: number}>({
			objectPool,
			lessThanFunc(o1, o2) {
				return o1.id < o2.id
			},
		})
		const addItems = [6, 1, 5, 3, 0, 4, 2]
			.map(id => ({id}))

		const len = addItems.length

		const result = calcPerformance(
			10000,
			() => {
				// empty
				for (let i = 0; i < len; i++) {
					const item = addItems[i]
				}
			}, () => { // 333
				for (let i = 0; i < len; i++) {
					const item = addItems[i]
					binaryTree.add(item, item)
				}
			}, () => { // 7
				for (let i = 0; i < len; i++) {
					const item = addItems[i]
					binaryTree.getMin()
				}
			}, () => { // 555
				for (let i = 0; i < len; i++) {
					const item = addItems[i]
					binaryTree.deleteMin()
				}
			},
		)

		console.log(result)
		/*
  // without compareFunc
  absoluteDiff: [ 302, -1, 521 ],
  absoluteDiff: [ 333, -1, 548 ],
  absoluteDiff: [ 334, 4, 540 ],
  absoluteDiff: [ 322, 1, 541 ],
  absoluteDiff: [ 322, 4, 548 ],

  absoluteDiff: [ 314, 3, 544 ],
  absoluteDiff: [ 318, 0, 567 ],
  absoluteDiff: [ 333, 0, 544 ],
  absoluteDiff: [ 327, -3, 572 ],
  absoluteDiff: [ 322, -4, 560 ],
  absoluteDiff: [ 311, -38, 525 ],

  // with compareFunc
  absoluteDiff: [ 329, 0, 552 ],
  absoluteDiff: [ 322, 0, 544 ],
  absoluteDiff: [ 319, -7, 548 ],

  absoluteDiff: [ 330, 0, 560 ],
  absoluteDiff: [ 326, 0, 567 ],
  absoluteDiff: [ 323, -3, 561 ],

  // with custom comparer
  absoluteDiff: [ 357, 0, 579 ],
  absoluteDiff: [ 357, 0, 563 ],
  absoluteDiff: [ 360, 7, 552 ],
  absoluteDiff: [ 360, -4, 548 ],
  absoluteDiff: [ 349, 4, 590 ],
  absoluteDiff: [ 349, 0, 552 ],
		 */
	})

	it('add / delete memory', function() {
		this.timeout(300000)

		const binaryTree = new PairingHeap<number, number>({objectPool})
		const addItems = [6, 1, 5, 3, 0, 4, 2]
		const len = addItems.length

		const result = calcMemAllocate(CalcType.Min, 2000, () => {
			for (let i = 0; i < len; i++) {
				const item = addItems[i]
				binaryTree.add(item, item)
			}
			for (let i = 0; i < len; i++) {
				binaryTree.getMin()
				binaryTree.deleteMin()
			}
		})

		console.log(result.toString())

		result.averageValue.forEach(o => assert.ok(o <= 0))
	})
})
