import * as Facade from '../../../../main/common'

declare const assert: any

describe('common > main > index', function() {
	it('base', function() {
		assert.ok(Facade.ObservableObject)
	})
})
