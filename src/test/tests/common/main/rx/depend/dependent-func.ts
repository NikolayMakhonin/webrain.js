/* tslint:disable:no-identical-functions no-shadowed-variable */
import {assert} from '../../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../../main/common/test/Mocha'
import {baseTest, createPerceptron, lazyTest} from './src/helpers'
import {clearCallStates} from "./src/_helpers";

describe('common > main > rx > depend > dependent-func', function() {
	it('base', async function() {
		this.timeout(20000)

		await baseTest()

		clearCallStates()
	})

	it('lazy', async function() {
		this.timeout(20000)

		await lazyTest()

		clearCallStates()
	})

	it('perceptron', function() {
		this.timeout(20000)

		const {
			countFuncs,
			input,
			inputState,
			output,
		} = createPerceptron(50, 50)

		clearCallStates()
	})
})
