/* eslint-disable prefer-template,no-sync,object-property-newline */
// Karma configuration
const helpers = require('../helpers')
const {fileExtensions, writeTextFileSync} = require('../../common/helpers')

module.exports = function (config) {
	helpers.configCommon(config)

	delete config.browsers
	helpers.configDetectBrowsers(config)

	config.set({
		browserNoActivityTimeout: 300000,
		browserDisconnectTimeout: 300000,
		// browserSocketTimeout: 900000,
		// captureTimeout: 900000,
		// processKillTimeout: 2000,

		// list of files / patterns to load in the browser
		files: [
			helpers.servedPattern(require.resolve('chai/chai')),
			helpers.servedPattern(writeTextFileSync('tmp/karma/chai.js', '"use strict"; var assert = chai.assert, expect = chai.expect, should = chai.should;')),
			helpers.concatJsFiles(
				'tmp/karma/tests.js',
				`src/test/tests/{common,browser}/**/*{${[...fileExtensions.js, ...fileExtensions.ts].join(',')}}`,
				`!*/**/{src,assets,js}/**/*{${[...fileExtensions.js, ...fileExtensions.ts].join(',')}}`
			)
		],

		// list of files / patterns to exclude
		exclude: [],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'tmp/karma/tests.js': ['rollup', 'writeToFile']
		},

		rollupPreprocessor: {
			plugins: helpers.rollup.plugins.karma({dev: true, legacy: true, coverage: true}),
			output : {
				format   : 'iife',
				sourcemap: true // 'inline',
			}
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress', 'coverage'], // 'log-reporter'],

		// enable / disable watching file and executing node whenever any file changes
		// !! not worked in WebStorm
		// see: https://blog.jetbrains.com/webstorm/2013/10/running-javascript-tests-with-karma-in-webstorm-7/
		// see: https://blog.jetbrains.com/webstorm/2013/10/webstorm-7-0-1-release-candidate/
		autoWatch: false,

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the node and exits
		singleRun: true,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity
	})
}
