/* tslint:disable:no-identical-functions no-shadowed-variable no-var-requires ordered-imports */
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

	FuncCallState,
	createMakeDependentFunc,
	semiWeakMapGet,
	semiWeakMapSet,
	createSemiWeakMap,
	getSubscriberLinkFromPool,
	subscriberLinkPool,
	_subscribe,
	createDependentFunc,
	createGetFuncCallState,
	emit,
	isRefType,
	makeDependentIterator,
	subscriberLinkDelete,
	SubscriberLinkPool,
	update,
} from '../../../../../../main/common/rx/depend/all'
import {assert, AssertionError} from '../../../../../../main/common/test/Assert'
import {describe, it, xit} from '../../../../../../main/common/test/Mocha'
import {createPerceptron} from '../../../../common/main/rx/depend/src/helpers'
import {
	assertFuncOptimizationStatus,
	assertIsOptimized, checkIsOptimized,
	getFuncOptimizationStatusString, getObjectOptimizationInfo,
	OptimizationStatus,
	v8,
} from '../../../v8/helpers/helpers'

describe('node > main > rx > depend > dependent-func', function() {
	it('v8', function() {
		this.timeout(20000)

		const objects = {
			// public
			getFuncCallState,
			invalidate,
			makeDependentFunc,
			createPerceptron,

			// internal
			_createDependentFunc,
			_getFuncCallState,
			createFuncCallState,
			getSubscriberLink,
			releaseSubscriberLink,
			subscribeDependency,
			unsubscribeDependencies,

			// internal deep
			FuncCallState,
			semiWeakMapGet,
			semiWeakMapSet,
			getSubscriberLinkFromPool,
			subscriberLinkPool,
			_subscribe,
			createDependentFunc,
			emit,
			isRefType,
			subscriberLinkDelete,
			update,
			// makeDependentIterator,

			// internal single call
			// createGetFuncCallState,
			// createMakeDependentFunc,
			// createSemiWeakMap,
			// SubscriberLinkPool,
		}

		const optimizedObjectsIterations = {}
		const optimizedObjects = {}

		function checkOptimization(iteration) {
			for (const key in objects) {
				if (Object.prototype.hasOwnProperty.call(objects, key)
					&& !Object.prototype.hasOwnProperty.call(optimizedObjects, key)
					&& checkIsOptimized({[key]: objects[key]})
				) {
					optimizedObjects[key] = objects[key]
					optimizedObjectsIterations[key] = iteration
				}
			}
			if (!checkIsOptimized(optimizedObjects)) {
				console.error('Iteration: ' + iteration)
				assertIsOptimized(optimizedObjects)
			}
		}

		for (let i = 0; i < 100000; i++) {
			if (i === 10) {
				// isRefType(1)
				// isRefType(2)
				for (const key in objects) {
					if (Object.prototype.hasOwnProperty.call(objects, key)
						&& !Object.prototype.hasOwnProperty.call(optimizedObjects, key)
					) {
						v8.OptimizeFunctionOnNextCall(objects[key])
					}
				}
				// isRefType(3)
			}

			const {
				input,
				output,
			} = createPerceptron(2, 2)

			// checkOptimization(i)

			for (let j = 0; j < 10; j++) {
				const state = getFuncCallState(input)()
				invalidate(state)
			}

			// checkOptimization(i)
		}

		console.log(optimizedObjectsIterations)

		const inlined = []
		const notInlined = []
		for (const key in objects) {
			if (Object.prototype.hasOwnProperty.call(objects, key)) {
				if ((v8.GetOptimizationStatus(objects[key]) & OptimizationStatus.MarkedForOptimization) === 0) {
					notInlined.push(key)
				} else {
					inlined.push(key)
				}
			}
		}
		console.log('Inlined: ', inlined)
		console.log('Not inlined: ', notInlined)

		// assert.deepStrictEqual(optimizedObjects, objects)
		assertIsOptimized(objects)

		// for (let i = 0; i < 5000; i++) {
		// 	createPerceptron(2, 2)
		// 	assertIsOptimized(objects)
		// }
	})
})
