"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.applyRuleFactories = applyRuleFactories;
exports.ruleFactoriesVariants = ruleFactoriesVariants;
exports.RuleBuildersBuilder = void 0;

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _repeat2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/repeat"));

var _flatMap = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/flat-map"));

var _isArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _rules = require("../../../../../../../../main/common/rx/deep-subscribe/contracts/rules");

var _Variants = require("../../../../../../../../main/common/test/Variants");

/* tslint:disable:no-shadowed-variable */

/**
 * Returns an array with arrays of the given size.
 *
 * @param array array to split
 * @param chunkSize Size of every group
 */
function chunkArray(array, chunkSize) {
  var arrayLength = array.length;
  var chunks = [];

  for (var _index = 0; _index < arrayLength; _index += chunkSize) {
    var chunk = (0, _slice.default)(array).call(array, _index, _index + chunkSize);
    chunks.push(chunk);
  }

  return chunks;
}

// endregion
var RuleBuildersBuilder =
/*#__PURE__*/
function () {
  function RuleBuildersBuilder() {
    (0, _classCallCheck2.default)(this, RuleBuildersBuilder);
    this.ruleFactoriesTree = [];
  }

  (0, _createClass2.default)(RuleBuildersBuilder, [{
    key: "ruleFactory",
    value: function ruleFactory(_ruleFactory2, prevRuleFactoryIndex) {
      this.ruleFactoriesTree.push(function _ruleFactory(index) {
        return [_ruleFactory2, index + 1];
      });
      return this;
    }
  }, {
    key: "variants",
    value: function variants() {
      var _context,
          _this = this;

      for (var _len = arguments.length, getVariants = new Array(_len), _key = 0; _key < _len; _key++) {
        getVariants[_key] = arguments[_key];
      }

      if (getVariants.length === 0) {
        return this;
      }

      if (getVariants.length === 1) {
        getVariants[0](this);
        return this;
      }

      var variants = (0, _filter.default)(_context = (0, _map.default)(getVariants).call(getVariants, function (getVariant) {
        return getVariant(_this.clone(true)).ruleFactoriesTree;
      })).call(_context, function (o) {
        return o.length;
      });

      if (variants.length) {
        this.ruleFactoriesTree.push(variants);
      }

      return this;
    }
  }, {
    key: "_any",
    value: function _any() {
      for (var _len2 = arguments.length, getChilds = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        getChilds[_key2] = arguments[_key2];
      }

      var len = getChilds.length;
      var ruleIndex = this.ruleFactoriesTree.length - 1;
      this.ruleFactoriesTree.push(function any(index) {
        index++;
        var args = [];

        for (var i = 0; i < len; i++) {
          var _this$index = this[index](index),
              ruleFactory = _this$index[0],
              indexNext = _this$index[1];

          index = indexNext;
          args.push(ruleFactory);
        }

        return [function (b) {
          return b.any.apply(b, args);
        }, index];
      });

      for (var i = 0; i < len; i++) {
        getChilds[i](this);
      }

      return this;
    }
  }, {
    key: "any",
    value: function any() {
      for (var _len3 = arguments.length, getChilds = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        getChilds[_key3] = arguments[_key3];
      }

      var variants = (0, _Variants.iterablesToArrays)((0, _Variants.treeToSequenceVariants)(getChilds));
      return this.variants.apply(this, (0, _map.default)(variants).call(variants, function (args) {
        return function (b) {
          return b._any.apply(b, args);
        };
      }));
    }
  }, {
    key: "_if",
    value: function _if() {
      for (var _len4 = arguments.length, exclusiveConditionRules = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        exclusiveConditionRules[_key4] = arguments[_key4];
      }

      var len = exclusiveConditionRules.length;
      var ruleIndex = this.ruleFactoriesTree.length - 1;
      this.ruleFactoriesTree.push(function If(index) {
        index++;
        var args = [];

        for (var i = 0; i < len; i++) {
          var conditionRule = exclusiveConditionRules[i];

          var _this$index2 = this[index](index),
              ruleFactory = _this$index2[0],
              indexNext = _this$index2[1];

          index = indexNext;
          args.push((0, _isArray2.default)(conditionRule) ? [conditionRule[0], ruleFactory] : ruleFactory);
        }

        return [function (b) {
          return b.if.apply(b, args);
        }, index];
      });

      for (var i = 0; i < len; i++) {
        var conditionRule = exclusiveConditionRules[i];

        if ((0, _isArray2.default)(conditionRule)) {
          conditionRule[1](this);
        } else {
          conditionRule(this);
        }
      }

      return this;
    }
  }, {
    key: "if",
    value: function _if() {
      for (var _len5 = arguments.length, exclusiveConditionRules = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        exclusiveConditionRules[_key5] = arguments[_key5];
      }

      var tree = (0, _flatMap.default)(exclusiveConditionRules).call(exclusiveConditionRules, function (o) {
        return o;
      });
      var variants = (0, _Variants.iterablesToArrays)((0, _Variants.treeToSequenceVariants)(tree));
      return this.variants.apply(this, (0, _map.default)(variants).call(variants, function (args) {
        var _context2;

        var chunkArgs = (0, _map.default)(_context2 = chunkArray(args, 2)).call(_context2, function (o) {
          return o[0] ? o : o[1];
        });
        return function (b) {
          return b._if.apply(b, chunkArgs);
        };
      }));
    }
  }, {
    key: "_repeat",
    value: function _repeat(countMin, countMax, condition, getChild) {
      var ruleIndex = this.ruleFactoriesTree.length - 1;
      this.ruleFactoriesTree.push(function repeat(index) {
        index++;

        var _this$index3 = this[index](index),
            ruleFactory = _this$index3[0],
            indexNext = _this$index3[1];

        index = indexNext;
        return [function (b) {
          return (0, _repeat2.default)(b).call(b, countMin, countMax, condition, ruleFactory);
        }, index];
      });
      getChild(this);
      return this;
    }
  }, {
    key: "repeat",
    value: function repeat(countMin, countMax, condition, getChild) {
      var variants = (0, _Variants.iterablesToArrays)((0, _Variants.treeToSequenceVariants)([countMin, countMax, condition, getChild]));
      return this.variants.apply(this, (0, _map.default)(variants).call(variants, function (args) {
        return function (b) {
          return b._repeat.apply(b, args);
        };
      }));
    }
  }, {
    key: "collection",
    value: function collection() {
      return this.ruleFactory(function collection(b) {
        return b.collection();
      });
    }
  }, {
    key: "mapAny",
    value: function mapAny() {
      return this.ruleFactory(function mapAny(b) {
        return b.mapAny();
      });
    }
  }, {
    key: "mapKey",
    value: function mapKey(key) {
      var variants = (0, _Variants.iterablesToArrays)((0, _Variants.treeToSequenceVariants)([key]));
      return this.variants.apply(this, (0, _map.default)(variants).call(variants, function (args) {
        return function (bb) {
          return bb.ruleFactory(function mapKey(b) {
            return b.mapKey.apply(b, args);
          });
        };
      }));
    }
  }, {
    key: "mapKeys",
    value: function mapKeys() {
      for (var _len6 = arguments.length, keys = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        keys[_key6] = arguments[_key6];
      }

      var variants = (0, _Variants.iterablesToArrays)((0, _Variants.treeToSequenceVariants)(keys));
      return this.variants.apply(this, (0, _map.default)(variants).call(variants, function (args) {
        return function (bb) {
          return bb.ruleFactory(function mapKeys(b) {
            return b.mapKeys.apply(b, args);
          });
        };
      }));
    }
  }, {
    key: "mapPredicate",
    value: function mapPredicate(keyPredicate, description) {
      var variants = (0, _Variants.iterablesToArrays)((0, _Variants.treeToSequenceVariants)([keyPredicate, description]));
      return this.variants.apply(this, (0, _map.default)(variants).call(variants, function (args) {
        return function (bb) {
          return bb.ruleFactory(function mapPredicate(b) {
            return b.mapPredicate.apply(b, args);
          });
        };
      }));
    }
  }, {
    key: "mapRegexp",
    value: function mapRegexp(keyRegexp) {
      var variants = (0, _Variants.iterablesToArrays)((0, _Variants.treeToSequenceVariants)([keyRegexp]));
      return this.variants.apply(this, (0, _map.default)(variants).call(variants, function (args) {
        return function (bb) {
          return bb.ruleFactory(function mapRegexp(b) {
            return b.mapRegexp.apply(b, args);
          });
        };
      }));
    }
  }, {
    key: "never",
    value: function never() {
      return this.ruleFactory(function never(b) {
        return b.never();
      });
    }
  }, {
    key: "nothing",
    value: function nothing() {
      return this.ruleFactory(function nothing(b) {
        return b.nothing();
      });
    } // public path<TValue>(getValueFunc: (o: TObject) => TValue): IRuleBuildersBuilder<any, TValueKeys> {
    // 	return this.ruleFactory(function collection(b) { return b.collection() })
    // }

  }, {
    key: "propertyAny",
    value: function propertyAny() {
      return this.ruleFactory(function propertyAny(b) {
        return b.propertyAny();
      });
    }
  }, {
    key: "propertyName",
    value: function propertyName(propName) {
      var variants = (0, _Variants.iterablesToArrays)((0, _Variants.treeToSequenceVariants)([propName]));
      return this.variants.apply(this, (0, _map.default)(variants).call(variants, function (args) {
        return function (bb) {
          return bb.ruleFactory(function propertyName(b) {
            return b.propertyName.apply(b, args);
          });
        };
      }));
    }
  }, {
    key: "propertyNames",
    value: function propertyNames() {
      for (var _len7 = arguments.length, propertiesNames = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        propertiesNames[_key7] = arguments[_key7];
      }

      var variants = (0, _Variants.iterablesToArrays)((0, _Variants.treeToSequenceVariants)(propertiesNames));
      return this.variants.apply(this, (0, _map.default)(variants).call(variants, function (args) {
        return function (bb) {
          return bb.ruleFactory(function propertyNames(b) {
            return b.propertyNames.apply(b, args);
          });
        };
      }));
    }
  }, {
    key: "p",
    value: function p() {
      for (var _len8 = arguments.length, propertiesNames = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        propertiesNames[_key8] = arguments[_key8];
      }

      var variants = (0, _Variants.iterablesToArrays)((0, _Variants.treeToSequenceVariants)(propertiesNames));
      return this.variants.apply(this, (0, _map.default)(variants).call(variants, function (args) {
        return function (bb) {
          return bb.ruleFactory(function p(b) {
            return b.p.apply(b, args);
          });
        };
      }));
    }
  }, {
    key: "propertyPredicate",
    value: function propertyPredicate(predicate, description) {
      var variants = (0, _Variants.iterablesToArrays)((0, _Variants.treeToSequenceVariants)([predicate, description]));
      return this.variants.apply(this, (0, _map.default)(variants).call(variants, function (args) {
        return function (bb) {
          return bb.ruleFactory(function propertyPredicate(b) {
            return b.propertyPredicate.apply(b, args);
          });
        };
      }));
    }
  }, {
    key: "propertyRegexp",
    value: function propertyRegexp(regexp) {
      var variants = (0, _Variants.iterablesToArrays)((0, _Variants.treeToSequenceVariants)([regexp]));
      return this.variants.apply(this, (0, _map.default)(variants).call(variants, function (args) {
        return function (bb) {
          return bb.ruleFactory(function propertyRegexp(b) {
            return b.propertyRegexp.apply(b, args);
          });
        };
      }));
    } // public rule<TValue>(rule: IRule): IRuleBuildersBuilder<TValue, TValueKeys> {
    // 	return this.ruleFactory(function collection(b) { return b.collection() })
    // }
    // public ruleSubscribe<TValue>(ruleSubscribe: IRuleSubscribe<TObject, TValue>, description?: string)
    // 	: IRuleBuildersBuilder<TValue, TValueKeys>
    // {
    // 	return this.ruleFactory(function collection(b) { return b.collection() })
    // }

  }, {
    key: "valuePropertyDefault",
    value: function valuePropertyDefault() {
      return this.ruleFactory(function valuePropertyDefault(b) {
        return b.valuePropertyDefault();
      });
    }
  }, {
    key: "valuePropertyName",
    value: function valuePropertyName(propertyName) {
      var variants = (0, _Variants.iterablesToArrays)((0, _Variants.treeToSequenceVariants)([propertyName]));
      return this.variants.apply(this, (0, _map.default)(variants).call(variants, function (args) {
        return function (bb) {
          return bb.ruleFactory(function valuePropertyName(b) {
            return b.valuePropertyName.apply(b, args);
          });
        };
      }));
    }
  }, {
    key: "valuePropertyNames",
    value: function valuePropertyNames() {
      for (var _len9 = arguments.length, propertiesNames = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        propertiesNames[_key9] = arguments[_key9];
      }

      var variants = (0, _Variants.iterablesToArrays)((0, _Variants.treeToSequenceVariants)(propertiesNames));
      return this.variants.apply(this, (0, _map.default)(variants).call(variants, function (args) {
        return function (bb) {
          return bb.ruleFactory(function valuePropertyNames(b) {
            return b.valuePropertyNames.apply(b, args);
          });
        };
      }));
    }
  }, {
    key: "v",
    value: function v() {
      for (var _len10 = arguments.length, propertiesNames = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        propertiesNames[_key10] = arguments[_key10];
      }

      var variants = (0, _Variants.iterablesToArrays)((0, _Variants.treeToSequenceVariants)(propertiesNames));
      return this.variants.apply(this, (0, _map.default)(variants).call(variants, function (args) {
        return function (bb) {
          return bb.ruleFactory(function v(b) {
            return b.v.apply(b, args);
          });
        };
      }));
    }
  }, {
    key: "clone",
    value: function clone(optionsOnly) {
      var clone = new RuleBuildersBuilder();

      if (!optionsOnly) {
        throw new Error('Not implemented'); // clone.ruleFactoriesTree = [...this.ruleFactoriesTree]
      }

      return clone;
    } // endregion
    // variants

  }, {
    key: "nothingVariants",
    value: function nothingVariants(beforeValueProperty) {
      var _context3;

      return this.variants.apply(this, (0, _concat.default)(_context3 = [function (b) {
        return b;
      }, function (b) {
        return b.nothing();
      }, function (b) {
        return b.if([function (o) {
          return false;
        }, function (b) {
          return b.never();
        }]);
      }, function (b) {
        return b.if([function (o) {
          return false;
        }, function (b) {
          return b.never();
        }], [null, function (b) {
          return b.nothing();
        }]);
      }, function (b) {
        return (0, _repeat2.default)(b).call(b, 0, 2, [function (o, i) {
          return i === 1 ? _rules.RuleRepeatAction.Fork : _rules.RuleRepeatAction.Next;
        }], function (b) {
          return b.nothing();
        });
      }]).call(_context3, beforeValueProperty ? [] : [function (b) {
        return b.valuePropertyDefault();
      }, function (b) {
        return b.v('notExistProperty');
      }]));
    }
  }, {
    key: "neverVariants",
    value: function neverVariants() {
      return this.variants(function (b) {
        return b;
      }, function (b) {
        return b.never();
      }, function (b) {
        return b.if([function (o) {
          return true;
        }, function (b) {
          return b.never();
        }]);
      }, function (b) {
        return b.if([function (o) {
          return false;
        }, function (b) {
          return b.nothing();
        }], [null, function (b) {
          return b.never();
        }]);
      }, function (b) {
        return b.any(function (b) {
          return (0, _repeat2.default)(b).call(b, [1, 2], [0, 2], [null, function (o) {
            return _rules.RuleRepeatAction.All;
          }], function (b) {
            return b.never();
          });
        });
      });
    } // endregion

  }]);
  return RuleBuildersBuilder;
}(); // region ruleFactoriesVariants


