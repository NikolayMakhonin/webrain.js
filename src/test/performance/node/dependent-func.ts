// @ts-ignore
import {calcPerformance} from 'rdtsc'
import {getObjectUniqueId} from '../../../main/common/helpers/object-unique-id'
import {subscriberLinkPool} from '../../../main/common/rx/depend/FuncCallState'
import {assert} from '../../../main/common/test/Assert'
import {CalcType} from '../../../main/common/test/calc'
import {calcMemAllocate} from '../../../main/common/test/calc-mem-allocate'
import {describe, it, xit} from '../../../main/common/test/Mocha'
import {createPerceptron, createPerceptronNaked} from '../../tests/common/main/rx/depend/src/helpers'

describe('dependent-func', function() {
	it('perceptron perf', function() {
		this.timeout(300000)

		const {
			countFuncs,
			input,
			inputState,
			output,
		} = createPerceptron(2, 2)
		const naked = createPerceptronNaked(2, 2)

		const map1 = new Map()
		const map2 = new Map()
		map2.set(2, 3)
		map1.set(1, map2)

		const result = calcPerformance(
			10000,
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

		console.log(result)
		const cyclesPerSecond = result.calcInfo.iterationCycles * result.calcInfo.iterations / result.calcInfo.testTime * 1000
		console.log('cyclesPerSecond: ' + cyclesPerSecond)
		console.log('countFuncs: ' + countFuncs)
		console.log(`absoluteDiff per func: [${result.absoluteDiff.map(o => o / countFuncs).join(', ')}]`)
		console.log(`funcs per second: [${result.absoluteDiff.map(o => countFuncs * cyclesPerSecond / o).join(', ')}]`)
		console.log(`funcs per frame: [${result.absoluteDiff.map(o => countFuncs * cyclesPerSecond / o / 60).join(', ')}]`)
		console.log(`chrome funcs per second: [${result.absoluteDiff.map(o => countFuncs * cyclesPerSecond / o / 210).join(', ')}]`)
		console.log(`chrome funcs per frame: [${result.absoluteDiff.map(o => countFuncs * cyclesPerSecond / o / 60 / 210).join(', ')}]`)
	})

	it('set memory', function() {
		this.timeout(300000)

		const set = new Set()
		const setArray = {}
		const objects = []
		for (let i = 0; i < 10; i++) {
			objects[i] = {}
			getObjectUniqueId(objects[i])
		}

		console.log(calcMemAllocate(CalcType.Min, 50000, () => {
			for (let i = 0; i < 10; i++) {
				set.add(i * i * 10000000)
			}
			for (let i = 0; i < 10; i++) {
				set.delete(i * i * 10000000)
			}
		}).toString())
	})

	it('perceptron memory create', function() {
		this.timeout(300000)

		let countFuncs

		console.log(calcMemAllocate(CalcType.Min, 50000, () => {
			countFuncs = createPerceptron(10, 5, false).countFuncs
		}).scale(1 / countFuncs).toString())
	})

	it('perceptron memory recalc', function() {
		this.timeout(300000)

		const {
			countFuncs,
			input,
			inputState,
			output,
		} = createPerceptron(10, 5)

		const subscriberLinkPoolSize = subscriberLinkPool.size
		const subscriberLinkPoolAllocatedSize = subscriberLinkPool.allocatedSize
		const subscriberLinkPoolUsedSize = subscriberLinkPool.usedSize
		console.log('subscriberLinkPool.size = ' + subscriberLinkPoolSize)
		console.log('subscriberLinkPool.allocatedSize = ' + subscriberLinkPoolAllocatedSize)
		console.log('subscriberLinkPool.usedSize = ' + subscriberLinkPoolUsedSize)
		// assert.strictEqual(subscriberLinkPool.size + subscriberLinkPool.usedSize, subscriberLinkPool.allocatedSize)

		console.log(calcMemAllocate(CalcType.Min, 20000, () => {
			inputState.invalidate()
			output.call(2, 5, 10)
		}).scale(1 / countFuncs).toString())

		// assert.strictEqual(subscriberLinkPool.size + subscriberLinkPool.usedSize, subscriberLinkPool.allocatedSize)
		assert.strictEqual(subscriberLinkPool.size, subscriberLinkPoolSize)
		assert.strictEqual(subscriberLinkPool.allocatedSize, subscriberLinkPoolAllocatedSize)
		assert.strictEqual(subscriberLinkPool.usedSize, subscriberLinkPoolUsedSize)
	})
})
