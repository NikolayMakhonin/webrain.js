import {
	MapChangedType,
} from '../../../../../main/common/lists/contracts/IMapChanged'
import {compareFast} from '../../../../../main/common/lists/helpers/compare'
import {ObservableMap} from '../../../../../main/common/lists/ObservableMap'
import {allValues, shuffle} from './src/helpers/common'
import {
	IMapAction,
	TestMap, THIS,
} from './src/helpers/TestMap'
import {ITestActionsWithDescription} from './src/helpers/TestVariants'

declare const assert: any
declare const after: any

describe('common > main > lists > ObservableMap', function() {
	this.timeout(20000)

	const testMap = TestMap.test

	after(function() {
		console.log('Total Map tests >= ' + TestMap.totalMapTests)
	})

	it('constructor', function() {
		let map

		map = new ObservableMap()
		assert.strictEqual(map.size, 0)
	})

	it('set', function() {
		function setArray<K, V>(list, array: Array<[K, V]>) {
			let result = false
			for (const item of array) {
				result = list.set(...item) || result
			}
			return result
		}

		function set<K, V>(
			key: K,
			value: V,
		): ITestActionsWithDescription<IMapAction<K, V>> {
			return {
				actions: [
					list => list.set(key, value),
				],
				description: `set(${JSON.stringify(key)}, ${JSON.stringify(value)})\n`,
			}
		}

		testMap({
			array: [[]],
			expected: {
				array: [['0', '1']],
				returnValue: THIS,
				mapChanged: [{
					type: MapChangedType.Added,
					key: '0',
					newValue: '1',
				}],
			},
			actions: [
				set('0', '1'),
			],
		})

		testMap({
			array: [[['0', '1']]],
			expected: {
				array: [['0', '2']],
				returnValue: THIS,
				mapChanged: [{
					type: MapChangedType.Set,
					key: '0',
					oldValue: '1',
					newValue: '2',
				}],
			},
			actions: [
				set('0', '2'),
			],
		})

		testMap({
			array: [[['0', '1']]],
			expected: {
				array: [['0', '1'], ['2', '3']],
				returnValue: THIS,
				mapChanged: [{
					type: MapChangedType.Added,
					key: '2',
					newValue: '3',
				}],
			},
			actions: [
				set('2', '3'),
			],
		})

		const entries: any = allValues.map((o, i) => [o, allValues[allValues.length - 1 - i]])
		const entriesShuffle = shuffle(entries)

		testMap({
			array: [[]],
			expected: {
				array: entries,
				returnValue: THIS,
				propertyChanged: entriesShuffle
					.map((o, i) => ({
						name: 'size',
						oldValue: i,
						newValue: i + 1,
					})),
				mapChanged: entriesShuffle
					.map((o, i) => ({
						type: MapChangedType.Added,
						key: o[0],
						newValue: o[1],
					}))
					.concat(entriesShuffle
						.map((o, i) => ({
							type: MapChangedType.Set,
							key: o[0],
							oldValue: o[1],
							newValue: o[1],
						}))),
			},
			actions: [
				list => setArray(list, entriesShuffle.concat(entriesShuffle)),
			],
		})
	})

	// it('delete', function() {
	// 	function removeArray<K, V>(list, array: Array<[K, V]>) {
	// 		let result = false
	// 		for (const item of array) {
	// 			result = list.delete(item) || result
	// 		}
	// 		return result
	// 	}
	//
	// 	function remove<K, V>(
	// 		item: T,
	// 	): ITestActionsWithDescription<IMapAction<K, V>> {
	// 		return {
	// 			actions: [
	// 				list => list.delete(item),
	// 			],
	// 			description: `delete(${JSON.stringify(item)})\n`,
	// 		}
	// 	}
	//
	// 	testMap({
	// 		array: [[]],
	// 		expected: {
	// 			array: [],
	// 			returnValue: false,
	// 		},
	// 		actions: [
	// 			remove('0'),
	// 		],
	// 	})
	//
	// 	testMap({
	// 		array: [['0']],
	// 		expected: {
	// 			array: [],
	// 			returnValue: true,
	// 			mapChanged: [{
	// 				type: MapChangedType.Removed,
	// 				oldItems: ['0'],
	// 			}],
	// 		},
	// 		actions: [
	// 			remove('0'),
	// 		],
	// 	})
	//
	// 	testMap({
	// 		array: [['2', '1']],
	// 		expected: {
	// 			array: ['1'],
	// 			returnValue: true,
	// 			mapChanged: [{
	// 				type: MapChangedType.Removed,
	// 				oldItems: ['2'],
	// 			}],
	// 		},
	// 		actions: [
	// 			remove('2'),
	// 		],
	// 	})
	//
	// 	const allValuesShuffle = shuffle(allValues)
	//
	// 	testMap({
	// 		array: [allValuesShuffle],
	// 		expected: {
	// 			array: [],
	// 			returnValue: true,
	// 			propertyChanged: allValuesShuffle
	// 				.map((o, i) => ({
	// 					name: 'size',
	// 					oldValue: allValuesShuffle.length - i,
	// 					newValue: allValuesShuffle.length - i - 1,
	// 				})),
	// 			mapChanged: allValuesShuffle
	// 				.map((o, i) => ({
	// 					type: MapChangedType.Removed,
	// 					oldItems: [o],
	// 				})),
	// 		},
	// 		actions: [
	// 			list => removeArray(list, allValuesShuffle.concat(allValuesShuffle)),
	// 		],
	// 	})
	// })
	//
	// it('clear', function() {
	// 	function clear<K, V>(): ITestActionsWithDescription<IMapAction<K, V>> {
	// 		return {
	// 			actions: [
	// 				list => list.clear(),
	// 			],
	// 			description: 'clear()\n',
	// 		}
	// 	}
	//
	// 	testMap({
	// 		array: [[]],
	// 		expected: {
	// 			array: [],
	// 			returnValue: undefined,
	// 		},
	// 		actions: [
	// 			clear(),
	// 		],
	// 	})
	//
	// 	testMap({
	// 		array: [['0']],
	// 		expected: {
	// 			array: [],
	// 			returnValue: undefined,
	// 			mapChanged: [{
	// 				type: MapChangedType.Removed,
	// 				oldItems: ['0'],
	// 			}],
	// 		},
	// 		actions: [
	// 			clear(),
	// 		],
	// 	})
	//
	// 	testMap({
	// 		array: [['1', '0']],
	// 		expected: {
	// 			array: [],
	// 			returnValue: undefined,
	// 			mapChanged: [{
	// 				type: MapChangedType.Removed,
	// 				oldItems: ['1', '0'],
	// 			}],
	// 		},
	// 		actions: [
	// 			clear(),
	// 		],
	// 	})
	// })
})
