import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";

/* tslint:disable:no-construct use-primitive-type no-shadowed-variable no-duplicate-string no-empty max-line-length */
import { delay } from '../../../../../../main/common/helpers/helpers';
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
  it('promises',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee() {
    var object, tester;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            object = createObject();
            object.observableObject.value = new Number(1);
            tester = new Tester({
              object: object.promiseSync,
              immediate: true,
              doNotSubscribeNonObjectValues: true
            }, function (b) {
              return b.path(function (o) {
                return o.promiseAsync.value;
              });
            });
            _context.next = 5;
            return tester.subscribeAsync([new Number(1)]);

          case 5:
            _context.next = 7;
            return delay(20);

          case 7:
            _context.next = 9;
            return tester.changeAsync(function (o) {
              return object.observableObject.value = new Number(2);
            }, [new Number(1)], [new Number(2)]);

          case 9:
            _context.next = 11;
            return delay(20);

          case 11:
            _context.next = 13;
            return tester.unsubscribe([new Number(2)]);

          case 13:
            _context.next = 15;
            return delay(100);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('promises throw',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2() {
    var object, tester;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            object = createObject();
            object.observableObject.value = new Number(1);
            tester = new Tester({
              object: object.promiseSync,
              immediate: true,
              doNotSubscribeNonObjectValues: true,
              useIncorrectUnsubscribe: true
            }, function (b) {
              return b.path(function (o) {
                return o.promiseAsync.value;
              });
            });
            _context2.next = 5;
            return tester.subscribeAsync([new Number(1)]);

          case 5:
            _context2.next = 7;
            return delay(20);

          case 7:
            _context2.next = 9;
            return tester.changeAsync(function (o) {
              return object.observableObject.value = new Number(2);
            }, [], [new Number(2)], Error, /should return null\/undefined or unsubscribe function/);

          case 9:
            _context2.next = 11;
            return delay(20);

          case 11:
            _context2.next = 13;
            return tester.unsubscribe([]);

          case 13:
            _context2.next = 15;
            return delay(100);

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
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
      return o.observableObject.target = value;
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
      return o.observableObject.target = value;
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
  it('throws incorrect Unsubscribe', function () {
    new Tester({
      object: createObject().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true,
      useIncorrectUnsubscribe: true
    }, function (b) {
      return b.path(function (o) {
        return o.object;
      });
    }).subscribe(function (o) {
      return [o.object];
    }, [], Error, /should return null\/undefined or unsubscribe function/);
    new Tester({
      object: createObject().object,
      immediate: true,
      // doNotSubscribeNonObjectValues: true,
      useIncorrectUnsubscribe: true
    }, function (b) {
      return b.path(function (o) {
        return o.object.value;
      });
    }).subscribe([null], [], Error, /should return null\/undefined or unsubscribe function/);
  });
});