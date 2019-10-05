const {register} = require('../../../babel/helpers')
const babelrc = require('../../../babel/configs/mocha')

register(babelrc)

require('../../register-tests')

const {assert} = require('../../../../src/main/common/test/Assert')
// eslint-disable-next-line no-unused-vars
const {unhandledErrors, exit} = require('../../../../src/main/common/test/unhandledErrors')

unhandledErrors((...args) => {
	console.error(...args)
	// assert.throwAssertionError(null, null, 'unhandled error')
	// exit()
})

global.assert = assert
