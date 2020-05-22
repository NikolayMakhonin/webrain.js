import {getCallState} from '../../../../main/common/rx/depend/core/CallState'
import {assert} from '../../../../main/common/test/Assert'
import {describe, it} from '../../../../main/common/test/Mocha'

describe('common > main > index', function() {
	it('base', function() {
		assert.ok(!!getCallState)
	})
})
