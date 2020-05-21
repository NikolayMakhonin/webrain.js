/* eslint-disable */
import '@babel/runtime-corejs3'
import '@babel/runtime-corejs3/regenerator'
import {invalidate} from '../../../src/main/common/rx/depend/core/CallState'
import {
    __invalidate,
    __makeDependentFunc,
    __outputCall
} from "../../../src/test/tests/common/main/rx/depend/src/helpers";
import {createPerceptron, createPerceptronNaked} from "../../../src/test/tests/common/main/rx/depend/src/perceptron";

// const {
// 	countFuncs,
// 	input,
// 	inputState,
// 	output,
// } = createPerceptron(10, 5)
//
// console.log('countFuncs = ' + countFuncs)

// %NeverOptimizeFunction(__makeDependentFunc);
// %NeverOptimizeFunction(__invalidate);
// %NeverOptimizeFunction(__outputCall);

// export function testCreate() {
// 	// eslint-disable-next-line no-shadow
// 	const {inputState} = createPerceptron(10, 5, false)
// 	// __invalidate(inputState)
// }
//
// const {inputState, output} = createPerceptron(2, 2)
// export function testRecalc() {
// 	// __invalidate(inputState)
// 	// __outputCall(output)
// 	inputState.invalidate()
// 	output.call(2, 5, 10)
// }

function iterate(count, ...funcs) {
	for (let i = 0; i < count; i++) {
		for (let j = 0; j < funcs.length; j++) {
			funcs[j]()
		}
	}
}

function testRecalc() {
	const {
		countFuncs,
		input,
		inputState,
		output,
		outputState,
	} = createPerceptron(2, 2)
	const naked = createPerceptronNaked(2, 2)

	const map1 = new Map()
	const map2 = new Map()
	map2.set(2, 3)
	map1.set(1, map2)

	iterate(
		3000,
		() => {
			naked.call(2, 5, 10)
		}, () => {
			inputState.invalidate()
		}, () => {
			output.call(2, 5, 10)
		}, () => {
			return map1.get(1).get(2)
		},
	)

	console.log('end')
}

function testCreate() {
	let countFuncs

	iterate(50000, () => {
		countFuncs = createPerceptron(10, 5, false).countFuncs
	})

	console.log('end')
}

// const naked = createPerceptronNaked(2, 2)
// export function testRecalcNaked() {
// 	naked.call(2, 5, 10)
// }

const time = Date.now()

testRecalc()

testCreate()

console.log(`${Math.round((Date.now() - time) / 1000)} sec`)

// function __func1(a, b) {
// 	return (Date.now() + a) * b
// }
//
// function __func2(a, b) {
// 	// eslint-disable-next-line prefer-rest-params
// 	return __func1(a, b) * 5
// }
//
// function __func3(a, b) {
// 	// eslint-disable-next-line prefer-rest-params
// 	return __func1(a, b) * 2
// }
//
// function applyTest() {
// 	let result
// 	for (let i = 0; i < 10000; i++) {
// 		result = __func3(1, 2)
// 	}
// 	return result
// }
//
// function applyTest2() {
// 	console.log(applyTest())
// }
//
// // %NeverOptimizeFunction(applyTest2);
//
// applyTest2()

