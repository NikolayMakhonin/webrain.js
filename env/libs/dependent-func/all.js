import '@babel/runtime-corejs3'
import '@babel/runtime-corejs3/regenerator'
import {invalidate} from '../../../src/main/common/rx/depend/all'
import {createPerceptron} from '../../../src/test/tests/common/main/rx/depend/src/helpers'

const {
	countFuncs,
	input,
	inputState,
	output,
} = createPerceptron(10, 5)

console.log('countFuncs = ' + countFuncs)

function test() {
	invalidate(inputState)
	output.call(2, 5, 10)
}

for (let i = 0; i < 1000; i++) {
	test()
}
