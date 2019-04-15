"use strict";

var _Tester = require("./helpers/Tester");

/* tslint:disable:no-construct use-primitive-type no-shadowed-variable no-duplicate-string */
describe('common > main > rx > deep-subscribe > deep-subscribe', function () {
  const check = (0, _Tester.createObject)();
  it('object', function () {
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
      immediate: false
    }, b => b.path(o => o.object), b => b.path(o => o.object.object), b => b.path(o => o.object.object.object)).subscribe(null).change(o => {
      o.object = null;
      return [[], []];
    });
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
      immediate: true
    }, b => b.path(o => o.object), b => b.path(o => o.object.object), b => b.path(o => o.object.object.object)).subscribe([check.object]).unsubscribe([check.object]);
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
      immediate: true
    }, b => b.path(o => o.observableObject.object), b => b.path(o => o.object.observableObject.object)).subscribe([check.object]).change(o => {
      o.observableObject.object = 1;
      return [[o.object], []];
    }).change(o => {
      o.observableObject.object = new Number(1);
      return [[], [new Number(1)]];
    }).change(o => {
      o.observableObject.object = new Number(2);
      return [[new Number(1)], [new Number(2)]];
    }).unsubscribe([new Number(2)]);
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
      immediate: true
    }, b => b.path(o => o.object.observableObject.object.object), b => b.path(o => o.object.object.observableObject.object.object), b => b.repeat(3, 3, b => b.path(o => o.object).repeat(3, 3, b => b.path(o => o.observableObject))).path(o => o.object.object)).subscribe([check.object]).change(o => {
      o.observableObject.object = 1;
      return [[o.object], []];
    }).change(o => {
      o.observableObject.object = new Number(1);
      return [[], []];
    }).change(o => {
      o.observableObject.object = new Number(2);
      return [[], []];
    }).unsubscribe([]);
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
      immediate: true
    }, b => b.repeat(0, 2, b => b.path(o => o.object)).path(o => o.observableObject.object)).subscribe([check.object]).change(o => {
      o.observableObject.object = 1;
      return [[o.object], []];
    }).change(o => {
      o.observableObject.object = new Number(1);
      return [[], [new Number(1)]];
    }).change(o => {
      o.observableObject.object = new Number(2);
      return [[new Number(1)], [new Number(2)]];
    }).unsubscribe([new Number(2)]);
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
      immediate: false
    }, b => b.repeat(1, 3, b => b.any(b => b.propertyRegexp(/object|observableObject/), b => b.path(o => o['list|set|map|observableList|observableSet|observableMap']['#'])))).subscribe([]);
  });
  it('any', function () {
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
      immediate: true
    }, b => b.path(o => o['object|observableObject'].value)).subscribe([]).change(o => {
      return [[], []];
    });
  });
  it('lists', function () {
    const value = new Number(1);
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
      immediate: true,
      ignoreSubscribeCount: true
    }, b => b.repeat(1, 3, b => b.any(b => b.propertyRegexp(/object|observableObject/), b => b.path(o => o['list|set|map|observableList|observableSet|observableMap']['#']))).path(o => o.value)).subscribe([]).change(o => {
      o.observableObject.value = value;
      return [[], [value]];
    }).change(o => {
      o.observableList.add(value);
      return [[], []];
    }).change(o => {
      o.observableSet.add(value);
      return [[], []];
    }).change(o => {
      o.observableMap.set('value', value);
      return [[], []];
    }).unsubscribe([value]);
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
      immediate: true,
      ignoreSubscribeCount: true
    }, b => b.repeat(1, 3, b => b.any(b => b.propertyRegexp(/object|observableObject/), b => b.path(o => o['list|set|map|observableList|observableSet|observableMap']['#']))).path(o => o['#value'])).subscribe([]).change(o => {
      o.observableObject.value = value;
      return [[], []];
    }).change(o => {
      o.observableList.add(value);
      return [[], []];
    }).change(o => {
      o.observableSet.add(value);
      return [[], []];
    }).change(o => {
      o.observableMap.set('value', value);
      return [[], [value]];
    }).unsubscribe([value]); // new Tester(
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
  });
});