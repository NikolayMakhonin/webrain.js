// @ts-ignore
import {calcPerformance} from 'rdtsc'
import {getFuncCallState, makeDependentFunc} from '../../../main/common/rx/depend/dependent-func'
import {assert} from '../../../main/common/test/Assert'
import {describe, it, xit} from '../../../main/common/test/Mocha'

describe('dependent-func', function() {
	it('perceptron', async function() {
		this.timeout(300000)

		const layersCount = 100
		const layerSize = 100
		const countFuncs = layersCount * layerSize + 2

		const input = makeDependentFunc(function() {
			return 1
		})

		// first layer
		let layer = []
		for (let i = 0; i < layerSize; i++) {
			layer[i] = makeDependentFunc(function(a, b) {
				return i * a * b * input() * (this as any)
			})
		}
		const layers = [layer]

		for (let i = 0; i < layersCount - 1; i++) {
			const nextLayer = []
			for (let j = 0; j < layerSize; j++) {
				const prevLayer = layer
				nextLayer[j] = makeDependentFunc(function(a, b) {
					let sum = 0
					for (let k = 0; k < layerSize; k++) {
						sum += prevLayer[k].call(this, a, b)
					}
					return sum
				})
			}
			layer = nextLayer
			layers.push(layer)
		}

		let output
		{
			const prevLayer = layer
			output = makeDependentFunc(function(a, b) {
				let sum = 0
				for (let i = 0; i < layerSize; i++) {
					sum += prevLayer[i].call(this, a, b)
				}
				return sum
			})
		}

		assert.strictEqual(
			output.call(2, 5, 10).toPrecision(6),
			(100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6),
		)

		const state = getFuncCallState(input)()

		const result = calcPerformance(
			10000,
			() => {
				// no operations
			}, () => {
				state.invalidate()
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
})
