/* tslint:disable:no-construct use-primitive-type no-shadowed-variable no-duplicate-string no-empty max-line-length */
import {delay} from '../../../../../../main/common/helpers/helpers'
import {createObject, Tester} from './helpers/Tester'

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
			.change(o => o.object = null, [], [])

		new Tester(
			{
				object: createObject().observableObject,
				immediate: false,
			},
			b => b.path(o => o.object),
			// b => b.path(o => o.observableObject.object),
			// b => b.path(o => o.observableObject.observableObject.object),
			// b => b.path(o => o.observableObject.observableObject.observableObject.object),
		)
			.subscribe([])
			.unsubscribe([])
			.subscribe([])
			.change(o => o.object = new Number(1) as any,
				[], [new Number(1) as any])

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
				doNotSubscribeNonObjectValues: true,
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
			.change(o => o.observableObject.object = 1 as any,
				o => [o.object], [])
			.change(o => o.observableObject.object = new Number(1) as any,
				[], [new Number(1) as any])
			.change(o => o.observableObject.object = new Number(2) as any,
				[new Number(1) as any], [new Number(2) as any])
			.unsubscribe([new Number(2) as any])

		new Tester(
			{
				object: createObject().object,
				immediate: true,
				doNotSubscribeNonObjectValues: true,
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
			.change(o => o.observableObject.object = 1 as any,
				o => [o.object], [])
			.change(o => o.observableObject.object = new Number(1) as any,
				[], [])
			.change(o => o.observableObject.object = new Number(2) as any,
				[], [])
			.unsubscribe([])

		new Tester(
			{
				object: createObject().object,
				immediate: true,
				doNotSubscribeNonObjectValues: true,
			},
			b => b
				.repeat(0, 2, b => b
					.path(o => o.object))
				.path(o => o.observableObject.object),
		)
			.subscribe([
				check.object,
			])
			.change(o => o.observableObject.object = 1 as any,
				o => [o.object], [])
			.change(o => o.observableObject.object = new Number(1) as any,
				[], [new Number(1) as any])
			.change(o => o.observableObject.object = new Number(2) as any,
				[new Number(1) as any], [new Number(2) as any])
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

	it('chain of same objects', function() {
		new Tester(
			{
				object: createObject().observableObject,
				immediate: true,
			},
			// b => b.path(o => o.observableObject),
			b => b.path(o => o.observableObject.observableObject),
			b => b.path(o => o.observableObject.observableObject.observableObject),
		)
			.subscribe(o => [o.observableObject])
			.change(
				o => o.observableObject = new Number(1) as any,
				o => [o.observableObject],
				o => [],
			)
			.unsubscribe([])

		new Tester(
			{
				object: createObject().observableObject,
				immediate: true,
			},
			// b => b.path(o => o.object),
			b => b.path(o => o.object.observableObject.object),
			b => b.path(o => o.object.observableObject.object.observableObject.object),
		)
			.subscribe(o => [o.object])
			.change(
				o => o.object = new Number(1) as any,
				o => [o.object],
				o => [],
			)
			.unsubscribe([])

		const observableList = createObject().observableList
		observableList.clear()
		observableList.add(observableList)
		new Tester(
			{
				object: observableList,
				immediate: true,
			},
			b => b.path(o => o['#']['#']),
			b => b.path(o => o['#']['#']['#']),
		)
			.subscribe(o => [...o])
			.change(
				o => o.set(0, new Number(1) as any),
				o => [o.get(0)],
				o => [],
			)
			.unsubscribe([])

		const observableSet = createObject().observableSet
		observableSet.clear()
		observableSet.add(observableSet)
		new Tester(
			{
				object: observableSet,
				immediate: true,
			},
			b => b.path(o => o['#']['#']),
			b => b.path(o => o['#']['#']['#']),
		)
			.subscribe(o => [...o])
			.change(
				o => {
					o.clear()
					o.add(new Number(1) as any)
				},
				o => [Array.from(o.values())[0]],
				o => [],
			)
			.unsubscribe([])

		new Tester(
			{
				object: createObject().observableMap,
				immediate: true,
			},
			b => b.path(o => o['#observableMap']['#observableMap']),
			b => b.path(o => o['#observableMap']['#observableMap']['#observableMap']),
		)
			.subscribe(o => [o.get('observableMap')])
			.change(
				o => o.set('observableMap', new Number(1) as any),
				o => [o.get('observableMap')],
				o => [],
			)
			.unsubscribe([])

		new Tester(
			{
				object: createObject().observableMap,
				immediate: true,
			},
			b => b.path(o => o['#observableMap']['#object'].observableMap['#observableMap']['#object']),
			b => b.path(o => o['#observableMap']['#object'].observableMap['#observableMap']['#object'].observableMap['#observableMap']['#object']),
		)
			.subscribe(o => [o.get('object')])
			.change(
				o => o.set('object', new Number(1) as any),
				o => [o.get('object')],
				o => [],
			)
			.unsubscribe([])

		new Tester(
			{
				object: createObject().observableObject,
				immediate: true,
			},
			b => b.path(o => o.object),
			b => b.path(o => o.observableObject.object),
		)
			.subscribe(o => [o.object])
			.change(
				o => o.object = new Number(1) as any,
				o => [o.object],
				o => [new Number(1) as any],
			)
			.unsubscribe([new Number(1) as any])
	})

	it('any', function() {
		new Tester(
			{
				object: createObject().object,
				immediate: true,
				doNotSubscribeNonObjectValues: true,
			},
			b => b
				.path((o: any) => o['object|observableObject'].value),
		)
			.subscribe([])
			.change(o => {}, [], [])
	})

	it('promises', async function() {
		const object = createObject()
		object.observableObject.value = new Number(1)

		const tester = new Tester(
			{
				object: object.promiseSync as any,
				immediate: true,
				doNotSubscribeNonObjectValues: true,
			},
			b => b
				.path((o: any) => o.promiseAsync.value),
		)

		await tester.subscribeAsync([new Number(1)])

		await delay(20)

		await tester.changeAsync(
			o => object.observableObject.value = new Number(2) as any,
			[new Number(1)],
			[new Number(2)],
		)

		await delay(20)

		await tester.unsubscribe([new Number(2)])

		await delay(100)
	})

	it('promises throw', async function() {
		const object = createObject()
		object.observableObject.value = new Number(1)

		const tester = new Tester(
			{
				object: object.promiseSync as any,
				immediate: true,
				doNotSubscribeNonObjectValues: true,
				useIncorrectUnsubscribe: true,
			},
			b => b
				.path((o: any) => o.promiseAsync.value),
		)

		await tester.subscribeAsync([new Number(1)])

		await delay(20)

		await tester.changeAsync(
			o => object.observableObject.value = new Number(2) as any,
			[],
			[new Number(2)],
			Error,
			/should return null\/undefined or unsubscribe function/,
		)

		await delay(20)

		await tester.unsubscribe([])

		await delay(100)
	})

	it('lists', function() {
		const value = new Number(1)

		new Tester(
			{
				object: createObject().object,
				immediate: true,
				ignoreSubscribeCount: true,
				doNotSubscribeNonObjectValues: true,
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
			.change(o => o.observableObject.target = value,
				[], [value])
			.change(o => o.observableList.add(value as any),
				[], [])
			.change(o => o.observableSet.add(value as any),
				[], [])
			.change(o => o.observableMap.set('value', value as any),
				[], [])
			.unsubscribe([value])

		new Tester(
			{
				object: createObject().object,
				immediate: true,
				ignoreSubscribeCount: true,
				doNotSubscribeNonObjectValues: true,
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
			.change(o => o.observableObject.target = value,
				[], [])
			.change(o => o.observableList.add(value as any),
				[], [])
			.change(o => o.observableSet.add(value as any),
				[], [])
			.change(o => o.observableMap.set('value', value as any),
				[], [value])
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

	it('throws', function() {
		new Tester(
			{
				object: createObject().observableObject,
				immediate: true,
			},
			b => b.path(o => o.object),
		)
			.subscribe(o => [o.object])
			.change(
				o => o.object = 1 as any,
				o => [o.object, 1 as any],
				o => [1 as any],
				Error,
				/unsubscribe function for non Object value/,
			)

		new Tester(
			{
				object: createObject().object,
				immediate: true,
			},
			b => b.path(o => o.value),
			b => b.path(o => o.object.object.object.value),
			b => b.path(o => o.observableObject.observableObject.observableObject.value),
			b => b.path(o => o.observableList['#'].observableList['#'].observableList['#'].value),
			b => {
				b = b.path(o => o.object.object.object.value)
				delete b.rule.description
				delete b.rule.next.next.description
				return b
			},
		)
			.subscribe(
				[null], [null],
				Error,
				/unsubscribe function for non Object value/,
			)
	})

	it('throws incorrect Unsubscribe', function() {
		new Tester(
			{
				object: createObject().object,
				immediate: true,
				doNotSubscribeNonObjectValues: true,
				useIncorrectUnsubscribe: true,
			},
			b => b
				.path((o: any) => o.object),
		)
			.subscribe(
				o => [o.object], [],
				Error,
				/should return null\/undefined or unsubscribe function/,
			)

		new Tester(
			{
				object: createObject().object,
				immediate: true,
				// doNotSubscribeNonObjectValues: true,
				useIncorrectUnsubscribe: true,
			},
			b => b
				.path((o: any) => o.object.value),
		)
			.subscribe(
				[null], [],
				Error,
				/should return null\/undefined or unsubscribe function/,
			)
	})
})
