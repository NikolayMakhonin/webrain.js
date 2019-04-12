import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _typeof from "@babel/runtime/helpers/typeof";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { ANY } from './contracts/constants';
import { RuleType } from './contracts/rules';
import { getFuncPropertiesPath } from './helpers/func-properties-path';
export var RuleBuilder =
/*#__PURE__*/
function () {
  function RuleBuilder() {
    _classCallCheck(this, RuleBuilder);
  }

  _createClass(RuleBuilder, [{
    key: "_property",
    value: function _property(rule) {
      var ruleLast = this._ruleLast;

      if (ruleLast) {
        ruleLast.next = rule;
      } else {
        this.rule = rule;
      }

      this._ruleLast = rule;
      return this;
    }
  }, {
    key: "propertyRegexp",
    value: function propertyRegexp(regexp) {
      if (!(regexp instanceof RegExp)) {
        throw new Error("regexp (".concat(regexp, ") is not instance of RegExp"));
      }

      return this.propertyPredicate(function (name) {
        return regexp.test(name);
      }, regexp.toString());
    }
  }, {
    key: "propertyPredicate",
    value: function propertyPredicate(_predicate, description) {
      if (typeof _predicate !== 'function') {
        throw new Error("predicate (".concat(_predicate, ") is not a function"));
      }

      return this._property({
        type: RuleType.Property,
        predicate: function predicate(propertyName, object) {
          return Object.prototype.hasOwnProperty.call(object, propertyName) && _predicate(propertyName, object);
        },
        iterateObject:
        /*#__PURE__*/
        _regeneratorRuntime.mark(function iterateObject(object) {
          var key;
          return _regeneratorRuntime.wrap(function iterateObject$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.t0 = _regeneratorRuntime.keys(object);

                case 1:
                  if ((_context.t1 = _context.t0()).done) {
                    _context.next = 8;
                    break;
                  }

                  key = _context.t1.value;

                  if (!(Object.prototype.hasOwnProperty.call(object, key) && _predicate(key, object))) {
                    _context.next = 6;
                    break;
                  }

                  _context.next = 6;
                  return object[key];

                case 6:
                  _context.next = 1;
                  break;

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, iterateObject);
        }),
        description: description
      });
    }
  }, {
    key: "propertyAll",
    value: function propertyAll() {
      return this._property({
        type: RuleType.Property,
        predicate: function predicate(propertyName, object) {
          return Object.prototype.hasOwnProperty.call(object, propertyName);
        },
        iterateObject:
        /*#__PURE__*/
        _regeneratorRuntime.mark(function iterateObject(object) {
          var key;
          return _regeneratorRuntime.wrap(function iterateObject$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.t0 = _regeneratorRuntime.keys(object);

                case 1:
                  if ((_context2.t1 = _context2.t0()).done) {
                    _context2.next = 8;
                    break;
                  }

                  key = _context2.t1.value;

                  if (!Object.prototype.hasOwnProperty.call(object, key)) {
                    _context2.next = 6;
                    break;
                  }

                  _context2.next = 6;
                  return object[key];

                case 6:
                  _context2.next = 1;
                  break;

                case 8:
                case "end":
                  return _context2.stop();
              }
            }
          }, iterateObject);
        }),
        description: '*'
      });
    }
  }, {
    key: "propertyName",
    value: function (_propertyName) {
      function propertyName(_x) {
        return _propertyName.apply(this, arguments);
      }

      propertyName.toString = function () {
        return _propertyName.toString();
      };

      return propertyName;
    }(function (propertyName) {
      if (typeof propertyName !== 'string') {
        throw new Error("propertyName (".concat(propertyName, ") should be a string"));
      }

      if (propertyName === ANY) {
        return this.propertyAll();
      }

      return this._property({
        type: RuleType.Property,
        predicate: function predicate(propName, object) {
          return propName === propertyName && Object.prototype.hasOwnProperty.call(object, propertyName);
        },
        iterateObject:
        /*#__PURE__*/
        _regeneratorRuntime.mark(function iterateObject(object) {
          var propName;
          return _regeneratorRuntime.wrap(function iterateObject$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.t0 = _regeneratorRuntime.keys(object);

                case 1:
                  if ((_context3.t1 = _context3.t0()).done) {
                    _context3.next = 8;
                    break;
                  }

                  propName = _context3.t1.value;

                  if (!(propName === propertyName && Object.prototype.hasOwnProperty.call(object, propertyName))) {
                    _context3.next = 6;
                    break;
                  }

                  _context3.next = 6;
                  return object[propertyName];

                case 6:
                  _context3.next = 1;
                  break;

                case 8:
                case "end":
                  return _context3.stop();
              }
            }
          }, iterateObject);
        }),
        description: propertyName
      });
    })
  }, {
    key: "propertyNames",
    value: function propertyNames() {
      for (var _len = arguments.length, propertiesNames = new Array(_len), _key = 0; _key < _len; _key++) {
        propertiesNames[_key] = arguments[_key];
      }

      if (propertiesNames.length === 1) {
        return this.propertyName(propertiesNames[0]);
      }

      if (!propertiesNames.length) {
        throw new Error('propertiesNames is empty');
      }

      var properties;

      for (var i = 0, len = propertiesNames.length; i < len; i++) {
        var _propertyName2 = propertiesNames[i];

        if (typeof _propertyName2 !== 'string') {
          throw new Error("propertyName (".concat(_typeof(_propertyName2), ") should be a string"));
        }

        if (_propertyName2 === ANY) {
          return this.propertyAll();
        }

        if (!properties) {
          properties = _defineProperty({}, _propertyName2, true);
        } else {
          properties[_propertyName2] = true;
        }
      }

      return this._property({
        type: RuleType.Property,
        predicate: function predicate(propertyName, object) {
          return !!properties[propertyName] && Object.prototype.hasOwnProperty.call(object, propertyName);
        },
        iterateObject:
        /*#__PURE__*/
        _regeneratorRuntime.mark(function iterateObject(object) {
          var _i, _len2, _propertyName3;

          return _regeneratorRuntime.wrap(function iterateObject$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _i = 0, _len2 = propertiesNames.length;

                case 1:
                  if (!(_i < _len2)) {
                    _context4.next = 9;
                    break;
                  }

                  _propertyName3 = propertiesNames[_i];

                  if (!Object.prototype.hasOwnProperty.call(object, _propertyName3)) {
                    _context4.next = 6;
                    break;
                  }

                  _context4.next = 6;
                  return object[_propertyName3];

                case 6:
                  _i++;
                  _context4.next = 1;
                  break;

                case 9:
                case "end":
                  return _context4.stop();
              }
            }
          }, iterateObject);
        }),
        description: propertiesNames.join('|')
      });
    }
  }, {
    key: "path",
    value: function path(getValueFunc) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = getFuncPropertiesPath(getValueFunc)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _propertyName4 = _step.value;
          this.propertyName(_propertyName4);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this;
    }
  }, {
    key: "any",
    value: function any() {
      var ruleLast = this._ruleLast;

      for (var _len3 = arguments.length, getChilds = new Array(_len3), _key2 = 0; _key2 < _len3; _key2++) {
        getChilds[_key2] = arguments[_key2];
      }

      var rule = {
        type: RuleType.Any,
        rules: getChilds.map(function (o) {
          return o(new RuleBuilder()).rule;
        })
      };

      if (ruleLast) {
        ruleLast.next = rule;
      } else {
        this.rule = rule;
      }

      this._ruleLast = rule;
      return this;
    }
  }, {
    key: "repeat",
    value: function repeat(countMin, countMax, getChild) {
      var ruleLast = this._ruleLast;
      var rule = {
        type: RuleType.Repeat,
        countMin: countMin,
        countMax: countMax,
        rule: getChild(new RuleBuilder()).rule
      };

      if (ruleLast) {
        ruleLast.next = rule;
      } else {
        this.rule = rule;
      }

      this._ruleLast = rule;
      return this;
    }
  }]);

  return RuleBuilder;
}();