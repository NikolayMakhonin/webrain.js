/* tslint:disable:no-construct use-primitive-type no-shadowed-variable no-duplicate-string no-empty max-line-length */
import { delay } from '../../../../../../main/common/helpers/helpers';
import { VALUE_PROPERTY_DEFAULT } from '../../../../../../main/common/helpers/value-property';
import { RuleRepeatAction } from '../../../../../../main/common/rx/deep-subscribe/contracts/rules';
import { ObservableClass } from '../../../../../../main/common/rx/object/ObservableClass';
import { ObservableObjectBuilder } from '../../../../../../main/common/rx/object/ObservableObjectBuilder';
import { describe, it, xit } from '../../../../../../main/common/test/Mocha';
import { createObject, TestDeepSubscribe } from './helpers/src/TestDeepSubscribe';
describe('common > main > rx > deep-subscribe > deep-subscribe', function () {
  const check = createObject();
  it('RuleIf simple', function () {
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.propertyAny().if([o => Array.isArray(o), b => b.p('1')], b => b.never()), b => b.propertyAny().repeat(1, 1, o => Array.isArray(o) ? RuleRepeatAction.Next : RuleRepeatAction.Fork, b => b.p('1'))).subscribe(o => ['value2']).unsubscribe(o => ['value2']).subscribe(o => ['value2']).unsubscribe(o => ['value2']);
  });
  it('repeat with condition', function () {
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.propertyAny().propertyRegexp(/^[a-z]/).repeat(1, 1, o => Array.isArray(o) ? RuleRepeatAction.Next : RuleRepeatAction.Fork, b => b.p('1')), b => b.propertyAny().repeat(1, 1, null, b => b.propertyRegexp(/^[a-z]/)).repeat(1, 1, o => Array.isArray(o) ? RuleRepeatAction.Next : RuleRepeatAction.Fork, b => b.p('1')), // b => b
    // 	.propertyRegexp(/^[a-z]/)
    // 	.repeat(0, 1, o => o && o.constructor === ObservableClass
    // 		? RuleRepeatAction.Next
    // 		: RuleRepeatAction.Fork, b => b.propertyRegexp(/^[a-z]/))
    // 	.repeat(1, 1,
    // 		o => Array.isArray(o) ? RuleRepeatAction.Next : RuleRepeatAction.Fork,
    // 		b => b.p('1')),
    b => b.propertyAny().repeat(0, 0, null, b => b.propertyRegexp(/^[a-z]/)).repeat(1, 1, o => Array.isArray(o) ? RuleRepeatAction.Next : RuleRepeatAction.Fork, b => b.p('1')), b => b.propertyAny().repeat(2, 3, o => o && o.constructor === ObservableClass ? RuleRepeatAction.Next : RuleRepeatAction.Fork, b => b.propertyRegexp(/^[a-z]/)).repeat(1, 1, o => Array.isArray(o) ? RuleRepeatAction.Next : RuleRepeatAction.Fork, b => b.p('1'))).subscribe(o => ['value2']).unsubscribe(o => ['value2']).subscribe(o => ['value2']).unsubscribe(o => ['value2']);
  });
  it('unsubscribe leaf non object', function () {
    const object1 = createObject();
    new TestDeepSubscribe({
      object: object1.observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.p('value')).subscribe(o => [o.value]).unsubscribe(o => [o.value]).subscribe(o => [o.value]).unsubscribe(o => [o.value]);
  });
  it('unsubscribe leaf', function () {
    const object1 = createObject();
    new TestDeepSubscribe({
      object: object1.observableObject,
      immediate: true
    }, b => b.any(b2 => b2.p('map2').mapKey('valueObject'), b2 => b2.p('observableMap').mapKey('valueObject')), b => b.p('map2').mapKey('valueObject')).subscribe(o => [o.valueObject]).unsubscribe(o => [o.valueObject]).subscribe(o => [o.valueObject]).change(o => o.observableMap.delete('valueObject'), [], []).unsubscribe([object1.valueObject]);
  });
  it('rule nothing', function () {
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.p('value').nothing()).subscribe(['value']).unsubscribe(['value']);
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true
    }, b => b.nothing()).subscribe([check.object]).unsubscribe([check.object]);
  });
  it('rule never', function () {
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true,
      shouldNeverSubscribe: true
    }, b => b.never(), b => b.never().p('value'), b => b.never().nothing().p('value'), b => b.never().p('valueObject'), b => b.never().nothing().p('valueObject')).subscribe([]).unsubscribe([]);
  });
  it('unsubscribe repeat 2', function () {
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true
    }, b => b.path(o => o.object.object.observableObject.object)).subscribe([check.object]).unsubscribe([check.object]);
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true
    }, b => b.repeat(2, 2, null, b => b.path(o => o.object)).path(o => o.observableObject.object)).subscribe([check.object]).unsubscribe([check.object]);
  });
  it('unsubscribe repeat 0..5', function () {
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true
    }, b => b.repeat(0, 5, null, b => b.path(o => o.object)).path(o => o.observableObject.object)).subscribe([check.object]).unsubscribe([check.object]);
  });
  it('unsubscribe middle', function () {
    const object1 = createObject();
    new TestDeepSubscribe({
      object: object1.observableObject,
      immediate: true
    }, b => b.any(b2 => b2.p('object'), b2 => b2.p('map2').mapKey('object')).p('valueObject')).subscribe(o => [o.valueObject]).unsubscribe(o => [o.valueObject]).subscribe(o => [o.valueObject]).change(o => o.object = void 0, [], []).unsubscribe([object1.valueObject]);
  });
  it('object', function () {
    const object1 = createObject();
    new TestDeepSubscribe({
      object: object1.observableObject,
      immediate: true
    }, b => b.path(o => o.observableObjectPrototype.observableObject.valueObject), b => b.path(o => o.valueObject), b => b.path(o => o.observableObject['@last'].valueObject), b => b.path(o => o.observableObjectPrototype.observableObject.valueObject['@last']), b => b.path(o => o.observableObject.observableObject.valueObject)).subscribe(o => [o.valueObject]).unsubscribe(o => [o.valueObject]).subscribe(o => [o.valueObject]).change(o => o.valueObject = new Number(1), [object1.valueObject], [new Number(1)]).unsubscribe([new Number(1)]);
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true
    }, b => b.path(o => o.observableObject['@last'].valueObject), b => b.path(o => o.observableObject.observableObject.valueObject), b => b.path(o => o.map2['#observableObject'].observableObject.map2['#object'].object.valueObject)).subscribe(o => [o.valueObject]).unsubscribe(o => [o.valueObject]).subscribe(o => [o.valueObject]).change(o => o.observableObject = new Number(1), [new String("value")], []).change(o => o.observableObject = o, [], [new String("value")]).unsubscribe([new String("value")]);
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.path(o => o.observableObjectPrototype.valueObjectWritable), b => b.path(o => o.observableObject.observableObjectPrototype.valueObjectWritable), b => b.path(o => o.observableObjectPrototype.observableObject.observableObjectPrototype.valueObjectWritable), b => b.path(o => o.observableObject.observableObject.observableObjectPrototype.valueObjectWritable)).subscribe([]).unsubscribe([]).subscribe([]).change(o => o.observableObjectPrototype.valueObjectWritable = new Number(1), [], [new Number(1)]).unsubscribe([new Number(1)]);
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true
    }, b => b.path(o => o.object), b => b.path(o => o.object.object), b => b.path(o => o.object.object.object)).subscribe(o => [o.object]).change(o => o.object = null, o => [], []);
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true
    }, b => b.nothing(), b => b.path(o => o.object).nothing(), b => b.path(o => o.object).nothing().path(o => o.object), b => b.nothing().nothing(), b => b.nothing().nothing().path(o => o.object.object), b => b.nothing().nothing().path(o => o.object).nothing().nothing().path(o => o.object).nothing().nothing(), b => b.path(o => o.object), b => b.path(o => o.object.object), b => b.path(o => o.object.object.object)).subscribe([check.object]).unsubscribe([check.object]);
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.nothing().nothing().path(o => o.observableObject.object), b => b.path(o => o.observableObject.object), b => b.path(o => o.object.observableObject.object)).subscribe([check.object]).change(o => o.observableObject.object = 1, o => [o.object], [1]).change(o => o.observableObject.object = new Number(1), [1], [new Number(1)]).change(o => o.observableObject.object = new Number(2), [new Number(1)], [new Number(2)]).unsubscribe([new Number(2)]);
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.path(o => o.object.observableObject.object.object), b => b.path(o => o.object.object.observableObject.object.object), b => b.repeat(3, 3, null, b => b.path(o => o.object).repeat(3, 3, null, b => b.path(o => o.observableObject))).path(o => o.object.object)).subscribe([check.object]).change(o => o.observableObject.object = 1, o => [o.object], []).change(o => o.observableObject.object = new Number(1), [], []).change(o => o.observableObject.object = new Number(2), [], []).unsubscribe([]);
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.repeat(0, 2, null, b => b.path(o => o.object)).path(o => o.observableObject.object)).subscribe([check.object]).change(o => o.observableObject.object = 1, o => [o.object], [1]).change(o => o.observableObject.object = new Number(1), [1], [new Number(1)]).change(o => o.observableObject.object = new Number(2), [new Number(1)], [new Number(2)]).unsubscribe([new Number(2)]); // new Tester(
    // 	{
    // 		object: createObject().object,
    // 		immediate: false,
    // 	},
    // 	b => b
    // 		.repeat(1, 3, null, b => b
    // 			.any(
    // 				b => b.propertyRegexp(/object|observableObject/),
    // 				b => b.path(o => o['list|set|map2|observableList|observableSet|observableMap']['#']),
    // 			),
    // 		),
    // )
    // 	.subscribe([])
  });
  it('chain of same objects', function () {
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true
    }, // b => b.path(o => o.observableObject),
    b => b.path(o => o.observableObject.observableObject), b => b.path(o => o.observableObject.observableObject.observableObject)).subscribe(o => [o.observableObject]).change(o => o.observableObject = new Number(1), o => [o.observableObject], o => []).unsubscribe([]);
    {
      const object = createObject();
      new TestDeepSubscribe({
        object: object.observableObject,
        immediate: true
      }, // b => b.path(o => o.object),
      b => b.path(o => o.object.observableObject.object), b => b.path(o => o.object.observableObject.object.observableObject.object)).subscribe([object]).change(o => o.object = new Number(1), [object], []).change(o => o.object = object, [], [object]).unsubscribe([object]);
    }
    const observableList = createObject().observableList;
    observableList.clear();
    observableList.add(observableList);
    new TestDeepSubscribe({
      object: observableList,
      immediate: true
    }, b => b.path(o => o['#']['#']), b => b.path(o => o['#']['#']['#'])).subscribe(o => [...o]).change(o => o.set(0, new Number(1)), o => [o.get(0)], o => []).unsubscribe([]);
    const observableSet = createObject().observableSet;
    observableSet.clear();
    observableSet.add(observableSet);
    new TestDeepSubscribe({
      object: observableSet,
      immediate: true
    }, b => b.path(o => o['#']['#']), b => b.path(o => o['#']['#']['#'])).subscribe(o => [...o]).change(o => {
      o.clear();
      o.add(new Number(1));
    }, o => [Array.from(o.values())[0]], o => []).unsubscribe([]);
    new TestDeepSubscribe({
      object: createObject().observableMap,
      immediate: true
    }, b => b.path(o => o['#observableMap']['#observableMap']), b => b.path(o => o['#observableMap']['#observableMap']['#observableMap'])).subscribe(o => [o.get('observableMap')]).change(o => o.set('observableMap', new Number(1)), o => [o.get('observableMap')], o => []).unsubscribe([]);
    new TestDeepSubscribe({
      object: createObject().observableMap,
      immediate: true
    }, b => b.path(o => o['#observableMap']['#object'].observableMap['#observableMap']['#object']), b => b.path(o => o['#observableMap']['#object'].observableMap['#observableMap']['#object'].observableMap['#observableMap']['#object'])).subscribe(o => [o.get('object')]).change(o => o.set('object', new Number(1)), o => [o.get('object')], o => []).unsubscribe([]);
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true
    }, b => b.path(o => o.object), b => b.path(o => o.observableObject.object)).subscribe(o => [o.object]).change(o => o.object = new Number(1), o => [o.object], o => [new Number(1)]).unsubscribe([new Number(1)]);
  });
  it('any', function () {
    new TestDeepSubscribe({
      object: createObject(),
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.p('value').any(o => o.nothing(), o => o.any(o => o.nothing(), o => o.any(o => o.nothing())))).subscribe(o => ['value'], null, o => ['value']).unsubscribe(o => ['value']);
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.p('value').p('prop')).change(o => {
      o.value = null;
    }, o => [], o => [], o => []).subscribe(o => [], null, o => []).change(o => {
      o.value = {
        prop: 'prop'
      };
    }, o => [], o => ['prop'], o => ['prop']).change(o => {
      o.value = 123;
    }, o => ['prop'], o => [], o => [void 0]).change(o => {
      o.value = null;
    }, o => [], o => [], o => []).unsubscribe(o => []);
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.p('observableList').collection().p('value').p('prop')).change(o => {
      o.value = null;
    }, o => [], o => [], o => []).subscribe(o => [], null, o => []).change(o => {
      o.value = {
        prop: 'prop'
      };
    }, o => [], o => ['prop'], o => ['prop']).change(o => {
      o.value = null;
    }, o => ['prop'], o => [], o => [void 0]).change(o => {
      o.observableObject.observableList.insert(0, {
        value: {
          prop: 'prop'
        }
      });
    }, o => [], o => ['prop'], o => ['prop']).change(o => {
      o.observableObject.observableList.set(0, 123);
    }, o => ['prop'], o => [], o => [void 0]).unsubscribe(o => []);
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.any(o => o.p('map2', 'set'))).subscribe(o => [o.map2, o.set], null, o => [o.map2]).change(o => {
      o.set = o.observableObject;
    }, o => [o.set], o => [o.observableObject], o => []).unsubscribe(o => [o.map2, o.observableObject]);
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.any(o => o.nothing(), o => o.p('map2', 'set'))).subscribe(o => [o, o.map2, o.set], null, o => [o]).change(o => {
      o.set = o.observableObject;
    }, o => [o.set], o => [], o => []).unsubscribe(o => [o.map2, o]);
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.path(o => o['object|observableObject'].value)).subscribe(['value', 'value']).change(o => {}, [], []).unsubscribe(['value', 'value']);
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.any(o => o.path(o => o['map2|set']), o => o.path(o => o['map2|set']) // o => o.path((o: any) => o['map2|set'].object.observableObject),
    )).subscribe(o => [o.map2, o.set], null, o => [o.map2]).change(o => {
      o.set = o.observableObject;
    }, o => [o.set], o => [o.observableObject], o => []).unsubscribe(o => [o.map2, o.set]);
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b // .path((o: any) => o['map2|set']),
    .any(o => o.nothing(), o => o.path(o => o['map2|set']))).subscribe(o => [o, o.map2, o.set], null, o => [o]).change(o => {
      o.set = o.observableObject;
    }, o => [o.set], o => [], o => []).unsubscribe(o => [o.map2, o]); // new Tester(
    // 	{
    // 		object: createObject().observableObject,
    // 		immediate: true,
    // 		doNotSubscribeNonObjectValues: true,
    // 	},
    // 	b => b
    // 		.path((o: any) => o['map2||set']),
    // )
    // 	.subscribe(o => [o, o.map2, o.set])
    // 	.change(o => { o.set = o.observableMap as any }, o => [o.set], o => [o.observableMap])
    // 	.unsubscribe(o => [o, o.map2, o.observableMap])
  });
  it('value properties not exist', async function () {
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.p('value'), b => b.v('lastOrWait').p('value'), b => b.p('value').v('wait'), b => b.p('value').v('wait').v('wait'), b => b.v('lastOrWait').p('value').v('wait'), b => b.v('lastOrWait').v('lastOrWait').p('value').v('wait').v('wait').v('wait')).subscribe(['value']).unsubscribe(['value']).subscribe(['value']).change(o => o.value = 1, ['value'], [1]).change(o => o.value = 2, [1], [2]).unsubscribe([2]);
  });
  it('value properties', async function () {
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true
    }, b => b.path(o => o.property)).subscribe(o => [o.observableObject]).change(o => o.property[VALUE_PROPERTY_DEFAULT] = new Number(1), o => [o.observableObject], [new Number(1)]).change(o => o.property = new Number(2), [new Number(1)], [new Number(2)]).change(o => o.property = o.object.property, [new Number(2)], [new Number(1)]).unsubscribe([new Number(1)]);
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true
    }, b => b.path(o => o.property['@value_observableObject'])).subscribe(o => [o.observableObject]).unsubscribe(o => [o.observableObject]).subscribe(o => [o.observableObject]).change(o => o.property = new Number(2), o => [o], [new Number(2)]).unsubscribe([new Number(2)]);
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true
    }, b => b.path(o => o.property['@value_observableObject'])).subscribe(o => [o.observableObject]).unsubscribe(o => [o.observableObject]).subscribe(o => [o.observableObject]).change(o => o.property.value_observableObject = new Number(1), o => [o.observableObject], [new Number(1)]) // .change(o => o.property = new Number(2) as any,
    // 	[new Number(1)], [new Number(2)])
    // .change(o => o.property = o.object.property,
    // 	[new Number(2)], [new Number(1)])
    .unsubscribe([new Number(1)]);
    {
      const object = createObject();
      new ObservableObjectBuilder(object.property).delete(VALUE_PROPERTY_DEFAULT);
      new TestDeepSubscribe({
        object,
        immediate: true,
        doNotSubscribeNonObjectValues: true
      }, b => b.path(o => o.property['@value_map2|value_set|value_list'])).subscribe(o => [o.property]).change(o => {
        new ObservableObjectBuilder(o.property).writable(VALUE_PROPERTY_DEFAULT, null, null);
      }, o => [o.property], o => [o.map2]).change(o => {
        o.property.value_map2 = 1;
      }, o => [o.map2], o => [1]).change(o => {
        new ObservableObjectBuilder(o.property).delete('value_map2');
      }, o => [1], o => [o.set]).change(o => {
        new ObservableObjectBuilder(o.property).delete('value_set');
      }, o => [o.set], o => [o.list]).change(o => {
        o.property.value_list = o.map2;
      }, o => [o.list], o => [o.map2]).change(o => {
        new ObservableObjectBuilder(o.property).delete('value_list');
      }, o => [o.map2], o => [null]).change(o => {
        o.property[VALUE_PROPERTY_DEFAULT] = void 0;
      }, o => [null], o => []).change(o => {
        o.property[VALUE_PROPERTY_DEFAULT] = o;
      }, o => [], o => [o]).change(o => {
        new ObservableObjectBuilder(o.property).writable('value_map2', null, 2);
      }, o => [o], o => [2]).change(o => {
        new ObservableObjectBuilder(o.property).delete('value_map2');
      }, o => [2], o => [o]).change(o => {
        new ObservableObjectBuilder(o.property).writable('value_list', null, o.list);
      }, o => [o], o => [o.list]).change(o => {
        new ObservableObjectBuilder(o.property).delete(VALUE_PROPERTY_DEFAULT);
      }, o => [o.list], o => [o.property]).unsubscribe(o => [o.property]);
    }
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.path(o => o.property['@value_map2|value_set|value_list'])).subscribe(o => [o.map2]).change(o => {
      o.property.value_map2 = 0;
    }, o => [o.map2], o => [0]).change(o => {
      new ObservableObjectBuilder(o.property).delete('value_map2');
    }, o => [0], o => [o.set]).change(o => {
      new ObservableObjectBuilder(o.property).delete('value_set');
    }, o => [o.set], o => [o.list]).change(o => {
      o.property.value_list = o.map2;
    }, o => [o.list], o => [o.map2]).change(o => {
      new ObservableObjectBuilder(o.property).delete('value_list');
    }, o => [o.map2], o => [o]).change(o => {
      new ObservableObjectBuilder(o.property).writable('value_map2', null, null);
    }, o => [o], o => [null]).change(o => {
      new ObservableObjectBuilder(o.property).delete('value_map2');
    }, o => [null], o => [o]).change(o => {
      new ObservableObjectBuilder(o.property).writable('value_list', null, o.list);
    }, o => [o], o => [o.list]).unsubscribe(o => [o.list]);
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.any(o => o.path(o => o.property['@value_observableObject']['map2|set']), o => o.path(o => o.property['@value_observableObject']['map2|set']), o => o.path(o => o.property['@value_observableObject']['map2|set'].object.observableObject)), b => b.any(o => o.path(o => o.property['map2|set']), o => o.path(o => o.property['map2|set']) // o => o.path((o: any) => o.property['map2|set'].object.observableObject),
    )).subscribe(o => [o.map2, o.set], null, o => [o.map2]).change(o => {
      o.set = o.observableObject;
    }, o => [o.set], o => [o.observableObject], o => []).unsubscribe(o => [o.map2, o.set]);
  }); // it('value properties null', async function() {
  // 	const object = createObject().observableObject
  // 	const property = object.property
  // 	object.property = null
  //
  // 	new TestDeepSubscribe(
  // 		{
  // 			object: object,
  // 			immediate: true,
  // 			doNotSubscribeNonObjectValues: true,
  // 		},
  // 		b => b.p('property'),
  // 	)
  // 		.subscribe(o => [null])
  // 		.change(o => o.property = property as any,
  // 			o => [null], o => [o.observableObject])
  // 		.change(o => o.property[VALUE_PROPERTY_DEFAULT] = new Number(1) as any,
  // 			o => [o.observableObject], [new Number(1)])
  // 		.change(o => o.property = null as any,
  // 			[new Number(1)], [null])
  // 		.change(o => o.property = o.object.property,
  // 			[null], [new Number(1)])
  // 		.unsubscribe([new Number(1)])
  // })

  it('promises', async function () {
    const object = createObject();
    object.observableObject.value = new Number(1);
    const tester = new TestDeepSubscribe({
      object: object.promiseSync,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.path(o => o.promiseAsync.value));
    await tester.subscribeAsync([new Number(1)]);
    await delay(20);
    await tester.changeAsync(o => object.observableObject.value = new Number(2), [new Number(1)], [new Number(2)]);
    await delay(20);
    await tester.unsubscribeAsync([new Number(2)]);
    await delay(100);
  });
  xit('promises throw', async function () {
    const object = createObject();
    object.observableObject.value = new Number(1);
    const tester = new TestDeepSubscribe({
      object: object.promiseSync,
      immediate: true,
      doNotSubscribeNonObjectValues: true,
      useIncorrectUnsubscribe: true
    }, b => b.path(o => o.promiseAsync.value));
    await tester.subscribeAsync([new Number(1)], [], []);
    await delay(20);
    await tester.changeAsync(o => object.observableObject.value = new Number(2), [], [new Number(2)], null, Error, /Value is not a function or null\/undefined/);
    await delay(20);
    await tester.unsubscribeAsync([]);
    await delay(100);
  });
  it('lists', function () {
    const value = new Number(1);
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true,
      ignoreSubscribeCount: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.repeat(1, 3, null, b => b.any(b => b.propertyRegexp(/object|observableObject/), b => b.path(o => o['list|set|map2|observableList|observableSet|observableMap']['#']))).path(o => o.valueUndefined)).subscribe([void 0]).change(o => o.observableObject.valueUndefined = value, [void 0], [value], [value]).change(o => o.observableList.add(value), [], []).change(o => o.observableSet.add(value), [], []).change(o => o.observableMap.set('value', value), [], []).unsubscribe([value]);
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true,
      ignoreSubscribeCount: true,
      doNotSubscribeNonObjectValues: true
    }, b => b.repeat(1, 3, null, b => b.any(b => b.propertyRegexp(/object|observableObject/), b => b.path(o => o['list|set|map2|observableList|observableSet|observableMap']['#']))).path(o => o['#valueUndefined'])).subscribe([], null).change(o => o.observableObject.target = value, [], []).change(o => o.observableList.add(value), [], []).change(o => o.observableSet.add(value), [], []).change(o => o.observableMap.set('value', value), [], [value]).unsubscribe([value]); // new Tester(
    // 	{
    // 		object: createObject().object,
    // 		immediate: true,
    // 		ignoreSubscribeCount: true,
    // 	},
    // 	b => b
    // 		.repeat(1, 3, null, b => b
    // 			.any(
    // 				b => b.propertyRegexp(/object|observableObject/),
    // 				b => b.path(o => o['list|set|map2|observableList|observableSet|observableMap']['#']),
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
  });
  it('throws', function () {
    new TestDeepSubscribe({
      object: createObject().observableObject,
      immediate: true
    }, b => b.path(o => o.object)).subscribe(o => [o.object]).change(o => o.object = 1, o => [o.object, 1], o => [1], [void 0], Error, /unsubscribe function for non Object value/);
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true
    }, b => b.path(o => o.value), b => b.path(o => o.object.object.object.value), b => b.path(o => o.observableObject.observableObject.observableObject.value), b => b.path(o => o.observableList['#'].observableList['#'].observableList['#'].value), b => {
      b = b.path(o => o.object.object.object.value);
      delete b.ruleFirst.description;
      delete b.ruleFirst.next.next.description;
      return b;
    }).subscribe(["value"], ["value"], [], Error, /unsubscribe function for non Object value/);
  });
  it('throws incorrect Unsubscribe', function () {
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true,
      useIncorrectUnsubscribe: true
    }, b => b.path(o => o.object)).subscribe(o => [o.object], [], [], Error, /Value is not a function or null\/undefined/);
    new TestDeepSubscribe({
      object: createObject().object,
      immediate: true,
      // doNotSubscribeNonObjectValues: true,
      useIncorrectUnsubscribe: true
    }, b => b.path(o => o.object.value)).subscribe(["value"], [], [], Error, /Value is not a function or null\/undefined/);
  });
});