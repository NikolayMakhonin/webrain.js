const registerBabel = require('@babel/register')

registerBabel({
	// This will override `node_modules` ignoring - you can alternatively pass
	// an array of strings to be explicitly matched or a regex / glob
	ignore      : ['node_modules'],
	extensions  : ['.es6', '.es', '.js', '.mjs', '.ts'],
	// only        : [/.*/],
	babelrcRoots: true
})

require('./register-tests')
global.assert = require('../../src/main/common/test/Assert').assert
