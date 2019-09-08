require('core-js/stable')
require('@babel/runtime-corejs3/regenerator')
require('../../register-tests')
global.assert = require('../../../../dist/js/main/common/test/Assert').assert
