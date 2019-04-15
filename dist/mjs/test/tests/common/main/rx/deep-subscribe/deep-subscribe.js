/* tslint:disable:no-construct use-primitive-type no-shadowed-variable no-duplicate-string */
import { createObject, Tester } from "./helpers/Tester";
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
      o.object = null;
      return [[], []];
    });
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
      immediate: true
    }, function (b) {
      return b.path(function (o) {
        return o.observableObject.object;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.object.observableObject.object;
      });
    }).subscribe([check.object]).change(function (o) {
      o.observableObject.object = 1;
      return [[o.object], []];
    }).change(function (o) {
      o.observableObject.object = new Number(1);
      return [[], [new Number(1)]];
    }).change(function (o) {
      o.observableObject.object = new Number(2);
      return [[new Number(1)], [new Number(2)]];
    }).unsubscribe([new Number(2)]);
    new Tester({
      object: createObject().object,
      immediate: true
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
      o.observableObject.object = 1;
      return [[o.object], []];
    }).change(function (o) {
      o.observableObject.object = new Number(1);
      return [[], []];
    }).change(function (o) {
      o.observableObject.object = new Number(2);
      return [[], []];
    }).unsubscribe([]);
    new Tester({
      object: createObject().object,
      immediate: true
    }, function (b) {
      return b.repeat(0, 2, function (b) {
        return b.path(function (o) {
          return o.object;
        });
      }).path(function (o) {
        return o.observableObject.object;
      });
    }).subscribe([check.object]).change(function (o) {
      o.observableObject.object = 1;
      return [[o.object], []];
    }).change(function (o) {
      o.observableObject.object = new Number(1);
      return [[], [new Number(1)]];
    }).change(function (o) {
      o.observableObject.object = new Number(2);
      return [[new Number(1)], [new Number(2)]];
    }).unsubscribe([new Number(2)]);
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
  it('any', function () {
    new Tester({
      object: createObject().object,
      immediate: true
    }, function (b) {
      return b.path(function (o) {
        return o['object|observableObject'].value;
      });
    }).subscribe([]).change(function (o) {
      return [[], []];
    });
  });
  it('lists', function () {
    var value = new Number(1);
    new Tester({
      object: createObject().object,
      immediate: true,
      ignoreSubscribeCount: true
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
      o.observableObject.value = value;
      return [[], [value]];
    }).change(function (o) {
      o.observableList.add(value);
      return [[], []];
    }).change(function (o) {
      o.observableSet.add(value);
      return [[], []];
    }).change(function (o) {
      o.observableMap.set('value', value);
      return [[], []];
    }).unsubscribe([value]);
    new Tester({
      object: createObject().object,
      immediate: true,
      ignoreSubscribeCount: true
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
      o.observableObject.value = value;
      return [[], []];
    }).change(function (o) {
      o.observableList.add(value);
      return [[], []];
    }).change(function (o) {
      o.observableSet.add(value);
      return [[], []];
    }).change(function (o) {
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