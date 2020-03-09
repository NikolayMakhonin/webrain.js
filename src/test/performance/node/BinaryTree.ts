// @ts-ignore
import {calcPerformance} from 'rdtsc'
import {BinaryTree, IBinaryTreeNode} from '../../../main/common/lists/BinaryTree'
import {ObjectPool} from '../../../main/common/lists/ObjectPool'
import {getRandomFunc, Random} from '../../../main/common/random/Random'
import {assert} from '../../../main/common/test/Assert'
import {CalcType} from '../../../main/common/test/calc'
import {calcMemAllocate} from '../../../main/common/test/calc-mem-allocate'
import {describe, it} from '../../../main/common/test/Mocha'

describe('BinaryTree perf', function() {
	const binaryTreeObjectBool = new ObjectPool<IBinaryTreeNode<any>>(1000000)

	it('add / delete', function() {
		this.timeout(300000)

		const binaryTree = new BinaryTree<number>({
			objectPool: binaryTreeObjectBool,
		})
		const addItems = [0, 1, 2, 3, 4, 5, 6]
		const deleteItems = [0, 1, 2, 3, 4, 5, 6]
		const len = addItems.length

		const result = calcPerformance(
			10000,
			() => {
				// empty
			}, () => { // init
				Random.arrayShuffle(addItems)
				Random.arrayShuffle(deleteItems)
			}, () => { // 525
				for (let i = 0; i < len; i++) {
					binaryTree.add(addItems[i])
				}
			}, () => { // 318
				for (let i = 0; i < len; i++) {
					binaryTree.has(addItems[i])
				}
			}, () => { // 950
				for (let i = 0; i < len; i++) {
					binaryTree.delete(deleteItems[i])
				}
			},
		)

		console.log(result)
  		/*

  absoluteDiff: [ 732, 525, 318, 950 ],
  absoluteDiff: [ 748, 522, 323, 917 ],
  absoluteDiff: [ 732, 529, 318, 924 ],

  // AVL with recursion
  absoluteDiff: [ 704, 1475, 287, 1199 ],
  absoluteDiff: [ 724, 1437, 287, 1161 ],
  absoluteDiff: [ 744, 1479, 318, 1242 ],

  absoluteDiff: [ 712, 1291, 294, 1276 ],
  absoluteDiff: [ 748, 1319, 315, 1358 ],
  absoluteDiff: [ 736, 1369, 303, 1365 ],

  // AVL removed add recursion
  absoluteDiff: [ 732, 1774, 291, 1215 ],
  absoluteDiff: [ 755, 1790, 318, 1234 ],
  absoluteDiff: [ 732, 1771, 299, 1181 ],
  absoluteDiff: [ 751, 1713, 318, 1219 ],
  absoluteDiff: [ 725, 1667, 307, 1227 ],
  absoluteDiff: [ 736, 1652, 299, 1207 ],
  absoluteDiff: [ 736, 1636, 291, 1180 ],
  absoluteDiff: [ 732, 1617, 303, 1169 ],

  // AVL removed removeLastLeft recursion
  absoluteDiff: [ 732, 1322, 318, 1342 ],
  absoluteDiff: [ 720, 1253, 291, 1257 ],
  absoluteDiff: [ 751, 1333, 318, 1326 ],
  absoluteDiff: [ 721, 1277, 295, 1238 ],

  		*/
	})

	it('add / delete memory', function() {
		this.timeout(300000)

		const binaryTree = new BinaryTree<number>({
			objectPool: binaryTreeObjectBool,
		})
		const addItems = [0, 1, 2, 3, 4, 5, 6]
		const deleteItems = [0, 1, 2, 3, 4, 5, 6]
		const len = addItems.length
		Random.arrayShuffle(addItems)
		Random.arrayShuffle(deleteItems)

		const result = calcMemAllocate(CalcType.Min, 2000, () => {
			for (let i = 0; i < len; i++) {
				binaryTree.add(addItems[i])
			}
			// for (let i = 0; i < len; i++) {
			// 	binaryTree.has(addItems[i])
			// }
			for (let i = 0; i < len; i++) {
				binaryTree.delete(deleteItems[i])
			}
		})

		console.log(result.toString())

		result.averageValue.forEach(o => assert.ok(o <= 0))
	})
})
