/* eslint-disable new-cap */
import '@babel/runtime-corejs3'
import '@babel/runtime-corejs3/regenerator'
import {invalidate} from '../../../src/main/common/rx/depend/all'
import {
	__makeDependentFunc,
	__invalidate,
	__outputCall,
	createPerceptron,
	createPerceptronNaked,
} from '../../../src/test/tests/common/main/rx/depend/src/helpers'

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

export function testCreate() {
	// eslint-disable-next-line no-shadow
	const {inputState} = createPerceptron(2, 2)
	__invalidate(inputState)
}

const {inputState, output} = createPerceptron(2, 2)
export function testRecalc() {
	__invalidate(inputState)
	__outputCall(output)
}

const naked = createPerceptronNaked(2, 2)
export function testRecalcNaked() {
	naked.call(2, 5, 10)
}

for (let i = 0; i < 10000; i++) {
	testCreate()
}
