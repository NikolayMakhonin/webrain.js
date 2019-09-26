/* tslint:disable:no-construct use-primitive-type no-shadowed-variable no-duplicate-string no-empty max-line-length */
import {delay} from '../../../../../../main/common/helpers/helpers'
import {VALUE_PROPERTY_DEFAULT} from '../../../../../../main/common/helpers/value-property'
import {RuleRepeatAction} from '../../../../../../main/common/rx/deep-subscribe/contracts/rules'
import {ObservableObject} from '../../../../../../main/common/rx/object/ObservableObject'
import {ObservableObjectBuilder} from '../../../../../../main/common/rx/object/ObservableObjectBuilder'
import {TestMerger} from '../../extensions/merge/src/TestMerger'
import {ruleFactoriesVariants} from './helpers/src/RuleBuildersBuilder'
import {createObject, IObject, TestDeepSubscribe, TestDeepSubscribeVariants} from './helpers/src/TestDeepSubscribe'

describe('common > main > rx > deep-subscribe > deep-subscribe new', function() {
	const check = createObject()

	after(function() {
		console.log('Total ObjectMerger tests >= ' + TestDeepSubscribe.totalTests)
	})

	it('ruleFactoriesVariants self test', function() {
		new TestDeepSubscribeVariants(
			{
				object: createObject().observableObject,
				immediate: true,
				doNotSubscribeNonObjectValues: true,
			},
			b => b
				.any(
					b => b.p('observableObject'),
					b => b.any(
						b => b.never(),
						b => b.if([o => false, b => b.nothing()], [null, b => b.never()]),
					),
				)
				.variants()
				.variants(
					b => b.if([o => false, b => b.never()], [null, b => b.nothing()]),
					b => b.p('observableObject'),
					b => b.repeat(1, 1, null, [
						b => b.p('observableObject'),
						b => b.p('object'),
					]),
					b => b.valuePropertyDefault(),
					b => b.nothing(),
					b => b.p('observableList').collection().p('observableObject'),
				)
				.p('value'),
		)
			.subscribe(o => ['value'])
			.unsubscribe(o => ['value'])
	})
})
