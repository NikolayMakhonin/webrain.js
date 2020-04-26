// /* tslint:disable:no-shadowed-variable no-empty */
// import {isIterable} from '../../../../../../../../../main/common/helpers/helpers'
// /* eslint-disable no-useless-escape,computed-property-spacing */
// import {IRule, RuleType} from '../../../../../../../../../main/common/rx/object/properties/path/builder/contracts/rules'
// import {
// 	IRuleIterator,
// 	iterateRule,
// 	subscribeNextRule,
// } from '../../../../../../../../../main/common/rx/object/properties/path/builder/iterate-rule'
// import {RuleBuilder} from '../../../../../../../../../main/common/rx/object/properties/path/builder/RuleBuilder'
// import {Rule} from '../../../../../../../../../main/common/rx/object/properties/path/builder/rules'
// import {IUnsubscribe, IUnsubscribeOrVoid} from '../../../../../../../../../main/common/rx/subjects/observable'
// import {assert} from '../../../../../../../../../main/common/test/Assert'
// import {describe, it} from '../../../../../../../../../main/common/test/Mocha'
// import {forEachRules} from "../../../../../../../../../main/common/rx/object/properties/path/builder/forEachRules";
//
// describe('common > main > rx > properties > builder > iterate-rule', function() {
// 	const testObject = {}
//
// 	function testIterateRule(...args: any[]) {
//
// 	}
//
// 	it('never', function() {
// 		forEachRules(rule, testObject, (object, value, key, keyType) => {
//
// 		})
//
// 		testIterateRule(
// 			b => b
// 				.any(
// 					b => b.never(),
// 					b => b.never().p('a'),
// 				)
// 				.any(
// 					b => b.never(),
// 					b => b.never().p('a'),
// 				)
// 				.p('a'),
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.any(
// 					b => b.never(),
// 					b => b.p('a'),
// 				)
// 				.p('a'),
// 			'a.a',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.any(
// 					b => b.never(),
// 					b => b.nothing(),
// 				)
// 				.p('a'),
// 			'a',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.repeat(0, 3, null, b =>
// 					b.any(
// 						b => b.never(),
// 						b => b.nothing(),
// 					),
// 				)
// 				.p('a'),
// 			'a',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.repeat(1, 3, null, b =>
// 					b.any(
// 						b => b.never(),
// 						b => b.never().p('a'),
// 					),
// 				)
// 				.p('b'),
// 		)
// 	})
//
// 	it('nothing', function() {
// 		testIterateRule(
// 			b => b
// 				.any(
// 					b => b.any(b => b.nothing()),
// 					b => b.any(b => b.nothing()),
// 				)
// 				.any(
// 					b => b.p('a'),
// 					b => b.nothing(),
// 				)
// 				.any(
// 					b => b.p('a'),
// 					b => b.nothing(),
// 					b => b.p('a'),
// 					b => b.nothing(),
// 					b => b.any(
// 						b => b.p('a'),
// 						b => b.nothing(),
// 					),
// 				)
// 				.p('c'),
// 			'a.a.c',
// 			'a.c',
// 			'c',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.p('a')
// 				.any(
// 					b => b.p('b'),
// 					b => b.nothing(),
// 				)
// 				.p<any>('c'),
// 			'a.b.c',
// 			'a.c',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.any(
// 					b => b.p('a'),
// 					b => b.nothing(),
// 				)
// 				.any(
// 					b => b.p('b'),
// 					b => b.nothing(),
// 				)
// 				.p('c'),
// 			'a.b.c',
// 			'a.c',
// 			'b.c',
// 			'c',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.any(
// 					b => b.p('a'),
// 					b => b.nothing(),
// 				)
// 				.p('b'),
// 			'a.b',
// 			'b',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.repeat(0, 3, null, b =>
// 					b.any(
// 						b => b.p('a'),
// 						b => b.nothing(),
// 					),
// 				)
// 				.p('b'),
// 			'a.a.a.b',
// 			'a.a.b',
// 			'a.b',
// 			'b',
// 		)
// 	})
//
// 	it('any', function() {
// 		testIterateRule(
// 			b => b
// 				.any(
// 					b => b.never(),
// 					b => b.never().p('a'),
// 				)
// 				.p('a'),
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.any(
// 					b => b.p('a'),
// 					b => b.p('b'),
// 				),
// 			'a',
// 			'b',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.any(
// 					b => b.p('a').p('b'),
// 					b => b.p('c').p('d'),
// 				),
// 			'a.b',
// 			'c.d',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.any(
// 					b => b
// 						.any(
// 							b => b.p('a').p('b'),
// 							b => b.p('c').p('d'),
// 						),
// 					b => b.p('e').p('f'),
// 				),
// 			'a.b',
// 			'c.d',
// 			'e.f',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.any(
// 					b => b
// 						.p('a').p('b')
// 						.any(
// 							b => b.p('c').p('d'),
// 							b => b.p('e').p('f'),
// 							b => b.any(b => b.never(), b => b.never()),
// 						),
// 					b => b.p('g').p('h'),
// 				)
// 				.p('i'),
// 			'a.b.c.d.i',
// 			'a.b.e.f.i',
// 			'g.h.i',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.any(
// 					b => b.never(),
// 					b => b.p('a'),
// 					b => b.nothing(),
// 					b => b.p('b'),
// 				),
// 			'',
// 			'a',
// 			'b',
// 		)
// 	})
//
// 	it('path any', function() {
// 		testIterateRule(
// 			b => b.p('a', 'b').p<any>('c'),
// 			'a|b.c',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.propertyRegexp(/[ab]/)
// 				.p<any>('c'),
// 			'/[ab]/.c',
// 		)
// 	})
//
// 	it('repeat', function() {
// 		testIterateRule(
// 			b => b
// 				.repeat(1, 1, null,
// 					b => b.p('a'),
// 				),
// 			'a',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.repeat(2, 2, null,
// 					b => b.p('a'),
// 				),
// 			'a.a',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.repeat(1, 2, null,
// 					b => b.p('a'),
// 				),
// 			'a',
// 			'a.a',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.repeat(0, 2, null,
// 					b => b.p('a'),
// 				),
// 			'',
// 			'a',
// 			'a.a',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.repeat(0, 2, null,
// 					b => b
// 						.repeat(0, 2, null,
// 							b => b.p('a'),
// 						)
// 						.p('b'),
// 				),
// 			'',
// 			'b',
// 			'a.b',
// 			'a.a.b',
// 			'b.b',
// 			'b.a.b',
// 			'b.a.a.b',
// 			'a.b.b',
// 			'a.b.a.b',
// 			'a.b.a.a.b',
// 			'a.a.b.b',
// 			'a.a.b.a.b',
// 			'a.a.b.a.a.b',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.repeat(1, 2, null,
// 					b => b
// 						.any(
// 							b => b.repeat(1, 2, null,
// 								b => b.p('a'),
// 							),
// 							b => b.p('b').p('c'),
// 						),
// 				)
// 				.p<any>('d'),
// 			'a.d',
// 			'a.a.d',
// 			'b.c.d',
//
// 			// 'a.a.d',
// 			'a.a.a.d',
// 			'a.b.c.d',
//
// 			// 'a.a.a.d',
// 			'a.a.a.a.d',
// 			'a.a.b.c.d',
//
// 			'b.c.a.d',
// 			'b.c.a.a.d',
// 			'b.c.b.c.d',
// 		)
//
// 		testIterateRule(
// 			b => b
// 				.any(
// 					b => b
// 						.repeat(2, 2, null,
// 							b => b.any(
// 								b => b.p('a'),
// 								b => b.p('b'),
// 							),
// 						),
// 					b => b.p('c'),
// 				)
// 				.p<any>('d'),
// 			'a.a.d',
// 			'a.b.d',
// 			'b.a.d',
// 			'b.b.d',
// 			'c.d',
// 		)
// 	})
//
// 	it('throws', function() {
// 		Array.from(iterateRule(testObject, new Rule(0 as RuleType)))
//
// 		assert.throws(() => Array.from(iterateRule(testObject, new Rule(-1 as RuleType)), Error))
//
// 		assert.throws(() => new RuleBuilder({
// 			autoInsertValuePropertyDefault: false,
// 		}).repeat(1, 2, null, b => b), Error)
//
// 		assert.throws(() => new RuleBuilder({
// 			autoInsertValuePropertyDefault: false,
// 		}).any<any>(), Error)
// 	})
//
// 	it('specific', function() {
// 		testIterateRule(
// 			b => b
// 				.any(
// 					b => b.p('a'),
// 					b => b.repeat(0, 0, null, b => b.p('b')).p('c'),
// 				),
// 			'a',
// 			'c',
// 		)
// 	})
// })
