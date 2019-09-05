const {register} = require('../babel/helpers')
const babelrc = require('../babel/.babelrc-mocha')

register(babelrc)

require('./register-tests')
global.assert = require('../../src/main/common/test/Assert').assert
