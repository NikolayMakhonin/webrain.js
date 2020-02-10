/* tslint:disable:no-identical-functions */
import {invalidate} from '../../../../../../../main/common/rx/depend/_createDependentFunc'
import {getFuncCallState, makeDependentFunc} from '../../../../../../../main/common/rx/depend/fasade'
import {assert} from '../../../../../../../main/common/test/Assert'

export function createPerceptronNaked(layerSize, layersCount, check = true) {
	const countFuncs = layersCount * layerSize + 2

	const input = function() {
		return 1
	}

	// first layer
	let layer = []
	for (let i = 0; i < layerSize; i++) {
		layer[i] = function(a, b) {
			return i * a * b * input() * (this as any)
		}
	}
	const layers = [layer]

	for (let i = 0; i < layersCount - 1; i++) {
		const nextLayer = []
		for (let j = 0; j < layerSize; j++) {
			const prevLayer = layer
			nextLayer[j] = function(a, b) {
				let sum = 0
				for (let k = 0; k < layerSize; k++) {
					sum += prevLayer[k].call(this, a, b)
				}
				return sum
			}
		}
		layer = nextLayer
		layers.push(layer)
	}

	let output
	{
		const prevLayer = layer
		output = function(a, b) {
			let sum = 0
			for (let i = 0; i < layerSize; i++) {
				sum += prevLayer[i].call(this, a, b)
			}
			return sum
		}
	}

	if (check) {
		assert.strictEqual(
			output.call(2, 5, 10).toPrecision(6),
			(100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6),
		)
	}

	return output
}

export function createPerceptron(layerSize, layersCount, check = true) {
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

	const inputState = getFuncCallState(input)()

	if (check) {
		assert.strictEqual(
			output.call(2, 5, 10).toPrecision(6),
			(100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6),
		)

		invalidate(inputState)

		assert.strictEqual(
			output.call(2, 5, 10).toPrecision(6),
			(100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6),
		)
	}

	return {
		countFuncs,
		input,
		inputState,
		output,
	}
}
