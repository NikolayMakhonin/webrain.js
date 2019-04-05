import {
	SetChangedType,
} from '../../../../../main/common/lists/contracts/ISetChanged'
import {ObservableSet} from '../../../../../main/common/lists/ObservableSet'
import {
	ISetAction,
	TestSet, THIS,
} from './helpers/TestSet'
import {ITestActionsWithDescription} from './helpers/TestVariants'

declare const assert: any
declare const after: any

describe('common > main > lists > ObservableSet', function() {
	this.timeout(20000)

	const testSet = TestSet.test

	after(function() {
		console.log('Total Set tests >= ' + TestSet.totalSetTests)
	})

	it('constructor', function() {
		let set

		set = new ObservableSet()
		assert.strictEqual(set.size, 0)
	})

	it('add', function() {
		function add<T>(
			item: T,
		): ITestActionsWithDescription<ISetAction<T>> {
			return {
				actions: [
					list => list.add(item),
				],
				description: `add(${JSON.stringify(item)})\n`,
			}
		}

		testSet({
			array: [[]],
			expected: {
				array: ['0'],
				returnValue: THIS,
				setChanged: [{
					type: SetChangedType.Added,
					newItems: ['0'],
				}],
			},
			actions: [
				add('0'),
			],
		})
	})
})
