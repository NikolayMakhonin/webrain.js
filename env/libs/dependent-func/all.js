import {subscriberLinkPool} from '../../../src/main/common/rx/depend/FuncCallState'
import {createPerceptron} from '../../../src/test/tests/common/main/rx/depend/src/helpers'
export * from '../../../src/main/common/rx/depend/dependent-func.ts'
export {createPerceptron}

const {
	countFuncs,
	input,
	inputState,
	output,
} = createPerceptron(10, 5)

const subscriberLinkPoolSize = subscriberLinkPool.size
const subscriberLinkPoolAllocatedSize = subscriberLinkPool.allocatedSize
const subscriberLinkPoolUsedSize = subscriberLinkPool.usedSize
console.log('countFuncs = ' + countFuncs)
console.log('subscriberLinkPool.size = ' + subscriberLinkPoolSize)
console.log('subscriberLinkPool.allocatedSize = ' + subscriberLinkPoolAllocatedSize)
console.log('subscriberLinkPool.usedSize = ' + subscriberLinkPoolUsedSize)

export function test() {
	inputState.invalidate()
	output.call(2, 5, 10)
}

for (let i = 0; i < 1000; i++) {
	test()
}
