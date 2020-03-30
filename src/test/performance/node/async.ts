/* tslint:disable:no-empty no-identical-functions max-line-length no-construct use-primitive-type */
import {calcPerformance} from 'rdtsc'
import {resolveAsync, ThenableSync} from '../../../main/common/async/ThenableSync'
import {assert} from '../../../main/common/test/Assert'
import {describe, it} from '../../../main/common/test/Mocha'

declare const after
declare const babelGetFileCode

describe('common > async', function() {
	this.timeout(300000)

	it('ThenableSync then resolve', function() {
		let _resolve
		function executor(resolve) {
			_resolve = resolve
		}

		function then(o) {
			return o + 1
		}

		let thenable

		const result = calcPerformance(
			10000,
			() => {
				// no operations
			},
			() => {
				thenable = new ThenableSync(executor)
			},
			() => {
				thenable.then(then)
				_resolve()
				thenable.then(then)
			},
		)

		/*
  absoluteDiff: [ 93, 1603 ],
  absoluteDiff: [ 88, 1721 ],
  absoluteDiff: [ 107, 1725 ],
  absoluteDiff: [ 76, 1847 ],
  absoluteDiff: [ 100, 1879 ],
  absoluteDiff: [ 72, 1648 ],
  absoluteDiff: [ 107, 1655 ],
  absoluteDiff: [ 65, 1674 ],
  absoluteDiff: [ 69, 1805 ],

  absoluteDiff: [ 69, 1560 ],
  absoluteDiff: [ 62, 1549 ],
  absoluteDiff: [ 77, 1495 ],

  absoluteDiff: [ 92, 1610 ],
  absoluteDiff: [ 85, 1449 ],
  absoluteDiff: [ 76, 1441 ],

  absoluteDiff: [ 88, 1418 ],
		 */

		console.log(result)
	})
})
