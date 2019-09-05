"use strict";

/* tslint:disable:no-duplicate-string */

/* eslint-disable guard-for-in */
xdescribe('common > main > rx > properties > CalcProperty', function () {// it('connect', function() {
  // 	const source: any = createObject().observableObject
  // 	new ObservableObjectBuilder(source)
  // 		.writable('baseProp1')
  // 		.writable('baseProp2')
  // 		.writable('prop1')
  // 		.writable('prop2')
  //
  // 	source.baseProp1 = 'baseProp1_init_source'
  //
  // 	class BaseClass1 extends ObservableObject {
  // 		public readonly source = source
  // 		public baseProp1
  // 	}
  //
  // 	class BaseClass2 extends BaseClass1 {
  // 		public baseProp2
  // 	}
  //
  // 	class Class1 extends BaseClass1 {
  // 		public prop1
  // 	}
  //
  // 	class Class2 extends BaseClass2 {
  // 		public prop2
  // 	}
  //
  // 	const baseBuilder1 = new ConnectorBuilder(BaseClass1.prototype as BaseClass1)
  // 		.connect('baseProp1', {
  // 			buildRule: b => b.path(o => o.source
  // 				.property['@value_property']
  // 				.observableMap['#observableList']
  // 				['#']
  // 				.baseProp1),
  // 		}, 'baseProp1_init')
  //
  // 	const baseBuilder2 = new ConnectorBuilder(BaseClass2.prototype as BaseClass2)
  // 		.connect('baseProp2', {
  // 			buildRule: b => b.path(o => o.source
  // 				.property['@value_property']
  // 				.observableMap['#observableList']
  // 				['#']
  // 				.baseProp2),
  // 		}, 'baseProp2_init')
  //
  // 	const builder1 = new ConnectorBuilder(Class1.prototype as Class1)
  // 		.connect('prop1', {
  // 			buildRule: b => b.path(o => o.source
  // 				.property['@value_property']
  // 				.observableMap['#observableList']
  // 				['#']
  // 				.prop1),
  // 		}, 'prop1_init')
  //
  // 	const builder2 = new ConnectorBuilder(Class2.prototype as Class2)
  // 		.connect('prop2', {
  // 			buildRule: b => b.path(o => o.source
  // 				.property['@value_property']
  // 				.observableMap['#observableList']
  // 				['#']
  // 				.prop2),
  // 		}, 'prop2_init')
  //
  // 	const baseObject1 = new BaseClass1()
  // 	const baseObject2 = new BaseClass2()
  // 	const object1 = new Class1()
  // 	const object2 = new Class2()
  //
  // 	// eslint-disable-next-line prefer-const
  // 	let baseResults1 = []
  // 	const baseSubscriber1 = value => {
  // 		baseResults1.push(value)
  // 	}
  //
  // 	// eslint-disable-next-line prefer-const
  // 	let baseResults2 = []
  // 	const baseSubscriber2 = value => {
  // 		baseResults2.push(value)
  // 	}
  //
  // 	// eslint-disable-next-line prefer-const
  // 	const results1 = []
  // 	const subscriber1 = value => {
  // 		results1.push(value)
  // 	}
  //
  // 	// eslint-disable-next-line prefer-const
  // 	let results2 = []
  // 	const subscriber2 = value => {
  // 		results2.push(value)
  // 	}
  //
  // 	const baseUnsubscribe1 = []
  // 	const baseUnsubscribe2 = []
  // 	const unsubscribe1 = []
  // 	const unsubscribe2 = []
  //
  // 	assert.strictEqual(typeof (baseUnsubscribe1[0]
  // 		= baseObject1.propertyChanged.subscribe(baseSubscriber1)), 'function')
  // 	assert.strictEqual(typeof (baseUnsubscribe2[0]
  // 		= baseObject2.propertyChanged.subscribe(baseSubscriber2)), 'function')
  // 	assert.strictEqual(typeof (unsubscribe1[0] = object1.propertyChanged.subscribe(subscriber1)), 'function')
  // 	assert.strictEqual(typeof (unsubscribe2[0] = object2.propertyChanged.subscribe(subscriber2)), 'function')
  //
  // 	assert.strictEqual(baseObject1.baseProp1, 'baseProp1_init_source')
  //
  // 	source.baseProp1 = '1'
  // 	assert.deepStrictEqual(baseResults1, [
  // 		{
  // 			name    : 'baseProp1',
  // 			newValue: '1',
  // 			oldValue: 'baseProp1_init_source',
  // 		},
  // 	])
  // 	baseResults1 = []
  // 	assert.deepStrictEqual(baseResults2, [])
  // 	assert.deepStrictEqual(results1, [])
  // 	assert.deepStrictEqual(results2, [])
  // 	assert.deepStrictEqual(baseObject1.baseProp1, '1')
  // 	assert.deepStrictEqual(baseObject2.baseProp1, 'baseProp1_init_source')
  // 	assert.deepStrictEqual(object1.baseProp1, 'baseProp1_init_source')
  // 	assert.deepStrictEqual(object2.baseProp1, 'baseProp1_init_source')
  //
  // 	assert.strictEqual(baseObject2.baseProp2, 'baseProp2_init')
  //
  // 	source.baseProp2 = '3'
  // 	assert.deepStrictEqual(baseResults1, [])
  // 	assert.deepStrictEqual(baseResults2, [
  // 		{
  // 			name    : 'baseProp2',
  // 			newValue: '3',
  // 			oldValue: 'baseProp2_init',
  // 		},
  // 	])
  // 	baseResults2 = []
  // 	assert.deepStrictEqual(results1, [])
  // 	assert.deepStrictEqual(results2, [])
  // 	assert.deepStrictEqual((baseObject1 as any).baseProp2, undefined)
  // 	assert.deepStrictEqual(baseObject2.baseProp2, '3')
  // 	assert.deepStrictEqual((object1 as any).baseProp2, undefined)
  // 	assert.deepStrictEqual(object2.baseProp2, 'baseProp2_init')
  //
  // 	new ConnectorBuilder(object2)
  // 		.readable('baseProp1', null, '7')
  //
  // 	assert.deepStrictEqual(baseResults1, [])
  // 	assert.deepStrictEqual(baseResults2, [])
  // 	assert.deepStrictEqual(results1, [])
  // 	assert.deepStrictEqual(results2, [
  // 		{
  // 			name    : 'baseProp1',
  // 			newValue: '7',
  // 			oldValue: 'baseProp1_init_source',
  // 		},
  // 	])
  // 	results2 = []
  // 	assert.deepStrictEqual(baseObject1.baseProp1, '1')
  // 	assert.deepStrictEqual(baseObject2.baseProp1, 'baseProp1_init_source')
  // 	assert.deepStrictEqual(object1.baseProp1, 'baseProp1_init_source')
  // 	assert.deepStrictEqual(object2.baseProp1, '7')
  // })
});