/* tslint:disable:no-empty no-identical-functions max-line-length no-construct use-primitive-type */
import {calcPerformance} from 'rdtsc'
import {ObjectMerger} from '../../../main/common/extensions/merge/mergers'

declare const after
declare const babelGetFileCode

describe('common > extensions > merge > ObjectMerger', function() {
	this.timeout(300000)

	const merger = new ObjectMerger()

	function getRandomValue(values: any[]) {
		return values[Math.floor(Math.random() * values.length)]
	}

	// function perfTest(name: string, values: any[]) {
	// 	let time = new Date().getTime()
	// 	let count = 0
	// 	while (true) {
	// 		merger.merge(
	// 			getRandomValue(values),
	// 			getRandomValue(values),
	// 			getRandomValue(values),
	// 			o => {},
	// 			Math.random() > 0.5,
	// 			Math.random() > 0.5,
	// 		)
	//
	// 		count++
	// 		if (new Date().getTime() - time > 20000) {
	// 			break
	// 		}
	// 	}
	//
	// 	time = (new Date().getTime() - time) / 1000
	// 	console.log(`${name} - Count tests: ${count} - Operations per second: ${count / time}\r\n\r\n`)
	// }

	// it('all', function() {
	// 	perfTest('all', [
	// 		null, void 0, 0, 1, false, true, '', '1', {}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 }, Object.freeze({ x: {y: 1} }), new Date(1), new Date(2),
	// 		null, void 0, 0, 1, false, true, '', '1', {}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 }, Object.freeze({ x: {y: 1} }), new Date(1), new Date(2),
	// 		null, void 0, 0, 1, false, true, '', '1', {}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 }, Object.freeze({ x: {y: 1} }), new Date(1), new Date(2),
	// 	])
	// })

	it('objects', function() {
		// perfTest('objects', [
		// 	{}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 },
		// 	{}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 },
		// 	{}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 },
		// ])

		const result = calcPerformance(
			120000,
			() => {
				// no operations
			},
			() => merger.merge(
				{ a: {a: 1, b: 2}, b: 3 },
				{ a: {b: 4, c: 5}, c: 6 },
				{ a: {a: 7, b: 8}, d: 9 },
				o => {},
				true,
				true,
			),
		)

		console.log(result)
	})
})
