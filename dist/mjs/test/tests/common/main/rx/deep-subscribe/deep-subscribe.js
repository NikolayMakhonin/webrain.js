import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";

/* tslint:disable:no-construct use-primitive-type no-shadowed-variable no-duplicate-string no-empty max-line-length */
import { createObject, Tester } from './helpers/Tester';
describe('common > main > rx > deep-subscribe > deep-subscribe', function () {
  var check = createObject();
  it('object', function () {
    new Tester({
      object: createObject().object,
      immediate: false
    }, function (b) {
      return b.path(function (o) {
        return o.object;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.object.object;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.object.object.object;
      });
    }).subscribe(null).change(function (o) {
      return o.object = null;
    }, [], []);
    new Tester({
      object: createObject().observableObject,
      immediate: false
    }, function (b) {
      return b.path(function (o) {
        return o.object;
      });
    }).subscribe([]).unsubscribe([]).subscribe([]).change(function (o) {
      return o.object = new Number(1);
    }, [], [new Number(1)]);
    new Tester({
      object: createObject().object,
      immediate: true
    }, function (b) {
      return b.path(function (o) {
        return o.object;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.object.object;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.object.object.object;
      });
    }).subscribe([check.object]).unsubscribe([check.object]);
    new Tester({
      object: createObject().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.path(function (o) {
        return o.observableObject.object;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.object.observableObject.object;
      });
    }).subscribe([check.object]).change(function (o) {
      return o.observableObject.object = 1;
    }, function (o) {
      return [o.object];
    }, []).change(function (o) {
      return o.observableObject.object = new Number(1);
    }, [], [new Number(1)]).change(function (o) {
      return o.observableObject.object = new Number(2);
    }, [new Number(1)], [new Number(2)]).unsubscribe([new Number(2)]);
    new Tester({
      object: createObject().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.path(function (o) {
        return o.object.observableObject.object.object;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.object.object.observableObject.object.object;
      });
    }, function (b) {
      return b.repeat(3, 3, function (b) {
        return b.path(function (o) {
          return o.object;
        }).repeat(3, 3, function (b) {
          return b.path(function (o) {
            return o.observableObject;
          });
        });
      }).path(function (o) {
        return o.object.object;
      });
    }).subscribe([check.object]).change(function (o) {
      return o.observableObject.object = 1;
    }, function (o) {
      return [o.object];
    }, []).change(function (o) {
      return o.observableObject.object = new Number(1);
    }, [], []).change(function (o) {
      return o.observableObject.object = new Number(2);
    }, [], []).unsubscribe([]);
    new Tester({
      object: createObject().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.repeat(0, 2, function (b) {
        return b.path(function (o) {
          return o.object;
        });
      }).path(function (o) {
        return o.observableObject.object;
      });
    }).subscribe([check.object]).change(function (o) {
      return o.observableObject.object = 1;
    }, function (o) {
      return [o.object];
    }, []).change(function (o) {
      return o.observableObject.object = new Number(1);
    }, [], [new Number(1)]).change(function (o) {
      return o.observableObject.object = new Number(2);
    }, [new Number(1)], [new Number(2)]).unsubscribe([new Number(2)]);
    new Tester({
      object: createObject().object,
      immediate: false
    }, function (b) {
      return b.repeat(1, 3, function (b) {
        return b.any(function (b) {
          return b.propertyRegexp(/object|observableObject/);
        }, function (b) {
          return b.path(function (o) {
            return o['list|set|map|observableList|observableSet|observableMap']['#'];
          });
        });
      });
    }).subscribe([]);
  });
  it('chain of same objects', function () {
    new Tester({
      object: createObject().observableObject,
      immediate: true
    }, // b => b.path(o => o.observableObject),
    function (b) {
      return b.path(function (o) {
        return o.observableObject.observableObject;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.observableObject.observableObject.observableObject;
      });
    }).subscribe(function (o) {
      return [o.observableObject];
    }).change(function (o) {
      return o.observableObject = new Number(1);
    }, function (o) {
      return [o.observableObject];
    }, function (o) {
      return [];
    }).unsubscribe([]);
    new Tester({
      object: createObject().observableObject,
      immediate: true
    }, // b => b.path(o => o.object),
    function (b) {
      return b.path(function (o) {
        return o.object.observableObject.object;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.object.observableObject.object.observableObject.object;
      });
    }).subscribe(function (o) {
      return [o.object];
    }).change(function (o) {
      return o.object = new Number(1);
    }, function (o) {
      return [o.object];
    }, function (o) {
      return [];
    }).unsubscribe([]);
    var observableList = createObject().observableList;
    observableList.clear();
    observableList.add(observableList);
    new Tester({
      object: observableList,
      immediate: true
    }, function (b) {
      return b.path(function (o) {
        return o['#']['#'];
      });
    }, function (b) {
      return b.path(function (o) {
        return o['#']['#']['#'];
      });
    }).subscribe(function (o) {
      return _toConsumableArray(o);
    }).change(function (o) {
      return o.set(0, new Number(1));
    }, function (o) {
      return [o.get(0)];
    }, function (o) {
      return [];
    }).unsubscribe([]);
    var observableSet = createObject().observableSet;
    observableSet.clear();
    observableSet.add(observableSet);
    new Tester({
      object: observableSet,
      immediate: true
    }, function (b) {
      return b.path(function (o) {
        return o['#']['#'];
      });
    }, function (b) {
      return b.path(function (o) {
        return o['#']['#']['#'];
      });
    }).subscribe(function (o) {
      return _toConsumableArray(o);
    }).change(function (o) {
      o.clear();
      o.add(new Number(1));
    }, function (o) {
      return [Array.from(o.values())[0]];
    }, function (o) {
      return [];
    }).unsubscribe([]);
    new Tester({
      object: createObject().observableMap,
      immediate: true
    }, function (b) {
      return b.path(function (o) {
        return o['#observableMap']['#observableMap'];
      });
    }, function (b) {
      return b.path(function (o) {
        return o['#observableMap']['#observableMap']['#observableMap'];
      });
    }).subscribe(function (o) {
      return [o.get('observableMap')];
    }).change(function (o) {
      return o.set('observableMap', new Number(1));
    }, function (o) {
      return [o.get('observableMap')];
    }, function (o) {
      return [];
    }).unsubscribe([]);
    new Tester({
      object: createObject().observableMap,
      immediate: true
    }, function (b) {
      return b.path(function (o) {
        return o['#observableMap']['#object'].observableMap['#observableMap']['#object'];
      });
    }, function (b) {
      return b.path(function (o) {
        return o['#observableMap']['#object'].observableMap['#observableMap']['#object'].observableMap['#observableMap']['#object'];
      });
    }).subscribe(function (o) {
      return [o.get('object')];
    }).change(function (o) {
      return o.set('object', new Number(1));
    }, function (o) {
      return [o.get('object')];
    }, function (o) {
      return [];
    }).unsubscribe([]);
    new Tester({
      object: createObject().observableObject,
      immediate: true
    }, function (b) {
      return b.path(function (o) {
        return o.object;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.observableObject.object;
      });
    }).subscribe(function (o) {
      return [o.object];
    }).change(function (o) {
      return o.object = new Number(1);
    }, function (o) {
      return [o.object];
    }, function (o) {
      return [new Number(1)];
    }).unsubscribe([new Number(1)]);
  });
  it('any', function () {
    new Tester({
      object: createObject().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.path(function (o) {
        return o['object|observableObject'].value;
      });
    }).subscribe([]).change(function (o) {}, [], []);
  });
  it('lists', function () {
    var value = new Number(1);
    new Tester({
      object: createObject().object,
      immediate: true,
      ignoreSubscribeCount: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.repeat(1, 3, function (b) {
        return b.any(function (b) {
          return b.propertyRegexp(/object|observableObject/);
        }, function (b) {
          return b.path(function (o) {
            return o['list|set|map|observableList|observableSet|observableMap']['#'];
          });
        });
      }).path(function (o) {
        return o.value;
      });
    }).subscribe([]).change(function (o) {
      return o.observableObject.value = value;
    }, [], [value]).change(function (o) {
      return o.observableList.add(value);
    }, [], []).change(function (o) {
      return o.observableSet.add(value);
    }, [], []).change(function (o) {
      return o.observableMap.set('value', value);
    }, [], []).unsubscribe([value]);
    new Tester({
      object: createObject().object,
      immediate: true,
      ignoreSubscribeCount: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.repeat(1, 3, function (b) {
        return b.any(function (b) {
          return b.propertyRegexp(/object|observableObject/);
        }, function (b) {
          return b.path(function (o) {
            return o['list|set|map|observableList|observableSet|observableMap']['#'];
          });
        });
      }).path(function (o) {
        return o['#value'];
      });
    }).subscribe([]).change(function (o) {
      return o.observableObject.value = value;
    }, [], []).change(function (o) {
      return o.observableList.add(value);
    }, [], []).change(function (o) {
      return o.observableSet.add(value);
    }, [], []).change(function (o) {
      return o.observableMap.set('value', value);
    }, [], [value]).unsubscribe([value]); // new Tester(
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
  it('throws', function () {
    new Tester({
      object: createObject().observableObject,
      immediate: true
    }, function (b) {
      return b.path(function (o) {
        return o.object;
      });
    }).subscribe(function (o) {
      return [o.object];
    }).change(function (o) {
      return o.object = 1;
    }, function (o) {
      return [o.object, 1];
    }, function (o) {
      return [1];
    }, Error, /unsubscribe function for non Object value/);
    new Tester({
      object: createObject().object,
      immediate: true
    }, function (b) {
      return b.path(function (o) {
        return o.value;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.object.object.object.value;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.observableObject.observableObject.observableObject.value;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.observableList['#'].observableList['#'].observableList['#'].value;
      });
    }, function (b) {
      b = b.path(function (o) {
        return o.object.object.object.value;
      });
      delete b.rule.description;
      delete b.rule.next.next.description;
      return b;
    }).subscribe([null], [null], Error, /unsubscribe function for non Object value/);
  });
});