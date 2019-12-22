"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _repeat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/repeat"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _helpers = require("../../../../../../main/common/helpers/helpers");

var _valueProperty = require("../../../../../../main/common/helpers/value-property");

var _rules = require("../../../../../../main/common/rx/deep-subscribe/contracts/rules");

var _ObservableClass = require("../../../../../../main/common/rx/object/ObservableClass");

var _ObservableObjectBuilder = require("../../../../../../main/common/rx/object/ObservableObjectBuilder");

var _Mocha = require("../../../../../../main/common/test/Mocha");

var _TestDeepSubscribe = require("./helpers/src/TestDeepSubscribe");

/* tslint:disable:no-construct use-primitive-type no-shadowed-variable no-duplicate-string no-empty max-line-length */
(0, _Mocha.describe)('common > main > rx > deep-subscribe > deep-subscribe', function () {
  var check = (0, _TestDeepSubscribe.createObject)();
  (0, _Mocha.it)('RuleIf simple', function () {
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.propertyAny().if([function (o) {
        return (0, _isArray.default)(o);
      }, function (b) {
        return b.p('1');
      }], function (b) {
        return b.never();
      });
    }, function (b) {
      var _context;

      return (0, _repeat.default)(_context = b.propertyAny()).call(_context, 1, 1, function (o) {
        return (0, _isArray.default)(o) ? _rules.RuleRepeatAction.Next : _rules.RuleRepeatAction.Fork;
      }, function (b) {
        return b.p('1');
      });
    }).subscribe(function (o) {
      return ['value2'];
    }).unsubscribe(function (o) {
      return ['value2'];
    }).subscribe(function (o) {
      return ['value2'];
    }).unsubscribe(function (o) {
      return ['value2'];
    });
  });
  (0, _Mocha.it)('repeat with condition', function () {
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      var _context2;

      return (0, _repeat.default)(_context2 = b.propertyAny().propertyRegexp(/^[a-z]/)).call(_context2, 1, 1, function (o) {
        return (0, _isArray.default)(o) ? _rules.RuleRepeatAction.Next : _rules.RuleRepeatAction.Fork;
      }, function (b) {
        return b.p('1');
      });
    }, function (b) {
      var _context3, _context4;

      return (0, _repeat.default)(_context3 = (0, _repeat.default)(_context4 = b.propertyAny()).call(_context4, 1, 1, null, function (b) {
        return b.propertyRegexp(/^[a-z]/);
      })).call(_context3, 1, 1, function (o) {
        return (0, _isArray.default)(o) ? _rules.RuleRepeatAction.Next : _rules.RuleRepeatAction.Fork;
      }, function (b) {
        return b.p('1');
      });
    }, // b => b
    // 	.propertyRegexp(/^[a-z]/)
    // 	.repeat(0, 1, o => o && o.constructor === ObservableClass
    // 		? RuleRepeatAction.Next
    // 		: RuleRepeatAction.Fork, b => b.propertyRegexp(/^[a-z]/))
    // 	.repeat(1, 1,
    // 		o => Array.isArray(o) ? RuleRepeatAction.Next : RuleRepeatAction.Fork,
    // 		b => b.p('1')),
    function (b) {
      var _context5, _context6;

      return (0, _repeat.default)(_context5 = (0, _repeat.default)(_context6 = b.propertyAny()).call(_context6, 0, 0, null, function (b) {
        return b.propertyRegexp(/^[a-z]/);
      })).call(_context5, 1, 1, function (o) {
        return (0, _isArray.default)(o) ? _rules.RuleRepeatAction.Next : _rules.RuleRepeatAction.Fork;
      }, function (b) {
        return b.p('1');
      });
    }, function (b) {
      var _context7, _context8;

      return (0, _repeat.default)(_context7 = (0, _repeat.default)(_context8 = b.propertyAny()).call(_context8, 2, 3, function (o) {
        return o && o.constructor === _ObservableClass.ObservableClass ? _rules.RuleRepeatAction.Next : _rules.RuleRepeatAction.Fork;
      }, function (b) {
        return b.propertyRegexp(/^[a-z]/);
      })).call(_context7, 1, 1, function (o) {
        return (0, _isArray.default)(o) ? _rules.RuleRepeatAction.Next : _rules.RuleRepeatAction.Fork;
      }, function (b) {
        return b.p('1');
      });
    }).subscribe(function (o) {
      return ['value2'];
    }).unsubscribe(function (o) {
      return ['value2'];
    }).subscribe(function (o) {
      return ['value2'];
    }).unsubscribe(function (o) {
      return ['value2'];
    });
  });
  (0, _Mocha.it)('unsubscribe leaf non object', function () {
    var object1 = (0, _TestDeepSubscribe.createObject)();
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: object1.observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.p('value');
    }).subscribe(function (o) {
      return [o.value];
    }).unsubscribe(function (o) {
      return [o.value];
    }).subscribe(function (o) {
      return [o.value];
    }).unsubscribe(function (o) {
      return [o.value];
    });
  });
  (0, _Mocha.it)('unsubscribe leaf', function () {
    var object1 = (0, _TestDeepSubscribe.createObject)();
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: object1.observableObject,
      immediate: true
    }, function (b) {
      return b.any(function (b2) {
        return b2.p('map2').mapKey('valueObject');
      }, function (b2) {
        return b2.p('observableMap').mapKey('valueObject');
      });
    }, function (b) {
      return b.p('map2').mapKey('valueObject');
    }).subscribe(function (o) {
      return [o.valueObject];
    }).unsubscribe(function (o) {
      return [o.valueObject];
    }).subscribe(function (o) {
      return [o.valueObject];
    }).change(function (o) {
      return o.observableMap.delete('valueObject');
    }, [], []).unsubscribe([object1.valueObject]);
  });
  (0, _Mocha.it)('rule nothing', function () {
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.p('value').nothing();
    }).subscribe(['value']).unsubscribe(['value']);
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
      immediate: true
    }, function (b) {
      return b.nothing();
    }).subscribe([check.object]).unsubscribe([check.object]);
  });
  (0, _Mocha.it)('rule never', function () {
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true,
      shouldNeverSubscribe: true
    }, function (b) {
      return b.never();
    }, function (b) {
      return b.never().p('value');
    }, function (b) {
      return b.never().nothing().p('value');
    }, function (b) {
      return b.never().p('valueObject');
    }, function (b) {
      return b.never().nothing().p('valueObject');
    }).subscribe([]).unsubscribe([]);
  });
  (0, _Mocha.it)('unsubscribe repeat 2', function () {
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
      immediate: true
    }, function (b) {
      return b.path(function (o) {
        return o.object.object.observableObject.object;
      });
    }).subscribe([check.object]).unsubscribe([check.object]);
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
      immediate: true
    }, function (b) {
      return (0, _repeat.default)(b).call(b, 2, 2, null, function (b) {
        return b.path(function (o) {
          return o.object;
        });
      }).path(function (o) {
        return o.observableObject.object;
      });
    }).subscribe([check.object]).unsubscribe([check.object]);
  });
  (0, _Mocha.it)('unsubscribe repeat 0..5', function () {
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
      immediate: true
    }, function (b) {
      return (0, _repeat.default)(b).call(b, 0, 5, null, function (b) {
        return b.path(function (o) {
          return o.object;
        });
      }).path(function (o) {
        return o.observableObject.object;
      });
    }).subscribe([check.object]).unsubscribe([check.object]);
  });
  (0, _Mocha.it)('unsubscribe middle', function () {
    var object1 = (0, _TestDeepSubscribe.createObject)();
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: object1.observableObject,
      immediate: true
    }, function (b) {
      return b.any(function (b2) {
        return b2.p('object');
      }, function (b2) {
        return b2.p('map2').mapKey('object');
      }).p('valueObject');
    }).subscribe(function (o) {
      return [o.valueObject];
    }).unsubscribe(function (o) {
      return [o.valueObject];
    }).subscribe(function (o) {
      return [o.valueObject];
    }).change(function (o) {
      return o.object = void 0;
    }, [], []).unsubscribe([object1.valueObject]);
  });
  (0, _Mocha.it)('object', function () {
    var object1 = (0, _TestDeepSubscribe.createObject)();
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: object1.observableObject,
      immediate: true
    }, function (b) {
      return b.path(function (o) {
        return o.observableObjectPrototype.observableObject.valueObject;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.valueObject;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.observableObject['@last'].valueObject;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.observableObjectPrototype.observableObject.valueObject['@last'];
      });
    }, function (b) {
      return b.path(function (o) {
        return o.observableObject.observableObject.valueObject;
      });
    }).subscribe(function (o) {
      return [o.valueObject];
    }).unsubscribe(function (o) {
      return [o.valueObject];
    }).subscribe(function (o) {
      return [o.valueObject];
    }).change(function (o) {
      return o.valueObject = new Number(1);
    }, [object1.valueObject], [new Number(1)]).unsubscribe([new Number(1)]);
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
      immediate: true
    }, function (b) {
      return b.path(function (o) {
        return o.observableObject['@last'].valueObject;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.observableObject.observableObject.valueObject;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.map2['#observableObject'].observableObject.map2['#object'].object.valueObject;
      });
    }).subscribe(function (o) {
      return [o.valueObject];
    }).unsubscribe(function (o) {
      return [o.valueObject];
    }).subscribe(function (o) {
      return [o.valueObject];
    }).change(function (o) {
      return o.observableObject = new Number(1);
    }, [new String("value")], []).change(function (o) {
      return o.observableObject = o;
    }, [], [new String("value")]).unsubscribe([new String("value")]);
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.path(function (o) {
        return o.observableObjectPrototype.valueObjectWritable;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.observableObject.observableObjectPrototype.valueObjectWritable;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.observableObjectPrototype.observableObject.observableObjectPrototype.valueObjectWritable;
      });
    }, function (b) {
      return b.path(function (o) {
        return o.observableObject.observableObject.observableObjectPrototype.valueObjectWritable;
      });
    }).subscribe([]).unsubscribe([]).subscribe([]).change(function (o) {
      return o.observableObjectPrototype.valueObjectWritable = new Number(1);
    }, [], [new Number(1)]).unsubscribe([new Number(1)]);
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
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
    }).subscribe(function (o) {
      return [o.object];
    }).change(function (o) {
      return o.object = null;
    }, function (o) {
      return [];
    }, []);
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
      immediate: true
    }, function (b) {
      return b.nothing();
    }, function (b) {
      return b.path(function (o) {
        return o.object;
      }).nothing();
    }, function (b) {
      return b.path(function (o) {
        return o.object;
      }).nothing().path(function (o) {
        return o.object;
      });
    }, function (b) {
      return b.nothing().nothing();
    }, function (b) {
      return b.nothing().nothing().path(function (o) {
        return o.object.object;
      });
    }, function (b) {
      return b.nothing().nothing().path(function (o) {
        return o.object;
      }).nothing().nothing().path(function (o) {
        return o.object;
      }).nothing().nothing();
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
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.nothing().nothing().path(function (o) {
        return o.observableObject.object;
      });
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
    }, [1]).change(function (o) {
      return o.observableObject.object = new Number(1);
    }, [1], [new Number(1)]).change(function (o) {
      return o.observableObject.object = new Number(2);
    }, [new Number(1)], [new Number(2)]).unsubscribe([new Number(2)]);
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
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
      return (0, _repeat.default)(b).call(b, 3, 3, null, function (b) {
        var _context9;

        return (0, _repeat.default)(_context9 = b.path(function (o) {
          return o.object;
        })).call(_context9, 3, 3, null, function (b) {
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
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return (0, _repeat.default)(b).call(b, 0, 2, null, function (b) {
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
    }, [1]).change(function (o) {
      return o.observableObject.object = new Number(1);
    }, [1], [new Number(1)]).change(function (o) {
      return o.observableObject.object = new Number(2);
    }, [new Number(1)], [new Number(2)]).unsubscribe([new Number(2)]); // new Tester(
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
  (0, _Mocha.it)('chain of same objects', function () {
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
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
    {
      var object = (0, _TestDeepSubscribe.createObject)();
      new _TestDeepSubscribe.TestDeepSubscribe({
        object: object.observableObject,
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
      }).subscribe([object]).change(function (o) {
        return o.object = new Number(1);
      }, [object], []).change(function (o) {
        return o.object = object;
      }, [], [object]).unsubscribe([object]);
    }
    var observableList = (0, _TestDeepSubscribe.createObject)().observableList;
    observableList.clear();
    observableList.add(observableList);
    new _TestDeepSubscribe.TestDeepSubscribe({
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
      var _context10;

      return (0, _concat.default)(_context10 = []).call(_context10, o);
    }).change(function (o) {
      return o.set(0, new Number(1));
    }, function (o) {
      return [o.get(0)];
    }, function (o) {
      return [];
    }).unsubscribe([]);
    var observableSet = (0, _TestDeepSubscribe.createObject)().observableSet;
    observableSet.clear();
    observableSet.add(observableSet);
    new _TestDeepSubscribe.TestDeepSubscribe({
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
      var _context11;

      return (0, _concat.default)(_context11 = []).call(_context11, o);
    }).change(function (o) {
      o.clear();
      o.add(new Number(1));
    }, function (o) {
      return [(0, _from.default)((0, _values.default)(o).call(o))[0]];
    }, function (o) {
      return [];
    }).unsubscribe([]);
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().observableMap,
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
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().observableMap,
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
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
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
  (0, _Mocha.it)('any', function () {
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)(),
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.p('value').any(function (o) {
        return o.nothing();
      }, function (o) {
        return o.any(function (o) {
          return o.nothing();
        }, function (o) {
          return o.any(function (o) {
            return o.nothing();
          });
        });
      });
    }).subscribe(function (o) {
      return ['value'];
    }, null, function (o) {
      return ['value'];
    }).unsubscribe(function (o) {
      return ['value'];
    });
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.p('value').p('prop');
    }).change(function (o) {
      o.value = null;
    }, function (o) {
      return [];
    }, function (o) {
      return [];
    }, function (o) {
      return [];
    }).subscribe(function (o) {
      return [];
    }, null, function (o) {
      return [];
    }).change(function (o) {
      o.value = {
        prop: 'prop'
      };
    }, function (o) {
      return [];
    }, function (o) {
      return ['prop'];
    }, function (o) {
      return ['prop'];
    }).change(function (o) {
      o.value = 123;
    }, function (o) {
      return ['prop'];
    }, function (o) {
      return [];
    }, function (o) {
      return [void 0];
    }).change(function (o) {
      o.value = null;
    }, function (o) {
      return [];
    }, function (o) {
      return [];
    }, function (o) {
      return [];
    }).unsubscribe(function (o) {
      return [];
    });
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.p('observableList').collection().p('value').p('prop');
    }).change(function (o) {
      o.value = null;
    }, function (o) {
      return [];
    }, function (o) {
      return [];
    }, function (o) {
      return [];
    }).subscribe(function (o) {
      return [];
    }, null, function (o) {
      return [];
    }).change(function (o) {
      o.value = {
        prop: 'prop'
      };
    }, function (o) {
      return [];
    }, function (o) {
      return ['prop'];
    }, function (o) {
      return ['prop'];
    }).change(function (o) {
      o.value = null;
    }, function (o) {
      return ['prop'];
    }, function (o) {
      return [];
    }, function (o) {
      return [void 0];
    }).change(function (o) {
      o.observableObject.observableList.insert(0, {
        value: {
          prop: 'prop'
        }
      });
    }, function (o) {
      return [];
    }, function (o) {
      return ['prop'];
    }, function (o) {
      return ['prop'];
    }).change(function (o) {
      o.observableObject.observableList.set(0, 123);
    }, function (o) {
      return ['prop'];
    }, function (o) {
      return [];
    }, function (o) {
      return [void 0];
    }).unsubscribe(function (o) {
      return [];
    });
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.any(function (o) {
        return o.p('map2', 'set');
      });
    }).subscribe(function (o) {
      return [o.map2, o.set];
    }, null, function (o) {
      return [o.map2];
    }).change(function (o) {
      o.set = o.observableObject;
    }, function (o) {
      return [o.set];
    }, function (o) {
      return [o.observableObject];
    }, function (o) {
      return [];
    }).unsubscribe(function (o) {
      return [o.map2, o.observableObject];
    });
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.any(function (o) {
        return o.nothing();
      }, function (o) {
        return o.p('map2', 'set');
      });
    }).subscribe(function (o) {
      return [o, o.map2, o.set];
    }, null, function (o) {
      return [o];
    }).change(function (o) {
      o.set = o.observableObject;
    }, function (o) {
      return [o.set];
    }, function (o) {
      return [];
    }, function (o) {
      return [];
    }).unsubscribe(function (o) {
      return [o.map2, o];
    });
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.path(function (o) {
        return o['object|observableObject'].value;
      });
    }).subscribe(['value', 'value']).change(function (o) {}, [], []).unsubscribe(['value', 'value']);
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.any(function (o) {
        return o.path(function (o) {
          return o['map2|set'];
        });
      }, function (o) {
        return o.path(function (o) {
          return o['map2|set'];
        });
      } // o => o.path((o: any) => o['map2|set'].object.observableObject),
      );
    }).subscribe(function (o) {
      return [o.map2, o.set];
    }, null, function (o) {
      return [o.map2];
    }).change(function (o) {
      o.set = o.observableObject;
    }, function (o) {
      return [o.set];
    }, function (o) {
      return [o.observableObject];
    }, function (o) {
      return [];
    }).unsubscribe(function (o) {
      return [o.map2, o.set];
    });
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b // .path((o: any) => o['map2|set']),
      .any(function (o) {
        return o.nothing();
      }, function (o) {
        return o.path(function (o) {
          return o['map2|set'];
        });
      });
    }).subscribe(function (o) {
      return [o, o.map2, o.set];
    }, null, function (o) {
      return [o];
    }).change(function (o) {
      o.set = o.observableObject;
    }, function (o) {
      return [o.set];
    }, function (o) {
      return [];
    }, function (o) {
      return [];
    }).unsubscribe(function (o) {
      return [o.map2, o];
    }); // new Tester(
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
  (0, _Mocha.it)('value properties not exist',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    return _regenerator.default.wrap(function _callee$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            new _TestDeepSubscribe.TestDeepSubscribe({
              object: (0, _TestDeepSubscribe.createObject)().observableObject,
              immediate: true,
              doNotSubscribeNonObjectValues: true
            }, function (b) {
              return b.p('value');
            }, function (b) {
              return b.v('lastOrWait').p('value');
            }, function (b) {
              return b.p('value').v('wait');
            }, function (b) {
              return b.p('value').v('wait').v('wait');
            }, function (b) {
              return b.v('lastOrWait').p('value').v('wait');
            }, function (b) {
              return b.v('lastOrWait').v('lastOrWait').p('value').v('wait').v('wait').v('wait');
            }).subscribe(['value']).unsubscribe(['value']).subscribe(['value']).change(function (o) {
              return o.value = 1;
            }, ['value'], [1]).change(function (o) {
              return o.value = 2;
            }, [1], [2]).unsubscribe([2]);

          case 1:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee);
  })));
  (0, _Mocha.it)('value properties',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    var object;
    return _regenerator.default.wrap(function _callee2$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            new _TestDeepSubscribe.TestDeepSubscribe({
              object: (0, _TestDeepSubscribe.createObject)().observableObject,
              immediate: true
            }, function (b) {
              return b.path(function (o) {
                return o.property;
              });
            }).subscribe(function (o) {
              return [o.observableObject];
            }).change(function (o) {
              return o.property[_valueProperty.VALUE_PROPERTY_DEFAULT] = new Number(1);
            }, function (o) {
              return [o.observableObject];
            }, [new Number(1)]).change(function (o) {
              return o.property = new Number(2);
            }, [new Number(1)], [new Number(2)]).change(function (o) {
              return o.property = o.object.property;
            }, [new Number(2)], [new Number(1)]).unsubscribe([new Number(1)]);
            new _TestDeepSubscribe.TestDeepSubscribe({
              object: (0, _TestDeepSubscribe.createObject)().observableObject,
              immediate: true
            }, function (b) {
              return b.path(function (o) {
                return o.property['@value_observableObject'];
              });
            }).subscribe(function (o) {
              return [o.observableObject];
            }).unsubscribe(function (o) {
              return [o.observableObject];
            }).subscribe(function (o) {
              return [o.observableObject];
            }).change(function (o) {
              return o.property = new Number(2);
            }, function (o) {
              return [o];
            }, [new Number(2)]).unsubscribe([new Number(2)]);
            new _TestDeepSubscribe.TestDeepSubscribe({
              object: (0, _TestDeepSubscribe.createObject)().observableObject,
              immediate: true
            }, function (b) {
              return b.path(function (o) {
                return o.property['@value_observableObject'];
              });
            }).subscribe(function (o) {
              return [o.observableObject];
            }).unsubscribe(function (o) {
              return [o.observableObject];
            }).subscribe(function (o) {
              return [o.observableObject];
            }).change(function (o) {
              return o.property.value_observableObject = new Number(1);
            }, function (o) {
              return [o.observableObject];
            }, [new Number(1)]) // .change(o => o.property = new Number(2) as any,
            // 	[new Number(1)], [new Number(2)])
            // .change(o => o.property = o.object.property,
            // 	[new Number(2)], [new Number(1)])
            .unsubscribe([new Number(1)]);
            object = (0, _TestDeepSubscribe.createObject)();
            new _ObservableObjectBuilder.ObservableObjectBuilder(object.property).delete(_valueProperty.VALUE_PROPERTY_DEFAULT);
            new _TestDeepSubscribe.TestDeepSubscribe({
              object: object,
              immediate: true,
              doNotSubscribeNonObjectValues: true
            }, function (b) {
              return b.path(function (o) {
                return o.property['@value_map2|value_set|value_list'];
              });
            }).subscribe(function (o) {
              return [o.property];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).writable(_valueProperty.VALUE_PROPERTY_DEFAULT, null, null);
            }, function (o) {
              return [o.property];
            }, function (o) {
              return [o.map2];
            }).change(function (o) {
              o.property.value_map2 = 1;
            }, function (o) {
              return [o.map2];
            }, function (o) {
              return [1];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).delete('value_map2');
            }, function (o) {
              return [1];
            }, function (o) {
              return [o.set];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).delete('value_set');
            }, function (o) {
              return [o.set];
            }, function (o) {
              return [o.list];
            }).change(function (o) {
              o.property.value_list = o.map2;
            }, function (o) {
              return [o.list];
            }, function (o) {
              return [o.map2];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).delete('value_list');
            }, function (o) {
              return [o.map2];
            }, function (o) {
              return [null];
            }).change(function (o) {
              o.property[_valueProperty.VALUE_PROPERTY_DEFAULT] = void 0;
            }, function (o) {
              return [null];
            }, function (o) {
              return [];
            }).change(function (o) {
              o.property[_valueProperty.VALUE_PROPERTY_DEFAULT] = o;
            }, function (o) {
              return [];
            }, function (o) {
              return [o];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).writable('value_map2', null, 2);
            }, function (o) {
              return [o];
            }, function (o) {
              return [2];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).delete('value_map2');
            }, function (o) {
              return [2];
            }, function (o) {
              return [o];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).writable('value_list', null, o.list);
            }, function (o) {
              return [o];
            }, function (o) {
              return [o.list];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).delete(_valueProperty.VALUE_PROPERTY_DEFAULT);
            }, function (o) {
              return [o.list];
            }, function (o) {
              return [o.property];
            }).unsubscribe(function (o) {
              return [o.property];
            });
            new _TestDeepSubscribe.TestDeepSubscribe({
              object: (0, _TestDeepSubscribe.createObject)().observableObject,
              immediate: true,
              doNotSubscribeNonObjectValues: true
            }, function (b) {
              return b.path(function (o) {
                return o.property['@value_map2|value_set|value_list'];
              });
            }).subscribe(function (o) {
              return [o.map2];
            }).change(function (o) {
              o.property.value_map2 = 0;
            }, function (o) {
              return [o.map2];
            }, function (o) {
              return [0];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).delete('value_map2');
            }, function (o) {
              return [0];
            }, function (o) {
              return [o.set];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).delete('value_set');
            }, function (o) {
              return [o.set];
            }, function (o) {
              return [o.list];
            }).change(function (o) {
              o.property.value_list = o.map2;
            }, function (o) {
              return [o.list];
            }, function (o) {
              return [o.map2];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).delete('value_list');
            }, function (o) {
              return [o.map2];
            }, function (o) {
              return [o];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).writable('value_map2', null, null);
            }, function (o) {
              return [o];
            }, function (o) {
              return [null];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).delete('value_map2');
            }, function (o) {
              return [null];
            }, function (o) {
              return [o];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).writable('value_list', null, o.list);
            }, function (o) {
              return [o];
            }, function (o) {
              return [o.list];
            }).unsubscribe(function (o) {
              return [o.list];
            });
            new _TestDeepSubscribe.TestDeepSubscribe({
              object: (0, _TestDeepSubscribe.createObject)().observableObject,
              immediate: true,
              doNotSubscribeNonObjectValues: true
            }, function (b) {
              return b.any(function (o) {
                return o.path(function (o) {
                  return o.property['@value_observableObject']['map2|set'];
                });
              }, function (o) {
                return o.path(function (o) {
                  return o.property['@value_observableObject']['map2|set'];
                });
              }, function (o) {
                return o.path(function (o) {
                  return o.property['@value_observableObject']['map2|set'].object.observableObject;
                });
              });
            }, function (b) {
              return b.any(function (o) {
                return o.path(function (o) {
                  return o.property['map2|set'];
                });
              }, function (o) {
                return o.path(function (o) {
                  return o.property['map2|set'];
                });
              } // o => o.path((o: any) => o.property['map2|set'].object.observableObject),
              );
            }).subscribe(function (o) {
              return [o.map2, o.set];
            }, null, function (o) {
              return [o.map2];
            }).change(function (o) {
              o.set = o.observableObject;
            }, function (o) {
              return [o.set];
            }, function (o) {
              return [o.observableObject];
            }, function (o) {
              return [];
            }).unsubscribe(function (o) {
              return [o.map2, o.set];
            });

          case 8:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee2);
  }))); // it('value properties null', async function() {
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

  (0, _Mocha.it)('promises',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3() {
    var object, tester;
    return _regenerator.default.wrap(function _callee3$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            object = (0, _TestDeepSubscribe.createObject)();
            object.observableObject.value = new Number(1);
            tester = new _TestDeepSubscribe.TestDeepSubscribe({
              object: object.promiseSync,
              immediate: true,
              doNotSubscribeNonObjectValues: true
            }, function (b) {
              return b.path(function (o) {
                return o.promiseAsync.value;
              });
            });
            _context14.next = 5;
            return tester.subscribeAsync([new Number(1)]);

          case 5:
            _context14.next = 7;
            return (0, _helpers.delay)(20);

          case 7:
            _context14.next = 9;
            return tester.changeAsync(function (o) {
              return object.observableObject.value = new Number(2);
            }, [new Number(1)], [new Number(2)]);

          case 9:
            _context14.next = 11;
            return (0, _helpers.delay)(20);

          case 11:
            _context14.next = 13;
            return tester.unsubscribeAsync([new Number(2)]);

          case 13:
            _context14.next = 15;
            return (0, _helpers.delay)(100);

          case 15:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee3);
  })));
  (0, _Mocha.xit)('promises throw',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4() {
    var object, tester;
    return _regenerator.default.wrap(function _callee4$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            object = (0, _TestDeepSubscribe.createObject)();
            object.observableObject.value = new Number(1);
            tester = new _TestDeepSubscribe.TestDeepSubscribe({
              object: object.promiseSync,
              immediate: true,
              doNotSubscribeNonObjectValues: true,
              useIncorrectUnsubscribe: true
            }, function (b) {
              return b.path(function (o) {
                return o.promiseAsync.value;
              });
            });
            _context15.next = 5;
            return tester.subscribeAsync([new Number(1)], [], []);

          case 5:
            _context15.next = 7;
            return (0, _helpers.delay)(20);

          case 7:
            _context15.next = 9;
            return tester.changeAsync(function (o) {
              return object.observableObject.value = new Number(2);
            }, [], [new Number(2)], null, Error, /Value is not a function or null\/undefined/);

          case 9:
            _context15.next = 11;
            return (0, _helpers.delay)(20);

          case 11:
            _context15.next = 13;
            return tester.unsubscribeAsync([]);

          case 13:
            _context15.next = 15;
            return (0, _helpers.delay)(100);

          case 15:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee4);
  })));
  (0, _Mocha.it)('lists', function () {
    var value = new Number(1);
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
      immediate: true,
      ignoreSubscribeCount: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return (0, _repeat.default)(b).call(b, 1, 3, null, function (b) {
        return b.any(function (b) {
          return b.propertyRegexp(/object|observableObject/);
        }, function (b) {
          return b.path(function (o) {
            return o['list|set|map2|observableList|observableSet|observableMap']['#'];
          });
        });
      }).path(function (o) {
        return o.valueUndefined;
      });
    }).subscribe([void 0]).change(function (o) {
      return o.observableObject.valueUndefined = value;
    }, [void 0], [value], [value]).change(function (o) {
      return o.observableList.add(value);
    }, [], []).change(function (o) {
      return o.observableSet.add(value);
    }, [], []).change(function (o) {
      return o.observableMap.set('value', value);
    }, [], []).unsubscribe([value]);
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
      immediate: true,
      ignoreSubscribeCount: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return (0, _repeat.default)(b).call(b, 1, 3, null, function (b) {
        return b.any(function (b) {
          return b.propertyRegexp(/object|observableObject/);
        }, function (b) {
          return b.path(function (o) {
            return o['list|set|map2|observableList|observableSet|observableMap']['#'];
          });
        });
      }).path(function (o) {
        return o['#valueUndefined'];
      });
    }).subscribe([], null).change(function (o) {
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
  (0, _Mocha.it)('throws', function () {
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
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
    }, [void 0], Error, /unsubscribe function for non Object value/);
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
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
      delete b.ruleFirst.description;
      delete b.ruleFirst.next.next.description;
      return b;
    }).subscribe(["value"], ["value"], [], Error, /unsubscribe function for non Object value/);
  });
  (0, _Mocha.it)('throws incorrect Unsubscribe', function () {
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true,
      useIncorrectUnsubscribe: true
    }, function (b) {
      return b.path(function (o) {
        return o.object;
      });
    }).subscribe(function (o) {
      return [o.object];
    }, [], [], Error, /Value is not a function or null\/undefined/);
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: (0, _TestDeepSubscribe.createObject)().object,
      immediate: true,
      // doNotSubscribeNonObjectValues: true,
      useIncorrectUnsubscribe: true
    }, function (b) {
      return b.path(function (o) {
        return o.object.value;
      });
    }).subscribe(["value"], [], [], Error, /Value is not a function or null\/undefined/);
  });
});