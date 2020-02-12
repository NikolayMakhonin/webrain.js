/* eslint-disable prefer-destructuring,no-var,vars-on-top,no-undef,prefer-spread */
require('core-js/stable')
require('@babel/runtime-corejs3/regenerator')
require('../../register-tests')

var _require = require('../../../../dist/js/main/common/test/Assert')
var assert = _require.assert

var _require2 = require('../../../../dist/js/main/common/test/unhandledErrors')
var unhandledErrors = _require2.unhandledErrors
var exit = _require2.exit

if (process.version !== 'v4.9.1') {
	unhandledErrors(() => {
		console.error.apply(console, arguments)
		assert.throwAssertionError(null, null, 'unhandled error')
		exit()
	})
}

global.assert = assert
