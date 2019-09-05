"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _repeat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/repeat"));

var _helpers = require("../../../../../../main/common/helpers/helpers");

var _valueProperty = require("../../../../../../main/common/helpers/value-property");

var _ObservableObjectBuilder = require("../../../../../../main/common/rx/object/ObservableObjectBuilder");

var _Tester = require("./helpers/Tester");

/* tslint:disable:no-construct use-primitive-type no-shadowed-variable no-duplicate-string no-empty max-line-length */
describe('common > main > rx > deep-subscribe > deep-subscribe', function () {
  var check = (0, _Tester.createObject)();
  it('object', function () {
    var object1 = (0, _Tester.createObject)();
    new _Tester.Tester({
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
    new _Tester.Tester({
      object: (0, _Tester.createObject)().observableObject,
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
    new _Tester.Tester({
      object: (0, _Tester.createObject)().observableObject,
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
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
      immediate: true
    }, function (b) {
      return b.path(function (o) {
        return o.object;
      });
    }).subscribe(function (o) {
      return [o.object];
    }).change(function (o) {
      return o.object = null;
    }, function (o) {
      return [];
    }, []);
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
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
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
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
    }, []).change(function (o) {
      return o.observableObject.object = new Number(1);
    }, [], [new Number(1)]).change(function (o) {
      return o.observableObject.object = new Number(2);
    }, [new Number(1)], [new Number(2)]).unsubscribe([new Number(2)]);
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
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
      return (0, _repeat.default)(b).call(b, 3, 3, function (b) {
        var _context;

        return (0, _repeat.default)(_context = b.path(function (o) {
          return o.object;
        })).call(_context, 3, 3, function (b) {
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
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return (0, _repeat.default)(b).call(b, 0, 2, function (b) {
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
    }, [new Number(1)], [new Number(2)]).unsubscribe([new Number(2)]); // new Tester(
    // 	{
    // 		object: createObject().object,
    // 		immediate: false,
    // 	},
    // 	b => b
    // 		.repeat(1, 3, b => b
    // 			.any(
    // 				b => b.propertyRegexp(/object|observableObject/),
    // 				b => b.path(o => o['list|set|map2|observableList|observableSet|observableMap']['#']),
    // 			),
    // 		),
    // )
    // 	.subscribe([])
  });
  it('chain of same objects', function () {
    new _Tester.Tester({
      object: (0, _Tester.createObject)().observableObject,
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
      var object = (0, _Tester.createObject)();
      new _Tester.Tester({
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
    var observableList = (0, _Tester.createObject)().observableList;
    observableList.clear();
    observableList.add(observableList);
    new _Tester.Tester({
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
      return (0, _toConsumableArray2.default)(o);
    }).change(function (o) {
      return o.set(0, new Number(1));
    }, function (o) {
      return [o.get(0)];
    }, function (o) {
      return [];
    }).unsubscribe([]);
    var observableSet = (0, _Tester.createObject)().observableSet;
    observableSet.clear();
    observableSet.add(observableSet);
    new _Tester.Tester({
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
      return (0, _toConsumableArray2.default)(o);
    }).change(function (o) {
      o.clear();
      o.add(new Number(1));
    }, function (o) {
      return [(0, _from.default)((0, _values.default)(o).call(o))[0]];
    }, function (o) {
      return [];
    }).unsubscribe([]);
    new _Tester.Tester({
      object: (0, _Tester.createObject)().observableMap,
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
    new _Tester.Tester({
      object: (0, _Tester.createObject)().observableMap,
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
    new _Tester.Tester({
      object: (0, _Tester.createObject)().observableObject,
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
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.path(function (o) {
        return o['object|observableObject'].value;
      });
    }).subscribe([]).change(function (o) {}, [], []);
    new _Tester.Tester({
      object: (0, _Tester.createObject)().observableObject,
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
      }, function (o) {
        return o.path(function (o) {
          return o['map2|set'].object.observableObject;
        });
      });
    }).subscribe(function (o) {
      return [o.map2, o.set];
    }).change(function (o) {
      o.set = o.observableObject;
    }, function (o) {
      return [o.set];
    }, function (o) {
      return [o.observableObject];
    }).unsubscribe(function (o) {
      return [o.map2, o.set];
    });
    new _Tester.Tester({
      object: (0, _Tester.createObject)().observableObject,
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
    }).change(function (o) {
      o.set = o.observableObject;
    }, function (o) {
      return [o.set];
    }, function (o) {
      return [];
    }).unsubscribe(function (o) {
      return [o, o.map2];
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
  it('value properties',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var object;
    return _regenerator.default.wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            new _Tester.Tester({
              object: (0, _Tester.createObject)().observableObject,
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
            new _Tester.Tester({
              object: (0, _Tester.createObject)().observableObject,
              immediate: true
            }, function (b) {
              return b.path(function (o) {
                return o.property['@value_observableObject'];
              });
            }).subscribe(function (o) {
              return [o.observableObject];
            }).change(function (o) {
              return o.property.value_observableObject = new Number(1);
            }, function (o) {
              return [o.observableObject];
            }, [new Number(1)]).change(function (o) {
              return o.property = new Number(2);
            }, [new Number(1)], [new Number(2)]).change(function (o) {
              return o.property = o.object.property;
            }, [new Number(2)], [new Number(1)]).unsubscribe([new Number(1)]);
            object = (0, _Tester.createObject)();
            new _ObservableObjectBuilder.ObservableObjectBuilder(object.property).delete(_valueProperty.VALUE_PROPERTY_DEFAULT);
            new _Tester.Tester({
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
              o.property.value_map2 = null;
            }, function (o) {
              return [o.map2];
            }, function (o) {
              return [];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).delete('value_map2');
            }, function (o) {
              return [];
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
              return [];
            }).change(function (o) {
              o.property[_valueProperty.VALUE_PROPERTY_DEFAULT] = void 0;
            }, function (o) {
              return [];
            }, function (o) {
              return [];
            }).change(function (o) {
              o.property[_valueProperty.VALUE_PROPERTY_DEFAULT] = o;
            }, function (o) {
              return [];
            }, function (o) {
              return [o];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).writable('value_map2', null, null);
            }, function (o) {
              return [o];
            }, function (o) {
              return [];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).delete('value_map2');
            }, function (o) {
              return [];
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
            new _Tester.Tester({
              object: (0, _Tester.createObject)().observableObject,
              immediate: true,
              doNotSubscribeNonObjectValues: true
            }, function (b) {
              return b.path(function (o) {
                return o.property['@value_map2|value_set|value_list'];
              });
            }).subscribe(function (o) {
              return [o.map2];
            }).change(function (o) {
              o.property.value_map2 = null;
            }, function (o) {
              return [o.map2];
            }, function (o) {
              return [];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).delete('value_map2');
            }, function (o) {
              return [];
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
              return [];
            }).change(function (o) {
              new _ObservableObjectBuilder.ObservableObjectBuilder(o.property).delete('value_map2');
            }, function (o) {
              return [];
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
            new _Tester.Tester({
              object: (0, _Tester.createObject)().observableObject,
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
              }, function (o) {
                return o.path(function (o) {
                  return o.property['map2|set'].object.observableObject;
                });
              });
            }).subscribe(function (o) {
              return [o.map2, o.set];
            }).change(function (o) {
              o.set = o.observableObject;
            }, function (o) {
              return [o.set];
            }, function (o) {
              return [o.observableObject];
            }).unsubscribe(function (o) {
              return [o.map2, o.set];
            });

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee);
  })));
  it('promises',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    var object, tester;
    return _regenerator.default.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            object = (0, _Tester.createObject)();
            object.observableObject.value = new Number(1);
            tester = new _Tester.Tester({
              object: object.promiseSync,
              immediate: true,
              doNotSubscribeNonObjectValues: true
            }, function (b) {
              return b.path(function (o) {
                return o.promiseAsync.value;
              });
            });
            _context3.next = 5;
            return tester.subscribeAsync([new Number(1)]);

          case 5:
            _context3.next = 7;
            return (0, _helpers.delay)(20);

          case 7:
            _context3.next = 9;
            return tester.changeAsync(function (o) {
              return object.observableObject.value = new Number(2);
            }, [new Number(1)], [new Number(2)]);

          case 9:
            _context3.next = 11;
            return (0, _helpers.delay)(20);

          case 11:
            _context3.next = 13;
            return tester.unsubscribe([new Number(2)]);

          case 13:
            _context3.next = 15;
            return (0, _helpers.delay)(100);

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee2);
  })));
  xit('promises throw',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3() {
    var object, tester;
    return _regenerator.default.wrap(function _callee3$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            object = (0, _Tester.createObject)();
            object.observableObject.value = new Number(1);
            tester = new _Tester.Tester({
              object: object.promiseSync,
              immediate: true,
              doNotSubscribeNonObjectValues: true,
              useIncorrectUnsubscribe: true
            }, function (b) {
              return b.path(function (o) {
                return o.promiseAsync.value;
              });
            });
            _context4.next = 5;
            return tester.subscribeAsync([new Number(1)]);

          case 5:
            _context4.next = 7;
            return (0, _helpers.delay)(20);

          case 7:
            _context4.next = 9;
            return tester.changeAsync(function (o) {
              return object.observableObject.value = new Number(2);
            }, [], [new Number(2)], Error, /Value is not a function or null\/undefined/);

          case 9:
            _context4.next = 11;
            return (0, _helpers.delay)(20);

          case 11:
            _context4.next = 13;
            return tester.unsubscribe([]);

          case 13:
            _context4.next = 15;
            return (0, _helpers.delay)(100);

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee3);
  })));
  it('lists', function () {
    var value = new Number(1);
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
      immediate: true,
      ignoreSubscribeCount: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return (0, _repeat.default)(b).call(b, 1, 3, function (b) {
        return b.any(function (b) {
          return b.propertyRegexp(/object|observableObject/);
        }, function (b) {
          return b.path(function (o) {
            return o['list|set|map2|observableList|observableSet|observableMap']['#'];
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
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
      immediate: true,
      ignoreSubscribeCount: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return (0, _repeat.default)(b).call(b, 1, 3, function (b) {
        return b.any(function (b) {
          return b.propertyRegexp(/object|observableObject/);
        }, function (b) {
          return b.path(function (o) {
            return o['list|set|map2|observableList|observableSet|observableMap']['#'];
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
    new _Tester.Tester({
      object: (0, _Tester.createObject)().observableObject,
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
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
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
      delete b.result.description;
      delete b.result.next.next.description;
      return b;
    }).subscribe(["value"], ["value"], Error, /unsubscribe function for non Object value/);
  });
  it('throws incorrect Unsubscribe', function () {
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
      immediate: true,
      doNotSubscribeNonObjectValues: true,
      useIncorrectUnsubscribe: true
    }, function (b) {
      return b.path(function (o) {
        return o.object;
      });
    }).subscribe(function (o) {
      return [o.object];
    }, [], Error, /Value is not a function or null\/undefined/);
    new _Tester.Tester({
      object: (0, _Tester.createObject)().object,
      immediate: true,
      // doNotSubscribeNonObjectValues: true,
      useIncorrectUnsubscribe: true
    }, function (b) {
      return b.path(function (o) {
        return o.object.value;
      });
    }).subscribe(["value"], [], Error, /Value is not a function or null\/undefined/);
  });
});