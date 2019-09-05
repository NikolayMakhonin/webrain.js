const babel = require('rollup-plugin-babel')
const babelConfigBrowser = require('../babel/.babelrc-browser')
const babelConfigMinimal = require('../babel/.babelrc-minimal')
const {fileExtensions} = require('../common/helpers')

const babelCommon = {
	babelrc: false,
	exclude: ['node_modules/@babel/**', 'node_modules/core-js*/**'],
}

const babelRollup = {
	rollup: {
		minimal: (options = {}) => babel({
			...babelCommon,
			extensions: [...fileExtensions.js, ...fileExtensions.ts],
			...babelConfigMinimal,
			...options
		}),
		browser: (options = {}) => babel({
			...babelCommon,
			runtimeHelpers: true,
			extensions    : [...fileExtensions.js, ...fileExtensions.ts],
			...babelConfigBrowser,
			...options
		}),
	}
}

module.exports = babelRollup
