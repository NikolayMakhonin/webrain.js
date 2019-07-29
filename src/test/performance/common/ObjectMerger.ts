/* tslint:disable:no-empty no-identical-functions max-line-length no-construct use-primitive-type */
import {ObjectMerger} from '../../../main/common/extensions/merge/mergers'

declare const assert
declare const after
declare const babelGetFileCode

describe('common > extensions > merge > ObjectMerger', function() {
	this.timeout(60000)

	it('performance', function() {
		const values = [
			null, void 0, 0, 1, false, true, '', '1', {}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 }, Object.freeze({ x: {y: 1} }), new Date(1), new Date(2),
			null, void 0, 0, 1, false, true, '', '1', {}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 }, Object.freeze({ x: {y: 1} }), new Date(1), new Date(2),
			null, void 0, 0, 1, false, true, '', '1', {}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 }, Object.freeze({ x: {y: 1} }), new Date(1), new Date(2),
		]
		const merger = new ObjectMerger()

		function getRandomValue() {
			return values[Math.floor(Math.random() * values.length)]
		}

		let time = new Date().getTime()
		let count = 0
		while (true) {
			merger.merge(
				getRandomValue(),
				getRandomValue(),
				getRandomValue(),
				o => {},
				Math.random() > 0.5,
				Math.random() > 0.5,
			)

			count++
			if (new Date().getTime() - time > 20000) {
				break
			}
		}

		time = (new Date().getTime() - time) / 1000
		console.log(`Count tests: ${count}\r\nOperations per second: ${count / time}`)
	})
})
