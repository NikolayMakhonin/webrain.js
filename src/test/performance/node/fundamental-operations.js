/* eslint-disable no-new-func,no-array-constructor,object-property-newline */

import {calcPerformance} from 'rdtsc'
import {compareDefault} from "../../tests/common/main/lists/helpers/list";
import {binarySearch} from "../../../main/common/lists/helpers/array";

describe('fundamental-operations', function () {
	function Path(value) {
		this.value = value
	}

	Path.prototype.unshift = function (value) {
		const item = new Path(value)
		item.next = this
		return item
	}

	xit('array add item', function () {
		this.timeout(300000)

		const item = 'qweqweqweqweqwe'
		let str = item
		let arr1 = []
		let arr2 = new Array(10)
		let path = new Path(item)

		const result = calcPerformance(
			5000,
			() => {
				// no operations
			}, () => {
				str = 'qweqweqweqweqwe'
			}, () => {
				arr1 = new Array()
			}, () => {
				arr2 = new Array(10)
			}, () => {
				path = new Path(item)
			}, () => {
				str += item
			}, () => {
				arr1[0] = item
			}, () => {
				arr2[0] = item
			}, () => {
				path = path.unshift(item)
			}
		)

		console.log(str, result)
	})

	xit('pass arguments', function () {
		this.timeout(300000)

		function f1(args) {
			return args.length + 1
		}

		function f2(...args) {
			return args.length + 2
		}

		function passF1(...args) {
			f1(args)
		}

		function passF2(...args) {
			f2(...args)
		}

		const result = calcPerformance(
			5000,
			() => {
				// no operations
			},
			() => passF1(1, 2, 3, 4, 5, 6, 7, 8, 9),
			() => passF2(1, 2, 3, 4, 5, 6, 7, 8, 9)
		)

		console.log(result)
	})

	xit('lambda vs function', function () {
		this.timeout(300000)

		function f1(args) {
			const calc = () => {
				if (Math.random() + 1) {
					return 1
				}

				let inputItems
				let output
				let map
				let expandAndDistinct

				if (inputItems == null) {
					return output
				}

				if (Array.isArray(inputItems)) {
					for (const item of inputItems) {
						expandAndDistinct(item, output, map)
					}
					return output
				}

				if (!map[inputItems]) {
					map[inputItems] = true
					output[output.length] = inputItems
				}

				return output
			}
			return calc()
		}

		function f2(args) {
			return calc()
			function calc() {
				if (Math.random() + 1) {
					return 1
				}

				let inputItems
				let output
				let map
				let expandAndDistinct

				if (inputItems == null) {
					return output
				}

				if (Array.isArray(inputItems)) {
					for (const item of inputItems) {
						expandAndDistinct(item, output, map)
					}
					return output
				}

				if (!map[inputItems]) {
					map[inputItems] = true
					output[output.length] = inputItems
				}

				return output
			}
		}

		const result = calcPerformance(
			30000,
			() => {
				// no operations
			},
			() => f1(1),
			() => f2(2)
		)

		console.log(result)
	})

	xit('lazy function parameters', function () {
		this.timeout(300000)

		function f(arg1, arg2) {
			if (!arg1 || Math.random() === 0.5) {
				return arg2.x
			}

			if (typeof arg2 === 'function') {
				arg2 = arg2()
			}

			if (Math.random() === 0.5) {
				console.log(arg2.x)
			}

			return arg2.x
		}

		const result = calcPerformance(
			60000,
			() => {
				// no operations
			},
			() => f(false, {x: [1, 2, 3], y: 2, z: 3}),
			() => f(false, () => ({x: [1, 2, 3], y: 2, z: 3})),
			() => f(true, {x: [1, 2, 3], y: 2, z: 3}),
			() => f(true, () => ({x: [1, 2, 3], y: 2, z: 3}))
		)

		console.log(result)
	})

	function copyToArray(source, dest, len, index) {
		if (!len) {
			len = source.length
		}
		if (!index) {
			index = 0
		}
		for (let i = index; i < len; i++) {
			dest[index + i] = source[i]
		}
	}

	function generateArray(size) {
		const arr = []
		for (let i = 0; i < size; i++) {
			arr.push(i)
		}

		return arr
	}

	xit('array decrease length', function () {
		this.timeout(300000)

		const arr = generateArray(10000)
		let arr2

		const result = calcPerformance(
			60000,
			() => {
				// no operations
			},
			() => {
				arr2 = arr.slice()
			},
			() => {
				arr2.splice(arr2.length - 1, 1) // 1368
			},
			() => {
				arr2 = arr.slice()
			},
			() => {
				arr2.length-- // 698
			},
			() => {
				arr2 = arr.slice()
			},
			() => {
				delete arr2[arr2.length - 1] // 291
			}
		)

		console.log(result)
	})

	xit('array decrease length 100', function () {
		this.timeout(300000)

		const arr = generateArray(10000)
		let arr2

		const result = calcPerformance(
			60000,
			() => {
				// no operations
			},
			() => {
				arr2 = arr.slice()
			},
			() => {
				arr2.splice(arr2.length - 100, 100) // 3465
			},
			() => {
				arr2 = arr.slice()
			},
			() => {
				arr2.length -= 100 // 690
			}
		)

		console.log(result)
	})

	xit('array increase length', function () {
		this.timeout(300000)

		const arr = generateArray(10000)
		let arr2

		const result = calcPerformance(
			60000,
			() => {
				// no operations
			},
			() => {
				arr2 = arr.slice()
			},
			() => { // 80803
				const clone = new Array(arr2.length + 1)
				copyToArray(arr2, clone)
				arr2 = clone
			},
			() => {
				arr2 = arr.slice()
			},
			() => {
				arr2[arr2.length] = arr2.length // 34189
			},
			() => {
				arr2 = arr.slice()
			},
			() => {
				arr2.push(arr2.length) // 34048
			},
			() => {
				arr2 = arr.slice()
			},
			() => {
				arr2.length++ // 137850
			},
			() => {
				arr2 = arr.slice()
			},
			() => {
				arr2.splice(arr2.length, 0, arr2.length) // 138119
			}
		)

		console.log(result)
	})

	xit('array increase length 100', function () {
		this.timeout(300000)

		const arr = generateArray(10000)
		let arr2

		const result = calcPerformance(
			60000,
			() => {
				// no operations
			},
			() => {
				arr2 = arr.slice()
			},
			() => { // 81010
				const clone = new Array(arr2.length + 100)
				copyToArray(arr2, clone)
				arr2 = clone
			},
			() => {
				arr2 = arr.slice()
			},
			() => {
				arr2.length += 100 // 137800
			},
			() => {
				arr2 = arr.slice()
			},
			() => { // 35132
				for (let i = 0; i < 100; i++) {
					arr2.push(0)
				}
			},
			() => {
				arr2 = arr.slice()
			},
			() => { // 35581
				for (let i = arr2.length, end = i + 100; i < end; i++) {
					arr2[i] = 0
				}
			}
		)

		console.log(result)
	})

	xit('array default value', function () {
		this.timeout(300000)

		const arrNumbers = generateArray(10)
		const arrStrings = arrNumbers.map(o => o.toString())
		const arrFunctions = arrNumbers.map(o => () => o.toString())
		const arrObjects = arrNumbers.map(o => ({o}))

		const defaultNumber = 0
		const defaultString = ''
		const defaultFunction = new Function()
		const defaultObject = {}

		let arr

		const result = calcPerformance(
			180000,
			() => {
				// no operations
			},
			() => {
				arr = arrNumbers.slice()
			},
			() => { // 31
				arr[arr.length - 1] = undefined
			},
			() => {
				arr = arrNumbers.slice()
			},
			() => { // 4
				arr[arr.length - 1] = null
			},
			() => {
				arr = arrNumbers.slice()
			},
			() => { // -11
				arr[arr.length - 1] = defaultNumber
			},
			() => {
				arr = arrNumbers.slice()
			},
			() => { // 35
				arr[arr.length - 1] = defaultString
			},


			() => {
				arr = arrStrings.slice()
			},
			() => { // 8
				arr[arr.length - 1] = undefined
			},
			() => {
				arr = arrStrings.slice()
			},
			() => { // -4
				arr[arr.length - 1] = null
			},
			() => {
				arr = arrStrings.slice()
			},
			() => { // 27
				arr[arr.length - 1] = defaultString
			},
			() => {
				arr = arrStrings.slice()
			},
			() => { // -7
				arr[arr.length - 1] = defaultNumber
			},


			() => {
				arr = arrFunctions.slice()
			},
			() => { // 4
				arr[arr.length - 1] = undefined
			},
			() => {
				arr = arrFunctions.slice()
			},
			() => { // -7
				arr[arr.length - 1] = null
			},
			() => {
				arr = arrFunctions.slice()
			},
			() => { // 11
				arr[arr.length - 1] = defaultFunction
			},
			() => {
				arr = arrFunctions.slice()
			},
			() => { // 27
				arr[arr.length - 1] = defaultNumber
			},


			() => {
				arr = arrObjects.slice()
			},
			() => { // 8
				arr[arr.length - 1] = undefined
			},
			() => {
				arr = arrObjects.slice()
			},
			() => { // 27
				arr[arr.length - 1] = null
			},
			() => {
				arr = arrObjects.slice()
			},
			() => { // 11
				arr[arr.length - 1] = defaultObject
			},
			() => {
				arr = arrObjects.slice()
			},
			() => { // 8
				arr[arr.length - 1] = defaultNumber
			}

		)

		console.log(result)
	})

	xit('array last index', function () {
		this.timeout(300000)

		function defaultCompare(o1, o2) {
			return o1 === o2
		}

		function lastIndexOf1(array, value, compare) {
			if (!compare) {
				compare = defaultCompare
			}

			let i = 0
			const len = array.length
			let ind = -1
			while (i !== len) {
				if (compare(array[i], value)) {
					ind = i
				}
				i++
			}
			return ind
		}

		function lastIndexOf2(array, value, compare) {
			if (!compare) {
				compare = defaultCompare
			}

			let i = array.length
			while (i !== 0) {
				if (compare(array[i], value)) {
					return i
				}
				i--
			}
			return -1
		}

		const arr = generateArray(10000)

		const result = calcPerformance(
			10000,
			() => {
				// no operations
			},
			() => lastIndexOf1(arr, 5000),
			() => lastIndexOf2(arr, 5000)
		)

		console.log(result)
	})

	// xit('array capacity', function () {
	// 	this.timeout(300000)
	//
	// 	let arr
	//
	// 	const result = calcPerformance(
	// 		60000,
	// 		() => {
	// 			// no operations
	// 		},
	// 		() => { // 821
	// 			arr = [1, 2, 3, 4, 5]
	// 			arr.length = 10
	// 		},
	// 		() => {
	// 			arr.push(6) // 16
	// 		},
	// 		() => {
	// 			arr = arr.slice(5, 1) // 265
	// 		},
	// 		() => { // 737
	// 			arr = [1, 2, 3, 4, 5]
	// 			arr.length = 10
	// 		},
	// 		() => {
	// 			arr[5] = 6 // 20
	// 		},
	// 		() => {
	// 			delete arr[5] // 238
	// 		},
	// 		() => { // 74
	// 			arr = new Array(10)
	// 			copyToArray([1, 2, 3, 4, 5], arr)
	// 		},
	// 		() => {
	// 			arr.push(6) // 146
	// 		},
	// 		() => {
	// 			arr.splice(5, 1) // 771
	// 		},
	// 		() => { // 55
	// 			arr = new Array(10)
	// 			copyToArray([1, 2, 3, 4, 5], arr)
	// 		},
	// 		() => {
	// 			arr[5] = 6 // 1
	// 		},
	// 		() => {
	// 			delete arr[5] // 231
	// 		}
	// 	)
	//
	// 	console.log(result)
	// })

	function calcSortCompareCount(array, size, addArray) {
		// array.length = size
		let count = 0
		for (let i = 0, len = addArray.length; i < len; i++) {
			array[size++] = addArray[i]
		}
		array.sort((o1, o2) => {
			count++
			return compareDefault(o1, o2)
		})

		// console.log(`${JSON.stringify(array)}`)

		return count
	}

	function calcBinarySearchCount(array, size, addArray) {
		let count = 0
		for (let i = 0, addLen = addArray.length; i < addLen; i++) {
			const addItem = addArray[i]

			let insertIndex = binarySearch(array, addItem, null, size, (o1, o2) => {
				count++
				return compareDefault(o1, o2)
			})

			if (insertIndex < 0) {
				insertIndex = ~insertIndex
			}

			// insert
			for (let j = size - 1; j < size; j++) {
				array[j + 1] = array[j]
			}
			for (let j = size - 1; j > insertIndex; j--) {
				array[j] = array[j - 1]
			}

			array[insertIndex] = addItem

			size++
		}

		// console.log(`${JSON.stringify(array)}`)

		return count
	}

	function printSortCompareCount(array, addArray) {
		const sortCount = calcSortCompareCount(array, array.length, addArray)
		const binarySearchCount = calcBinarySearchCount(array, array.length, addArray)
		console.log(`${sortCount}\t${binarySearchCount}\t${JSON.stringify(array)}\t${JSON.stringify(addArray)}`)
	}

	it('sorted array add items', function() {
		this.timeout(300000)

		const array = []
		const addArray = generateArray(1000).sort((o1, o2) => {
			return Math.random() > 0.5 ? -1 : 1
		})
		// [-3, -1, -2, 1, 9, -4, 7, -6, 11]
		let resultArray

		// console.log(JSON.stringify(addArray))
		// printSortCompareCount(array.slice(), addArray)

		const result = calcPerformance(
			10000,
			() => {
				// no operations
			},
			() => {
				resultArray = array.slice().concat(addArray.map(o => 0))
			},
			() => calcSortCompareCount(resultArray, array.length, addArray),
			() => {
				resultArray = array.slice().concat(addArray.map(o => 0))
			},
			() => calcBinarySearchCount(resultArray, array.length, addArray)
		)

		console.log(result)
	})
})
