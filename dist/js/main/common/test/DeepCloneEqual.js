"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports.isPrimitiveDefault = isPrimitiveDefault;
exports.DeepCloneEqual = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _isNan = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/is-nan"));

var _iterator6 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _objectUniqueId = require("../lists/helpers/object-unique-id");

function ownKeys(object, enumerableOnly) { var keys = (0, _keys.default)(object); if (_getOwnPropertySymbols.default) { var symbols = (0, _getOwnPropertySymbols.default)(object); if (enumerableOnly) symbols = (0, _filter.default)(symbols).call(symbols, function (sym) { return (0, _getOwnPropertyDescriptor.default)(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context2; (0, _forEach.default)(_context2 = ownKeys(source, true)).call(_context2, function (key) { (0, _defineProperty3.default)(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors.default) { (0, _defineProperties.default)(target, (0, _getOwnPropertyDescriptors.default)(source)); } else { var _context3; (0, _forEach.default)(_context3 = ownKeys(source)).call(_context3, function (key) { (0, _defineProperty2.default)(target, key, (0, _getOwnPropertyDescriptor.default)(source, key)); }); } } return target; }

var _marked =
/*#__PURE__*/
_regenerator.default.mark(toIterableIterator);

function isPrimitiveDefault(value) {
  return value == null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string' || typeof value === 'function' || value instanceof Error;
}

function toIterableIterator(array) {
  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

  return _regenerator.default.wrap(function toIterableIterator$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 3;
          _iterator = (0, _getIterator2.default)(array);

        case 5:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 12;
            break;
          }

          item = _step.value;
          _context.next = 9;
          return item;

        case 9:
          _iteratorNormalCompletion = true;
          _context.next = 5;
          break;

        case 12:
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](3);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 18:
          _context.prev = 18;
          _context.prev = 19;

          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }

        case 21:
          _context.prev = 21;

          if (!_didIteratorError) {
            _context.next = 24;
            break;
          }

          throw _iteratorError;

        case 24:
          return _context.finish(21);

        case 25:
          return _context.finish(18);

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, null, [[3, 14, 18, 26], [19,, 21, 25]]);
}

function toIterableIteratorGenerator(array) {
  return function () {
    return toIterableIterator(array);
  };
}

var DeepCloneEqual =
/*#__PURE__*/
function () {
  function DeepCloneEqual() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        commonOptions = _ref.commonOptions,
        cloneOptions = _ref.cloneOptions,
        equalOptions = _ref.equalOptions;

    (0, _classCallCheck2.default)(this, DeepCloneEqual);

    if (commonOptions) {
      this.commonOptions = commonOptions;
    }

    if (cloneOptions) {
      this.cloneOptions = cloneOptions;
    }

    if (equalOptions) {
      this.equalOptions = equalOptions;
    }
  }

  (0, _createClass2.default)(DeepCloneEqual, [{
    key: "isPrimitive",
    value: function isPrimitive(value) {
      var commonOptions = this.commonOptions;
      var isPrimitive = commonOptions && commonOptions.customIsPrimitive || isPrimitiveDefault;
      return isPrimitive(value);
    }
  }, {
    key: "clone",
    value: function clone(value, options, cache) {
      options = _objectSpread({}, this.commonOptions, {}, this.cloneOptions, {}, options);
      var customClone = options && options.customClone;
      var isPrimitive = options && options.customIsPrimitive || isPrimitiveDefault;

      var clone = function clone(source) {
        if (isPrimitive(source)) {
          return source;
        }

        var id;

        if (options && options.circular) {
          id = (0, _objectUniqueId.getObjectUniqueId)(source);

          if (cache) {
            var cached = cache[id];

            if (cached != null) {
              return cached;
            }
          } else {
            cache = [];
          }
        }

        var cloned;

        if (customClone) {
          var result = customClone(source, function (o) {
            cloned = o;

            if (id != null) {
              cache[id] = o;
            }
          }, clone);

          if (result != null) {
            return result;
          }

          if (id != null && cloned != null) {
            cache[id] = null;
          }
        }

        if ((0, _getIteratorMethod2.default)(source) && source.next) {
          cloned = toIterableIterator(clone((0, _from.default)((0, _getIterator2.default)(source))));

          if (id != null) {
            cache[id] = cloned;
          }

          return cloned;
        }

        var type = source.constructor;
        var valueOf = source.valueOf();

        if (valueOf !== source) {
          cloned = new type(valueOf);

          if (id != null) {
            cache[id] = cloned;
          }

          return cloned;
        }

        cloned = new type();

        if (id != null) {
          cache[id] = cloned;
        }

        var sourceTag = source[_toStringTag.default];

        if (cloned[_toStringTag.default] !== sourceTag) {
          cloned[_toStringTag.default] = sourceTag;
        }

        switch (sourceTag) {
          case 'Set':
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = (0, _getIterator2.default)(source), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var item = _step2.value;
                cloned.add(clone(item));
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            return cloned;

          case 'Map':
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = (0, _getIterator2.default)(source), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _item = _step3.value;
                cloned.set(clone(_item[0]), clone(_item[1]));
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }

            return cloned;
        }

        if ((0, _getIteratorMethod2.default)(source) && !(0, _getIteratorMethod2.default)(cloned)) {
          cloned[_iterator6.default] = toIterableIteratorGenerator(clone((0, _from.default)((0, _getIterator2.default)(source))));
        }

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            cloned[key] = clone(source[key]);
          }
        }

        return cloned;
      };

      return clone(value);
    }
  }, {
    key: "equal",
    value: function equal(obj1, obj2, options) {
      options = _objectSpread({}, this.commonOptions, {}, this.equalOptions, {}, options);
      var customEqual = options && options.customEqual;
      var isPrimitive = options && options.customIsPrimitive || isPrimitiveDefault;
      var cache1;
      var cache2;
      var nodeId;
      var cache1New;
      var cache2New;
      var cache1NewLength;
      var cache2NewLength;

      var equal = function equal(o1, o2) {
        if (isPrimitive(o1) || isPrimitive(o2)) {
          if (o1 === o2 || (0, _isNan.default)(o1) && (0, _isNan.default)(o2) || (!options || !options.strictEqualFunctions) && typeof o1 === 'function' && typeof o2 === 'function' && o1.toString() === o2.toString()) {
            return true;
          } else {
            return false;
          }
        }

        if (nodeId == null) {
          nodeId = 1;
        }

        if (options && (options.circular || options.equalInnerReferences)) {
          var id1 = (0, _objectUniqueId.getObjectUniqueId)(o1);
          var id2 = (0, _objectUniqueId.getObjectUniqueId)(o2);

          if (id1 != null && !cache1) {
            cache1 = [];
          }

          if (id2 != null && !cache2) {
            cache2 = [];
          }

          if (id1 == null) {
            if (id2 == null) {
              if (o1 === o2) {
                return true;
              }
            } else {
              return false;
            }
          } else {
            if (id2 == null) {
              return false;
            }

            if (o1 === o2) {
              if (options.noCrossReferences) {
                return false;
              } else {
                cache1[id1] = nodeId;
                cache2[id2] = nodeId;
                return true;
              }
            }

            if (options.noCrossReferences && (cache1[id2] || cache2[id1])) {
              return false;
            }

            if (options.equalInnerReferences && (cache1[id1] || nodeId) !== (cache2[id2] || nodeId)) {
              return false;
            }

            if (cache1[id1] && cache2[id2]) {
              return true;
            }

            if (cache1NewLength != null && !cache1[id1]) {
              cache1New.push(id1);
            }

            if (cache2NewLength != null && !cache2[id1]) {
              cache2New.push(id2);
            }

            cache1[id1] = nodeId;
            cache2[id2] = nodeId;
          }
        } else if (o1 === o2) {
          if (options && options.noCrossReferences) {
            return false;
          } else {
            return true;
          }
        }

        if (customEqual) {
          var result = customEqual(o1, o2, equal);

          if (result != null) {
            return result;
          }
        }

        if (options && options.equalTypes) {
          var type1 = o1.constructor;
          var type2 = o2.constructor;

          if (type1 !== type2) {
            return false;
          }
        }

        var valueOf1 = o1.valueOf();
        var valueOf2 = o2.valueOf();

        if (valueOf1 !== o1 || valueOf2 !== o2) {
          if (valueOf1 === valueOf2 || (0, _isNan.default)(valueOf1) && (0, _isNan.default)(valueOf2)) {
            return true;
          } else {
            return false;
          }
        }

        if (typeof (0, _getIteratorMethod2.default)(o1) === 'function') {
          if (typeof (0, _getIteratorMethod2.default)(o2) === 'function') {
            if ((0, _isArray.default)(o1) && (0, _isArray.default)(o2)) {
              if (o1.length !== o2.length) {
                return false;
              }
            } else {
              if ((o1.size || o1.length) !== (o2.size || o2.length)) {
                return false;
              }

              if (options && !options.equalMapSetOrder) {
                var tag1 = o1[_toStringTag.default];
                var tag2 = o2[_toStringTag.default];
                var isMap = tag1 === 'Map' || tag2 === 'Map';

                if (tag1 === 'Set' || tag2 === 'Set' || isMap) {
                  if (tag1 && tag2 && tag1 !== tag2) {
                    return false;
                  }

                  if (!cache1New) {
                    cache1New = [];
                  }

                  if (!cache2New) {
                    cache2New = [];
                  }

                  if (cache1NewLength == null) {
                    cache1NewLength = 0;
                  }

                  if (cache2NewLength == null) {
                    cache2NewLength = 0;
                  }

                  var initialCache1NewLength = cache1NewLength;
                  var initialCache2NewLength = cache2NewLength;
                  var _iteratorNormalCompletion4 = true;
                  var _didIteratorError4 = false;
                  var _iteratorError4 = undefined;

                  try {
                    for (var _iterator4 = (0, _getIterator2.default)(o1), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                      var item1 = _step4.value;

                      if (isMap && (!(0, _isArray.default)(item1) || item1.length !== 2)) {
                        return false;
                      }

                      var found = void 0;
                      var _iteratorNormalCompletion5 = true;
                      var _didIteratorError5 = false;
                      var _iteratorError5 = undefined;

                      try {
                        for (var _iterator5 = (0, _getIterator2.default)(o2), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                          var item2 = _step5.value;

                          if (isMap && (!(0, _isArray.default)(item2) || item2.length !== 2)) {
                            return false;
                          }

                          var prevNodeId = nodeId;
                          var prevCache1NewLength = cache1NewLength;
                          var prevCache2NewLength = cache2NewLength;
                          nodeId++;

                          var _result = isMap ? equal(item1[0], item2[0]) && equal(item1[1], item2[1]) : equal(item1, item2);

                          if (_result) {
                            found = true;
                            break;
                          } else {
                            nodeId = prevNodeId;

                            for (var i = prevCache1NewLength, len = cache1NewLength; i < len; i++) {
                              cache1[cache1New[i]] = 0;
                            }

                            cache1New.length = prevCache1NewLength;

                            for (var _i = prevCache2NewLength, _len = cache2NewLength; _i < _len; _i++) {
                              cache2[cache2New[_i]] = 0;
                            }

                            cache2New.length = prevCache2NewLength;
                          }
                        }
                      } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                      } finally {
                        try {
                          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                            _iterator5.return();
                          }
                        } finally {
                          if (_didIteratorError5) {
                            throw _iteratorError5;
                          }
                        }
                      }

                      if (!found) {
                        return false;
                      }
                    }
                  } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                        _iterator4.return();
                      }
                    } finally {
                      if (_didIteratorError4) {
                        throw _iteratorError4;
                      }
                    }
                  }

                  if (initialCache1NewLength === 0) {
                    cache1NewLength = null;
                  }

                  if (initialCache2NewLength === 0) {
                    cache2NewLength = null;
                  }

                  return true;
                }
              }

              var iterator1 = (0, _getIterator2.default)(o1);
              var iterator2 = (0, _getIterator2.default)(o2);

              do {
                var iteration1 = iterator1.next();
                var iteration2 = iterator2.next();
                nodeId++;

                if (!equal(iteration1.value, iteration2.value)) {
                  return false;
                }

                if (iteration1.done) {
                  if (!iteration2.done) {
                    return false;
                  }

                  break;
                }
              } while (true);

              return true;
            }
          } else {
            return false;
          }
        } else if (typeof (0, _getIteratorMethod2.default)(o2) === 'function') {
          return false;
        }

        for (var key in o1) {
          if (Object.prototype.hasOwnProperty.call(o1, key)) {
            if (!Object.prototype.hasOwnProperty.call(o2, key)) {
              return false;
            }

            nodeId++;

            if (!equal(o1[key], o2[key])) {
              return false;
            }
          }
        }

        for (var _key in o2) {
          if (Object.prototype.hasOwnProperty.call(o2, _key) && !Object.prototype.hasOwnProperty.call(o1, _key)) {
            return false;
          }
        }

        return true;
      };

      return equal(obj1, obj2);
    }
  }]);
  return DeepCloneEqual;
}();

exports.DeepCloneEqual = DeepCloneEqual;