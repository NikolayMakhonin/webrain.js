/* eslint-disable no-var,prefer-rest-params,vars-on-top,prefer-spread */
// const chai = require('chai')
// const chaiAsPromised = require('chai-as-promised')
// chai.use(chaiAsPromised)
// require('chai/register-assert')

var log = console.log.bind(console)

console.log = function () {
	var _len = arguments.length
	var args = new Array(_len)
	for (var _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key]
	}

	return log.apply(void 0, args.concat(['\r\n']))
}