exports.RuleBuildersBuilder = RuleBuildersBuilder;

function applyRuleFactories(ruleFactories, builder) {
  var len = ruleFactories.length;
  var index = 0;

  while (index < len) {
    var _ruleFactories$index = ruleFactories[index](index),
        ruleFactory = _ruleFactories$index[0],
        indexNext = _ruleFactories$index[1];

    builder = ruleFactory(builder);
    index = indexNext;
  }

  return builder;
}

function ruleFactoriesVariants() {
  var _ref;

  var ruleFactoriesTree = (_ref = new RuleBuildersBuilder()).variants.apply(_ref, arguments).ruleFactoriesTree;

  var factoriesVariants = (0, _Variants.treeToSequenceVariants)(ruleFactoriesTree);
  var factories = [];

  var _loop = function _loop() {
    if (_isArray) {
      if (_i >= _iterator.length) return "break";
      _ref2 = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) return "break";
      _ref2 = _i.value;
    }

    var factoriesVariant = _ref2;
    var factoriesVariantArray = (0, _from.default)(factoriesVariant);
    factories.push(function (b) {
      return applyRuleFactories(factoriesVariantArray, b);
    });
  };

  for (var _iterator = factoriesVariants, _isArray = (0, _isArray2.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
    var _ref2;

    var _ret = _loop();

    if (_ret === "break") break;
  }

  return factories;
} // endregion