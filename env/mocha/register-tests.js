// const chai = require('chai')
// const chaiAsPromised = require('chai-as-promised')
// chai.use(chaiAsPromised)
// require('chai/register-assert')

const log = console.log.bind(console)
console.log = (...args) => log(...args, '\r\n')
