/* eslint-disable object-curly-newline */
const {terser} = require('rollup-plugin-terser')
const istanbul = require('rollup-plugin-istanbul')
// const globals = require('rollup-plugin-node-globals')
// const builtins = require('rollup-plugin-node-builtins')
const resolve  = require('rollup-plugin-node-resolve')
const replace = require('@rollup/plugin-replace')
const commonjs  = require('rollup-plugin-commonjs')
const nycrc  = require('../../.nycrc.json')
const {fileExtensions, writeTextFile} = require('../common/helpers')
const babel = require('./babel')

const dedupe = importee => /^(@babel|core-js[^\\/]*|regenerator-runtime)([\\/]|$)/.test(importee)

const plugins = {
	babel   : babel.rollup,
	istanbul: (options = {}) => istanbul({
		...nycrc,
		...options
	}),
	// globals    : (options = {}) =>globals(options),
	// builtins   : (options = {}) =>builtins(options),
	resolve: (options = {}) => resolve({
		extensions: [...fileExtensions.js, ...fileExtensions.ts],
		dedupe,
		// preferBuiltins      : true,
		// customResolveOptions: {
		// 	moduleDirectory: 'node_modules',
		// 	paths          : [path.resolve(process.cwd(), 'node_modules')],
		// },
		...options
	}),
	commonjs: (options = {}) => commonjs({
		extensions: [...fileExtensions.js, ...fileExtensions.ts],
		// namedExports: {
		// 	'node_modules/chai/index.js': ['assert', 'expect']
		// }
		include   : 'node_modules/**',
		...options
	}),
	terser: (options = {}) => terser({
		mangle: false,
		module: true,
		ecma  : 5,
		output: {
			max_line_len: 50,
		},
		sourcemap: {
			content: 'inline',
			url    : 'inline'
		},
		...options
	}),
}

// noinspection PointlessBooleanExpressionJS
module.exports = {
	plugins,
	karma({dev = false, legacy = true, coverage = false}) {
		return [
			plugins.babel.minimal(),
			coverage && plugins.istanbul(),
			plugins.resolve({
				browser: true,
			}),
			plugins.commonjs(),
			legacy && plugins.babel.browser(),
			!dev && plugins.terser({
				module: false,
			}),
		]
	},
	watch({dev = false, legacy = true, coverage = false, getFileCodePlugins = []}) {
		return [
			plugins.babel.minimal(),
			coverage && plugins.istanbul(),
			plugins.resolve({
				browser: true,
			}),
			plugins.commonjs(),
			legacy && plugins.babel.browser(),
			...getFileCodePlugins,
			!dev && plugins.terser({
				module: false,
			}),
		]
	},
	libs({dev = false, legacy = true}) {
		return [
			plugins.babel.minimal({
				// compact: true,
			}),
			plugins.resolve({
				browser: true,
			}),
			plugins.commonjs(),
			legacy && plugins.babel.v8Trace({
				// compact: true,
			}),
			// !dev && plugins.terser({
			// 	module: false,
			// }),
		]
	},
}
