/* tslint:disable:no-construct use-primitive-type */
import {assert} from '../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../main/common/test/Mocha'
import {IArrayTree, iterablesToArrays, treeToSequenceVariants} from '../../../../../main/common/test/Variants'

declare const after

describe('common > test > Variants', function() {
	function iterablesToString<T>(iterables: Iterable<Iterable<T>>): string {
		const iterablesArray = Array.from(iterables)
		const str = iterablesArray
			.map(iterable => `[ ${Array.from(iterable).join(', ')} ]`)
			.join(',\r\n')

		return str
	}

	function testTree<T>(tree: IArrayTree<T>, resultArrays: T[][]) {
		const iterables = treeToSequenceVariants(tree)
		let arrays = iterablesToArrays(iterables)
		// console.log(iterablesToString(arrays))
		assert.deepStrictEqual(arrays, resultArrays)
		arrays = iterablesToArrays(iterables)
		assert.deepStrictEqual(arrays, resultArrays)
	}

	it('simple', function() {
		testTree(
			[ 1 ],
			[ [ 1 ] ],
		)
		testTree(
			[ [ 1, 2 ] ],
			[ [ 1 ], [ 2 ] ],
		)
		testTree(
			[ 1, 2 ],
			[ [ 1, 2 ] ],
		)
		testTree(
			[ 1, 2, 3 ],
			[ [ 1, 2, 3 ] ],
		)
		testTree(
			[ 1, [ 2, 3 ] ],
			[ [ 1, 2 ], [ 1, 3 ] ],
		)
		testTree(
			[ 1, [ 2, 3 ], [ 4, 5 ] ],
			[ [ 1, 2, 4 ], [ 1, 2, 5 ], [ 1, 3, 4 ], [ 1, 3, 5 ] ],
		)
	})

	it('base', function() {
		testTree(
			[
				1,
				[ 2, 3 ],
				[ 4, 5, [ 6, [ 7, 8 ] ] ],
			],
			[
				[ 1, 2, 4 ],
				[ 1, 2, 5 ],
				[ 1, 2, 6, 7 ],
				[ 1, 2, 6, 8 ],
				[ 1, 3, 4 ],
				[ 1, 3, 5 ],
				[ 1, 3, 6, 7 ],
				[ 1, 3, 6, 8 ],
			],
		)
	})
})
