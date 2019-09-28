// const chai = require('chai')
// const chaiAsPromised = require('chai-as-promised')
// chai.use(chaiAsPromised)
// require('chai/register-assert')

import {assert} from '../../src/main/common/test/Assert'
import {exit} from '../../src/main/common/test/unhandledErrors'

const log = console.log.bind(console)
console.log = (...args) => log(...args, '\r\n')

const {assert: assertCustom} = require('../../src/main/common/test/Assert')
const {unhandledErrors} = require('../../src/main/common/test/unhandledErrors')

unhandledErrors((...args) => {
	console.error(...args)
	assert.throwAssertionError(null, null, 'unhandled error')
	exit()
})

global.assert = assertCustom
