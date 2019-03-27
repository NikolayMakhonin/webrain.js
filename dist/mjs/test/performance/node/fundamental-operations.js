/* eslint-disable no-new-func,no-array-constructor */
import { calcPerformance } from 'rdtsc';
describe('fundamental-operations', function () {
  function Path(value) {
    this.value = value;
  }

  Path.prototype.unshift = function (value) {
    var item = new Path(value);
    item.next = this;
    return item;
  };

  xit('array add item', function () {
    this.timeout(300000);
    var item = 'qweqweqweqweqwe';
    var str = item;
    var arr1 = [];
    var arr2 = new Array(10);
    var path = new Path(item);
    var result = calcPerformance(5000, function () {// no operations
    }, function () {
      str = 'qweqweqweqweqwe';
    }, function () {
      arr1 = new Array();
    }, function () {
      arr2 = new Array(10);
    }, function () {
      path = new Path(item);
    }, function () {
      str += item;
    }, function () {
      arr1[0] = item;
    }, function () {
      arr2[0] = item;
    }, function () {
      path = path.unshift(item);
    });
    console.log(str, result);
  });
  xit('pass arguments', function () {
    this.timeout(300000);

    function f1(args) {
      return args.length + 1;
    }

    function f2() {
      return arguments.length + 2;
    }

    function passF1() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      f1(args);
    }

    function passF2() {
      f2.apply(void 0, arguments);
    }

    var result = calcPerformance(5000, function () {// no operations
    }, function () {
      return passF1(1, 2, 3, 4, 5, 6, 7, 8, 9);
    }, function () {
      return passF2(1, 2, 3, 4, 5, 6, 7, 8, 9);
    });
    console.log(result);
  });
  it('lambda vs function', function () {
    this.timeout(300000);

    function f1(args) {
      var calc = function calc() {
        if (Math.random() + 1) {
          return 1;
        }

        var inputItems;
        var output;
        var map;
        var expandAndDistinct;

        if (inputItems == null) {
          return output;
        }

        if (Array.isArray(inputItems)) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = inputItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var item = _step.value;
              expandAndDistinct(item, output, map);
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

          return output;
        }

        if (!map[inputItems]) {
          map[inputItems] = true;
          output[output.length] = inputItems;
        }

        return output;
      };

      return calc();
    }

    function f2(args) {
      return calc();

      function calc() {
        if (Math.random() + 1) {
          return 1;
        }

        var inputItems;
        var output;
        var map;
        var expandAndDistinct;

        if (inputItems == null) {
          return output;
        }

        if (Array.isArray(inputItems)) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = inputItems[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var item = _step2.value;
              expandAndDistinct(item, output, map);
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

          return output;
        }

        if (!map[inputItems]) {
          map[inputItems] = true;
          output[output.length] = inputItems;
        }

        return output;
      }
    }

    var result = calcPerformance(30000, function () {// no operations
    }, function () {
      return f1(1);
    }, function () {
      return f2(2);
    });
    console.log(result);
  });
});