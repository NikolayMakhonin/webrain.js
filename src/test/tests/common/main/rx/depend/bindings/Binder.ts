/* tslint:disable:no-identical-functions no-shadowed-variable */
import {Random} from '../../../../../../../main/common/random/Random'
import {Binder} from '../../../../../../../main/common/rx/depend/bindings/Binder'
import {assert} from '../../../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../../../main/common/test/Mocha'

declare const beforeEach: any

describe('common > main > rx > depend > bindings > Binder', function () {
	it('base', async function () {
		let isBind = false
		function bind() {
			assert.notOk(isBind)
			isBind = true
			return () => {
				assert.ok(isBind)
				isBind = false
			}
		}

		const binder = new Binder(bind)
		const unbinders = []
		unbinders[0] = binder.bind()
		assert.ok(isBind)
		unbinders[0]()
		assert.notOk(isBind)

		unbinders[0] = binder.bind()
		assert.ok(isBind)
		unbinders[1] = binder.bind()
		assert.ok(isBind)
		unbinders[0]()
		assert.ok(isBind)
		unbinders[1]()
		assert.notOk(isBind)

		unbinders.length = 0

		const seed = new Random().nextSeed()
		console.log(`seed = ${seed}`)
		const rnd = new Random(seed)

		for (let i = 0; i < 1000; i++) {
			if (unbinders.length === 0) {
				assert.notOk(isBind)
			} else {
				assert.ok(isBind)
			}

			switch (rnd.nextInt(2)) {
				case 0:
					if (unbinders.length < 5) {
						unbinders.push(binder.bind())
					}
					break
				case 1:
					if (unbinders.length > 0) {
						const unbind = rnd.pullArrayItem(unbinders)
						unbind()
					}
					break
				default:
					throw new Error('Unexpected behavior')
			}
		}
	})
})
