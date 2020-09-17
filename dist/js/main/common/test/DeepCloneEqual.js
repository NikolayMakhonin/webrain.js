"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.isPrimitiveDefault = isPrimitiveDefault;
exports.DeepCloneEqual = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _iterator6 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _helpers = require("../helpers/helpers");

var _objectUniqueId = require("../helpers/object-unique-id");

var _marked = /*#__PURE__*/_regenerator.default.mark(toIterableIterator);

function _createForOfIteratorHelperLoose(o) { var _context3; var i = 0; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = (0, _getIterator2.default)(o); return (0, _bind.default)(_context3 = i.next).call(_context3, i); }

function _unsupportedIterableToArray(o, minLen) { var _context2; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context2 = Object.prototype.toString.call(o)).call(_context2, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function isPrimitiveDefault(value) {
  return value == null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string' || typeof value === 'function' || value instanceof Error;
}

function toIterableIterator(array) {
  var _iterator, _step, item;

  return _regenerator.default.wrap(function toIterableIterator$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _iterator = _createForOfIteratorHelperLoose(array);

        case 1:
          if ((_step = _iterator()).done) {
            _context.next = 7;
            break;
          }

          item = _step.value;
          _context.next = 5;
          return item;

        case 5:
          _context.next = 1;
          break;

        case 7:
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

var DeepCloneEqual = /*#__PURE__*/function () {
  function DeepCloneEqual(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
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
      options = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, this.commonOptions), this.cloneOptions), options);
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

        if ((0, _helpers.isIterator)(source)) {
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
            for (var _iterator2 = _createForOfIteratorHelperLoose(source), _step2; !(_step2 = _iterator2()).done;) {
              var item = _step2.value;
              cloned.add(clone(item));
            }

            return cloned;

          case 'Map':
            for (var _iterator3 = _createForOfIteratorHelperLoose(source), _step3; !(_step3 = _iterator3()).done;) {
              var _item = _step3.value;
              cloned.set(clone(_item[0]), clone(_item[1]));
            }

            return cloned;
        }

        if ((0, _helpers.isIterable)(source) && !(0, _helpers.isIterable)(cloned)) {
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
      options = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, this.commonOptions), this.equalOptions), options);
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
          if ((0, _helpers.equals)(o1, o2) || (!options || !options.strictEqualFunctions) && typeof o1 === 'function' && typeof o2 === 'function' && o1.toString() === o2.toString()) {
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
          if ((0, _helpers.equals)(valueOf1, valueOf2)) {
            return true;
          } else {
            return false;
          }
        }

        if ((0, _helpers.isIterable)(o1)) {
          if ((0, _helpers.isIterable)(o2)) {
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

                  for (var _iterator4 = _createForOfIteratorHelperLoose(o1), _step4; !(_step4 = _iterator4()).done;) {
                    var item1 = _step4.value;

                    if (isMap && (!(0, _isArray.default)(item1) || item1.length !== 2)) {
                      return false;
                    }

                    var found = void 0;

                    for (var _iterator5 = _createForOfIteratorHelperLoose(o2), _step5; !(_step5 = _iterator5()).done;) {
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
        } else if ((0, _helpers.isIterable)(o2)) {
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