import {ObservableClass} from '../../../main/browser'
import {assert} from '../../../main/common/test/Assert'
import {describe, it} from '../../../main/common/test/Mocha'

describe('browser > main > index', function() {
	it('base', function() {
		assert.ok(ObservableClass)
	})
})
