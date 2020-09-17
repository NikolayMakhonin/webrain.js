"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.compareDefault = compareDefault;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _isIterable2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/is-iterable"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _create = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/create"));

var _iterator4 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _values2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));

var _weakSet = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/weak-set"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _immutable = require("immutable");

var _rdtsc = require("rdtsc");

var _async = require("../../../main/common/async/async");

var _ThenableSync = require("../../../main/common/async/ThenableSync");

var _helpers = require("../../../main/common/helpers/helpers");

var _objectUniqueId = require("../../../main/common/helpers/object-unique-id");

var _array = require("../../../main/common/lists/helpers/array");

var _Assert = require("../../../main/common/test/Assert");

var _Mocha = require("../../../main/common/test/Mocha");

function _createForOfIteratorHelperLoose(o) { var _context14; var i = 0; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = (0, _getIterator2.default)(o); return (0, _bind.default)(_context14 = i.next).call(_context14, i); }

function _unsupportedIterableToArray(o, minLen) { var _context13; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context13 = Object.prototype.toString.call(o)).call(_context13, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var SetNative = _set.default;

require('./src/SetPolyfill');

function compareDefault(o1, o2) {
  if (o1 > o2) {
    return 1;
  }

  if (o2 > o1) {
    return -1;
  }

  return 0;
}

(0, _Mocha.describe)('fundamental-operations', function () {
  function Path(value) {
    this.value = value;
  }

  Path.prototype.unshift = function (value) {
    var item = new Path(value);
    item.next = this;
    return item;
  };

  (0, _Mocha.xit)('array add item', function () {
    this.timeout(300000);
    var item = 'qweqweqweqweqwe';
    var str = item;
    var arr1 = [];
    var arr2 = new Array(10);
    var path = new Path(item);
    var result = (0, _rdtsc.calcPerformance)(5000, function () {// no operations
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
  (0, _Mocha.xit)('pass arguments', function () {
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

    var result = (0, _rdtsc.calcPerformance)(5000, function () {// no operations
    }, function () {
      return passF1(1, 2, 3, 4, 5, 6, 7, 8, 9);
    }, function () {
      return passF2(1, 2, 3, 4, 5, 6, 7, 8, 9);
    });
    console.log(result);
  });
  (0, _Mocha.xit)('lambda vs function', function () {
    this.timeout(300000); // noinspection JSUnusedLocalSymbols

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

        if ((0, _isArray.default)(inputItems)) {
          for (var _iterator = _createForOfIteratorHelperLoose(inputItems), _step; !(_step = _iterator()).done;) {
            var item = _step.value;
            expandAndDistinct(item, output, map);
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

        if ((0, _isArray.default)(inputItems)) {
          for (var _iterator2 = _createForOfIteratorHelperLoose(inputItems), _step2; !(_step2 = _iterator2()).done;) {
            var item = _step2.value;
            expandAndDistinct(item, output, map);
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

    var result = (0, _rdtsc.calcPerformance)(30000, function () {// no operations
    }, function () {
      return f1(1);
    }, function () {
      return f2(2);
    });
    console.log(result);
  });
  (0, _Mocha.xit)('lazy function parameters', function () {
    this.timeout(300000);

    function f(arg1, arg2) {
      if (!arg1 || Math.random() === 0.5) {
        return arg2.x;
      }

      if (typeof arg2 === 'function') {
        arg2 = arg2();
      }

      if (Math.random() === 0.5) {
        console.log(arg2.x);
      }

      return arg2.x;
    }

    var result = (0, _rdtsc.calcPerformance)(60000, function () {// no operations
    }, function () {
      return f(false, {
        x: [1, 2, 3],
        y: 2,
        z: 3
      });
    }, function () {
      return f(false, function () {
        return {
          x: [1, 2, 3],
          y: 2,
          z: 3
        };
      });
    }, function () {
      return f(true, {
        x: [1, 2, 3],
        y: 2,
        z: 3
      });
    }, function () {
      return f(true, function () {
        return {
          x: [1, 2, 3],
          y: 2,
          z: 3
        };
      });
    });
    console.log(result);
  });

  function copyToArray(source, dest, len, index) {
    if (!len) {
      len = source.length;
    }

    if (!index) {
      index = 0;
    }

    for (var i = index; i < len; i++) {
      dest[index + i] = source[i];
    }
  }

  function generateArray(size) {
    var arr = [];

    for (var i = 0; i < size; i++) {
      arr.push(i);
    }

    return arr;
  }

  (0, _Mocha.xit)('array decrease length', function () {
    this.timeout(300000);
    var arr = generateArray(10000);
    var arr2;
    var result = (0, _rdtsc.calcPerformance)(60000, function () {// no operations
    }, function () {
      arr2 = (0, _slice.default)(arr).call(arr);
    }, function () {
      (0, _splice.default)(arr2).call(arr2, arr2.length - 1, 1); // 1368
    }, function () {
      arr2 = (0, _slice.default)(arr).call(arr);
    }, function () {
      arr2.length--; // 698
    }, function () {
      arr2 = (0, _slice.default)(arr).call(arr);
    }, function () {
      delete arr2[arr2.length - 1]; // 291
    });
    console.log(result);
  });
  (0, _Mocha.xit)('array decrease length 100', function () {
    this.timeout(300000);
    var arr = generateArray(10000);
    var arr2;
    var result = (0, _rdtsc.calcPerformance)(60000, function () {// no operations
    }, function () {
      arr2 = (0, _slice.default)(arr).call(arr);
    }, function () {
      (0, _splice.default)(arr2).call(arr2, arr2.length - 100, 100); // 3465
    }, function () {
      arr2 = (0, _slice.default)(arr).call(arr);
    }, function () {
      arr2.length -= 100; // 690
    });
    console.log(result);
  });
  (0, _Mocha.xit)('array increase length', function () {
    this.timeout(300000);
    var arr = generateArray(10000);
    var arr2;
    var result = (0, _rdtsc.calcPerformance)(60000, function () {// no operations
    }, function () {
      arr2 = (0, _slice.default)(arr).call(arr);
    }, function () {
      // 80803
      var clone = new Array(arr2.length + 1);
      copyToArray(arr2, clone);
      arr2 = clone;
    }, function () {
      arr2 = (0, _slice.default)(arr).call(arr);
    }, function () {
      arr2[arr2.length] = arr2.length; // 34189
    }, function () {
      arr2 = (0, _slice.default)(arr).call(arr);
    }, function () {
      arr2.push(arr2.length); // 34048
    }, function () {
      arr2 = (0, _slice.default)(arr).call(arr);
    }, function () {
      arr2.length++; // 137850
    }, function () {
      arr2 = (0, _slice.default)(arr).call(arr);
    }, function () {
      (0, _splice.default)(arr2).call(arr2, arr2.length, 0, arr2.length); // 138119
    });
    console.log(result);
  });
  (0, _Mocha.xit)('array increase length 100', function () {
    this.timeout(300000);
    var arr = generateArray(10000);
    var arr2;
    var result = (0, _rdtsc.calcPerformance)(60000, function () {// no operations
    }, function () {
      arr2 = (0, _slice.default)(arr).call(arr);
    }, function () {
      // 81010
      var clone = new Array(arr2.length + 100);
      copyToArray(arr2, clone);
      arr2 = clone;
    }, function () {
      arr2 = (0, _slice.default)(arr).call(arr);
    }, function () {
      arr2.length += 100; // 137800
    }, function () {
      arr2 = (0, _slice.default)(arr).call(arr);
    }, function () {
      // 35132
      for (var i = 0; i < 100; i++) {
        arr2.push(0);
      }
    }, function () {
      arr2 = (0, _slice.default)(arr).call(arr);
    }, function () {
      // 35581
      for (var i = arr2.length, end = i + 100; i < end; i++) {
        arr2[i] = 0;
      }
    });
    console.log(result);
  });
  (0, _Mocha.xit)('array default value', function () {
    this.timeout(300000);
    var arrNumbers = generateArray(10);
    var arrStrings = (0, _map2.default)(arrNumbers).call(arrNumbers, function (o) {
      return o.toString();
    });
    var arrFunctions = (0, _map2.default)(arrNumbers).call(arrNumbers, function (o) {
      return function () {
        return o.toString();
      };
    });
    var arrObjects = (0, _map2.default)(arrNumbers).call(arrNumbers, function (o) {
      return {
        o: o
      };
    });
    var defaultNumber = 0;
    var defaultString = '';
    var defaultFunction = new Function();
    var defaultObject = {};
    var arr;
    var result = (0, _rdtsc.calcPerformance)(180000, function () {// no operations
    }, function () {
      arr = (0, _slice.default)(arrNumbers).call(arrNumbers);
    }, function () {
      // 31
      arr[arr.length - 1] = undefined;
    }, function () {
      arr = (0, _slice.default)(arrNumbers).call(arrNumbers);
    }, function () {
      // 4
      arr[arr.length - 1] = null;
    }, function () {
      arr = (0, _slice.default)(arrNumbers).call(arrNumbers);
    }, function () {
      // -11
      arr[arr.length - 1] = defaultNumber;
    }, function () {
      arr = (0, _slice.default)(arrNumbers).call(arrNumbers);
    }, function () {
      // 35
      arr[arr.length - 1] = defaultString;
    }, function () {
      arr = (0, _slice.default)(arrStrings).call(arrStrings);
    }, function () {
      // 8
      arr[arr.length - 1] = undefined;
    }, function () {
      arr = (0, _slice.default)(arrStrings).call(arrStrings);
    }, function () {
      // -4
      arr[arr.length - 1] = null;
    }, function () {
      arr = (0, _slice.default)(arrStrings).call(arrStrings);
    }, function () {
      // 27
      arr[arr.length - 1] = defaultString;
    }, function () {
      arr = (0, _slice.default)(arrStrings).call(arrStrings);
    }, function () {
      // -7
      arr[arr.length - 1] = defaultNumber;
    }, function () {
      arr = (0, _slice.default)(arrFunctions).call(arrFunctions);
    }, function () {
      // 4
      arr[arr.length - 1] = undefined;
    }, function () {
      arr = (0, _slice.default)(arrFunctions).call(arrFunctions);
    }, function () {
      // -7
      arr[arr.length - 1] = null;
    }, function () {
      arr = (0, _slice.default)(arrFunctions).call(arrFunctions);
    }, function () {
      // 11
      arr[arr.length - 1] = defaultFunction;
    }, function () {
      arr = (0, _slice.default)(arrFunctions).call(arrFunctions);
    }, function () {
      // 27
      arr[arr.length - 1] = defaultNumber;
    }, function () {
      arr = (0, _slice.default)(arrObjects).call(arrObjects);
    }, function () {
      // 8
      arr[arr.length - 1] = undefined;
    }, function () {
      arr = (0, _slice.default)(arrObjects).call(arrObjects);
    }, function () {
      // 27
      arr[arr.length - 1] = null;
    }, function () {
      arr = (0, _slice.default)(arrObjects).call(arrObjects);
    }, function () {
      // 11
      arr[arr.length - 1] = defaultObject;
    }, function () {
      arr = (0, _slice.default)(arrObjects).call(arrObjects);
    }, function () {
      // 8
      arr[arr.length - 1] = defaultNumber;
    });
    console.log(result);
  });
  (0, _Mocha.xit)('array last index', function () {
    this.timeout(300000);

    function defaultCompare(o1, o2) {
      return o1 === o2;
    }

    function lastIndexOf1(array, value, compare) {
      if (!compare) {
        compare = defaultCompare;
      }

      var i = 0;
      var len = array.length;
      var ind = -1;

      while (i !== len) {
        if (compare(array[i], value)) {
          ind = i;
        }

        i++;
      }

      return ind;
    }

    function lastIndexOf2(array, value, compare) {
      if (!compare) {
        compare = defaultCompare;
      }

      var i = array.length;

      while (i !== 0) {
        if (compare(array[i], value)) {
          return i;
        }

        i--;
      }

      return -1;
    }

    var arr = generateArray(10000);
    var result = (0, _rdtsc.calcPerformance)(10000, function () {// no operations
    }, function () {
      return lastIndexOf1(arr, 5000);
    }, function () {
      return lastIndexOf2(arr, 5000);
    });
    console.log(result);
  });

  function calcSortCompareCount(array, size, addArray) {
    // array.length = size
    var count = 0;

    for (var i = 0, len = addArray.length; i < len; i++) {
      array[size++] = addArray[i];
    }

    (0, _sort.default)(array).call(array, function (o1, o2) {
      count++;
      return compareDefault(o1, o2);
    }); // console.log(`${JSON.stringify(array)}`)

    return count;
  }

  function calcBinarySearchCount(array, size, addArray) {
    var count = 0;

    for (var i = 0, addLen = addArray.length; i < addLen; i++) {
      var addItem = addArray[i]; // eslint-disable-next-line no-loop-func

      var insertIndex = (0, _array.binarySearch)(array, addItem, null, size, function (o1, o2) {
        count++;
        return compareDefault(o1, o2);
      });

      if (insertIndex < 0) {
        insertIndex = ~insertIndex;
      } // insert


      for (var j = size - 1; j < size; j++) {
        array[j + 1] = array[j];
      }

      for (var _j = size - 1; _j > insertIndex; _j--) {
        array[_j] = array[_j - 1];
      }

      array[insertIndex] = addItem;
      size++;
    } // console.log(`${JSON.stringify(array)}`)


    return count;
  }

  function printSortCompareCount(array, addArray) {
    var sortCount = calcSortCompareCount(array, array.length, addArray);
    var binarySearchCount = calcBinarySearchCount(array, array.length, addArray);
    console.log(sortCount + "\t" + binarySearchCount + "\t" + (0, _stringify.default)(array) + "\t" + (0, _stringify.default)(addArray));
  }

  (0, _Mocha.xit)('sorted array add items', function () {
    var _context;

    this.timeout(300000);
    var array = [];
    var addArray = (0, _sort.default)(_context = generateArray(1000)).call(_context, function (o1, o2) {
      return Math.random() > 0.5 ? -1 : 1;
    }); // [-3, -1, -2, 1, 9, -4, 7, -6, 11]

    var resultArray; // console.log(JSON.stringify(addArray))
    // printSortCompareCount(array.slice(), addArray)

    var result = (0, _rdtsc.calcPerformance)(10000, function () {// no operations
    }, function () {
      var _context2;

      resultArray = (0, _concat.default)(_context2 = (0, _slice.default)(array).call(array)).call(_context2, (0, _map2.default)(addArray).call(addArray, function (o) {
        return 0;
      }));
    }, function () {
      return calcSortCompareCount(resultArray, array.length, addArray);
    }, function () {
      var _context3;

      resultArray = (0, _concat.default)(_context3 = (0, _slice.default)(array).call(array)).call(_context3, (0, _map2.default)(addArray).call(addArray, function (o) {
        return 0;
      }));
    }, function () {
      return calcBinarySearchCount(resultArray, array.length, addArray);
    });
    console.log(result);
  });
  (0, _Mocha.xit)('regexp', function () {
    this.timeout(300000);
    var regexp = /qwe\/wer\/ert\/rty\/tyu/;
    var path = 'qwe/wer/ert/rty/tyu';
    var wrongPath = 'wwe/wer/ert/rty/tyu';
    var checkPath = wrongPath.replace(/^w/, 'q');
    var result = (0, _rdtsc.calcPerformance)(10000, // () => {
    // 	// no operations
    // },
    function () {
      return wrongPath === checkPath;
    }, function () {
      return path === checkPath;
    }, function () {
      return regexp.test(wrongPath);
    }, function () {
      return wrongPath.match(regexp);
    }, function () {
      return regexp.test(path);
    }, function () {
      return path.match(regexp);
    });
    console.log(result);
  });
  (0, _Mocha.xit)('operations inside compare func', function () {
    this.timeout(300000);

    var obj = function obj() {};

    var obj2 = {};
    var result = (0, _rdtsc.calcPerformance)(60000, function () {// no operations
    }, function () {
      return obj === obj2;
    }, // -11
    function () {
      return typeof obj === 'undefined';
    }, // -7
    function () {
      return obj === null;
    }, // -7
    function () {
      return obj.valueOf();
    }, // 16
    function () {
      return typeof obj === 'number';
    }, // -7
    function () {
      return typeof obj === 'boolean';
    }, // -8
    function () {
      return typeof obj === 'string';
    }, // -7
    function () {
      return typeof obj2 === 'function';
    }, // -7
    function () {
      return typeof obj.valueOf() === 'number';
    }, // -7
    function () {
      return typeof obj.valueOf() === 'boolean';
    }, // -8
    function () {
      return typeof obj.valueOf() === 'string';
    }, // -7
    function () {
      return typeof obj2.valueOf() === 'function';
    }, // -7
    function () {
      return (0, _objectUniqueId.getObjectUniqueId)(obj);
    }, // -11
    function () {
      return typeof obj === 'object';
    }, // 146
    function () {
      return typeof obj === 'symbol';
    } // 150
    );
    console.log(result);
  });
  (0, _Mocha.xit)('Set', function () {
    var _Symbol$iterator;

    var _marked = /*#__PURE__*/_regenerator.default.mark(iterate);

    this.timeout(300000);

    _Assert.assert.strictEqual(SetNative, _set.default);

    _Assert.assert.notStrictEqual(_set.default, SetPolyfill);

    var countObject = 1000;
    var objects = [];
    var clones = [];

    for (var i = 0; i < countObject; i++) {
      var _context4;

      objects[i] = [{
        value: 'text text text text text text'
      }, 10, {
        value: i
      }];
      clones[i] = (0, _slice.default)(_context4 = objects[i]).call(_context4);
      (0, _objectUniqueId.getObjectUniqueId)(objects[i]);
      (0, _objectUniqueId.getObjectUniqueId)(clones[i]);
    }

    function testSet(addObject, removeObject, getIterableAfterAdd, getIterableAfterDelete) {
      for (var _i = 0; _i < countObject; _i++) {
        addObject(objects[_i], clones[_i]);
      } // let count = 0
      // for (const value of getIterableAfterAdd()) {
      // 	count++
      // }
      // if (count !== countObject) {
      // 	throw new Error(`count(${count}) !== countObject(${countObject})`)
      // }


      for (var _i2 = 0; _i2 < countObject; _i2++) {
        // for (let i = 99; i >= 0; i--) {
        removeObject(objects[_i2], clones[_i2]);
      } // count = 0
      // for (const value of getIterableAfterDelete()) {
      // 	count++
      // }
      // if (count !== 0) {
      // 	throw new Error(`count(${count}) !== 0`)
      // }

    } // const set1 = new Set()
    // const set2 = {}
    // const set3 = []


    var emptyArray = [];

    function testEmpty() {
      testSet(function (o) {}, function (o) {}, function () {
        return objects;
      }, function () {
        return emptyArray;
      }); // assert.strictEqual(set1.size, 0)
    }

    function testSetNative() {
      var set = new SetNative();
      testSet(function (o) {
        return set.add(o);
      }, function (o) {
        return set.delete(o);
      }, function () {
        return set;
      }, function () {
        return set;
      }); // assert.strictEqual(set1.size, 0)
    }

    function testWeakSetNative() {
      var set = new _weakSet.default();
      testSet(function (o) {
        return set.add(o);
      }, function (o) {
        return set.delete(o);
      }, function () {
        return set;
      }, function () {
        return set;
      }); // assert.strictEqual(set1.size, 0)
    }

    function testObject() {
      var set = {};
      testSet(function (o) {
        return set[(0, _objectUniqueId.getObjectUniqueId)(o)] = o;
      }, function (o) {
        return delete set[(0, _objectUniqueId.getObjectUniqueId)(o)];
      }, function (o) {
        return (0, _values2.default)(set);
      }, function (o) {
        return (0, _values2.default)(set);
      }); // assert.strictEqual(Object.keys(set).length, 0)
    }

    function testArrayHashTable() {
      var set = [];
      testSet(function (o) {
        return set[(0, _objectUniqueId.getObjectUniqueId)(o)] = o;
      }, function (o) {
        return delete set[(0, _objectUniqueId.getObjectUniqueId)(o)];
      }, function (o) {
        return (0, _values2.default)(set);
      }, function (o) {
        return (0, _values2.default)(set);
      }); // assert.strictEqual(set.length, 0)
    }

    function testArraySplice() {
      var set = [];
      testSet(function (o) {
        return set[set.length] = o;
      }, function (o) {
        var i = (0, _indexOf.default)(set).call(set, o);

        if (i >= 0) {
          (0, _splice.default)(set).call(set, i, 1);
        }
      }, function (o) {
        return set;
      }, function (o) {
        return set;
      }); // assert.strictEqual(set.length, 0)
    }

    function testArray() {
      var set = [];
      testSet(function (o) {
        return set[set.length] = o;
      }, function (o) {
        var i = (0, _indexOf.default)(set).call(set, o);

        if (i >= 0) {
          set[i] = set[set.length - 1];
          set.length--;
        }
      }, function (o) {
        return set;
      }, function (o) {
        return set;
      }); // assert.strictEqual(set.length, 0)
    }

    function testArrayKeepOrder() {
      var set = [];
      testSet(function (o) {
        return set[set.length] = o;
      }, function (o) {
        var i = (0, _indexOf.default)(set).call(set, o);

        if (i >= 0) {
          var len = set.length;

          for (var j = i + 1; j < len; j++) {
            set[j - 1] = set[j];
          }

          set.length = len - 1;
        }
      }, function (o) {
        return set;
      }, function (o) {
        return set;
      }); // assert.strictEqual(set.length, 0)
    }

    function testSetPolyfill() {
      // console.log(SetPolyfill.toString())
      var set = new SetPolyfill();
      testSet(function (o) {
        return set.add(o);
      }, function (o) {
        return set.delete(o);
      }, function (o) {
        return set;
      }, function (o) {
        return set;
      }); // assert.strictEqual(set.size, 0)
    }

    function testImmutableSet() {
      // console.log(ArraySet.toString())
      var set = new _immutable.Set();
      testSet(function (o, c) {
        set = set.add((0, _immutable.List)(o));
      }, function (o, c) {
        set = set.delete((0, _immutable.List)(o));
      }, function (o) {
        return set;
      }, function (o) {
        return set;
      }); // assert.strictEqual(set.size, 0)
    }

    function iterate(map) {
      var _iterator3, _step3, item;

      return _regenerator.default.wrap(function iterate$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _iterator3 = _createForOfIteratorHelperLoose((0, _values.default)(map).call(map));

            case 1:
              if ((_step3 = _iterator3()).done) {
                _context5.next = 11;
                break;
              }

              item = _step3.value;

              if (!(item instanceof _map.default)) {
                _context5.next = 7;
                break;
              }

              return _context5.delegateYield(iterate(item), "t0", 5);

            case 5:
              _context5.next = 9;
              break;

            case 7:
              _context5.next = 9;
              return item;

            case 9:
              _context5.next = 1;
              break;

            case 11:
            case "end":
              return _context5.stop();
          }
        }
      }, _marked);
    }

    _Symbol$iterator = _iterator4.default;

    var TupleSet = /*#__PURE__*/function () {
      function TupleSet() {
        (0, _classCallCheck2.default)(this, TupleSet);
        this._map = new _map.default();
      }

      (0, _createClass2.default)(TupleSet, [{
        key: "add",
        value: function add(tuple) {
          var map = this._map;

          for (var _i3 = 0, len = tuple.length; _i3 < len; _i3++) {
            var item = tuple[_i3];

            if (_i3 === len - 1) {
              map.set(item, item);
            }

            var nextMap = map.get(item);

            if (!nextMap) {
              nextMap = new _map.default();
              map.set(item, nextMap);
            }
          }
        }
      }, {
        key: "delete",
        value: function _delete(tuple) {
          var map = this._map;

          for (var _i4 = 0, len = tuple.length; _i4 < len; _i4++) {
            var item = tuple[_i4];

            if (_i4 === len - 1) {
              map.delete(item);
            }

            var nextMap = map.get(item);

            if (!nextMap) {
              return;
            }
          }
        }
      }, {
        key: _Symbol$iterator,
        value: function value() {
          return iterate(this._map);
        }
      }]);
      return TupleSet;
    }();

    function testTupleSet() {
      // console.log(ArraySet.toString())
      var set = new TupleSet();
      testSet(function (o, c) {
        return set.add(o);
      }, function (o, c) {
        return set.delete(o);
      }, function (o) {
        return set;
      }, function (o) {
        return set;
      }); // assert.strictEqual(set.size, 0)
    }

    var result = (0, _rdtsc.calcPerformance)(60000, testEmpty, testArrayHashTable, // 1.0
    testSetNative, // 1.0
    testObject, // 1.1021265644157587
    testWeakSetNative, // 1.6042837809702268
    testArraySplice, // 2.0924161982094525
    testTupleSet, // 3.2606096883892013
    testArray, // 3.645999606727277
    testSetPolyfill, // 5.62216901473616
    testArrayKeepOrder, // 7.91167557313716
    testImmutableSet // 33.87640826335392
    );
    console.log(result);
  });
  (0, _Mocha.xit)('Number toString', function () {
    this.timeout(300000);
    var numInt = 123456789;
    var numFloat = 1234.56789;
    var str = '1234.56789_';
    var result = (0, _rdtsc.calcPerformance)(60000, function () {// no operations
    }, function () {
      return str + 99;
    }, function () {
      return numInt.toString(10);
    }, function () {
      return numInt.toString(16);
    }, function () {
      return numInt.toString(36);
    }, function () {
      return numFloat.toString(10);
    }, function () {
      return numFloat.toString(16);
    }, function () {
      return numFloat.toString(36);
    });
    console.log(result);
  });
  (0, _Mocha.xit)('hasOwnProperty', function () {
    this.timeout(300000);
    var object = {
      property: true
    };
    var child = (0, _create.default)(object);
    var result = (0, _rdtsc.calcPerformance)(60000, function () {// no operations
    }, function () {
      return Object.prototype.hasOwnProperty.call(object, 'property');
    }, function () {
      return object.hasOwnProperty('property');
    }, function () {
      return Object.prototype.hasOwnProperty.call(child, 'property');
    }, function () {
      return child.hasOwnProperty('property');
    });
    console.log(result);
  });
  (0, _Mocha.xit)('setTimeout', function () {
    this.timeout(300000);

    var func = function func() {};

    var timerId;
    var result = (0, _rdtsc.calcPerformance)(10000, function () {// no operations
    }, function () {
      return timerId = (0, _setTimeout2.default)(func, 1000);
    }, function () {
      return clearTimeout(timerId);
    });
    console.log(result);
  });
  (0, _Mocha.xit)('Math.max()', function () {
    var _this = this;

    this.timeout(300000);

    var func = function func() {};

    var timerId;
    this.value1 = 0;
    this.value2 = 1;
    this.value3 = 2;
    var value1 = this.value1,
        value2 = this.value2,
        value3 = this.value3;
    var result = (0, _rdtsc.calcPerformance)(10000, function () {// no operations
    }, function () {
      return Math.max(_this.value1, _this.value2, _this.value3);
    }, function () {
      return Math.max(value1, value2, value3);
    });
    console.log(result);
  });
  (0, _Mocha.xit)('"out" vs "set func" params', function () {
    var _this2 = this;

    this.timeout(300000);

    var funcOut = function funcOut(a, out) {
      out[0] = a;
      return Math.random() !== 0.5;
    };

    var funcSet = function funcSet(a, set) {
      if (Math.random() !== 0.5) {
        set(a);
      }

      return a;
    };

    var out = [];
    var result = (0, _rdtsc.calcPerformance)(120000, function () {// no operations
    }, function () {
      var out0 = [];

      if (funcOut(Math.random(), out0)) {
        _this2.prop = out0[0];
      }
    }, function () {
      if (funcOut(Math.random(), out)) {
        _this2.prop = out[0];
      }
    }, function () {
      funcSet(Math.random(), function (a) {
        _this2.prop = a;
      });
    });
    console.log(result);
  });
  (0, _Mocha.xit)('func params as object', function () {
    var _arguments = arguments;
    this.timeout(300000);

    var funcSimple = function funcSimple(param0, param1, param2, param3) {
      return param0 || param1 || param2 || param3;
    };

    var funcObjectParams = function funcObjectParams(_temp) {
      var _ref2 = _temp === void 0 ? {} : _temp,
          param0 = _ref2.param0,
          param1 = _ref2.param1,
          param2 = _ref2.param2,
          param3 = _ref2.param3;

      return param0 || param1 || param2 || param3;
    };

    var funcObjectParamsBabel = function funcObjectParamsBabel() {
      // eslint-disable-next-line one-var
      var _ref = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : {},
          param0 = _ref.param0,
          param1 = _ref.param1,
          param2 = _ref.param2,
          param3 = _ref.param3;

      return param0 || param1 || param2 || param3;
    };

    var result = (0, _rdtsc.calcPerformance)(120000, function () {// no operations
    }, function () {
      funcSimple(Math.random() < 0.5, Math.random() < 0.5, Math.random() < 0.5, Math.random() < 0.5);
    }, function () {
      funcObjectParams({
        param0: Math.random() < 0.5,
        param1: Math.random() < 0.5,
        param2: Math.random() < 0.5,
        param3: Math.random() < 0.5
      });
    }, function () {
      // @ts-ignore
      funcObjectParamsBabel({
        param0: Math.random() < 0.5,
        param1: Math.random() < 0.5,
        param2: Math.random() < 0.5,
        param3: Math.random() < 0.5
      });
    });
    console.log(result);
  });
  (0, _Mocha.xit)('new Array(size)', function () {
    this.timeout(300000);
    var size = 1000;
    var arrSimple = [];
    var arrConstructor = new Array(size);
    var arrConstructorFilled = new Array(size);

    for (var _i5 = 0; _i5 < size; _i5++) {
      arrSimple[_i5] = undefined;
      arrConstructorFilled[_i5] = undefined;
    }

    var i = size / 2 | 0;
    var result = (0, _rdtsc.calcPerformance)(120000, function () {// no operations
    }, function () {
      arrSimple[i] = i;
      i = (i + 7) % size;
      return arrSimple[i];
    }, function () {
      arrConstructorFilled[i] = i;
      i = (i + 7) % size;
      return arrConstructorFilled[i];
    }, function () {
      arrConstructor[i] = i;
      i = (i + 7) % size;
      return arrConstructor[i];
    });
    console.log(result);
  });

  function defineProperty(obj, propertyName) {
    obj[propertyName] = 0;
    (0, _defineProperty.default)(obj, propertyName, {
      configurable: true,
      enumerable: false,
      writable: true,
      value: 0
    });
  }

  function definePropertyGetSet(obj, propertyName) {
    obj[propertyName] = 0;
    (0, _defineProperty.default)(obj, propertyName, {
      configurable: true,
      enumerable: false,
      get: function get() {
        return 0;
      },
      set: function set(o) {}
    });
  }

  (0, _Mocha.xit)('delete property', function () {
    this.timeout(300000);
    var hashTable = {};

    for (var i = 0; i < 10000; i++) {
      hashTable[i] = i;
    }

    var obj = {};
    var result = (0, _rdtsc.calcPerformance)(20000, function () {// no operations
    }, function () {
      // 154
      obj.x = 0;
    }, function () {
      // 46
      obj.x = void 0;
    }, function () {
      // 108
      delete obj.x;
    }, function () {
      // 92
      hashTable[Math.random() * 10000 | 0] = void 0;
    }, function () {
      // 395
      delete hashTable[Math.random() * 10000 | 0];
    }, function () {
      // 2320
      (0, _objectUniqueId.getObjectUniqueId)({});
    }, function () {
      // 1507
      defineProperty(obj, 'x');
    }, function () {
      // 58
      obj.x = void 0;
    }, function () {
      // 108
      delete obj.x;
    }, function () {
      // 1860
      definePropertyGetSet(obj, 'x');
    }, function () {
      // 909
      obj.x = void 0;
    }, function () {
      // 119
      delete obj.x;
    }, function () {
      // 5
      return {};
    });
    console.log(result);
  });
  (0, _Mocha.xit)('Promise sync', function () {
    this.timeout(300000);
    var result = (0, _rdtsc.calcPerformance)(20000, function () {// no operations
    }, function () {
      var resolve;
      new _ThenableSync.ThenableSync(function (o) {
        resolve = o;
      }).then(function (o) {
        return true;
      }); // .then(o => true)

      resolve(1);
    }, function () {
      var resolve;
      var result;
      new _ThenableSync.ThenableSync(function (o) {
        resolve = o;
      }).then(function (o) {
        return true;
      }).then(function (o) {
        return result = o;
      });
      resolve(1);
    });
    console.log(result);
  });
  (0, _Mocha.xit)('is iterable', function () {
    var _iterable;

    this.timeout(300000);
    var iterable = true;
    var iterable2 = (_iterable = {}, _iterable[_iterator4.default] = /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var i;
      return _regenerator.default.wrap(function _callee$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              i = 0;

            case 1:
              if (!(i < 100)) {
                _context6.next = 7;
                break;
              }

              if (!(Math.random() > 1)) {
                _context6.next = 4;
                break;
              }

              return _context6.abrupt("return", 2);

            case 4:
              i++;
              _context6.next = 1;
              break;

            case 7:
              _context6.next = 9;
              return 1;

            case 9:
              return _context6.abrupt("return", 0);

            case 10:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee);
    }), _iterable);
    var result = (0, _rdtsc.calcPerformance)(20000, function () {// no operations
    }, // () => {
    // 	return iterable && Symbol.iterator in iterable
    // },
    // () => {
    // 	return iterable != null && Symbol.iterator in iterable
    // },
    function () {
      // 0
      return iterable && typeof (0, _getIteratorMethod2.default)(iterable) === 'function';
    }, function () {
      // 0
      return iterable != null && typeof (0, _getIteratorMethod2.default)(iterable) === 'function';
    }, function () {
      // 100
      return iterable && (0, _isIterable2.default)(Object(iterable));
    }, function () {
      // 100
      return iterable != null && (0, _isIterable2.default)(Object(iterable));
    }, function () {
      // 0
      return (0, _helpers.isIterable)(iterable);
    });
    console.log(result);
  });
  (0, _Mocha.xit)('array is associative', function () {
    this.timeout(300000);
    var arr = [];

    for (var i = 0; i < 1000; i++) {
      arr[i] = i;
    }

    var result = (0, _rdtsc.calcPerformance)(2000, function () {// no operations
    }, function () {
      return arr.length === (0, _keys.default)(arr).length;
    });
    console.log(result);
  });
  (0, _Mocha.xit)('Object.freeze', function () {
    this.timeout(300000);
    var result = (0, _rdtsc.calcPerformance)(2000, // () => {
    // 	// no operations
    // },
    function () {
      var x = {};
      return x;
    }, function () {
      var x = {};
      (0, _freeze.default)(x);
    }, function () {
      var x = {};
      (0, _objectUniqueId.getObjectUniqueId)(x);
      (0, _freeze.default)(x);
    }, function () {
      var x = {};
      (0, _objectUniqueId.freezeWithUniqueId)(x);
    });
    console.log(result);
  });
  (0, _Mocha.xit)('defineProperty', function () {
    this.timeout(300000);
    var hashTable = {};

    for (var i = 0; i < 10000; i++) {
      hashTable[i] = i;
    }

    var Class = /*#__PURE__*/function () {
      function Class() {
        (0, _classCallCheck2.default)(this, Class);
      }

      (0, _createClass2.default)(Class, [{
        key: "value",
        get: function get() {
          return this._field;
        },
        set: function set(value) {
          this._field = value;
        }
      }]);
      return Class;
    }();

    var obj = new Class();
    (0, _defineProperty.default)(obj, 'manual', {
      configurable: true,
      enumerable: true,
      get: function get() {
        return this._manual;
      },
      set: function set(value) {
        this._manual = value;
      }
    });
    (0, _defineProperty.default)(obj, 'hidden', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: 0
    });
    var result = (0, _rdtsc.calcPerformance)(120000, function () {
      return Math.random() && 1;
    }, function () {
      obj.x = Math.random(); // 0
    }, function () {
      return Math.random() && obj.x; // 4
    }, function () {
      obj.value = Math.random(); // 4
    }, function () {
      return Math.random() && obj.value; // 11
    }, function () {
      obj.manual = Math.random(); // 0
    }, function () {
      return Math.random() && obj.manual; // 27
    }, function () {
      obj.hidden = Math.random(); // 27
    }, function () {
      return Math.random() && obj.hidden; // 27
    });
    console.log(result);
  });
  (0, _Mocha.it)('try catch', function () {
    this.timeout(300000);

    function tryCatch(func, onValue, onError) {
      var value;

      try {
        value = func();
      } catch (err) {
        onError(err);
        return true;
      }

      if (onValue) {
        onValue(value);
      }

      return false;
    }

    function func() {
      if (Math.random() === 0) {
        throw 0;
      }

      return 1;
    }

    var result = (0, _rdtsc.calcPerformance)(20000, // () => {
    // 	// no operations
    // },
    function () {
      if (Math.random() === 0) {
        return 0;
      }

      return 1;
    }, function () {
      if (Math.random() === 0) {
        throw 0;
      }

      return 1;
    }, function () {
      return func();
    }, function () {
      try {
        if (Math.random() === 0) {
          throw 0;
        }

        return 1;
      } catch (e) {
        return e;
      }
    }, function () {
      try {
        return func();
      } catch (e) {
        return e;
      }
    }, function () {
      if (tryCatch(function () {
        return func();
      }, function () {}, function () {})) {
        return 0;
      }
    });
    console.log(result);
  });
  (0, _Mocha.xit)('ThenableSync', function () {
    this.timeout(300000);

    var rejected = _ThenableSync.ThenableSync.createRejected(1);

    var resolved = _ThenableSync.ThenableSync.createResolved(1);

    var result = (0, _rdtsc.calcPerformance)(120000, function () {// no operations
    }, function () {
      // 157
      return (0, _async.resolveValue)(1, function () {}, function () {});
    }, function () {
      // 767
      return (0, _async.resolveValue)(resolved, function () {}, function () {});
    }, function () {
      // 835
      return (0, _async.resolveValue)(rejected, function () {}, function () {});
    }, function () {
      // 563
      return (0, _ThenableSync.resolveAsync)(1, function () {}, function () {}, true);
    }, function () {
      // 1192
      return (0, _ThenableSync.resolveAsync)(resolved, function () {}, function () {}, true);
    }, function () {
      // 1192
      return (0, _ThenableSync.resolveAsync)(rejected, function () {}, function () {}, true);
    }, function () {
      // 533
      return resolved.then(function () {}, function () {});
    }, function () {
      // 636
      return rejected.then(function () {}, function () {});
    }, function () {
      // 463
      return resolved.thenLast(function () {}, function () {});
    }, function () {
      // 494
      return rejected.thenLast(function () {}, function () {});
    });
    console.log(result);
  });

  function calcCountPerSecond(func, maxTime) {
    if (maxTime === void 0) {
      maxTime = 10000;
    }

    var time0 = (0, _now.default)();
    var time;
    var count = 0;
    var result = 0;

    do {
      result += (0, _ThenableSync.resolveAsync)(func());
      count++;
    } while ((time = (0, _now.default)() - time0) < maxTime);

    return count / (time / 1000);
  }

  function calcCountPerSecondAsync(_x2, _x3) {
    return _calcCountPerSecondAsync.apply(this, arguments);
  }

  function _calcCountPerSecondAsync() {
    _calcCountPerSecondAsync = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(func, maxTime) {
      var time0, time, count, result;
      return _regenerator.default.wrap(function _callee6$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              if (maxTime === void 0) {
                maxTime = 10000;
              }

              time0 = (0, _now.default)();
              count = 0;
              result = 0;

            case 4:
              _context12.t0 = result;
              _context12.next = 7;
              return func();

            case 7:
              result = _context12.t0 += _context12.sent;
              count++;

            case 9:
              if ((time = (0, _now.default)() - time0) < maxTime) {
                _context12.next = 4;
                break;
              }

            case 10:
              return _context12.abrupt("return", count / (time / 1000));

            case 11:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee6);
    }));
    return _calcCountPerSecondAsync.apply(this, arguments);
  }

  (0, _Mocha.xit)('ThenableSync 2', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
    var _marked2, nestedPromise, _nestedPromise, nestedIterator;

    return _regenerator.default.wrap(function _callee5$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            nestedIterator = function _nestedIterator() {
              return _regenerator.default.wrap(function nestedIterator$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      _context8.next = 2;
                      return 1;

                    case 2:
                      _context8.next = 4;
                      return 2;

                    case 4:
                      _context8.next = 6;
                      return 3;

                    case 6:
                      _context8.next = 8;
                      return 4;

                    case 8:
                      _context8.next = 10;
                      return 5;

                    case 10:
                      _context8.next = 12;
                      return 6;

                    case 12:
                    case "end":
                      return _context8.stop();
                  }
                }
              }, _marked2);
            };

            _nestedPromise = function _nestedPromise3() {
              _nestedPromise = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
                return _regenerator.default.wrap(function _callee4$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        _context10.next = 2;
                        return 1;

                      case 2:
                        _context10.next = 4;
                        return 2;

                      case 4:
                        _context10.next = 6;
                        return 3;

                      case 6:
                        _context10.next = 8;
                        return 4;

                      case 8:
                        _context10.next = 10;
                        return 5;

                      case 10:
                        _context10.next = 12;
                        return 6;

                      case 12:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee4);
              }));
              return _nestedPromise.apply(this, arguments);
            };

            nestedPromise = function _nestedPromise2() {
              return _nestedPromise.apply(this, arguments);
            };

            _marked2 = /*#__PURE__*/_regenerator.default.mark(nestedIterator);
            this.timeout(300000);
            _context11.t0 = console;
            _context11.next = 8;
            return calcCountPerSecondAsync( /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
              return _regenerator.default.wrap(function _callee2$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      _context7.next = 2;
                      return 1;

                    case 2:
                      _context7.next = 4;
                      return 2;

                    case 4:
                      _context7.next = 6;
                      return 3;

                    case 6:
                      _context7.next = 8;
                      return 4;

                    case 8:
                      _context7.next = 10;
                      return 5;

                    case 10:
                      _context7.next = 12;
                      return 6;

                    case 12:
                      _context7.next = 14;
                      return nestedPromise();

                    case 14:
                    case "end":
                      return _context7.stop();
                  }
                }
              }, _callee2);
            })));

          case 8:
            _context11.t1 = _context11.sent;

            _context11.t0.log.call(_context11.t0, 'async/await: ', _context11.t1);

            console.log('ThenableSync: ', calcCountPerSecond( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
              return _regenerator.default.wrap(function _callee3$(_context9) {
                while (1) {
                  switch (_context9.prev = _context9.next) {
                    case 0:
                      _context9.next = 2;
                      return 1;

                    case 2:
                      _context9.next = 4;
                      return 2;

                    case 4:
                      _context9.next = 6;
                      return 3;

                    case 6:
                      _context9.next = 8;
                      return 4;

                    case 8:
                      _context9.next = 10;
                      return 5;

                    case 10:
                      _context9.next = 12;
                      return 6;

                    case 12:
                      _context9.next = 14;
                      return nestedIterator();

                    case 14:
                    case "end":
                      return _context9.stop();
                  }
                }
              }, _callee3);
            })));

          case 11:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee5, this);
  }))); // xit('decorators', function() {
  // 	this.timeout(300000)
  //
  // 	function decoratorOwn() {
  // 		return descriptor => {
  // 			descriptor.placement = 'own'
  // 		}
  // 	}
  //
  // 	function decoratorPrototype() {
  // 		return descriptor => {
  // 			descriptor.placement = 'prototype'
  // 		}
  // 	}
  //
  // 	class Class {
  // 		public x: any
  // 	}
  //
  // 	class ClassOwn {
  // 		@decoratorOwn()
  // 		public x: any
  // 	}
  //
  // 	class ClassPrototype {
  // 		@decoratorPrototype()
  // 		public x: any
  // 	}
  //
  // 	const result = calcPerformance(
  // 		120000,
  // 		() => {
  // 			// no operations
  // 		},
  //
  // 		() => { // 4
  // 			return new Class()
  // 		},
  // 		() => { // 1400
  // 			return new ClassOwn()
  // 		},
  // 		() => { // 54
  // 			return new ClassPrototype()
  // 		},
  // 	)
  //
  // 	console.log(result)
  // })

  (0, _Mocha.xit)('Resolve properties path', function () {
    this.timeout(300000);

    var ResolvePropertiesPath = /*#__PURE__*/function () {
      function ResolvePropertiesPath(value) {
        (0, _classCallCheck2.default)(this, ResolvePropertiesPath);
        this.value = value;
      }

      (0, _createClass2.default)(ResolvePropertiesPath, [{
        key: "get",
        value: function get(key) {
          var value = this.value;

          if (value != null) {
            this.value = value = value[key];
          }

          return this;
        }
      }]);
      return ResolvePropertiesPath;
    }();

    function get(getValue) {
      get.value = getValue(get.value);
      return get;
    }

    function resolvePropertiesPath(value) {
      get.value = value;
      return get;
    }

    var object = {
      a: {
        b: {
          c: {
            d: {
              e: {},
              f: 1
            }
          }
        }
      }
    };
    var result = (0, _rdtsc.calcPerformance)(120000, function () {// no operations
    }, function () {
      // 4
      return object.a.b.c.d.e;
    }, function () {
      // 4
      var value = object;
      value = value.a;
      value = value.b;
      value = value.c;
      value = value.d;
      value = value.e;
      return value;
    }, function () {
      // 307
      return new ResolvePropertiesPath(object).get('a').get('b').get('c').get('d').get('e').value;
    }, function () {
      // 31
      return resolvePropertiesPath(object)(function (o) {
        return o.a;
      })(function (o) {
        return o.b;
      })(function (o) {
        return o.c;
      })(function (o) {
        return o.d;
      })(function (o) {
        return o.e;
      }).value;
    });
    console.log(result);
  });
  (0, _Mocha.xit)('ObservableObjectTest', function () {
    this.timeout(300000);
    var withOptimization = true;
    var optimizationAfter = 100;

    var ObservableObjectTest = function ObservableObjectTest() {
      (0, _classCallCheck2.default)(this, ObservableObjectTest);
      this.__fields = {};
    };

    function createGetFunction(propertyName, setOptimizedFunc) {
      var count = 0;

      function func() {
        if (++count > optimizationAfter) {
          var newFunc = Function('return this.__fields["' + propertyName + '"]');
          setOptimizedFunc(newFunc);
          return newFunc.call(this);
        }

        return this.__fields[propertyName];
      }

      return function () {
        return func.call(this);
      };
    }

    function createSetFunction(propertyName) {
      var count = 0;

      var _func = function func(o, v) {
        if (++count > optimizationAfter) {
          _func = Function('o', 'v', 'o["' + propertyName + '"] = v');

          _func(o, v);

          return;
        }

        o[propertyName] = v;
      };

      return function (o, v) {
        _func(o, v);
      };
    }

    var getValueBase = Function('name', 'object', 'return object.__fields[name]');

    var ObservableObjectBuilderTest = /*#__PURE__*/function () {
      function ObservableObjectBuilderTest(object) {
        (0, _classCallCheck2.default)(this, ObservableObjectBuilderTest);
        this.object = object || new ObservableObjectTest();
      }

      (0, _createClass2.default)(ObservableObjectBuilderTest, [{
        key: "writable",
        value: function writable(name) {
          var getValue = (0, _helpers.createFunction)(function () {
            return function () {
              return this.__fields[name];
            };
          }, 'o', "return o.__fields[\"" + name + "\"]");
          var setValue = (0, _helpers.createFunction)(function () {
            return function (v) {
              this.__fields[name] = v;
            };
          }, 'o', 'v', "o.__fields[\"" + name + "\"] = v"); // let getValue = createGetFunction(name, o => { getValue = o as any }) as (o: { [newProp in Name]: T }) => T
          // const getValue = getValueBase.bind(null, name)
          // const setValue = createSetFunction(name) as (o: { [newProp in Name]: T }, v: T) => void

          if (withOptimization) {
            (0, _defineProperty.default)(ObservableObjectTest.prototype, name, {
              configurable: true,
              enumerable: true,
              get: function get() {
                return getValue(this);
              },
              set: function set(newValue) {
                setValue(this, newValue);
              }
            });
          } else {
            (0, _defineProperty.default)(ObservableObjectTest.prototype, name, {
              configurable: true,
              enumerable: true,
              get: function get() {
                return this.__fields[name];
              },
              set: function set(newValue) {
                this.__fields[name] = newValue;
              }
            });
          }

          return this;
        }
      }]);
      return ObservableObjectBuilderTest;
    }();

    new ObservableObjectBuilderTest(ObservableObjectTest.prototype).writable('prop') // , o => o.prop, (o, v) => o.prop = v)
    .writable('prop2'); // , o => o.prop2, (o, v) => o.prop2 = v)

    var observableObject1 = new ObservableObjectTest();
    var observableObject2 = new ObservableObjectTest();
    var object1 = {
      prop: void 0,
      prop2: void 0
    };
    var object2 = {
      prop: void 0,
      prop2: void 0
    };
    var value = -2000000000;
    object1.prop = value++;
    object1.prop2 = value++;
    object2.prop = value++;
    object2.prop2 = value++;
    observableObject1.prop = value++;
    observableObject1.prop2 = value++;
    observableObject2.prop = value++;
    observableObject2.prop2 = value++;
    var result = (0, _rdtsc.calcPerformance)(20000, function () {
      // no operations
      value++;
    }, function () {
      // 8
      object1.prop = value++;
      object1.prop2 = value++;
      object2.prop = value++;
      object2.prop2 = value++;
    }, function () {
      // 11
      return object1.prop && object1.prop2 && object2.prop && object2.prop2;
    }, function () {
      // 27
      observableObject1.prop = value++;
      observableObject1.prop2 = value++;
      observableObject2.prop = value++;
      observableObject2.prop2 = value++;
    }, function () {
      // 8
      return observableObject1.prop && observableObject1.prop2 && observableObject1.prop && observableObject2.prop2;
    });
    console.log(result);
  });
  (0, _Mocha.xit)('pass arguments', function () {
    this.timeout(300000);

    function _x(a, b, c, d) {
      return a + b + c;
    }

    function x() {
      return _x.apply(null, arguments);
    }

    var args = [];

    for (var i = 0; i < 1000; i++) {
      args[i] = i;
    }

    var y = new Function('f', 'return function() { return f(' + (0, _map2.default)(args).call(args, function (o) {
      return 'arguments[' + o + ']';
    }).join(', ') + ') }')(_x);
    var run = new Function('f', 'return f(' + args.join(', ') + ')');

    for (var _i6 = 0; _i6 < 1000; _i6++) {
      run(x);
      run(y);
    }

    var res;
    var result = (0, _rdtsc.calcPerformance)(10000, function () {// no operations
    }, function () {
      res = run(x);
    }, function () {
      res = run(y);
    });
    console.log(result);
  });
  (0, _Mocha.it)('new Array', function () {
    this.timeout(300000);
    var arr1 = [];
    var arr2 = new Array(12);

    for (var i = 0; i < 10; i++) {
      arr1[i] = i;
      arr2[i] = i;
    }

    var index = 0;
    var res;
    var result = (0, _rdtsc.calcPerformance)(120000, function () {// no operations
    }, function () {
      res = arr1[index++ % 10];
    }, function () {
      res = arr2[index++ % 10];
    });
    console.log(result);
  });
});