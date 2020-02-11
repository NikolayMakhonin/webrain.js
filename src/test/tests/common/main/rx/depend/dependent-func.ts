/* tslint:disable:no-identical-functions no-shadowed-variable */
// @ts-ignore
import {isThenable, Thenable, ThenableOrValue} from '../../../../../../main/common/async/async'
import {
	_createDependentFunc,
	_getFuncCallState,
	createFuncCallState,
	getFuncCallState,
	getSubscriberLink,
	invalidate,
	makeDependentFunc,
	releaseSubscriberLink,
	subscribeDependency,
	unsubscribeDependencies,
} from '../../../../../../main/common/rx/depend/all'
import {FuncCallStatus, IFuncCallState} from '../../../../../../main/common/rx/depend/contracts'
import {assert} from '../../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../../main/common/test/Mocha'
import {delay} from '../../../../../../main/common/time/helpers'
import {
	assertIsOptimized,
	assertFuncOptimizationStatus,
	getFuncOptimizationStatusString,
	OptimizationStatus, getOptimizationStatus,
} from '../../../../node/v8/helpers/helpers'
import {baseTest, createPerceptron} from './src/helpers'

describe('common > main > rx > depend > dependent-func', function() {
	it('base', async function() {
		await baseTest()
	})

	it('perceptron', function() {
		this.timeout(20000)

		const {
			countFuncs,
			input,
			inputState,
			output,
		} = createPerceptron(50, 50)
	})
})
