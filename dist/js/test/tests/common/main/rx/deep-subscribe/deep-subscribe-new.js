"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _repeat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/repeat"));

var _IMapChanged = require("../../../../../../main/common/lists/contracts/IMapChanged");

var _TestDeepSubscribe = require("./helpers/src/TestDeepSubscribe");

/* tslint:disable:no-construct use-primitive-type no-shadowed-variable no-duplicate-string no-empty max-line-length */
describe('common > main > rx > deep-subscribe > deep-subscribe new', function () {
  this.timeout(300000);
  var check = (0, _TestDeepSubscribe.createObject)();
  after(function () {
    console.log('Total ObjectMerger tests >= ' + _TestDeepSubscribe.TestDeepSubscribe.totalTests);
  });
  it('ruleFactoriesVariants self sync', function () {
    new _TestDeepSubscribe.TestDeepSubscribeVariants({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.variants().variants(function (b) {
        return b.any(function (b) {
          return b.p('promiseSync');
        }, function (b) {
          return b.any(function (b) {
            return b.never();
          }, function (b) {
            return b.if([function (o) {
              return false;
            }, function (b) {
              return b.nothing();
            }], [null, function (b) {
              return b.never();
            }]);
          });
        }, function (b) {
          return b.neverVariants();
        });
      }, function (b) {
        return b.if([function (o) {
          return false;
        }, function (b) {
          return b.never();
        }], [null, function (b) {
          return b.nothing();
        }]);
      }, function (b) {
        return b.p(['observableObject', 'object']);
      }, function (b) {
        return b.propertyName(['observableObject', 'object']);
      }, function (b) {
        return b.propertyNames(['observableObject', 'object']);
      }, function (b) {
        return (0, _repeat.default)(b).call(b, 1, 1, null, [function (b) {
          return b.p('observableObject');
        }, function (b) {
          return b.p('object');
        }]);
      }, function (b) {
        return b.valuePropertyDefault();
      }, function (b) {
        return b.nothing();
      }, function (b) {
        return b.p('observableList').collection().p('observableObject');
      }, function (b) {
        return b.p('observableMap').mapAny().p('observableObject');
      }, function (b) {
        return b.p('observableMap').mapKey(['observableObject', 'object']);
      }, function (b) {
        return b.p('observableMap').mapKeys(['observableObject', 'object']);
      }, function (b) {
        return b.p('observableMap').mapPredicate([function (key) {
          return key === 'observableObject';
        }, function (key) {
          return key === 'object';
        }], ['desc1', 'desc2']);
      }, function (b) {
        return b.p('observableMap').mapRegexp([/^observableObject$/, /^object$/]);
      }, function (b) {
        return b.propertyAny().p('observableObject');
      }, function (b) {
        return b.propertyPredicate([function (key) {
          return key === 'observableObject';
        }, function (key) {
          return key === 'object';
        }], ['desc1', 'desc2']);
      }, function (b) {
        return b.propertyRegexp([/^observableObject$/, /^object$/]);
      }, function (b) {
        return b.p('property').v(['@value_observableObject', '@value_object']);
      }, function (b) {
        return b.p('property').valuePropertyName(['@value_observableObject', '@value_object']);
      }, function (b) {
        return b.p('property').valuePropertyNames(['@value_observableObject', '@value_object']);
      }).p('promiseSync').p('value').nothingVariants();
    }).subscribe(function (o) {
      return ['value'];
    }, [void 0], ['value']).change(function (o) {
      return o.value = 'value2';
    }, ['value'], ['value2'], ['value2']).unsubscribe(function (o) {
      return ['value2'];
    }, [void 0]);
  });
  it('ruleFactoriesVariants self async',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var tester;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tester = new _TestDeepSubscribe.TestDeepSubscribeVariants({
              object: (0, _TestDeepSubscribe.createObject)().observableObject,
              immediate: true,
              doNotSubscribeNonObjectValues: true
            }, function (b) {
              return b.variants().variants(function (b) {
                return b.any(function (b) {
                  return b.p('promiseSync');
                }, function (b) {
                  return b.any(function (b) {
                    return b.never();
                  }, function (b) {
                    return b.if([function (o) {
                      return false;
                    }, function (b) {
                      return b.nothing();
                    }], [null, function (b) {
                      return b.never();
                    }]);
                  });
                }, function (b) {
                  return b.never();
                });
              }, function (b) {
                return b.if([function (o) {
                  return false;
                }, function (b) {
                  return b.never();
                }], [null, function (b) {
                  return b.nothing();
                }]);
              }, function (b) {
                return b.p(['observableObject', 'object']);
              }, function (b) {
                return b.propertyName(['observableObject', 'object']);
              }, function (b) {
                return b.propertyNames(['observableObject', 'object']);
              }, function (b) {
                return (0, _repeat.default)(b).call(b, 1, 1, null, [function (b) {
                  return b.p('observableObject');
                }, function (b) {
                  return b.p('object');
                }]);
              }, function (b) {
                return b.valuePropertyDefault();
              }, function (b) {
                return b.nothing();
              }, function (b) {
                return b.p('observableList').collection().p('observableObject');
              }, function (b) {
                return b.p('observableMap').mapAny().p('observableObject');
              }, function (b) {
                return b.p('observableMap').mapKey(['observableObject', 'object']);
              }, function (b) {
                return b.p('observableMap').mapKeys(['observableObject', 'object']);
              }, function (b) {
                return b.p('observableMap').mapPredicate([function (key) {
                  return key === 'observableObject';
                }, function (key) {
                  return key === 'object';
                }], ['desc1', 'desc2']);
              }, function (b) {
                return b.p('observableMap').mapRegexp([/^observableObject$/, /^object$/]);
              }, function (b) {
                return b.propertyAny().p('observableObject');
              }, function (b) {
                return b.propertyPredicate([function (key) {
                  return key === 'observableObject';
                }, function (key) {
                  return key === 'object';
                }], ['desc1', 'desc2']);
              }, function (b) {
                return b.propertyRegexp([/^observableObject$/, /^object$/]);
              }, function (b) {
                return b.p('property').v(['@value_observableObject', '@value_object']);
              }, function (b) {
                return b.p('property').valuePropertyName(['@value_observableObject', '@value_object']);
              }, function (b) {
                return b.p('property').valuePropertyNames(['@value_observableObject', '@value_object']);
              }).p('promiseAsync').p('value').nothingVariants();
            });
            _context.next = 3;
            return tester.subscribeAsync(function (o) {
              return ['value'];
            }, [void 0], ['value']);

          case 3:
            _context.next = 5;
            return tester.change(function (o) {
              return o.value = 'value2';
            }, ['value'], ['value2'], ['value2']);

          case 5:
            _context.next = 7;
            return tester.unsubscribeAsync(function (o) {
              return ['value2'];
            }, [void 0]);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  xit('last nothing sync', function () {
    new _TestDeepSubscribe.TestDeepSubscribeVariants({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.p('value').any(function (b) {
        return b.nothing();
      });
    } // .repeat(0, 1, null, b => b.nothing())
    // .repeat(0, 3, (o, i) => i === 3 ? RuleRepeatAction.Fork : RuleRepeatAction.Next, b => b.nothing())
    // .nothingVariants()
    ).subscribe(function (o) {
      return ['value'];
    }, [void 0], ['value']).change(function (o) {
      return o.value = 'value2';
    }, ['value'], ['value2'], ['value2']).unsubscribe(function (o) {
      return ['value2'];
    }, [void 0]);
  });
  it('property value sync', function () {
    new _TestDeepSubscribe.TestDeepSubscribeVariants({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.v('notExistProperty').p('property').v('value_value');
    } // .any(b => b.nothing())
    // .repeat(0, 1, null, b => b.nothing())
    // .repeat(0, 3, (o, i) => i === 3 ? RuleRepeatAction.Fork : RuleRepeatAction.Next, b => b.nothing())
    // .nothingVariants()
    ).subscribe(function (o) {
      return ['value'];
    }, [void 0], ['value']).change(function (o) {
      return o.property.value_value = 'value2';
    }, ['value'], ['value2'], ['value2']).unsubscribe(function (o) {
      return ['value2'];
    }, [void 0]);
  });
  it('chain of same objects: propertyChanged with oldValue === newValue', function () {
    new _TestDeepSubscribe.TestDeepSubscribeVariants({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
      immediate: true
    }, function (b) {
      return b.p('observableObject').p('observableObject').p('valueObject');
    }).subscribe(function (o) {
      return [new String('value')];
    }).change(function (o) {
      return o.propertyChanged.onPropertyChanged('observableObject');
    }, function (o) {
      return [new String('value')];
    }, function (o) {
      return [new String('value')];
    }).unsubscribe(function (o) {
      return [new String('value')];
    });
    new _TestDeepSubscribe.TestDeepSubscribeVariants({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
      immediate: true
    }, function (b) {
      return b.p('property').v('value_property').v('value_property').v('value_valueObject');
    }).subscribe(function (o) {
      return [new String('value')];
    }).change(function (o) {
      return o.property.propertyChanged.onPropertyChanged('value_property');
    }, function (o) {
      return [new String('value')];
    }, function (o) {
      return [new String('value')];
    }).unsubscribe(function (o) {
      return [new String('value')];
    });
    new _TestDeepSubscribe.TestDeepSubscribeVariants({
      object: (0, _TestDeepSubscribe.createObject)().observableObject,
      immediate: true
    }, function (b) {
      return b.p('observableMap').mapKey('observableMap').mapKey('observableMap').mapKey('valueObject');
    }).subscribe(function (o) {
      return [new String('value')];
    }).change(function (o) {
      return o.observableMap.mapChanged.emit({
        type: _IMapChanged.MapChangedType.Set,
        key: 'observableMap',
        oldValue: o.observableMap,
        newValue: o.observableMap
      });
    }, function (o) {
      return [new String('value')];
    }, function (o) {
      return [new String('value')];
    }).unsubscribe(function (o) {
      return [new String('value')];
    }); // new TestDeepSubscribeVariants(
    // 	{
    // 		object: createObject().observableObject,
    // 		immediate: true,
    // 	},
    // 	b => b.p('observableList').collection()
    // 		.p('observableList').collection()
    // 		.p('valueObject'),
    // )
    // 	.subscribe(o => [new String('value')])
    // 	.change(
    // 		o => o.observableList.listChanged.emit({
    // 			type: ListChangedType.Set,
    // 			index: o.observableList.indexOf(o.observableList),
    // 			oldItems: [o.observableList],
    // 			newItems: [o.observableList],
    // 		}),
    // 		o => [new String('value')],
    // 		o => [new String('value')],
    // 	)
    // 	.unsubscribe(o => [new String('value')])
  });
});