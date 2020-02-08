/* eslint-disable no-shadow,global-require,object-property-newline */
const path = require('path')
const rollup = require('rollup')
const {writeTextFile} = require('./helpers')

async function doRollup(rollupConfig) {
	const bundle = await rollup.rollup(rollupConfig)

	const result = await bundle.generate(rollupConfig.output)

	// console.log(result.output[0].code)

	return result.output[0].code
}

async function build({fileInput, fileOutput, name}, rollupConfig) {
	fileInput = path.resolve(fileInput)
	fileOutput = path.resolve(fileOutput)

	const content = await doRollup({
		...rollupConfig,
		input : fileInput,
		output: {
			...rollupConfig.output,
			name,
		},
	})

	if (!content) {
		throw new Error('transformed content is empty')
	}

	await writeTextFile(fileOutput, content)
}

module.exports = {
	build
}
