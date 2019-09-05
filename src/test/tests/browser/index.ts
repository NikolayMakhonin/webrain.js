import {ObservableObject} from '../../../main/browser'

declare const assert: any

describe('browser > main > index', function() {
	it('base', function() {
		assert.ok(ObservableObject)
	})
})
