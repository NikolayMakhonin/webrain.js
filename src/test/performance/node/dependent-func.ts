// @ts-ignore
import {calcPerformance} from 'rdtsc'
import {assert} from '../../../main/common/test/Assert'
import {calcMemAllocate, CalcType} from '../../../main/common/test/Calc'
import {describe, it, xit} from '../../../main/common/test/Mocha'
import {createPerceptron} from '../../tests/common/main/rx/depend/src/helpers'

describe('dependent-func', function() {
	xit('perceptron perf', function() {
		this.timeout(300000)

		const {
			countFuncs,
			input,
			inputState,
			output,
		} = createPerceptron(100, 100)

		const result = calcPerformance(
			10000,
			() => {
				// no operations
			}, () => {
				inputState.invalidate()
			}, () => {
				output.call(2, 5, 10)
			},
		)

		console.log(result)
		const cyclesPerSecond = result.calcInfo.iterationCycles * result.calcInfo.iterations / result.calcInfo.testTime * 1000
		console.log('cyclesPerSecond: ' + cyclesPerSecond)
		console.log('countFuncs: ' + countFuncs)
		console.log(`absoluteDiff per second: [${result.absoluteDiff.map(o => cyclesPerSecond / o).join(', ')}]`)
		console.log(`absoluteDiff per frame: [${result.absoluteDiff.map(o => cyclesPerSecond / o / 60).join(', ')}]`)
	})

	it('perceptron memory create', function() {
		this.timeout(300000)

		let countFuncs

		console.log(calcMemAllocate(CalcType.Stat, 100, () => {
			countFuncs = createPerceptron(100, 100, false).countFuncs
		}).scale(1 / countFuncs).toString())
	})

	it('perceptron memory recalc', function() {
		this.timeout(300000)

		const {
			countFuncs,
			input,
			inputState,
			output,
		} = createPerceptron(100, 10)

		console.log(calcMemAllocate(CalcType.Stat, 100, () => {
			inputState.invalidate()
			output.call(2, 5, 10)
		}).scale(1 / countFuncs).toString())
	})
})
