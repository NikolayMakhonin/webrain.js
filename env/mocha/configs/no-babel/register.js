require('core-js/stable')
require('@babel/runtime-corejs3/regenerator')
require('../../register-tests')

const {assert} = require('../../../../dist/js/main/common/test/Assert')
const {unhandledErrors, exit} = require('../../../../dist/js/main/common/test/unhandledErrors')

unhandledErrors((...args) => {
	console.error(...args)
	assert.throwAssertionError(null, null, 'unhandled error')
	exit()
})

global.assert = assert
