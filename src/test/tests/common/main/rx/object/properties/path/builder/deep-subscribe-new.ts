// /* tslint:disable:no-construct use-primitive-type no-shadowed-variable no-duplicate-string no-empty max-line-length */
// import {ListChangedType} from '../../../../../../../../../main/common/lists/contracts/IListChanged'
// import {MapChangedType} from '../../../../../../../../../main/common/lists/contracts/IMapChanged'
// import {assert} from '../../../../../../../../../main/common/test/Assert'
// import {describe, it, xit} from '../../../../../../../../../main/common/test/Mocha'
// import {createObject, TestDeepSubscribe, TestDeepSubscribeVariants} from './helpers/src/TestDeepSubscribe'
//
// describe('common > main > rx > properties > builder > deep-subscribe new', function() {
// 	this.timeout(300000)
//
// 	const check = createObject()
//
// 	after(function() {
// 		console.log('Total ObjectMerger tests >= ' + TestDeepSubscribe.totalTests)
// 	})
//
// 	it('ruleFactoriesVariants self sync', function() {
// 		new TestDeepSubscribeVariants(
// 			{
// 				object: createObject().observableObject,
// 				immediate: true,
// 				doNotSubscribeNonObjectValues: true,
// 			},
// 			b => b
// 				.variants()
// 				.variants(
// 					b => b.any(
// 						b => b.p('promiseSync'),
// 						b => b.any(
// 							b => b.never(),
// 							b => b.if([o => false, b => b.nothing()], [null, b => b.never()]),
// 						),
// 						b => b.neverVariants(),
// 					),
// 					b => b.if([o => false, b => b.never()], [null, b => b.nothing()]),
// 					b => b.p(['observableObject', 'object']),
// 					b => b.propertyName(['observableObject', 'object']),
// 					b => b.propertyNames(['observableObject', 'object']),
// 					b => b.repeat(1, 1, null, [
// 						b => b.p('observableObject'),
// 						b => b.p('object'),
// 					]),
// 					b => b.valuePropertyDefault(),
// 					b => b.nothing(),
// 					b => b.p('observableList').collection().p('observableObject'),
// 					b => b.p('observableMap').mapAny().p('observableObject'),
// 					b => b.p('observableMap').mapKey(['observableObject', 'object']),
// 					b => b.p('observableMap').mapKeys(['observableObject', 'object']),
// 					b => b.p('observableMap').mapPredicate([
// 						key => key === 'observableObject',
// 						key => key === 'object',
// 					], ['desc1', 'desc2']),
// 					b => b.p('observableMap').mapRegexp([/^observableObject$/, /^object$/]),
// 					b => b.propertyAny().p('observableObject'),
// 					b => b.propertyPredicate([
// 						key => key === 'observableObject',
// 						key => key === 'object',
// 					], ['desc1', 'desc2']),
// 					b => b.propertyRegexp([/^observableObject$/, /^object$/]),
// 					b => b.p('property').v(['@value_observableObject', '@value_object']),
// 					b => b.p('property').valuePropertyName(['@value_observableObject', '@value_object']),
// 					b => b.p('property').valuePropertyNames(['@value_observableObject', '@value_object']),
// 				)
// 				.p('promiseSync')
// 				.p('value')
// 				.nothingVariants(),
// 		)
// 			.subscribe(o => ['value'], [void 0], ['value'])
// 			.change(o => o.value = 'value2', ['value'], ['value2'], ['value2'])
// 			.unsubscribe(o => ['value2'], [void 0])
// 	})
//
// 	it('ruleFactoriesVariants self async', async function() {
// 		const tester = new TestDeepSubscribeVariants(
// 			{
// 				object: createObject().observableObject,
// 				immediate: true,
// 				doNotSubscribeNonObjectValues: true,
// 			},
// 			b => b
// 				.variants()
// 				.variants(
// 					b => b.any(
// 						b => b.p('promiseSync'),
// 						b => b.any(
// 							b => b.never(),
// 							b => b.if([o => false, b => b.nothing()], [null, b => b.never()]),
// 						),
// 						b => b.never(),
// 					),
// 					b => b.if([o => false, b => b.never()], [null, b => b.nothing()]),
// 					b => b.p(['observableObject', 'object']),
// 					b => b.propertyName(['observableObject', 'object']),
// 					b => b.propertyNames(['observableObject', 'object']),
// 					b => b.repeat(1, 1, null, [
// 						b => b.p('observableObject'),
// 						b => b.p('object'),
// 					]),
// 					b => b.valuePropertyDefault(),
// 					b => b.nothing(),
// 					b => b.p('observableList').collection().p('observableObject'),
// 					b => b.p('observableMap').mapAny().p('observableObject'),
// 					b => b.p('observableMap').mapKey(['observableObject', 'object']),
// 					b => b.p('observableMap').mapKeys(['observableObject', 'object']),
// 					b => b.p('observableMap').mapPredicate([
// 						key => key === 'observableObject',
// 						key => key === 'object',
// 					], ['desc1', 'desc2']),
// 					b => b.p('observableMap').mapRegexp([/^observableObject$/, /^object$/]),
// 					b => b.propertyAny().p('observableObject'),
// 					b => b.propertyPredicate([
// 						key => key === 'observableObject',
// 						key => key === 'object',
// 					], ['desc1', 'desc2']),
// 					b => b.propertyRegexp([/^observableObject$/, /^object$/]),
// 					b => b.p('property').v(['@value_observableObject', '@value_object']),
// 					b => b.p('property').valuePropertyName(['@value_observableObject', '@value_object']),
// 					b => b.p('property').valuePropertyNames(['@value_observableObject', '@value_object']),
// 				)
// 				.p('promiseAsync')
// 				.p('value')
// 				.nothingVariants(),
// 		)
//
// 		await tester.subscribeAsync(o => ['value'], [void 0], ['value'])
// 		await tester.changeAsync(o => o.value = 'value2', ['value'], ['value2'], ['value2'])
// 		await tester.unsubscribeAsync(o => ['value2'], [void 0])
// 	})
//
// 	xit('last nothing sync', function() {
// 		new TestDeepSubscribeVariants(
// 			{
// 				object: createObject().observableObject,
// 				immediate: true,
// 				doNotSubscribeNonObjectValues: true,
// 			},
// 			b => b
// 				.p('value')
// 				.any(b => b.nothing())
// 				// .repeat(0, 1, null, b => b.nothing())
// 				// .repeat(0, 3, (o, i) => i === 3 ? RuleRepeatAction.Fork : RuleRepeatAction.Next, b => b.nothing())
// 				// .nothingVariants()
// 		)
// 			.subscribe(o => ['value'], [void 0], ['value'])
// 			.change(o => o.value = 'value2', ['value'], ['value2'], ['value2'])
// 			.unsubscribe(o => ['value2'], [void 0])
// 	})
//
// 	it('property value sync', function() {
// 		new TestDeepSubscribeVariants(
// 			{
// 				object: createObject().observableObject,
// 				immediate: true,
// 				doNotSubscribeNonObjectValues: true,
// 			},
// 			b => b
// 				.v('notExistProperty')
// 				.p('property')
// 				.v<string>('value_value')
// 				// .any(b => b.nothing())
// 				// .repeat(0, 1, null, b => b.nothing())
// 				// .repeat(0, 3, (o, i) => i === 3 ? RuleRepeatAction.Fork : RuleRepeatAction.Next, b => b.nothing())
// 				// .nothingVariants()
// 		)
// 			.subscribe(o => ['value'], [void 0], ['value'])
// 			.change(o => o.property.value_value = 'value2', ['value'], ['value2'], ['value2'])
// 			.unsubscribe(o => ['value2'], [void 0])
// 	})
//
// 	it('chain of same objects: propertyChanged with oldValue === newValue', function() {
// 		new TestDeepSubscribeVariants(
// 			{
// 				object: createObject().observableObject,
// 				immediate: true,
// 			},
// 			b => b.p('observableObject').p('observableObject').p('valueObject'),
// 		)
// 			.subscribe(o => [new String('value')])
// 			.change(
// 				o => o.propertyChanged.onPropertyChanged('observableObject'),
// 				o => [new String('value')],
// 				o => [new String('value')],
// 			)
// 			.unsubscribe(o => [new String('value')])
//
// 		new TestDeepSubscribeVariants(
// 			{
// 				object: createObject().observableObject,
// 				immediate: true,
// 			},
// 			b => b.p('property').v('value_property').v('value_property').v('value_valueObject'),
// 		)
// 			.subscribe(o => [new String('value')])
// 			.change(
// 				o => o.property.propertyChanged.onPropertyChanged('value_property'),
// 				o => [new String('value')],
// 				o => [new String('value')],
// 			)
// 			.unsubscribe(o => [new String('value')])
//
// 		new TestDeepSubscribeVariants(
// 			{
// 				object: createObject().observableObject,
// 				immediate: true,
// 			},
// 			b => b.p('observableMap').mapKey('observableMap').mapKey('observableMap').mapKey('valueObject'),
// 		)
// 			.subscribe(o => [new String('value')])
// 			.change(
// 				o => o.observableMap.mapChanged.emit({
// 					type: MapChangedType.Set,
// 					key: 'observableMap',
// 					oldValue: o.observableMap,
// 					newValue: o.observableMap,
// 				}),
// 				o => [new String('value')],
// 				o => [new String('value')],
// 			)
// 			.unsubscribe(o => [new String('value')])
//
// 		// new TestDeepSubscribeVariants(
// 		// 	{
// 		// 		object: createObject().observableObject,
// 		// 		immediate: true,
// 		// 	},
// 		// 	b => b.p('observableList').collection()
// 		// 		.p('observableList').collection()
// 		// 		.p('valueObject'),
// 		// )
// 		// 	.subscribe(o => [new String('value')])
// 		// 	.change(
// 		// 		o => o.observableList.listChanged.emit({
// 		// 			type: ListChangedType.Set,
// 		// 			index: o.observableList.indexOf(o.observableList),
// 		// 			oldItems: [o.observableList],
// 		// 			newItems: [o.observableList],
// 		// 		}),
// 		// 		o => [new String('value')],
// 		// 		o => [new String('value')],
// 		// 	)
// 		// 	.unsubscribe(o => [new String('value')])
// 	})
// })
