import {nextHash} from '../../../../../../../main/common/helpers/helpers'
import {getOrCreateCallState} from '../../../../../../../main/common/rx/depend/core/CallState'
import {assert} from '../../../../../../../main/common/test/Assert'
import {__makeDependentFunc, __outputCall} from './helpers'

export function createPerceptronNaked(layerSize, layersCount, check = true) {
	const countFuncs = layersCount * layerSize + 2

	const input = function() {
		return 1
	}

	// first layer
	let layer
	for (let i = 0; i < layerSize; i++) {
		const func = function(a, b) {
			return i * a * b * input() * (this as any)
		}
		if (i === 0) {
			layer = [func]
		} else {
			layer[i] = func
		}
	}
	const layers = [layer]

	for (let i = 0; i < layersCount - 1; i++) {
		let nextLayer
		for (let j = 0; j < layerSize; j++) {
			const prevLayer = layer
			const func = function(a, b) {
				let sum = 0
				for (let k = 0; k < layerSize; k++) {
					sum += prevLayer[k].call(this, a, b)
				}
				return sum
			}
			if (j === 0) {
				nextLayer = [func]
			} else {
				nextLayer[j] = func
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

function createNextLayer(prevLayer, layerSize) {
	return __makeDependentFunc(function(a, b) {
		let sum = 0
		for (let k = 0; k < layerSize; k++) {
			sum += prevLayer[k].call(this, a, b)
		}
		return sum
	})
}

function createFirstLayer(i, input) {
	return __makeDependentFunc(function(a, b) {
		return i * a * b * input() * (this as any)
	})
}

export function createPerceptron(
	layerSize,
	layersCount,
	check = true,
) {
	const countFuncs = layersCount * layerSize + 2

	// region randomValues

	const randomValues = [
		0,
		{x: 1},
		'123',
		null,
		() => ({}),
		1,
		false,
		() => 1,
		{},
		'',
		void 0,
		2,
		{y: 1, x: 2},
		true,
	]
	const randomValuesLength = randomValues.length

	// endregion

	let callId = 0
	const input = __makeDependentFunc(function() {
		return ++callId
	})

	// first layer
	let layer
	for (let i = 0; i < layerSize; i++) {
		const func = createFirstLayer(i, input)
		if (i === 0) {
			layer = [func]
		} else {
			layer[i] = func
		}
	}
	const layers = [layer]

	for (let i = 0; i < layersCount - 1; i++) {
		let nextLayer
		for (let j = 0; j < layerSize; j++) {
			const prevLayer = layer
			// const r1 = randomValues[(i * layerSize * 3 + j) % randomValuesLength]
			// const r2 = randomValues[(i * layerSize * 3 + j + 1) % randomValuesLength]
			// const r3 = randomValues[(i * layerSize * 3 + j + 2) % randomValuesLength]
			const func = createNextLayer(prevLayer, layerSize)
			if (j === 0) {
				nextLayer = [func]
			} else {
				nextLayer[j] = func
			}
		}
		layer = nextLayer
		layers.push(layer)
	}

	let output
	{
		const prevLayer = layer
		output = __makeDependentFunc(function(a, b) {
			let sum = 0
			for (let i = 0; i < layerSize; i++) {
				sum += prevLayer[i].call(this, a, b)
			}
			return sum
		})
	}

	let _states
	const getStates = () => {
		if (!_states) {
			_states = layers
				.flatMap(o => o)
				.map(o => getOrCreateCallState(o)())
		}
		return _states
	}

	const inputState = getOrCreateCallState(input)()
	const outputState = getOrCreateCallState(output).call(2, 5, 10)

	if (check) {
		assert.strictEqual(
			__outputCall(output).toPrecision(6),
			(callId * 100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6),
		)

		inputState.invalidate()

		assert.strictEqual(
			__outputCall(output).toPrecision(6),
			(callId * 100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6),
		)
	}

	let outputStateHash = 17
	for (let i = 0; i < outputState.valueIds.length; i++) {
		outputStateHash = nextHash(outputStateHash, outputState.valueIds[i])
	}

	return {
		getStates,
		countFuncs,
		input,
		inputState,
		output,
		outputState,
		outputStateHash,
	}
}
