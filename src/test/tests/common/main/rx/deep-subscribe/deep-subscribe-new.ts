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
	this.timeout(300000)

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
					b => b.neverVariants(),
				)
				.variants()
				.nothingVariants()
				.variants(
					b => b.if([o => false, b => b.never()], [null, b => b.nothing()]),
					b => b.p(['observableObject', 'object']),
					b => b.propertyName(['observableObject', 'object']),
					b => b.propertyNames(['observableObject', 'object']),
					b => b.repeat(1, 1, null, [
						b => b.p('observableObject'),
						b => b.p('object'),
					]),
					b => b.valuePropertyDefault(),
					b => b.nothing(),
					b => b.p('observableList').collection().p('observableObject'),
					b => b.p('observableMap').mapAny().p('observableObject'),
					b => b.p('observableMap').mapKey(['observableObject', 'object']),
					b => b.p('observableMap').mapKeys(['observableObject', 'object']),
					b => b.p('observableMap').mapPredicate([
						key => key === 'observableObject',
						key => key === 'object',
					], ['desc1', 'desc2']),
					b => b.p('observableMap').mapRegexp([/^observableObject$/, /^object$/]),
					b => b.propertyAny().p('observableObject'),
					b => b.propertyPredicate([
						key => key === 'observableObject',
						key => key === 'object',
					], ['desc1', 'desc2']),
					b => b.propertyRegexp([/^observableObject$/, /^object$/]),
					b => b.p('property').v(['@value_observableObject', '@value_object']),
					b => b.p('property').valuePropertyName(['@value_observableObject', '@value_object']),
					b => b.p('property').valuePropertyNames(['@value_observableObject', '@value_object']),
				)
				.p('value'),
		)
			.subscribe(o => ['value'])
			.unsubscribe(o => ['value'])
	})
})
