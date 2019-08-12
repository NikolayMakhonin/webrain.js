import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _typeof from "@babel/runtime/helpers/typeof";

/* tslint:disable:prefer-const no-identical-functions no-empty no-shadowed-variable */

/* tslint:disable:no-var-requires one-variable-per-declaration */

/* eslint-disable no-new-func,no-array-constructor,object-property-newline,no-undef */

/* eslint-disable no-empty,no-shadow,no-prototype-builtins,prefer-destructuring */

/* eslint-disable prefer-rest-params,arrow-body-style */
import { calcPerformance } from 'rdtsc';
import { SynchronousPromise } from 'synchronous-promise';
import { isIterable } from '../../../main/common/helpers/helpers';
import { ThenableSync } from '../../../main/common/helpers/ThenableSync';
import { ArraySet } from '../../../main/common/lists/ArraySet';
import { binarySearch } from '../../../main/common/lists/helpers/array';
import { freezeWithUniqueId, getObjectUniqueId } from '../../../main/common/lists/helpers/object-unique-id';
import { SortedList } from '../../../main/common/lists/SortedList';
import { createObject, Tester } from '../../tests/common/main/rx/deep-subscribe/helpers/Tester';
var SetNative = Set;

require('./src/SetPolyfill');

export function compareDefault(o1, o2) {
  if (o1 > o2) {
    return 1;
  }

  if (o2 > o1) {
    return -1;
  }

  return 0;
}
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
  xit('lambda vs function', function () {
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
  xit('lazy function parameters', function () {
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

    var result = calcPerformance(60000, function () {// no operations
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

  xit('array decrease length', function () {
    this.timeout(300000);
    var arr = generateArray(10000);
    var arr2;
    var result = calcPerformance(60000, function () {// no operations
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2.splice(arr2.length - 1, 1); // 1368
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2.length--; // 698
    }, function () {
      arr2 = arr.slice();
    }, function () {
      delete arr2[arr2.length - 1]; // 291
    });
    console.log(result);
  });
  xit('array decrease length 100', function () {
    this.timeout(300000);
    var arr = generateArray(10000);
    var arr2;
    var result = calcPerformance(60000, function () {// no operations
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2.splice(arr2.length - 100, 100); // 3465
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2.length -= 100; // 690
    });
    console.log(result);
  });
  xit('array increase length', function () {
    this.timeout(300000);
    var arr = generateArray(10000);
    var arr2;
    var result = calcPerformance(60000, function () {// no operations
    }, function () {
      arr2 = arr.slice();
    }, function () {
      // 80803
      var clone = new Array(arr2.length + 1);
      copyToArray(arr2, clone);
      arr2 = clone;
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2[arr2.length] = arr2.length; // 34189
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2.push(arr2.length); // 34048
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2.length++; // 137850
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2.splice(arr2.length, 0, arr2.length); // 138119
    });
    console.log(result);
  });
  xit('array increase length 100', function () {
    this.timeout(300000);
    var arr = generateArray(10000);
    var arr2;
    var result = calcPerformance(60000, function () {// no operations
    }, function () {
      arr2 = arr.slice();
    }, function () {
      // 81010
      var clone = new Array(arr2.length + 100);
      copyToArray(arr2, clone);
      arr2 = clone;
    }, function () {
      arr2 = arr.slice();
    }, function () {
      arr2.length += 100; // 137800
    }, function () {
      arr2 = arr.slice();
    }, function () {
      // 35132
      for (var i = 0; i < 100; i++) {
        arr2.push(0);
      }
    }, function () {
      arr2 = arr.slice();
    }, function () {
      // 35581
      for (var i = arr2.length, end = i + 100; i < end; i++) {
        arr2[i] = 0;
      }
    });
    console.log(result);
  });
  xit('array default value', function () {
    this.timeout(300000);
    var arrNumbers = generateArray(10);
    var arrStrings = arrNumbers.map(function (o) {
      return o.toString();
    });
    var arrFunctions = arrNumbers.map(function (o) {
      return function () {
        return o.toString();
      };
    });
    var arrObjects = arrNumbers.map(function (o) {
      return {
        o: o
      };
    });
    var defaultNumber = 0;
    var defaultString = '';
    var defaultFunction = new Function();
    var defaultObject = {};
    var arr;
    var result = calcPerformance(180000, function () {// no operations
    }, function () {
      arr = arrNumbers.slice();
    }, function () {
      // 31
      arr[arr.length - 1] = undefined;
    }, function () {
      arr = arrNumbers.slice();
    }, function () {
      // 4
      arr[arr.length - 1] = null;
    }, function () {
      arr = arrNumbers.slice();
    }, function () {
      // -11
      arr[arr.length - 1] = defaultNumber;
    }, function () {
      arr = arrNumbers.slice();
    }, function () {
      // 35
      arr[arr.length - 1] = defaultString;
    }, function () {
      arr = arrStrings.slice();
    }, function () {
      // 8
      arr[arr.length - 1] = undefined;
    }, function () {
      arr = arrStrings.slice();
    }, function () {
      // -4
      arr[arr.length - 1] = null;
    }, function () {
      arr = arrStrings.slice();
    }, function () {
      // 27
      arr[arr.length - 1] = defaultString;
    }, function () {
      arr = arrStrings.slice();
    }, function () {
      // -7
      arr[arr.length - 1] = defaultNumber;
    }, function () {
      arr = arrFunctions.slice();
    }, function () {
      // 4
      arr[arr.length - 1] = undefined;
    }, function () {
      arr = arrFunctions.slice();
    }, function () {
      // -7
      arr[arr.length - 1] = null;
    }, function () {
      arr = arrFunctions.slice();
    }, function () {
      // 11
      arr[arr.length - 1] = defaultFunction;
    }, function () {
      arr = arrFunctions.slice();
    }, function () {
      // 27
      arr[arr.length - 1] = defaultNumber;
    }, function () {
      arr = arrObjects.slice();
    }, function () {
      // 8
      arr[arr.length - 1] = undefined;
    }, function () {
      arr = arrObjects.slice();
    }, function () {
      // 27
      arr[arr.length - 1] = null;
    }, function () {
      arr = arrObjects.slice();
    }, function () {
      // 11
      arr[arr.length - 1] = defaultObject;
    }, function () {
      arr = arrObjects.slice();
    }, function () {
      // 8
      arr[arr.length - 1] = defaultNumber;
    });
    console.log(result);
  });
  xit('array last index', function () {
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
    var result = calcPerformance(10000, function () {// no operations
    }, function () {
      return lastIndexOf1(arr, 5000);
    }, function () {
      return lastIndexOf2(arr, 5000);
    });
    console.log(result);
  }); // xit('array capacity', function () {
  // 	this.timeout(300000)
  //
  // 	let arr
  //
  // 	const result = calcPerformance(
  // 		60000,
  // 		() => {
  // 			// no operations
  // 		},
  // 		() => { // 821
  // 			arr = [1, 2, 3, 4, 5]
  // 			arr.length = 10
  // 		},
  // 		() => {
  // 			arr.push(6) // 16
  // 		},
  // 		() => {
  // 			arr = arr.slice(5, 1) // 265
  // 		},
  // 		() => { // 737
  // 			arr = [1, 2, 3, 4, 5]
  // 			arr.length = 10
  // 		},
  // 		() => {
  // 			arr[5] = 6 // 20
  // 		},
  // 		() => {
  // 			delete arr[5] // 238
  // 		},
  // 		() => { // 74
  // 			arr = new Array(10)
  // 			copyToArray([1, 2, 3, 4, 5], arr)
  // 		},
  // 		() => {
  // 			arr.push(6) // 146
  // 		},
  // 		() => {
  // 			arr.splice(5, 1) // 771
  // 		},
  // 		() => { // 55
  // 			arr = new Array(10)
  // 			copyToArray([1, 2, 3, 4, 5], arr)
  // 		},
  // 		() => {
  // 			arr[5] = 6 // 1
  // 		},
  // 		() => {
  // 			delete arr[5] // 231
  // 		}
  // 	)
  //
  // 	console.log(result)
  // })

  function calcSortCompareCount(array, size, addArray) {
    // array.length = size
    var count = 0;

    for (var i = 0, len = addArray.length; i < len; i++) {
      array[size++] = addArray[i];
    }

    array.sort(function (o1, o2) {
      count++;
      return compareDefault(o1, o2);
    }); // console.log(`${JSON.stringify(array)}`)

    return count;
  }

  function calcBinarySearchCount(array, size, addArray) {
    var count = 0;

    for (var i = 0, addLen = addArray.length; i < addLen; i++) {
      var addItem = addArray[i]; // eslint-disable-next-line no-loop-func

      var insertIndex = binarySearch(array, addItem, null, size, function (o1, o2) {
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
    console.log("".concat(sortCount, "\t").concat(binarySearchCount, "\t").concat(JSON.stringify(array), "\t").concat(JSON.stringify(addArray)));
  }

  xit('sorted array add items', function () {
    this.timeout(300000);
    var array = [];
    var addArray = generateArray(1000).sort(function (o1, o2) {
      return Math.random() > 0.5 ? -1 : 1;
    }); // [-3, -1, -2, 1, 9, -4, 7, -6, 11]

    var resultArray; // console.log(JSON.stringify(addArray))
    // printSortCompareCount(array.slice(), addArray)

    var result = calcPerformance(10000, function () {// no operations
    }, function () {
      resultArray = array.slice().concat(addArray.map(function (o) {
        return 0;
      }));
    }, function () {
      return calcSortCompareCount(resultArray, array.length, addArray);
    }, function () {
      resultArray = array.slice().concat(addArray.map(function (o) {
        return 0;
      }));
    }, function () {
      return calcBinarySearchCount(resultArray, array.length, addArray);
    });
    console.log(result);
  });
  xit('regexp', function () {
    this.timeout(300000);
    var regexp = /qwe\/wer\/ert\/rty\/tyu/;
    var path = 'qwe/wer/ert/rty/tyu';
    var wrongPath = 'wwe/wer/ert/rty/tyu';
    var checkPath = wrongPath.replace(/^w/, 'q');
    var result = calcPerformance(10000, // () => {
    // 	// no operations
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
  xit('operations inside compare func', function () {
    this.timeout(300000);

    var obj = function obj() {};

    var obj2 = {};
    var result = calcPerformance(60000, function () {// no operations
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
      return getObjectUniqueId(obj);
    }, // -11
    function () {
      return _typeof(obj) === 'object';
    }, // 146
    function () {
      return _typeof(obj) === 'symbol';
    } // 150
    );
    console.log(result);
  });
  xit('Set', function () {
    this.timeout(300000);
    assert.strictEqual(SetNative, Set);
    assert.notStrictEqual(Set, SetPolyfill);
    var countObject = 1000;
    var objects = [];

    for (var i = 0; i < countObject; i++) {
      objects[i] = {
        value: i
      };
      getObjectUniqueId(objects[i]);
    }

    function testSet(addObject, removeObject, getIterableValues) {
      for (var _i = 0; _i < countObject; _i++) {
        addObject(objects[_i]);
      }

      for (var _i2 = 0; _i2 < countObject; _i2++) {
        // for (let i = 99; i >= 0; i--) {
        removeObject(objects[_i2]);
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = getIterableValues()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var value = _step3.value;
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
    } // const set1 = new Set()
    // const set2 = {}
    // const set3 = []


    function testSetNative() {
      var set = new SetNative();
      testSet(function (o) {
        return set.add(o);
      }, function (o) {
        return set.delete(o);
      }, function () {
        return set;
      }); // assert.strictEqual(set1.size, 0)
    }

    function testObject() {
      var set = {};
      testSet(function (o) {
        return set[getObjectUniqueId(o)] = o;
      }, function (o) {
        return delete set[getObjectUniqueId(o)];
      }, function (o) {
        return Object.values(set);
      }); // assert.strictEqual(Object.keys(set).length, 0)
    }

    function testArrayHashTable() {
      var set = [];
      testSet(function (o) {
        return set[getObjectUniqueId(o)] = o;
      }, function (o) {
        return delete set[getObjectUniqueId(o)];
      }, function (o) {
        return set;
      }); // assert.strictEqual(set.length, 0)
    }

    function testArraySplice() {
      var set = [];
      testSet(function (o) {
        return set[set.length] = o;
      }, function (o) {
        var i = set.indexOf(o);

        if (i >= 0) {
          set.splice(i, 1);
        }
      }, function (o) {
        return set;
      }); // assert.strictEqual(set.length, 0)
    }

    function testArray() {
      var set = [];
      testSet(function (o) {
        return set[set.length] = o;
      }, function (o) {
        var i = set.indexOf(o);

        if (i >= 0) {
          set[i] = set[set.length - 1];
          set.length--;
        }
      }, function (o) {
        return set;
      }); // assert.strictEqual(set.length, 0)
    }

    function testArrayKeepOrder() {
      var set = [];
      testSet(function (o) {
        return set[set.length] = o;
      }, function (o) {
        var i = set.indexOf(o);

        if (i >= 0) {
          var len = set.length;

          for (var j = i + 1; j < len; j++) {
            set[j - 1] = set[j];
          }

          set.length = len - 1;
        }
      }, function (o) {
        return set;
      }); // assert.strictEqual(set.length, 0)
    }

    function testSortedList(options) {
      var set = new SortedList(options);
      testSet(function (o) {
        return set.add(o);
      }, function (o) {
        return set.remove(o);
      }, function (o) {
        return set;
      }); // set.clear()
      // assert.strictEqual(set.size, 0)
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
      }); // assert.strictEqual(set.size, 0)
    }

    function testArraySet() {
      // console.log(ArraySet.toString())
      var set = new ArraySet();
      testSet(function (o) {
        return set.add(o);
      }, function (o) {
        return set.delete(o);
      }, function (o) {
        return set;
      }); // assert.strictEqual(set.size, 0)
    }

    var result = calcPerformance(10000, function () {// no operations
    }, testSetNative, testObject, testArrayHashTable, testArraySplice, testArray, testArrayKeepOrder, testSetPolyfill, testArraySet, function () {
      return testSortedList({
        autoSort: true,
        notAddIfExists: true,
        minAllocatedSize: 1000 // compare         : compareUniqueId

      });
    } // () => testSortedList({
    // 	autoSort        : true,
    // 	notAddIfExists  : false,
    // 	minAllocatedSize: 1000
    // }),
    // () => testSortedList({
    // 	autoSort        : false,
    // 	notAddIfExists  : false,
    // 	minAllocatedSize: 1000
    // })
    );
    console.log(result);
  });
  xit('Number toString', function () {
    this.timeout(300000);
    var numInt = 123456789;
    var numFloat = 1234.56789;
    var str = '1234.56789_';
    var result = calcPerformance(60000, function () {// no operations
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
  xit('hasOwnProperty', function () {
    this.timeout(300000);
    var object = {
      property: true
    };
    var child = Object.create(object);
    var result = calcPerformance(60000, function () {// no operations
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
  xit('deepSubscribe', function () {
    this.timeout(300000);

    var createTester = function createTester() {
      for (var _len2 = arguments.length, propertyNames = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        propertyNames[_key2] = arguments[_key2];
      }

      return new Tester({
        object: createObject().object,
        immediate: true,
        performanceTest: true
      }, function (b) {
        return b.repeat(1, 3, function (b) {
          return b.any( // b => b.propertyRegexp(/object|observableObject/),
          function (b) {
            return b.propertyNames('object', 'observableObject');
          }, function (b) {
            return b.propertyNames.apply(b, propertyNames).path(function (o) {
              return o['#'];
            });
          });
        }).path(function (o) {
          return o['#'];
        });
      }).subscribe([]).unsubscribe([]);
    };

    var testerList = createTester('list');
    var testerSet = createTester('set');
    var testerMap = createTester('map');
    var testerObservableList = createTester('observableList');
    var testerObservableSet = createTester('observableSet');
    var testerObservableMap = createTester('observableMap');
    var testerAll = createTester('list', 'set', 'map', 'observableList', 'observableSet', 'observableMap');
    var result = calcPerformance(10000, function () {// no operations
    }, function () {
      return testerList.subscribe([]);
    }, function () {
      return testerList.unsubscribe([]);
    }, function () {
      return testerSet.subscribe([]);
    }, function () {
      return testerSet.unsubscribe([]);
    }, function () {
      return testerMap.subscribe([]);
    }, function () {
      return testerMap.unsubscribe([]);
    }, function () {
      return testerObservableList.subscribe([]);
    }, function () {
      return testerObservableList.unsubscribe([]);
    }, function () {
      return testerObservableSet.subscribe([]);
    }, function () {
      return testerObservableSet.unsubscribe([]);
    }, function () {
      return testerObservableMap.subscribe([]);
    }, function () {
      return testerObservableMap.unsubscribe([]);
    }, function () {
      return testerAll.subscribe([]);
    }, function () {
      return testerAll.unsubscribe([]);
    });
    console.log(result);
  });
  xit('setTimeout', function () {
    this.timeout(300000);

    var func = function func() {};

    var timerId;
    var result = calcPerformance(10000, function () {// no operations
    }, function () {
      return timerId = setTimeout(func, 1000);
    }, function () {
      return clearTimeout(timerId);
    });
    console.log(result);
  });
  xit('Math.max()', function () {
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
    var result = calcPerformance(10000, function () {// no operations
    }, function () {
      return Math.max(_this.value1, _this.value2, _this.value3);
    }, function () {
      return Math.max(value1, value2, value3);
    });
    console.log(result);
  });
  xit('"out" vs "set func" params', function () {
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
    var result = calcPerformance(120000, function () {// no operations
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
  xit('func params as object', function () {
    var _arguments = arguments;
    this.timeout(300000);

    var funcSimple = function funcSimple(param0, param1, param2, param3) {
      return param0 || param1 || param2 || param3;
    };

    var funcObjectParams = function funcObjectParams() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
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

    var result = calcPerformance(120000, function () {// no operations
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
  xit('new Array(size)', function () {
    this.timeout(300000);
    var size = 1000;
    var arrSimple = [];
    var arrConstructor = new Array(size);
    var arrConstructorFilled = new Array(size);

    for (var _i3 = 0; _i3 < size; _i3++) {
      arrSimple[_i3] = undefined;
      arrConstructorFilled[_i3] = undefined;
    }

    var i = size / 2 | 0;
    var result = calcPerformance(120000, function () {// no operations
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
    Object.defineProperty(obj, propertyName, {
      configurable: true,
      enumerable: false,
      writable: true,
      value: 0
    });
  }

  function definePropertyGetSet(obj, propertyName) {
    obj[propertyName] = 0;
    Object.defineProperty(obj, propertyName, {
      configurable: true,
      enumerable: false,
      get: function get() {
        return 0;
      },
      set: function set(o) {}
    });
  }

  it('delete property', function () {
    this.timeout(300000);
    var hashTable = {};

    for (var i = 0; i < 10000; i++) {
      hashTable[i] = i;
    }

    var obj = {};
    var result = calcPerformance(20000, function () {// no operations
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
      getObjectUniqueId({});
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
  xit('Promise sync', function () {
    this.timeout(300000);
    var result = calcPerformance(20000, function () {// no operations
    }, function () {
      var resolve;
      new SynchronousPromise(function (o) {
        resolve = o;
      }).then(function (o) {
        return true;
      }); // .then(o => true)

      resolve(1);
    }, function () {
      var resolve;
      new ThenableSync(function (o) {
        resolve = o;
      }).then(function (o) {
        return true;
      }); // .then(o => true)

      resolve(1);
    }, function () {
      var resolve;
      var result;
      new SynchronousPromise(function (o) {
        resolve = o;
      }).then(function (o) {
        return true;
      }).then(function (o) {
        return result = o;
      });
      resolve(1);
    }, function () {
      var resolve;
      var result;
      new ThenableSync(function (o) {
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
  xit('is iterable', function () {
    this.timeout(300000);
    var iterable = true;

    var iterable2 = _defineProperty({}, Symbol.iterator,
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee() {
      var i;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              i = 0;

            case 1:
              if (!(i < 100)) {
                _context.next = 7;
                break;
              }

              if (!(Math.random() > 1)) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", 2);

            case 4:
              i++;
              _context.next = 1;
              break;

            case 7:
              _context.next = 9;
              return 1;

            case 9:
              return _context.abrupt("return", 0);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    var result = calcPerformance(20000, function () {// no operations
    }, // () => {
    // 	return iterable && Symbol.iterator in iterable
    // },
    // () => {
    // 	return iterable != null && Symbol.iterator in iterable
    function () {
      // 0
      return iterable && typeof iterable[Symbol.iterator] === 'function';
    }, function () {
      // 0
      return iterable != null && typeof iterable[Symbol.iterator] === 'function';
    }, function () {
      // 100
      return iterable && Symbol.iterator in Object(iterable);
    }, function () {
      // 100
      return iterable != null && Symbol.iterator in Object(iterable);
    }, function () {
      // 0
      return isIterable(iterable);
    });
    console.log(result);
  });
  xit('array is associative', function () {
    this.timeout(300000);
    var arr = [];

    for (var i = 0; i < 1000; i++) {
      arr[i] = i;
    }

    var result = calcPerformance(2000, function () {// no operations
    }, function () {
      return arr.length === Object.keys(arr).length;
    });
    console.log(result);
  });
  xit('Object.freeze', function () {
    this.timeout(300000);
    var result = calcPerformance(2000, // () => {
    // 	// no operations
    function () {
      var x = {};
      return x;
    }, function () {
      var x = {};
      Object.freeze(x);
    }, function () {
      var x = {};
      getObjectUniqueId(x);
      Object.freeze(x);
    }, function () {
      var x = {};
      freezeWithUniqueId(x);
    });
    console.log(result);
  });
  xit('defineProperty', function () {
    this.timeout(300000);
    var hashTable = {};

    for (var i = 0; i < 10000; i++) {
      hashTable[i] = i;
    }

    var Class =
    /*#__PURE__*/
    function () {
      function Class() {
        _classCallCheck(this, Class);
      }

      _createClass(Class, [{
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
    Object.defineProperty(obj, 'manual', {
      configurable: true,
      enumerable: true,
      get: function get() {
        return this._manual;
      },
      set: function set(value) {
        this._manual = value;
      }
    });
    Object.defineProperty(obj, 'hidden', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: 0
    });
    var result = calcPerformance(120000, function () {
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
});