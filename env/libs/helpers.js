/* eslint-disable no-shadow,global-require,object-property-newline,no-sync */
const {build} = require('../common/build')
const rollupPlugins = require('../rollup/plugins')
const fs = require('fs')

function buildLib({fileInput, fileOutput, name}) {
	if (fs.existsSync(fileOutput)) {
		console.log(`Lib already built: ${fileOutput}`)
		return Promise.resolve()
	}

	return build(
		{fileInput, fileOutput, name}, {
			plugins: rollupPlugins.libs({dev: false, legacy: true}),
			output : {
				format   : 'iife',
				sourcemap: false,
				exports  : 'named',
			},
		},
	)
}

module.exports = {
	buildLib,
}
