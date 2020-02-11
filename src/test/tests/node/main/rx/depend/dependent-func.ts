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
import {assert} from '../../../../../../main/common/test/Assert'
import {describe, it, xit} from '../../../../../../main/common/test/Mocha'
import {createPerceptron} from '../../../../common/main/rx/depend/src/helpers'
import {
	assertFuncOptimizationStatus,
	assertFuncsIsOptimized,
	getFuncOptimizationStatusString,
	getOptimizationStatus, OptimizationStatus, v8,
} from '../../../v8/helpers/helpers'

describe('node > main > rx > depend > dependent-func', function() {
	it('v8 self test', function() {
		function test(x) {
			return Date.now() * x
		}

		const arr = []
		for (let i = 0; i < 6146; i++) {
			arr[i] = test(i)
		}

		console.log(getFuncOptimizationStatusString({test}))
		assertFuncsIsOptimized({test})
	})

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

		const funcs = {
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

		console.log(getFuncOptimizationStatusString(funcs))

		try {
			for (let i = 0; i < 5000; i++) {
				createPerceptron(2, 2)
				assertFuncsIsOptimized(funcs)
			}
		} finally {
			console.log(getFuncOptimizationStatusString(funcs))
		}
	})
})
