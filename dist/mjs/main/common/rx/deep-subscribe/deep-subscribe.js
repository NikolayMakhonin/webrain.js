import _regeneratorRuntime from "@babel/runtime/regenerator";

var _marked =
/*#__PURE__*/
_regeneratorRuntime.mark(_deepSubscribe);

/* tslint:disable */
import { ArraySet } from '../../lists/ArraySet';
import { subscribeChilds } from './helpers/subscribe-childs';
import { iterateRule } from './iterate-rule';

function deepSubscribe(object, rule, bind, options) {
  return _deepSubscribe(object, iterateRule(rule)[Symbol.iterator](), bind, options);
}

function _deepSubscribe(object, ruleIterator, bind, options, propertiesPath) {
  var iteration, ruleOrIterable, unsubscribers, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, ruleIterable, subscribeItem, unsubscribeItem, rule, _unsubscribers, unsubscribe, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, item;

  return _regeneratorRuntime.wrap(function _deepSubscribe$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          iteration = ruleIterator.next();

          if (!iteration.done) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", null);

        case 3:
          ruleOrIterable = iteration.value;

          if (!ruleOrIterable[Symbol.iterator]) {
            _context.next = 28;
            break;
          }

          unsubscribers = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 9;

          for (_iterator = ruleOrIterable[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            ruleIterable = _step.value;
            unsubscribers.push(_deepSubscribe(object, ruleIterable[Symbol.iterator](), bind, options));
          }

          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](9);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 17:
          _context.prev = 17;
          _context.prev = 18;

          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }

        case 20:
          _context.prev = 20;

          if (!_didIteratorError) {
            _context.next = 23;
            break;
          }

          throw _iteratorError;

        case 23:
          return _context.finish(20);

        case 24:
          return _context.finish(17);

        case 25:
          return _context.abrupt("return", function () {
            for (var i = 0, len = unsubscribers.length; i < len; i++) {
              unsubscribers[i]();
            }
          });

        case 28:
          subscribeItem = function subscribeItem(item, debugPropertyName) {
            var unsubscribe = item.unsubscribe; // TODO

            if (!unsubscribe) {
              unsubscribe = _deepSubscribe(object, ruleIterator, bind, options, (propertiesPath ? propertiesPath + '.' : '') + debugPropertyName + '(' + rule.description + ')');
              item.unsubscribe = unsubscribe; // TODO
            }
          };

          unsubscribeItem = function unsubscribeItem(item, debugPropertyName) {
            var unsubscribe = item.unsubscribe; // TODO

            if (unsubscribe) {
              unsubscribe();
              delete item.unsubscribe; // TODO
            }
          };

          rule = ruleOrIterable;
          _unsubscribers = new ArraySet();
          unsubscribe = subscribeChilds({
            object: object,
            propertyPredicate: rule.predicate,
            subscribeItem: subscribeItem,
            unsubscribeItem: unsubscribeItem
          });

          if (unsubscribe) {
            _unsubscribers.add(unsubscribe);
          }

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 37;

          for (_iterator2 = rule.iterateObject(object)[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            item = _step2.value;
            subscribeItem(item);
          }

          _context.next = 45;
          break;

        case 41:
          _context.prev = 41;
          _context.t1 = _context["catch"](37);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t1;

        case 45:
          _context.prev = 45;
          _context.prev = 46;

          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }

        case 48:
          _context.prev = 48;

          if (!_didIteratorError2) {
            _context.next = 51;
            break;
          }

          throw _iteratorError2;

        case 51:
          return _context.finish(48);

        case 52:
          return _context.finish(45);

        case 53:
          return _context.abrupt("return", function () {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = rule.iterateObject(object)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var item = _step3.value;
                unsubscribeItem(item);
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
          });

        case 54:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, null, [[9, 13, 17, 25], [18,, 20, 24], [37, 41, 45, 53], [46,, 48, 52]]);
}

function deepSubscribeOld(object, rule, bind, options) {
  var ruleNext = nextRule(rule);

  if (object.propertyChanged) {
    object.propertyChanged.subscribe(function (event) {
      var unsubscribe = deepSubscribe(event.newValue, ruleNext, function (value) {}, options);
    });
  } else if (object.setChanged) {
    object.setChanged.subscribe(function (event) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = event.newItems[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var newItem = _step4.value;
          var unsubscribe = deepSubscribe(newItem, ruleNext, function (value) {}, options);
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
    });
  } else if (object.mapChanged) {} else if (object.listChanged) {}
}