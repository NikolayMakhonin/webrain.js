"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.isPrimitiveDefault = isPrimitiveDefault;
exports.DeepCloneEqual = void 0;

var _isNan = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/is-nan"));

var _iterator6 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray6 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _objectUniqueId = require("../helpers/object-unique-id");

var _marked =
/*#__PURE__*/
_regenerator.default.mark(toIterableIterator);

function isPrimitiveDefault(value) {
  return value == null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string' || typeof value === 'function' || value instanceof Error;
}

function toIterableIterator(array) {
  var _iterator, _isArray, _i, _ref, item;

  return _regenerator.default.wrap(function toIterableIterator$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _iterator = array, _isArray = (0, _isArray6.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);

        case 1:
          if (!_isArray) {
            _context.next = 7;
            break;
          }

          if (!(_i >= _iterator.length)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("break", 16);

        case 4:
          _ref = _iterator[_i++];
          _context.next = 11;
          break;

        case 7:
          _i = _iterator.next();

          if (!_i.done) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("break", 16);

        case 10:
          _ref = _i.value;

        case 11:
          item = _ref;
          _context.next = 14;
          return item;

        case 14:
          _context.next = 1;
          break;

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

function toIterableIteratorGenerator(array) {
  return function () {
    return toIterableIterator(array);
  };
}

var DeepCloneEqual =
/*#__PURE__*/
function () {
  function DeepCloneEqual(_temp) {
    var _ref2 = _temp === void 0 ? {} : _temp,
        commonOptions = _ref2.commonOptions,
        cloneOptions = _ref2.cloneOptions,
        equalOptions = _ref2.equalOptions;

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
      options = (0, _extends2.default)({}, this.commonOptions, {}, this.cloneOptions, {}, options);
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
            for (var _iterator2 = source, _isArray2 = (0, _isArray6.default)(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator2.default)(_iterator2);;) {
              var _ref3;

              if (_isArray2) {
                if (_i2 >= _iterator2.length) break;
                _ref3 = _iterator2[_i2++];
              } else {
                _i2 = _iterator2.next();
                if (_i2.done) break;
                _ref3 = _i2.value;
              }

              var item = _ref3;
              cloned.add(clone(item));
            }

            return cloned;

          case 'Map':
            for (var _iterator3 = source, _isArray3 = (0, _isArray6.default)(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator2.default)(_iterator3);;) {
              var _ref4;

              if (_isArray3) {
                if (_i3 >= _iterator3.length) break;
                _ref4 = _iterator3[_i3++];
              } else {
                _i3 = _iterator3.next();
                if (_i3.done) break;
                _ref4 = _i3.value;
              }

              var _item = _ref4;
              cloned.set(clone(_item[0]), clone(_item[1]));
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
      options = (0, _extends2.default)({}, this.commonOptions, {}, this.equalOptions, {}, options);
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
            if ((0, _isArray6.default)(o1) && (0, _isArray6.default)(o2)) {
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

                  for (var _iterator4 = o1, _isArray4 = (0, _isArray6.default)(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : (0, _getIterator2.default)(_iterator4);;) {
                    var _ref5;

                    if (_isArray4) {
                      if (_i4 >= _iterator4.length) break;
                      _ref5 = _iterator4[_i4++];
                    } else {
                      _i4 = _iterator4.next();
                      if (_i4.done) break;
                      _ref5 = _i4.value;
                    }

                    var item1 = _ref5;

                    if (isMap && (!(0, _isArray6.default)(item1) || item1.length !== 2)) {
                      return false;
                    }

                    var found = void 0;

                    for (var _iterator5 = o2, _isArray5 = (0, _isArray6.default)(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : (0, _getIterator2.default)(_iterator5);;) {
                      var _ref6;

                      if (_isArray5) {
                        if (_i5 >= _iterator5.length) break;
                        _ref6 = _iterator5[_i5++];
                      } else {
                        _i5 = _iterator5.next();
                        if (_i5.done) break;
                        _ref6 = _i5.value;
                      }

                      var item2 = _ref6;

                      if (isMap && (!(0, _isArray6.default)(item2) || item2.length !== 2)) {
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

                        for (var _i6 = prevCache2NewLength, _len = cache2NewLength; _i6 < _len; _i6++) {
                          cache2[cache2New[_i6]] = 0;
                        }

                        cache2New.length = prevCache2NewLength;
                      }
                    }

                    if (!found) {
                      return false;
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