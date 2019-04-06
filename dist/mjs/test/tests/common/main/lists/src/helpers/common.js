import _regeneratorRuntime from "@babel/runtime/regenerator";

var _marked =
/*#__PURE__*/
_regeneratorRuntime.mark(toIterable);

export function generateArray(size) {
  var arr = [];

  for (var i = 0; i < size; i++) {
    arr.push(i);
  }

  return arr;
}
export function toIterable(array) {
  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

  return _regeneratorRuntime.wrap(function toIterable$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 3;
          _iterator = array[Symbol.iterator]();

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
export function shuffle(array) {
  return array.slice().sort(function () {
    return Math.random() > 0.5 ? 1 : -1;
  });
}
export var allValues = [[], {}, '', 'NaN', 'null', 'undefined', '0', '1', 'true', 'false', 0, 1, true, false, null, undefined, -Infinity, Infinity, NaN];
export function indexOfNaN(array) {
  for (var i = 0, len = array.length; i < len; i++) {
    var item = array[i];

    if (item !== item) {
      return i;
    }
  }
}