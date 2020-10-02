const path = require('path')
const registerBabel = require('@babel/register')
const {fileExtensions, normalizePath} = require('../common/helpers')
require('core-js/stable')
require('@babel/runtime-corejs3/regenerator')

function testDir(filepath, dirPath) {
	return new RegExp(`^${dirPath}/`).test(normalizePath(filepath))
}

module.exports = {
	register(options) {
		registerBabel({
			only: [
				function (filepath) {
					return !testDir(filepath, 'node_modules')
					// || testDir(filepath, 'node_modules/less')
				},
			],
			extensions  : [...fileExtensions.js, ...fileExtensions.ts],
			babelrcRoots: true,
			cache       : true,
			...options,
		})
	},
}
