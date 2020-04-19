/* tslint:disable:no-identical-functions no-shadowed-variable */
import {assert} from '../../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../../main/common/test/Mocha'
import {baseTest, lazyTest} from './src/base-tests'
import {clearCallStates} from "./src/helpers";
import {createPerceptron} from "./src/perceptron";
import {stressTest} from "./src/stress-test";

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

	it('stress', async function() {
		this.timeout(20000)

		await stressTest({
			iterations: 1000000,
			maxLevelsCount: 10,
			maxFuncsCount: 10,
			maxCallsCount: 100,
			countRootCalls: 5,
			disableAsync: true,
			disableDeferred: true,
			disableLazy: false,
		})

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
