import {assert} from '../../../main/common/test/Assert'
import {describe, it} from '../../../main/common/test/Mocha'
import {ObservableClass} from '../../../main/node'

describe('node > main > index', function() {
	it('base', function() {
		assert.ok(ObservableClass)
	})
})
