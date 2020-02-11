/* tslint:disable:no-identical-functions no-shadowed-variable no-var-requires */
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
import {assert, AssertionError} from '../../../../../../main/common/test/Assert'
import {describe, it, xit} from '../../../../../../main/common/test/Mocha'
import {createPerceptron} from '../../../../common/main/rx/depend/src/helpers'
import {
	assertFuncOptimizationStatus,
	assertIsOptimized,
	getFuncOptimizationStatusString, getObjectOptimizationInfo,
	OptimizationStatus,
	v8,
} from '../../../v8/helpers/helpers'

describe('node > main > rx > depend > dependent-func', function() {
	it('v8', function() {
		for (let i = 0; i < 10000; i++) {
			createPerceptron(2, 2)
			if ((
				v8.GetOptimizationStatus(makeDependentFunc)
				& v8.GetOptimizationStatus(createPerceptron)
				& v8.GetOptimizationStatus(invalidate)
				& OptimizationStatus.TurboFanned) !== 0) {
				break
			}
		}

		const objects = {
			createPerceptron,
			_createDependentFunc,
			_getFuncCallState,
			createFuncCallState,
			// getFuncCallState,
			getSubscriberLink,
			invalidate,
			makeDependentFunc,
			releaseSubscriberLink,
			subscribeDependency,
			unsubscribeDependencies,
		}

		console.log(getFuncOptimizationStatusString(objects))

		try {
			for (let i = 0; i < 5000; i++) {
				createPerceptron(2, 2)
				assertIsOptimized(objects)
			}
		} finally {
			console.log(getFuncOptimizationStatusString(objects))
		}
	})
})
