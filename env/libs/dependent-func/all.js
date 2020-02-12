import '@babel/runtime-corejs3'
import '@babel/runtime-corejs3/regenerator'
import {invalidate} from '../../../src/main/common/rx/depend/all'
import {createPerceptron, createPerceptronNaked} from '../../../src/test/tests/common/main/rx/depend/src/helpers'

// const {
// 	countFuncs,
// 	input,
// 	inputState,
// 	output,
// } = createPerceptron(10, 5)
//
// console.log('countFuncs = ' + countFuncs)
//
export function testCreate() {
	// eslint-disable-next-line no-shadow
	const {inputState} = createPerceptron(2, 2)
	invalidate(inputState)
}

const {inputState, output} = createPerceptron(2, 2)
export function testRecalc() {
	invalidate(inputState)
	output.call(2, 5, 10)
}

const naked = createPerceptronNaked(2, 2)
export function testRecalcNaked() {
	naked.call(2, 5, 10)
}


// for (let i = 0; i < 5000; i++) {
// 	const {
// 		countFuncs,
// 		input,
// 		inputState,
// 		output,
// 	} = createPerceptron(2, 2)
// 	invalidate(inputState)
// }
