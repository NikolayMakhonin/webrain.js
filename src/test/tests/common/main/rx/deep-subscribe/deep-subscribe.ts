/* tslint:disable:no-construct use-primitive-type no-shadowed-variable no-duplicate-string */
import {IListChanged} from '../../../../../../main/common/lists/contracts/IListChanged'
import {IMapChanged} from '../../../../../../main/common/lists/contracts/IMapChanged'
import {ISetChanged} from '../../../../../../main/common/lists/contracts/ISetChanged'
import {ObservableMap} from '../../../../../../main/common/lists/ObservableMap'
import {ObservableSet} from '../../../../../../main/common/lists/ObservableSet'
import {SortedList} from '../../../../../../main/common/lists/SortedList'
import {deepSubscribe} from '../../../../../../main/common/rx/deep-subscribe/deep-subscribe'
import {RuleBuilder} from '../../../../../../main/common/rx/deep-subscribe/RuleBuilder'
import {ObservableObject} from '../../../../../../main/common/rx/object/ObservableObject'
import {ObservableObjectBuilder} from '../../../../../../main/common/rx/object/ObservableObjectBuilder'
import {IUnsubscribe} from '../../../../../../main/common/rx/subjects/subject'
import {createObject, Tester} from "./helpers/Tester";

declare const assert

describe('common > main > rx > deep-subscribe > deep-subscribe', function() {
	const check = createObject()

	it('object', function() {
		new Tester(
			{
				object: createObject().object,
				immediate: false,
			},
			b => b.path(o => o.object),
			b => b.path(o => o.object.object),
			b => b.path(o => o.object.object.object),
		)
			.subscribe(null)
			.change(o => {
				o.object = null
				return [[], []]
			})

		new Tester(
			{
				object: createObject().object,
				immediate: true,
			},
			b => b.path(o => o.object),
			b => b.path(o => o.object.object),
			b => b.path(o => o.object.object.object),
		)
			.subscribe([check.object])
			.unsubscribe([check.object])

		new Tester(
			{
				object: createObject().object,
				immediate: true,
			},
			b => b.path(o => o.observableObject.object),
			b => b.path(o => o.object.observableObject.object),
			// b => b.path(o => o.object.observableObject.object.object),
			// b => b.path(o => o.object.object.observableObject.object.object),
			// b => b
			// 	.repeat(3, 3, b => b
			// 		.path(o => o.object)
			// 		.repeat(3, 3, b => b
			// 			.path(o => o.observableObject)))
			// 	.path(o => o.observableObject.object),
		)
			.subscribe([check.object])
			.change(o => {
				o.observableObject.object = 1 as any
				return [[o.object], []]
			})
			.change(o => {
				o.observableObject.object = new Number(1) as any
				return [[], [new Number(1) as any]]
			})
			.change(o => {
				o.observableObject.object = new Number(2) as any
				return [[new Number(1) as any], [new Number(2) as any]]
			})
			.unsubscribe([new Number(2) as any])

		new Tester(
			{
				object: createObject().object,
				immediate: true,
			},
			b => b.path(o => o.object.observableObject.object.object),
			b => b.path(o => o.object.object.observableObject.object.object),
			b => b
				.repeat(3, 3, b => b
					.path(o => o.object)
					.repeat(3, 3, b => b
						.path(o => o.observableObject)))
				.path(o => o.object.object),
		)
			.subscribe([check.object])
			.change(o => {
				o.observableObject.object = 1 as any
				return [[o.object], []]
			})
			.change(o => {
				o.observableObject.object = new Number(1) as any
				return [[], []]
			})
			.change(o => {
				o.observableObject.object = new Number(2) as any
				return [[], []]
			})
			.unsubscribe([])

		new Tester(
			{
				object: createObject().object,
				immediate: true,
			},
			b => b
				.repeat(0, 2, b => b
					.path(o => o.object))
				.path(o => o.observableObject.object),
		)
			.subscribe([
				check.object,
			])
			.change(o => {
				o.observableObject.object = 1 as any
				return [[
					o.object,
				], []]
			})
			.change(o => {
				o.observableObject.object = new Number(1) as any
				return [[], [
					new Number(1) as any,
				]]
			})
			.change(o => {
				o.observableObject.object = new Number(2) as any
				return [[
					new Number(1) as any,
				], [
					new Number(2) as any,
				]]
			})
			.unsubscribe([
				new Number(2) as any,
			])

		new Tester(
			{
				object: createObject().object,
				immediate: false,
			},
			b => b
				.repeat(1, 3, b => b
					.any(
						b => b.propertyRegexp(/object|observableObject/),
						b => b.path(o => o['list|set|map|observableList|observableSet|observableMap']['#']),
					),
				),
		)
			.subscribe([])
	})

	it('any', function() {
		new Tester(
			{
				object: createObject().object,
				immediate: true,
			},
			b => b
				.path((o: any) => o['object|observableObject'].value),
		)
			.subscribe([])
			.change(o => {
				return [[], []]
			})
	})

	it('lists', function() {
		const value = new Number(1)

		new Tester(
			{
				object: createObject().object,
				immediate: true,
				ignoreSubscribeCount: true,
			},
			b => b
				.repeat(1, 3, b => b
					.any(
						b => b.propertyRegexp(/object|observableObject/),
						b => b.path(o => o['list|set|map|observableList|observableSet|observableMap']['#']),
					),
				)
				.path(o => o.value),
		)
			.subscribe([])
			.change(o => {
				o.observableObject.value = value
				return [[], [value]]
			})
			.change(o => {
				o.observableList.add(value as any)
				return [[], []]
			})
			.change(o => {
				o.observableSet.add(value as any)
				return [[], []]
			})
			.change(o => {
				o.observableMap.set('value', value as any)
				return [[], []]
			})
			.unsubscribe([value])

		new Tester(
			{
				object: createObject().object,
				immediate: true,
				ignoreSubscribeCount: true,
			},
			b => b
				.repeat(1, 3, b => b
					.any(
						b => b.propertyRegexp(/object|observableObject/),
						b => b.path(o => o['list|set|map|observableList|observableSet|observableMap']['#']),
					),
				)
				.path(o => o['#value']),
		)
			.subscribe([])
			.change(o => {
				o.observableObject.value = value
				return [[], []]
			})
			.change(o => {
				o.observableList.add(value as any)
				return [[], []]
			})
			.change(o => {
				o.observableSet.add(value as any)
				return [[], []]
			})
			.change(o => {
				o.observableMap.set('value', value as any)
				return [[], [value]]
			})
			.unsubscribe([value])

		// new Tester(
		// 	{
		// 		object: createObject().object,
		// 		immediate: true,
		// 		ignoreSubscribeCount: true,
		// 	},
		// 	b => b
		// 		.repeat(1, 3, b => b
		// 			.any(
		// 				b => b.propertyRegexp(/object|observableObject/),
		// 				b => b.path(o => o['list|set|map|observableList|observableSet|observableMap']['#']),
		// 			),
		// 		)
		// 		.path(o => o['#']),
		// )
		// 	.subscribe([])
			// .change(o => {
			// 	o.observableObject.value = value
			// 	return [[], []]
			// })
			// .change(o => {
			// 	o.observableList.add(value as any)
			// 	return [[], [value]]
			// })
			// .change(o => {
			// 	o.observableSet.add(value as any)
			// 	return [[], [value]]
			// })
			// .change(o => {
			// 	o.observableMap.set('value', value as any)
			// 	return [[], [value]]
			// })
			// .unsubscribe([value])
	})
})
